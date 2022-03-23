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
                    "cust_toDutyTravelItem": 
                        {
                        "cust_userId": sExternalCode,
                        "cust_dutyTravelMain_externalCode": sExternalCode,
                        "cust_dutyTravelMain_effectiveStartDate": "/Date(1647282600000)/",

                        "externalCode": "96056",
                        "externalName": null,
                        "cust_requestType": "1",
                        "cust_perDiemPayComp": "",
                        "cust_totalAmount": "",
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
                        "cust_destination": "",
                        "cust_city": null,
                        "cust_SAUotherCity": null,
                        "cust_cityAll": "",
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

                        "cust_travelSDate1": new Date(),
                        "cust_travelEDate1": "/Date(1647369000000)/",
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

                        "cust_travelSDate2": "/Date(1647369000000)/",
                        "cust_travelEDate2": "/Date(1647369000000)/",
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
                        "mdfSystemRecordStatus": "N"
                    }
                
            },
           
            oCreateBusinessTripModel = new JSONModel(oCreateBusinessObj);

             this.getView().setModel(oCreateBusinessTripModel, "CreateBusinessTripModel");

        // this._fnRemoveFileUploaderItems();
    },
    // _bindView: function () {

    //     var oComponentModel = this.getComponentModel();
    //     //    var sTickets = sObjectPath + "/tickets";
    //     var sKey = oComponentModel.createKey("/SF_DutyTravelMain", {
    //         externalCode: "12002429",
    //         effectiveStartDate: "2022-03-13"
    //     });

    //     this.getView().bindElement({
    //         path: sKey,
    //         parameters: {
    //             expand: "cust_toDutyTravelItem"
    //         },
    //         events: {
    //             change: function (oEvent) {
    //                 var oContextBinding = oEvent.getSource();
    //                 oContextBinding.refresh(false);
    //             }.bind(this),
    //             dataRequested: function () {
    //                 this.getView().setBusy(true);
    //             }.bind(this),
    //             dataReceived: function (oData) {
    //                 this.getView().setBusy(false);
    //             }.bind(this)
    //         }
    //     });




    // },


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
    fnValidateBusinessTripPayload:function(){

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
        if (sReqKey === "Initial") {
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
    onFileAttachEmbassyDeleted: function () {
        var oUploadSet = this.byId("idAttachEmbassyRec");
        oUploadSet.getDefaultFileUploader().setEnabled(true);
    },
    onFileAttachEmbassyAdded: function () {
        var that = this;
        var file = oEvent.getParameter("item");
        var Filename = file.getFileName(),
            Filetype = file.getMediaType(),
            Filesize = file.getFileObject().size,
            Filedata = oEvent.getParameter("item").getFileObject();


        //code for base64/binary array 
        this._getImageData((Filedata), function (Filecontent) {
            that._addData(Filecontent, Filename, Filetype, Filesize);
        });
        var oUploadSet = this.byId("idAttachEmbassyRec");
        oUploadSet.getDefaultFileUploader().setEnabled(false);

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
        this.isAttachment = true;

    }


        });
    });      
