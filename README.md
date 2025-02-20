# Safe Wallet Monitor

This repository watches all transactions from the Safe Wallet and sends notifications to a specific Slack channel.

## Prerequisites

- Node.js (v16 or higher)
- npm
- Docker (for containerization)
- Kubernetes cluster (for deployment)
- Slack Webhook URL
- Alchemy API Key

## Installation

```bash
npm install
```


## Local Development

### Build

```bash
npm run build
```

### Start Locally

```bash
npm run start
```

## Docker Deployment

### Build for Docker

```bash
docker buildx create --use --name multiarch-builder
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ${DOCKER_USERNAME}/safe-wallet-monitor:latest \
  --push .
```

### Run with Docker

```bash
docker run --env-file .env -d ${DOCKER_USERNAME}/safe-wallet-monitor:latest
```

## Kubernetes Deployment

### Configuration

1. In the `k8s/base/secret.yml` file, replace the following placeholders with your actual values (base64 encoded):
   - `SLACK_WEBHOOK_URL` with your actual Slack webhook URL
   - `ALCHEMY_API_KEY` with your actual Alchemy API key

To encode your values in base64:

```bash
echo -n "your-value" | base64
```

### Deploy to Kubernetes

```bash
kustomize build k8s/overlays/zksync | kubectl apply -f -
```

## Monitoring and Maintenance

- Check Slack channel for transaction notifications
- Monitor pod logs in Kubernetes:
  ```bash
  kubectl logs -f deployment/safe-wallet-monitor
  ```

## Troubleshooting

Common issues and solutions:

1. If notifications are not appearing in Slack:
   - Verify the Slack webhook URL is correct
   - Check pod logs for any errors

2. If transactions are not being detected:
   - Verify the Alchemy API key is valid
   - Check network connectivity to Alchemy endpoints

## Architecture

This application:
1. Connects to the Safe Wallet contract using Alchemy
2. Monitors all outgoing transactions
3. Formats transaction details
4. Sends notifications to the configured Slack channel
