sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.sal.report.chatbotsummaryreport.controller.ChatbotSummary", {
            onInit: function () {
                var oDonutCard = {
                    "donut": {
                        "sap.card": {
                            "type": "Analytical",
                            "header": {
                                "type": "Numeric",
                                "title": "Most Used Skills",
                                "subTitle": "",
                                "data": {
                                    "json": {
                                        "NumberCount": "0",
                                        "Unit": "",
                                        "Trend": "",
                                        "TrendColor": "Good"
                                    }
                                }
                            },
                            "content": {
                                "chartType": "Donut",
                                "legend": {
                                    "visible": false,
                                    "position": "top",
                                    "alignment": "Right"
                                },
                                "plotArea": {
                                    "dataLabel": {
                                        "visible": true,
                                        type: "label",
                                        "showTotal": false
                                    }
                                },
                                "title": {
                                    "text": "Most Used Skills",
                                    "visible": false
                                },
                                "measureAxis": "size",
                                "dimensionAxis": "color",
                                "data": {
                                    "json": {
                                        "measures": []
                                    },
                                    "path": "/measures"
                                },
                                "dimensions": [
                                    {
                                        "label": "Measure Name",
                                        "value": "{ProductName}"
                                    }
                                ],
                                "measures": [
                                    {
                                        "label": "Value",
                                        "value": "{UnitsInStock}"
                                    }
                                ]
                            }
                        }
                    }
                };

                this.getOwnerComponent().getModel().read("/Products", {
                    success: function (oData) {
                        var cardManifests = new JSONModel();
                        oDonutCard.donut["sap.card"].content.data.json.measures = oData.results;
                        oDonutCard.donut["sap.card"].content.data.path = "/measures";

                        cardManifests.setData(oDonutCard);
                        this.getView().setModel(cardManifests, "manifests");
                    }.bind(this),
                    error: function () {
                    }
                });
            }
        });
    });    
