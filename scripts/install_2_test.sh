#NOTE: run this only after successfully running install.sh and testing that the installation works -- i.e. tomcat has started and the DMS works.

alfresco_dir=$1
echo "Working in $alfresco_dir"

#step 1 - remove extra theme files
$alfresco_dir/alfresco.sh stop
rm $alfresco_dir/tomcat/webapps/share/WEB-INF/classes/alfresco/site-data/themes/default.xml
rm $alfresco_dir/tomcat/webapps/share/WEB-INF/classes/alfresco/site-data/themes/gdocs.xml
rm $alfresco_dir/tomcat/webapps/share/WEB-INF/classes/alfresco/site-data/themes/greenTheme.xml
rm $alfresco_dir/tomcat/webapps/share/WEB-INF/classes/alfresco/site-data/themes/hcBlack.xml
rm $alfresco_dir/tomcat/webapps/share/WEB-INF/classes/alfresco/site-data/themes/lightTheme.xml
rm $alfresco_dir/tomcat/webapps/share/WEB-INF/classes/alfresco/site-data/themes/yellowTheme.xml

#step 2 - add files for the repo-size dashlet to work
cp ../ev_custom_files/dashlets/* $alfresco_dir/tomcat/webapps/share/components/dashlets

#step 3 - delete war backup files, to save space
rm $alfresco_dir/tomcat/webapps/alfresco.war*.bak
rm $alfresco_dir/tomcat/webapps/share.war*.bak

#step 4 - start alfresco
echo "Trying to start alfresco"
$alfresco_dir/alfresco.sh start
