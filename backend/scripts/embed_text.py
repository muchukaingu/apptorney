#!/usr/bin/env python3
"""Generate a single embedding vector for query text."""

import argparse
import json

from embedding_model import TransformerEmbedder


def main() -> None:
    parser = argparse.ArgumentParser(description="Embed a text string and print JSON vector.")
    parser.add_argument("--text", required=True, help="Text to embed.")
    parser.add_argument(
        "--model-name",
        default="sentence-transformers/all-MiniLM-L6-v2",
        help="Hugging Face model name.",
    )
    args = parser.parse_args()

    model = TransformerEmbedder(args.model_name)
    vector = model.encode([args.text], normalize=True)[0].tolist()
    print(json.dumps(vector))


if __name__ == "__main__":
    main()
