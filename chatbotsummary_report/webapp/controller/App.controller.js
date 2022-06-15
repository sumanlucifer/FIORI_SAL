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
                var oCurrentDate = new Date(),
                    oFromDate = oCurrentDate.getDate() - 7;

                oFromDate = new Date(oCurrentDate.setDate(oFromDate));

                var oLocalViewModel = new JSONModel({
                    FromDate: oFromDate,
                    ToDate: new Date()
                });
                this.getView().setModel(oLocalViewModel, "LocalViewModel");

                this.fnGetChatBotData();
            },

            fnGetChatBotData: function () {
                var oFromDate = this.getView().getModel("LocalViewModel").getProperty("/FromDate"),
                    oToDate = this.getView().getModel("LocalViewModel").getProperty("/ToDate"),
                    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }),
                    oStartDate = dateFormat.format(new Date(oFromDate)),
                    oEndDate = dateFormat.format(new Date(oToDate)),
                    sStartDate = oStartDate + "T00:00:00.000Z",
                    sEndDate = oEndDate + "T00:00:00.000Z";

                this.getView().setBusy(true);
                this.getOwnerComponent().getModel().read("/chatBotUsageSummary", {
                    urlParameters: {
                        "IsUserManager": "true",
                        "from": sStartDate,
                        "to": sEndDate
                    },
                    success: function (oData) {
                        if (oData.chatBotUsageSummary.length > 2) {
                            var oSummaryData = JSON.parse(oData.chatBotUsageSummary);
                            oSummaryData = this.fnGetSummaryDataFormatted(oSummaryData);

                            var oChatbotSummaryModel = new JSONModel(oSummaryData);
                            this.getView().setModel(oChatbotSummaryModel, "ChatbotSummaryModel");
                            this.getView().setBusy(false);
                        }
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            fnGetSummaryDataFormatted: function (oSummaryData) {
                // Format and set Mostly used and Never Used Skills Intents Data
                oSummaryData.MostUsedSkills = oSummaryData.skills.slice(0, 5);
                oSummaryData.MostUsedIntents = oSummaryData.intents.slice(0, 10);
                oSummaryData.NeverUsedSkills = this.fnGetNeverUsedItems(oSummaryData.skills);
                oSummaryData.NeverUsedIntents = this.fnGetNeverUsedItems(oSummaryData.intents);

                // Format and Set values for Overview fields
                oSummaryData.MessagesPerConversation = (oSummaryData.messagesReceived / oSummaryData.conversations).toFixed(2);
                oSummaryData.conversations = oSummaryData.conversations > 999 ? ((oSummaryData.conversations / 1000).toFixed(2)) + "k" : oSummaryData.conversations;
                oSummaryData.participants = oSummaryData.participants > 999 ? ((oSummaryData.participants / 1000).toFixed(2)) + "k" : oSummaryData.participants;
                oSummaryData.messagesReceived = oSummaryData.messagesReceived > 999 ? ((oSummaryData.messagesReceived / 1000).toFixed(2)) + "k" : oSummaryData.messagesReceived;

                // Set overview fields counts and Status indicators
                oSummaryData.conversationIndicator = -10;
                oSummaryData.participantsIndicator = "+" + 23;
                oSummaryData.messagesReceivedIndicator = "+" + 125;
                oSummaryData.MessagesPerConversationIndicator = -123;

                return oSummaryData;
            },

            fnGetNeverUsedItems: function (aData) {
                return aData.filter(function (oItem) {
                    return oItem.count <= 2;
                });
            },

            fnSetIndicatorsState: function (iCount) {
                iCount = Number(iCount);
                return iCount > 0 ? "Success" : "Warning";
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
                    oToDate = this.getView().byId("idDateRangeSelector").getSecondDateValue();

                this.getView().getModel("LocalViewModel").setProperty("/FromDate", oFromDate);
                this.getView().getModel("LocalViewModel").setProperty("/ToDate", oToDate);
                this.getView().getModel("LocalViewModel").refresh();

                this.fnGetChatBotData();
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