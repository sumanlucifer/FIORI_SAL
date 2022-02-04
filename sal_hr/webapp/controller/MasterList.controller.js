sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "com/sal/salhr/model/formatter"
],
   
    function (BaseController,Controller,formatter) {
        "use strict";

        return BaseController.extend("com.sal.salhr.controller.MasterList", {
            formatter: formatter,
            onInit: function () {
                var oModel = this.getOwnerComponent().getModel("layoutModel");
                oModel.setProperty("/layout", "OneColumn");

                //Router Object
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("master").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                var sLayout = oEvent.getParameter("arguments").layout;

                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
            },    

             //triggers on press of a PO cheveron item from the list
             onMasterListPress: function (oEvent) {
                // The source is the list item that got pressed
                this._showObject(oEvent.getSource());
            },

            _showObject: function (oItem) {
                var that = this;
                var sObjectPath = oItem.getBindingContext().sPath;

                this.getRouter().navTo("detail", {
                    parentMaterial: sObjectPath.slice("/MasterSubModules".length),
                    layout: "TwoColumnsMidExpanded"
                },
                    false
                );
            //    this.getRouter().navTo("detail");

            }
        });
    });
