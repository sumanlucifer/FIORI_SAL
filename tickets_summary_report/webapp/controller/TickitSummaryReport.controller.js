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

        return Controller.extend("com.sal.reports.ticketssummaryreport.controller.TickitSummaryReport", {
            onInit: function () {
                this.fnReadTickitsSummaryData();
            },

            fnInitializeChart: function () {
                var oVizFrame = this.getView().byId("idTicketsVizFrame");
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
                        // colorPalette: ["#4472C4", "#ED7D31", "#A5A5A5", "#FFC000", "#5B9BD5", "#70AD47", "#264478"],
                        colorPalette: ["#4472C4", "#A5A5A5", "#FFC000", "#264478"],
                        gap: {
                            innerGroupSpacing: 0,
                            groupSpacing: 1.5
                        },
                        dataShape: {
                            // primaryAxis: ['bar', 'bar', 'bar', 'bar', 'line']
                            primaryAxis: ['bar', 'bar', 'bar', 'line']
                        },
                        // Enabling this setting sets zoom buttons as disable
                        // dataPointSize: {
                        //     min: 30,
                        //     max: 30
                        // }
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
                        var oTicketsSummaryData = new JSONModel(oData.results);
                        // var oTicketsSummaryData = new JSONModel(this.fnGetSampleData());
                        this.getView().setModel(oTicketsSummaryData, "TicketsSummaryDataModel");
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
                    "description": "Leave, Loan, Business Trip Request...",
                    "totalRequests": 105,
                    "totalPending": 2,
                    "totalApproved": 102,
                    "totalRejected": 0,
                    "totalCancelled": 1,
                    "slaPerformance": null,
                    "myGoals": null,
                    "completed": 102,
                    "underProcess": 10,
                    "pending": 20,
                    "cancelledByEndUser": 11,
                    "cancelledByAdmin": 12,
                    "reassigned": 30,
                    "reopened": 10
                },
                {
                    "ID": 2,
                    "name": "Procurement",
                    "description": "Purchase Request, Purchase Orders & SES/GR",
                    "totalRequests": 0,
                    "totalPending": 0,
                    "totalApproved": 0,
                    "totalRejected": 0,
                    "totalCancelled": 0,
                    "slaPerformance": null,
                    "myGoals": null,
                    "completed": 40,
                    "underProcess": 10,
                    "pending": 20,
                    "cancelledByEndUser": 1,
                    "cancelledByAdmin": 31,
                    "reassigned": 23,
                    "reopened": 4
                },
                {
                    "ID": 3,
                    "name": "Plant Maintenance",
                    "description": "Corrective/Emergency Maintenance & Safety Issues",
                    "totalRequests": 0,
                    "totalPending": 0,
                    "totalApproved": 0,
                    "totalRejected": 0,
                    "totalCancelled": 0,
                    "slaPerformance": null,
                    "myGoals": null,
                    "completed": 50,
                    "underProcess": 12,
                    "pending": 14,
                    "cancelledByEndUser": 16,
                    "cancelledByAdmin": 23,
                    "reassigned": 40,
                    "reopened": 25
                },
                {
                    "ID": 4,
                    "name": "IT Service Management",
                    "description": "Incident & Service Request",
                    "totalRequests": 22,
                    "totalPending": 0,
                    "totalApproved": 17,
                    "totalRejected": 0,
                    "totalCancelled": 0,
                    "slaPerformance": null,
                    "myGoals": null,
                    "completed": 17,
                    "underProcess": 30,
                    "pending": 1,
                    "cancelledByEndUser": 10,
                    "cancelledByAdmin": 30,
                    "reassigned": 2,
                    "reopened": 20
                },
                {
                    "ID": 5,
                    "name": "Center of Excellence",
                    "description": "Center of Excellence",
                    "totalRequests": 0,
                    "totalPending": 0,
                    "totalApproved": 0,
                    "totalRejected": 0,
                    "totalCancelled": 0,
                    "slaPerformance": null,
                    "myGoals": null,
                    "completed": 30,
                    "underProcess": 20,
                    "pending": 10,
                    "cancelledByEndUser": 1,
                    "cancelledByAdmin": 31,
                    "reassigned": 35,
                    "reopened": 14
                },
                {
                    "ID": 6,
                    "name": "Overall Shared Services",
                    "description": "Overall Shared Services",
                    "totalRequests": 0,
                    "totalPending": 0,
                    "totalApproved": 0,
                    "totalRejected": 0,
                    "totalCancelled": 0,
                    "slaPerformance": null,
                    "myGoals": null,
                    "completed": 20,
                    "underProcess": 12,
                    "pending": 114,
                    "cancelledByEndUser": 16,
                    "cancelledByAdmin": 23,
                    "reassigned": 40,
                    "reopened": 15
                }];
            }
        });
    });
