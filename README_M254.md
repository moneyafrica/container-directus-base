# README (M254)

This repository contains the code necessary to build the base directus image that is used in the repository found here:
https://github.com/moneyafrica/container-directus.

To build the image, run the following:

```
bash build.sh
```

# SOME ADDITIONAL COMMANDS

To be documented properly.

```
pnpm --filter directus dev
pnpm --filter @directus/app dev

curl -i -H 'Content-Type: application/json'  -X POST -d '{"email": "admin@example.com", "password":"admin"}' localhost:8080/auth/login
curl -i -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer TOKEN" -X POST -d '{"table1_attr1":"123", "ref_table2":[{"table2_attr1":"123"}]}' localhost:8080/items/table1
```
