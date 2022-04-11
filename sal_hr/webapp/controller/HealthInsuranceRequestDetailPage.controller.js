sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/sal/salhr/model/formatter"

],

    function (BaseController, Controller, JSONModel,formatter) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.HealthInsuranceRequestDetailPage", {
            formatter: formatter,
            onInit: function () {
                var oLocalViewModel = new JSONModel({
                    EditMode: false,
                    LeaveModule: false,
                    PageTitle: null,
                    Modify: true,
                    IDCardModule: false
                });

                this.getView().setModel(oLocalViewModel, "LocalViewModel");

                this.oRouter = this.getRouter();
                this.oRouter.getRoute("HealthInsuranceRequestDetail").attachPatternMatched(this._onObjectMatched, this);
             
            },

            _onObjectMatched: function (oEvent) {
               
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                this.sChildID = oEvent.getParameter("arguments").childModule;
                var sLayout = oEvent.getParameter("arguments").layout;
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
                this.byId("idFullScreenBTN").setIcon("sap-icon://full-screen");
                // this._bindView();
                this._getTicketData(this.sChildID);
            },

            _bindView: function (data) {
                debugger;
                var object = data.results[0];
                var oHeaderModel = new JSONModel(data.results[0]);
                this.getView().setModel(oHeaderModel, "headerModel");


                if (object.status === "APPROVED") {
                    this.getView().getModel("LocalViewModel").setProperty("/Modify", false);
                } else {
                    this.getView().getModel("LocalViewModel").setProperty("/Modify", true);
                }
                // var oComponentModel = this.getComponentModel(),
                //     sKey = null;
                //         sKey = oComponentModel.createKey("/SF_HealthInsurance", {
                //             effectiveStartDate: object.effectiveStartDate,
                //             User: object.externalCode
                           
                //         });
                //         this.getView().bindElement({
                //             path: sKey,
                //             parameters: {
                               
                //                 expand: "cust_healthInsuranceDetails",

                //                 // expand: "cust_healthInsuranceDetails,cust_healthInsuranceDetails/cust_relationshipNav,cust_healthInsuranceDetails/cust_genderNav",
                //             },
                //             events: {
                //                 change: function (oEvent) {
                //                     var oContextBinding = oEvent.getSource();
                //                     oContextBinding.refresh(false);
                //                 }.bind(this),
                //                 dataRequested: function () {
                //                     this.getView().setBusy(true);
                //                 }.bind(this),
                //                 dataReceived: function () {
                //                     this.getView().setBusy(false);
                //                 }.bind(this)
                //             }
                //         });
                this.getView().setBusy(true);

                        var oComponentModel = this.getComponentModel();
                        var sKey = oComponentModel.createKey("/SF_HealthInsurance", {
                            effectiveStartDate: object.effectiveStartDate,
                            User: object.externalCode
                        });
        
                        this.getView().getModel().read(sKey, {
                            urlParameters: {
                                $expand: "cust_healthInsuranceDetails,cust_healthInsuranceDetails/cust_relationshipNav,cust_healthInsuranceDetails/cust_genderNav,cust_healthInsuranceDetails/cust_attachment1Nav,cust_healthInsuranceDetails/cust_attachment2Nav,cust_healthInsuranceDetails/cust_attachment3Nav,UserNav"
                            },
                            success: function (oData) {
                                this.getView().setBusy(false);
                                this.fnSetDisplayHealthInsuranceModel(oData);
                            }.bind(this),
                            error: function () {
                                this.getView().setBusy(false);
                            }.bind(this)
                        });

                       

                      
                        this.getView().getModel("LocalViewModel").setProperty("/PageTitle", "Health Insurance dependent Request");
                        this.getView().getModel("LocalViewModel").refresh();

            },

            fnSetDisplayHealthInsuranceModel: function (oData) {
                this.getView().setBusy(true);
             

                 var aCust_healthInsuranceDetails = oData.cust_healthInsuranceDetails.results,
                    oDisplayEditBusinessTripObj = {
                        "externalCode": oData.externalCode,
                        "UserNav":oData.UserNav,
                        "effectiveStartDate": oData.effectiveStartDate,
                        "cust_healthInsuranceDetails": aCust_healthInsuranceDetails
                    },
                    oDisplayHealthInsuranceModel = new JSONModel(oDisplayEditBusinessTripObj);
                  

                this.getView().setModel(oDisplayHealthInsuranceModel, "DisplayHealthInsuranceModel");
               
                   this.getView().setBusy(false);
            },


            onEditPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", true);

            },

            onCancelPress: function () {
                this.getView().getModel("LocalViewModel").setProperty("/EditMode", false);
            },

            onDownLoadPress:function(oEvent){
                var oItemRowObj = oEvent.getSource().getBindingContext("DisplayHealthInsuranceModel").getObject();
                var sLinkText = oEvent.getSource().getTooltip_Text().trim();

var oFileObj = sLinkText === "Download(1)" ? oItemRowObj.cust_attachment1Nav : sLinkText === "Download(2)" ? oItemRowObj.cust_attachment2Nav : oItemRowObj.cust_attachment3Nav;

            //    var oFileObj =  oEvent.getSource().getBindingContext("DisplayHealthInsuranceModel").getObject().cust_attachment1Nav;
                var fContent = oFileObj.fileContent;
               var fileext =  oFileObj.fileExtension;
               var mimeType =  oFileObj.mimeType;
                var fName = oFileObj.fileName;
                 fName = fName.split(".")[0];
                                debugger;
                              if(fileext === "pdf" || fileext === "png")
                              {
                                var decodedPdfContent = atob(fContent);
                                var byteArray = new Uint8Array(decodedPdfContent.length)
                                for (var i = 0; i < decodedPdfContent.length; i++) {
                                    byteArray[i] = decodedPdfContent.charCodeAt(i);
                                }
                                var blob = new Blob([byteArray.buffer], { type: mimeType });
                                var _pdfurl = URL.createObjectURL(blob);
                                var a = document.createElement('a');
                                a.href = _pdfurl;
                                a.download = fName;
                                a.dispatchEvent(new MouseEvent('click'));
                              }
                              else{
                                sap.ui.core.util.File.save(fContent, fName,fileext, mimeType);
                              }
            },
         
     
            handleFullScreen: function (oEvent) {
                var sLayout = "";
                if (oEvent.getSource().getIcon() === "sap-icon://full-screen") {
                    sLayout = "EndColumnFullScreen";
                    oEvent.getSource().setIcon("sap-icon://exit-full-screen");
                } else {
                    sLayout = "ThreeColumnsMidExpanded";
                    oEvent.getSource().setIcon("sap-icon://full-screen");
                }

              
                this.oRouter.navTo("HealthInsuranceRequestDetail", {
                    parentMaterial: this.sParentID,
                    childModule: this.sChildID,
                    layout: sLayout
                });

            },

            handleClose: function (oEvent) {
                var sLayout = "",
                    sIcon = this.byId("idFullScreenBTN").getIcon();
                if (sIcon === "sap-icon://full-screen") {
                    sLayout = "TwoColumnsMidExpanded";
                } else {
                    sLayout = "ThreeColumnsMidExpanded";
                    this.byId("idFullScreenBTN").setIcon("sap-icon://full-screen");
                }
                this.oRouter.navTo("detail", {
                    parentMaterial: this.sParentID,
                    layout: sLayout
                });
            }



        });
    });