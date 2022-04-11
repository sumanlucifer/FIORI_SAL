sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ChartFormatter, JSONModel) {
        "use strict";

        return Controller.extend("com.sal.reports.slacompliancereport.controller.SLACompliance", {
            onInit: function () {
                this.fnReadTickitsSummaryData();
            },

            fnInitializeChart: function () {
                var oVizFrame = this.getView().byId("idVizFrame");
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
                    plotArea: {
                        colorPalette: ["#4472C4", "#ED7D31", "#A5A5A5", "#FFC000", "#5B9BD5", "#70AD47", "#264478"],
                        gap: {
                            innerGroupSpacing: 0,
                            groupSpacing: 1
                        },
                        dataPointSize: {
                            min: 30,
                            max: 30
                        },
                        dataLabel: {
                            visible: true
                        }
                    },
                    legendGroup: {
                        layout: {
                            position: "bottom",
                            alignment: "center"
                        }
                    }
                });

                var oPopOver = this.getView().byId("idPopOver");
                oPopOver.connect(oVizFrame.getVizUid());
            },

            fnReadTickitsSummaryData: function () {
                this.getView().setBusy(true);
                this.getView().getModel().read("/MasterModules", {
                    success: function (oData) {
                        this.getView().setBusy(false);
                        // var oSLAComplianceDataModel = new JSONModel(oData.results);
                        var oSLAComplianceDataModel = new JSONModel(this.fnGetSampleData());
                        this.getView().setModel(oSLAComplianceDataModel, "SLAComplianceDataModel");
                        this.fnInitializeChart();
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            fnGetSampleData: function () {
                return [{
                    "ID": 1,
                    "name": "Human Resource",
                    "totalRequests": 105,
                    "completed": 100,
                    "Rating": "Good",
                    displayPercentage: 80,
                    state: "Success"
                },
                {
                    "ID": 2,
                    "name": "Procurement",
                    "totalRequests": 50,
                    "completed": 10,
                    "Rating": "Poor",
                    displayPercentage: 15,
                    state: "Error"
                },
                {
                    "ID": 3,
                    "name": "Plant Maintenance",
                    "totalRequests": 80,
                    "completed": 50,
                    "Rating": "Average",
                    displayPercentage: 70,
                    state: "Warning"
                },
                {
                    "ID": 4,
                    "name": "IT Service Management",
                    "totalRequests": 30,
                    "completed": 17,
                    "Rating": "Average",
                    displayPercentage: 50,
                    state: "Warning"
                },
                {
                    "ID": 5,
                    "name": "Center of Excellence",
                    "totalRequests": 40,
                    "completed": 30,
                    "Rating": "Good",
                    displayPercentage: 90,
                    state: "Success"
                },
                {
                    "ID": 6,
                    "name": "Overall Shared Services",
                    "totalRequests": 60,
                    "completed": 40,
                    "Rating": "Good",
                    displayPercentage: 80,
                    state: "Success"
                }];
            }
        });
    });
