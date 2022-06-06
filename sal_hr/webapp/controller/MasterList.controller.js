sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "com/sal/salhr/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter'
],

    function (BaseController, Controller, formatter, Filter, FilterOperator, Sorter) {
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

                var params = new URLSearchParams(decodeURIComponent(window.parent.location.href)),
                    subModuleId = params.get("submoduleId"),
                    ticketId = params.get("ticketId");
                if (subModuleId && ticketId) {
                    this._navToDetail(subModuleId);
                }
                var sLayout = oEvent.getParameter("arguments").layout;
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
            },
            onUpdateMasterListBindingStart: function (oEvent) {
                var sIsUserManager = this.getOwnerComponent().getModel("EmpInfoModel").getProperty("/IsUserManager").toString();
                oEvent.getSource().getBinding("items").sCustomParams = "IsUserManager=" + sIsUserManager;
                oEvent.getSource().getBinding("items").mCustomParams.IsUserManager = sIsUserManager;
            },
            _navToDetail: function (id) {

                this.getRouter().navTo("detail", {
                    parentMaterial: id,
                    layout: "TwoColumnsMidExpanded"
                },
                    false
                );



            },




            onMasterListPress: function (oEvent) {
                this._showObject(oEvent.getSource());
            },


            _showObject: function (oItem) {
                var that = this;
                var sManagerTile = this.getView().getModel("EmpInfoModel").getData().IsUserManager;
                var subModuleId = oItem.getBindingContext().getObject().ID;
                this.fnGetRoleAccess(sManagerTile, subModuleId, oItem);
            },
            onSearch: function (oEvent) {
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {

                    aFilters.push(this.createFilter("name", FilterOperator.Contains, sQuery, true));

                }


                var oTable = this.byId("idMasterTable");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilters);

            },
            createFilter: function (key, operator, value, useToLower) {
                return new Filter(useToLower ? "tolower(" + key + ")" : key, operator, useToLower ? "'" + value.toLowerCase() + "'" : value);
            },
            onSort: function () {
                this._bDescendingSort = !this._bDescendingSort;
                var oBinding = this.getView().byId("idMasterTable").getBinding("items"),
                    oSorter = new Sorter("name", this._bDescendingSort);

                oBinding.sort(oSorter);
            },

            fnGetRoleAccess: function (sManagerTile, subModuleId, oItem) {
                this.sManagerTile = sManagerTile;
                var oComponentModel = this.getComponentModel();
                oComponentModel.read("/MasterRolePermission", {
                    urlParameters: {
                        "subModuleId": subModuleId
                    },

                    success: function (oData) {

                        if (this.sManagerTile === false) {
                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/createSelf", oData.results[0].createSelf);
                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/deleteSelf", oData.results[0].deleteSelf);
                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/readSelf", oData.results[0].readSelf);
                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/updateSelf", oData.results[0].updateSelf);
                        } else {

                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/approveOther", oData.results[0].approveOther);
                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/createOther", oData.results[0].createOther);
                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/deleteOther", oData.results[0].deleteOther);
                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/readOther", oData.results[0].readOther);
                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/rejectOther", oData.results[0].rejectOther);
                            this.getOwnerComponent().getModel("RoleInfoModel").setProperty("/updateOther", oData.results[0].updateOther);
                        }
                        var sPath = oItem.getBindingContextPath()
                        this.getRouter().navTo("detail", {
                            parentMaterial: oItem.getModel().getProperty(sPath).ID,
                            layout: "TwoColumnsMidExpanded"
                        },
                            false
                        );
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageBox.error(JSON.stringify(oError));
                    }.bind(this),
                });
            }
        });
    });
