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
        return BaseController.extend("com.sal.salhr.controller.CreateRequest", {
            onInit: function () {
                debugger;
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("IDCardRequest").attachPatternMatched(this._onObjectMatched, this);
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

                this._bindView();

            },
            _bindView: function () {
                var sUserID = this.getOwnerComponent().getModel("EmpInfoModel").getData().userId;
                var sKey = this.getComponentModel().createKey("/EmpInfo", {
                    userId: sUserID
                });
                this.getView().bindElement({
                    path: sKey,
                    parameters: {
                        custom: {
                            "moreInfo": "true"
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

            },


            onRaiseRequestPress: function () {
                var sEntityPath = "/SF_IDReplacement",
                    oPayloadObj = this.fnGetIDReplacementRequestPayload();


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

            fnGetIDReplacementRequestPayload: function () {
                var oDataObj = this.getView().getBindingContext().getObject(),
                    sEffectiveStartDate = this.getView().byId("idEffectDatePicker").getText();

                return {
                    "User": oDataObj.userId,
                    "effectiveStartDate": new Date(sEffectiveStartDate),
                    // "effectiveStartDate": "/Date(1645660800000)/",
                    "cust_idReplacementDetails": {
                        "cust_bloodGroup": oDataObj.bloodGroup,
                        "cust_idReplacement_effectiveStartDate": new Date(sEffectiveStartDate),
                        // "cust_idReplacement_effectiveStartDate": "/Date(1645660800000)/",

                        "externalCode": "46986",
                        "cust_idReplacement_User": oDataObj.userId,
                        "cust_lname": oDataObj.lastName,
                        "cust_jobTitle": oDataObj.jobTitle,
                        "cust_payGrade": oDataObj.payGrade,
                        "cust_emergencyPhone": oDataObj.emergencyNumber,
                        "cust_fname": oDataObj.firstName,
                        "cust_nationality": oDataObj.nationality,
                        "cust_sname": oDataObj.middleName,
                        "cust_prn": oDataObj.userId,
                        "cust_seniorityDate": new Date(oDataObj.seniorityDate)
                        // "cust_seniorityDate": "/Date(1645660800000)/"
                    }
                };
            },

            onCreateCancelPress: function () {
                debugger;
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: "TwoColumnsMidExpanded"

                });
                this.mainModel.refresh();
            },
            // onResetPress: function () {           
            //         this.onIDCardRequestResetPress();

            // },
            // onIDCardRequestResetPress: function () {
            //     this.getView().getModel("LocalViewModel").setProperty("/currentDate", new Date());
            // }

        });
    });      
