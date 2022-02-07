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
                this.getView().addEventDelegate({
                    onBeforeShow: function (evt) {
    
                        that.loadFragment();
    
                    }.bind(this),
                    onAfterHide: function (evt) {
    
                    }
                });
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
             
                 var oFragmentModel = new JSONModel();
                 this.getView().setModel(oFragmentModel,"oFragmentModel")
                  var sType = this.sParentID;
                  this.fragmentName = "com.sal.salhr.Fragments.CreateLeave";
                  var oLayout = this.getView().byId('idLeaveLayout'), //don't forget to set id for a VerticalLayout
                  oFragment = sap.ui.xmlfragment(this.fragmentName ,this);
                  oLayout.addContent(oFragment);


               
                //   switch (sType) {
                //       case '1' :
                //           sFragmentName = "com.sal.salhr.Fragments.CreateLeave";
                //           oFragmentModel.setProperty("/fragmentName",sFragmentName);
                //         // this.getView().byId("idLeaveLayout").setVisible(true);
                //          break;
                //     //   case '2' :
                //     //         sFragmentName = "com.sal.salhr.Fragments.CreateBusinessTrip";
                //     //         oFragmentModel.setProperty("/fragmentName",sFragmentName);
                //     //      break;   
                //     //   case '3' :
                //     //     sFragmentName = "com.sal.salhr.Fragments.CreateLoan";
                //     //     oFragmentModel.setProperty("/fragmentName",sFragmentName);
                //     //      break; 
                //   }
 
            },
            fragmentName : function(){
                return "com.sal.salhr.Fragments.CreateLeave";
             },
            onRaiseRequestPress: function (oAdditionalData, aReservationItems) {
                
                var oPayload =
                {
                "endDate":new Date(),
                "loaActualReturnDate": null,
                "timeType": "S110",
                "loaExpectedReturnDate": null,
                "loaStartJobInfoId": null,
                "startDate": new Date(),
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
                        
                    }.bind(this),
                    error: function (oError) {

                    }.bind(this)
                })
            }
        });
    });      
