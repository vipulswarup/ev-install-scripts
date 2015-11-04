apt-get update
apt-get upgrade
apt-get install ghostscript imagemagick libjpeg62 libgif4 libart-2.0-2 libreoffice
sudo dpkg-reconfigure tzdata

#set locale = Vipul 19 Aug 2015
export LANGUAGE=en_IN.UTF-8
export LANG=en_IN.UTF-8
export LC_ALL=en_IN.UTF-8
locale-gen en_IN.UTF-8
dpkg-reconfigure locales
