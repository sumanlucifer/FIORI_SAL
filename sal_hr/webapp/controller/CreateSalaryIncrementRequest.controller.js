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
        return BaseController.extend("com.sal.salhr.controller.CreateSalaryIncrementRequest", {
            onInit: function () {
                debugger;
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("SalaryIncrementRequest").attachPatternMatched(this._onObjectMatched, this);

                this.mainModel = this.getOwnerComponent().getModel();
                this.mainModel.setSizeLimit(1000);


                var oLocalViewModel = new JSONModel({
                    busy: false,
                    currentDate: new Date(),
                    jobInfoVisible: false,
                    componesationInfoVisible: false

                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");


            },

            _onObjectMatched: function (oEvent) {
                debugger;
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                this.sChildID = oEvent.getParameter("arguments").childModule;
                var sLayout = oEvent.getParameter("arguments").layout;
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);

                this.fnSetCompensationModel();
                this._bindView();
               

            },

            onSelectCompensation: function (oEve) {
                if (oEve.getSource().getSelected()) {
                    this.getView().getModel("LocalViewModel").setProperty("/componesationInfoVisible", true);
                } else {
                    this.getView().getModel("LocalViewModel").setProperty("/componesationInfoVisible", false);
                }

            },

            onSelectJobInfo: function (oEve) {
                if (oEve.getSource().getSelected()) {
                    this.getView().getModel("LocalViewModel").setProperty("/jobInfoVisible", true);
                }

                else {
                    this.getView().getModel("LocalViewModel").setProperty("/jobInfoVisible", false);
                }

            },
            fnSetCompensationModel: function () {
                var oCreateCompObj = {

                    "seqNumber": "",
                    "userId": "",
                    "startDate": "",
                    "endDate": "",
                    "customDouble1": "",
                    "payType": "",
                    "customDate1": "",
                    "customString4": "",
                    "customString3": "",
                    "customString2": "",
                    "payGroup": "",
                    "isEligibleForCar": true
                };

                var oCompensationModel = new JSONModel(oCreateCompObj);
                 this.getView().setModel(oCompensationModel, "compensationModel");
            },
            _bindView: function (data) {


                var oComponentModel = this.getComponentModel(),
                    that = this,

                    //   var sObject = this.getOwnerComponent().getModel("EmpInfoModel").getData();

                    sKey = oComponentModel.createKey("/SF_EmpEmployment", {
                        personIdExternal: "12002024",
                        userId: "12002024"
                    });

                // this.getView().bindElement({
                //     path: sKey,
                //     parameters: {
                //         expand: "compInfoNav,jobInfoNav",
                //     },
                //     events: {
                //         change: function (oEvent) {
                //             var oContextBinding = oEvent.getSource();
                //             oContextBinding.refresh(false);
                //         }.bind(this),
                //         dataRequested: function () {
                //             this.getView().setBusy(true);
                //         }.bind(this),
                //         dataReceived: function (oData) {
                //             this.getView().setBusy(false);

                //         }.bind(this)
                //     }
                // });

                this.getView().getModel().read(sKey, {
                    urlParameters: {
                        "$expand": "compInfoNav, jobInfoNav"
                    },
                    success: function (oData) {
                        // var oCompensationModel = new JSONModel(oData.compInfoNav.results[0]),
                        //     oJobModel = new JSONModel(oData.jobInfoNav.results[0]);
                        // that.getView().setModel(oCompensationModel, "compensationModel");
                        // that.getView().setModel(oJobModel, "jobModel");
                        that.getView().getModel("compensationModel").setData(oData.compInfoNav.results[0]);
                    },

                    error: function (oError) {
                        if (JSON.parse(oError.responseText).error.message.value.indexOf("{") === 0)
                            sap.m.MessageBox.error(JSON.parse(JSON.parse(oError.responseText).error.message.value).error.message.value.split("]")[1]);
                        else {
                            sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        }
                    }
                });




            },

            onRaiseRequestPress: function () {

                var sjobInfo = this.getView().byId("idJobInfo").getSelected(),
                    sCompensationInfo = this.getView().byId("idCompensationInfo").getSelected();

                if (sjobInfo === true) {
                    var sEntityPath = "/SF_EmpJob",
                        oPayload = this.getView().getModel("jobModel").getData();
                        var sNewPayload = $.extend(true,{},oPayload);
                           delete sNewPayload._metadata;

                } else if (sCompensationInfo === true) {
                    var sEntityPath = "/SF_EmpCompensation",
                        oPayload = this.getView().getModel("compensationModel").getData();
                        var sNewPayload = $.extend(true,{},oPayload);
                           delete sNewPayload._metadata;

                }


                this.getView().setBusy(true);

                this.mainModel.create(sEntityPath, oPayload, {
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
            fnGetCompensationRequestPayload: function () {

            },






            onCreateCancelPress: function () {
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: "TwoColumnsMidExpanded"

                });
                this.mainModel.refresh();
            },
            onResetPress: function () {

                this.onCreateResetPress();



            },

            onCreateResetPress: function () {
                var dataReset = {
                    startDate: new Date(),
                    endDate: new Date(),
                    returnDate: this.sReturnDate,
                    requestDay: this.sRequesting,
                    availBal: false,
                    recurringAbs: false,
                    busy: false,
                    uploadAttachment: true
                };
                this.getView().byId("idRecCheckbox").setSelected(false);
                this.getView().getModel("LocalViewModel").setData(dataReset);
                this.getView().getModel("LocalViewModel").refresh();
            }








        });
    });      
