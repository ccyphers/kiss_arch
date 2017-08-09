#!/bin/sh

cd /build 
rm -rf jailkit-2.19*
wget https://olivier.sessink.nl/jailkit/jailkit-2.19.tar.bz2
tar -xvjf jailkit-2.19.tar.bz2
cd jailkit-2.19
./configure --prefix=/opt/jailkit-2.19
make
make install
cd ../
rm -rf jailkit-2.19
tar -cvjf jailkit-2.19.tar.bz2 /opt/jailkit-2.19
