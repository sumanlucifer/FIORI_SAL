// @ts-ignore
sap.ui.define(
    [
        "com/sal/salhr/createuser/controller/BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Sorter",
        "sap/ui/core/Fragment",
        "sap/ui/Device",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/m/ColumnListItem",
        "sap/m/Label",
        "sap/m/Token",
        "sap/ui/core/format/DateFormat"
    ],
    function (
        BaseController,
        Filter,
        FilterOperator,
        JSONModel,
        Sorter,
        Fragment,
        Device,
        MessageBox,
        MessageToast,
        ColumnListItem,
        Label,
        Token,
        DateFormat,
        
    ) {
        "use strict";

        return BaseController.extend(
            "com.sal.salhr.createuser.controller.CreateUser", {
               
                onInit: function () {
                    // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
                    this._mViewSettingsDialogs = {};

                    //Router Object
                    this.oRouter = this.getRouter();
                    this.oRouter
                        .getRoute("CreateUserPage")
                        .attachPatternMatched(this._onObjectMatched, this);
                  
                },
             
                _onObjectMatched: function (oEvent) {
                    var oViewModel,
                        iOriginalBusyDelay,
                        oTable = this.byId("idOffersTable");

                    iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
                    oViewModel = new JSONModel({
                        TableTitle: this.getResourceBundle().getText("TableTitle"),
                        tableNoDataText: this.getResourceBundle().getText(
                            "tableNoDataText"
                        ),
                        tableBusyDelay: 0,
                    });

                    this.setModel(oViewModel, "worklistView");

                    oTable.attachEventOnce("updateFinished", function () {
                        // Restore original busy indicator delay for worklist's table
                        oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
                    });
                    this.getView().getModel().refresh();
                

                },
              


                onUpdateFinished: function (oEvent) {
                    var sTitle,
                        oTable = oEvent.getSource(),
                        iTotalItems = oEvent.getParameter("total");
                    if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                        sTitle = this.getResourceBundle().getText("TableDataCount", [
                            iTotalItems,
                        ]);
                    } else {
                        sTitle = this.getResourceBundle().getText("TableDataCount", [0]);
                    }
                    this.getView()
                        .getModel("worklistView")
                        .setProperty("/TableTitle", sTitle);
                },

                onPressListItem: function (oEvent) {
                    var sPath = oEvent
                        .getSource()
                        .getBindingContext()
                        .getPath()
                        .substr(1);
                    var oBject = oEvent.getSource().getBindingContext().getObject();
                    this.oRouter.navTo("DetailPage", {
                        prop: oBject["Id"],
                        mode: "display",
                    });
                },
                onEditOffer: function (oEvent) {
                    var sPath = oEvent
                        .getSource()
                        .getBindingContext()
                        .getPath()
                        .substr(1);
                    var oBject = oEvent.getSource().getBindingContext().getObject();
                    this.oRouter.navTo("DetailPage", {
                        prop: oBject["Id"],
                        mode: "edit",
                    });
                },
                onPressEdit: function (oEvent) {
                    var sPath = oEvent.getSource().getBindingContext().getPath();
                    this.oRouter.navTo("ActionPage", {
                        action: "edit",
                        property: sPath.substr(1),
                    });
                },
                onPressAdd: function () {
                    //var sPath = oEvent.getSource().getBindingContext().getPath();
                    this.oRouter.navTo("AddOfferPage");
                },

             

              
                

             
                onReset: function () {
                    this._ResetFilterBar();
                },
                _ResetFilterBar: function () {
                    var aCurrentFilterValues = [];
                    var aResetProp = {
                        StartDate: null,
                        EndDate: null,
                        Name: "",
                        OfferType: "",
                        Status: "",
                        TrainingZone: "",
                        TrainingDivision: "",
                        TrainingDepot: "",
                        Active: ""
                    };
                    var oViewModel = this.getView().getModel("oModelControl");
                    oViewModel.setProperty("/filterBar", aResetProp);
                    var oTable = this.byId("idOffersTable");
                    var oBinding = oTable.getBinding("items");
                    oBinding.filter([]);
                    oBinding.sort(new Sorter({
                        path: "CreatedAt",
                        descending: true
                    }));
                    this._fiterBarSort();
                }
            
            }
        );
    }
);