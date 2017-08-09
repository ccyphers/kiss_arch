# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/xenial64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  config.vm.network "forwarded_port", guest: 8000, host: 8010
  config.vm.network "forwarded_port", guest: 8001, host: 8011

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.254.2"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  #config.vm.synced_folder "./", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "fix-no-tty", type: "shell", inline: <<-SHELL
    umask 0027
    echo "umask 0027" >> /etc/profile
    useradd -r -s /opt/jailkit-2.19/sbin/jk_lsh deploy
    mkdir -p /home/deploy/images
    cp -R /vagrant/docker /home/deploy
    cp -R /vagrant/setup /home/deploy
    cat /vagrant/deploy/sudoers >> /etc/sudoers
    rm -f /vagrant/deploy/deploy.ssh*
    ssh-keygen -N "" -f /vagrant/deploy/deploy.ssh
    mkdir -p /home/deploy/.ssh
    cp /vagrant/deploy/deploy.ssh.pub /home/deploy/.ssh/authorized_keys
    chmod 550 /home/deploy/.ssh
    chmod 440 /home/deploy/.ssh/authorized_keys
    chown -R root:deploy /home/deploy
    apt-get update
    apt-get install -y \
      apt-transport-https ca-certificates curl nodejs \
      software-properties-common software-properties-common python-software-properties
    apt-key fingerprint 0EBFCD88
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository \
      "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    apt-get update
    apt-get install -y docker-ce docker-compose
    cd /vagrant/build_jk
    ./run_build.sh
    tar -xvjf /vagrant/build_jk/jailkit-2.19.tar.bz2 -C /
    cp /vagrant/deploy/jk_lsh.ini /opt/jailkit-2.19/etc/jailkit/
    mkdir /home/pg_data

    git clone https://github.com/ccyphers/docker_kong /tmp/docker_kong
    cd /tmp/docker_kong
    docker build -t ccyphers/kong:latest .
    docker-compose -f /home/deploy/docker/services/compose.yml up -d
    echo "Waiting on postgres"
    sleep 20
    docker exec services_postgres_1 createdb -U postgres -h localhost kong
    docker exec services_postgres_1 createuser -U postgres -h localhost kong
    docker exec services_postgres_1 createdb -U postgres -h localhost auth_prod
    docker-compose -f /home/deploy/docker/services/compose.yml up -d
    ufw allow 8000/tcp
    cd /tmp
    wget https://nodejs.org/dist/v8.2.1/node-v8.2.1-linux-x64.tar.xz
    unxz node-v8.2.1-linux-x64.tar.xz
    tar -xvf node-v8.2.1-linux-x64.tar -C /opt
    echo "export PATH=/opt/node-v8.2.1-linux-x64/bin:$PATH" >> /etc/profile
    cd /vagrant/kong_setup

    /opt/node-v8.2.1-linux-x64/bin/node index.js
    #sed -i -e "s/exit 0/docker-compose -f \/home\/deploy\/docker\/services\/compose.yml up -d/g" /etc/rc.local

  SHELL
end
