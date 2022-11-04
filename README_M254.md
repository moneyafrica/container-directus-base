# README (M254)
pnpm install
NODE_OPTIONS="--max-old-space-size=8192" pnpm -r build

pnpm --filter directus dev
pnpm --filter @directus/app dev

curl -i -H 'Content-Type: application/json'  -X POST -d '{"email": "admin@example.com", "password":"admin"}' localhost:8080/auth/login
curl -i -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer "$access_token -X POST -d '{"table1_attr1":"123", "ref_table2":[{"table2_attr1":"123"}]}' localhost:8080/items/table1



NODE_OPTIONS="--max-old-space-size=8192" pnpm -r build
node docker/pack.js
( cd docker; docker build --no-cache -t directus-base .)

docker build --no-cache -t directus-base -f ./docker/Dockerfile .



