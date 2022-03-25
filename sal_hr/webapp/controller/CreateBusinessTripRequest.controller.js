sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/upload/Uploader",
    "sap/m/UploadCollectionParameter"
],

    function (BaseController, Controller, JSONModel, MessageBox, Uploader, UploadCollectionParameter) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.CreateBusinessTripRequest", {
            onInit: function () {
                debugger;
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("BusinessTripRequest").attachPatternMatched(this._onObjectMatched, this);
                // this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                this.mainModel = this.getOwnerComponent().getModel();
                var that = this;

                this.sReturnDate = new Date();
                this.sRequesting = 1;
                this.sReturnDate.setDate(new Date().getDate() + 1);
                if (this.sReturnDate.getDay() === 5) {
                    this.sReturnDate.setDate(this.sReturnDate.getDate() + 2);

                } else if (this.sReturnDate.getDay() === 6) {
                    this.sReturnDate.setDate(this.sReturnDate.getDate() + 1);

                } else {
                    this.sRequesting = 1;
                }
                var oLocalViewModel = new JSONModel({
                    startDate: new Date(),
                    endDate: new Date(),
                    returnDate: this.sReturnDate,
                    requestDay: this.sRequesting,
                    availBal: false,
                    recurringAbs: false,
                    busy: false,
                    uploadAttachment: true,
                    currentDate: new Date(),
                    businessTravel: false,
                    trainingTravel: false
                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");




            },

            _onObjectMatched: function (oEvent) {
                debugger;
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;

                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);

                this.fnGetEmpInfo("12002429", this.sParentID);


            },
            fnSetCreateBusinessTripModel: function (oEmpInfoObj) {
                this.EmpInfoObj = oEmpInfoObj;

                //    var oCreateBusinessObj = {

                var sExternalCode = this.EmpInfoObj.userId,
                    sFirstName = this.EmpInfoObj.firstName + " " + this.EmpInfoObj.middleName + " " + this.EmpInfoObj.lastName,
                    sPayGrade = this.EmpInfoObj.payGrade,
                    sCostCenter = this.EmpInfoObj.costCentre,
                    sPhnNum = this.EmpInfoObj.emergencyNumber;
                //    }
                var oCreateBusinessObj = {
                    "externalCode": sExternalCode,
                    "effectiveStartDate": new Date(),
                    "cust_toDutyTravelItem": [
                        {
                            "cust_userId": sExternalCode,
                            "cust_dutyTravelMain_externalCode": sExternalCode,
                            "cust_dutyTravelMain_effectiveStartDate": new Date(),

                            "externalCode": "96056",
                            "externalName": null,
                            "cust_requestType": "1",
                            "cust_perDiemPayComp": null,
                            "cust_totalAmount": null,
                            "cust_tripCategory": "B",
                            "cust_isCompany": true,
                            "cust_hotelBooking": false,
                            "cust_assignJustification": "4444444444444",
                            "cust_expenseTypeBusinessTravel": null,
                            "cust_expenseTypeTrainingTravel": null,
                            "cust_businessTicketAmount": null,
                            "cust_trainingExpenseAmount": null,

                            "cust_empName": sFirstName,
                            "cust_payGrade": sPayGrade,
                            "cust_costCenter": sCostCenter,
                            "cust_emerPhoneNum": sPhnNum,

                            "cust_assignStartDate": new Date(),
                            "cust_assignEndDate": new Date(),
                            "cust_travelTime": null,
                            "cust_destination": null,
                            "cust_city": null,
                            "cust_SAUotherCity": null,
                            "cust_cityAll": null,
                            "cust_inOutKingdom": "OUT",
                            "cust_perDiem": "1000",
                            "cust_totalPerDiem": "1000",
                            "cust_businessTravelDate": new Date(),
                            "cust_businessTravelFrom": null,
                            "cust_businessTravelTo": null,
                            "cust_businessTravelFlightNum": null,
                            "cust_businessTravelDepTime": null,
                            "cust_businessTravelArrTime": null,
                            "cust_businessTravelPayComp": null,
                            "cust_trainingTravelDate": null,
                            "cust_trainingTravelFrom": null,
                            "cust_trainingTravelTo": null,
                            "cust_trainingTravelFlightNum": null,
                            "cust_trainingTravelDepTime": null,
                            "cust_trainingTravelArrTime": null,
                            "cust_trainingTravelPayComp": null,
                            "cust_ticketAmount": null,
                            "cust_expenseTypeVisaFee": null,
                            "cust_visaFeePayComp": null,
                            "cust_visaFeeExpenseAmount": null,





                            "cust_status": null,
                            "cust_returnDate": null,
                            "cust_paymentType": null,
                            "mdfSystemRecordStatus": "N",


                            "travelattachment1FileContent": "create travel attache",
                            "travelattachment1FileName": "tr1.txt",
                            "isTravelAttach1New": true,
                            "travelattachment1UserId": "Extentia",


                            "businessTravelattachmentFileContent": "btravle create",
                            "businessTravelattachmentFileName": "btravel.txt",
                            "isbusinessTravelAttachNew": false,
                            "businessTravelattachmentUserId": "Extentia",

                            "trainingTravelattachmentFileContent": "btravle2create",
                            "trainingTravelattachmentFileName": "btrave2.txt",
                            "istrainingTravelAttachNew": false,
                            "trainingTravelattachmentUserId": "Extentia",

                            "receiptEmbassyattachmentFileContent": "btravle 3create",
                            "receiptEmbassyattachmentFileName": "btrave3.txt",
                            "isreceiptEmbassyAttachNew": false,
                            "receiptEmbassyattachmentUserId": "Extentia",

                            "visaCopyattachmentFileContent": "btravle 6 create",
                            "visaCopyattachmentFileName": "btrave6.txt",
                            "isvisaCopyAttachNew": false,
                            "visaCopyattachmentUserId": "Extentia"

                        }
                    ]

                },

                    oCreateBusinessTripModel = new JSONModel(oCreateBusinessObj);

                this.getView().setModel(oCreateBusinessTripModel, "CreateBusinessTripModel");

                // this._fnRemoveFileUploaderItems();
            },


            onRaiseRequestPress: function () {
                var sPath = "/SF_DutyTravelMain",
                    sValidationErrorMsg = this.fnValidateBusinessTripPayload(),
                    oPayload = this.getView().getModel("CreateBusinessTripModel").getData();

                if (sValidationErrorMsg === "") {
                    this.getView().setBusy(true);
                    this.getView().setBusy(true);

                    this.mainModel.create(sPath, oPayload, {
                        success: function (oData, oResponse) {
                            sap.m.MessageBox.success("Request Submitted Successfully.");
                            this.getView().setBusy(false);
                            this.getView().getModel().refresh();
                            this.oRouter.navTo("detail", {
                                parentMaterial: this.sParentID,
                                layout: "TwoColumnsMidExpanded"

                            });
                        }.bind(this),
                        error: function (oError) {
                            this.getView().setBusy(false);
                            sap.m.MessageBox.error(JSON.parse(JSON.parse(oError.responseText).error.message.value).error.message.value.split("]")[1]);
                            // this.getView().getModel().refresh();


                        }.bind(this)
                    })
                } else {
                    sap.m.MessageBox.error(sValidationErrorMsg);
                }
            },
            fnValidateBusinessTripPayload: function () {
                this.getView().setBusy(true);

                var sValidationErrorMsg = "",
                    oEffectStartDatePicker = this.byId("idEffectDatePicker"),
                    oTravelDatePicker = this.byId("idTravelDate"),
                    oReturnDatePicker = this.byId("idReturnDate"),
                    sDestinationCountry = this.getView().byId("idDestCountry"),
                    oFlightTravelDatePicker = this.byId("idFlightTravelDate");

                // Validate Business Trip Effective Start Date
                if (!oEffectStartDatePicker.getValue()) {
                    oEffectStartDatePicker.setValueState("Error");
                    oEffectStartDatePicker.setValueStateText("Please select Efective Start date");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oEffectStartDatePicker.setValueState("None");
                }

                // Validate Travel Date
                if (!oTravelDatePicker.getValue()) {
                    oTravelDatePicker.setValueState("Error");
                    oTravelDatePicker.setValueStateText("Please select Travel Date");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oTravelDatePicker.setValueState("None");
                }

                // Validate Return Date
                if (!oReturnDatePicker.getValue()) {
                    oReturnDatePicker.setValueState("Error");
                    oReturnDatePicker.setValueStateText("Please select Return Date");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oReturnDatePicker.setValueState("None");
                }

                // validate Destination Country Field

                if (!sDestinationCountry.getSelectedKey()) {
                    sDestinationCountry.setValueState("Error");
                    sDestinationCountry.setValueStateText("Please select Destination Country.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    sDestinationCountry.setValueState("None");
                }

                // Validate Flight Deatils Travel Date
                if (!oFlightTravelDatePicker.getValue()) {
                    oFlightTravelDatePicker.setValueState("Error");
                    oFlightTravelDatePicker.setValueStateText("Please select Travel Date");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oFlightTravelDatePicker.setValueState("None");
                }



                // Validate attachment sections

                if (this.byId("idTripCategory").getSelectedKey() === "B") {
                    if (!this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/isbusinessTravelAttachNew")) {
                        sValidationErrorMsg = "Please upload Boarding Pass.";
                        this.getView().setBusy(false);
                        return sValidationErrorMsg;
                    }
                } else {
                    if (!this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/istrainingTravelAttachNew")) {
                        sValidationErrorMsg = "Please upload Boarding Pass.";
                        this.getView().setBusy(false);
                        return sValidationErrorMsg;
                    }
                }

                if (this.byId("idVisaType").getSelectedKey() === "V") {
                    if (!this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/isvisaCopyAttachNew")) {
                        sValidationErrorMsg = "Please upload Visa Copy.";
                        this.getView().setBusy(false);
                        return sValidationErrorMsg;
                    }
                }

                if (!this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/isreceiptEmbassyAttachNew")) {
                    sValidationErrorMsg = "Please upload Embassy Receipt.";
                    this.getView().setBusy(false);
                    return sValidationErrorMsg;
                }



                this.getView().setBusy(false);
                return sValidationErrorMsg;



            },



            onCreateCancelPress: function () {
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: "TwoColumnsMidExpanded"

                });
                this.mainModel.refresh();
            },
            onResetPress: function () {

                this.onBankRequestResetPress();




            },
            onReqTypeChange: function () {
                var sReqKey = this.getView().byId("idReqType").getSelectedKey();
                if (sReqKey === "1") {
                    this.byId("idHRBook").setEnabled(true);
                    this.byId("idHRBook").setValue("Yes");
                    this.byId("idPayComp").setEnabled(false);
                    this.byId("idTravelAmt").setEnabled(false);
                    this.byId("idTravelDate").setEnabled(true);
                    this.byId("idTripCategory").setEnabled(true);
                    this.byId("idDestCountry").setEnabled(true);
                    this.byId("idCityCountry").setEnabled(true);
                    this.byId("idCity").setEnabled(true);
                    this.byId("idInsOutKingdom").setEnabled(false);
                    this.byId("idPerDiem").setEnabled(false);
                    this.byId("idTotalPErDiem").setEnabled(false);
                    this.byId("idPayCompVisa").setEnabled(true);
                    this.byId("idPayCom").setEnabled(false);
                    this.getView().getModel("LocalViewModel").setProperty("/businessTravel", false);
                    this.getView().getModel("LocalViewModel").setProperty("/trainingTravel", false);
                } else {
                    this.byId("idHRBook").setEnabled(false);
                    this.byId("idPayComp").setEnabled(false);
                    this.byId("idTravelAmt").setEnabled(false);
                    this.byId("idTravelDate").setEnabled(false);
                    this.byId("idTripCategory").setEnabled(false);
                    this.byId("idDestCountry").setEnabled(false);
                    this.byId("idCityCountry").setEnabled(false);
                    this.byId("idCity").setEnabled(false);
                    this.byId("idInsOutKingdom").setEnabled(false);
                    this.byId("idPerDiem").setEnabled(false);
                    this.byId("idTotalPErDiem").setEnabled(false);
                    this.byId("idPayCompVisa").setEnabled(false);
                    this.byId("idPayCom").setEnabled(false);
                    this.getView().getModel("LocalViewModel").setProperty("/businessTravel", true);
                    this.getView().getModel("LocalViewModel").setProperty("/trainingTravel", false);

                }
            },

            onFileAdded: function (oEvent) {
                var file = oEvent.getParameter("item"),
                    Filename = file.getFileName(),
                    Filedata = oEvent.getParameter("item").getFileObject(),
                    sUploaderName = oEvent.getSource().getId().split("--")[1],
                    oUploadPropertyObj = this._fnGetSelectedUploadSetPropoerties(sUploaderName);

                //code for base64/binary array 
                this._getImageData((Filedata), function (Filecontent) {
                    this._addData(Filecontent, Filename, oUploadPropertyObj);
                }.bind(this));

                this.byId(sUploaderName).getDefaultFileUploader().setEnabled(false);
            },

            _getImageData: function (url, callback) {
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

            _addData: function (Filecontent, Filename, oUploadPropertyObj) {


                this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/" + oUploadPropertyObj.AttachmentNew, true);
                this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/" + oUploadPropertyObj.AttachmentFileContent, Filecontent);
                this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/" + oUploadPropertyObj.AttachmentFileName, Filename);
                this.getView().getModel("CreateBusinessTripModel").refresh();


            },

            onFileDeleted: function (oEvent) {
                var sUploaderName = oEvent.getSource().getId().split("--")[1],
                    oUploadPropertyObj = this._fnGetSelectedUploadSetPropoerties(sUploaderName);

                this.byId(sUploaderName).getDefaultFileUploader().setEnabled(true);

                this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/" + oUploadPropertyObj.AttachmentNew, false);
                this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/" + oUploadPropertyObj.AttachmentFileContent, "");
                this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/" + oUploadPropertyObj.AttachmentFileName, "");
                this.getView().getModel("CreateBusinessTripModel").refresh();
            },

            _fnGetSelectedUploadSetPropoerties: function (sUploaderName) {
                var oUploadPropertyObj = {};
                switch (sUploaderName) {
                    case "UploadBoardingPass":
                        if (this.byId("idTripCategory").getSelectedKey() === "B") {
                            oUploadPropertyObj = {
                                AttachmentNew: "isbusinessTravelAttachNew",
                                AttachmentFileContent: "businessTravelattachmentFileContent",
                                AttachmentFileName: "businessTravelattachmentFileName"
                            };
                        } else {
                            oUploadPropertyObj = {
                                AttachmentNew: "istrainingTravelAttachNew",
                                AttachmentFileContent: "trainingTravelattachmentFileContent",
                                AttachmentFileName: "trainingTravelattachmentFileName"
                            };
                        }

                        break;

                    case "UploadVisaCopy":
                        oUploadPropertyObj = {
                            AttachmentNew: "isvisaCopyAttachNew",
                            AttachmentFileContent: "visaCopyattachmentFileContent",
                            AttachmentFileName: "visaCopyattachmentFileName"
                        };
                        break;

                    case "UploadEmbassy":
                        oUploadPropertyObj = {
                            AttachmentNew: "isreceiptEmbassyAttachNew",
                            AttachmentFileContent: "receiptEmbassyattachmentFileContent",
                            AttachmentFileName: "receiptEmbassyattachmentFileName"
                        };
                        break;


                }
                return oUploadPropertyObj;
            },

            onVisaTypeChange: function (oEvent) {
                var sValue = oEvent.getSource().getSelectedKey(),
                    isVisaAttachmentMandatory;
                if (sValue === "N") {
                    this.byId("UploadVisaCopy").getDefaultFileUploader().setEnabled(false);
                    isVisaAttachmentMandatory = false;
                } else {
                    this.byId("UploadVisaCopy").getDefaultFileUploader().setEnabled(true);
                    isVisaAttachmentMandatory = true;
                }

            },
            onTripCategoryChange: function (oEvent) {
                var sValue = oEvent.getSource().getSelectedKey();

                if (sValue === "B") {
                    this.getView().getModel("LocalViewModel").setProperty("/businessTravel", true);
                    this.getView().getModel("LocalViewModel").setProperty("/trainingTravel", false);

                } else {
                    this.getView().getModel("LocalViewModel").setProperty("/businessTravel", false);
                    this.getView().getModel("LocalViewModel").setProperty("/trainingTravel", true);
                }


            }

        });
    });      
