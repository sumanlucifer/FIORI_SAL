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
                this.fnReadTickitsSummaryData();

                this.fnInitializeChart();

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

            fnReadTickitsSummaryData: function () {
                this.getView().setBusy(true);
                this.getView().getModel().read("/MasterModules", {
                    urlParameters: {
                        "IsUserManager": "true"
                    },
                    success: function (oData) {
                        this.getView().setBusy(false);
                        var oTicketsSummaryData = new JSONModel(oData.results);
                        this.getView().setModel(oTicketsSummaryData, "TicketsSummaryDataModel");
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
                    sSegmentTitle = "";

                switch (oSelectedKey) {
                    case "HR":
                        sSegmentTitle = "Human Resource";
                        break;

                    case "Procurement":
                        sSegmentTitle = "Procurement";
                        break;

                    case "ITSM":
                        sSegmentTitle = "IT Service Management";
                        break;

                    case "PM":
                        sSegmentTitle = "Plant Maintenance";
                        break;
                    
                    default:
                        sSegmentTitle = "Human Resource";
                        break;
                }

                this.getView().byId("idChartContainer").setTitle(sSegmentTitle);
            }
        });
    });

