sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "com/sal/salhr/model/formatter",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter'
],
   
    function (BaseController,Controller,formatter,Filter,FilterOperator,Sorter) {
        "use strict";

        return BaseController.extend("com.sal.salhr.controller.MasterList", {
            formatter: formatter,
            onInit: function () {
                var oModel = this.getOwnerComponent().getModel("layoutModel");
                oModel.setProperty("/layout", "OneColumn");

                //Router Object
                this.oRouter = this.getRouter();
                this.oRouter.getRoute("master").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                var sLayout = oEvent.getParameter("arguments").layout;
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
            },    

           
             onMasterListPress: function (oEvent) {          
                this._showObject(oEvent.getSource());
            },

           
            _showObject: function (oItem) {
                var that = this;
                var sPath = oItem.getBindingContextPath()
                this.getRouter().navTo("detail", {
                    parentMaterial: oItem.getModel().getProperty(sPath).ID,
                    layout: "TwoColumnsMidExpanded"
                },
                    false
                );
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
