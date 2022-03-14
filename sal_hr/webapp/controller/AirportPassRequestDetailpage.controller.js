sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "com/sal/salhr/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device"
],

    function (BaseController, JSONModel, formatter, Filter, FilterOperator, Device) {
        "use strict";

        return BaseController.extend("com.sal.salhr.controller.AirportPassRequestDetailpage", {
            formatter: formatter,
            onInit: function () {
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("AirportPassRequestDetail").attachPatternMatched(this._onObjectMatched, this);
                this.mainModel = this.getOwnerComponent().getModel();
                var oLocalViewModel = new JSONModel();
                this.getView().setModel(oLocalViewModel, "LocalViewModel");
            },

            _onObjectMatched: function (oEvent) {
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;

                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);

                this._bindView();
                // this.onResetPress();                
            },

            _bindView: function () {
                var oComponentModel = this.getComponentModel();
                var sKey = oComponentModel.createKey("/SF_AirportPassMain", {
                    effectiveStartDate: new Date("2022/01/26"),
                    externalCode: '12002425'
                });

                this.getView().bindElement({
                    path: sKey,
                    parameters: {
                        expand: "cust_toAirportPassItem",
                    },
                    events: {
                        change: function (oEvent) {
                            var oContextBinding = oEvent.getSource();
                            oContextBinding.refresh(false);
                        }.bind(this),
                        dataRequested: function () {
                            this.getView().setBusy(true);
                        }.bind(this),
                        dataReceived: function () {
                            this.getView().setBusy(false);
                        }.bind(this)
                    }
                });
            },
            handleDetailFullScreen: function (oEvent) {            
                var sLayout = "";
                if (oEvent.getSource().getIcon() === "sap-icon://full-screen") {
                    sLayout = "MidColumnFullScreen";
                    oEvent.getSource().setIcon("sap-icon://exit-full-screen");
                } else {
                    sLayout = "TwoColumnsMidExpanded";
                    oEvent.getSource().setIcon("sap-icon://full-screen");
                }

                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: sLayout
                });
            },

            handleDetailClose: function (oEvent) {
                var sLayout = "",
                    sIcon = this.byId("idDetailFullScreenBTN").getIcon();
                if (sIcon === "sap-icon://full-screen") {
                    sLayout = "EndColumnFullScreen";
                } else {
                    sLayout = "TwoColumnsMidExpanded";
                    this.byId("idDetailFullScreenBTN").setIcon("sap-icon://full-screen");
                }
                this.oRouter.navTo("master");
            }
        });
    });        
