#!/usr/bin/env python3
"""Generate and store vector embeddings for MongoDB documents.

This script reads documents from target collections, builds one text string from
all document fields, creates embeddings, and stores those embeddings back into
collection-specific fields.
"""

import argparse
import json
import os
from typing import Any, Dict, Iterable, List, Optional

import certifi
from pymongo import MongoClient

from embedding_model import TransformerEmbedder


DEFAULT_COLLECTIONS = ("legislation", "case")
DEFAULT_FIELD_MAP = {
    "case": "caseEmbedding",
    "legislation": "legislationEmbedding",
    "legislations": "legislationEmbedding",
}


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
    parts = flatten_document(doc, skip_fields=skip_fields)
    return "\n".join(parts)


def chunked(items: List[Any], size: int) -> Iterable[List[Any]]:
    for i in range(0, len(items), size):
        yield items[i : i + size]


def parse_collection_field_map(raw: Optional[str]) -> Dict[str, str]:
    if not raw:
        return DEFAULT_FIELD_MAP.copy()

    parsed = json.loads(raw)
    if not isinstance(parsed, dict):
        raise ValueError("--field-map must be a JSON object")
    return {str(k): str(v) for k, v in parsed.items()}


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate embeddings for MongoDB collections.")
    parser.add_argument("--mongo-uri", default=os.getenv("MONGO_URI"), help="MongoDB connection URI.")
    parser.add_argument("--db-name", default=os.getenv("MONGO_DB", "apptorney"), help="MongoDB database name.")
    parser.add_argument(
        "--collections",
        default=",".join(DEFAULT_COLLECTIONS),
        help="Comma-separated collection names to process.",
    )
    parser.add_argument(
        "--field-map",
        default=os.getenv("EMBEDDING_FIELD_MAP"),
        help='JSON map of collection->embedding field, e.g. {"case":"caseEmbedding","legislation":"legislationEmbedding"}',
    )
    parser.add_argument(
        "--model-name",
        default=os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"),
        help="Hugging Face model name.",
    )
    parser.add_argument("--batch-size", type=int, default=32, help="Embedding batch size.")
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
        "--tls-allow-invalid-certificates",
        action="store_true",
        help="Disable TLS certificate verification (not recommended, use only for debugging).",
    )
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
    args = parser.parse_args()

    if not args.mongo_uri:
        raise ValueError("Missing MongoDB URI. Set --mongo-uri or MONGO_URI.")
    if args.batch_size <= 0:
        raise ValueError("--batch-size must be greater than 0.")
    if args.mongo_batch_size <= 0:
        raise ValueError("--mongo-batch-size must be greater than 0.")
    if args.log_every <= 0:
        raise ValueError("--log-every must be greater than 0.")

    collection_names = [name.strip() for name in args.collections.split(",") if name.strip()]
    if not collection_names:
        raise ValueError("No collections provided.")

    field_map = parse_collection_field_map(args.field_map)
    model = TransformerEmbedder(args.model_name)

    mongo_client_kwargs: Dict[str, Any] = {
        "tlsCAFile": certifi.where(),
        "datetime_conversion": "DATETIME_AUTO",
    }
    if args.tls_allow_invalid_certificates:
        mongo_client_kwargs["tlsAllowInvalidCertificates"] = True

    client = MongoClient(args.mongo_uri, **mongo_client_kwargs)
    db = client[args.db_name]

    try:
        for collection_name in collection_names:
            collection = db[collection_name]
            embedding_field = field_map.get(collection_name, "embedding")
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

                texts = [build_text_blob(item, skip_fields=skip_fields) for item in batch]
                vectors = model.encode(texts, normalize=True)

                if not args.dry_run:
                    for item, vector in zip(batch, vectors):
                        collection.update_one(
                            {"_id": item["_id"]},
                            {"$set": {embedding_field: vector.tolist()}},
                        )
                updated_count += len(batch)
                if updated_count % args.log_every == 0:
                    print(f"[{collection_name}] embedded {updated_count} docs...")
                batch = []

            if batch:
                texts = [build_text_blob(item, skip_fields=skip_fields) for item in batch]
                vectors = model.encode(texts, normalize=True)

                if not args.dry_run:
                    for item, vector in zip(batch, vectors):
                        collection.update_one(
                            {"_id": item["_id"]},
                            {"$set": {embedding_field: vector.tolist()}},
                        )
                updated_count += len(batch)

            if seen_count == 0:
                print(f"[{collection_name}] no documents to process")
                continue

            suffix = " (dry-run)" if args.dry_run else ""
            print(
                f"[{collection_name}] updated {updated_count} documents{suffix}; "
                f"skipped existing: {skipped_existing_count}"
            )
    finally:
        client.close()


if __name__ == "__main__":
    main()
