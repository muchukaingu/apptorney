#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 5 ]]; then
  cat <<USAGE
Usage:
  $0 <region> <account-id> <repository-name> <image-tag> <docker-context> [dockerfile] [platform]

Arguments:
  region           AWS region, e.g. us-east-1
  account-id       AWS account ID, e.g. 123456789012
  repository-name  ECR repository name, e.g. apptorney
  image-tag        Image tag, e.g. latest or 2026-02-10
  docker-context   Docker build context path, e.g. .

Optional:
  dockerfile       Dockerfile path (defaults to Dockerfile)
  platform         Docker platform target (defaults to linux/amd64)
USAGE
  exit 1
fi

REGION="$1"
ACCOUNT_ID="$2"
REPOSITORY_NAME="$3"
IMAGE_TAG="$4"
DOCKER_CONTEXT="$5"
DOCKERFILE="${6:-Dockerfile}"
PLATFORM="${7:-linux/amd64}"

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI is required but not found in PATH." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required but not found in PATH." >&2
  exit 1
fi

if ! aws sts get-caller-identity >/dev/null 2>&1; then
  echo "AWS CLI is not configured or credentials are invalid. Run: aws configure" >&2
  exit 1
fi

ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
IMAGE_URI="${ECR_URI}/${REPOSITORY_NAME}:${IMAGE_TAG}"

if ! aws ecr describe-repositories --repository-names "$REPOSITORY_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "ECR repository '$REPOSITORY_NAME' not found; creating it..."
  aws ecr create-repository --repository-name "$REPOSITORY_NAME" --region "$REGION" >/dev/null
fi

echo "Logging into ECR..."
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ECR_URI"

echo "Building image: $IMAGE_URI (platform: $PLATFORM)"
docker build --platform "$PLATFORM" -f "$DOCKERFILE" -t "$IMAGE_URI" "$DOCKER_CONTEXT"

echo "Pushing image: $IMAGE_URI"
docker push "$IMAGE_URI"

echo "Done."
echo "Image URI: $IMAGE_URI"
