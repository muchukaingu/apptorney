#!/usr/bin/env python3
"""Shared embedding helper based on transformers + torch."""

from typing import Iterable, List

import numpy as np
import torch
from transformers import AutoModel, AutoTokenizer


class TransformerEmbedder:
    def __init__(self, model_name: str) -> None:
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.model.eval()

    @staticmethod
    def _mean_pool(last_hidden_state: torch.Tensor, attention_mask: torch.Tensor) -> torch.Tensor:
        mask = attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float()
        summed = torch.sum(last_hidden_state * mask, dim=1)
        counts = torch.clamp(mask.sum(dim=1), min=1e-9)
        return summed / counts

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
