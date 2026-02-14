#!/usr/bin/env python3
"""Generate and store Voyage Law 2 embeddings for MongoDB documents.

This script keeps existing embedding fields intact and writes Voyage embeddings
into separate fields:
  - case.caseEmbeddingVoyageChunks
  - legislation.legislationEmbeddingVoyageChunks
"""

import argparse
import os
from typing import Any, Dict, Iterable, List, Optional, Tuple

import certifi
import requests
from pymongo import MongoClient


DEFAULT_COLLECTIONS = ("legislation", "case")
DEFAULT_FIELD_MAP = {
    "case": "caseEmbeddingVoyageChunks",
    "legislation": "legislationEmbeddingVoyageChunks",
    "legislations": "legislationEmbeddingVoyageChunks",
}
DEFAULT_MODEL = "voyage-law-2"
DEFAULT_API_URL = "https://api.voyageai.com/v1/embeddings"
VOYAGE_MAX_ALLOWED_BATCH_TOKENS = 120000


def stringify_value(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, (str, int, float, bool)):
        return str(value)
    if hasattr(value, "isoformat"):
        try:
            return value.isoformat()
        except Exception:
            return str(value)
    return str(value)


def flatten_document(doc: Any, path: str = "", skip_fields: Optional[set] = None) -> List[str]:
    skip_fields = skip_fields or set()
    parts: List[str] = []

    if isinstance(doc, dict):
        for key, value in doc.items():
            if key in skip_fields:
                continue
            child_path = f"{path}.{key}" if path else key
            parts.extend(flatten_document(value, child_path, skip_fields))
        return parts

    if isinstance(doc, list):
        for idx, item in enumerate(doc):
            child_path = f"{path}[{idx}]"
            parts.extend(flatten_document(item, child_path, skip_fields))
        return parts

    if isinstance(doc, (bytes, bytearray)):
        return parts

    text_value = stringify_value(doc).strip()
    if not text_value:
        return parts
    if path:
        parts.append(f"{path}: {text_value}")
    else:
        parts.append(text_value)
    return parts


def build_text_blob(doc: Dict[str, Any], skip_fields: Optional[set] = None) -> str:
    return "\n".join(flatten_document(doc, skip_fields=skip_fields))


def chunked(items: List[Any], size: int) -> Iterable[List[Any]]:
    for i in range(0, len(items), size):
        yield items[i : i + size]


