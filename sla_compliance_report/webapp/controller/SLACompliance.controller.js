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
                            visible: true
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    },
                    plotArea: {
                        colorPalette: ["#4472C4", "#ED7D31", "#A5A5A5", "#FFC000", "#5B9BD5", "#70AD47", "#264478"],
                        // gap: {
                        //     innerGroupSpacing: 0,
                        //     groupSpacing: 1.5
                        // },
                        // dataPointSize: {
                        //     min: 30,
                        //     max: 30
                        // },
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
            },

            fnReadTickitsSummaryData: function () {
                this.getView().setBusy(true);
                this.getView().getModel().read("/MasterModules", {
                    success: function (oData) {
                        this.getView().setBusy(false);
                        var oSLAComplianceDataModel = new JSONModel(oData.results);
                        // var oSLAComplianceDataModel = new JSONModel(this.fnGetSampleData());
                        this.getView().setModel(oSLAComplianceDataModel, "SLAComplianceDataModel");
                        this.fnInitializeChart();
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            fnFormatRatingText: function (iComplianceScore) {
                var iSLAComplianceScore = Number(iComplianceScore),
                    sRatingText = "";
                if (iSLAComplianceScore >= 75) {
                    sRatingText = "Excellent";
                } else if (iSLAComplianceScore < 75 && iSLAComplianceScore >= 50) {
                    sRatingText = "Good";
                } else if (iSLAComplianceScore < 50 && iSLAComplianceScore >= 25) {
                    sRatingText = "Average";
                } else {
                    sRatingText = "Poor";
                }
                return sRatingText;
            },

            fnFormatRatingState: function (iComplianceScore) {
                var iSLAComplianceScore = Number(iComplianceScore),
                    sStateValue = "";
                if (iSLAComplianceScore >= 75) {
                    sStateValue = "Success";
                } else if (iSLAComplianceScore < 75 && iSLAComplianceScore >= 50) {
                    sStateValue = "Information";
                } else if (iSLAComplianceScore < 50 && iSLAComplianceScore >= 25) {
                    sStateValue = "Warning";
                } else {
                    sStateValue = "Error";
                }
                return sStateValue;
            },


            fnGetSampleData: function () {
                return [{
                    "ID": 1,
                    "name": "Human Resource",
                    "totalRequests": 105,
                    "completed": 100,
                    "Rating": "Excellent",
                    state: "Success"
                },
                {
                    "ID": 2,
                    "name": "Procurement",
                    "totalRequests": 50,
                    "completed": 73,
                    "Rating": "Good",
                    state: "Error"
                },
                {
                    "ID": 3,
                    "name": "Plant Maintenance",
                    "totalRequests": 80,
                    "completed": 50,
                    "Rating": "Average",
                    state: "Warning"
                },
                {
                    "ID": 4,
                    "name": "IT Service Management",
                    "totalRequests": 30,
                    "completed": 35,
                    "Rating": "Average",
                    state: "Warning"
                },
                {
                    "ID": 5,
                    "name": "Center of Excellence",
                    "totalRequests": 40,
                    "completed": 10,
                    "Rating": "Poor",
                    state: "Success"
                },
                {
                    "ID": 6,
                    "name": "Overall Shared Services",
                    "totalRequests": 60,
                    "completed": 40,
                    "Rating": "Average",
                    state: "Success"
                }];
            }
        });
    });
