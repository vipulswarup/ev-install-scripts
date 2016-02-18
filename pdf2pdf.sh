#!/bin/bash
timestamp="$(date -u +%N)"
#echo $timestamp
tempfolder_tess=/tmp/tesseract_temp_$timestamp
tempfolder_gs=/tmp/gs_temp_$timestamp

echo "$tempfolder_tess"
echo "$tempfolder_gs"

mkdir "$tempfolder_tess"
mkdir "$tempfolder_gs"

echo "mime type is $3" 
echo "language is $4"

if [ x"$3" = x"pdf" ]; then
	#echo "pdffonts $1"
        #checkpdf=$(pdffonts $1 | grep yes)
	#echo "$checkpdf"
        #if [ ! -z "$checkpdf" ]; then
                #echo "File already readable to need to OCR it. Exiting."
               # exit 0
        #fi

	echo "Attempting to burst pdf file" 
	#attempt to split pdf into multiple pages
	cd "$tempfolder_gs"
	pdftk "$1" burst 
	rm doc_data.txt
	#attempt to convert each  page into jpeg using parallel processing
	echo "Executing: parallel --gnu convert -density 175 {} {.}.jpg ::: $tempfolder_gs/*" 
	parallel --gnu "convert -density 175 {} {.}.jpg" ::: "$tempfolder_gs"/*
	mv "$tempfolder_gs"/*.jpg "$tempfolder_tess"/
else
	if [ x"$3" = x"tiff" -o x"$3" = x"tif" ]; then
		echo "Attempting to convert tiff to jpg" 	
		convert           \
   			-density 175  \
    			"$1"      \
    			"$tempfolder_tess"/temp_$timestamp.jpg
	else
		echo "Copying png or jpg to temp folder" 	
		cp "$1" "$tempfolder_tess"
	fi
fi


	

jpgCount=$(ls -1 "$tempfolder_tess" | wc -l)
echo $jpgCount

if [ "$jpgCount" -gt "1" ]; then
	echo "Attempting to run tesseract using parallel" 	
	#if page count >1, use parallel to run tesseract and then assemble into target PDF
	echo "Executing: parallel --gnu tesseract {} {.} pdf -l $4 ::: $tempfolder_tess/*.jpg" 
	parallel --gnu "tesseract -l $4 {} {.} pdf" ::: "$tempfolder_tess"/*.jpg
	#loop the folder; convert the ocr'ed pdf pages into smaller size
	for f in $tempfolder_tess/*.pdf
	do
  		echo "Processing $f file..."
		filename=$(cut -d/ -f4 <<< $f)
		# take action on each file. reduce the size using ghostscript
		gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=$tempfolder_ocr/$filename $f
	done

	pdfunite "$tempfolder_ocr"/*.pdf "$2".pdf 2>/tmp/Alfresco/pdfunite.out
else
	if [ "$jpgCount" -eq "1" ]; then
		#if there is only 1 page, run simple tesseract and copy output to target file
		cd ""$tempfolder_tess""
		currentFolder=$(pwd)
		echo "Going to convert single file of mimetype $3" 
		sourceFile=""
		#set source file name based on mimetype
		if [ x"$3" = x"png" -o x"$3" = x"jpg" -o x"$3" = $3"jpeg" ]; then 
			sourceFile="$1"
			echo "Source file = $sourceFile"
		else
				sourceFile=temp_$timestamp.jpg
				echo "Source file = $sourceFile" 
				echo "Renaming temp jpg file"
                                mv ./*.jpg ./$sourceFile
			
		fi
		echo "Source file for single page conversion is $sourceFile" 
		targetPDF=temp_out_$timestamp
		tesseract "-l" "$4" "$sourceFile" "$targetPDF" "pdf" 
		currentFolder=$(pwd)
		echo "currently in"		
		echo $currentFolder
		ls -al
		cp $targetPDF.pdf "$2"
	else
		echo "found 0 files"
		exit 1
	fi
fi


rm -rf "$tempfolder_tess"
rm -rf "$tempfolder_gs"

exit 0


