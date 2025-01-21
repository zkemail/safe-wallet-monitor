# Safe Wallet Monitor

This repository watches all transactions from the Safe Wallet and sends notifications to a specific Slack channel.

# Install

npm install

# Build

npm run build

# Start in you local

npm run start

# Build for docker

docker buildx create --use --name multiarch-builder
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t {your-docker-hub-username}/safe-wallet-monitor:latest \
  --push .

# Run docker

docker run --env-file .env -d {your-docker-hub-username}/safe-wallet-monitor:latest

# Run with kubernetes

# Configuration

Before running the application, make sure to set appropriate values in the configuration files:

- In the `k8s/base/secret.yml` file, replace the following placeholders with your actual values:
  - `SLACK_WEBHOOK_URL` with your actual Slack webhook URL, encoded in base64.
  - `ALCHEMY_API_KEY` with your actual Alchemy API key, encoded in base64.

# Deploy

kustomize build k8s/overlays/zksync | kubectl apply -f -