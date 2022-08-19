/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* searchResult controller */
sap.ui.define([
	"ui/s2p/mm/requisition/maintain/s1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox',
	"ui/s2p/mm/requisition/maintain/s1/model/formatter",
	"ui/s2p/mm/requisition/maintain/s1/misc/EntityConstants",
	'sap/m/MessageToast'
], function(BaseController, JSONModel, MessageBox, formatter, MessageToast, EntityConstants) {
	"use strict";

	return BaseController.extend("ui.s2p.mm.requisition.maintain.s1.controller.SearchResults", {

		onInit: function() {
			this.getRouter().getRoute("SearchResults").attachPatternMatched(this.getAtribute, this);
			this.oSplitContainer = this.getView().byId("mySplitContainer");
			this.oSplitContainer.setShowSecondaryContent(false);
			this.filters = {};
			this.selectedValue = "";
			this._oModel = this.getAppModel();
			this.selItems = "";
			this.genInfo();
			this.bDescending = true;
		},
		genInfo: function() {
			this._oModel.read("/" + this.dataManager.EntityConstants.getEntityName('headerEntity'), {
				urlParameters: {
					"$filter": "IsActiveEntity eq false",
					"$expand": this.dataManager.EntityConstants.getEntityNavigationName('item')
				},
				success: jQuery.proxy(this.showGenItems, this),
				error: jQuery.proxy(this.serviceFail, this)

			});
		},
		showGenItems: function(data) {
			var oJSModelCart = new sap.ui.model.json.JSONModel(data);
			this.getView().byId("btnCart").setModel(oJSModelCart);
			this.getView().byId("btnCart").bindElement("/results/0");
			this.getView().setBusy(false);

		},
		// Geting url passing values
		getAtribute: function(oEvent) {
			var Svalue = this.getSearchterm();
			if (Svalue !== "false") {
				this.getView().byId("searchItems").setValue(Svalue);
				this.bindResults();
			}
			this.setHeaderDraftKey(oEvent.getParameter("arguments").Draftkey);
			this.setPurchaseRequisition(oEvent.getParameter("arguments").PurchaseRequisition);

		},
		//Back button
		backtoCatalog: function() {
			window.history.back();
		},
		// Search and Filter related Functions
		// Search input press
		bindResults: function() {
			var searchTerm = this.getView().byId("searchItems").getValue();
			if (searchTerm) {
				var searchMain = "ProductDescription eq '" + searchTerm + "'";
				var filtermain = "ValueDesc eq '" + searchTerm + "'";
				this.searchResultBind(searchMain);
				this.filterBind(filtermain);
			}

		},
		// Search Binding
		searchResultBind: function(searchTerm) {
			this.getView().setBusy(true);
			var mparameters = this.getServiceCallParameter(this.onSuccessSearch, this.serviceFail);
			this.dataManager.searchResultsBinding(mparameters, searchTerm);
		},
		//If search results service error
		onServiceSearchError: function() {
			this.errorServiceFail();
		},
		// search on success and result find or not 
		onSuccessSearch: function(data) {
			this.getView().setBusy(false);
			if (data.results[0]) {
				this.destroyContent("middleContent");
				this.createFragment("ui.s2p.mm.requisition.maintain.s1.view.SearchResults", "middleContent");
				var jsonModel = new sap.ui.model.json.JSONModel(data);
				this.getView().byId("middleContent").setModel(jsonModel);
				this.destroyContent("NoSearchresult");
				this.destroyContent("bodyContent");
				this.getView().byId("filterBtn").removeStyleClass("displayNone");
				var totalResults = data.results.length;
				if (totalResults > 1) {
					sap.ui.getCore().byId("totalresult").setText(totalResults + " " + this.getResourceBundle().getText("RESULTSTEXT"));
				} else {
					sap.ui.getCore().byId("totalresult").setText(totalResults + " " + this.getResourceBundle().getText("RESULTSTEXT2"));
				}
			} else {
				this.destroyContent("middleContent");
				this.destroyContent("NoSearchresult");
				this.destroyContent("bodyContent");
				this.createFragment("ui.s2p.mm.requisition.maintain.s1.view.NoserachResult", "NoSearchresult");
				this.createFragment("ui.s2p.mm.requisition.maintain.s1.view.CatalogList", "bodyContent");
				this.bindCatalog("bodyContent");
				this.getView().byId("filterBtn").removeStyleClass("filterposioning").addStyleClass("displayNone");
				this.oSplitContainer.setShowSecondaryContent(false);
			}
			this.count = data.results.length;

		},

		//Filter operations
		filterBind: function(filterTerm) {
			var mparameters = this.getServiceCallParameter(this.onSuccessFilter, this.serviceFail);
			this.dataManager.filterResultsBinding(mparameters, filterTerm);
		},
		// Filter service success 
		onSuccessFilter: function(data) {
			this.removeRawData(data);
			var templateData = this.clone(data);
			this.saveFilterTemplate(templateData);
			var datalength = data.results.length;
			for (var i = 0; i < datalength; i++) {
				if (data.results[i].PropertyCategory == "Price Range") {
					data.results[i].PropertyCategory = "Z-Price Range";
				}
			}
			var jsonModelfilter = new sap.ui.model.json.JSONModel(data);
			this.getView().byId("FilterList").setModel(jsonModelfilter);
		},
		removeRawData: function(data) {
			for (var i = data.results.length - 1; i >= 0; i--) {
				if (data.results[i].PropertyCategory === "RAW_PRICE") {
					data.results.splice(i, 1);
				}
			}

		},

		//	Cloning Filter result data
		clone: function(obj) {
			var copy;
			// Handle the 3 simple types, and null or undefined
			if (null == obj || "object" != typeof obj) {
				return obj;
			}
			// Handle Date
			if (obj instanceof Date) {
				copy = new Date();
				copy.setTime(obj.getTime());
				return copy;
			}
			// Handle Array
			if (obj instanceof Array) {
				copy = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					copy[i] = this.clone(obj[i]);
				}
				return copy;
			}
			// Handle Object
			if (obj instanceof Object) {
				copy = {};
				for (var attr in obj) {
					if (obj.hasOwnProperty(attr)) {
						copy[attr] = this.clone(obj[attr]);
					}
				}
				return copy;
			}
			throw new Error("Unable to copy obj! Its type isn't supported.");
		},
		// Making all TotalHits to empty in first filter
		saveFilterTemplate: function(templateData) {
			for (var i = 0; i < templateData.results.length; i++) {
				templateData.results[i].TotalHits = "";
			}
			// firstFilterData without Totalhites
			this.firstFilterData = templateData;
		},
		// on Selecting filter element
		onSelectionFilter: function(oEvt) {
			var oList = oEvt.getSource();
			var aContexts = oList.getSelectedContexts(true);
			for (var i = 0; i < aContexts.length; i++) {
				this.selectedkey = aContexts[i].getObject().PropertyCategory;
				this.selectedValue = aContexts[i].getObject().PropertyValue;
				this.pushToFilterValues(this.selectedkey, this.selectedValue);
			}
			var filterURL = this.formQueryString();
			var searchContent = this.getView().byId("searchItems").getValue();
			var finalFilterURL = "";
			if (filterURL !== "") {
				// Making filter url
				var searchValue = "DESCRIPTION" + "@@@" + searchContent;
				finalFilterURL = this.appendToQueryString(searchValue) + filterURL;
				finalFilterURL = finalFilterURL.replace("Z-Price Range", "Price Range");
				this.searchResultBind(finalFilterURL);
				this.filterLaterBind(finalFilterURL);
			} else {
				this.bindResults();
			}
			this.filters = {};
		},
		// Pushing Filter selected values    
		pushToFilterValues: function(key, value) {
			if (this.filters[key] === undefined) {
				var values = [];
				values.push(value);
				this.filters[key] = values;
			} else {
				values = this.filters[key];
				if (values.indexOf(value) === -1) {
					values.push(value);
				}
				this.filters[key] = values;
			}
		},
		// forming Query filter url string 
		formQueryString: function() {
			var urlString = "";
			for (var key in this.filters) {
				var fieldString = key;
				var filterArray = this.filters[key];
				for (var i = 0; i < filterArray.length; i++) {
					fieldString = fieldString + "@@@" + filterArray[i];
				}
				urlString = urlString + " or " + this.appendToQueryString(fieldString);
			}
			return urlString;
		},

		appendToQueryString: function(fieldString) {
			return " OpnCtlgFilterValue eq '" + fieldString + "'";
		},

		filterLaterBind: function(filterTerm) {
			var mparameters = this.getServiceCallParameter(this.onSuccessAfterFilter, this.serviceFail);
			this.dataManager.filterResultsBinding(mparameters, filterTerm);
		},

		onSuccessAfterFilter: function(data) {
			this.getView().byId("filterBtn").addStyleClass("filterposioning").removeStyleClass("displayNone");
			this.oSplitContainer.setShowSecondaryContent(true);
			var processedData = this.processFilter(data);
			var datalength = processedData.results.length;
			for (var i = 0; i < datalength; i++) {
				if (processedData.results[i].PropertyCategory === "Price Range") {
					processedData.results[i].PropertyCategory = "Z-Price Range";
				}
			}
			this.getView().byId("FilterList").getModel().setData(processedData);
		},
		processFilter: function(newData) {
			var oldData = this.clone(this.firstFilterData);
			for (var i = 0; i < newData.results.length; i++) {
				for (var j = 0; j < oldData.results.length; j++) {
					if (oldData.results[j].PropertyCategory === newData.results[i].PropertyCategory &&
						oldData.results[j].ValueDesc === newData.results[i].ValueDesc) {
						oldData.results[j].TotalHits = newData.results[i].TotalHits;
					}
				}
			}
			return oldData;
		},

		// Catalog Related functionalities
		showCatalogList: function() {
			this.destroyContent("bodyContent");
			this.createFragment("ui.s2p.mm.requisition.maintain.s1.view.CatalogList", "bodyContent");
			this.bindCatalog("bodyContent");
		},
		showGridCatalog: function() {
			this.destroyContent("bodyContent");
			this.createFragment("ui.s2p.mm.requisition.maintain.s1.view.CatalogGrid", "bodyContent");
			this.bindCatalog("bodyContent");
		},
		CatalogWindowImg: function(oEvent) {
			var ServiceId = oEvent.getSource().getParent().getAggregation("content")[1].getProperty("text");
			this.catalogPress(ServiceId);
		},
		onPressText: function(oEvent) {
			var ServiceId = oEvent.getSource().getText();
			this.catalogPress(ServiceId);
		},
		catalogPress: function(ServiceId) {
			var parentKey = this.getHeaderDraftKey();
			var mparameters = this.getServiceCallParameter(this.onSuccessGetUrl, this.serviceFail);
			this.dataManager.catalogBind(mparameters, ServiceId, parentKey);
		},
		onSuccessGetUrl: function(data) {
			var that = this;
			this.popupWindow = window.open('', 'catalogWindow', 'height=800,width=1100,resizable=yes,scrollbars=1');
			if (this.popupWindow.location == "about:blank") {
				this.popupWindow.location = data.ServiceURL;
			}
			this.popupWindow.focus();
			this.serviceURL = data.ServiceURL;
			var pollURL = "/PollingSet(EventId='" + data.EventId + "')";

			var mParameters = {
				"success": jQuery.proxy(that.onSuccesspolling, this),
				"error": jQuery.proxy(that.errorServiceFail, this)
			};
			that.oModel.read(pollURL, mParameters);
		},
		onSuccesspolling: function(data) {
			var that = this;
			if (data.Status === "001") {
				var pollURL = "/PollingSet(EventId='" + data.EventId + "')";

				var mParameters = {
					"success": jQuery.proxy(this.onSuccesspolling, this),
					"error": jQuery.proxy(this.errorServiceFail, this)
				};
				setTimeout(function() {
					that.oModel.read(pollURL, mParameters);
				}, 2000);
			}
			if (data.Status === "002" || data.Status === "003") {
				sap.m.MessageToast.show(this.getResourceBundle().getText("Failure"));
			}
			if (data.Status === "004") {
				sap.m.MessageToast.show(this.getResourceBundle().getText("Success"));
				this.refreshMinicart();
			}
		},
		onSortReview: function() {
			var tableBinding = sap.ui.getCore().byId("SearchResultTable").getBinding("items");
			var list = tableBinding.oList;
			//console.log(tableBinding);
			if (this.bDescending) {
				this.bDescending = false;
			} else {
				this.bDescending = true;
			}
			for (var key in list) {
				list[key].OpnCtlgPrcComCurrency = parseFloat(list[key].OpnCtlgPrcComCurrency);
			}
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("OpnCtlgPrcComCurrency", this.bDescending));
			tableBinding.sort(aSorters);
		},

		goToFreetext: function() {
			this.setSearchterm("false");
			var oSearchValue = this.getView().byId("searchItems").getValue();
			var purchaseRequisition = this.getPurchaseRequisition() ? this.getPurchaseRequisition() : this.dataManager.EntityConstants.DUMMY_PR_KEY;
			if (oSearchValue.length == 0) {
				oSearchValue = " ";
			}

			this.getRouter().navTo("Freetext", {
				DraftKey: this.getHeaderDraftKey(),
				PurchaseRequisition: purchaseRequisition,
				SearchValue: oSearchValue

			});
			if (this._oPopover) {
				this._oPopover.destroy();
				this._oPopover.destroyContent();
				this._oPopover = null;
			}
		},
		onExit: function() {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
			if (this._oPopoverFilter) {
				this._oPopoverFilter.destroy();
			}
		},

		ProductDetails: function(oEvent) {
			this.setSearchterm("false");
			var oPath = oEvent.getSource().getBindingContext().getPath().substr(9);
			var oProduct = oEvent.getSource().getBindingContext().getModel().getData().results[oPath].OpnCtlgItemID;
			var language = oEvent.getSource().getBindingContext().getModel().getData().results[oPath].Language;
			var draftKey = this.getHeaderDraftKey();
			var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();
			if (!language) {
				language = sCurrentLocale;
			}
			var PR = this.getPurchaseRequisition() ? this.getPurchaseRequisition() : this.dataManager.EntityConstants.DUMMY_PR_KEY;
			this.getRouter().navTo("ProductDetails", {
				OpnCtlgItemID: oProduct,
				view: "search",
				Language: language,
				DraftKey: draftKey,
				PurchaseRequisition: PR,
				free: "0"
			});
			if (this._oPopover) {
				this._oPopover.destroy();
				this._oPopover.destroyContent();
				this._oPopover = null;
			}
		},

		closeSecondaryContent: function(oEvent) {
			var oSplitContainer = this.getView().byId("mySplitContainer");
			oSplitContainer.setShowSecondaryContent(!oSplitContainer.getShowSecondaryContent());
			var oFbtn = this.getView().byId("filterBtn");
			oFbtn.toggleStyleClass("filterposioning");
			if (oSplitContainer.getShowSecondaryContent()) {
				oEvent.getSource().setType("Emphasized");
			} else {
				oEvent.getSource().setType("Default");
			}
		},
		deleteItem: function(oEvent) {
			var itemKey = oEvent.getSource().getBindingContext().getObject().PurReqnItemDraftUUID;
			this.oModel.remove(
				"/" + this.dataManager.EntityConstants.getEntityName('itemEntity') +
				"(PurchaseRequisition='',PurchaseRequisitionItem='00000',PurReqnItemDraftUUID=guid'" +
				itemKey + "')", {
					batchGroupId: 1,
					changeSetId: 1,
					success: jQuery.proxy(this.deleteSuccess, this),
					error: jQuery.proxy(this.serviceFail, this)
				});
		},

		deleteSuccess: function() {
			sap.m.MessageToast.show(this.getResourceBundle().getText("delete"));
		},

		successhandleOrderCartPress: function() {
			var that = this;
			MessageBox.show(this.getResourceBundle().getText("MSG_SuccessOrder"), {
				icon: MessageBox.Icon.INFORMATION,
				title: that.getResourceBundle().getText("orderCart"),
				actions: [that.getResourceBundle().getText("ok")],
				onClose: function(oAction) {
					if (oAction === that.getResourceBundle().getText("ok")) {
						this.dataManager.createNewDraft(this.getServiceCallParameter(this.getDraftSuccessCallback, this.serviceFail));
						if (that._oPopover) {
							that._oPopover.destroy();
							that._oPopover.destroyContent();
							that._oPopover = null;
						}
						that.getRouter().navTo("Search");
					} else {
						//do nothing.
					}
				},
				initialFocus: that.getResourceBundle().getText("ok")
			});
		},

		addToCart: function(oEvent) {
			var path = oEvent.getSource().getBindingContext().getPath().substr(9);
			var reqQuantity = oEvent.getSource().getBindingContext().getModel().oData.results[path].OpnCtlgMinOrderQuantity;
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var sMessage = this.getResourceBundle().getText("MESSAGE_ERROR_ADDTOCART");
			//var id= oEvent.getSource().getId();
			var target = "/" + reqQuantity + "/value";
			var deliveryDateMessage = new sap.ui.core.message.Message({
				message: sMessage,
				type: sap.ui.core.MessageType.Error,
				target: target,
				processor: oMessageProcessor
			});
			oMessageManager.registerMessageProcessor(oMessageProcessor);
			if (reqQuantity.match(/^[0-9]{1,10}(\.\d{3})?$/i)) {
				var oData = {
					RequestedQuantity: reqQuantity,
					PurReqnDraftUUID: this.getHeaderDraftKey(),
					PurReqnSSPCrossCatalogItem: oEvent.getSource().getBindingContext().getObject().OpnCtlgItemID
				};
				this.getView().setBusy(true);
				var mParameters = this.getServiceCallParameter(this.successhandleAddtoCartPress, this.serviceFail);
				this.dataManager.createNewItem(mParameters, this.getHeaderDraftKey(), this.getPurchaseRequisition(), oData);
				reqQuantity.setValueState(sap.ui.core.ValueState.None);
				oMessageManager.removeAllMessages();
				return true;

			} else {
				oMessageManager.addMessages(deliveryDateMessage);
				oEvent.getSource().getParent().getParent().getAggregation("items")[0].getAggregation("items")[0].setValueState(sap.ui.core.ValueState
					.Error);
				return false;
			}
			// var path = oEvent.getSource().getBindingContext().getPath().substr(9);
			// var reqQuantity = oEvent.getSource().getBindingContext().getModel().oData.results[path].OpnCtlgMinOrderQuantity;
			// if (!reqQuantity) {
			// 	reqQuantity = "1";
			// }
			// var oData = {
			// 	RequestedQuantity: reqQuantity,
			// 	PurReqnDraftUUID: this.getHeaderDraftKey(),
			// 	PurReqnSSPCrossCatalogItem: oEvent.getSource().getBindingContext().getObject().OpnCtlgItemID
			// };
			// this.getView().setBusy(true);
			// var mParameters = this.getServiceCallParameter(this.successhandleAddtoCartPress, this.serviceFail);
			// this.dataManager.createNewItem(mParameters, this.getHeaderDraftKey(), this.getPurchaseRequisition(), oData);
		},
		successhandleAddtoCartPress: function() {
			sap.m.MessageToast.show(this.getResourceBundle().getText("AddToCart"));
			this.genInfo();

		},
		onBack: function() {
			window.history.back();
		}

	});
});