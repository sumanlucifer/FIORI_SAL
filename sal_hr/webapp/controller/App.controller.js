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
                debugger;
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                // window.location.href= "https://saudi-airlines-cargo-company-sal-btp-cf-dev-8glkufj3-de4a228034.cfapps.eu10.hana.ondemand.com/";
               

            },
            onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name"),
                    oArguments = oEvent.getParameter("arguments");
                debugger;
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
            }
        });
    });
