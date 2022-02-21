sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/sal/salhr/model/formatter",
    'sap/ui/model/Sorter',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device"
],

    function (BaseController, Controller,JSONModel,formatter,Sorter,Filter,FilterOperator,Device) {
        "use strict";

        return BaseController.extend("com.sal.salhr.controller.DetailPage", {
            formatter: formatter,
            onInit: function () {

                this.oRouter = this.getRouter();
                this.oRouter.getRoute("master").attachPatternMatched(this._onObjectMatched, this);
                this.oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
                this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onObjectMatched, this);

            },
            _onObjectMatched: function (oEvent) {
                debugger;
                this._bDescendingSort = false;
                this.oTicketTable = this.oView.byId("idTicketTable");
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;
                // this.getView().getModel().setProperty("/busy", false);
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
                this._bindView();
                // this._filterPCListTable(this.UserEmail);
            },

            _bindView: function () {
              
                var oComponentModel = this.getComponentModel(),
                sKey = null;
               
                var sKey = oComponentModel.createKey("/MasterSubModules", {                 
                    ID: this.sParentID
                });

                this.getView().bindElement({
                    path: sKey,
                    events: {
                        change: function (oEvent) {                        
                            var oContextBinding = oEvent.getSource();
                            oContextBinding.refresh(false);
                        }.bind(this),
                        dataRequested: function () {
                            this.getView().setBusy(true);
                        }.bind(this),
                        dataReceived: function () {
                            this.getView().setBusy(false);
                        }.bind(this)
                    }
                });

                
            },
            

          
            onPressRaiseRequest: function () {
                this.oRouter.navTo("RaiseRequest", {
                    parentMaterial: this.sParentID,
                    layout: "EndColumnFullScreen"
                })
            },
            onPressTicketItem: function (oEvent) {
                debugger;
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
                    oTableSearchState = [new Filter("employeeId", FilterOperator.Contains, sQuery)];
                }
    
                this.oTicketTable.getBinding("items").filter(oTableSearchState, "Application");
            },
            onSort: function () {
                this._bDescendingSort = !this._bDescendingSort;
                var oBinding = this.oTicketTable.getBinding("items"),
                    oSorter = new Sorter("employeeId", this._bDescendingSort);
    
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
                },

                handleDetailFullScreen: function (oEvent) {
                    debugger;
                    var sLayout = "";
                    if (oEvent.getSource().getIcon() === "sap-icon://full-screen") {
                        sLayout = "MidColumnFullScreen";
                        oEvent.getSource().setIcon("sap-icon://exit-full-screen");
                    } else {
                        sLayout = "TwoColumnsMidExpanded";
                        oEvent.getSource().setIcon("sap-icon://full-screen");
                    }
    
                    this.oRouter.navTo("detail", {
                        parentMaterial: this.sParentID,
                        layout: sLayout
                    });
                },
    
                handleDetailClose: function (oEvent) {
                    var sLayout = "",
                        sIcon = this.byId("idDetailFullScreenBTN").getIcon();
                    if (sIcon === "sap-icon://full-screen") {
                        sLayout = "EndColumnFullScreen";
                    } else {
                        sLayout = "TwoColumnsMidExpanded";
                        this.byId("idDetailFullScreenBTN").setIcon("sap-icon://full-screen");
                    }
                    this.oRouter.navTo("master");
                },
                onPressFilter : function()
                {
                    if (!this._oFilterDialog) {
                        this._oFilterDialog = sap.ui.xmlfragment("com.sal.salhr.Fragments.FilterDialog", this);
                        this.getView().addDependent(this._oFilterDialog);
                    }
                    if (Device.system.desktop) {
                        this._oFilterDialog.addStyleClass("sapUiSizeCompact");
                    }
                    this._oFilterDialog.open();
                },
                handleFilterDialogConfirm: function (oEvent) {
                    var oFilterSearch = [];
                    if (oEvent.getParameters().filterString) {
                        var filters = oEvent.getParameters().filterCompoundKeys,
                       sStatusFilter =   filters.Status === undefined ? "" : Object.keys(filters.Status)[0],
                       sDateFilter = filters.Date === undefined ? "" : Object.keys(filters.Date)[0];


                       if (sStatusFilter != "") {
                        oFilterSearch.push(new Filter("status", FilterOperator.EQ, sStatusFilter));
                    }
                    if (sDateFilter != "") {
                        oFilterSearch.push(new Filter("Date", FilterOperator.EQ, sDateFilter));
                    }


                    if (oFilterSearch.length > 0) {
                        
                        this.byId("idTicketTable").getBinding("items").filter(new Filter(oFilterSearch, true));
                    }

                
                    }
                    else{

                        this.byId("idTicketTable").getBinding("items").filter(new Filter(oFilterSearch, true));
                        //this.byId("idTicketTable").getBinding("items").filter(oFilterSearch, "Application");
                    }





                }

            

        });
    });        
