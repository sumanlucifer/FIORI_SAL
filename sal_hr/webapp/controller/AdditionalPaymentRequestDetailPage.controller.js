sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/sal/salhr/model/formatter"

],

    function (BaseController, Controller, JSONModel, formatter) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.AdditionalPaymentRequestDetailPage", {
            formatter: formatter,
            onInit: function () {
                var oLocalViewModel = new JSONModel({
                    EditMode: false,
                    LeaveModule: false,
                    PageTitle: null,
                    Modify: true,
                    IDCardModule: false
                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");

                this.oRouter = this.getRouter();
                this.oRouter.getRoute("AdditionalPaymentRequestDetail").attachPatternMatched(this._onObjectMatched, this);
                // var oUploadSet = this.byId("UploadSet"); 
                // oUploadSet.getDefaultFileUploader().setButtonOnly(false);
                // oUploadSet.getDefaultFileUploader().setTooltip("");

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
                debugger;
                var object = data.results[0];
                this.object = data.results[0];
                var oHeaderModel = new JSONModel(data.results[0]);
                this.getView().setModel(oHeaderModel, "headerModel");
                this.onCallHistoryData(object.ticketCode);


                // if (object.status === "APPROVED") {
                //     this.getView().getModel("LocalViewModel").setProperty("/Modify", false);
                // } else {
                //     this.getView().getModel("LocalViewModel").setProperty("/Modify", true);
                // }
                var oComponentModel = this.getComponentModel(),
                    sKey = null;
                sKey = oComponentModel.createKey("/SF_Pay", {
                    payComponentCode: object.externalCode,
                    payDate: object.effectiveStartDate,
                    userId: object.employeeId
                });
                this.getView().bindElement({
                    path: sKey,
                    parameters: {
                        expand: "payComponentCodeNav,alternativeCostCenterNav,userNav",
                        custom: {
                            "recordStatus": object.status
                        }
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

                // this.getView().getModel().read(sKey, {
                //     urlParameters: {
                //         "$expand": "cust_attachmentNav, timeTypeNav"
                //     },
                //     success: function (oData) {
                //         oAttachModel = new JSONModel(oData.cust_attachmentNav);
                //         var oTimeTypeModel = new JSONModel(oData.timeTypeNav);
                //         that.getView().setModel(oAttachModel, "attachmentModel");
                //         that.getView().setModel(oTimeTypeModel, "timeTypeModel");
                //         // that.getView().getModel("attachmentModel").setProperty("/ticketCode", sTicketCode);
                //         var sType = that.getView().getModel("timeTypeModel").getProperty("/externalCode");
                //         if (sType === "S110" || sType === "500" || sType === "460") {
                //             that.getView().getModel("LocalViewModel").setProperty('/uploadAttachment', false);
                //         } else {
                //             that.getView().getModel("LocalViewModel").setProperty('/uploadAttachment', true);
                //         }
                //     },
                //     error: function (oError) {

                //     }

                // });


                this.getView().getModel("LocalViewModel").setProperty("/PageTitle", "Additional Payment Request");
                this.getView().getModel("LocalViewModel").refresh();

            },
            onCallHistoryData: function (sticketCode) {
                var ticketCodeFilter = new sap.ui.model.Filter({
                    path: "ticketCode",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: sticketCode
                });
                var filter = [];
                filter.push(ticketCodeFilter);
                this.getOwnerComponent().getModel().read("/TicketHistory", {
                    filters: [filter],

                    success: function (oData, oResponse) {
                        var oHistoryData = new JSONModel(oData.results);
                        this.getView().setModel(oHistoryData, "HistoryData");


                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageBox.error(JSON.stringify(oError));
                    }
                });
            },

            onEditPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", true);

            },

            onCancelPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", false);
            },

            onChangeInpIBAN: function (oEve) {
                var sValue = oEve.getSource().getValue();

                if (!sValue.match(/^[0-9A-Za-z]+$/)) {
                    sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idIBANINP").setValueState("Error");
                    sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idIBANINP").setValueStateText("Please enter only alpha-numeric characters");
                }

                else {
                    sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idIBANINP").setValueState("None");

                }

            },


            onChangeInpBankName: function (oEve) {
                var sValue = oEve.getSource().getValue();

                if (!sValue.match(/^[a-zA-Z0-9\s]*$/)) {


                    sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idBankNameINP").setValueState("Error");
                    sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idBankNameINP").setValueStateText("Please enter only alpha-numeric characters");
                }

                else {
                    sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idBankNameINP").setValueState("None");

                }

            },

            onWithdrawPress: function () {
                // var sKey = "038718668910415eb3f3773a68fee340";
                var sKey = this.sChildID;
                if (sKey === "" || sKey === undefined) {
                    MessageBox.error("Please enter sKey ID to delete the record.");
                    return;
                }
                this.getView().setBusy(true);
                this.fnDeleteAdditionalPymnt();


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
                this.oRouter.navTo("AdditionalPaymentRequestDetail", {
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

            onSavePress: function () {
                var oPayloadObj = {},
                    sEntityPath = null;
                var oComponentModel = this.getComponentModel(),
                    sKey = oComponentModel.createKey("/SF_Pay", {
                        payComponentCode: this.object.externalCode,
                        payDate: this.object.effectiveStartDate,
                        userId: this.object.employeeId


                    });
                sEntityPath = sKey;
                oPayloadObj = this.fnAddPaymentRequestChangePayload();
                this.getView().setBusy(true);
                this.getView().getModel().update(sEntityPath, oPayloadObj, {
                    success: function (oResponse) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.success("Request Submitted successfully.");
                        this.getView().getModel().refresh();
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.error(JSON.parse(JSON.parse(oError.responseText).error.message.value).error.message.value.split("]")[1]);
                        this.getView().getModel().refresh();
                    }.bind(this)
                });
            },


            fnAddPaymentRequestChangePayload: function () {

                var sUserID = this.getOwnerComponent().getModel("EmpInfoModel").getData().userId;
                var sPayDate = this.byId("idEditIssueDate").getDateValue();
                var sPayDate = this.byId("idEditIssueDate").getDateValue();
                var sValue = this.byId("idEditValueINP").getValue();
                var sCurrency = this.byId("idInpCurrencyCode").getSelectedKey();
                var sAltCostCenter = this.byId("idInpAltCostCenter").getSelectedKey();
                var sPayDate = this.byId("idEditIssueDate").getDateValue();
                return {
                    "payComponentCode": "9244",
                    "userId": sUserID,
                    "payDate": "/Date(1646697600000)/",
                    "notes": null,
                    "alternativeCostCenter": sAltCostCenter,
                    "currencyCode": sCurrency,
                    "value": sValue
                };
            },
            onDownLoadPress: function () {
                // var fContent = this.getView().getModel("attachmentModel").getData().fileContent;
                // var fName = this.getView().getModel("attachmentModel").getData().fileName;
                // var sfileExtension = this.getView().getModel("attachmentModel").getData().fileExtension;
                // fName = fName.split(".")[0];
                // fContent = atob(fContent);
                // sap.ui.core.util.File.save(fContent, fName, sfileExtension);
                var fContent = this.getView().getModel("attachmentModel").getData().fileContent;
                var fileext = this.getView().getModel("attachmentModel").getData().fileExtension;
                var mimeType = this.getView().getModel("attachmentModel").getData().mimeType;
                var fName = this.getView().getModel("attachmentModel").getData().fileName;
                fName = fName.split(".")[0];
                debugger;
                if (fileext === "pdf" || fileext === "png") {
                    var decodedPdfContent = atob(fContent);
                    var byteArray = new Uint8Array(decodedPdfContent.length)
                    for (var i = 0; i < decodedPdfContent.length; i++) {
                        byteArray[i] = decodedPdfContent.charCodeAt(i);
                    }
                    var blob = new Blob([byteArray.buffer], { type: mimeType });
                    var _pdfurl = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = _pdfurl;
                    a.download = fName;
                    a.dispatchEvent(new MouseEvent('click'));
                }
                else {
                    sap.ui.core.util.File.save(fContent, fName, fileext, mimeType);
                }
            },
            onFileDeleted: function (oEvent) {
                var oUploadSet = this.byId("idEditUploadSet");
                oUploadSet.getDefaultFileUploader().setEnabled(true);
            },
            onFileAdded: function (oEvent) {
                debugger;
                var that = this;

                //  var file = oEvent.getParameters().files[0];
                var file = oEvent.getParameter("item");
                var Filename = file.getFileName(),
                    Filetype = file.getMediaType(),
                    Filesize = file.getFileObject().size,
                    Filedata = oEvent.getParameter("item").getFileObject();


                //code for base64/binary array 
                this._getImageData((Filedata), function (Filecontent) {
                    that._addData(Filecontent, Filename, Filetype, Filesize);
                });
                var oUploadSet = this.byId("idEditUploadSet");
                oUploadSet.getDefaultFileUploader().setEnabled(false);

                this.getView().getModel("attachmentModel").setProperty("/fileName", Filename);
                this.getView().getModel("attachmentModel").setProperty("/mimeType", Filetype);
                this.getView().getModel("attachmentModel").refresh();



            },
            _getImageData: function (url, callback, fileName) {
                var reader = new FileReader();

                reader.onloadend = function (evt) {
                    if (evt.target.readyState === FileReader.DONE) {

                        var binaryString = evt.target.result,
                            base64file = btoa(binaryString);

                        callback(base64file);
                    }
                };
                reader.readAsBinaryString(url);
            },
            _addData: function (Filecontent, Filename, Filetype, Filesize) {
                this.getViewModel("LocalViewModel").setProperty(
                    "/busy",
                    true
                );
                this.fileContent = Filecontent;
                this.fileName = Filename;
                this.isAttachmentNew = true;

            },
            fnDeleteLeaveRequest: function () {
                this.getView().getModel().remove("/SF_Leave('" + this.object.externalCode + "')", {
                    success: function (oData) {
                        if (oData !== "" || oData !== undefined) {
                            this.getView().setBusy(false);
                            sap.m.MessageBox.success("Record Deleted successfully.");
                            this.getView().getModel().refresh();
                            this.oRouter.navTo("detail", {
                                parentMaterial: this.sParentID,
                                layout: "TwoColumnsMidExpanded"

                            });

                        } else {
                            this.getView().setBusy(false);
                            MessageBox.error("Record Not able to delete.");
                        }
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this),

                });
            },
            fnDeleteBankAccount: function () {

                var oComponentModel = this.getComponentModel(),
                    sPath = oComponentModel.createKey("/SF_BankDetails", {
                        effectiveStartDate: this.object.effectiveStartDate,
                        externalCode: this.object.externalCode
                    });
                this.getView().getModel().remove(`${sPath}`, {
                    success: function (oData) {
                        if (oData !== "" || oData !== undefined) {
                            sap.m.MessageBox.success("Record Deleted successfully.");
                            this.oRouter.navTo("detail", {
                                parentMaterial: this.sParentID,
                                layout: "TwoColumnsMidExpanded"

                            });
                        } else {
                            sap.m.MessageBox.error("Record Not able to delete.");
                        }
                    },
                    error: function (oError) {
                    }

                });

            },

            fnDeleteAdditionalPymnt: function () {
                this.getView().setBusy(true);
                var sUserID = this.object.externalCode,
                    sEffectiveStartDate = new Date(this.object.effectiveStartDate),
                    sPath = this.getComponentModel().createKey("/SF_IDReplacement", {
                        User: sUserID,
                        effectiveStartDate: sEffectiveStartDate
                    });
                this.getView().getModel().remove(sPath, {
                    success: function (oData) {
                        if (oData !== "" || oData !== undefined) {
                            this.getView().setBusy(false);
                            sap.m.MessageBox.success("Record Deleted successfully.");
                            this.getView().getModel().refresh();
                            this.oRouter.navTo("detail", {
                                parentMaterial: this.sParentID,
                                layout: "TwoColumnsMidExpanded"
                            });
                        } else {
                            this.getView().setBusy(false);
                            MessageBox.error("Record Not able to delete.");
                        }
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            onApprovePress: function () {
                var swfRequestId = this.getView().getModel("headerModel").getProperty("/workflowRequestId");
                this.onApproveRequest(swfRequestId);
            },

            onRejectPress: function () {
                var swfRequestId = this.getView().getModel("headerModel").getProperty("/workflowRequestId");
                this.onRejectRequest(swfRequestId);
            }
        });
    });