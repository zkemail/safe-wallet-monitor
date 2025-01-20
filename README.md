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

kustomize build k8s/overlays/zksync | kubectl apply -f -