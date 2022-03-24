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
                    currentDate: new Date()
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
                    "cust_toDutyTravelItem":[
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
                        "cust_businessTravelDate": null,
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
                        "visaCopyattachment2UserId": "Extentia"
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
                        this.getView().getModel().refresh();


                    }.bind(this)
                })
            },
            fnValidateBusinessTripPayload: function () {

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
                this.getView().getModel("CreateAirpoPassModel").setProperty("/" + oUploadPropertyObj.AttachmentNew, true);
                this.getView().getModel("CreateAirpoPassModel").setProperty("/" + oUploadPropertyObj.AttachmentFileContent, Filecontent);
                this.getView().getModel("CreateAirpoPassModel").setProperty("/" + oUploadPropertyObj.AttachmentFileName, Filename);
                this.getView().getModel("CreateAirpoPassModel").refresh();
            },

            onFileDeleted: function (oEvent) {
                var sUploaderName = oEvent.getSource().getId().split("--")[1],
                    oUploadPropertyObj = this._fnGetSelectedUploadSetPropoerties(sUploaderName);

                this.byId(sUploaderName).getDefaultFileUploader().setEnabled(true);

                this.getView().getModel("CreateAirpoPassModel").setProperty("/" + oUploadPropertyObj.AttachmentNew, false);
                this.getView().getModel("CreateAirpoPassModel").setProperty("/" + oUploadPropertyObj.AttachmentFileContent, "");
                this.getView().getModel("CreateAirpoPassModel").setProperty("/" + oUploadPropertyObj.AttachmentFileName, "");
                this.getView().getModel("CreateAirpoPassModel").refresh();
            },

            _fnGetSelectedUploadSetPropoerties: function (sUploaderName) {
                var oUploadPropertyObj = {};
                switch (sUploaderName) {
                    case "UploadSetPersonalID":
                        oUploadPropertyObj = {
                            AttachmentNew: "isPersonalIdAttachmentNew",
                            AttachmentFileContent: "personalIdAttachmentFileContent",
                            AttachmentFileName: "personalIdAttachmentFileName"
                        };
                        break;

                    case "UploadSetPersonalPhoto":
                        oUploadPropertyObj = {
                            AttachmentNew: "isPersonalPhotoAttachmentNew",
                            AttachmentFileContent: "personalPhotoAttachmentFileContent",
                            AttachmentFileName: "personalPhotoAttachmentFileName"
                        };
                        break;

                    case "UploadSetnonnationals":
                        oUploadPropertyObj = {
                            AttachmentNew: "isPassportAttachmentNew",
                            AttachmentFileContent: "passportAttachmentFileContent",
                            AttachmentFileName: "passportAttachmentFileName"
                        };
                        break;

                    case "UploadSetCompanyIDCopy":
                        oUploadPropertyObj = {
                            AttachmentNew: "isCompanyIdAttachmentNew",
                            AttachmentFileContent: "companyIdAttachmentFileContent",
                            AttachmentFileName: "companyIdAttachmentFileName"
                        };
                        break;
                }
                return oUploadPropertyObj;
            },

            onVisaTypeChange:function(oEvent){
                var sValue = oEvent.getSource().getSelectedKey(),
                isVisaAttachmentMandatory;
                if(sValue === "N"){
                    this.byId("idAttachVisa").getDefaultFileUploader().setEnabled(false);
                    isVisaAttachmentMandatory = false;
                }else{
                    this.byId("idAttachVisa").getDefaultFileUploader().setEnabled(true);
                    isVisaAttachmentMandatory = true;
                }

            }

        });
    });      
