# KISS Architecture

## What is KISS Architecture? 
As developers, we try to keep our code dry, but often the said can't be said for the process of going from development to production. Have you been in situations where somebody made the decision that they were going to use Docker, just for the namesake of popularity? Without proper thought out design decisions everybody’s life can become a nightmare.

One such example, that I've heard about is adding a bunch of stuff to the Docker image such that the entry point was not the application 
you would be expecting to run, but instead another daemon to monitor external system such as consul key/values to populate the application's 
config file. This daemon then would then ultimately fork the required application that's supposed to be the main functionality of the container.

This overview isn't going to cover how to get a configuration on a per environment basis into your application, but instead focus on 
making it as painless as possible to go from development to production. There is a plethora of ways to inject environment variables 
into your Docker stack, leaving the sole entry point for the Dockerfile or docker-compose.yml to be your application and this
is left up to the reader.

## Typical Architecture

![Typical Architecture Diagram](https://raw.githubusercontent.com/ccyphers/kiss_arch/master/example_arch_dia.png "")

## Smooth transition: Dev to Prod

First and foremost, there are lot of powerful and full-fledged systems out there, such as kubernetes, however for 95%+ of the applications out there, 
even complex and high load applications I'd like to review some practices you can use, that will take less time to implement and get the team up to 
speed on. However, there's nothing outlined below that can't easily be re-used and repurposed for things such as kubernetes.

For simplicity sakes, a push to production model is going to be utilized as all it requires is ssh access and traditional shell tools. This 
yields in easy setup without a ton of additional requirements you would have with things such as puppet or chef. Feel free to use alternative tools,
as they have great value, but you must get started somewhere and by using alternative models you can migrate components over time if 
desired. At the same time, the push model can be easily scaled to a magnitude of docker host systems with ease and configuration management and 
deploys covered by tools like Capistrano. In the orchestration piece, you would simply execute the same scripts that are outlined below.


### A word about security
If you are going to use the push model, don't take shortcuts from what is outlined. At no point should you put 
massive amounts users in the docker group, where they have the full power to do anything with docker as they please. Only place users on a need to access basis 
in the docker group. First and foremost, create a deploy user using a restricted shell, for this guide jk_lsh is utilized.

Install Jailkit on all Docker host(no OS X and Windows are docker not hosts they are docker clients)

    https://olivier.sessink.nl/jailkit/

Followed by adding the deploy user:

    useradd -r -s /opt/jailkit-2.19/sbin/jk_lsh deploy

Before you copy files over to /home/deploy ensure that umask is setup so that permissions allow the user to write, the group not to write and other no permissions:

    umask 0027;echo "umask 0027" >> /etc/profile
    
Copy over deploy items to all docker host instances. From this repo copy over directories docker and setup to /home/deploy. Also create the directory /home/deploy/images.

Setup ssh access for the deploy user:

    ssh-keygen -N "" -f /some/path/not/on/docker/host/deploy.ssh
    On Docerk host:
    umask 0027
    mkdir -p /home/deploy/.ssh
    copy over /some/path/not/on/docker/host/deploy.ssh.pub to docker_host:/home/deploy.ssh/authorized_keys
     
Secure up permissions:
    
    chmod 550 /home/deploy/.ssh
    chmod 440 /home/deploy/.ssh/authorized_keys
    chown -R root:deploy /home/deploy
    
When all is said and done check perms:

    find /home/deploy -type f -exec ls -l {} \;
    -rw-r----- 1 root deploy 306 Aug  9 00:57 /home/deploy/setup/compose-run-auth-migrations.yml
    -rw-r----- 1 root deploy 300 Aug  9 00:57 /home/deploy/setup/compose-run-auth-seeds.yml
    -rwxr-x--- 1 root deploy 82 Aug  9 00:57 /home/deploy/setup/db_seed.sh
    -rw------- 1 root deploy 46235 Aug  9 00:57 /home/deploy/setup/ubuntu-xenial-16.04-cloudimg-console.log
    -rwxr-x--- 1 root deploy 87 Aug  9 00:57 /home/deploy/setup/db_migrate.sh
    -rw-r----- 1 root deploy 587 Aug  9 00:57 /home/deploy/docker/services/compose.yml
    -rw-r----- 1 root deploy 191 Aug  9 00:57 /home/deploy/docker/kiss_arch/kissarch_google-compose.yml
    -rw-r----- 1 root deploy 254 Aug  9 00:57 /home/deploy/docker/kiss_arch/kissarch_auth-compose.yml
    -rw-r----- 1 root deploy 3889 Aug  9 11:36 /home/deploy/docker/env.sh
    -rwxr-x--- 1 root deploy 74 Aug  9 00:57 /home/deploy/docker/docker_mgmt.sh
    -r--r----- 1 root deploy 400 Aug  9 00:57 /home/deploy/.ssh/authorized_keys
    
    find /home/deploy -type d -exec ls -ld {} \;
    drwxr-x--- 6 root deploy 4096 Aug  9 00:57 /home/deploy
    drwxr-x--- 2 root deploy 4096 Aug  9 00:57 /home/deploy/setup
    drwxr-x--- 5 root deploy 4096 Aug  9 11:36 /home/deploy/docker
    drwxr-x--- 2 root deploy 4096 Aug  9 00:57 /home/deploy/docker/services
    drwxr-x--- 2 root deploy 4096 Aug  9 00:57 /home/deploy/docker/kiss_arch
    drwxr-x--- 2 root deploy 4096 Aug  9 00:57 /home/deploy/docker/images
    drwxr-x--- 2 root deploy 4096 Aug  9 01:12 /home/deploy/images
    dr-xr-x--- 2 root deploy 4096 Aug  9 00:57 /home/deploy/.ssh
    

### Further restricting the deploy user's access 
   
On the docker host:

   Take the contents of deploy/sudoers and append to /etc/sudoers
   
    deploy    ALL=NOPASSWD: /home/deploy/docker/docker_mgmt.sh, /home/deploy/setup/db_migrate.sh, /home/deploy/setup/db_seed.sh
    
   Update jk_lsh's configuration:
      
      /path/to/jailkit/install/etc/jailkit/jk_lsh.ini:
      
      
      [deploy]
      paths= /usr/bin, /usr/lib
      executables= /usr/lib/sftp-server, /usr/bin/sudo, /usr/bin/scp
      allow_word_expansion = 1

Now with the combination of jk_lsh only allowing sudo, sftp-server and scp where sudo for the deploy user is limited to docker_mgmt.sh, db_migrate.sh, 
and db_seed.sh there is no way the deploy user can execute any other commands. In fact, you should test this out by:
 
     ssh -i /some/path/deploy.ssh deploy@dockerHost /bin/ls
     ssh -i /some/path/deploy.ssh deploy@dockerHost /bin/bash
 
Verify that any commands you try to execute that aren't permitted from the jk_lsh and sudoers rules are rejected. You should be disconnected from the 
ssh connection with no output from the command executed.
     

## Don't sweat the setup above
     
One word, Vagrant. For testing purposes see the Vagrant file which will get things up and running. You could easily automate the production setup for the deploy user
with a few additional scripts.


## Developers flow

Normally develop your application as you would on your local desktop, running the application you are working on outside of docker for speed purposes.
When it comes time you should be confident that deploying to the Vagrant VM and spot checking functionality is good enough to move the code along, what's running in Vagrant 
will ultimately be the SAME as production.

## Deploying examples

After you have vagrant up:

    cd auth
    
    # seed DB - if not previously executed
    ./vg_db_setup.sh
    
    ./build.sh --> will output something like "Time to deploy: kiss_arch_auth_20170809095303.tar"
    ./deploy.sh kiss_arch_auth_20170809095303.tar
  
    cd ../google
    run build.sh and deploy.sh just like auth project

  
Test:
  
      curl http://localhost:8010/api/search
      {"message":"Unauthorized"}
      
      Should require JWT:
      
      token=$(curl -X POST -d username=demo -d password=somepassword localhost:8010/api/login 2>/dev/null)
      curl -H 'Authorization: Bearer $token' --url http://localhost:8010/api/search
      
      Should now get search results
  
## Kong
  
I will discuss this in more details later. Just note, you can easily run a kong instance on OS X and have all your development
go through the API Gateway, taking advantage of a single point where all traffic is routed to specific services. Some of what this buys you is that each service
doesn't have to have knowledge of other services. Instead each service only needs to know about how to get to KONG, simplifying the spaghetti 
code you often see in micro-services.

For now you might want to look at kong_setup/index.js just to get an idea as to some of the power to the restful interface to defining your API
and some common practices you can use with plugins so that your services don't have to have any concern with implementing common/shared types of things.
