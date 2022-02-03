sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller"
],
   
    function (BaseController,Controller) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.MasterList", {

            onInit: function () {

            },

             //triggers on press of a PO cheveron item from the list
             onMasterListPress: function (oEvent) {
                // The source is the list item that got pressed
                this._showObject(oEvent.getSource());
            },

            _showObject: function (oItem) {
                var that = this;
                // var sObjectPath = oItem.getBindingContext().sPath;

                // this.oRouter.navTo("detail", {
                //     parentMaterial: sObjectPath.slice("/MasterSubModules".length),
                //     layout: "TwoColumnsMidExpanded"
                // },
                //     false
                // );
               this.getRouter().navTo("detail");

            }
        });
    });
