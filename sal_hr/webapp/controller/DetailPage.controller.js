sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/sal/salhr/model/formatter"
],

    function (BaseController, Controller,JSONModel,formatter) {
        "use strict";

        return BaseController.extend("com.sal.salhr.controller.DetailPage", {
            formatter: formatter,
            onInit: function () {

                this.oRouter = this.getRouter();
                this.oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

            },
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
                this._bindView();
                // this._filterPCListTable(this.UserEmail);
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
            

            onPressTicketItem: function (oEvent) {

                // var supplierPath = oEvent.getSource().getBindingContext("products").getPath(),

                //     supplier = supplierPath.split("/").slice(-1).pop();

                this.oRouter.navTo("detailDetail", {
                    parentMaterial: this.sParentID,
                    layout: "ThreeColumnsMidExpanded"
                });
            },
            onPressRaiseRequest: function () {
                this.oRouter.navTo("RaiseRequest", {
                    parentMaterial: this.sParentID,
                    layout: "EndColumnFullScreen"
                })
            },
            onPressTicketItem: function (oEvent) {

                this.oRouter.navTo("detailDetail", {                  

                    parentMaterial: this.sParentID,

                    childModule: oEvent.getSource().getBindingContext().getObject().externalCode,

                    layout: "ThreeColumnsMidExpanded"

                });

            },
            onSearch: function (oEvent) {
                var oTableSearchState = [],
                    sQuery = oEvent.getParameter("query");
                    
                if (sQuery && sQuery.length > 0) {
                    oTableSearchState = [new Filter("ticketCode", FilterOperator.Contains, sQuery)];
                }
    
                this.oTicketTable.getBinding("items").filter(oTableSearchState, "Application");
            },
            onSort: function () {
                this._bDescendingSort = !this._bDescendingSort;
                var oBinding = this.oTicketTable.getBinding("items"),
                    oSorter = new Sorter("name", this._bDescendingSort);
    
                oBinding.sort(oSorter);
            },
            onPersonalizationDialogPress: function(){
                var oView = this.getView();
                this.oJSONModel = new JSONModel();
                if (!this._pPersonalizationDialog){
                this._pPersonalizationDialog = Fragment.load({
                id: oView.getId(),
                name: "com.sal.salhr.Fragments.TicketP13nDialog",
                    controller: this
                }).then(function(oPersonalizationDialog){
oView.addDependent(oPersonalizationDialog);
oPersonalizationDialog.setModel(this.oJSONModel);
return oPersonalizationDialog;
                    }.bind(this));
                    }
                    this._pPersonalizationDialog.then(function(oPersonalizationDialog){
                    this.oJSONModel.setProperty("/ShowResetEnabled", this._isChangedColumnsItems());
                    this.oDataBeforeOpen = deepExtend({}, this.oJSONModel.getData());
                    oPersonalizationDialog.open();
                        }.bind(this));
                }

            

        });
    });        
