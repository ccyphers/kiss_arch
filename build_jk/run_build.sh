docker build -t build_jk_tools .
docker run -v `pwd`:/build build_jk_tools /build/build.sh
