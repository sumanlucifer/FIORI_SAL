sap.ui.define(["sap/fe/core/AppComponent"], function(AppComponent) {
    "use strict";

    return AppComponent.extend("chat.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
               
            this.renderRecastChatbot();
            this._getRenderer();
        },
        renderRecastChatbot: function() {
            debugger;
            if (!document.getElementById("cai-webchat")) {
                var s = document.createElement("script");
                s.setAttribute("id", "cai-webchat");
                s.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");
                s.setAttribute("channelId", "15c31348-867a-40b9-9157-cf594ecdba7b");
                s.setAttribute("token","3fdcb50dfe8b7bef23974ebd11a9fcd3");
                s.setAttribute("apiRoot","/public/api");
                document.body.appendChild(s);
            }

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "/public/api/connect/v1/webhook/15c31348-867a-40b9-9157-cf594ecdba7b/preferences");
            xmlHttp.setRequestHeader("authorization", "3fdcb50dfe8b7bef23974ebd11a9fcd3" );
            xmlHttp.send();
        }, 

     _getRenderer: function(){
            var that = this,
            // @ts-ignore
            oDeferred = new jQuery.Deferred(),
            oRenderer;

            // @ts-ignore
            that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
            if (!that._oShellContainer){
                oDeferred.reject(
                    "Illegal State");
                } else {
                    oRenderer = that._oShellContainer.getRenderer();
                    if (oRenderer){
                        oDeferred.resolve(oRenderer);
                    } else {
                        that._onRendererCreated = function(oEvent){
                            oRenderer = oEvent.getParameter("renderer");
                            if (oRenderer) {
                                oDeferred.resolve(oRenderer);
                            } else {
                                oDeferred.reject("Illegal State");
                            }
                        };
                        that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
                        }
                    }
                    return oDeferred.promise();
                    }  
    });
});
