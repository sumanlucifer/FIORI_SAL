sap.ui.define([ 
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],

    function (BaseController, Controller,JSONModel) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.CreateRequest", {
            onInit: function () {
                debugger;
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("RaiseRequest").attachPatternMatched(this._onObjectMatched, this);
                // this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                this.mainModel = this.getOwnerComponent().getModel();
                var that = this;

                var sReturnDate= new Date();
                sReturnDate.setDate(new Date().getDate() + 1);
                if(sReturnDate.getDay() === 5){
                    sReturnDate.setDate(sReturnDate.getDate() + 2);
                    
                }else if(sReturnDate.getDay() === 6){
                    sReturnDate.setDate(sReturnDate.getDate() + 1);
                   
                }
                var oLocalViewModel = new JSONModel({
                    startDate: new Date(),    
                    endDate: new Date(),
                    returnDate : sReturnDate,
                    availBal : false,
                    recurringAbs : false,
                    busy:false  
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
                    path: sKey
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
                    case "2":
                        oLayout.destroyContent();
                        this.fragmentName = "com.sal.salhr.Fragments.CreateBusinessTrip";
                        var oFragment = sap.ui.xmlfragment(this.fragmentName ,this);
                        oLayout.addContent(oFragment);
                        break;                                                                   
                  }

               
               
            },
            
            onRaiseRequestPress: function (oAdditionalData, aReservationItems) {
                var sStartDate = sap.ui.core.Fragment.byId("idLeaveFragment", "idStartDate").getValue();
                sStartDate = Date.parse(sStartDate);
                var sEndDate = sap.ui.core.Fragment.byId("idLeaveFragment", "idEndDate").getValue();
                sEndDate = Date.parse(sEndDate);
                var sTimeType =  sap.ui.core.Fragment.byId("idLeaveFragment", "idTimeType").getSelectedKey();
                var oPayload =
                {
                "endDate":"/Date(" + sEndDate + ")/",
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
                "recurrenceGroup": null,
                "fractionQuantity": "1",
                "endTime": null
                }                     
                ;
                this.mainModel.create("/SF_Leave", oPayload, {
                    success: function (oData, oResponse) {
                        sap.m.MessageBox.success("Request Submitted Successfully.");
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageBox.error(JSON.parse(JSON.parse(oError.responseText).error.message.value).error.message.value.split("]")[1]);  
                    }.bind(this)
                })
            },
            onLeaveStartDatChange:function(oEvent){
                var oneDay = 24 * 60 * 60 * 1000;
                var sEndDate = sap.ui.core.Fragment.byId("idLeaveFragment", "idEndDate").getDateValue();
                var sStartDate = oEvent.getSource().getDateValue();
               
                this.sRequestDay = "";
                if(sEndDate < sStartDate){
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
                    sap.ui.core.Fragment.byId("idLeaveFragment", "idRequestDay").setValue(this.sRequestDay);
                }
            },
            onLeaveEndDateChange:function(oEvent){
                var oneDay = 24 * 60 * 60 * 1000;
                var sStartDate = sap.ui.core.Fragment.byId("idLeaveFragment", "idStartDate").getDateValue();
                var sEndDate = oEvent.getSource().getDateValue();
                
                if(sEndDate < sStartDate){
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
                    sap.ui.core.Fragment.byId("idLeaveFragment", "idRequestDay").setValue(this.sRequestDay);
                   
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
                var sReturnDate = new Date();
                sReturnDate.setDate(endDate.getDate() + 1);
                if(sReturnDate.getDay() === 5){
                    sReturnDate.setDate(sReturnDate.getDate() + 2);
                    this.getView().getModel("LocalViewModel").setProperty("/returnDate",sReturnDate);
                }else if(sReturnDate.getDay() === 6){
                    sReturnDate.setDate(sReturnDate.getDate() + 1);
                    this.getView().getModel("LocalViewModel").setProperty("/returnDate",sReturnDate);
                }else {
                    sReturnDate.setDate(endDate.getDate() + 1);
                }
               
                return days + 1;
              },
              onAttachmentChange:function(oEvent){
                  debugger;
                var rowObj = oEvent.getSource().getBindingContext().getObject();
                var that = this
                var oFiles = oEvent.getParameters().files;
                var SubType = "absence_doc";
                var Type = "ABSENCE";
    
                this.oFiles = oFiles;
                var fileName = oFiles[0].name;
    
                var fileType = oFiles[0].type;
    
                fileType = fileType === "application/pdf" ? "application/pdf" : "application/octet-stream";
    
    
                var fileSize = oFiles[0].size;
                for (var i = 0; i < oFiles.length; i++) {
                    var fileName = oFiles[i].name;
                    var fileSize = oFiles[i].size;
                    this._getImageData(URL.createObjectURL(oFiles[i]), function (base64) {
                        that._addData(base64, fileName, fileType, fileSize, rowObj, oFiles);
                    }, fileName);
                }
              },
              _getImageData: function (url, callback, fileName) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    var reader = new FileReader();
                    var fileByteArray = [];
                    reader.readAsArrayBuffer(xhr.response);
                    reader.onloadend = function (evt) {
                        if (evt.target.readyState == FileReader.DONE) {
                            var arrayBuffer = evt.target.result,
                                array = new Int8Array(arrayBuffer);
                            for (var i = 0; i < array.length; i++) {
                                fileByteArray.push(array[i]);
                            }
                            callback(fileByteArray);
                        }
                    }
                };
                xhr.open('GET', url);
                xhr.responseType = 'blob';
                xhr.send();
            },
            _addData: function (base64, fileName, fileType, fileSize, rowObj, oFiles) {
                this.getViewModel("LocalViewModel").setProperty(
                    "/busy",
                    true
                );
    
    
              
             
                var documents = {                 
                        
                            "module": "GENERIC_OBJECT",
                            "fileContent": "On leave",
                            "fileName": fileName,
                             "userId": "Extentia"                      
                    
                };
    
               
                debugger;
                var sPath = "/SF_Attachment"
                this.mainModel.create(sPath, documents, {
                    success: function (oData, oResponse) {
                        
    
    
                        this.getView().getModel().refresh();
                        // this._updateDocumentService(oData.ID, fileType);
                        //   this.getView().getModel("ManageMDCCModel").getData().MDCCItems[rowId].MapItems = true;
                        //   this.getView().getModel("ManageMDCCModel").refresh();
                    }.bind(this),
                    error: function (oError) {
                        this.getModel("LocalViewModel").setProperty(
                            "/busy",
                            false
                        );
    
                       // sap.m.MessageBox.error("Error uploading document");
                    }
                });
            },

             
        });
    });      
