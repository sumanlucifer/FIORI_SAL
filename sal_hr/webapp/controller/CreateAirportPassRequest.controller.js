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

        return BaseController.extend("com.sal.salhr.controller.CreateAirportPassRequest", {
            formatter: formatter,
            onInit: function () {
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("AirportPassRequest").attachPatternMatched(this._onObjectMatched, this);
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





            onRaiseRequestPress: function () {




            },


            fnGetCreateAirPassPayload: function () {
                var oPayload = {
                    "externalCode": "12002427",
                    "externalName": null,
                    "effectiveStartDate": "/Date(1643068800000)/",
                    "cust_toAirportPassItem": {
                        "cust_mobileNumber": "1234567894",
                        "cust_acknowledge2": true,
                        "cust_acknowledge1": true,
                        "cust_airportLoc": "Loc03",
                        "cust_airportPassMain_effectiveStartDate": "/Date(1642550400000)/",
                        "cust_airportPassMain_externalCode": "12002425",
                        "cust_domStationName": null,
                        "cust_nationality": "SAU",
                        "cust_permitDate": "/Date(1642723200000)/",
                        "cust_permitPurpose": "Change Of Location",
                        "cust_nationalID": "1075501039",
                        "cust_typeOfPass": "Pass02",
                        "externalCode": "95924",
                        "externalName": null,
                        "cust_dateOfBirth": "/Date(693360000000)/"
                    },
                    "isPersonalIdAttachmentNew": true,
                    "personalIdAttachmentFileContent": "Personal id",
                    "personalIdAttachmentFileName": "personalid.txt",
                    "personalIdAttachmentUserId": "Extentia",
                    "isPersonalPhotoAttachmentNew": true,
                    "personalPhotoAttachmentFileContent": "Personal photo",
                    "personalPhotoAttachmentFileName": "personalphoto.txt",
                    "personalPhotoAttachmentUserId": "Extentia",
                    "isPassportAttachmentNew": true,
                    "passportAttachmentFileContent": "Passport",
                    "passportAttachmentFileName": "passport.txt",
                    "passportAttachmentUserId": "Extentia",
                    "isCompanyIdAttachmentNew": true,
                    "companyIdAttachmentFileContent": "Company id",
                    "companyIdAttachmentFileName": "companyid.txt",
                    "companyIdAttachmentUserId": "Extentia"
                };
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