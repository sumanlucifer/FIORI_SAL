/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"ui/s2p/mm/requisition/maintain/s1/controller/BaseController",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox'
], function(BaseController, Object, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("ui.s2p.mm.requisition.maintain.s1.controller.Common", {

		constructor: function(oParentView, oResourceBundle) {
			this._oParentView = oParentView;
			this._oResourceBundle = oResourceBundle;
			this._oGlobalModel = this._oParentView.getController().getAppModel();
		},

		genInfo: function() {
			this._oGlobalModel.read("/" + this.getEntityName('headerEntity'), {
				urlParameters: {
					"$filter": "IsActiveEntity eq false",
					"$expand": this.getEntityNavigationName('item')
				},
				success: jQuery.proxy(this.showGenItems, this),
				error: jQuery.proxy(this.errorServiceFail, this)

			});
		},
		showGenItems: function(data) {
			var that = this;
			if (data.results[0]) {
				var draftId = data.results[0].PurReqnDraftUUID;
				var userId = data.results[0].Employee;
				this.setAppkey(draftId, userId);
				MessageBox.show("A Draft Purchase Requisition already exist for the user", {
					id: "draftMessageBox",
					icon: MessageBox.Icon.INFORMATION,
					title: "Draft ",
					actions: ["Continue", "Discard"],
					onClose: function(oAction) {
						if (oAction === "Continue") {
							var oJSModelCart = new sap.ui.model.json.JSONModel(data);
							that._oParentView.byId("pageSearch").setModel(oJSModelCart);
							that._oParentView.byId("pageSearch").bindElement("/results/0");

						} else {

							that.deleteHeaderDraft();

						}
						that._oParentView.setVisible(true);
					},
					initialFocus: "Continue"
				});

			} else {
				that._oParentView.setVisible(true);
				this.createNewDraft();
			}
		},
		errorServiceFail: function(oError) {
			var sMessage = "";
			var sDetails = "";
			var oDetails = null;
			if (oError && oError.getParameters) {
				var mParameters = oError.getParameters();
				if (mParameters) {
					if (mParameters.response) {
						sMessage = mParameters.message;
						oDetails = jQuery.parseJSON(mParameters.response.body);
						sDetails = oDetails.error.message.value;
					}
				}
			} else {
				sMessage = this._oResourceBundle.getText("MESSAGE_ERROR_OCCURED");
				sDetails = "";
			}
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: sMessage,
				details: sDetails
			});
		},

		deleteHeaderDraft: function() {

			this._oGlobalModel.remove(
				"/I_Purchaserequisition_Wd(PurchaseRequisition='',PurReqnDraftUUID=guid'" + this.getAppkey() + "')", {
					batchGroupId: 1,
					changeSetId: 1,
					success: jQuery.proxy(this.onSuccessDeleteHeader, this),
					error: jQuery.proxy(this.errorServiceFail, this)
				});

		},
		onSuccessDeleteHeader: function(data) {

			this.createNewDraft();
		},

		createNewDraft: function() {
			var oData = {};

			this._oGlobalModel.createEntry("I_Purchaserequisition_Wd", {
				batchGroupId: "neverSubmit",
				success: jQuery.proxy(this.onSuccessCreateHeaderDraft, this),
				error: jQuery.proxy(this.errorServiceFail, this)
			});
		},

		onSuccessCreateHeaderDraft: function(data) {

			var draftId = data.PurReqnDraftUUID;
			var userId = data.Employee;
			this.setAppkey(draftId, userId);
			this.getHeaderNewDraft();
			// TODO: keep Draft UUID
		},

		getHeaderNewDraft: function() {

			this._oGlobalModel.read("/I_Purchaserequisition_Wd", {
				urlParameters: {
					"$filter": "IsActiveEntity eq false"
				},
				success: jQuery.proxy(this.onSuccessNewGetHeader, this),
				error: jQuery.proxy(this.errorServiceFail, this)

			});
		},
		onSuccessNewGetHeader: function(data) {
			var draftId = data.results[0].PurReqnDraftUUID;
			var userId = data.results[0].Employee;
			this.setAppkey(draftId, userId);
			var oJSModelCart = new sap.ui.model.json.JSONModel(data);
			this._oParentView.byId("empName").setModel(oJSModelCart);
			this._oParentView.byId("empName").bindElement("/results/0");
		}

	});

});