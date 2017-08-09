#!/bin/sh

kiss_arch_build() {
  projectName=$1
  _pwd=$2
  cd $_pwd
  ts=$(date +%Y%m%d%H%M%S)
  IMG_NAME=kiss_arch/${projectName}:latest
  IMG_TARBALL=$(echo $IMG_NAME | sed -e 's/\//_/g' | sed -e "s@:latest@_$ts@g").tar
  docker rmi -f $IMG_NAME
  docker build -t $IMG_NAME .
  docker save $IMG_NAME -o $IMG_TARBALL
  echo "Time to deploy: $IMG_TARBALL"
}

kiss_arch_deploy() {
  host=$1
  projectName=$2
  tarball=$3
  echo "TARBAL: $tarball"

  f=$(basename $tarball)
  echo "F: $f"
  scp -i ../deploy/deploy.ssh $tarball deploy@$host:/tmp
  ssh -i ../deploy/deploy.ssh deploy@$host sudo /home/deploy/docker/docker_mgmt.sh --install /tmp/$f $projectName /home/deploy/docker/kiss_arch/$projectName-compose.yml
}
