(function(){var e=YAHOO.util.Dom,h=YAHOO.util.Event;Alfresco.dashlet.DynamicWelcome=function f(k,l,o,m,n){Alfresco.dashlet.DynamicWelcome.superclass.constructor.call(this,"Alfresco.dashlet.DynamicWelcome",k);this.name="Alfresco.dashlet.DynamicWelcome";this.dashboardUrl=l;this.createSite=null;this.dashboardType=o;this.site=m;this.siteTitle=decodeURIComponent(n);this.services.preferences=new Alfresco.service.Preferences();return this};YAHOO.extend(Alfresco.dashlet.DynamicWelcome,Alfresco.component.Base,{site:"",dashboardType:"",dashboardUrl:"",closeDialog:null,createSite:null,onReady:function c(){h.addListener(this.id+"-close-button","click",this.onCloseClick,this,true);h.addListener(this.id+"-createSite-button","click",this.onCreateSiteLinkClick,this,true);h.addListener(this.id+"-requestJoin-button","click",this.onRequestJoinLinkClick,this,true)},onCreateSiteLinkClick:function a(k){if(this.createSite===null){this.createSite=Alfresco.module.getCreateSiteInstance()}this.createSite.show();h.stopEvent(k)},onRequestJoinLinkClick:function d(k){Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+"api/sites/"+encodeURIComponent(Alfresco.constants.SITE)+"/invitations",dataObj:{invitationType:"MODERATED",inviteeUserName:Alfresco.constants.USERNAME,inviteeComments:"",inviteeRoleName:"SiteConsumer"},successCallback:{fn:this._requestJoinSuccess,scope:this},failureCallback:{fn:this._failureCallback,obj:this.msg("message.request-join-failure",Alfresco.constants.USERNAME,this.siteTitle),scope:this}});this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:this.msg("message.request-joining",Alfresco.constants.USERNAME,this.siteTitle),spanClass:"wait",displayTime:0});h.stopEvent(k)},_requestJoinSuccess:function j(k){if(this.widgets.feedbackMessage){this.widgets.feedbackMessage.destroy();this.widgets.feedbackMessage=null}Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.success"),text:this.msg("message.request-join-success",Alfresco.constants.USERNAME,this.siteTitle),buttons:[{text:this.msg("button.ok"),handler:function l(){this.destroy();window.location=Alfresco.constants.URL_CONTEXT},isDefault:true}]})},_failureCallback:function g(l,k){if(this.widgets.feedbackMessage){this.widgets.feedbackMessage.destroy();this.widgets.feedbackMessage=null}if(k){Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.failure"),text:k})}},onCloseConfirm:function b(m){if(this.dashboardType=="user"){Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.URL_SERVICECONTEXT+"components/dashlets/dynamic-welcome",dataObj:{dashboardUrl:this.dashboardUrl},successCallback:{fn:function(){document.location.href=Alfresco.constants.URL_PAGECONTEXT+""+this.dashboardUrl},scope:this},failureMessage:this.msg("message.saveFailure"),failureCallback:{fn:function(){this.widgets.feedbackMessage.destroy()},scope:this}})}else{var k=this.site.substring(1).replace(/\/|\./g,"-");this.services.preferences.set("org.alfresco.share.siteWelcome."+k,false,{successCallback:{fn:function l(){document.location.reload(true)}}})}},onCloseClick:function i(l,k){var m=this;Alfresco.util.PopupManager.displayPrompt({title:this.msg("panel.delete.header"),text:this.msg("panel.delete.msg"),buttons:[{text:this.msg("button.yes"),handler:function(){this.destroy();m.onCloseConfirm()}},{text:this.msg("button.no"),handler:function(){this.destroy()},isDefault:true}]});h.stopEvent(l)}})})();