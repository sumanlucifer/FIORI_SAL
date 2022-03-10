sap.ui.define([ 
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/upload/Uploader"
],

    function (BaseController, Controller,JSONModel,MessageBox,Uploader) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.CreateDisciplinaryRequest", {
            onInit: function () {

                
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("DisciplinaryRequest").attachPatternMatched(this._onObjectMatched, this);
                // this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                this.mainModel = this.getOwnerComponent().getModel();
                var that = this;

                this.sReturnDate= new Date();
                this.sRequesting = 0;
                this.sReturnDate.setDate(new Date().getDate() + 1);
                if(this.sReturnDate.getDay() === 5){
                    this.sReturnDate.setDate(this.sReturnDate.getDate() + 2);
                    
                }else if(this.sReturnDate.getDay() === 6){
                    this.sReturnDate.setDate(this.sReturnDate.getDate() + 1);
                   
                }else{
                    this.sRequesting = 1;
                }
                var oLocalViewModel = new JSONModel({
                    currentDate: new Date(),    
                    busy:false,
                    uploadAttachment:true,
                    currentDate:new Date()
                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");

              
                

               
            },
            // onRouteMatched: function (oEvent) {
            //     this.sParentID = oEvent.getParameter("arguments").parentMaterial;
            //     this.loadFragment();

            // },
            _onObjectMatched: function (oEvent) {
                this.onResetPress();
                
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;
               
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
               
                this._bindView("/MasterSubModules" + this.sParentID);
                this.onResetPress();

                
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
            _validateMandatoryFields: function () {
                var bValid = true;
                if (this.byId("idIncidentDescription").getValue() === "") {
                    this.byId("idIncidentDescription").setValueState("Error");
                    this.byId("idIncidentDescription").setValueStateText(
                        "Please enter incident description details"
                    );
                    bValid = false;
                } else {
                    this.byId("idIncidentDescription").setValueState("None");
                    this.byId("idIncidentDescription").setValueStateText(null);
                }

                if(this.isAttachment !== true)
                {
                    sap.m.MessageBox.error("Please upload attachments.");
                    bValid = false;
                }




                return bValid;
            },
            
            onRaiseRequestPress: function () {
                if (!this._validateMandatoryFields()) {

                    return;
                }

                var oPayload,sPath;
                
                oPayload = this.getDisciplinaryCreatePayload();
                sPath = "/SF_Disciplinary_Action";

               
                this.getView().setBusy(true);
              
                this.mainModel.create(sPath, oPayload, {
                    success: function (oData, oResponse) {
                        sap.m.MessageBox.success("Request Submitted Successfully.");
                        this.getView().setBusy(false);
                        this.getView().getModel().refresh();
                        this.onResetPress();
                        this.oRouter.navTo("detail", {
                            parentMaterial: this.sParentID,
                            layout: "TwoColumnsMidExpanded"

                        });
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageBox.error(JSON.parse(JSON.parse(oError.responseText).error.message.value).error.message.value.split("]")[1]);  
                        this.getView().getModel().refresh();
                        this.getView().setBusy(false);
                       
                    }.bind(this)
                })
            },

            onFileAdded: function (oEvent) {
                debugger;
                var that = this;

                //  var file = oEvent.getParameters().files[0];
                var file = oEvent.getParameter("item");
                var Filename = file.getFileName(),
                    Filetype = file.getMediaType(),
                    Filesize = file.getFileObject().size,
                    Filedata = oEvent.getParameter("item").getFileObject();


                //code for base64/binary array 
                this._getImageData((Filedata), function (Filecontent) {
                    that._addData(Filecontent, Filename, Filetype, Filesize);
                });
                var oUploadSet = this.byId("UploadSet");
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

            },
            onFileDeleted: function (oEvent) {
                var oUploadSet = this.byId("UploadSet");
                oUploadSet.getDefaultFileUploader().setEnabled(true);
            },
            getDisciplinaryCreatePayload:function(){
                var sAttachmentFileContent, sAttahmentFileName;
                var sIncidentStartDate = this.byId("idIncidentStartDate").getDateValue();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }),
                sIncidentStartDate = dateFormat.format(new Date(sIncidentStartDate));
                sIncidentStartDate = sIncidentStartDate + "T00:00:00";
                var sEffectiveStartDate = this.byId("idEffectStartDate").getDateValue();
                sEffectiveStartDate = dateFormat.format(new Date(sEffectiveStartDate));
                sEffectiveStartDate = sEffectiveStartDate + "T00:00:00";
                var sIncidentCategory = this.byId("idIncidenCategiory").getSelectedKey();
                var sIncidentStatus = this.byId("idIncidentStatus").getSelectedKey();
                var sSeverity = this.byId("idSeverity").getSelectedKey();
                var sWarningType = this.byId("idWarningType").getSelectedKey();
                var sIncidentDesc = this.byId("idIncidentDescription").getValue();

                

                if(this.isAttachment === true){
                    sAttachmentFileContent = this.fileContent;
                    sAttahmentFileName = this.fileName;
                }else{
                    sAttachmentFileContent = "";
                    sAttahmentFileName = "";
                 }
              
                return{
                    "cust_DateofIncident": sIncidentStartDate,
                    "cust_IncidentStatus": sIncidentStatus,
                    "cust_IncidentDetails": sIncidentDesc,
                    "cust_Reason": sIncidentCategory,
                    "cust_Severity": sSeverity,
                    "cust_warningType": sWarningType,
                    "effectiveStartDate": sEffectiveStartDate,
                    "externalCode": "12002291",
                    "externalName": null,
                    "attachmentFileContent":sAttachmentFileContent,
                    "attachmentFileName": sAttahmentFileName,
                    "isAttachmentNew": false,
                    "attachmentUserId": "Extentia",
                    "cust_letterIssued": "Y"
                     
                    
                };
            },

            onLeaveStartDatChange1:function(oEvent){
                var oneDay = 24 * 60 * 60 * 1000;
                var sEndDate = this.byId("idIncidentStartDate").getDateValue();
                var sStartDate = oEvent.getSource().getDateValue();
               
                this.sRequestDay = "";
                if(sEndDate <= sStartDate){
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("Start Date must not be later than End Date");
                    this.byId("idIncidentStartDate").setValue("");
                }else{
                    oEvent.getSource().setValueState();
                    oEvent.getSource().setValueStateText("");
                    this.byId("idIncidentStartDate").setValueState();
                    this.byId("idIncidentStartDate").setValueStateText("");
                    // this.sRequestDay = Math.round(Math.abs((new Date(sEndDate) - sStartDate) / oneDay)) + 1;
                    
                    this.sRequestDay = this.dateDifference(sStartDate,sEndDate);

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
                this.onCreateResetPress();
              
               
            },
            onCreateResetPress:function(){
                var dataReset = {
                    currentDate: new Date(),    
                    endDate: new Date(),
                    busy:false,
                    uploadAttachment:true
                };
                this.getView().getModel("LocalViewModel").setData(dataReset);
                this.getView().getModel("LocalViewModel").refresh();
                this.byId("UploadSet").removeAllItems();
                var oUploadSet = this.byId("UploadSet");
                this.byId("idIncidentDescription").setValue("");
                oUploadSet.getDefaultFileUploader().setEnabled(true);
            }
    

             
        });
    });      
