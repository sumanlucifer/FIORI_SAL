sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/Fragment"
    ],
    function (Controller, JSONModel, Filter, FilterOperator, Fragment) {
        "use strict";

        return Controller.extend("com.sal.chatbotsummaryreport.controller.controller.App", {
            onInit: function () {
                this.fnGetChatBotData();
            },

            fnGetChatBotData: function (oDateRangeFilter) {
                this.getView().setBusy(true);
                this.getOwnerComponent().getModel().read("/chatBotUsageSummary", {
                    filters: [oDateRangeFilter],
                    success: function (oData) {
                        if (oData.chatBotUsageSummary.length > 2) {
                            var oSummaryData = JSON.parse(oData.chatBotUsageSummary);
                            oSummaryData.MostUsedSkills = oSummaryData.skills.slice(0, 5);
                            oSummaryData.MostUsedIntents = oSummaryData.intents.slice(0, 10);
                            oSummaryData.NeverUsedSkills = this.fnGetNeverUsedItems(oSummaryData.skills);
                            oSummaryData.NeverUsedIntents = this.fnGetNeverUsedItems(oSummaryData.intents);
                            oSummaryData.MessagesPerConversation = this.fnGetMessagesPerConversation(oSummaryData.conversations, oSummaryData.messagesReceived);

                            var oChatbotSummaryModel = new JSONModel(oSummaryData);
                            this.getView().setModel(oChatbotSummaryModel, "ChatbotSummaryModel");
                            this.getView().setBusy(false);
                        }
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }
                });
            },

            fnGetMessagesPerConversation: function (iConversations, iMessagesReceived) {
                if (iConversations && iMessagesReceived)
                    return (iMessagesReceived / iConversations).toFixed(2);
                else
                    return 0;
            },

            fnGetNeverUsedItems: function (aData) {
                return aData.filter(function (oItem) {
                    return oItem.count <= 2;
                });
            },

            handleFiltersPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();

                // create popover
                if (!this.oDateRangeFilterDialog) {
                    this.oDateRangeFilterDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.sal.chatbotsummaryreport.view.FiltersDialog",
                        controller: this
                    }).then(function (oPopover) {
                        return oPopover;
                    });
                }

                this.oDateRangeFilterDialog.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
            },

            handleFiltersOkPress: function (oEvent) {
                var oFromDate = this.getView().byId("idDateRangeSelector").getDateValue(),
                    oToDate = this.getView().byId("idDateRangeSelector").getSecondDateValue(),
                    oDateRangeFilter = new Filter("Date", FilterOperator.BT, oFromDate, oToDate);

                this.fnGetChatBotData(oDateRangeFilter);
            },

            fnSetZoomingSizeFive: function (oEvent) {
                oEvent.getSource().zoom({ direction: "in" });
                oEvent.getSource().zoom({ direction: "in" });
                oEvent.getSource().zoom({ direction: "in" });
                // oEvent.getSource().zoom({ direction: "in" });
                // oEvent.getSource().zoom({ direction: "in" });
            },

            // Function is used to set the items in Ascending or Descending Order
            fnSortSkillsIntents: function (oEvent) {
                var sSectionName = oEvent.getSource().getParent().getProperty("title"),
                    sPropertyName = null;
                if (sSectionName === "Skills Usage")
                    sPropertyName = "/skills";
                else
                    sPropertyName = "/intents";

                var aSkills = this.getView().getModel("ChatbotSummaryModel").getProperty(sPropertyName),
                    sIcon = oEvent.getSource().getProperty("src"),
                    aCountAscending = aSkills.sort(function (oItem1, oItem2) {
                        if (oItem1.count < oItem2.count) {
                            return -1; //oItem1 comes first
                        }
                        if (oItem1.count > oItem2.count) {
                            return 1; // oItem2 comes first
                        }
                        return 0;  // oItem1 and oItem2 must be equal
                    });

                if (sIcon === "sap-icon://sort-ascending") {
                    this.getView().getModel("ChatbotSummaryModel").setProperty(sPropertyName, aCountAscending);
                    this.getView().getModel("ChatbotSummaryModel").refresh();
                    return;
                }
                if (sIcon === "sap-icon://sort-descending") {
                    this.getView().getModel("ChatbotSummaryModel").setProperty(sPropertyName, aCountAscending.reverse());
                    this.getView().getModel("ChatbotSummaryModel").refresh();
                    return;
                }
                if (sIcon === "sap-icon://alphabetical-order") {
                    var aAlphaAscending = aSkills.sort(function (oItem1, oItem2) {
                        if (oItem1.name.toUpperCase() < oItem2.name.toUpperCase()) {
                            return -1; //oItem1 comes first
                        }
                        if (oItem1.name.toUpperCase() > oItem2.name.toUpperCase()) {
                            return 1; // oItem2 comes first
                        }
                        return 0;  // oItem1 and oItem2 must be equal
                    });
                    this.getView().getModel("ChatbotSummaryModel").setProperty(sPropertyName, aAlphaAscending);
                    this.getView().getModel("ChatbotSummaryModel").refresh();
                }
            }
        });
    })