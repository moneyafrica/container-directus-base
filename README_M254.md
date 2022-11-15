# README (M254)
TODO!

In the meantime, some important commands:
```
pnpm --filter directus dev
pnpm --filter @directus/app dev

curl -i -H 'Content-Type: application/json'  -X POST -d '{"email": "admin@example.com", "password":"admin"}' localhost:8080/auth/login
curl -i -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer "$access_token -X POST -d '{"table1_attr1":"123", "ref_table2":[{"table2_attr1":"123"}]}' localhost:8080/items/table1
```
