sap.ui.define([ 
    "./BaseController",
    "sap/ui/core/mvc/Controller"
],

    function (BaseController, Controller) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.CreateRequest", {
            onInit: function () {
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("RaiseRequest").attachPatternMatched(this._onObjectMatched, this);
                this.mainModel = this.getOwnerComponent().getModel();
            },
            _onObjectMatched: function (oEvent) {
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;
                // if (sLayout == 'TwoColumnsMidExpanded') {
                //     this.byId("idViewBOQListButton").setPressed(false);
                //     this.getViewModel("objectViewModel").setProperty("/sViewBOQButtonName", "View BOQ List");
                // }
                // this.getView().getModel().setProperty("/busy", false);
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
                this._bindView();
            },
            _bindView: function () {
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
