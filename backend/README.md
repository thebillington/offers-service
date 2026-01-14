# Environment

1. Take a copy of the `.env.example` script and name it `.env`
2. Install dependencies `yarn install`

# Database

## Installing and configuring Colima (Mac OS)

On Mac an enterprise license is needed to use docker command line tools use colima instead.

To use colima, first install it using brew:

`brew install colima`

Then sym link your docker compose command to use colima:

```bash
mkdir -p ~/.docker/cli-plugins
ln -sfn $HOMEBREW_PREFIX/opt/docker-compose/bin/docker-compose ~/.docker/cli-plugins/docker-compose
```

Start colima:

`colima start --cpu 4 --memory 8`

## Starting the Database

You can up the service using docker compose:

`docker compose up -d`

The compose file exposes Postgres on port `5432` and creates a database named `blc_db` with the `blc_user` account and `blc_pass` password. You can override the connection by copying `.env.example` to `.env` and updating `DATABASE_URL` (and `PG_MAX_CONNECTIONS` if you need to adjust the pool size).

## Creating DB tables

We use `node-pg-migrate` to manage migrations. To initialise your database based on previous migrations run:

```bash
yarn migrate up
```

Then you can seed the database with some example data:

```bash
yarn seed
```

# API

The backend is a single Lambda entry point (`src/handler.ts`) that delegates routing to `src/router`, which then calls resource handlers in the `router/routes` directory.

## Local Dev

Local development requires the SAM CLI, a tool from AWS that provides strong parity with API Gateway. Since we are creating our local database separately, we only need SAM to actually trigger our Lambda handler. Install SAM CLI with:

`brew install aws-sam-cli`

You can then up the service and listen for changes:

`yarn dev`
