# Offers and Discounts Demo

This repository contains a demo prod application for a discounts provider backend service.

* Offers: [https://8pvarigojc.execute-api.eu-west-2.amazonaws.com/api/offers](https://8pvarigojc.execute-api.eu-west-2.amazonaws.com/api/offers)
* Categories: [https://8pvarigojc.execute-api.eu-west-2.amazonaws.com/api/categories](https://8pvarigojc.execute-api.eu-west-2.amazonaws.com/api/categories)
* Companies: [https://8pvarigojc.execute-api.eu-west-2.amazonaws.com/api/companies](https://8pvarigojc.execute-api.eu-west-2.amazonaws.com/api/companies)

## Structure

The application has been built to maximise developer convenience through support for local development that closely matches prod with hot reloading of files and simple helper scripts for upping and managing the database and instance.

### /backend

* Postgres Database, ran in a docker container locally and via RDS in prod.
* NodeTS backend, with a very simple routing API that defers to the database. Entrypoint in a single index.ts file that delegates to handlers. Ran via AWS SAM locally and deployed to lambda in prod.
* Uses `node-pg-migrate` to manage migrations.

### .github/workflows

The repository is connected to AWS via OIDC connect.

* `infra.yml`- Deploy terraform to AWS, including deployment stage for the Node application.
* `migrations.yml` - Script to run migrations in an ECS Fargate container.
* `seed.yml` - Simple script to seed the database with some demo data.