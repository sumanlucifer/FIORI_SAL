sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "com/sal/salhr/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device",
    "sap/m/MessageBox"
],

    function (BaseController, JSONModel, formatter, Filter, FilterOperator, Device, MessageBox) {
        "use strict";

        return BaseController.extend("com.sal.salhr.controller.BusinessTripRequestDetailPage", {
            formatter: formatter,
            onInit: function () {
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("BusinessTripRequestDetailPage").attachPatternMatched(this._onObjectMatched, this);
                this.mainModel = this.getOwnerComponent().getModel();
                var oLocalViewModel = new JSONModel({
                    EditMode: false,
                    PageTitle: null,
                    Modify: true,
                    currentDate: new Date(),
                });
                this.getView().setModel(oLocalViewModel, "LocalViewModel");
            },

            _onObjectMatched: function (oEvent) {
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                this.sChildID = oEvent.getParameter("arguments").childModule;
                var sLayout = oEvent.getParameter("arguments").layout;

                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);

                if (sLayout === "ThreeColumnsMidExpanded") {
                    this.getView().getModel("LocalViewModel").setProperty("/EditMode", false);
                    this.byId("idBusinessTripetailsFullScreenBTN").setIcon("sap-icon://full-screen");
                    this._getTicketData(this.sChildID);
                }
            },

            _bindView: function (data) {
                var object = data.results[0];
                this.object = data.results[0];
                var oHeaderModel = new JSONModel(data.results[0]);
                this.getView().setModel(oHeaderModel, "headerModel");

                // if (object.status === "APPROVED") {
                //     this.getView().getModel("LocalViewModel").setProperty("/Modify", false);
                // } else {
                //     this.getView().getModel("LocalViewModel").setProperty("/Modify", true);
                // }

                var oComponentModel = this.getComponentModel();
                var sKey = oComponentModel.createKey("/SF_DutyTravelMain", {
                    // effectiveStartDate: object.effectiveStartDate,
                    // externalCode: object.externalCode
                    effectiveStartDate: "2022-03-14",
                    externalCode: "12002428"
                });

                this.getView().getModel().read(sKey, {
                    urlParameters: {
                        $expand: "cust_toDutyTravelItem"
                    },
                    success: function (oData) {
                        this._fnSetDisplayEditBusinessTripModel(oData);
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)

                });

                this.getView().getModel("LocalViewModel").setProperty("/PageTitle", "Business Trip Request");
            },

            _fnSetDisplayEditBusinessTripModel: function (oData) {
                var oTravelItemDetailsObj = oData.cust_toDutyTravelItem.results[0],
                    oDisplayEditBusinessTripObj = {
                        "externalCode": oData.externalCode,
                        "effectiveStartDate": oData.effectiveStartDate,
                        "cust_toDutyTravelItem": [
                            {
                                "cust_userId": oTravelItemDetailsObj.cust_userId,
                                "cust_dutyTravelMain_externalCode": oTravelItemDetailsObj.cust_dutyTravelMain_externalCode,
                                "cust_dutyTravelMain_effectiveStartDate": oTravelItemDetailsObj.cust_dutyTravelMain_effectiveStartDate,
                                "externalCode": oTravelItemDetailsObj.externalCode,
                                "externalName": oTravelItemDetailsObj.externalName,
                                "cust_requestType": oTravelItemDetailsObj.cust_requestType,
                                "cust_perDiemPayComp": oTravelItemDetailsObj.cust_perDiemPayComp,
                                "cust_totalAmount": oTravelItemDetailsObj.cust_totalAmount,
                                "cust_tripCategory": oTravelItemDetailsObj.cust_tripCategory,
                                "cust_isCompany": oTravelItemDetailsObj.cust_isCompany,
                                "cust_hotelBooking": oTravelItemDetailsObj.cust_hotelBooking,
                                "cust_assignJustification": oTravelItemDetailsObj.cust_assignJustification,
                                "cust_expenseTypeBusinessTravel": oTravelItemDetailsObj.cust_expenseTypeBusinessTravel,
                                "cust_expenseTypeTrainingTravel": oTravelItemDetailsObj.cust_expenseTypeTrainingTravel,
                                "cust_businessTicketAmount": oTravelItemDetailsObj.cust_businessTicketAmount,
                                "cust_trainingExpenseAmount": oTravelItemDetailsObj.cust_trainingExpenseAmount,

                                "cust_empName": oTravelItemDetailsObj.cust_empName,
                                "cust_payGrade": oTravelItemDetailsObj.cust_payGrade,
                                "cust_costCenter": oTravelItemDetailsObj.cust_costCenter,
                                "cust_emerPhoneNum": oTravelItemDetailsObj.cust_emerPhoneNum,

                                "cust_assignStartDate": oTravelItemDetailsObj.cust_assignStartDate,
                                "cust_assignEndDate": oTravelItemDetailsObj.cust_assignEndDate,
                                "cust_travelTime": oTravelItemDetailsObj.cust_travelTime,
                                "cust_destination": oTravelItemDetailsObj.cust_destination,
                                "cust_city": oTravelItemDetailsObj.cust_city,
                                "cust_SAUotherCity": oTravelItemDetailsObj.cust_SAUotherCity,
                                "cust_cityAll": oTravelItemDetailsObj.cust_cityAll,
                                "cust_inOutKingdom": oTravelItemDetailsObj.cust_inOutKingdom,
                                "cust_perDiem": oTravelItemDetailsObj.cust_perDiem,
                                "cust_totalPerDiem": oTravelItemDetailsObj.cust_totalPerDiem,
                                "cust_businessTravelDate": oTravelItemDetailsObj.cust_businessTravelDate,
                                "cust_businessTravelFrom": oTravelItemDetailsObj.cust_businessTravelFrom,
                                "cust_businessTravelTo": oTravelItemDetailsObj.cust_businessTravelTo,
                                "cust_businessTravelFlightNum": oTravelItemDetailsObj.cust_businessTravelFlightNum,
                                "cust_businessTravelDepTime": oTravelItemDetailsObj.cust_businessTravelDepTime,
                                "cust_businessTravelArrTime": oTravelItemDetailsObj.cust_businessTravelArrTime,
                                "cust_businessTravelPayComp": oTravelItemDetailsObj.cust_businessTravelPayComp,
                                "cust_trainingTravelDate": oTravelItemDetailsObj.cust_trainingTravelDate,
                                "cust_trainingTravelFrom": oTravelItemDetailsObj.cust_trainingTravelFrom,
                                "cust_trainingTravelTo": oTravelItemDetailsObj.cust_trainingTravelTo,
                                "cust_trainingTravelFlightNum": oTravelItemDetailsObj.cust_trainingTravelFlightNum,
                                "cust_trainingTravelDepTime": oTravelItemDetailsObj.cust_trainingTravelDepTime,
                                "cust_trainingTravelArrTime": oTravelItemDetailsObj.cust_trainingTravelArrTime,
                                "cust_trainingTravelPayComp": oTravelItemDetailsObj.cust_trainingTravelPayComp,
                                "cust_ticketAmount": oTravelItemDetailsObj.cust_ticketAmount,
                                "cust_expenseTypeVisaFee": oTravelItemDetailsObj.cust_expenseTypeVisaFee,
                                "cust_visaFeePayComp": oTravelItemDetailsObj.cust_visaFeePayComp,
                                "cust_visaFeeExpenseAmount": oTravelItemDetailsObj.cust_visaFeeExpenseAmount,

                                "cust_travelSDate1": oTravelItemDetailsObj.cust_travelSDate1,
                                "cust_travelEDate1": oTravelItemDetailsObj.cust_travelEDate1,
                                "cust_travelTime1": oTravelItemDetailsObj.cust_travelTime1,
                                "cust_desti1": oTravelItemDetailsObj.cust_desti1,
                                "cust_citySau1": oTravelItemDetailsObj.cust_citySau1,
                                "cust_SAUotherCity2": oTravelItemDetailsObj.cust_SAUotherCity2,
                                "cust_city1": oTravelItemDetailsObj.cust_city1,
                                "cust_inOutKingdom1": oTravelItemDetailsObj.cust_inOutKingdom1,
                                "cust_perDiem1": oTravelItemDetailsObj.cust_perDiem1,
                                "cust_totalPerDiem1": oTravelItemDetailsObj.cust_totalPerDiem1,
                                "cust_TravelDate1": oTravelItemDetailsObj.cust_TravelDate1,
                                "cust_TravelFrom1": oTravelItemDetailsObj.cust_TravelFrom1,
                                "cust_TravelTo1": oTravelItemDetailsObj.cust_TravelTo1,
                                "cust_TravelFlightNum1": oTravelItemDetailsObj.cust_TravelFlightNum1,
                                "cust_TravelDepTime1": oTravelItemDetailsObj.cust_TravelDepTime1,
                                "cust_TravelArrTime1": oTravelItemDetailsObj.cust_TravelArrTime1,
                                "cust_TravelPayComp1": oTravelItemDetailsObj.cust_TravelPayComp1,
                                "cust_ticketAmount1": oTravelItemDetailsObj.cust_ticketAmount1,
                                "cust_expenseTypeVisaFee1": oTravelItemDetailsObj.cust_expenseTypeVisaFee1,
                                "cust_visaFeePayComp1": oTravelItemDetailsObj.cust_visaFeePayComp1,
                                "cust_visaFeeExpenseAmount1": oTravelItemDetailsObj.cust_visaFeeExpenseAmount1,

                                "cust_travelSDate2": oTravelItemDetailsObj.cust_travelSDate2,
                                "cust_travelEDate2": oTravelItemDetailsObj.cust_travelEDate2,
                                "cust_travelTime2": oTravelItemDetailsObj.cust_travelTime2,
                                "cust_desti2": oTravelItemDetailsObj.cust_desti2,
                                "cust_citySau2": oTravelItemDetailsObj.cust_citySau2,
                                "cust_SAUotherCity3": oTravelItemDetailsObj.cust_SAUotherCity3,
                                "cust_city2": oTravelItemDetailsObj.cust_city2,
                                "cust_inOutKingdom2": oTravelItemDetailsObj.cust_inOutKingdom2,
                                "cust_perDiem2": oTravelItemDetailsObj.cust_perDiem2,
                                "cust_totalPerDiem2": oTravelItemDetailsObj.cust_totalPerDiem2,
                                "cust_TravelDate2": oTravelItemDetailsObj.cust_TravelDate2,
                                "cust_TravelFrom2": oTravelItemDetailsObj.cust_TravelFrom2,
                                "cust_TravelTo2": oTravelItemDetailsObj.cust_TravelTo2,
                                "cust_TravelFlightNum2": oTravelItemDetailsObj.cust_TravelFlightNum2,
                                "cust_TravelDepTime2": oTravelItemDetailsObj.cust_TravelDepTime2,
                                "cust_TravelArrTime2": oTravelItemDetailsObj.cust_TravelArrTime2,
                                "cust_TravelPayComp2": oTravelItemDetailsObj.cust_TravelPayComp2,
                                "cust_ticketAmount2": oTravelItemDetailsObj.cust_ticketAmount2,
                                "cust_expenseTypeVisaFee2": oTravelItemDetailsObj.cust_expenseTypeVisaFee2,
                                "cust_visaFeePayComp2": oTravelItemDetailsObj.cust_visaFeePayComp2,
                                "cust_visaFeeExpenseAmount2": oTravelItemDetailsObj.cust_visaFeeExpenseAmount2,

                                "cust_status": oTravelItemDetailsObj.cust_status,
                                "cust_returnDate": oTravelItemDetailsObj.cust_returnDate,
                                "cust_paymentType": oTravelItemDetailsObj.cust_paymentType,
                                "mdfSystemRecordStatus": oTravelItemDetailsObj.mdfSystemRecordStatus,

                                "travelattachment1FileContent": "create travel attache",
                                "travelattachment1FileName": "tr1.txt",
                                "isTravelAttach1New": true,
                                "travelattachment1UserId": "Extentia",
                                "travelattachment2FileContent": "create travel2 attache",
                                "travelattachment2FileName": "tr2.txt",
                                "isTravelAttach2New": true,
                                "travelattachment2UserId": "Extentia",
                                "businessTravelattachmentFileContent": "btravle create",
                                "businessTravelattachmentFileName": "btravel.txt",
                                "isbusinessTravelAttachNew": true,
                                "businessTravelattachmentUserId": "Extentia",
                                "trainingTravelattachmentFileContent": "btravle2create",
                                "trainingTravelattachmentFileName": "btrave2.txt",
                                "istrainingTravelAttachNew": true,
                                "trainingTravelattachmentUserId": "Extentia",
                                "receiptEmbassyattachmentFileContent": "btravle 3create",
                                "receiptEmbassyattachmentFileName": "btrave3.txt",
                                "isreceiptEmbassyAttachNew": true,
                                "receiptEmbassyattachmentUserId": "Extentia",
                                "receiptEmbassyattachment1FileContent": "btravle4 create",
                                "receiptEmbassyattachment1FileName": "btrave4.txt",
                                "isreceiptEmbassyAttach1New": true,
                                "receiptEmbassyattachment1UserId": "Extentia",
                                "receiptEmbassyattachment2FileContent": "emb22 create",
                                "receiptEmbassyattachment2FileName": "emb22.txt",
                                "isreceiptEmbassyAttach2New": true,
                                "receiptEmbassyattachment2UserId": "Extentia",
                                "visaCopyattachmentFileContent": "btravle 6 create",
                                "visaCopyattachmentFileName": "btrave6.txt",
                                "isvisaCopyAttachNew": true,
                                "visaCopyattachmentUserId": "Extentia",
                                "visaCopyattachment1FileContent": "btravle 7 create",
                                "visaCopyattachment1FileName": "btrave7.txt",
                                "isvisaCopyAttach1New": true,
                                "visaCopyattachment1UserId": "Extentia",
                                "visaCopyattachment2FileContent": "btravle 8 create",
                                "visaCopyattachment2FileName": "btrave8.txt",
                                "isvisaCopyAttach2New": true,
                                "visaCopyattachment2UserId": "Extentia",
                                "travelAttachment1Id": "34908",
                                "travelAttachment2Id": "34909",
                                "businessTravelAttachmentId": "34910",
                                "trainingTravelAttachmentId": "34911",
                                "receiptEmbassyAttachmentId": "34912",
                                "receiptEmbassyAttachment1Id": "34913",
                                "receiptEmbassyAttachment2Id": "34914",
                                "visaCopyAttachmentId": "34915",
                                "visaCopyAttachment1Id": "34916",
                                "visaCopyAttachment2Id": "34917"
                            }
                        ]
                    },
                    oDisplayEditBusinessTripModel = new JSONModel(oDisplayEditBusinessTripObj);
                this.getView().setModel(oDisplayEditBusinessTripModel, "DisplayEditBusinessTripModel");
            },

            onEditPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", true);
            },

            onCancelPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", false);
            },

            onWithdrawPress: function () {
                this.getView().setBusy(true);
                var oComponentModel = this.getComponentModel(),
                    sKey = oComponentModel.createKey("/SF_DutyTravelMain", {
                        // effectiveStartDate: new Date("2022-04-13"),
                        // externalCode: "12002427"
                        effectiveStartDate: this.object.effectiveStartDate,
                        externalCode: this.object.externalCode
                    });
                oComponentModel.remove(sKey, {
                    success: function (oData) {
                        this.getView().setBusy(false);
                        if (oData !== "" || oData !== undefined) {
                            MessageBox.success("Record Deleted successfully.");
                            oComponentModel.refresh();
                            this.oRouter.navTo("detail", {
                                parentMaterial: this.sParentID,
                                layout: "TwoColumnsMidExpanded"
                            });
                        } else {
                            MessageBox.error("Record Not able to delete.");
                        }
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                        MessageBox.error("Record Not able to delete.");
                    }.bind(this),
                });
            },

            onSavePress: function () {
                var
                    // sValidationErrorMsg = this.fnValidateAirPassPayload(),

                    sKey = this.getView().getModel().createKey("/SF_DutyTravelMain", {
                        // effectiveStartDate: object.effectiveStartDate,
                        // externalCode: object.externalCode
                        effectiveStartDate: "2022-03-14",
                        externalCode: "12002428"
                    });

                // if (sValidationErrorMsg === "") {
                this.getView().setBusy(true);

                // this._fnUpdateAttachmentData();

                var oPayloadObj = this.getView().getModel("DisplayEditBusinessTripModel").getProperty("/");
                oPayloadObj.cust_toDutyTravelItem[0].cust_isCompany = (oPayloadObj.cust_toDutyTravelItem[0].cust_isCompany === "Yes" ? true : false);

                // oPayloadObj.cust_toAirportPassItem.cust_domStationName = oPayloadObj.cust_toAirportPassItem.cust_airportLoc === "Loc05" ? oPayloadObj.cust_toAirportPassItem.cust_domStationName : null;

                this.getView().getModel().update(sKey, oPayloadObj, {
                    success: function (oResponse) {
                        this.getView().setBusy(false);
                        MessageBox.success("Requested changes updated successfully.");
                        this.oRouter.navTo("detail", {
                            parentMaterial: this.sParentID,
                            layout: "TwoColumnsMidExpanded"
                        });
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                        MessageBox.error(JSON.parse(JSON.parse(oError.responseText).error.message.value).error.message.value.split("]")[1]);
                    }.bind(this)
                });
                // } else {
                //     MessageBox.error(sValidationErrorMsg);
                // }
            },

            _fnUpdateAttachmentData: function () {
                var oData = this.getView().getModel("DisplayEditAirpassModel").getProperty("/");

                if (oData.isPersonalIdAttachmentNew === false) {
                    var oPersonalIdAttachmentObj = this.getView().getModel("AttachmentModel").getProperty("/PersonalIdAttachment");
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/isPersonalIdAttachmentNew", true);
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/personalIdAttachmentFileContent", oPersonalIdAttachmentObj.fileContent);
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/personalIdAttachmentFileName", oPersonalIdAttachmentObj.fileName);
                    this.getView().getModel("DisplayEditAirpassModel").refresh();
                }

                if (oData.isPersonalPhotoAttachmentNew === false) {
                    var oPersonalPhotoAttachmentObj = this.getView().getModel("AttachmentModel").getProperty("/PersonalPhotoAttachment");
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/isPersonalPhotoAttachmentNew", true);
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/personalPhotoAttachmentFileContent", oPersonalPhotoAttachmentObj.fileContent);
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/personalPhotoAttachmentFileName", oPersonalPhotoAttachmentObj.fileName);
                    this.getView().getModel("DisplayEditAirpassModel").refresh();
                }

                if (oData.isPassportAttachmentNew === false) {
                    var oPassportAttachmentObj = this.getView().getModel("AttachmentModel").getProperty("/PassportAttachment");
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/isPassportAttachmentNew", true);
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/passportAttachmentFileContent", oPassportAttachmentObj.fileContent);
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/passportAttachmentFileName", oPassportAttachmentObj.fileName);
                    this.getView().getModel("DisplayEditAirpassModel").refresh();
                }

                if (oData.isCompanyIdAttachmentNew === false) {
                    var oCompanyIdAttachmentObj = this.getView().getModel("AttachmentModel").getProperty("/CompanyIdAttachment");
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/isCompanyIdAttachmentNew", true);
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/companyIdAttachmentFileContent", oCompanyIdAttachmentObj.fileContent);
                    this.getView().getModel("DisplayEditAirpassModel").setProperty("/companyIdAttachmentFileName", oCompanyIdAttachmentObj.fileName);
                    this.getView().getModel("DisplayEditAirpassModel").refresh();
                }
            },

            fnValidateAirPassPayload: function () {
                this.getView().setBusy(true);

                var sValidationErrorMsg = "",
                    oEffectStartDatePicker = this.getView().byId("idEditAirportPassEffectDatePicker");

                // Validate AirportPass Effective Start Date
                if (!oEffectStartDatePicker.getValue()) {
                    oEffectStartDatePicker.setValueState("Error");
                    oEffectStartDatePicker.setValueStateText("Please select airport pass effective start date");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oEffectStartDatePicker.setValueState("None");
                }

                // validate Type of Pass Field
                var oTypeofPass = this.getView().byId("idEditTypeOfPassSLT");
                if (!oTypeofPass.getSelectedKey()) {
                    oTypeofPass.setValueState("Error");
                    oTypeofPass.setValueStateText("Please select atleast one value for type of pass field.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oTypeofPass.setValueState("None");
                }

                // validate Age according to given user's Date of Birth
                var oDateofbirthatePicker = this.getView().byId("idEditDateofBithInp"),
                    oDateofbirth = new Date(oDateofbirthatePicker.getValue()),
                    iAge = this.fnCalculateUserAge(oDateofbirth);

                if (iAge < 18) {
                    oDateofbirthatePicker.setValueState("Error");
                    oDateofbirthatePicker.setValueStateText("Your age must be more than 18 years.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oDateofbirthatePicker.setValueState("None");
                }

                // validate Nationality Field
                var oNationality = this.getView().byId("idEditNationalityInp");
                if (!oNationality.getValue() || oNationality.getValue().length < 2) {
                    oNationality.setValueState("Error");
                    oNationality.setValueStateText("Please enter valid Nationality.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oNationality.setValueState("None");
                }

                // validate Airport Location Field
                var oAirPortLocaton = this.getView().byId("idEditAirPortLocatonSLT");
                if (!oAirPortLocaton.getSelectedKey()) {
                    oAirPortLocaton.setValueState("Error");
                    oAirPortLocaton.setValueStateText("Please select atleast one value for airport location field.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oAirPortLocaton.setValueState("None");
                }

                // validate Domestic staion field if Airport location is selected as "Loc05" i.e Domestic
                if (oAirPortLocaton.getSelectedKey() === "Loc05") {
                    var oDomasticStation = this.getView().byId("idEditDomasticStationInp");
                    if (!oDomasticStation.getValue()) {
                        oDomasticStation.setValueState("Error");
                        oDomasticStation.setValueStateText("Please enter domestic station name.");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        oDomasticStation.setValueState("None");
                    }
                }

                // validate Permit Date Field
                var oPermitDate = this.getView().byId("idEditPermitDate");
                if (!oPermitDate.getValue()) {
                    oPermitDate.setValueState("Error");
                    oPermitDate.setValueStateText("Please enter Permit Date.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oPermitDate.setValueState("None");
                }

                // validate Purpose of Permit Field
                var oPurposeofPermit = this.getView().byId("idEditPurposeofPermitInp");
                if (!oPurposeofPermit.getValue() || oPurposeofPermit.getValue().length < 3) {
                    oPurposeofPermit.setValueState("Error");
                    oPurposeofPermit.setValueStateText("Please enter Purpose of Permit.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oPurposeofPermit.setValueState("None");
                }

                // validate Acknowledge First Field
                var oAcknowledgeTextFirst = this.getView().byId("idEditAcknowledgeTextFirstSLT");
                if (oAcknowledgeTextFirst.getSelectedKey() === "Select") {
                    oAcknowledgeTextFirst.setValueState("Error");
                    oAcknowledgeTextFirst.setValueStateText("Please select value for Acknowledgement 1.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oAcknowledgeTextFirst.setValueState("None");
                }

                // validate Acknowledge second Field
                var oAcknowledgeTextSecond = this.getView().byId("idEditAcknowledgeTextSecondSLT");
                if (oAcknowledgeTextSecond.getSelectedKey() === "Select") {
                    oAcknowledgeTextSecond.setValueState("Error");
                    oAcknowledgeTextSecond.setValueStateText("Please select value for Acknowledgement 2.");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oAcknowledgeTextSecond.setValueState("None");
                }

                // Validate attachment sections
                if (this.getView().byId("idEditUploadSetPersonalID").getItems().length <= 0) {
                    sValidationErrorMsg = "Please upload files for Personal ID Copy.";
                    return sValidationErrorMsg;
                }
                if (this.getView().byId("idEditUploadSetPersonalPhoto").getItems().length <= 0) {
                    sValidationErrorMsg = "Please upload files for Personal Photo.";
                    return sValidationErrorMsg;
                }
                if (this.getView().byId("idEditUploadSetCompanyIDCopy").getItems().length <= 0) {
                    sValidationErrorMsg = "Please upload files for Company ID Copy.";
                    return sValidationErrorMsg;
                }

                this.getView().setBusy(false);
                return sValidationErrorMsg;
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
                this.getView().getModel("DisplayEditAirpassModel").setProperty("/" + oUploadPropertyObj.AttachmentNew, true);
                this.getView().getModel("DisplayEditAirpassModel").setProperty("/" + oUploadPropertyObj.AttachmentFileContent, Filecontent);
                this.getView().getModel("DisplayEditAirpassModel").setProperty("/" + oUploadPropertyObj.AttachmentFileName, Filename);
                this.getView().getModel("DisplayEditAirpassModel").refresh();
            },

            onFileDeleted: function (oEvent) {
                var sUploaderName = oEvent.getSource().getId().split("--")[1],
                    oUploadPropertyObj = this._fnGetSelectedUploadSetPropoerties(sUploaderName);

                this.getView().getModel("DisplayEditAirpassModel").setProperty("/" + oUploadPropertyObj.AttachmentNew, false);
                this.getView().getModel("DisplayEditAirpassModel").refresh();
            },

            _fnGetSelectedUploadSetPropoerties: function (sUploaderName) {
                var oUploadPropertyObj = {};
                switch (sUploaderName) {
                    case "idEditUploadSetPersonalID":
                        oUploadPropertyObj = {
                            AttachmentNew: "isPersonalIdAttachmentNew",
                            AttachmentFileContent: "personalIdAttachmentFileContent",
                            AttachmentFileName: "personalIdAttachmentFileName"
                        };
                        break;

                    case "idEditUploadSetPersonalPhoto":
                        oUploadPropertyObj = {
                            AttachmentNew: "isPersonalPhotoAttachmentNew",
                            AttachmentFileContent: "personalPhotoAttachmentFileContent",
                            AttachmentFileName: "personalPhotoAttachmentFileName"
                        };
                        break;
                }

                return oUploadPropertyObj;
            },


            onDownLoadPress: function (oEvent) {
                var sUploaderName = oEvent.getSource().getParent().getParent().getParent().getId().split("--")[1],
                    oAttachmentData = this.getView().getModel("AttachmentModel").getProperty("/"),
                    sFileContent = null, sFileName = null, sFileext = null, sMimeType = null;

                switch (sUploaderName) {
                    case "idDisplayUploadSetPersonalIDCopy":
                        sFileContent = oAttachmentData.PersonalIdAttachment.fileContent;
                        sFileName = oAttachmentData.PersonalIdAttachment.fileName.split(".")[0];
                        sFileext = oAttachmentData.PersonalIdAttachment.fileExtension;
                        sMimeType = oAttachmentData.PersonalIdAttachment.mimeType;
                        break;

                    case "idDisplayUploadSetPersonalPhoto":
                        sFileContent = oAttachmentData.PersonalPhotoAttachment.fileContent;
                        sFileName = oAttachmentData.PersonalPhotoAttachment.fileName.split(".")[0];
                        sFileext = oAttachmentData.PersonalPhotoAttachment.fileExtension;
                        sMimeType = oAttachmentData.PersonalPhotoAttachment.mimeType;
                        break;
                }

                if (sFileext === "pdf" || sFileext === "png") {
                    var decodedPdfContent = atob(sFileContent);
                    var byteArray = new Uint8Array(decodedPdfContent.length)
                    for (var i = 0; i < decodedPdfContent.length; i++) {
                        byteArray[i] = decodedPdfContent.charCodeAt(i);
                    }
                    var blob = new Blob([byteArray.buffer], { type: sMimeType });
                    var _pdfurl = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = _pdfurl;
                    a.download = sFileName;
                    a.dispatchEvent(new MouseEvent('click'));
                }
                else {
                    sap.ui.core.util.File.save(sFileContent, sFileName, sFileext, sMimeType);
                }
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
                this.oRouter.navTo("BusinessTripRequestDetailPage", {
                    parentMaterial: this.sParentID,
                    childModule: this.sChildID,
                    layout: sLayout
                });
            },

            handleClose: function (oEvent) {
                var sLayout = "",
                    sIcon = this.byId("idBusinessTripetailsFullScreenBTN").getIcon();
                if (sIcon === "sap-icon://full-screen") {
                    sLayout = "TwoColumnsMidExpanded";
                } else {
                    sLayout = "ThreeColumnsMidExpanded";
                    this.byId("idBusinessTripetailsFullScreenBTN").setIcon("sap-icon://full-screen");
                }
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: sLayout
                });
            },

            onBreadCrumbNavPress: function () {
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: "TwoColumnsMidExpanded"
                });
            },

            onReqTypeChange: function () {

            }
        });
    });

