sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/Device"

],

    function (BaseController, Controller, JSONModel, MessageBox, Fragment, Device) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.CreateAdditionalPaymentRequest", {
            onInit: function () {

                this.oRouter = this.getRouter();
                this.oRouter.getRoute("AdditionalPaymentRequest").attachPatternMatched(this._onObjectMatched, this);
                this.mainModel = this.getOwnerComponent().getModel();
                this.mainModel.setSizeLimit(1000);


                var oLocalViewModel = new JSONModel({
                    busy: false,
                    currentDate: new Date()
                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");

            },

            _onObjectMatched: function (oEvent) {
                this.onResetPress();
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;

                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);

            },


            onRaiseRequestPress: function () {
                if (!this._validateMandatoryFields()) {

                    return;
                }
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
                var sUserID = null;
                var oEmployeeNameINP = this.getView().byId("idEmployeeNameINP");
                if (this.getOwnerComponent().getModel("EmpInfoModel").getProperty("/IsUserManager") === true) {
                    sUserID = oEmployeeNameINP.getValue();
                } else {
                    sUserID = this.getOwnerComponent().getModel("EmpInfoModel").getData().userId;
                }

                var sEffectiveStartDate = this.getView().byId("idIssueDate").getDateValue();
                var sCurrency = this.getView().byId("idInpCurrencyCode").getSelectedKey();
                var sType = this.getView().byId("idInpType").getSelectedKey();
                var saltCostCenter = this.getView().byId("idInpAltCostCenter").getSelectedKey();
                var sValue = this.getView().byId("idValueINP").getValue();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }),
                    oDate = dateFormat.format(new Date(sEffectiveStartDate));
                oDate = oDate + "T00:00:00";
                return {
                    "payComponentCode": sType,
                    "userId": sUserID,
                    "payDate": sEffectiveStartDate,
                    "notes": null,
                    "alternativeCostCenter": saltCostCenter,
                    "currencyCode": sCurrency,
                    "value": sValue
                };
            },

            _validateMandatoryFields: function () {

                // validate leave application for other user Field
                var oEmployeeNameINP = this.getView().byId("idEmployeeNameINP");
                if (this.getOwnerComponent().getModel("EmpInfoModel").getProperty("/IsUserManager") === true) {
                    if (!oEmployeeNameINP.getValue()) {
                        oEmployeeNameINP.setValueState("Error");
                        oEmployeeNameINP.setValueStateText("Please select user for which leave application will be created.");
                        sValidationErrorMsg = "Please fill the all required fields.";
                        return;
                    } else {
                        oEmployeeNameINP.setValueState("None");
                    }
                }

                var bValid = true;
                if (this.byId("idValueINP").getValue() === "") {
                    this.byId("idValueINP").setValueState("Error");
                    this.byId("idValueINP").setValueStateText(
                        "Please enter Value"
                    );
                    bValid = false;
                } else {
                    this.byId("idValueINP").setValueState("None");
                    this.byId("idValueINP").setValueStateText(null);
                }

                return bValid;
            },
            OnLiveChangeValue: function (oEve) {
                var sValue = oEve.getSource().getValue();
                var bValid = true;
                if (sValue === "") {
                    this.byId("idValueINP").setValueState("Error");
                    this.byId("idValueINP").setValueStateText(
                        "Please enter Value"
                    );
                    bValid = false;
                } else {
                    this.byId("idValueINP").setValueState("None");
                    this.byId("idValueINP").setValueStateText(null);
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

                this.onAdditionalPymntResetPress();




            },
            onAdditionalPymntResetPress: function () {


                this.getView().byId("idValueINP").setValue("");
                this.getView().getModel("LocalViewModel").setProperty("/currentDate", new Date());
                this.getView().getModel("LocalViewModel").refresh();

            },

            onValueHelpRequest: function () {
                var oView = this.getView();

                if (!this._oEmpF4Dialog) {
                    this._oEmpF4Dialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.sal.salhr.Fragments.PRNValueHelp",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        if (Device.system.desktop) {
                            oDialog.addStyleClass("sapUiSizeCompact");
                        }
                        return oDialog;
                    });
                }

                this._oEmpF4Dialog.then(function (oDialog) {
                    var oList = oDialog.getAggregation("_dialog").getAggregation("content")[1];
                    oDialog.open();
                }.bind(this));
            },

            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var suserIdFilter = new Filter({
                    path: "userId",
                    operator: FilterOperator.EQ,
                    value1: sValue.trim()
                });
                var sfirstNameFilter = new Filter({
                    path: "firstName",
                    operator: FilterOperator.EQ,
                    value1: sValue.trim()
                });
                var aFilter = [];
                aFilter.push(suserIdFilter, sfirstNameFilter);
                oEvent.getSource().getBinding("items").filter(aFilter);
            },

            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("idEmployeeNameINP").setValue(oSelectedItem.getBindingContext().getObject().userId);
            }





        });
    });      
