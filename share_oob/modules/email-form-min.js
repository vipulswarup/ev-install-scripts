(function(){var b=YAHOO.util.Dom,g=YAHOO.util.KeyListener,t=YAHOO.util.Event,n=YAHOO.util.Selector;var l=Alfresco.util.encodeHTML,p=Alfresco.util.hasEventInterest;Alfresco.module.EmailForm=function(u){Alfresco.module.EmailForm.superclass.constructor.call(this,"Alfresco.module.EmailForm",u,["button","container","connection"]);this.components={};if(u!="null"){YAHOO.Bubbling.on("itemSelected",this.onRecipientsSelected,this)}return this};YAHOO.extend(Alfresco.module.EmailForm,Alfresco.component.Base,{options:{templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/email-form"},components:null,containerDiv:null,recipients:[],recipientsCache:{},showDialog:function o(u){if(!this.containerDiv){Alfresco.util.Ajax.request({url:this.options.templateUrl,dataObj:{htmlid:this.id},successCallback:{fn:this.onTemplateLoaded,obj:u,scope:this},failureMessage:"Could not load template:"+this.options.templateUrl,execScripts:true})}else{this._showDialog(u)}},onTemplateLoaded:function c(v,u){this.containerDiv=document.createElement("div");this.containerDiv.setAttribute("style","display:none");this.containerDiv.innerHTML=v.serverResponse.responseText;var w=b.getFirstChild(this.containerDiv);this.widgets.dialog=Alfresco.util.createYUIPanel(w);this.widgets.selectRecipientsButton=Alfresco.util.createYUIButton(this,"selectRecipients-button",this.onSelectRecipientsClick,{disabled:true});this.widgets.useTemplateMenu=Alfresco.util.createYUIButton(this,"useTemplate-menu",this.onUseTemplateMenuSelect,{type:"menu",menu:"useTemplate-options",lazyloadmenu:false});this.widgets.discardTemplateButton=Alfresco.util.createYUIButton(this,"discardTemplate-button",this.onDiscardTemplateButtonClick);this.widgets.okButton=Alfresco.util.createYUIButton(this,"ok-button",null,{type:"submit"});this.widgets.cancelButton=Alfresco.util.createYUIButton(this,"cancel-button",this.onCancelClick);var z=new Alfresco.forms.Form(this.id+"-form");this.widgets.form=z;z.addValidation(this.id+"-recipients",this.mandatoryRecipients,{recipientsContainerEl:b.get(this.id+"-recipients")},"keyup",null,{validationType:"mandatory"});z.addValidation(this.id+"-subject",Alfresco.forms.validation.mandatory,null,"keyup");z.addValidation(this.id+"-message",Alfresco.forms.validation.mandatory,null,"keyup");z.setSubmitElements(this.widgets.okButton);var y=this;var A=function x(D,C){var B=YAHOO.Bubbling.getOwnerByTagName(C[1].anchor,"li");if(B!==null){B.parentNode.removeChild(B);y.widgets.form.validate()}return true};YAHOO.Bubbling.addDefaultAction("email-recipient-action",A);z.doBeforeAjaxRequest={fn:function(D,E){var C=D.dataObj;var B={recipients:C.recipients,subject:C.subject};if(C.template&&C.template.length>0){B.template=C.template}else{B.message=C.message}YAHOO.Bubbling.fire("emailFormCompleted",{options:B,eventGroup:this});this.widgets.dialog.hide();return false},obj:null,scope:this};z.applyTabFix();z.init();YAHOO.util.Event.addListener(document,"keydown",function(B){if(B.keyCode==27){this.onCancelClick()}},this,true);Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"components/people-finder/authority-finder",dataObj:{htmlid:this.id+"-authority-finder"},successCallback:{fn:this.onAuthorityFinderLoaded,scope:this},failureMessage:this.msg("message.authorityfinderfail"),execScripts:true});this._showDialog(u)},onAuthorityFinderLoaded:function i(u){b.get(this.id+"-authority-finder").innerHTML=u.serverResponse.responseText;this.widgets.authorityPicker=Alfresco.util.createYUIPanel(this.id+"-authority-picker");this.components.authorityFinder=Alfresco.util.ComponentManager.get(this.id+"-authority-finder");this.components.authorityFinder.setOptions({viewMode:Alfresco.AuthorityFinder.VIEW_MODE_COMPACT,singleSelectMode:true,minSearchTermLength:3});var v=function(w){if(!w){var w=window.event}if(w.keyCode==27){this.hide();w.cancelBubble=true;w.returnValue=false;if(w.stopPropagation){w.stopPropagation()}if(w.preventDefault){w.preventDefault()}}};this.widgets.authorityPicker.hidePickerListener=v;this.widgets.authorityPicker.beforeShowEvent.subscribe(function(){YAHOO.util.Event.addListener(this.element,"keydown",this.hidePickerListener,this,true)});this.widgets.authorityPicker.beforeHideEvent.subscribe(function(){YAHOO.util.Event.removeListener(this.element,"keydown",this.hidePickerListener)});this.widgets.selectRecipientsButton.set("disabled",false)},mandatoryRecipients:function m(z,v,y,x,u,w){return n.query("input[type=hidden]",v.recipientsContainerEl).length>0},_showDialog:function f(u){u=u?u:{};b.get(this.id+"-recipients").innerHTML="";this.recipients=YAHOO.lang.isArray(u.recipients)?u.recipients:[];this._renderRecipients(this.recipients);b.get(this.id+"-subject").value=u.subject?u.subject:"";var y=b.get(this.id+"-message");y.value=u.message&&u.message.length>0?u.message:"";if(u.template){var x=this.widgets.useTemplateMenu.getMenu().getItems();for(var w=0,v=x.length;w<v;w++){if(x[w].value==u.template){this.widgets.useTemplateMenu.set("label",x[w].cfg.getProperty("text"))}}this._loadTemplate(u.template)}else{y.removeAttribute("readonly");b.get(this.id+"-template").value=""}this.widgets.okButton.set("disabled",false);this.widgets.dialog.show()},_renderRecipients:function k(v){if(v.length>0){var u=v[v.length-1];if(this.recipientsCache[u]){this._renderRecipient(u);v.pop();this._renderRecipients(v)}else{if(u.indexOf("GROUP_")==0){if(u==="GROUP_EVERYONE"){this.recipientsCache[u]="EVERYONE";this._renderRecipients(v)}else{Alfresco.util.Ajax.jsonGet({url:Alfresco.constants.PROXY_URI_RELATIVE+"api/groups/"+u.substring(6),successCallback:{fn:function(w,y){var x=w.json.data;this.recipientsCache[u]=x.displayName;this._renderRecipients(y.recipientIds)},obj:{recipientIds:v},scope:this}})}}else{Alfresco.util.Ajax.jsonGet({url:Alfresco.constants.PROXY_URI_RELATIVE+"api/people/"+encodeURIComponent(u),successCallback:{fn:function(x,y){var w=x.json;this.recipientsCache[u]=w.firstName+(w.lastName?" "+w.lastName:"");this._renderRecipients(y.recipientIds)},obj:{recipientIds:v},scope:this}})}}}},_renderRecipient:function d(w){var v=b.get(this.id+"-recipients"),u=document.createElement("li");b.addClass(u,w.indexOf("GROUP_")==0?"group":"user");u.innerHTML='<a href="#" class="email-recipient-action"><input type="hidden" name="recipients[]" value="'+w+'"/><span>'+l(this.recipientsCache[w])+'</span><span class="remove">&nbsp;</span></a>';v.appendChild(u)},onSelectRecipientsClick:function h(u,v){this.components.authorityFinder.clearResults();this.widgets.authorityPicker.show()},onRecipientsSelected:function a(x,v){if(p(this.components.authorityFinder,v)){var y=v[1];if(y!==null){var w=0;for(var u=this.recipients.length;w<u;w++){if(this.recipients[w]==y){break}}if(w==u){this.recipients.push(y.itemName);this.recipientsCache[y.itemName]=y.displayName}this._renderRecipient(y.itemName);this.widgets.form.validate()}this.widgets.authorityPicker.hide()}},onUseTemplateMenuSelect:function r(w,v,u){this.widgets.useTemplateMenu.set("label",v[1].cfg.getProperty("text"));this._loadTemplate(v[1].value)},_loadTemplate:function j(u){var v=b.get(this.id+"-message"),w=b.get(this.id+"-template");Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/node/"+u.replace("://","/")+"/content",successCallback:{fn:function(x){w.value=u;v.value=x.serverResponse.responseText;v.setAttribute("readonly",true);this.widgets.form.validate()},scope:this},failureCallback:{fn:function(x){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.getTemplate-failure",u)});w.value="";v.value="";v.removeAttribute("readonly");this.widgets.form.validate()},scope:this}})},onDiscardTemplateButtonClick:function s(u,w){var v=b.get(this.id+"-message");v.value="";v.removeAttribute("readonly");b.get(this.id+"-template").value="";this.widgets.form.validate()},onCancelClick:function e(u,v){this.widgets.dialog.hide()}});var q=new Alfresco.module.EmailForm("null")})();