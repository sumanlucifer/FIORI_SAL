sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"

],

    function (BaseController, Controller, JSONModel) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.DetailDetailPage", {
            onInit: function () {
                var oLocalViewModel = new JSONModel({
                    EditMode: false,
                    LeaveModule: false,
                    BusineesTripModule: false,
                    HealthModule: false,
                    PageTitle: null
                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");

                this.oRouter = this.getRouter();
                this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                // this.sParentID = JSON.parse(oEvent.getParameter("arguments").parentMaterial).ParentID;
                // this.sChildID = JSON.parse(oEvent.getParameter("arguments").parentMaterial).ChildID;
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                this.sChildID = oEvent.getParameter("arguments").childModule;
                var sLayout = oEvent.getParameter("arguments").layout;
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
                this.byId("idFullScreenBTN").setIcon("sap-icon://full-screen");
                this._bindView();
            },

            _bindView: function () {
                var oComponentModel = this.getComponentModel(),
                    sKey = null;

                switch (this.sParentID) {
                    // Leave Module
                    case "1":
                        sKey = oComponentModel.createKey("/SF_Leave", {
                            externalCode: this.sChildID
                        });
                        this.getView().getModel("LocalViewModel").setProperty("/LeaveModule", true);
                        this.getView().getModel("LocalViewModel").setProperty("/BusineesTripModule", false);
                        this.getView().getModel("LocalViewModel").setProperty("/HealthModule", false);

                        this.getView().getModel("LocalViewModel").setProperty("/PageTitle", "Leave Request");
                        break;

                    // Business Trip Module
                    case "2":
                        // sKey = oComponentModel.createKey("/BusinessTrip", {
                        //     externalCode: this.sChildID
                        // //     externalCode: "038bf80e30b745b0924f030e4e9b0556"
                        // });
                        this.getView().getModel("LocalViewModel").setProperty("/BusineesTripModule", true);
                        this.getView().getModel("LocalViewModel").setProperty("/LeaveModule", false);
                        this.getView().getModel("LocalViewModel").setProperty("/HealthModule", false);

                        this.getView().getModel("LocalViewModel").setProperty("/PageTitle", "Business Trip Request");
                        break;

                    // Health Module
                    case "3":
                        // sKey = oComponentModel.createKey("/BusinessTrip", {
                        //     externalCode: this.sChildID
                        // //     externalCode: "038bf80e30b745b0924f030e4e9b0556"
                        // });
                        this.getView().getModel("LocalViewModel").setProperty("/HealthModule", true);
                        this.getView().getModel("LocalViewModel").setProperty("/BusineesTripModule", false);
                        this.getView().getModel("LocalViewModel").setProperty("/LeaveModule", false);

                        this.getView().getModel("LocalViewModel").setProperty("/PageTitle", "Health Insurance");
                        break;
                }

                this.getView().getModel("LocalViewModel").refresh();

                this.getView().bindElement({
                    path: sKey,

                    events: {
                        dataRequested: function () {
                            this.getView().setBusy(true);
                        }.bind(this),
                        dataReceived: function () {
                            this.getView().setBusy(false);
                        }.bind(this)
                    }
                });
            },

            onEditPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", true);
            },

            onCancelPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", false);
            },

            onWithdrawPress: function () {
                // var sKey = "038718668910415eb3f3773a68fee340";
                var sKey = this.sChildID;
                if (sKey === "" || sKey === undefined) {
                    MessageBox.error("Please enter sKey ID to delete the record.");
                    return;
                }

                this.getView().getModel().remove("/SF_Leave('" + sKey + "')", {
                    success: function (oData) {
                        if (oData !== "" || oData !== undefined) {
                            MessageBox.success("Record Deleted successfully.");
                            this.oRouter.navTo("detail", {
                                parentMaterial: this.sParentID,
                                layout: "TwoColumnsMidExpanded"

                            });

                        } else {
                            MessageBox.error("Record Not able to delete.");
                        }
                    },
                    error: function (oError) {

                    }

                });
            },

            handleFullScreen: function (oEvent) {
                var sLayout = "";
                if (oEvent.getSource().getIcon() === "sap-icon://full-screen") {
                    sLayout = "EndColumnFullScreen";
                    oEvent.getSource().setIcon("sap-icon://exit-full-screen");
                } else {
                    sLayout = "ThreeColumnsMidExpanded";
                    oEvent.getSource().setIcon("sap-icon://full-screen");
                }

                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: sLayout
                });
            },

            handleClose: function (oEvent) {
                var sLayout = "",
                    sIcon = this.byId("idFullScreenBTN").getIcon();
                if (sIcon === "sap-icon://full-screen") {
                    sLayout = "TwoColumnsMidExpanded";
                } else {
                    sLayout = "ThreeColumnsMidExpanded";
                    this.byId("idFullScreenBTN").setIcon("sap-icon://full-screen");
                }
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: sLayout
                });
            },

            onSavePress: function () {
                var oPayloadObj = {},
                    sEntityPath = null;

                switch (this.sParentID) {
                    // Leave Module
                    case "1":
                        sEntityPath = "/SF_Leave";
                        oPayloadObj = this.fnGetLeaveRequestPayload();
                        break;

                    // Business Trip Module
                    case "2":
                        // sEntityPath="/Business_Trip";
                        // oPayloadObj = this.fnGetBusinessTripPayload();
                        break;

                    // Health Module
                    case "3":
                        // sEntityPath="/Health_Insurance";
                        // oPayloadObj = this.fnGetHealthInsurancePayload();
                        break;
                }

                this.getView().getModel().update(sEntityPath, oPayloadObj, {
                    success: function (oResponse) {
                        sap.m.MessageBox.success("Request Submitted successfully.");
                        this.getView().getModel().refresh();
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageBox.error("Error occured during submit");
                        this.getView().getModel().refresh();
                    }.bind(this)
                });
            },

            fnGetLeaveRequestPayload: function () {
                return {
                    "endDate": this.getView().byId("idEditLeaveEndDatePicker").getValue(),
                    "timeType": this.getView().byId("idEditTimeTypeINP").getValue(),
                    "startDate": this.getView().byId("idStartLDatePicker").getValue(),
                    "undeterminedEndDate": false,
                    "userId": "12002024",
                    "fractionQuantity": "1"
                };
            },

            fnGetBusinessTripPayload: function () {
                return {
                };
            },

            fnGetHealthInsurancePayload: function () {
                return {
                };
            }


        });
    });