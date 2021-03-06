apt-get update
apt-get upgrade
apt-get install ghostscript imagemagick libjpeg62 libart-2.0-2 libreoffice fontconfig libice6 libsm6 libxt6 libxrender1 libfontconfig1 libcups2 libxinerama1 libglu1-mesa
dpkg-reconfigure tzdata

#set locale = Vipul 19 Aug 2015
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
locale-gen en_US.UTF-8
dpkg-reconfigure locales
git config --global http.sslverify false
