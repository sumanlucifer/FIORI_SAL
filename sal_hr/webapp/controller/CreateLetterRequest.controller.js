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
        return BaseController.extend("com.sal.salhr.controller.CreateLetterRequest", {
            onInit: function () {
                debugger;
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("LeaveRequest").attachPatternMatched(this._onObjectMatched, this);

                this.mainModel = this.getOwnerComponent().getModel();
           
                var oLocalViewModel = new JSONModel({                 
                    busy: false,               
                    currentDate: new Date(),                 
                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");
              
            },

            _onObjectMatched: function (oEvent) {
                debugger;
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
            },
         
            onRaiseRequestPress: function () {
                var sEntityPath = "/LetterRequest",
                    oPayloadObj = this.fnGetLetterRequestPayload();

                    this.getView().setBusy(true);

                    this.mainModel.create(sEntityPath, oPayloadObj, {
                        success: function (oData, oResponse) {
                            sap.m.MessageBox.success("Request Submitted Successfully.");
                            this.getView().setBusy(false);
                            this.getView().getModel().refresh();
                            this.onDownLoadPress(oData.result);
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
                    });
                
               
            },
            fnGetLetterRequestPayload: function () {
              var sTemplate = this.byId("idLetterTemplate").getSelectedKey();
              if(sTemplate === "1"){
                  sTemplate = "Introduction";
              }else {
                sTemplate = "Salary";
              }
                return {
                    
    
                        "language" : "EN",
                        "country" : "India",
                         "userId" : "12002425",
                         "template" : sTemplate,
                         "asOfDate" : new Date()
                     
                  
                };
            
        },

            onCreateCancelPress: function () {
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: "TwoColumnsMidExpanded"

                });
                this.mainModel.refresh();
            },
          
            onDownLoadPress: function (fContent) {
              
                    var decodedPdfContent = atob(fContent);
                    var byteArray = new Uint8Array(decodedPdfContent.length)
                    for (var i = 0; i < decodedPdfContent.length; i++) {
                        byteArray[i] = decodedPdfContent.charCodeAt(i);
                    }
                    var blob = new Blob([byteArray.buffer], { type: "pdf" });
                    var _pdfurl = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = _pdfurl;
                    a.download = "Introduction Template.pdf";
                    a.dispatchEvent(new MouseEvent('click'));
               
            }

        });
    });      
