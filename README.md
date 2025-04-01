# Safe Wallet Monitor

This repository watches all transactions from the Safe Wallet and sends notifications to a specific Slack channel.

## Prerequisites

To deploy this application, you need to have kustomize installed. You can install it using one of the following methods:

```bash
# Using Homebrew (macOS)
brew install kustomize

# Using curl
curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash
```

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Start in your local

```bash
npm run start
```

## Build for docker

```bash
docker buildx create --use --name multiarch-builder
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t {your-docker-hub-username}/safe-wallet-monitor:latest \
  --push .
```

## Run docker

```bash
docker run --env-file .env -d {your-docker-hub-username}/safe-wallet-monitor:latest
```

## Configuration

Before running the application, make sure to set appropriate values in the configuration files:

- In the `k8s/base/secret.yml` file, replace the following placeholders with your actual values:
  - `SLACK_WEBHOOK_URL` with your actual Slack webhook URL, encoded in base64.
  - `ALCHEMY_API_KEY` with your actual Alchemy API key, encoded in base64.

## Deploy

```bash
kustomize build k8s/overlays/zksync | kubectl apply -f -
```