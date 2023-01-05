rm -rf node_modules/
rm -rf dist/
rm -rf api/node_modules/
rm -rf api/dist/
rm -rf app/node_modules/
rm -rf app/dist/
rm -rf packages/create-directus-extension/node_modules/
rm -rf packages/create-directus-extension/dist/
rm -rf packages/extensions-sdk/node_modules/
rm -rf packages/extensions-sdk/dist/
rm -rf packages/schema/node_modules/
rm -rf packages/schema/dist/
rm -rf packages/shared/node_modules/
rm -rf packages/shared/dist/
rm -rf packages/specs/node_modules/
rm -rf packages/specs/dist/
rm -rf packages/storage/node_modules/
rm -rf packages/storage/dist/
rm -rf packages/storage-driver-azure/node_modules/
rm -rf packages/storage-driver-azure/dist/
rm -rf packages/storage-driver-cloudinary/node_modules/
rm -rf packages/storage-driver-cloudinary/dist/
rm -rf packages/storage-driver-gcs/node_modules/
rm -rf packages/storage-driver-gcs/dist/
rm -rf packages/storage-driver-local/node_modules/
rm -rf packages/storage-driver-local/dist/
rm -rf packages/storage-driver-s3/node_modules/
rm -rf packages/storage-driver-s3/dist/
rm -rf packages/utils/node_modules/
rm -rf packages/utils/dist/
rm -rf $(pnpm store path)
 
pnpm install
NODE_OPTIONS="--max-old-space-size=8192" pnpm -r build
node docker/pack
docker build --no-cache -t directus-base -f ./docker/Dockerfile .
