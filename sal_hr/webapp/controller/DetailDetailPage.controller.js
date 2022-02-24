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
                // this._bindView();
                this._getTicketData(this.sChildID);
            },

            _bindView: function (data) {
                var object = data.results[0];
                this.object = data.results[0];
                var oComponentModel = this.getComponentModel(),
                    sKey = null;
                var that = this;
                switch (this.sParentID) {
                    // Leave Module
                    case "1":
                        
                        sKey = oComponentModel.createKey("/SF_Leave", {
                           
                            externalCode: object.externalCode
                        });
                        this.getView().getModel().read("/SF_Leave('" + object.externalCode + "')", {
                            urlParameters: {
                                "$expand": "cust_attachmentNav"
                            },
                            success: function (oData) {
                                var oAttachModel = new JSONModel(oData.cust_attachmentNav);
                                that.getView().setModel(oAttachModel,"attachmentModel");
                              
                               
                            },
                            error: function (oError) {
        
                            }
        
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
                     //  Bank Request Module 
                    case "13":

                            debugger;
                            sKey = oComponentModel.createKey("/SF_BankDetails", {
                                effectiveStartDate: object.effectiveStartDate,
                                externalCode: object.externalCode
    
    
                            });
                            this.getView().getModel("LocalViewModel").setProperty("/BankRequestModel", true);
                            this.getView().getModel("LocalViewModel").setProperty("/BusineesTripModule", false);
                            this.getView().getModel("LocalViewModel").setProperty("/LeaveModule", false);
                            this.getView().getModel("LocalViewModel").setProperty("/HealthModule", false);
                            this.getView().getModel("LocalViewModel").setProperty("/PageTitle", "Bank Change Request");
                            break;    
                }

                this.getView().getModel("LocalViewModel").refresh();

                this.getView().bindElement({
                    path: sKey,
                   
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
                // var sKey = "038718668910415eb3f3773a68fee340";
                var sKey = this.sChildID;
                if (sKey === "" || sKey === undefined) {
                    MessageBox.error("Please enter sKey ID to delete the record.");
                    return;
                }

                this.getView().getModel().remove("/SF_Leave('" + sKey + "')", {
                    success: function (oData) {
                        if (oData !== "" || oData !== undefined) {
                            sap.m.MessageBox.success("Record Deleted successfully.");
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

                // this.oRouter.navTo("detail", {
                //     parentMaterial: this.sParentID,
                //     layout: sLayout
                // });
                this.oRouter.navTo("detailDetail", {
                    parentMaterial: this.sParentID,
                    childModule:this.sChildID,
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
                        sEntityPath = "/SF_Leave('" + this.sChildID + "')";
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
                      // Bankrequest change Module
                    case "13":

                            var oComponentModel = this.getComponentModel(),
                               sKey = oComponentModel.createKey("/SF_BankDetails", {
                                effectiveStartDate: this.object.effectiveStartDate,
                                externalCode: this.object.externalCode
    
    
                            });
                            sEntityPath= sKey;
                            oPayloadObj = this.fnBankRequestChangePayload();
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
                // return {
                //     "endDate": this.getView().byId("idEditLeaveEndDatePicker").getValue(),
                //     "timeType": this.getView().byId("idEditTimeTypeINP").getValue(),
                //     "startDate": this.getView().byId("idStartLDatePicker").getValue(),
                //     "undeterminedEndDate": false,
                //     "userId": "12002024",
                //     "fractionQuantity": "1"
                // };

                var sattachmentFileName = this.getView().getModel("attachmentModel").getData().fileName;
                var sattachmentFileContent= this.getView().getModel("attachmentModel").getData().fileContent;
                var sattachmentFileID= this.getView().getModel("attachmentModel").getData().attachmentId;
                var sEndDate = this.getView().byId("idEditLeaveEndDatePicker").getValue();
                sEndDate = Date.parse(sEndDate);
                var sStartDate = this.getView().byId("idStartLDatePicker").getValue();
                sStartDate = Date.parse(sStartDate);
                
                return {
                        "endDate": "/Date("+sEndDate+")/" ,
                        "loaActualReturnDate": null,
                        "timeType": "S110",
                        "loaExpectedReturnDate": null,
                        "loaStartJobInfoId": null,
                        "startDate": "/Date("+sStartDate+")/" ,
                        "cust_KronosPayCodeEditID": null,
                        "startTime": null,
                        "loaEndJobInfoId": null,
                        "approvalStatus": null,
                        "undeterminedEndDate": false,
                        "userId": "12002024",
                        "recurrenceGroup": null,
                        "fractionQuantity": "1",
                        "endTime": null,
                        "isAttachmentNew": false,
                        "attachmentId": sattachmentFileID,
                        "attachmentFileContent": "on Leave",
                        "attachmentFileName": sattachmentFileName,
                        "attachmentUserId": "Extentia"
                    
                }
              
            },

            fnGetBusinessTripPayload: function () {
                return {
                };
            },

            fnGetHealthInsurancePayload: function () {
                return {
                };
            },
            fnBankRequestChangePayload: function () {
                return {
                    "externalCode": "12002425",
                    "effectiveStartDate": this.getView().byId("idEditFromDatePicker").getDateValue(),
                    "cust_bankName": this.getView().byId("idEditBankNameINP").getValue(),
                    "cust_iban": this.getView().byId("idEditIBANINP").getValue()
                };
            },
            onDownLoadPress:function(){
                
                
                var fContent = this.getView().getModel("attachmentModel").getData().fileContent;
                                var fName = this.getView().getModel("attachmentModel").getData().fileName;
                                fName = fName.split(".")[0];
                                
                                fContent = atob(fContent);
                
                             sap.ui.core.util.File.save(fContent, fName,"txt");
            }
           


        });
    });