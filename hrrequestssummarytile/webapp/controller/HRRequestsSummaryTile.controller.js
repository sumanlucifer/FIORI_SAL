sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("com.sal.summarytiles.hrrequestssummarytile.controller.HRRequestsSummaryTile", {
            onInit: function () {
                this._bindView();
            },

            _bindView: function () {
             
                this.getView().bindElement({
                    path: "/MasterModules(1)",
                    parameters: {
                        custom: {
                            "IsUserManager": "flase"
                        }
                    }   
                });
            },
            pressBar:function(oEvent){

                var selectedSlice = oEvent.getSource().getProperty("title").toUpperCase();
                var that = this;
               
                if (!this._oDoneAPIialog) {
                    this._oDoneAPIialog = sap.ui.xmlfragment("idDoneDialog", "com.sal.summarytiles.hrrequestssummarytile.Fragments.QuickView", this);
                    that.getView().addDependent(this._oDoneAPIialog);
                }
                


                    
                     var sStatusFilter = new sap.ui.model.Filter({
                        path: "status",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: selectedSlice
                    });
                    var sModuleFilter = new sap.ui.model.Filter({
                        path: "moduleId",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: "1"
                    });
                    var filter = [];
                    filter.push(sStatusFilter,sModuleFilter);
                    this.getOwnerComponent().getModel().read("/Tickets",
                    {
                        filters: [filter],
                        success:function(oData){
                            var oFragmetModel = new JSONModel(oData.results);
                            this._oDoneAPIialog.setModel(oFragmetModel, "FragmetModel");
                            this._oDoneAPIialog.getModel("FragmetModel").setProperty("/titleName",selectedSlice);
                            this._oDoneAPIialog.open();
                        }.bind(this),
                        error:function(){
    
                        }
                    });
            }
        });
    });
