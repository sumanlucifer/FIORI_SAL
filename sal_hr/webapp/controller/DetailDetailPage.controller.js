sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller"
],

    function (BaseController, Controller) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.DetailDetailPage", {
            onInit: function () {

                this.oRouter = this.getRouter();
                this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onObjectMatched, this);

            },
            _onObjectMatched: function (oEvent) {
                debugger;
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;
                // if (sLayout == 'TwoColumnsMidExpanded') {
                //     this.byId("idViewBOQListButton").setPressed(false);
                //     this.getViewModel("objectViewModel").setProperty("/sViewBOQButtonName", "View BOQ List");
                // }
                // this.getView().getModel().setProperty("/busy", false);
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
                this._bindView();
                // this._filterPCListTable(this.UserEmail);
            },

            _bindView: function () {
                var objectViewModel = this.getViewModel("objectViewModel");
                var that = this;
                var oComponentModel = this.getComponentModel();
                //    var sTickets = sObjectPath + "/tickets";
                var sKey = oComponentModel.createKey("/MasterSubModules", {
                    ID: this.sParentID
                });

                this.getView().bindElement({
                    path: sKey
                });
            }
        });

    });