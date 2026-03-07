#!/usr/bin/env python3
"""Shared embedding helper based on transformers + torch."""

from typing import Dict, Iterable, List

import numpy as np
import torch
from transformers import AutoModel, AutoTokenizer


class TransformerEmbedder:
    def __init__(self, model_name: str) -> None:
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.model.eval()
        max_positions = getattr(self.model.config, "max_position_embeddings", 512)
        special_tokens = self.tokenizer.num_special_tokens_to_add(pair=False)
        self.max_chunk_tokens = max(1, int(max_positions) - int(special_tokens))

    @staticmethod
    def _mean_pool(last_hidden_state: torch.Tensor, attention_mask: torch.Tensor) -> torch.Tensor:
        mask = attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float()
        summed = torch.sum(last_hidden_state * mask, dim=1)
        counts = torch.clamp(mask.sum(dim=1), min=1e-9)
        return summed / counts

    def _encode_input_ids(self, input_id_chunks: List[List[int]]) -> np.ndarray:
        if not input_id_chunks:
            return np.array([], dtype=np.float32)

        encoded = self.tokenizer.pad(
            [{"input_ids": ids} for ids in input_id_chunks],
            padding=True,
            return_tensors="pt",
        )

        with torch.no_grad():
            model_output = self.model(**encoded)
            embeddings = self._mean_pool(model_output.last_hidden_state, encoded["attention_mask"])
        return embeddings.cpu().numpy()

    def encode(self, texts: Iterable[str], normalize: bool = True) -> np.ndarray:
        text_list = list(texts)
        if not text_list:
            return np.array([], dtype=np.float32)

        encoded = self.tokenizer(
            text_list,
            padding=True,
            truncation=True,
            return_tensors="pt",
            max_length=512,
        )

        with torch.no_grad():
            model_output = self.model(**encoded)
            embeddings = self._mean_pool(model_output.last_hidden_state, encoded["attention_mask"])

        vectors = embeddings.cpu().numpy()
        if normalize:
            norms = np.linalg.norm(vectors, axis=1, keepdims=True)
            norms[norms == 0] = 1
            vectors = vectors / norms
        return vectors

    def encode_full_text(
        self,
        texts: Iterable[str],
        normalize: bool = True,
        overlap_tokens: int = 64,
    ) -> np.ndarray:
        text_list = list(texts)
        if not text_list:
            return np.array([], dtype=np.float32)

        if overlap_tokens < 0:
            overlap_tokens = 0
        if overlap_tokens >= self.max_chunk_tokens:
            overlap_tokens = self.max_chunk_tokens - 1
        step = max(1, self.max_chunk_tokens - overlap_tokens)

        all_chunks: List[List[int]] = []
        chunk_meta: List[Dict[str, int]] = []

        for doc_index, text in enumerate(text_list):
            token_ids = self.tokenizer.encode(text, add_special_tokens=False, truncation=False)
            if not token_ids:
                token_ids = self.tokenizer.encode(" ", add_special_tokens=False, truncation=False)

            for start in range(0, len(token_ids), step):
                chunk_ids = token_ids[start : start + self.max_chunk_tokens]
                if not chunk_ids:
                    continue
                all_chunks.append(chunk_ids)
                chunk_meta.append({"doc_index": doc_index, "weight": len(chunk_ids)})
                if start + self.max_chunk_tokens >= len(token_ids):
                    break

        chunk_vectors = self._encode_input_ids(all_chunks)
        if chunk_vectors.size == 0:
            return np.array([], dtype=np.float32)

        hidden_size = chunk_vectors.shape[1]
        summed = np.zeros((len(text_list), hidden_size), dtype=np.float32)
        weights = np.zeros((len(text_list),), dtype=np.float32)

        for idx, vector in enumerate(chunk_vectors):
            meta = chunk_meta[idx]
            doc_index = meta["doc_index"]
            weight = float(meta["weight"])
            summed[doc_index] += vector * weight
            weights[doc_index] += weight

        weights[weights == 0] = 1
        vectors = summed / weights[:, None]
        if normalize:
            norms = np.linalg.norm(vectors, axis=1, keepdims=True)
            norms[norms == 0] = 1
            vectors = vectors / norms
        return vectors