def estimate_tokens(text: str) -> int:
    # Conservative approximation to keep request batches under Voyage limits.
    # Over-estimating is intentional to avoid 400s from oversized batches.
    return max(1, len(text) // 2)


def split_by_token_budget(
    items: List[Dict[str, Any]],
    text_key: str,
    max_batch_tokens: int,
) -> Iterable[Tuple[List[Dict[str, Any]], List[str]]]:
    current_items: List[Dict[str, Any]] = []
    current_texts: List[str] = []
    current_tokens = 0

    for item in items:
        text = item[text_key]
        text_tokens = estimate_tokens(text)

        if current_items and current_tokens + text_tokens > max_batch_tokens:
            yield current_items, current_texts
            current_items = []
            current_texts = []
            current_tokens = 0

        if text_tokens > max_batch_tokens:
            # Still send this item alone; caller should reduce chunk size if this trips.
            yield [item], [text]
            continue

        current_items.append(item)
        current_texts.append(text)
        current_tokens += text_tokens

    if current_items:
        yield current_items, current_texts


def split_text_into_chunks(
    text: str,
    max_chars: int,
    overlap_chars: int,
    max_chunks: int,
) -> Tuple[List[str], bool]:
    if not text:
        return [], False
    if max_chars <= 0:
        return [text], False
    if overlap_chars < 0:
        overlap_chars = 0
    if overlap_chars >= max_chars:
        overlap_chars = max_chars - 1

    chunks: List[str] = []
    step = max_chars - overlap_chars
    start = 0
    text_len = len(text)
    truncated = False

    while start < text_len:
        if len(chunks) >= max_chunks:
            truncated = True
            break
        end = min(text_len, start + max_chars)
        chunk_text = text[start:end].strip()
        if chunk_text:
            chunks.append(chunk_text)
        start += step

    return chunks, truncated


def parse_collection_field_map(raw: Optional[str]) -> Dict[str, str]:
    if not raw:
        return DEFAULT_FIELD_MAP.copy()
    import json

    parsed = json.loads(raw)
    if not isinstance(parsed, dict):
        raise ValueError("--field-map must be a JSON object")
    return {str(k): str(v) for k, v in parsed.items()}


def embed_batch_voyage(
    texts: List[str],
    api_key: str,
    model: str,
    input_type: str,
    timeout_seconds: int,
    api_url: str,
) -> List[List[float]]:
    payload = {
        "model": model,
        "input": texts,
        "input_type": input_type,
    }
    response = requests.post(
        api_url,
        json=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        timeout=timeout_seconds,
    )
    if response.status_code >= 400:
        details = response.text.strip()
        raise RuntimeError(
            f"Voyage API request failed ({response.status_code}) at {api_url}: {details}"
        )
    data = response.json()
    embedding_items = data.get("data", [])
    vectors = [item["embedding"] for item in embedding_items]
    if len(vectors) != len(texts):
        raise RuntimeError(
            f"Voyage returned {len(vectors)} embeddings for {len(texts)} inputs"
        )
    return vectors


def is_voyage_batch_token_limit_error(error: Exception) -> bool:
    message = str(error).lower()
    return (
        "max allowed tokens per submitted batch" in message
        or "please lower the number of tokens in the batch" in message
    )


def embed_items_with_auto_split(
    items: List[Dict[str, Any]],
    text_key: str,
    api_key: str,
    model: str,
    input_type: str,
    timeout_seconds: int,
    api_url: str,
) -> List[List[float]]:
    texts = [item[text_key] for item in items]
    try:
        return embed_batch_voyage(
            texts=texts,
            api_key=api_key,
            model=model,
            input_type=input_type,
            timeout_seconds=timeout_seconds,
            api_url=api_url,
        )
    except RuntimeError as error:
        if not is_voyage_batch_token_limit_error(error):
            raise
        if len(items) <= 1:
            raise RuntimeError(
                "Single chunk still exceeds Voyage token constraints. "
                "Reduce --chunk-max-chars."
            ) from error

        mid = len(items) // 2
        left = embed_items_with_auto_split(
            items=items[:mid],
            text_key=text_key,
            api_key=api_key,
            model=model,
            input_type=input_type,
            timeout_seconds=timeout_seconds,
            api_url=api_url,
        )
        right = embed_items_with_auto_split(
            items=items[mid:],
            text_key=text_key,
            api_key=api_key,
            model=model,
            input_type=input_type,
            timeout_seconds=timeout_seconds,
            api_url=api_url,
        )
        return left + right


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Voyage embeddings for MongoDB collections.")
    parser.add_argument("--mongo-uri", default=os.getenv("MONGO_URI"), help="MongoDB connection URI.")
    parser.add_argument("--db-name", default=os.getenv("MONGO_DB", "apptorney"), help="MongoDB database name.")
    parser.add_argument(
        "--collections",
        default=",".join(DEFAULT_COLLECTIONS),
        help="Comma-separated collection names to process.",
    )
    parser.add_argument(
        "--field-map",
        default=os.getenv("VOYAGE_EMBEDDING_FIELD_MAP"),
        help='JSON map of collection->embedding field, e.g. {"case":"caseEmbeddingVoyage","legislation":"legislationEmbeddingVoyage"}',
    )
    parser.add_argument("--batch-size", type=int, default=16, help="Embedding batch size.")
    parser.add_argument(
        "--mongo-batch-size",
        type=int,
        default=100,
        help="MongoDB cursor batch size.",
    )
    parser.add_argument(
        "--log-every",
        type=int,
        default=100,
        help="Print progress every N processed documents.",
    )
    parser.add_argument("--limit", type=int, default=0, help="Max docs per collection (0 = no limit).")
    parser.add_argument(
        "--skip-existing",
        dest="skip_existing",
        action="store_true",
        default=True,
        help="Skip documents that already have an embedding field (default behavior).",
    )
    parser.add_argument(
        "--include-existing",
        dest="skip_existing",
        action="store_false",
        help="Regenerate embeddings even when embedding field already exists.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Compute embeddings without writing to MongoDB.")
    parser.add_argument(
        "--model-name",
        default=os.getenv("VOYAGE_EMBEDDING_MODEL", DEFAULT_MODEL),
        help="Voyage embedding model name.",
    )
    parser.add_argument(
        "--voyage-input-type",
        default=os.getenv("VOYAGE_INPUT_TYPE", "document"),
        help='Voyage input_type, usually "document" for corpus embedding.',
    )
    parser.add_argument(
        "--voyage-timeout-seconds",
        type=int,
        default=int(os.getenv("VOYAGE_TIMEOUT_SECONDS", "120")),
        help="Voyage API timeout in seconds.",
    )
    parser.add_argument(
        "--voyage-api-url",
        default=os.getenv("VOYAGE_API_URL", DEFAULT_API_URL),
        help="Voyage embeddings API URL.",
    )
    parser.add_argument(
        "--max-batch-tokens",
        type=int,
        default=int(os.getenv("VOYAGE_MAX_BATCH_TOKENS", str(VOYAGE_MAX_ALLOWED_BATCH_TOKENS))),
        help="Max estimated tokens per Voyage request batch (hard-capped at 120000).",
    )
    parser.add_argument(
        "--batch-token-safety-ratio",
        type=float,
        default=float(os.getenv("VOYAGE_BATCH_TOKEN_SAFETY_RATIO", "0.9")),
        help="Safety ratio applied to max-batch-tokens to avoid tokenizer mismatch (0 < r <= 1).",
    )
    parser.add_argument(
        "--max-chars-per-document",
        type=int,
        default=int(os.getenv("VOYAGE_MAX_CHARS_PER_DOCUMENT", "0")),
        help="Optional hard cap for document text before chunking (0 = no cap).",
    )
    parser.add_argument(
        "--chunk-max-chars",
        type=int,
        default=int(os.getenv("VOYAGE_CHUNK_MAX_CHARS", "3000")),
        help="Max characters per chunk.",
    )
    parser.add_argument(
        "--chunk-overlap-chars",
        type=int,
        default=int(os.getenv("VOYAGE_CHUNK_OVERLAP_CHARS", "300")),
        help="Overlapping characters between adjacent chunks.",
    )
    parser.add_argument(
        "--max-chunks-per-document",
        type=int,
        default=int(os.getenv("VOYAGE_MAX_CHUNKS_PER_DOCUMENT", "32")),
        help="Hard cap on number of chunks per document.",
    )
    args = parser.parse_args()

    api_key = os.getenv("VOYAGE_API_KEY")
    if not api_key:
        raise ValueError("Missing VOYAGE_API_KEY environment variable.")
    if "voyageai.com" not in args.voyage_api_url:
        print(
            "Warning: --voyage-api-url is not a Voyage host. "
            f"Current value: {args.voyage_api_url}"
        )
    if not args.mongo_uri:
        raise ValueError("Missing MongoDB URI. Set --mongo-uri or MONGO_URI.")
    if args.batch_size <= 0:
        raise ValueError("--batch-size must be greater than 0.")
    if args.mongo_batch_size <= 0:
        raise ValueError("--mongo-batch-size must be greater than 0.")
    if args.log_every <= 0:
        raise ValueError("--log-every must be greater than 0.")
    if args.max_batch_tokens <= 0:
        raise ValueError("--max-batch-tokens must be greater than 0.")
    if args.max_batch_tokens > VOYAGE_MAX_ALLOWED_BATCH_TOKENS:
        print(
            f"Warning: --max-batch-tokens {args.max_batch_tokens} exceeds Voyage limit "
            f"{VOYAGE_MAX_ALLOWED_BATCH_TOKENS}; capping to {VOYAGE_MAX_ALLOWED_BATCH_TOKENS}."
        )
        args.max_batch_tokens = VOYAGE_MAX_ALLOWED_BATCH_TOKENS
    if args.max_chars_per_document < 0:
        raise ValueError("--max-chars-per-document must be >= 0.")
    if args.chunk_max_chars <= 0:
        raise ValueError("--chunk-max-chars must be greater than 0.")
    if args.chunk_overlap_chars < 0:
        raise ValueError("--chunk-overlap-chars must be >= 0.")
    if args.chunk_overlap_chars >= args.chunk_max_chars:
        raise ValueError("--chunk-overlap-chars must be smaller than --chunk-max-chars.")
    if args.max_chunks_per_document <= 0:
        raise ValueError("--max-chunks-per-document must be greater than 0.")
    if args.batch_token_safety_ratio <= 0 or args.batch_token_safety_ratio > 1:
        raise ValueError("--batch-token-safety-ratio must be in the range (0, 1].")

    effective_max_batch_tokens = max(1, int(args.max_batch_tokens * args.batch_token_safety_ratio))

    collection_names = [name.strip() for name in args.collections.split(",") if name.strip()]
    if not collection_names:
        raise ValueError("No collections provided.")

    field_map = parse_collection_field_map(args.field_map)

    mongo_client_kwargs: Dict[str, Any] = {
        "tlsCAFile": certifi.where(),
        "datetime_conversion": "DATETIME_AUTO",
    }

    client = MongoClient(args.mongo_uri, **mongo_client_kwargs)
    db = client[args.db_name]

    try:
        for collection_name in collection_names:
            collection = db[collection_name]
            embedding_field = field_map.get(collection_name, "embeddingVoyage")
            skip_fields = {embedding_field}

            query: Dict[str, Any] = {}
            if args.skip_existing:
                query[embedding_field] = {"$exists": False}

            cursor = collection.find(query).batch_size(args.mongo_batch_size)
            if args.limit > 0:
                cursor = cursor.limit(args.limit)

            print(f"[{collection_name}] streaming documents into field '{embedding_field}'")
            updated_count = 0
            skipped_existing_count = 0
            seen_count = 0
            truncated_docs_count = 0
            batch: List[Dict[str, Any]] = []

            for doc in cursor:
                if args.skip_existing and embedding_field in doc:
                    skipped_existing_count += 1
                    continue
                batch.append(doc)
                seen_count += 1

                if len(batch) < args.batch_size:
                    if seen_count % args.log_every == 0:
                        print(f"[{collection_name}] fetched {seen_count} docs...")
                    continue

                chunk_items: List[Dict[str, Any]] = []
                for item in batch:
                    text = build_text_blob(item, skip_fields=skip_fields)
                    if args.max_chars_per_document > 0:
                        text = text[: args.max_chars_per_document]
                    chunks, truncated = split_text_into_chunks(
                        text=text,
                        max_chars=args.chunk_max_chars,
                        overlap_chars=args.chunk_overlap_chars,
                        max_chunks=args.max_chunks_per_document,
                    )
                    if truncated:
                        truncated_docs_count += 1
                    for chunk_index, chunk_text in enumerate(chunks):
                        chunk_items.append(
                            {
                                "_id": item["_id"],
                                "chunk_index": chunk_index,
                                "chunk_text": chunk_text,
                            }
                        )

                doc_chunks: Dict[Any, List[List[float]]] = {item["_id"]: [] for item in batch}
                for sub_items, sub_texts in split_by_token_budget(
                    chunk_items,
                    text_key="chunk_text",
                    max_batch_tokens=effective_max_batch_tokens,
                ):
                    vectors = embed_items_with_auto_split(
                        items=sub_items,
                        text_key="chunk_text",
                        api_key=api_key,
                        model=args.model_name,
                        input_type=args.voyage_input_type,
                        timeout_seconds=args.voyage_timeout_seconds,
                        api_url=args.voyage_api_url,
                    )

                    for item, vector in zip(sub_items, vectors):
                        doc_chunks[item["_id"]].append(vector)

                if not args.dry_run:
                    for item in batch:
                        collection.update_one(
                            {"_id": item["_id"]},
                            {"$set": {embedding_field: doc_chunks[item["_id"]]}},
                        )
                updated_count += len(batch)
                if updated_count % args.log_every == 0:
                    print(f"[{collection_name}] embedded {updated_count} docs...")
                batch = []

            if batch:
                chunk_items = []
                for item in batch:
                    text = build_text_blob(item, skip_fields=skip_fields)
                    if args.max_chars_per_document > 0:
                        text = text[: args.max_chars_per_document]
                    chunks, truncated = split_text_into_chunks(
                        text=text,
                        max_chars=args.chunk_max_chars,
                        overlap_chars=args.chunk_overlap_chars,
                        max_chunks=args.max_chunks_per_document,
                    )
                    if truncated:
                        truncated_docs_count += 1
                    for chunk_index, chunk_text in enumerate(chunks):
                        chunk_items.append(
                            {
                                "_id": item["_id"],
                                "chunk_index": chunk_index,
                                "chunk_text": chunk_text,
                            }
                        )

                doc_chunks: Dict[Any, List[List[float]]] = {item["_id"]: [] for item in batch}
                for sub_items, sub_texts in split_by_token_budget(
                    chunk_items,
                    text_key="chunk_text",
                    max_batch_tokens=effective_max_batch_tokens,
                ):
                    vectors = embed_items_with_auto_split(
                        items=sub_items,
                        text_key="chunk_text",
                        api_key=api_key,
                        model=args.model_name,
                        input_type=args.voyage_input_type,
                        timeout_seconds=args.voyage_timeout_seconds,
                        api_url=args.voyage_api_url,
                    )

                    for item, vector in zip(sub_items, vectors):
                        doc_chunks[item["_id"]].append(vector)

                if not args.dry_run:
                    for item in batch:
                        collection.update_one(
                            {"_id": item["_id"]},
                            {"$set": {embedding_field: doc_chunks[item["_id"]]}},
                        )
                updated_count += len(batch)

            if seen_count == 0:
                print(f"[{collection_name}] no documents to process")
                continue

            suffix = " (dry-run)" if args.dry_run else ""
            print(
                f"[{collection_name}] updated {updated_count} documents{suffix}; "
                f"skipped existing: {skipped_existing_count}; "
                f"truncated docs (chunk cap): {truncated_docs_count}"
            )
    finally:
        client.close()


if __name__ == "__main__":
    main()
