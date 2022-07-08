sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.sal.itsrvmgmtrequestssummarymanagertile.controller.View1", {
            onInit: function () {
                this._bindView();
            },

            _bindView: function () {
                this.getView().bindElement({
                    path: "/MasterModules(4)",
                    parameters: {
                        custom: {
                            "IsUserManager": "true"
                        }
                    }
                });
            },
            onConfirmItsmMgrRequest: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var obj = oSelectedItem.getBindingContext("FragmetModel").getObject();
                this.triggerCrossApp(obj.subModuleId, obj.ID);
            },

            triggerCrossApp: function (sSubModuleID, sTicketID) {
                debugger;

                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "itsm_semantic",
                        action: "display"
                    },
                    params: {

                        "submoduleId": sSubModuleID,
                        "ticketId": sTicketID

                    }
                })) || "";
                oCrossAppNavigator.toExternal({
                    target: {
                        shellHash: hash
                    }
                });
            },
            pressBar:function(oEvent){
                debugger;
                var selectedSlice = oEvent.getSource().getProperty("title").toUpperCase();
                var that = this;
               
                if (!this._oItsmMgrDialog) {
                    this._oItsmMgrDialog = sap.ui.xmlfragment("idItsmMgrDialog", "com.sal.itsrvmgmtrequestssummarymanagertile.Fragments.QuickView", this);
                    that.getView().addDependent(this._oItsmMgrDialog);
                }
                


                var sStatusFilter = new sap.ui.model.Filter({
                    path: "status",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: selectedSlice
                });
                var sModuleFilter = new sap.ui.model.Filter({
                    path: "moduleId",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: "4"
                });
                var filter = [];
                filter.push(sStatusFilter,sModuleFilter);
                    this.getOwnerComponent().getModel().read("/Tickets",
                    {
                        filters: [filter],
                        success:function(oData){
                            var oFragmetModel = new JSONModel(oData.results);
                            this._oItsmMgrDialog.setModel(oFragmetModel, "FragmetModel");
                            this._oItsmMgrDialog.getModel("FragmetModel").setProperty("/titleName",selectedSlice);
                            this._oItsmMgrDialog.open();
                        }.bind(this),
                        error:function(){
    
                        }
                    })
                
            }
        });
    });
