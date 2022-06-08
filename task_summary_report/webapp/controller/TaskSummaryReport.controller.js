sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/sal/tasksummaryreport/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter) {
        "use strict";

        return Controller.extend("com.sal.tasksummaryreport.controller.TaskSummaryReport", {
            formatter: formatter,
            onInit: function () {
                var oCurrentDate = new Date(),
                    oFromDate = oCurrentDate.getDate() - 7;

                oFromDate = new Date(oCurrentDate.setDate(oFromDate));

                var oLocalViewModel = new JSONModel({
                    SelectedSegmentBTNKey: "HR",
                    SelectedViewSegmentBTNKey: "ChartTableBoth",
                    FromDate: oFromDate,
                    ToDate: new Date(),
                    SelectedModuleID: 1,
                    SelectedPortletID: "",
                    SelectedStatus: ""
                });
                this.getView().setModel(oLocalViewModel, "LocalViewModel");

                this.fnReadTaskChartData(1);
                this.fnReadTaskSummaryTableDataFirst(1);
                this.onModuleChange(1);
            },

            fnReadTaskChartData: function (iModuleID) {
                var oFromDate = this.getView().getModel("LocalViewModel").getProperty("/FromDate"),
                    oToDate = this.getView().getModel("LocalViewModel").getProperty("/ToDate"),
                    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }),
                    oStartDate = dateFormat.format(new Date(oFromDate)),
                    oEndDate = dateFormat.format(new Date(oToDate)),
                    sStartDate = oStartDate + "T00:00:00.000Z",
                    sEndDate = oEndDate + "T00:00:00.000Z";

                var sPath = "/MasterModules(" + iModuleID + ")/masterSubModule";
                this.getView().setBusy(true);
                this.getView().getModel().read(sPath, {
                    urlParameters: {
                        "taskSummaryReport": "true",
                        "from": sStartDate,
                        "to": sEndDate
                    },
                    success: function (oData) {
                        this.getView().setBusy(false);
                        var oTaskChartReportModel = new JSONModel(oData.results);
                        this.getView().setModel(oTaskChartReportModel, "TaskChartReportModel");
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            fnReadTaskSummaryTableData: function (iModuleID) {
                this.getView().setBusy(true);

                var oFromDate = this.getView().getModel("LocalViewModel").getProperty("/FromDate"),
                    oToDate = this.getView().getModel("LocalViewModel").getProperty("/ToDate"),
                    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }),
                    oStartDate = dateFormat.format(new Date(oFromDate)),
                    oEndDate = dateFormat.format(new Date(oToDate)),
                    sStartDate = oStartDate + "T00:00:00.000Z",
                    sEndDate = oEndDate + "T00:00:00.000Z",
                    aFilters = [];

                aFilters.push(new sap.ui.model.Filter({
                    path: "moduleId",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: iModuleID
                }));
                if (this.getView().getModel("LocalViewModel").getProperty("/SelectedPortletID") !== "") {
                    aFilters.push(new sap.ui.model.Filter({
                        path: "subModuleId",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: this.getView().getModel("LocalViewModel").getProperty("/SelectedPortletID")
                    }));
                }
                if (this.getView().getModel("LocalViewModel").getProperty("/SelectedStatus") !== "") {
                    aFilters.push(new sap.ui.model.Filter({
                        path: "status",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: this.getView().getModel("LocalViewModel").getProperty("/SelectedStatus")
                    }));
                }

                this.getView().getModel().read("/Tickets", {
                    filters: aFilters,
                    urlParameters: {
                        "taskSummaryReport": "true",
                        "from": sStartDate,
                        "to": sEndDate,
                        "$expand": "module,subModule"
                        // "$select": "moduleName,effectiveStartDate,endDate,modifiedBy,status"
                    },
                    success: function (oData) {
                        this.getView().setBusy(false);
                        var oTaskTableReportModel = new JSONModel(oData.results);
                        this.getView().setModel(oTaskTableReportModel, "TaskTableReportModel");
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            fnReadTaskSummaryTableDataFirst: function (iModuleID) {
                var oFromDate = this.getView().getModel("LocalViewModel").getProperty("/FromDate"),
                    oToDate = this.getView().getModel("LocalViewModel").getProperty("/ToDate"),
                    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }),
                    oStartDate = dateFormat.format(new Date(oFromDate)),
                    oEndDate = dateFormat.format(new Date(oToDate)),
                    sStartDate = oStartDate + "T00:00:00.000Z",
                    sEndDate = oEndDate + "T00:00:00.000Z",
                    oModuleIdFilter = new sap.ui.model.Filter({
                        path: "moduleId",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: iModuleID
                    });

                this.getView().setBusy(true);
                this.getView().getModel().read("/Tickets", {
                    filters: [oModuleIdFilter],
                    urlParameters: {
                        "taskSummaryReport": "true",
                        "from": sStartDate,
                        "to": sEndDate,
                        "$expand": "module,subModule",
                        "$skip": 0,
                        "$top": 10
                    },
                    success: function (oData) {
                        this.getView().setBusy(false);
                        var oTaskTableReportModel = new JSONModel(oData.results);
                        this.getView().setModel(oTaskTableReportModel, "TaskTableReportModel");
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            fnSetChartTableVisibility: function (oEvent) {
                var sSelectedViewKey = oEvent.getSource().getSelectedKey(),
                    oTableView = this.getView().byId("idTaskListTable"),
                    oChartView = this.getView().byId("idChartContainer"),
                    oTableToolbar = this.getView().byId("idTableToolbar");

                if (sSelectedViewKey === "TableOnly") {
                    oTableView.setVisible(true);
                    oTableToolbar.setVisible(true);
                    oChartView.setVisible(false);
                }
                else if (sSelectedViewKey === "ChartOnly") {
                    oTableView.setVisible(false);
                    oTableToolbar.setVisible(false);
                    oChartView.setVisible(true);
                } else {
                    oTableView.setVisible(true);
                    oTableToolbar.setVisible(true);
                    oChartView.setVisible(true);
                }
            },

            onSegmentBTNSelect: function (oEvent) {
                var oSelectedKey = oEvent.getSource().getProperty("selectedKey"),
                    iModuleID = "",
                    sSegmentTitle = "";

                switch (oSelectedKey) {
                    case "HR":
                        sSegmentTitle = "Human Resource";
                        iModuleID = 1;
                        break;

                    case "Procurement":
                        sSegmentTitle = "Procurement";
                        iModuleID = 2;
                        break;

                    case "ITSM":
                        sSegmentTitle = "IT Service Management";
                        iModuleID = 4;
                        break;

                    case "PM":
                        sSegmentTitle = "Plant Maintenance";
                        iModuleID = 3;
                        break;

                    default:
                        sSegmentTitle = "Human Resource";
                        iModuleID = 1;
                        break;
                }

                this.getView().getModel("LocalViewModel").setProperty("/SelectedModuleID", iModuleID);
                this.getView().getModel("LocalViewModel").setProperty("/SelectedPortletID", "");                
                this.getView().getModel("LocalViewModel").setProperty("/SelectedStatus", "");
                
                this.getView().byId("idChartContainer").setTitle(sSegmentTitle);
                this.fnReadTaskChartData(iModuleID);
                this.fnReadTaskSummaryTableData(iModuleID);
                this.onModuleChange(iModuleID);
            },

            onFilterDateChange: function (oEvent) {
                this.getView().getModel("LocalViewModel").setProperty("/FromDate", oEvent.getSource().getDateValue());
                this.getView().getModel("LocalViewModel").setProperty("/ToDate", oEvent.getSource().getSecondDateValue());
                this.getView().getModel("LocalViewModel").refresh();

                var iModuleID = this.getView().getModel("LocalViewModel").getProperty("/SelectedModuleID");
                this.fnReadTaskChartData(iModuleID);
                this.fnReadTaskSummaryTableData(iModuleID);
                this.onModuleChange(iModuleID);
            },

            onModuleChange: function (sValue) {
                var sPath = "";
                if (typeof (sValue) !== "object")
                    sPath = "/MasterModules(" + sValue + ")/masterSubModule";
                else
                    sPath = "/MasterModules(" + sValue.getSource().getSelectedKey() + ")/masterSubModule";

                this.getView().setBusy(true);
                this.getView().getModel().read(sPath, {
                    success: function (oData) {
                        this.getView().setBusy(false);
                        var oPortletModel = new JSONModel(oData.results);
                        this.getView().setModel(oPortletModel, "PortletModel");
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            onFilterTablePress: function () {
                var iModuleID = this.getView().getModel("LocalViewModel").getProperty("/SelectedModuleID");
                this.fnReadTaskSummaryTableData(iModuleID);
            }
        });
    });

