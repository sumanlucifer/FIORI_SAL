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
                var formatPattern = ChartFormatter.DefaultPattern;
                var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
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
                    }
                });

                var oPopOver = this.getView().byId("idPopOver");
                oPopOver.connect(oVizFrame.getVizUid());
                // oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

                this.fnReadTickitsSummaryData();
            },

            fnReadTickitsSummaryData: function () {
                this.getView().setBusy(true);
                this.getView().getModel().read("/MasterModules", {
                    success: function (oData) {
                        this.getView().setBusy(false);
                        var oTicketsSummaryData = new JSONModel(oData.results);
                        this.getView().setModel(oTicketsSummaryData, "TicketsSummaryDataModel");
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            }
        });
    });
