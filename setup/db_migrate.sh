#!/bin/sh
BASE=`dirname $0`
docker-compose -f $BASE/compose-run-auth-migrations.yml up
