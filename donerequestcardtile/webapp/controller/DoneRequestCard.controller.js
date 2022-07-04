sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.sal.donerequestcardtile.donerequestcardtile.controller.DoneRequestCard", {
            onInit: function () {
                var oCardData = {
                    "donut": {
                        "sap.app": {
                            "id": "com.sal.donerequestcardtile.donerequestcardtile",
                            "type": "card"
                        },
                        "sap.card": {
                            "type": "Analytical",
                            "header": {
                                "type": "Numeric",
                                "title": "My Approved Requests",
                                "subTitle": "Total requests that are Approved",
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
                                        "parameters": {},
                                        "enabled": false
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
                                    "text": "Approved requests by Type",
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
                                        "value": "{totalApproved}"
                                    }
                                ],
                                "actionableArea": "Chart",
                                "actions": [
                                    {
                                        "type": "Navigation",
                                        "parameters": {
                                           "text":"Hello"
                                        }
                                        
                                    }
                                ]
                            }
                        }
                    }
                };

                this.getOwnerComponent().getModel().read("/MasterModules", {
                    // urlParameters: {
                    //     "IsUserManager": "true"
                    // },
                    success: function (oData) {
                        var cardManifests = new JSONModel();
                        oCardData.donut["sap.card"].content.data.json.measures = oData.results;
                        oCardData.donut["sap.card"].content.data.path = "/measures";
                        
                         // Set Values for Header
                         oCardData.donut["sap.card"].header.data.json.NumberCount = oData.results[0].totalApproved + oData.results[1].totalApproved + oData.results[2].totalApproved + oData.results[3].totalApproved;
                        // oCardData.donut["sap.card"].content.data.json.NumberCount =  "0";
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

            onAction: function (oEvent) {
                debugger;
                var selectedColor = oEvent;
                sap.m.MessageBox.show("welcome");
                // var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                // var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                //     target: {
                //         semanticObject: "myreqopen",
                //         action: "manage"
                //     },
                //     params: {}
                // })) || "";
                // oCrossAppNavigator.toExternal({
                //     target: {
                //         shellHash: hash
                //     }
                // });
            }
        });
    });


