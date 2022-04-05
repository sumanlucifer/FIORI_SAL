sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter'
],
   
    function (BaseController,Controller,Filter,FilterOperator,Sorter) {
        "use strict";

        return BaseController.extend("com.sal.vacancy.controller.VacancyList", {
          
            onInit: function () {
               
                //Router Object
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("RouteApp").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                var sLayout = oEvent.getParameter("arguments").layout;
                
            },    

           
             onApplyPress: function (oEvent) {          
                this._showObject(oEvent.getSource());
            },

           
            _showObject: function (oItem) {
               
                this.getRouter().navTo("VacancyJobDetail", {
                    jobId: 1
                });
            },
            onSearch:function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    
                    aFilters.push( this.createFilter("name", FilterOperator.Contains, sQuery, true) );
                   
                }
    
              
                var oTable = this.byId("idMasterTable");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilters);

            },
            createFilter: function(key, operator, value, useToLower) {
                return new Filter(useToLower ? "tolower(" + key + ")" : key, operator, useToLower ? "'" + value.toLowerCase() + "'" : value);
            },
            onSort: function () {
                this._bDescendingSort = !this._bDescendingSort;
                var oBinding = this.getView().byId("idMasterTable").getBinding("items"),
                    oSorter = new Sorter("name", this._bDescendingSort);
    
                oBinding.sort(oSorter);
            }

        });
    });
