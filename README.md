# Contract Testing

# Automation Test Contract API with PactJS

This is the repository for automation of Contract API, developed to work with PactJS.

## Table of Contents

1. [Goal](#goal)
2. [Project Structure](#project-structure)
3. [Tests](#tests)
4. [Initial Setup](#initial-setup)
5. [Run Tests](#run-tests)

## Goal

The goal of this repository is to be easy to understand focused on developing automated contract tests for API, using [PactJS](https://github.com/pact-foundation/pact-js), a testing tool that guarantees those Contracts are satisfied.

## Project Structure

```
|--- broker
|--- data
|--- request
|--- test
|--- .env
|--- jsconfig.json
|--- package-lock.json
|--- package.json
```

## Tests

The tests were written using the JavaScript language.

## Run tests

### Initial Setup

1. Requires node. To install, execute `npm install node` or download [Node](https://nodejs.org/en/download/)
2. Run the command `npm install` to install dependencies
3. Requires the EBAC Demo Store Admin to execute. Git clone the [EBAC Demo Store Admin](https://github.com/EBAC-QE/ebac-demo-store-admin.git) for your local machine, then start following the steps in the README.
4. Requires the EBAC Demo Store Server to execute. Git clone the [EBAC Demo Store Server](https://github.com/EBAC-QE/ebac-demo-store-server.git) for your local machine, then start following the steps in the README.

### Start the Database in Docker

- Create Volume
```
docker volume create pgdata docker volume inspect pgdata
```

- Run Database
```
docker run --name pactbroker-db -e POSTGRES_PASSWORD=ebac -e POSTGRES_USER=ebac -e PGDATA=/var/lib/postgresql/data/pgdata -v pgdata:/var/lib/postgresql/data -d postgres
```

- Run Postgres Shell
```
docker run -it --link pactbroker-db:postgres --rm postgres sh -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U ebac'
```

- Run Database Commands
```
CREATE USER pactbrokeruser WITH PASSWORD 'root'; CREATE DATABASE pactbroker WITH OWNER pactbrokeruser; GRANT ALL PRIVILEGES ON DATABASE pactbroker TO pactbrokeruser;
```

- Run Pact Broker
```
docker run --name pactbroker --link pactbroker-db:postgres -e PACT_BROKER_DATABASE_USERNAME=pactbrokeruser -e PACT_BROKER_DATABASE_PASSWORD=root -e PACT_BROKER_DATABASE_HOST=postgres -e PACT_BROKER_DATABASE_NAME=pactbroker -d -p 9292:9292 pactfoundation/pact-broker
```

### Run Tests

- Run one of the commands below to run the tests.
  Examples:
- To publish the pact broker, execute `npm run publish:broker`  
- To run the test provider, execute `npm run test:provider`
- To run the test consumer for the user contract, execute `npm run test:consumer_user`
- To run the test consumer for the address contract, execute `npm run test:consumer_address`
- To run the test consumer for the customer contract, execute `npm run test:consumer_customer`
<p>