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

                this.fnGetEmpInfo("12002429",this.sParentID);
              

            },
            fnSetCreateBusinessTripModel: function (oEmpInfoObj) {
                this.EmpInfoObj = oEmpInfoObj;

               var oCreateBusinessObj = {

                sExternalCode: this.EmpInfoObj.userId,
                    sFirstName: this.EmpInfoObj.firstName + " "  + this.EmpInfoObj. middleName + " " + this.EmpInfoObj.lastName,
                    sPayGrade : this.EmpInfoObj.payGrade,
                    sCostCenter : this.EmpInfoObj.costCentre,
                    sPhnNum : this.EmpInfoObj.emergencyNumber
               }
                    // oCreateAirpassObj = {
                    //     "externalCode": sExternalCode,
                    //     "externalName": null,
                    //     "effectiveStartDate": new Date(),
                    //     "cust_toAirportPassItem": {
                    //         "cust_mobileNumber": sMobileNumber,
                    //         "cust_acknowledge2": null,
                    //         "cust_acknowledge1": null,
                    //         "cust_airportLoc": null,
                    //         "cust_airportPassMain_effectiveStartDate": new Date(),
                    //         "cust_airportPassMain_externalCode": sExternalCode,
                    //         "cust_domStationName": null,
                    //         "cust_nationality": sNationality,
                    //         "cust_permitDate": null,
                    //         "cust_permitPurpose": null,
                    //         "cust_nationalID": sNationalID,
                    //         "cust_typeOfPass": null,
                    //         "externalCode": "95924",
                    //         "externalName": null,
                    //         "cust_dateOfBirth": sDateOfBirth
                    //     },
                    //     "isPersonalIdAttachmentNew": false,
                    //     "personalIdAttachmentFileContent": "Personal ID",
                    //     "personalIdAttachmentFileName": "Personal ID.txt",
                    //     "personalIdAttachmentUserId": "Extentia",
                    //     "isPersonalPhotoAttachmentNew": false,
                    //     "personalPhotoAttachmentFileContent": "Personal photo",
                    //     "personalPhotoAttachmentFileName": "Personal Photo.txt",
                    //     "personalPhotoAttachmentUserId": "Extentia",
                    //     "isPassportAttachmentNew": false,
                    //     "passportAttachmentFileContent": "Passport",
                    //     "passportAttachmentFileName": "Passport.txt",
                    //     "passportAttachmentUserId": "Extentia",
                    //     "isCompanyIdAttachmentNew": false,
                    //     "companyIdAttachmentFileContent": "Company Id",
                    //     "companyIdAttachmentFileName": "Company Id.txt",
                    //     "companyIdAttachmentUserId": "Extentia"
                    // },
                    var oCreateBusinessTripModel = new JSONModel(oCreateBusinessObj);

                this.getView().setModel(oCreateBusinessTripModel, "CreateBusinessTripModel");

                // this._fnRemoveFileUploaderItems();
            },
            _bindView: function () {
             
                var oComponentModel = this.getComponentModel();
                //    var sTickets = sObjectPath + "/tickets";
                var sKey = oComponentModel.createKey("/SF_DutyTravelMain", {
                    externalCode: "12002429",
                    effectiveStartDate:"2022-03-13"
                });

                this.getView().bindElement({
                    path: sKey,
                    parameters: {
                        expand: "cust_toDutyTravelItem"
                    },
                    events: {
                        change: function (oEvent) {
                            var oContextBinding = oEvent.getSource();
                            oContextBinding.refresh(false);
                        }.bind(this),
                        dataRequested: function () {
                            this.getView().setBusy(true);
                        }.bind(this),
                        dataReceived: function (oData) {
                            this.getView().setBusy(false);
                        }.bind(this)
                    }
                });




            },
         

            onRaiseRequestPress: function () {
                var oPayloadObj = this.fnGetBusinessTripPayload();
                        sEntityPath = "/SF_BankDetails";
                   


                this.getView().setBusy(true);

                this.mainModel.create(sEntityPath, oPayloadObj, {
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
            onReqTypeChange:function(){
                var sReqKey = this.getView().byId("idReqType").getSelectedKey();
                if(sReqKey === "Initial"){
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
                }else {
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
            }


        });
    });      
