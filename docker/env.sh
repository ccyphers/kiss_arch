NUM_COMMANDS=0
DOCKER_LOAD_ERROR=1
usage() {
  echo "FIXME"
}

removeInstance() {
  _localAppName=$1

  _instanceIDS=$(docker ps -a | grep $_localAppName | awk '{printf $1 " "}')

  if [ "$_instanceIDS" != "" ] ; then
    echo "Removing instance(s): $_instanceIDS"
    docker rm -f $_instanceIDS
  fi
}

stopRunningInstances() {
  _localAppName=$1
  _instanceIDS=$(docker ps | grep $_localAppName | awk '{printf $1 " "}')
  if [ "$_instanceIDS" != "" ] ; then
    echo "Stopping instance(s): $_instanceIDS"
    docker stop $_instanceIDS
  fi
}

removeImage() {
  _localAppName=$1
  _imageIDS=$(docker images | grep $_localAppName | awk '{printf $1 " "}')
  if [ "$_imageIDS" != "" ] ; then
    echo "Removing images(s): $_imageIDS"
    docker rmi $_imageIDS
  fi
}

start() {
    _composeFile=$1
    docker-compose -f $_composeFile up -d
}

rollback() {
  previous=$(readlink ./images/previous)

  if [ "$?" = "0" ] ; then
    echo "Rolling back to: $previous"
  fi
}

link() {
  _appName=$1
  _image=$2
  echo "APPNAME: $_appName"
  echo "image: $_image"


  existingCurrent=$(readlink ./images/${_appName}_current)

  if [ "$?" = "0" ] ; then
    echo "Moving existing current $existingCurrent to previous"

    previous=$(readlink ./images/${_appName}_previous)

    if [ "$?" = "0" ] ; then
      echo "remove previous: ${_appName}_previous"
      rm -f ./images/${_appName}_previous
    fi

    ln -s $existingCurrent ./images/${_appName}_previous
    rm -f ./images/${_appName}_current
  fi

  ln -s ./images/$_image ./images/${_appName}_current
}

install() {
  echo "in install"
  _appName=$1
  echo $DOCKER_IMAGE_TARBALL
  _fileName=$(basename $DOCKER_IMAGE_TARBALL)
  mv $DOCKER_IMAGE_TARBALL ./images

  docker load -i ./images/$_fileName
  link $_appName $_fileName

  if [ "$?" != "0" ] ; then
    exit $DOCKER_LOAD_ERROR
  fi
}

process_arg() {

  arg=`echo "$*" | awk '{print $1}'`
  #echo "ARG: $arg"
  case "$arg" in

    "--install")
      shift
      DOCKER_IMAGE_TARBALL=$(echo "$*" | awk '{print $1}')
      shift
      APP_NAME=$(echo "$*" | awk '{print $1}')

      shift
      COMPOSE_FILE=$(echo "$*" | awk '{print $1}')

      if [ ! -f $DOCKER_IMAGE_TARBALL ] ; then
        echo "Could not find docker image tarball: $DOCKER_IMAGE_TARBALL"
        exit 1
      fi

      COMMANDS[$NUM_COMMANDS]="stopRunningInstances $APP_NAME"
      let NUM_COMMANDS=$NUM_COMMANDS+1

      COMMANDS[$NUM_COMMANDS]="removeInstance $APP_NAME"
      let NUM_COMMANDS=$NUM_COMMANDS+1

      COMMANDS[$NUM_COMMANDS]="removeImage $APP_NAME"
      let NUM_COMMANDS=$NUM_COMMANDS+1

      COMMANDS[$NUM_COMMANDS]="install $APP_NAME"
      let NUM_COMMANDS=$NUM_COMMANDS+1

      COMMANDS[$NUM_COMMANDS]="start $COMPOSE_FILE"
      let NUM_COMMANDS=$NUM_COMMANDS+1

      ;;
    "--rollback")
      ;;

    "--stop")
      shift
      APP_NAME=$(echo "$*" | awk '{print $1}')

      COMMANDS[$NUM_COMMANDS]="stopRunningInstances $APP_NAME"
      let NUM_COMMANDS=$NUM_COMMANDS+1

      COMMANDS[$NUM_COMMANDS]="removeInstance $APP_NAME"
      let NUM_COMMANDS=$NUM_COMMANDS+1
      ;;
      "--start-all")
        COMMANDS[$NUM_COMMANDS]="docker-compose -f /home/deploy/docker/services/compose.yml up -d"
        let NUM_COMMANDS=$NUM_COMMANDS+1
        COMMANDS[$NUM_COMMANDS]="docker-compose -f /home/deploy/docker/kiss_arch/kissarch_auth-compose.yml up -d"
        let NUM_COMMANDS=$NUM_COMMANDS+1
        COMMANDS[$NUM_COMMANDS]="docker-compose -f /home/deploy/docker/kiss_arch/kissarch_google-compose.yml up -d"
        let NUM_COMMANDS=$NUM_COMMANDS+1
      ;;
      "--start-core-services")
        COMMANDS[$NUM_COMMANDS]="docker-compose -f /home/deploy/docker/services/compose.yml up -d"
        let NUM_COMMANDS=$NUM_COMMANDS+1
      ;;
      "--stop-all")
        COMMANDS[$NUM_COMMANDS]="docker-compose -f /home/deploy/docker/services/compose.yml down"
        let NUM_COMMANDS=$NUM_COMMANDS+1
        COMMANDS[$NUM_COMMANDS]="docker-compose -f /home/deploy/docker/kiss_arch/kissarch_auth-compose.yml down"
        let NUM_COMMANDS=$NUM_COMMANDS+1
        COMMANDS[$NUM_COMMANDS]="docker-compose -f /home/deploy/docker/kiss_arch/kissarch_google-compose.yml down"
        let NUM_COMMANDS=$NUM_COMMANDS+1
      ;;
  esac
}


process_args() {
  while [ "$*" != "" ] ; do
    process_arg $*
    shift
  done

  if [ $NUM_COMMANDS -eq 0 ] ; then
    echo "Could not find a command to execute"
    usage
    exit 1
  fi

  ct=0
  while [ $ct -lt $NUM_COMMANDS ] ; do
    echo ${COMMANDS[$ct]}
    ${COMMANDS[$ct]}
    let ct=$ct+1
  done

}
