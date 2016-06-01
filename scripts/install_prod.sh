#script for installing background OCR functionality in EisenVault
#Author: Vipul Swarup
#Date: 19 June 2015
#NOTE: This script must be run as sudo or su
#NOTE: This script uses the apt-get package manager, which is standard on ubuntu
#NOTE: This script assumes Alfresco Root is passed as a parameter
#NOTE: Ensure the following packages are installed: ImageMagick, tesseract-ocr-eng, tesseract-ocr-ben, tesseract-ocr-hin, poppler-utils, parallel

alfresco_dir=$1
echo "Installing to $alfresco_dir"

#step 0 - install dependencies
apt-get install ImageMagick tesseract-ocr tesseract-ocr-eng tesseract-ocr-ben tesseract-ocr-hin poppler-utils parallel pdftk zip

#step 1 - copy pdf2pdf.sh to /opt/ocr and make it executable

mkdir /opt/ocr
cp pdf2pdf.sh /opt/ocr
chmod a+x /opt/ocr/pdf2pdf.sh

#step 2 - stop alfresco
$alfresco_dir/alfresco.sh stop

#step 3 - restore share.war and alfresco.war to OOB versions
cd ../ev_custom_files/share_oob
zip -r ../share_oob.zip .
cd ../alfresco_oob
zip -r ../alfresco_oob.zip .
cd ../../scripts
rm $alfresco_dir/tomcat/webapps/share.war
rm $alfresco_dir/tomcat/webapps/alfresco.war
rm -rf $alfresco_dir/tomcat/webapps/share
rm -rf $alfresco_dir/tomcat/webapps/alfresco
cp ../ev_custom_files/share_oob.zip $alfresco_dir/tomcat/webapps/share.war
cp ../ev_custom_files/alfresco_oob.zip $alfresco_dir/tomcat/webapps/alfresco.war

rm ../ev_custom_files/share_oob.zip
rm ../ev_custom_files/alfresco_oob.zip

#step 4 copy and apply AMP file with Alfresco code changes
#to be done manually
echo "Copying repo amps"
cp ../amps/alfresco-bulk-import-2.0.1.amp $alfresco_dir/amps/
cp ../amps/repo-amp.amp $alfresco_dir/amps/
cp ../amps/uploader-plus-repo-1.2.amp $alfresco_dir/amps/
cp ../amps/reposize-dashlet-repo.amp $alfresco_dir/amps/

echo "Copying share amps"
cp ../amps_share/evThemes_eisenVaultTheme.amp $alfresco_dir/amps_share/
cp ../amps_share/share-amp.amp $alfresco_dir/amps_share/
cp ../amps_share/uploader-plus-surf-1.2.amp $alfresco_dir/amps_share/
cp ../amps_share/reposize-dashlet-share.amp $alfresco_dir/amps_share/

$alfresco_dir/bin/apply_amps.sh -force -verbose

rm $alfresco_dir/tomcat/shared/lib/*.jar
#cp ../jars/*.jar $alfresco_dir/tomcat/shared/lib

#Backing alfresco-global.properties
cp -p $alfresco_dir/tomcat/shared/classes/alfresco-global.properties $alfresco_dir/tomcat/shared/classes/alfresco-global.properties_bak 

#step 5 make a temp directory
echo "Trying to create temporary directory"
mkdir /tmp/Alfresco

#step 6 - remove old alfresco, solr4 and share log files
echo "Trying to remove log files"
rm $alfresco_dir/*.log

#step 7 - start alfresco
echo "Trying to start alfresco"
$alfresco_dir/alfresco.sh start





