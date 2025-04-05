#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER zentropy_user WITH PASSWORD 'zentropy_password';
    CREATE DATABASE zentropydb;
    GRANT ALL PRIVILEGES ON DATABASE zentropydb TO zentropy_user;
    \c zentropydb
    GRANT ALL ON SCHEMA public TO zentropy_user;
EOSQL