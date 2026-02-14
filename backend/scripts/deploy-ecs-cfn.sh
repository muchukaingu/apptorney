#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 6 ]]; then
  cat <<USAGE
Usage:
  $0 <stack-name> <region> <vpc-id> <public-subnet-ids> <private-subnet-ids> <container-image> [environment] [project-name] [desired-count] [certificate-arn] [hosted-zone-id] [domain-name]

Arguments:
  stack-name         CloudFormation stack name
  region             AWS region, e.g. us-east-1
  vpc-id             VPC ID, e.g. vpc-0123456789abcdef0
  public-subnet-ids  Comma-separated subnet IDs for ALB, e.g. subnet-a,subnet-b
  private-subnet-ids Comma-separated subnet IDs for ECS tasks, e.g. subnet-c,subnet-d
  container-image    Full image URI, e.g. 123456789012.dkr.ecr.us-east-1.amazonaws.com/apptorney:latest

Optional:
  environment        Defaults to dev
  project-name       Defaults to apptorney
  desired-count      Defaults to 2
  certificate-arn    Optional ACM certificate ARN to enable HTTPS + HTTP->HTTPS redirect
  hosted-zone-id     Optional Route53 hosted zone ID to create an alias record
  domain-name        Optional DNS name (e.g. api.example.com) for ALB alias
USAGE
  exit 1
fi

STACK_NAME="$1"
REGION="$2"
VPC_ID="$3"
PUBLIC_SUBNET_IDS="$4"
PRIVATE_SUBNET_IDS="$5"
CONTAINER_IMAGE="$6"
ENVIRONMENT="${7:-dev}"
PROJECT_NAME="${8:-apptorney}"
DESIRED_COUNT="${9:-2}"
CERTIFICATE_ARN="${10:-}"
HOSTED_ZONE_ID="${11:-}"
DOMAIN_NAME="${12:-}"

TEMPLATE_FILE="infrastructure/cloudformation/ecs-fargate-alb.yaml"

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI is required but not found in PATH." >&2
  exit 1
fi

if ! aws sts get-caller-identity >/dev/null 2>&1; then
  echo "AWS CLI is not configured or credentials are invalid. Run: aws configure" >&2
  exit 1
fi

PARAMETERS=(
  "ProjectName=$PROJECT_NAME"
  "Environment=$ENVIRONMENT"
  "VpcId=$VPC_ID"
  "PublicSubnetIds=$PUBLIC_SUBNET_IDS"
  "PrivateSubnetIds=$PRIVATE_SUBNET_IDS"
  "ContainerImage=$CONTAINER_IMAGE"
  "DesiredCount=$DESIRED_COUNT"
)

if [[ -n "$CERTIFICATE_ARN" ]]; then
  PARAMETERS+=("CertificateArn=$CERTIFICATE_ARN")
fi

if [[ -n "$HOSTED_ZONE_ID" ]]; then
  PARAMETERS+=("HostedZoneId=$HOSTED_ZONE_ID")
fi

if [[ -n "$DOMAIN_NAME" ]]; then
  PARAMETERS+=("DomainName=$DOMAIN_NAME")
fi

aws cloudformation deploy \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --template-file "$TEMPLATE_FILE" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides "${PARAMETERS[@]}"

echo "Deployment complete."
echo "To view outputs:"
echo "aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs' --output table"
