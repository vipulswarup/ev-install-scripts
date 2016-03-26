apt-get update
apt-get upgrade
dpkg-reconfigure tzdata

#set locale = Vipul 19 Aug 2015
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
locale-gen en_US.UTF-8
dpkg-reconfigure locales

apt-get install postgres
