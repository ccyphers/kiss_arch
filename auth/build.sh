ts=$(date +%Y%m%d%H%M%S)
IMG_NAME=kiss_arch/auth:latest
IMG_TARBALL=$(echo $IMG_NAME | sed -e 's/\//_/g' | sed -e "s@:latest@_$ts@g").tar
docker rmi -f $IMG_NAME
docker build -t $IMG_NAME .
docker save $IMG_NAME -o $IMG_TARBALL
echo "Time to deploy: $IMG_TARBALL"
