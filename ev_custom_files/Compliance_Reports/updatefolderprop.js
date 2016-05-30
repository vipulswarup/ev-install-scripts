var typesvalue="BLK";
var typesno=0;

var doc = document;
var parent = document.parent;

	for each (m in parent.children)
	{
		if(m.isDocument)
		{
		
          if(m.isSubType("ev:resume"))
			{
				if(typesvalue.indexOf("resume") < 0)
			  {
			   typesvalue=typesvalue+",resume";
			   typesno=typesno+1;
			  }
			}

		if(m.isSubType("ev:pf2"))
		{
		
	        if(typesvalue.indexOf("pf2") < 0)
			  {
			   typesvalue=typesvalue+",pf2";
			   typesno=typesno+1;
			  }
		 
	     }

		if(m.isSubType("ev:pf10"))
		{
			if(typesvalue.indexOf("pf10")  < 0)
			 {
		          typesvalue=typesvalue+",pf10";
		          typesno=typesno+1;
			 }
	     }

		if(m.isSubType("ev:esicform"))
		{
		    if(typesvalue.indexOf("esicform")  < 0)
	         {
		      typesvalue=typesvalue+",esicform";
	          typesno=typesno+1;
		     }
	     }
			
	
        } 

   }

        parent.properties["ev:alltypetext"]=typesvalue;
        parent.properties["ev:alltypes"]=typesno;      
	parent.save();
