sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.sal.cards.inprocessrequestcardtile.controller.InProcessRequestCard", {
            onInit: function () {
                var oCardData = {
                    "donut": {
                        "sap.app": {
                            "id": "com.sal.cards.inprocessrequestcardtile",
                            "type": "card"
                        },
                        "sap.card": {
                            "type": "Analytical",
                            "header": {
                                "type": "Numeric",
                                "title": "Pending",
                                "subTitle": "Total requests that are Pending",
                                "data": {
                                    "json": {
                                        "NumberCount": "0",
                                        "Unit": "",
                                        "Trend": "",
                                        "TrendColor": "Good"
                                    }
                                },
                                "mainIndicator": {
                                    "number": "{NumberCount}",
                                    "unit": "{Unit}",
                                    "trend": "{Trend}",
                                    "state": "{TrendColor}"
                                },
                                "actions": [
                                    {
                                        "type": "Navigation",
                                        "parameters": {}
                                    }
                                ]
                            },
                            "content": {
                                "chartType": "Donut",
                                "legend": {
                                    "visible": true,
                                    "position": "Bottom",
                                    "alignment": "Left"
                                },
                                "plotArea": {
                                    "dataLabel": {
                                        "visible": true,
                                        "showTotal": true
                                    }
                                },
                                "title": {
                                    "text": "Pending requests by Type",
                                    "visible": true
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
                                        "value": "{name}"
                                    }
                                ],
                                "measures": [
                                    {
                                        "label": "Value",
                                        "value": "{totalPending}"
                                    }
                                ]
                            }
                        }
                    }
                };

                this.getOwnerComponent().getModel().read("/MasterModules", {
                    urlParameters: {
                        "IsUserManager": "true"
                    },
                    success: function (oData) {
                        var cardManifests = new JSONModel();
                        oCardData.donut["sap.card"].content.data.json.measures = oData.results;
                        oCardData.donut["sap.card"].content.data.path = "/measures";

                        // Set Values for Header
                        // oCardData.donut["sap.card"].header.data.json.NumberCount = oData.results[0].underProcess + oData.results[1].underProcess + oData.results[2].underProcess + oData.results[3].underProcess;
                          oCardData.donut["sap.card"].header.data.json.NumberCount = oData.results[0].totalPending + oData.results[1].totalPending + oData.results[2].totalPending + oData.results[3].totalPending;
                        // oCardData.donut["sap.card"].content.data.json.Unit = "";
                        // oCardData.donut["sap.card"].content.data.json.Trend= "";
                        // oCardData.donut["sap.card"].content.data.json.TrendColor= "Good";

                        cardManifests.setData(oCardData);
                        this.getView().setModel(cardManifests, "manifests");
                    }.bind(this),
                    error: function () {
                    }
                });
            },

            onAction: function () {
                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "myreq_inprocess",
                        action: "manage"
                    },
                    params: {}
                })) || "";
                oCrossAppNavigator.toExternal({
                    target: {
                        shellHash: hash
                    }
                });
            }
        });
    });
