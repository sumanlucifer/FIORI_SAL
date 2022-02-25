sap.ui.define([ 
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/upload/Uploader"
],

    function (BaseController, Controller,JSONModel,MessageBox,Uploader) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.CreateRequest", {
            onInit: function () {
                debugger;
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("RaiseRequest").attachPatternMatched(this._onObjectMatched, this);
                // this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                this.mainModel = this.getOwnerComponent().getModel();
                var that = this;

                this.sReturnDate= new Date();
                this.sRequesting = 1;
                this.sReturnDate.setDate(new Date().getDate() + 1);
                if(this.sReturnDate.getDay() === 5){
                    this.sReturnDate.setDate(this.sReturnDate.getDate() + 2);
                    
                }else if(this.sReturnDate.getDay() === 6){
                    this.sReturnDate.setDate(this.sReturnDate.getDate() + 1);
                   
                }else{
                    this.sRequesting = 1;
                }
                var oLocalViewModel = new JSONModel({
                    startDate: new Date(),    
                    endDate: new Date(),
                    returnDate : this.sReturnDate,
                    requestDay : this.sRequesting,
                    availBal : false,
                    recurringAbs : false,
                    busy:false,
                    uploadAttachment:true,
                    currentDate:new Date()
                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");

              
                

                // this.getView().addEventDelegate({
                //     onBeforeShow: function (evt) {
    
                //         that.loadFragment();
    
                //     }.bind(this),
                //     onAfterHide: function (evt) {
    
                //     }
                // });
            },
            // onRouteMatched: function (oEvent) {
            //     this.sParentID = oEvent.getParameter("arguments").parentMaterial;
            //     this.loadFragment();

            // },
            _onObjectMatched: function (oEvent) {
                debugger;
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;
                // if (sLayout == 'TwoColumnsMidExpanded') {
                //     this.byId("idViewBOQListButton").setPressed(false);
                //     this.getViewModel("objectViewModel").setProperty("/sViewBOQButtonName", "View BOQ List");
                // }
                // this.getView().getModel().setProperty("/busy", false);
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
               
                this._bindView("/MasterSubModules" + this.sParentID);
                this.loadFragment();
                
            },
            _bindView: function (sObjectPath) {
                var objectViewModel = this.getViewModel("objectViewModel");
                var that = this;
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
            loadFragment:function(){
                debugger;
                 
                
                  var sType = this.sParentID;
                  
                  var oLayout = this.getView().byId('idLeaveLayout');
                  
                 
                  switch (sType) {
                    // Leave Module
                    case "1":
                        oLayout.destroyContent();
                        this.fragmentName = "com.sal.salhr.Fragments.CreateLeave";                  
                        this.oFragment = sap.ui.xmlfragment("idLeaveFragment",this.fragmentName ,this);
                        oLayout.addContent(this.oFragment);
                        break;
                    // Business Trip Module
                    case "2":
                        oLayout.destroyContent();
                        this.fragmentName = "com.sal.salhr.Fragments.CreateBusinessTrip";
                        var oFragment = sap.ui.xmlfragment("idBusinessTrip",this.fragmentName ,this);
                        oLayout.addContent(oFragment);
                        break;  
                    //    Bank Request Cahnge 
                        case "7":
                            oLayout.destroyContent();
                            var sKey = this.getComponentModel().createKey("/EmpInfo", {
                                userId: "12002425"
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
                                        this.fragmentName = "com.sal.salhr.Fragments.CreateIDReplacement";
                                        this.oFragment = sap.ui.xmlfragment(this.fragmentName, this);
                                        oLayout.addContent(this.oFragment);
                                    }.bind(this)
                                }
                            });
                            break;
                    
                        // Bank Request Module  
                    case "13":
                            oLayout.destroyContent();               
                            this.fragmentName = "com.sal.salhr.Fragments.CreateBankAccountRequest";       
                            var oFragment = sap.ui.xmlfragment("idBankChangerequestFragment",this.fragmentName ,this); 
                            oLayout.addContent(oFragment);
                            
                            break;                                                                   
                  }

               
               
            },
            
            onRaiseRequestPress: function () {
                var sEntityPath = "",
                    oPayloadObj = {},
                    bValidationOk = false;

                
                switch (this.sParentID) {
                    // Leave Module
                    case "1":
                     sEntityPath = "/SF_Leave";
                     oPayloadObj = this.fnGetLeaveRequestPayload();
                     break;
                    // Bank Request Module
                    case "13":
                    oPayloadObj = this.fnGetBankRequestPayload();
                    sEntityPath = "/SF_BankDetails";
                    break;
                    // Id Card Replacement
                    case "7":
                    sEntityPath = "/SF_IDReplacement";
                    bValidationOk = this.fnValidateIDReplacementFields();
                    if (bValidationOk){
                    oPayloadObj = this.fnGetIDReplacementRequestPayload();
                    }
                    break;
                }    

               
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
            fnGetLeaveRequestPayload:function(){
                var sAttachmentFileContent, sAttahmentFileName;
                var sStartDate = sap.ui.core.Fragment.byId("idLeaveFragment", "idStartDate").getValue();
                sStartDate = Date.parse(sStartDate);
                var sEndDate = sap.ui.core.Fragment.byId("idLeaveFragment", "idEndDate").getValue();
                sEndDate = Date.parse(sEndDate);
                var sTimeType =  sap.ui.core.Fragment.byId("idLeaveFragment", "idTimeType").getSelectedKey();
                var sRecAbsGroup = sap.ui.core.Fragment.byId("idLeaveFragment", "idRecAbsc").getSelectedKey();
                if(!sRecAbsGroup){
                    sRecAbsGroup = null;
                }
                if(this.isAttachment === true){
                    sAttachmentFileContent = this.fileContent;
                    sAttahmentFileName = this.fileName;
                }else{
                    sAttachmentFileContent = "";
                    sAttahmentFileName = "";
                }
              
                return {
                    "endDate": "/Date(" + sEndDate + ")/",
                    "loaActualReturnDate": null,
                    "timeType": sTimeType,
                    "loaExpectedReturnDate": null,
                    "loaStartJobInfoId": null,
                    "startDate": "/Date(" + sStartDate + ")/",
                    "cust_KronosPayCodeEditID": null,
                    "startTime": null,
                    "loaEndJobInfoId": null,
                    "approvalStatus": null,
                    "undeterminedEndDate": false,
                    "userId": "12002024",
                    "recurrenceGroup": sRecAbsGroup,
                    "fractionQuantity": "1",
                    "endTime": null,
                    "isAttachmentNew": true,
                    "attachmentFileContent": sAttachmentFileContent,
                    "attachmentFileName": sAttahmentFileName,
                    "attachmentUserId": "Extentia"
                };
            },
            fnGetBankRequestPayload:function(){
                var sEffectiveStartDate = sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idFromDatePicker").getDateValue();
                var sCust_bankName = sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idBankNameINP").getValue();
                var scust_iban = sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idIBANINP").getValue();
                return {
                    "externalCode": "12002425",
                    "effectiveStartDate": sEffectiveStartDate,
                    "cust_bankName": sCust_bankName,
                    "cust_iban": scust_iban
                  };
            },
            fnGetIDReplacementRequestPayload: function () {
                var oDataObj = this.getView().getBindingContext().getObject();
                    // sEffectiveStartDate = sap.ui.getCore().byId("idEffectDatePicker").getValue();

                return {
                    "User": oDataObj.userId,
                    // "effectiveStartDate": sEffectiveStartDate,
                    "effectiveStartDate": "/Date(1645660800000)/",
                    "cust_idReplacementDetails": {
                        "cust_bloodGroup": oDataObj.bloodGroup,
                        // "cust_idReplacement_effectiveStartDate": sEffectiveStartDate,
                        "cust_idReplacement_effectiveStartDate": "/Date(1645660800000)/",

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
                        // "cust_seniorityDate": oDataObj.seniorityDate
                        "cust_seniorityDate": "/Date(1645660800000)/"
                    }
                };
            },
            fnValidateIDReplacementFields: function () {
                var bValidationOk = true,
                    oEffectiveDatePicker = sap.ui.getCore().byId("idEffectDatePicker");

                if (new Date(oEffectiveDatePicker.getValue()).getTime() < new Date(this.todaysDate).getTime()) {
                    oEffectiveDatePicker.setValueState("Error");
                    oEffectiveDatePicker.setValueStateText("Effective start Date should be minimum today's date");
                    bValidationOk = false;
                } else {
                    oEffectiveDatePicker.setValueState("None");
                }
                return bValidationOk;
            },

            fnDeleteIDReplacement: function () {
                var sUserID = "12002425",
                    sEffectiveStartDate = "2022-02-24T00:00:00",
                    sPath = "/SF_IDReplacement(User='" + sUserID + "',effectiveStartDate=datetime'" + sEffectiveStartDate + "')";

                this.mainModel.remove(sPath, {
                    success: function (oData, oResponse) {
                        sap.m.MessageBox.success("Request Submitted Successfully.");
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageBox.error(JSON.parse(JSON.parse(oError.responseText).error.message.value).error.message.value.split("]")[1]);
                    }.bind(this)
                });
            },
            onLeaveStartDatChange:function(oEvent){
                var oneDay = 24 * 60 * 60 * 1000;
                var sEndDate = sap.ui.core.Fragment.byId("idLeaveFragment", "idEndDate").getDateValue();
                var sStartDate = oEvent.getSource().getDateValue();
               
                this.sRequestDay = "";
                if(sEndDate <= sStartDate){
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("Start Date must not be later than End Date");
                    sap.ui.core.Fragment.byId("idLeaveFragment", "idRequestDay").setValue("");
                }else{
                    oEvent.getSource().setValueState();
                    oEvent.getSource().setValueStateText("");
                    sap.ui.core.Fragment.byId("idLeaveFragment", "idEndDate").setValueState();
                    sap.ui.core.Fragment.byId("idLeaveFragment", "idEndDate").setValueStateText("");
                    // this.sRequestDay = Math.round(Math.abs((new Date(sEndDate) - sStartDate) / oneDay)) + 1;
                    
                    this.sRequestDay = this.dateDifference(sStartDate,sEndDate);
                    // sap.ui.core.Fragment.byId("idLeaveFragment", "idRequestDay").setValue(this.sRequestDay);
                    this.getView().getModel("LocalViewModel").setProperty("/requestDay",this.sRequestDay);
                }
            },
            onLeaveEndDateChange:function(oEvent){
                var oneDay = 24 * 60 * 60 * 1000;
                var sStartDate = sap.ui.core.Fragment.byId("idLeaveFragment", "idStartDate").getDateValue();
                var sEndDate = oEvent.getSource().getDateValue();
                
                if(sEndDate <= sStartDate){
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("End Date should be later than Start Date");
                    sap.ui.core.Fragment.byId("idLeaveFragment", "idRequestDay").setValue("");
                }else{
                    oEvent.getSource().setValueState();
                    oEvent.getSource().setValueStateText("");
                    sap.ui.core.Fragment.byId("idLeaveFragment", "idStartDate").setValueState();
                    sap.ui.core.Fragment.byId("idLeaveFragment", "idStartDate").setValueStateText("");
                    // this.sRequestDay = Math.round(Math.abs((sEndDate - new Date(sStartDate)) / oneDay)) + 1 ;
                    this.sRequestDay = this.dateDifference(sStartDate,sEndDate,oEvent);
                    // sap.ui.core.Fragment.byId("idLeaveFragment", "idRequestDay").setValue(this.sRequestDay);
                    this.getView().getModel("LocalViewModel").setProperty("/requestDay",this.sRequestDay);
                }
            },
            onSelectRecurringAbsc:function(oEvent){
                 if(oEvent.getParameters().selected === true){
                  this.getView().getModel("LocalViewModel").setProperty("/recurringAbs", true);
                 }else{
                    this.getView().getModel("LocalViewModel").setProperty("/recurringAbs", false);
                 }
            },
            dateDifference:function(startDate, endDate) {
               
                startDate.setHours(12,0,0,0);
                endDate.setHours(12,0,0,0);
      
                var totalDays = Math.round((endDate - startDate) / 8.64e7);
                
              
                var wholeWeeks = totalDays / 7 | 0;
                
               
                var days = wholeWeeks * 5;
              
               
                if (totalDays % 7) {
                    startDate.setDate(startDate.getDate() + wholeWeeks * 7);
                  
                  while (startDate < endDate) {
                  
                    startDate.setDate(startDate.getDate() + 1);
              
                 
                    if (startDate.getDay() != 5 && startDate.getDay() != 6) {
                      ++days;
                    }
                  }
                  startDate.setDate(this.getView().getModel("LocalViewModel").getProperty("/startDate").getDate());
                }
                // var data = this.getView().getModel("LocalViewModel").getData();
                // var sReturnDate = jQuery.extend(true,[],data);

                var sReturnDate = sap.ui.core.Fragment.byId("idLeaveFragment", "idEndDate").getDateValue();

                

                sReturnDate.setDate(sReturnDate.getDate() + 1);

                if(sReturnDate.getDay() === 5){
                    sReturnDate.setDate(sReturnDate.getDate() + 2);
                    // sap.ui.core.Fragment.byId("idLeaveFragment", "idReturning").setValue(sReturnDate);
                    this.getView().getModel("LocalViewModel").setProperty("/returnDate",sReturnDate);
                }else if(sReturnDate.getDay() === 6){
                    sReturnDate.setDate(sReturnDate.getDate() + 1);
                    this.getView().getModel("LocalViewModel").setProperty("/returnDate",sReturnDate);
                    // sap.ui.core.Fragment.byId("idLeaveFragment", "idReturning").setValue(sReturnDate);
                }else {
                    sReturnDate.setDate(sReturnDate.getDate() + 1);
                    this.getView().getModel("LocalViewModel").setProperty("/returnDate",sReturnDate);
                    // sap.ui.core.Fragment.byId("idLeaveFragment", "idReturning").setValue(sReturnDate);
                }
                endDate.setDate(this.getView().getModel("LocalViewModel").getProperty("/endDate").getDate());
                return days + 1;
              },
              onAttachmentChange:function(oEvent){
                  debugger;
                  var that= this;
                //   var file = sap.ui.core.Fragment.byId("idLeaveFragment", "UploadCollection").getFocusDomRef().files[0];
                     var file = oEvent.getParameters().files[0];
                  //Input = "458076",
                  var Filename = file.name,
                      Filetype = file.type,
                      Filesize = file.size;
      
                
                  //code for base64/binary array 
                  this._getImageData((file), function (Filecontent) {
                      that._addData(Filecontent, Filename, Filetype, Filesize);
                  });
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
 
            },
            onFileDeleted: function(oEvent) {
                debugger;
                MessageToast.show("Event fileDeleted triggered");
            },
            onTimeTyeChange:function(oEvent){
                 var sType = oEvent.getSource().getSelectedKey();
                 if(sType === "S110" || sType === "500"){
                    this.getView().getModel("LocalViewModel").setProperty('/uploadAttachment' , false);
                 }else {
                    this.getView().getModel("LocalViewModel").setProperty('/uploadAttachment' , true);
                 }
            },
            onFileSizeExceed: function () {
                MessageBox.error("File size exceeded, Please upload file upto 10MB.");
            },
    
            onFileNameLengthExceed: function () {
                MessageBox.error("File name length exceeded, Please upload file with name lenght upto 50 characters.");
            },
            onUploadComplete: function(oEvent) {
                var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
                setTimeout(function() {
                    var oUploadCollection = sap.ui.core.Fragment.byId("idLeaveFragment", "UploadCollection");
    
                    for (var i = 0; i < oUploadCollection.getItems().length; i++) {
                        if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
                            oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
                            break;
                        }
                    }
    
                    // delay the success message in order to see other messages before
                   
                }.bind(this), 8000);
            },
            onCreateCancelPress:function(){
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: "TwoColumnsMidExpanded"

                });
                this.mainModel.refresh();
            },
            onResetPress:function(){
                switch (this.sParentID) {
                    // Leave Module
                    case "1":
                    this.onCreateResetPress();
                     break;
                    // Bank Request Module
                    case "13":
                        this.onBankRequestResetPress();
                    break;
                }    
              
               
            },
            onCreateResetPress:function(){
                var dataReset = {
                    startDate: new Date(),    
                    endDate: new Date(),
                    returnDate : this.sReturnDate,
                    requestDay : this.sRequesting,
                    availBal : false,
                    recurringAbs : false,
                    busy:false,
                    uploadAttachment:true
                };
                sap.ui.core.Fragment.byId("idLeaveFragment", "idRecCheckbox").setSelected(false);
                this.getView().getModel("LocalViewModel").setData(dataReset);
                this.getView().getModel("LocalViewModel").refresh();
            },
            onBankRequestResetPress:function(){
                
                // sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idFromDatePicker").setValue(new Date());
                sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idIBANINP").setValue();
                sap.ui.core.Fragment.byId("idBankChangerequestFragment", "idBankNameINP").setValue();
                this.getView().getModel("LocalViewModel").setProperty("/currentDate",new Date());
                this.getView().getModel("LocalViewModel").refresh();

            }
    

             
        });
    });      
