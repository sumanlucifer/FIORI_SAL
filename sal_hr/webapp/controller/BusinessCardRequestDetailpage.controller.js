sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (BaseController, Controller, JSONModel) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.BusinessCardRequestDetailpage", {
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
                this.oRouter.getRoute("BusinessRequestDetail").attachPatternMatched(this._onObjectMatched, this);
            },
            _onObjectMatched: function (oEvent) {
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                this.sChildID = oEvent.getParameter("arguments").childModule;
                var sLayout = oEvent.getParameter("arguments").layout;
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
                this.byId("idFullScreenBTN").setIcon("sap-icon://full-screen");
                this._getTicketData(this.sChildID);
            },
            _bindView: function (data) {
                var object = data.results[0];
                this.object = data.results[0];
                if (object.status === "APPROVED") {
                    this.getView().getModel("LocalViewModel").setProperty("/Modify", false);
                } else {
                    this.getView().getModel("LocalViewModel").setProperty("/Modify", true);
                }
                var oComponentModel = this.getComponentModel(),
                    sKey = null;
                this.effectiveStartDate = object.effectiveStartDate;
                this.User = object.externalCode;
                sKey = oComponentModel.createKey("/SF_BusinessCard", {
                    effectiveStartDate: object.effectiveStartDate,
                    User: object.externalCode
                });

                this.getView().getModel("LocalViewModel").setProperty("/PageTitle", "Business Card Request");
                this.getView().getModel("LocalViewModel").refresh();
                this.getView().bindElement({
                    path: sKey,
                    // parameters: {
                    //     expand: "cust_IncidentStatusNav,cust_ReasonNav,cust_SeverityNav,cust_warningTypeNav",
                    // },
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
            onEditPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", true);
            },
            onCancelPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", false);
            },
            onWithdrawPress: function () {
                // if (sKey === "" || sKey === undefined) {
                //     MessageBox.error("Please enter sKey ID to delete the record.");
                //     return;
                // }

                  var oComponentModel = this.getComponentModel(),
                    sKey = null,
                    sKey = oComponentModel.createKey("/SF_BusinessCard", {
                        User: this.User,
                        effectiveStartDate: this.effectiveStartDate,

                    });
                this.getView().getModel().remove(sKey, {
                    success: function (oData) {
                        if (oData !== "" || oData !== undefined) {
                            sap.m.MessageBox.success("Record Deleted successfully.");
                            this.oRouter.navTo("detail", {
                                parentMaterial: this.sParentID,
                                layout: "TwoColumnsMidExpanded"
                            });
                            this.getView().getModel().refresh();
                        } else {
                            MessageBox.error("Record Not able to delete.");
                        }
                    }.bind(this),
                    error: function (oError) {
                    }.bind(this)
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
                this.oRouter.navTo("BusinessRequestDetail", {
                    parentMaterial: this.sParentID,
                    childModule: this.sChildID,
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
            _validateMandatoryFields: function () {
                var bValid = true;
                if (this.byId("idIncidentDescription").getValue() === "") {
                    this.byId("idIncidentDescription").setValueState("Error");
                    this.byId("idIncidentDescription").setValueStateText(
                        "Please enter incident description details"
                    );
                    bValid = false;
                } else {
                    this.byId("idIncidentDescription").setValueState("None");
                    this.byId("idIncidentDescription").setValueStateText(null);
                }
                // if(this.isAttachment !== true)
                // {
                //     sap.m.MessageBox.error("Please upload attachments.");
                //     bValid = false;
                // }
                return bValid;
            },
          
            onSavePress: function () {
                // if (!this._validateMandatoryFields()) {
                //     return;
                // }
                var oPayloadObj = {},
                    sEntityPath = null,
                    oComponentModel = this.getComponentModel(),
                    sKey = null,
                    sKey = oComponentModel.createKey("/SF_BusinessCard", {
                        effectiveStartDate: this.effectiveStartDate,
                        User: this.User
                    });
                sEntityPath = sKey;
                oPayloadObj = this.fnGetBusinessCardRequestPayload();
                this.getView().setBusy(true);
                this.getView().getModel().update(sEntityPath, oPayloadObj, {
                    success: function (oResponse) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.success("Request Submitted successfully.");
                        this.getView().getModel().refresh();
                        this.getView().getModel("LocalViewModel").setProperty("/EditMode", false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.error(JSON.parse(JSON.parse(oError.responseText).error.message.value).error.message.value.split("]")[1]);
                        this.getView().getModel().refresh();
                    }.bind(this)
                });
            },
            fnGetBusinessCardRequestPayload: function () {


               var scust_email = this.getView().byId("idEditEmail").getValue(),
                    scust_mobile = this.getView().byId("idEditMobile").getValue(),
                    scust_poBox = this.getView().byId("idEditPOBOX").getValue(),
                    scust_jobTitle = this.getView().byId("idEditJobTitle").getValue(),
                    scust_location = this.getView().byId("idEditDivision").getValue(),
                    scust_officeNumber = this.getView().byId("idEditOfficeNo").getValue(),
                    seffectiveStartDate = this.getView().byId("idEditIncidentStartDate").getDateValue(),
                    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                    seffectiveStartDate = dateFormat.format(new Date(seffectiveStartDate));
                    seffectiveStartDate = seffectiveStartDate + "T00:00:00";
                return {

                    "User": "12002425",
                    "cust_email": scust_email,
                    "cust_mobile": scust_mobile,
                    "cust_poBox": scust_poBox,
                    "cust_location": scust_location,
                    "cust_officeNumber": scust_officeNumber,
                    "effectiveStartDate": seffectiveStartDate,
                    "cust_jobTitle": scust_jobTitle
                
                }


                




            }
        });
    });