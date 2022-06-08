sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.sal.tasksummaryreport.controller.TaskSummaryReport", {
            onInit: function () {
                this.fnReadTaskChartData(1);

                this.fnReadTaskSummaryTableData();

                var oLocalViewModel = new JSONModel({
                    SelectedSegmentBTNKey: "HR"
                });
                this.getView().setModel(oLocalViewModel, "LocalViewModel");
            },

            fnInitializeChart: function () {
                var oVizFrame = this.getView().byId("idTaskVizFrame");
                oVizFrame.setVizProperties({
                    title: {
                        visible: false
                    },
                    valueAxis: {
                        title: {
                            visible: false
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    },
                    legendGroup: {
                        layout: {
                            position: "bottom",
                            alignment: "center"
                        }
                    }
                });
            },

            fnReadTaskChartData: function (iModuleID) {
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }),
                    oStartDate = dateFormat.format(new Date(sStartDate));
                    sStartDate = oStartDate + "T00:00:00";

                var sPath = "MasterModules(" + iModuleID + ")/masterSubModule";


                this.getView().setBusy(true);
                this.getView().getModel().read(sPath, {
                    urlParameters: {
                        "taskSummaryReport": "true"
                    },
                    success: function (oData) {
                        this.getView().setBusy(false);
                        var oTaskChartReportModel = new JSONModel(oData.results);
                        this.getView().setModel(oTaskChartReportModel, "TaskChartReportModel");
                        this.fnInitializeChart();
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            fnReadTaskSummaryTableData: function () {
                this.getView().setBusy(true);
                this.getView().getModel().read("/Tickets", {
                    urlParameters: {
                        "taskSummaryReport": "true"
                    },
                    success: function (oData) {
                        this.getView().setBusy(false);
                        var oTaskTableReportModel = new JSONModel(oData.results);
                        this.getView().setModel(oTaskTableReportModel, "TaskTableReportModel");
                        this.fnInitializeChart();
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            fnSetChartTableVisibility: function (oEvent) {
                var sIcon = oEvent.getSource().getProperty("src"),
                    oTableView = this.getView().byId("idTaskListTable"),
                    oChartView = this.getView().byId("idTaskVizFrame");

                if (sIcon === "sap-icon://table-view") {
                    oTableView.setVisible(true);
                    oChartView.setVisible(false);
                }
                else if (sIcon === "sap-icon://horizontal-stacked-chart") {
                    oTableView.setVisible(false);
                    oChartView.setVisible(true);
                } else {
                    oTableView.setVisible(true);
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

                this.getView().byId("idChartContainer").setTitle(sSegmentTitle);
                this.fnReadTaskChartData(iModuleID);

            }
        });
    });

