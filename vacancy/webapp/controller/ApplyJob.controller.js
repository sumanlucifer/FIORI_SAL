sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"


],
   
    function (BaseController,Controller,History) {
        "use strict";

        return BaseController.extend("com.sal.vacancy.controller.ApplyJob", {
          
            onInit: function () {
               
                //Router Object
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("ApplyJob").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                var sLayout = oEvent.getParameter("arguments").layout;
                
            },    
            handleToAllPOBreadcrumPress: function (oEvent) {
                history.go(-1);
            },
            onApplyJobPress : function(oEvent)
            {
                this._showObject(oEvent.getSource());
            },
           
           

           
            _showObject: function (oItem) {
                var that = this;
                // var sPath = oItem.getBindingContextPath()
                this.getRouter().navTo("detail", {
                    parentMaterial: oItem.getModel().getProperty(sPath).ID,
                    layout: "TwoColumnsMidExpanded"
                },
                    false
                );
            },
          
        });
    });
