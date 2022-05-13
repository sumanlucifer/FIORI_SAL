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
           
            _bindView: function (data) {


                var oComponentModel = this.getComponentModel(),
                    that = this,

                    //   var sObject = this.getOwnerComponent().getModel("EmpInfoModel").getData();

                    sKey = oComponentModel.createKey("/SF_EmpEmployment", {
                        personIdExternal: "12002425",
                        userId: "12002425"
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
                        var oCompensationModel = new JSONModel(oData.compInfoNav.results[0]),
                        oJobModel = new JSONModel(oData.jobInfoNav.results[0]);
                        that.getView().setModel(oCompensationModel, "compensationModel");
                        that.getView().setModel(oJobModel, "jobModel");
                        
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
                        oPayload = this.fnGetJobRequestPayload();

                } else if (sCompensationInfo === true) {
                    var sEntityPath = "/SF_EmpCompensation",
                        oPayload = this.fnGetCompensationRequestPayload();            

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
            fnGetJobRequestPayload:function(){
                var sJobData = this.getView().getModel("jobModel").getData(),
                sStartDate = this.getView().byId("idStartDate").getDateValue(),
                sNewPayload = $.extend(true,{},sJobData);

                this.getView().getModel("jobModel").setProperty("/startDate",sStartDate);


                delete sNewPayload.__metadata;
                delete sNewPayload.assessmentStatusNav;
                delete sNewPayload.businessUnitNav;
                delete sNewPayload.codeOfJobForEldpNav;
                delete sNewPayload.commitmentIndicatorNav;
                delete sNewPayload.companyNav;
                delete sNewPayload.continuedSicknessPayMeasureNav;
                delete sNewPayload.costCenterNav;
                delete sNewPayload.customString1Nav;
                delete sNewPayload.customString2Nav;
                delete sNewPayload.customString3Nav;
                delete sNewPayload.customString4Nav;
                delete sNewPayload.customString5Nav;
                delete sNewPayload.customString6Nav;
                delete sNewPayload.customString7Nav;
                delete sNewPayload.customString9Nav;
                delete sNewPayload.customString10Nav;
                delete sNewPayload.customString11Nav;
                delete sNewPayload.customString12Nav;
                delete sNewPayload.customString13Nav;
                delete sNewPayload.departmentNav;
                delete sNewPayload.dismissalsNoticePeriodForEmployerNav;
                delete sNewPayload.divisionNav;
                delete sNewPayload.eeo1JobCategoryNav;
                delete sNewPayload.eeoClass;
                delete sNewPayload.electoralCollegeForLaborCourtNav;
                delete sNewPayload.electoralCollegeForWorkersRepresentativesNav;
                delete sNewPayload.electoralCollegeForWorksCouncilNav;
                delete sNewPayload.empRelationshipNav;
                delete sNewPayload.emplStatusNav;
                delete sNewPayload.employeeClassNav;
                delete sNewPayload.employeeNoticePeriodNav;

                delete sNewPayload.employeeTypeNav;
                delete sNewPayload.employmentNav;
                delete sNewPayload.employmentTypeNav;
                delete sNewPayload.eventNav;
                delete sNewPayload.eventReasonNav;
                delete sNewPayload.familyRelationshipWithEmployerNav;
                delete sNewPayload.flsaStatusNav;
                delete sNewPayload.fromCurrencyNav;
                delete sNewPayload.harmfulAgentExposureNav;
                delete sNewPayload.jobCodeNav;
                delete sNewPayload.laborCourtSectorNav;
                delete sNewPayload.locationNav;
                delete sNewPayload.managerEmploymentNav;
                delete sNewPayload.managerUserNav;
                delete sNewPayload.occupationalLevelsNav;
                delete sNewPayload.operation;
                delete sNewPayload.payGradeNav;
                delete sNewPayload.payGroupNav;
                delete sNewPayload.payScaleAreaNav;
                delete sNewPayload.payScaleGroupNav;
                delete sNewPayload.payScaleLevelNav;
                delete sNewPayload.payScaleTypeNav;
                delete sNewPayload.periodIndicatorNav;
                delete sNewPayload.positionNav;
                delete sNewPayload.probationaryPeriodMeasureNav;
                delete sNewPayload.regularTempNav;
                delete sNewPayload.toCurrencyNav;
                delete sNewPayload.userNav;
                delete sNewPayload.wfRequestNav;
                delete sNewPayload.workerCategoryNav;
                
                return sNewPayload;

            },
            fnGetCompensationRequestPayload: function () {
                var sCompData = this.getView().getModel("compensationModel").getData(),
                sStartDate = this.getView().byId("idStartDate").getDateValue(),
                sNewPayload = $.extend(true,{},sCompData);

                this.getView().getModel("jobModel").setProperty("/startDate",sStartDate);
                           
                           delete sNewPayload.__metadata;
                           delete sNewPayload.customString4;
                           delete sNewPayload.createdBy;
                           delete sNewPayload.createdDateTime;
                           delete sNewPayload.createdOn;
                           delete sNewPayload.customString2Nav;
                           delete sNewPayload.employmentNav;
                           delete sNewPayload.event;
                           delete sNewPayload.eventNav;
                           delete sNewPayload.eventReason;
                           delete sNewPayload.eventReasonNav;
                           delete sNewPayload.lastModifiedBy;
                           delete sNewPayload.lastModifiedDateTime;
                           delete sNewPayload.lastModifiedOn;
                           delete sNewPayload.operation;
                           delete sNewPayload.payGroupNav;
                           delete sNewPayload.userNav;
                           delete sNewPayload.wfRequestNav;
                           delete sNewPayload.empPayCompRecurringNav;
                           delete sNewPayload.payTypeNav;
                         

                       return sNewPayload;

                         

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
