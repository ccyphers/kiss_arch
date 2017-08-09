#!/bin/sh

# this assumes that you have the common services running and that the
# postgres running container instance name is services_postgres_1

docker exec -it services_postgres_1 createdb -U postgres -h localhost auth_prod
