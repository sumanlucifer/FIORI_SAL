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
                    that = this;

                    this.EmpInfoObj = this.getOwnerComponent().getModel("EmpInfoModel").getData();

                  var sKey = oComponentModel.createKey("/SF_EmpEmployment", {
                        personIdExternal: this.EmpInfoObj.userId,
                        userId: this.EmpInfoObj.userId
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
                            oJobModel = new JSONModel(oData.jobInfoNav.results[0]),
                            oSalaryModel = new JSONModel(oData);
                        that.getView().setModel(oCompensationModel, "compensationModel");
                        that.getView().setModel(oJobModel, "jobModel");
                        that.getView().setModel(oSalaryModel, "salaryModel");

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
                    sValidationErrorMsg = this.fnValidateSalaryIncPayload(),
                    sCompensationInfo = this.getView().byId("idCompensationInfo").getSelected();

                if (sjobInfo === true) {
                    var sEntityPath = "/SF_EmpJob",
                        oPayload = this.fnGetJobRequestPayload();

                } else if (sCompensationInfo === true) {
                    var sEntityPath = "/SF_EmpCompensation",
                        oPayload = this.fnGetCompensationRequestPayload();

                }

                if (sValidationErrorMsg === "") {

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
                            // sap.m.MessageBox.error(JSON.parse(JSON.parse(oError.responseText).error.message.value).error.message.value.split("]")[1]);

                            sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            this.getView().getModel().refresh();


                        }.bind(this)
                    })
                } else {
                    sap.m.MessageBox.error(sValidationErrorMsg);
                }


            },
            fnGetJobRequestPayload: function () {
                var sJobData = this.getView().getModel("jobModel").getData(),
                    sStartDate = this.getView().byId("idStartDate").getDateValue(),
                    sNewPayload = $.extend(true, {}, sJobData);

                // this.getView().getModel("jobModel").setProperty("/startDate", sStartDate);
                // this.getView().getModel("jobModel").refresh();


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

                sNewPayload.startDate = sStartDate;
                 
                return sNewPayload;

            },
            fnGetCompensationRequestPayload: function () {
                var sCompData = this.getView().getModel("compensationModel").getData(),
                sStartDate = this.getView().byId("idStartDate").getDateValue(),
                    sNewPayload = $.extend(true, {}, sCompData);

                // this.getView().getModel("compensationModel").setProperty("/startDate", sStartDate);
                // this.getView().getModel("compensationModel").refresh();

              
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }),
                    oStartDate = dateFormat.format(new Date(sStartDate));
                sStartDate = oStartDate + "T00:00:00";

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
                
              
                sNewPayload.startDate = sStartDate;
              
                sNewPayload.isEligibleForCar = JSON.parse(sNewPayload.isEligibleForCar);
               

               
                return sNewPayload;



            },

            fnValidateSalaryIncPayload: function () {
                this.getView().setBusy(true);

                var sjobInfo = this.getView().byId("idJobInfo").getSelected(),

                    sCompensationInfo = this.getView().byId("idCompensationInfo").getSelected();

                var sValidationErrorMsg = "",
                    oStartDatePicker = this.byId("idStartDate"),
                    oIncumbentPosition = this.byId("idIncumbentPosition"),
                    oCompany = this.byId("idCompany"),
                    sDirectManager = this.getView().byId("idDirectManager"),
                    sJobCountry = this.byId("idJobCountry"),
                    sNotes = this.byId("idNotes"),
                    oProbationaryDate = this.byId("idProbationaryDate"),
                    sJobTitle = this.byId("idJobTitle"),
                    sIKOOK = this.byId("idIKOOK"),
                    sFullTimeEmp = this.byId("idFullTimeEmp"),
                    sEmpType = this.byId("idEmpType"),
                    sPayGroup = this.byId("idPayGroup"),
                    sCompCountry = this.byId("idCompCountry"),
                    sCommision = this.byId("idCommision"),
                    sCompanyPayGroup = this.byId("idCompPayGroup");

                if (sjobInfo === true) {

                    // Validate Incumbent Parent Position
                    if (!oIncumbentPosition.getValue()) {
                        oIncumbentPosition.setValueState("Error");
                        oIncumbentPosition.setValueStateText("Incumbent Parent Posiiton is required");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        oIncumbentPosition.setValueState("None");
                    }


                    // validate Company Field
                    if (!oCompany.getSelectedKey()) {
                        oCompany.setValueState("Error");
                        oCompany.setValueStateText("Please select Company.");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        oCompany.setValueState("None");
                    }


                    // Validate Direct Manager
                    if (!sDirectManager.getValue()) {
                        sDirectManager.setValueState("Error");
                        sDirectManager.setValueStateText("Please enter Direct Manager");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sDirectManager.setValueState("None");
                    }

                    // Validate Notes
                    if (!sNotes.getValue()) {
                        sNotes.setValueState("Error");
                        sNotes.setValueStateText("Please enter Notes");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sNotes.setValueState("None");
                    }

                    // validate Pay Group
                    if (!sPayGroup.getSelectedKey()) {
                        sPayGroup.setValueState("Error");
                        sPayGroup.setValueStateText("Please select Company.");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sPayGroup.setValueState("None");
                    }

                    // Validate Probationary period End Date
                    if (!oProbationaryDate.getValue()) {
                        oProbationaryDate.setValueState("Error");
                        oProbationaryDate.setValueStateText("Please select Probationary Period End date");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        oProbationaryDate.setValueState("None");
                    }

                    // Validate Job Title
                    if (!sJobTitle.getValue()) {
                        sJobTitle.setValueState("Error");
                        sJobTitle.setValueStateText("Please enter Job title");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sJobTitle.setValueState("None");
                    }

                    // Validate IK/OOK
                    if (!sIKOOK.getValue()) {
                        sIKOOK.setValueState("Error");
                        sIKOOK.setValueStateText("Please enter Job title");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sIKOOK.setValueState("None");
                    }

                    // Validate Is Full Time Employee
                    if (!sFullTimeEmp.getValue()) {
                        sFullTimeEmp.setValueState("Error");
                        sFullTimeEmp.setValueStateText("Please enter Job title");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sFullTimeEmp.setValueState("None");
                    }

                    // Validate Job Country
                    if (!sJobCountry.getSelectedKey()) {
                        sJobCountry.setValueState("Error");
                        sJobCountry.setValueStateText("Please enter Country");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sJobCountry.setValueState("None");
                    }

                    // Validate Employee Type
                    if (!sEmpType.getValue()) {
                        sEmpType.setValueState("Error");
                        sEmpType.setValueStateText("Please enter Job title");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sEmpType.setValueState("None");
                    }


                } else if (sCompensationInfo === true) {

                    // validate Comp Pay Group
                    if (!sCompanyPayGroup.getSelectedKey()) {
                        sCompanyPayGroup.setValueState("Error");
                        sCompanyPayGroup.setValueStateText("Please select Company.");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sCompanyPayGroup.setValueState("None");
                    }

                    // Validate Comp Country
                    if (!sCompCountry.getSelectedKey()) {
                        sCompCountry.setValueState("Error");
                        sCompCountry.setValueStateText("Please enter Country");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sCompCountry.setValueState("None");
                    }

                    // Validate Commision
                    if (!sCommision.getValue()) {
                        sCommision.setValueState("Error");
                        sCommision.setValueStateText("Please enter Country");
                        sValidationErrorMsg = "Please fill the all required fields.";
                    } else {
                        sCommision.setValueState("None");
                    }

                }



                // Validate Business Trip Effective Start Date
                if (!oStartDatePicker.getValue()) {
                    oStartDatePicker.setValueState("Error");
                    oStartDatePicker.setValueStateText("Please select Efective Start date");
                    sValidationErrorMsg = "Please fill the all required fields.";
                } else {
                    oStartDatePicker.setValueState("None");
                }





                this.getView().setBusy(false);
                return sValidationErrorMsg;



            },





            onCreateCancelPress: function () {
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: "TwoColumnsMidExpanded"

                });
                this.mainModel.refresh();
            },
            onResetPress: function () {

                this._bindView();

                this.getView().getModel("LocalViewModel").setProperty("/componesationInfoVisible",false);
                this.getView().getModel("LocalViewModel").setProperty("/jobInfoVisible",false);

                this.getView().byId("idJobInfo").setSelected(false);
                this.getView().byId("idCompensationInfo").setSelected(false);



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
