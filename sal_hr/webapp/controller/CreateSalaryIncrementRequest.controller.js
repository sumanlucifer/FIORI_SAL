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
                var sLayout = oEvent.getParameter("arguments").layout;
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
                this._bindView();
            },

            onSelectCompensation: function(oEve)
            {
                if(oEve.getSource().getSelected())
                {
                    this.getView().getModel("LocalViewModel").setProperty("/componesationInfoVisible", true);
                }else{
                    this.getView().getModel("LocalViewModel").setProperty("/componesationInfoVisible", false);
                }
              
            },

            onSelectJobInfo: function(oEve)
            {
                if(oEve.getSource().getSelected())
                {
                    this.getView().getModel("LocalViewModel").setProperty("/jobInfoVisible", true);
                }

                else{
                    this.getView().getModel("LocalViewModel").setProperty("/jobInfoVisible", false);
                }
              
            },
            _bindView: function () {

                var oComponentModel = this.getComponentModel(),

             //   var sObject = this.getOwnerComponent().getModel("EmpInfoModel").getData();

                sKey = oComponentModel.createKey("/SF_EmpEmployment", {
                    personIdExternal: "12002024",
                    userId: "12002024"         
                });

                this.getView().bindElement({
                    path: sKey,
                    parameters: {
                        expand: "compInfoNav,jobInfoNav",
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
                var sEntityPath = "/SF_Leave",
                    oPayloadObj = this.fnGetLeaveRequestPayload();


                if(this.bValid!= false){
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
