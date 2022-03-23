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
        return BaseController.extend("com.sal.salhr.controller.CreateAdditionalPaymentRequest", {
            onInit: function () {
                debugger;
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("AdditionalPaymentRequest").attachPatternMatched(this._onObjectMatched, this);
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

                this._bindView("/MasterSubModules" + this.sParentID);
              

            },
            _bindView: function () {
             
                var oComponentModel = this.getComponentModel();
                //    var sTickets = sObjectPath + "/tickets";
                var sKey = oComponentModel.createKey("/MasterSubModules", {
                    ID: this.sParentID
                });

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
         

            onRaiseRequestPress: function () {
                var oPayloadObj = this.fnGetAdditionalPaymentPayload(),
                sEntityPath = "/SF_Pay";
                   


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
          
            fnGetAdditionalPaymentPayload: function () {
             

                var sEffectiveStartDate =  this.getView().byId("idIssueDate").getDateValue();
                var sCurrency =  this.getView().byId("idInpCurrencyCode").getSelectedKey();
                var saltCostCenter =  this.getView().byId("idInpAltCostCenter").getSelectedKey();
                var sValue =  this.getView().byId("idValueINP").getValue();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }),
                    oDate = dateFormat.format(new Date(sEffectiveStartDate));
                oDate = oDate + "T00:00:00";
                return {
                    "payComponentCode": "9244",
                    "userId": "12002425",
                    "payDate": sEffectiveStartDate,
                    "notes": null,
                    "alternativeCostCenter": saltCostCenter,
                    "currencyCode": sCurrency,
                    "value": sValue
                };
            },

            onChangeInpIBAN: function (oEve) {
                var sValue = oEve.getSource().getValue();

                if (!sValue.match(/^[0-9A-Za-z]+$/)) {


                    this.getView().byId("idIBANINP").setValueState("Error");
                    this.getView().byId("idIBANINP").setValueStateText("Please enter only alpha-numeric characters");
                }

                else {
                    this.getView().byId("idIBANINP").setValueState("None");

                }

            },


            onChangeInpBankName: function (oEve) {
                var sValue = oEve.getSource().getValue();

                if (!sValue.match(/^[a-zA-Z0-9\s]*$/)) {


                    this.getView().byId("idBankNameINP").setValueState("Error");
                    this.getView().byId("idBankNameINP").setValueStateText("Please enter only alpha-numeric characters");
                }

                else {
                    this.getView().byId("idBankNameINP").setValueState("None");

                }

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
            onBankRequestResetPress: function () {

                
                this.getView().byId("idIBANINP").setValue();
                this.getView().byId("idBankNameINP").setValue();
                this.getView().getModel("LocalViewModel").setProperty("/currentDate", new Date());
                this.getView().getModel("LocalViewModel").refresh();

            }
           


        });
    });      
