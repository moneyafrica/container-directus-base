pnpm install
NODE_OPTIONS="--max-old-space-size=8192" pnpm -r build
node docker/pack.js
docker build --no-cache -t directus-base -f ./docker/Dockerfile .
