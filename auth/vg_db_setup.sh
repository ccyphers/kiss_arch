#!/bin/sh

ssh -i ../deploy/deploy.ssh deploy@192.168.254.2 sudo /home/deploy/setup/db_migrate.sh
ssh -i ../deploy/deploy.ssh deploy@192.168.254.2 sudo /home/deploy/setup/db_seed.sh
