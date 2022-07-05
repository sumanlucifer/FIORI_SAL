sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
],

    function (BaseController, JSONModel) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.CreateBusinessTripRequest", {
            onInit: function () {
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("BusinessTripRequest").attachPatternMatched(this._onObjectMatched, this);
                this.mainModel = this.getOwnerComponent().getModel();
                this.mainModel.setSizeLimit(1000);

                var oLocalViewModel = new JSONModel({
                    busy: false,
                    currentDate: new Date(),
                    businessTravel: false,
                    trainingTravel: false,
                    businessCategory: true,
                    trianingCategory: false,
                    FlightVisaPanelShow: false,
                    visaFee: false,
                    cityVisible: false,
                    otherCityVisible: false,
                    cityOtherCountry: true
                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");


            },

            _onObjectMatched: function (oEvent) {
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;

                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);

                // this.fnGetEmpInfo("12002429", this.sParentID);
                this.fnSetCreateBusinessTripModel();

            },
            fnSetCreateBusinessTripModel: function () {
                // this.EmpInfoObj = oEmpInfoObj;
                this.EmpInfoObj = this.getOwnerComponent().getModel("EmpInfoModel").getData();


                var sExternalCode = this.EmpInfoObj.userId,
                    sFirstName = this.EmpInfoObj.firstName + " " + this.EmpInfoObj.middleName + " " + this.EmpInfoObj.lastName,
                    sPayGrade = this.EmpInfoObj.payGrade,
                    sCostCenter = this.EmpInfoObj.costCentre,
                    sPhnNum = this.EmpInfoObj.emergencyNumber;



                var oCreateBusinessObj = {
                    "externalCode": sExternalCode,
                    //  "externalCode": "12002440",
                    "effectiveStartDate": new Date(),
                    "cust_toDutyTravelItem": [
                        {
                            "cust_userId": sExternalCode,
                            // "cust_userId": "12002440",

                            "cust_dutyTravelMain_externalCode": sExternalCode,
                            // "cust_dutyTravelMain_externalCode": "12002440",
                            "cust_dutyTravelMain_effectiveStartDate": new Date(),

                            "externalCode": sExternalCode,

                            // "externalCode": "12002440",
                            "externalName": null,
                            "cust_requestType": "1",
                            "cust_perDiemPayComp": "9256",
                            "cust_totalAmount": null,
                            "cust_tripCategory": "B",
                            "cust_isCompany": true,
                            "cust_hotelBooking": false,
                            "cust_assignJustification": "",
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
                            "cust_destination": "SAU",
                            "cust_city": null,
                            "cust_SAUotherCity": null,
                            "cust_cityAll": null,
                            "cust_inOutKingdom": "OUT",
                            "cust_perDiem": null,
                            "cust_totalPerDiem": null,

                            "cust_businessTravelDate": new Date(),
                            "cust_businessTravelFrom": null,
                            "cust_businessTravelTo": null,
                            "cust_businessTravelFlightNum": null,
                            "cust_businessTravelDepTime": null,
                            "cust_businessTravelArrTime": null,
                            "cust_businessTravelPayComp": null,

                            "cust_trainingTravelDate": new Date(),
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

                            "cust_travelSDate1": new Date(),
                            "cust_travelEDate1": new Date(),
                            "cust_travelTime1": null,
                            "cust_desti1": null,
                            "cust_citySau1": null,
                            "cust_SAUotherCity2": null,
                            "cust_city1": null,
                            "cust_inOutKingdom1": null,
                            "cust_perDiem1": null,
                            "cust_totalPerDiem1": null,
                            "cust_TravelDate1": null,
                            "cust_TravelFrom1": null,
                            "cust_TravelTo1": null,
                            "cust_TravelFlightNum1": null,
                            "cust_TravelDepTime1": null,
                            "cust_TravelArrTime1": null,
                            "cust_TravelPayComp1": null,
                            "cust_ticketAmount1": null,
                            "cust_expenseTypeVisaFee1": null,
                            "cust_visaFeePayComp1": null,
                            "cust_visaFeeExpenseAmount1": null,

                            "cust_travelSDate2": new Date(),
                            "cust_travelEDate2": new Date(),
                            "cust_travelTime2": null,
                            "cust_desti2": null,
                            "cust_citySau2": null,
                            "cust_SAUotherCity3": null,
                            "cust_city2": null,
                            "cust_inOutKingdom2": null,
                            "cust_perDiem2": null,
                            "cust_totalPerDiem2": null,
                            "cust_TravelDate2": null,
                            "cust_TravelFrom2": null,
                            "cust_TravelTo2": null,
                            "cust_TravelFlightNum2": null,
                            "cust_TravelDepTime2": null,
                            "cust_TravelArrTime2": null,
                            "cust_TravelPayComp2": null,
                            "cust_ticketAmount2": null,
                            "cust_expenseTypeVisaFee2": null,
                            "cust_visaFeePayComp2": null,
                            "cust_visaFeeExpenseAmount2": null,

                            "cust_status": null,
                            "cust_returnDate": null,
                            "cust_paymentType": null,
                            "mdfSystemRecordStatus": "N",
                            "travelattachment1FileContent": "create travelattachment1 attache",
                            "travelattachment1FileName": "travelattachment1.txt",
                            "isTravelAttach1New": true,
                            "travelattachment1UserId": sExternalCode,


                            "businessTravelattachmentFileContent": "businessTravelattachment create",
                            "businessTravelattachmentFileName": "businessTravelAttachment.txt",
                            "isbusinessTravelAttachNew": false,
                            "businessTravelattachmentUserId": sExternalCode,

                            "trainingTravelattachmentFileContent": "trainingTravelattachment create",
                            "trainingTravelattachmentFileName": "trainingTravelattachment.txt",
                            "istrainingTravelAttachNew": false,
                            "trainingTravelattachmentUserId": sExternalCode,

                            "receiptEmbassyattachmentFileContent": "receiptEmbassy 3create",
                            "receiptEmbassyattachmentFileName": "receiptEmbassy.txt",
                            "isreceiptEmbassyAttachNew": false,
                            "receiptEmbassyattachmentUserId": sExternalCode,

                            "visaCopyattachmentFileContent": "visaCopy 6 create",
                            "visaCopyattachmentFileName": "visaCopy.txt",
                            "isvisaCopyAttachNew": false,
                            "visaCopyattachmentUserId": sExternalCode


                        }
                    ]
                },


                    oCreateBusinessTripModel = new JSONModel(oCreateBusinessObj);

                this.getView().setModel(oCreateBusinessTripModel, "CreateBusinessTripModel");

                // this._fnRemoveFileUploaderItems();
            },


            onRaiseRequestPress: function () {
                debugger;
                var sPath = "/SF_DutyTravelMain",
                    sValidationErrorMsg = this.fnValidateBusinessTripPayload(),
                    oPayload = this.getView().getModel("CreateBusinessTripModel").getData(),
                    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });

                debugger;

                if (sValidationErrorMsg === "") {
                    this.getView().setBusy(true);


                    var sStartDate = this.getView().byId("idEffectDatePicker").getDateValue(),
                        oStartDate = dateFormat.format(new Date(sStartDate));
                    sStartDate = oStartDate + "T00:00:00";
                    oPayload.effectiveStartDate = sStartDate;

                    var sTravelDate = this.getView().byId("idTravelDate").getDateValue(),
                        oTravelDate = dateFormat.format(new Date(sTravelDate));
                    sTravelDate = oTravelDate + "T00:00:00";
                    oPayload.cust_toDutyTravelItem[0].cust_assignStartDate = sTravelDate;


                    var sReturnDate = this.getView().byId("idReturnDate").getDateValue(),
                        oReturnDate = dateFormat.format(new Date(sReturnDate));
                    sReturnDate = oReturnDate + "T00:00:00";
                    oPayload.cust_toDutyTravelItem[0].cust_assignEndDate = sReturnDate;


                    var sBusinessTravelDate = this.getView().byId("idFlightTravelDate").getDateValue(),
                        oBusinessTravelDate = dateFormat.format(new Date(sBusinessTravelDate));
                    sBusinessTravelDate = oBusinessTravelDate + "T00:00:00";
                    oPayload.cust_toDutyTravelItem[0].cust_businessTravelDate = sBusinessTravelDate;

                    var sTrainingTravelDate = this.getView().byId("idTrainingFlightTravelDate").getDateValue(),
                        oTrainingTravelDate = dateFormat.format(new Date(sTrainingTravelDate));
                    sTrainingTravelDate = oTrainingTravelDate + "T00:00:00";
                    oPayload.cust_toDutyTravelItem[0].cust_trainingTravelDate = sTrainingTravelDate;


                    // Convert selcted time to specific time format as "PT0H31M30S"
                    if (oPayload.cust_toDutyTravelItem[0].cust_travelTime) {
                        oPayload.cust_toDutyTravelItem[0].cust_travelTime = "PT" + oPayload.cust_toDutyTravelItem[0].cust_travelTime.split(":")[0] + "H" + oPayload.cust_toDutyTravelItem[0].cust_travelTime.split(":")[1] + "M00S";
                    }



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
                            this.getView().getModel().refresh();


                        }.bind(this)
                    })
                } else {
                    sap.m.MessageBox.error(sValidationErrorMsg);
                }
            },

            onHotelBookChange: function (evt) {

                var sValue = JSON.parse(evt.getSource().getSelectedKey());
                this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/cust_hotelBooking");


            },
            fnValidateBusinessTripPayload: function () {
                this.getView().setBusy(true);

                var sValidationErrorMsg = "",
                    oEffectStartDatePicker = this.byId("idEffectDatePicker"),
                    oTravelDatePicker = this.byId("idTravelDate"),
                    oReturnDatePicker = this.byId("idReturnDate"),
                    sDestinationCountry = this.getView().byId("idDestCountry"),
                    // oFlightTravelDatePicker = this.byId("idFlightTravelDate"),
                    sTravelJustification = this.byId("idTravelJustification");
                //sOtherCity = this.byId("idCityCountry");

                debugger;
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
                    if (oReturnDatePicker.getValue() < oTravelDatePicker.getValue()) {
                        oReturnDatePicker.setValueState("Error");
                        oReturnDatePicker.setValueStateText("Return Date should be later than Travel Date");
                        sValidationErrorMsg = "Please select Return Date later than Travel Date";
                    } else {
                        oReturnDatePicker.setValueState("None");
                    }
                }


                // validate Destination Country Field

                if (!sDestinationCountry.getSelectedKey()) {
                    sDestinationCountry.setValueState("Error");
                    sDestinationCountry.setValueStateText("Please select Destination Country.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    sDestinationCountry.setValueState("None");
                }

                // // Validate Flight Deatils Travel Date
                // if (!oFlightTravelDatePicker.getValue()) {
                //     oFlightTravelDatePicker.setValueState("Error");
                //     oFlightTravelDatePicker.setValueStateText("Please select Travel Date");
                //     sValidationErrorMsg = "Please fill the all required fields.";
                // } else {
                //     oFlightTravelDatePicker.setValueState("None");
                // }


                // Validate Travel Justification
                if (!sTravelJustification.getValue()) {
                    sTravelJustification.setValueState("Error");
                    sTravelJustification.setValueStateText("Travel Business Justification is required");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    sTravelJustification.setValueState("None");
                }

                // Validate Other City
                // if (!sOtherCity.getValue()) {
                //     sOtherCity.setValueState("Error");
                //     sOtherCity.setValueStateText("City(Other Country) is required");
                //     sValidationErrorMsg = "Please fill the all required fields.";
                // } else {
                //     sOtherCity.setValueState("None");
                // }


                // Validate attachment sections

                // if (this.byId("idTripCategory").getSelectedKey() === "B") {
                //     if (!this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/isbusinessTravelAttachNew")) {
                //         sValidationErrorMsg = "Please upload Boarding Pass.";
                //         this.getView().setBusy(false);
                //         return sValidationErrorMsg;
                //     }
                // } else {
                //     if (!this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/istrainingTravelAttachNew")) {
                //         sValidationErrorMsg = "Please upload Boarding Pass.";
                //         this.getView().setBusy(false);
                //         return sValidationErrorMsg;
                //     }
                // }


                //   # Visa Copy Mandatory check
                if (this.byId("idVisaType").getSelectedKey() === "V") {
                    // # Visa Copy Mandatory check
                    if (!this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/isvisaCopyAttachNew")) {
                        sValidationErrorMsg = "Please upload Visa Copy.";
                        this.getView().setBusy(false);
                        return sValidationErrorMsg;
                    }

                    // # Embassy Receipt Mandatory check
                    if (!this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/isreceiptEmbassyAttachNew")) {
                        sValidationErrorMsg = "Please upload Embassy Receipt.";
                        this.getView().setBusy(false);
                        return sValidationErrorMsg;
                    }
                }

                this.getView().setBusy(false);
                return sValidationErrorMsg;



            },



            onCreateCancelPress: function () {
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: "TwoColumnsMidExpanded"

                });
                // this.mainModel.refresh();
                this.onResetPress();

            },
            onResetPress: function () {
                this.getView().setBusy(true);

                this.fnSetCreateBusinessTripModel();

                this.getView().byId("UploadBoardingPass").removeAllItems();
                this.getView().byId("UploadBoardingPass").getDefaultFileUploader().setEnabled(true);

                this.getView().byId("UploadVisaCopy").removeAllItems();
                if (this.byId("idVisaType").getSelectedKey() === "N") {
                    this.getView().byId("UploadVisaCopy").getDefaultFileUploader().setEnabled(false);
                    this.getView().getModel("LocalViewModel").setProperty("/visaFee", false);
                } else {
                    this.getView().byId("UploadVisaCopy").getDefaultFileUploader().setEnabled(true);
                    this.getView().getModel("LocalViewModel").setProperty("/visaFee", true);
                }



                this.getView().byId("UploadEmbassy").removeAllItems();
                this.getView().byId("UploadEmbassy").getDefaultFileUploader().setEnabled(true);

                this.getView().setBusy(false);





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
                    this.getView().getModel("LocalViewModel").setProperty("/FlightVisaPanelShow", false);

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

                    this.getView().getModel("LocalViewModel").setProperty("/FlightVisaPanelShow", true);



                    if (this.byId("idTripCategory").getSelectedKey() === "B") {
                        this.getView().getModel("LocalViewModel").setProperty("/businessTravel", true);
                        this.getView().getModel("LocalViewModel").setProperty("/trainingTravel", false);
                    } else {
                        this.getView().getModel("LocalViewModel").setProperty("/businessTravel", false);
                        this.getView().getModel("LocalViewModel").setProperty("/trainingTravel", true);
                    }

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
                    this.getView().getModel("LocalViewModel").setProperty("/visaFee", false);
                    isVisaAttachmentMandatory = false;

                    this.byId("idPayCompVisa").setValue();

                } else {
                    this.byId("UploadVisaCopy").getDefaultFileUploader().setEnabled(true);
                    this.getView().getModel("LocalViewModel").setProperty("/visaFee", true);
                    isVisaAttachmentMandatory = true;

                    this.byId("idPayCompVisa").setValue("Business Visa Cost (Off-Cycle)");
                }

            },
            onTripCategoryChange: function (oEvent) {
                var sValue = oEvent.getSource().getSelectedKey();

                if (sValue === "B") {
                    this.getView().getModel("LocalViewModel").setProperty("/businessTravel", true);
                    this.getView().getModel("LocalViewModel").setProperty("/trainingTravel", false);
                    this.getView().getModel("LocalViewModel").setProperty("/businessCategory", true);
                    this.getView().getModel("LocalViewModel").setProperty("/trainingCategory", false);
                    this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/cust_perDiemPayComp", "9256");
                    this.byId("idPayComp").setValue("Business Trip Per-Diem Off Cycle");

                } else {
                    this.getView().getModel("LocalViewModel").setProperty("/businessTravel", false);
                    this.getView().getModel("LocalViewModel").setProperty("/trainingTravel", true);
                    this.getView().getModel("LocalViewModel").setProperty("/businessCategory", false);
                    this.getView().getModel("LocalViewModel").setProperty("/trainingCategory", true);
                    this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/cust_perDiemPayComp", "9257");
                    this.byId("idPayComp").setValue("Training Trip Per-Diem Off-Cycle");

                }

                if (this.byId("idReqType").getSelectedKey() === "1") {
                    this.getView().getModel("LocalViewModel").setProperty("/businessTravel", false);
                    this.getView().getModel("LocalViewModel").setProperty("/trainingTravel", false);
                }


            },
            onDestCountryChange: function (oEvent) {

                var sDestCountry = oEvent.getSource().getSelectedKey(),
                    sPayGrade = this.EmpInfoObj.payGrade;

                var sCountryVisibleSet = sDestCountry === "SAU" ? this.getView().getModel("LocalViewModel").setProperty("/cityVisible", true) : this.getView().getModel("LocalViewModel").setProperty("/cityVisible", false);

                var sOtherCityCountrySet = sDestCountry === "SAU" ? this.getView().getModel("LocalViewModel").setProperty("/cityOtherCountry", false) : this.getView().getModel("LocalViewModel").setProperty("/cityOtherCountry", true);

                this.getView().getModel().read("/SF_DutyTravel_PerDiem",
                    {
                        urlParameters: {
                            "$filter": "(cust_country eq '" + sDestCountry + "' and cust_salaryGrade eq '" + sPayGrade + "')"
                        },
                        success: function (oData) {
                            this.getView().byId("idPerDiem").setValue(oData.results[0].cust_amount);
                            this.fnCalculateTotalPerDiem();
                        }.bind(this),
                        error: function (oError) {
                            sap.m.MessageBox.error(JSON.stringify(oError));
                        }.bind(this),
                    });


            },
            onCitySaudiChange: function (oEvent) {
                debugger;
                var sCitySaudi = oEvent.getSource().getSelectedKey();


                var sCitySaudiVisibleSet = sCitySaudi === "OTH" ? this.getView().getModel("LocalViewModel").setProperty("/otherCityVisible", true) : this.getView().getModel("LocalViewModel").setProperty("/otherCityVisible", false);

            },
            fnCalculateTotalPerDiem: function () {

                var sTotalPerDiem = Number(this.byId("idPerDiem").getValue()) + Number(this.getView().getModel("CreateBusinessTripModel").getProperty("/cust_toDutyTravelItem/0/cust_ticketAmount")) + Number(this.byId("idVisaAmt").getValue());
                //    sTotalPerDiem = String(sTotalPerDiem);
                this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/cust_totalPerDiem", sTotalPerDiem);
                this.getView().getModel("CreateBusinessTripModel").setProperty("/cust_toDutyTravelItem/0/cust_totalAmount", sTotalPerDiem);


            },
            onTravelDateChange: function (oEvent) {
                var sTravelDate = oEvent.getSource().getValue();
                this.getView().byId("idReturnDate").setValue(sTravelDate);
            },
            onReturnDateChange: function (oEvent) {
                var sTravelDate = this.getView().byId("idTravelDate").getDateValue();
                var sReturnDate = oEvent.getSource().getDateValue();


                if (new Date(sReturnDate).getTime() < new Date(sTravelDate).getTime()) {
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("Return Date should be later than Travel Date");

                } else {
                    oEvent.getSource().setValueState();
                    oEvent.getSource().setValueStateText("");
                    this.getView().byId("idTravelDate").setValueState();
                    this.getView().byId("idTravelDate").setValueStateText("");

                }
            }


        });
    });      
