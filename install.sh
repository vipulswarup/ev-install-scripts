#script for installing background OCR functionality in EisenVault
#Author: Vipul Swarup
#Date: 19 June 2015
#NOTE: This script must be run as sudo or su
#NOTE: This script uses the apt-get package manager, which is standard on ubuntu
#NOTE: This script assumes Alfresco Root is /opt/alfresco

#step 1 - copy pdf2pdf.sh to /opt/ocr and make it executable
mkdir /opt/ocr
cp pdf2pdf.sh /opt/ocr
chmod a+x /opt/ocr/convert2pdf.sh

#step 2 - stop alfresco
/opt/alfresco/alfresco.sh stop

#step 3 - restore share.war and alfresco.war to OOB versions
cd share_oob
zip -r ../share_oob.zip .
cd ../alfresco_oob
zip -r ../alfresco_oob.zip .
cd ..
cp share_oob.zip /opt/alfresco/tomcat/webapps/share.war
cp alfresco_oob.zip /opt/alfresco/tomcat/webapps/alfresco.war

rm share_oob.zip
rm alfresco_oob.zip

#step 4 copy and apply AMP file with Alfresco code changes
#to be done manually
cp evThemes_eisenVaultTheme.amp /opt/alfresco/amps_share/
cp share-amp.amp /opt/alfresco/amps_share/
cp repo-amp.amp /opt/alfresco/amps/
/opt/alfresco-5.0.d/bin/apply_amps.sh -force

cp ev_share_header_modules.jar /opt/alfresco/tomcat/shared/lib

#step 5 make a temp directory
mkdir /tmp/Alfresco

#step 6 - remove old alfresco, solr4 and share log files
rm /opt/alfresco/*.log

#step 7 - stop alfresco
/opt/alfresco/alfresco.sh start
