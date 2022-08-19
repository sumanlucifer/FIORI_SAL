/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
/*global history*/
sap.ui.define([
	"ui/s2p/mm/requisition/maintain/s1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	"ui/s2p/mm/requisition/maintain/s1/model/formatter"
], function(BaseController, JSONModel, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("ui.s2p.mm.requisition.maintain.s1.controller.PurReqList", {

		onInit: function() {
			this.getView().setVisible(false);
			this.oModel = this.getAppModel();
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();
			this._oRouter.getRoute("PurReqList").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function() {
			if (this.getOwnerComponent().getComponentData().changingSourcePageAllowed) {
				this.setSourcePage("PurReqList");
			}

			if ((this.getPurchaseRequisition() === "")) {
				this.getView().setVisible(true);
				this.getView().getModel().refresh();
			} else {
				if (this.getSourcePage() == "") { // case goods receipt back button press
					this.setSourcePage("CartOverview");
				}

				this.navToSourcePage();
			}

		},

		onNavBack: function() {
			window.history.go(-2);
		},

		fnNavigateItemList: function(oEvent) {
			if (this._oHistory) {
				this._oHistory.destroy();
			}
			var prNumber = oEvent.getSource().getBindingContext().getProperty("PurchaseRequisition");
			this.setPurchaseRequisition(prNumber);
			//this.editDraft();
			this.checkDraft(prNumber);

		},

		fnNavigateEditItemList: function(oEvent) {

			var prNumber = this.getView().byId("idRequisitionItemsTable").getSelectedItem().getBindingContext().getObject().PurchaseRequisition;
			this.setPurchaseRequisition(prNumber);
			//this.editDraft(prNumber);
			this.checkDraft(prNumber);

		},

		fnNavigateReturnGR: function(oEvent) {
			var vPRNumber = this.getView().byId("idRequisitionItemsTable").getSelectedItem().getBindingContext().getObject().PurchaseRequisition;
			var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "GoodsReceipt",
					action: "return"
				},
				params: {
					PurchaseRequisition: [vPRNumber]
				}
			});
		},

		fnNavigateConfirmGR: function(oEvent) {
			var vPRNumber = this.getView().byId("idRequisitionItemsTable").getSelectedItem().getBindingContext().getObject().PurchaseRequisition;
			var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "GoodsReceipt",
					action: "create"
				},
				params: {
					PurchaseRequisition: [vPRNumber]
				}
			});
		},

		checkDraft: function(prNo) {

			this.dataManager.getCurrentDraft(this.getServiceCallParameter(this.saveDraftUID, this.serviceFail), prNo);

		},
		saveDraftUID: function(data) {
			var that = this;
			var prData = data.results ? data.results[0] : data;
			var draftKey;
			// Check if backend is returning some results and only then get the existing draft
			if (data.results.length > 0) {
				var draftKey = this.getDraftKey(prData, true);
			}
			if (draftKey) {
				MessageBox.show(this.getResourceBundle().getText("draftMessage"), {
					icon: MessageBox.Icon.INFORMATION,
					title: that.getResourceBundle().getText("draft"),
					actions: [that.getResourceBundle().getText("continue"), that.getResourceBundle().getText("discard")],
					onClose: function(oAction) {
						if (oAction === that.getResourceBundle().getText("continue")) {
							that.getRouter().navTo("CartOverview", {
								DraftKey: draftKey,
								PurchaseRequisition: prData.PurchaseRequisition
							});
						} else {
							that.deleteDraft(draftKey);
						}

					},
					initialFocus: that.getResourceBundle().getText("continue")
				});
			} else

			{
				this.editDraft();
			}

			//that.deleteDraft();
		},
		deleteDraft: function(draftKey) {
			this.dataManager.deleteDraft(this.getServiceCallParameter(this.editDraft, this.serviceFail), draftKey, this.getPurchaseRequisition());
		},
		editDraft: function() {
			var draftKey = '00000000-0000-0000-0000-000000000000';

			this.dataManager.editDocument(this.getServiceCallParameter(this.getDraftId, this.errorServiceFail), draftKey, this.getPurchaseRequisition());

		},

		getDraftId: function(data) {
			var prData = data.results ? data.results[0] : data;
			var draftKey = this.getDraftKey(prData, true);
			this.setHeaderDraftKey(draftKey);
			this.setUserID(prData.Employee);
			this.getRouter().navTo("CartOverview", {
				DraftKey: this.getHeaderDraftKey(),
				PurchaseRequisition: this.getPurchaseRequisition()
			});

		},
		checkDelete: function(data) {
			var that = this;
			this.getView().setBusy(false);
			if (data.Delete_ac) {
				var PRNumber = this.getView().byId("idRequisitionItemsTable").getSelectedItem().getBindingContext().getObject().PurchaseRequisition;
				MessageBox.show(this.getResourceBundle().getText("deleteCart"), {
					icon: MessageBox.Icon.INFORMATION,
					title: that.getResourceBundle().getText("overviewDelete"),
					actions: [that.getResourceBundle().getText("continue"), that.getResourceBundle().getText("cancel")],
					onClose: function(oAction) {
						if (oAction === that.getResourceBundle().getText("continue")) {
							that.onDeletePurReq(PRNumber);
						}
					},
					initialFocus: that.getResourceBundle().getText("continue")
				});
			} else {
				MessageBox.show(this.getResourceBundle().getText("deleteFailed"), {
					icon: MessageBox.Icon.INFORMATION,
					title: that.getResourceBundle().getText("overviewDelete"),
					actions: [that.getResourceBundle().getText("ok")],
					onClose: function(oAction) {
						if (oAction === that.getResourceBundle().getText("ok")) {
							// do nothing
						}
					},
					initialFocus: that.getResourceBundle().getText("ok")
				});
			}
		},

		onPressDeleteRequisition: function() {
			this.getView().setBusy(true);
			this.dataManager.getHeader(this.getServiceCallParameter(this.checkDelete, this.serviceFail), "00000000-0000-0000-0000-000000000000",
				this.getView().byId("idRequisitionItemsTable").getSelectedItem().getBindingContext().getObject().PurchaseRequisition);

		},
		onDeletePurReq: function(PRNumber) {
			var sUrlPR = "/sap/opu/odata/sap/MMPUR_REQ_SSP_MAINTAIN_SRV/";
			var values = [PRNumber, "guid'00000000-0000-0000-0000-000000000000'"];
			var keys = this.entityConstants.getKeys("headerEntity");
			var valueObject = {};
			for (var j = 0; j < keys.length; j++) {
				valueObject[keys[j]] = values[j];
			}
			var url = "";
			url = url + keys[0] + "='" + valueObject[keys[0]] + "'";
			for (var i = 1; i < keys.length; i++) {
				url = url + ",";
				if (valueObject[keys[i]].startsWith("guid")) {
					url = url + keys[i] + "=" + valueObject[keys[i]];
				} else {

					url = url + keys[i] + "='" + valueObject[keys[i]] + "'";
				}
			}
			var sUrlPRHeader = this.entityConstants.getEntityName('headerEntity') + "(" + url + ")";
			var oModel = new sap.ui.model.odata.ODataModel(sUrlPR);
			oModel.remove(
				sUrlPRHeader, {
					batchGroupId: 1,
					changeSetId: 1,
					success: jQuery.proxy(this.onSuccessDelete, this)
				});
		},
		onPressCreate: function() {
			this.getRouter().navTo("Search");
		},

		onSuccessDelete: function() {
			var sSuccessMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("MSG_SUCCESS_DELETE");
			sap.m.MessageToast.show(sSuccessMsg, {
				duration: 2000
			});
			this.getView().byId("idSmartTablePRList").getModel().refresh();
		},

		handlePRFactSheetNavigation: function(oEvent) {
			var selectedLine = oEvent.getSource().getBindingContext().getObject();
			var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "PurchaseRequisition",
					action: "displayFactSheet"
				},
				params: {
					PurchaseRequisition: [selectedLine.PurchaseRequisition]
				}
			});
		},

		onSearchPRList: function() {
			var oTable = this.getView().byId("idSmartTablePRList");
			var oBinding = oTable.getTable().getBinding("items");
			//var selectionFields = "PurchaseRequisition,Material,PurReqnDescription,NumberOfItems,PurReqnItemLifeCycleStatus,CreationDate,TotalNetAmount,Currency";
			var oSmartFilterBar = this.byId("idSmartFilterPRList");
			var aSmartFilters = oSmartFilterBar.getFilters();
			var oParameters = oSmartFilterBar.getParameters();

			oBinding.sCustomParams = oBinding.getModel().createCustomParams({
				custom: {
					search: oParameters.custom.search
				}
			});

			var timeFrom = this.byId("timeRangeFilter").getDateValue();
			var timeTo = this.byId("timeRangeFilter").getSecondDateValue();

			if (timeFrom !== null && timeTo !== null) {
				var oSearchfilter = new sap.ui.model.Filter("CreationDate", sap.ui.model.FilterOperator.BT, timeFrom, timeTo);
				aSmartFilters.push(oSearchfilter);
			}
			oBinding.filter(aSmartFilters, oParameters);
		},
		// validation for date picker field
		checkDateNow: function(oEvent) {
			var bValid = oEvent.getParameter("valid");

			var oDRS = oEvent.getSource();
			if (bValid) {
				oDRS.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDRS.setValueState(sap.ui.core.ValueState.Error);
				oDRS.setValueStateText(this.getResourceBundle().getText("dateRangeError"));
			}

		},

		onPressRow: function() {
			if (this.getView().byId("idRequisitionItemsTable").getSelectedItem()) {
				//var sDeleteText = this.getResourceBundle().getText("deleted");
				//var sPRStatus = this.getView().byId("idRequisitionItemsTable").getSelectedItem().getBindingContext().getObject().PurReqnLifeCycleStatusName;
				var sPRStatusCode = this.getView().byId("idRequisitionItemsTable").getSelectedItem().getBindingContext().getObject().PurReqnLifeCycleStatus;
				if (sPRStatusCode !== 'X') {
					this.byId("deleteReqLinkId").setEnabled(true);
				} else {
					this.byId("deleteReqLinkId").setEnabled(false);
				}
				if (sPRStatusCode === 'G') {
					this.byId("ReturnGRLinkId").setEnabled(true);
					this.byId("deleteReqLinkId").setEnabled(false); //Disabling the delete button for a PR with Follow on status

				} else {
					this.byId("ReturnGRLinkId").setEnabled(false);
				}
				// Confirm Good reciept status
				if (sPRStatusCode === 'C') {
					this.byId("ConfirmGRLinkId").setEnabled(true);
					this.byId("deleteReqLinkId").setEnabled(false); //Disabling the delete button for a PR with Follow on status

				} else {
					this.byId("ConfirmGRLinkId").setEnabled(false);
				}
				
				//Disabling the delete button for a PR with Follow on status
				if (sPRStatusCode === 'B') {
					this.byId("deleteReqLinkId").setEnabled(false);
				}
			}
		},
		handleStatusPress: function(oEvent) {
			var that = this;
			this.getView().byId("page").setBusy(true);
			this.oButton = oEvent.getSource();
			this.PRNumber = oEvent.getSource().getBindingContext().getObject().PurchaseRequisition;
			var oModel = that.getAppModel();
			if (this.PRNumber) {
				oModel.read("/C_Sspprmaint_Hdr", {
					urlParameters: {
						"$filter": "IsActiveEntity eq true and PurchaseRequisition eq '" + this.PRNumber + "'",
						"$expand": "to_Purchaserequisitionitem_Wd"
					},
					success: jQuery.proxy(this.itemssSuccessHandler, this),
					error: jQuery.proxy(this.statusErrorHandler, this)
				});
			}

		},
		itemssSuccessHandler: function(data) {

			var oDataItems = data.results[0].to_Purchaserequisitionitem_Wd;
			this.oModelPf2 = new sap.ui.model.json.JSONModel();
			var n = sap.ui.getCore().byId("navCon");
			if (n) {
				n.to("p1");
			}
			this.oModelPf2.setData(oDataItems);
			if (!this._oHistory) {
				this._oHistory = sap.ui.xmlfragment("ui.s2p.mm.requisition.maintain.s1.fragment.PRHistory", this);
				this.getView().addDependent(this._oHistory);
			}
			sap.ui.getCore().byId("itemsList").setModel(this.oModelPf2, "pf2");
			this.getView().byId("page").setBusy(false);
			this._oHistory.openBy(this.oButton);

		},
		handleNav: function(oEvent) {
			var navCon = sap.ui.getCore().byId("navCon");
			this.PRItemNumber = oEvent.getSource().getBindingContext("pf2").getObject().PurchaseRequisitionItem;
			this.itemText = oEvent.getSource().getTitle();
			this.statusData(this.PRNumber, this.PRItemNumber, navCon);

			// this.navCon.to("p2");

		},
		goBack: function() {
			var navCon = sap.ui.getCore().byId("navCon");
			navCon.back();
		},
		showStatus: function(oEvent) {
			this.getView().setBusy(true);
			var prNum = this.PRNumber;
			while (prNum.length < 10) {
				prNum = "0" + prNum;
			}
			var prItemNum = oEvent.getSource().getBindingContext().getObject().PurchaseRequisitionItem;
			if (!this._historyDialog) {
				this.statusData(prNum, prItemNum);
			} else {
				this._historyDialog.open();

				this.getView().setBusy(false);
			}

		},
		onItemSearch: function(oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("PurchaseRequisitionItemText", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = sap.ui.getCore().byId("itemsList");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
		}
	});
});