sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sal.salhr.controller.App", {
            onInit: function () {
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                
               var bIsUserManager = this.getOwnerComponent().getModel("EmpInfoModel").IsUserManager;
                this.fnGetLoggedInEmpInfo(bIsUserManager);
                
                // window.location.href= "https://saudi-airlines-cargo-company-sal-btp-cf-dev-8glkufj3-de4a228034.cfapps.eu10.hana.ondemand.com/";
            },
            
            onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name"),
                    oArguments = oEvent.getParameter("arguments");
                // Save the current route name
                this.currentRouteName = sRouteName;
                this.currentParent = oArguments.parentMaterial;
                this.currentChild = oArguments.childModule;
            },
            
            onStateChanged: function (oEvent) {
                var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
                    sLayout = oEvent.getParameter("layout");
    
                // Replace the URL with the new layout if a navigation arrow was used
                if (bIsNavigationArrow) {
                    this.oRouter.navTo(this.currentRouteName, {layout: sLayout, parentMaterial: this.currentParent,childModule: this.currentChild }, true);
                }
            },

            fnGetLoggedInEmpInfo: function (bIsUserManager) {
            
                debugger;
                this.getView().setBusy(true); 
                this.getOwnerComponent().getModel().read("/EmpInfo", {
                    urlParameters: {
                        "moreInfo": "true"
                    },
                    success: function (oData) {        
                        this.getView().setBusy(false);        
                        this.setModel(new JSONModel(oData.results[0]), "EmpInfoModel");
                        this.getModel("EmpInfoModel").setProperty("/IsUserManager", bIsUserManager);
                       
                    }.bind(this),
                    error: function (oError) {   
                        this.getView().setBusy(false); 
                        sap.m.MessageBox.error(JSON.stringify(oError));
                    }.bind(this),
                });
            },
        });
    });
