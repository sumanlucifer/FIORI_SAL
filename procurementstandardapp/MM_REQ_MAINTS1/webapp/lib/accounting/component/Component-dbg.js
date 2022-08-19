/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.core.Control");
sap.ui.core.UIComponent.extend("sap.ui.s2p.mm.lib.reuse.accounting.component.Component", {
	metadata: {
		manifest: "json",
		publicMethods: ["updateAccList"],
		properties: {
			sAccEntitySetName: "string", // mandatory 
			sAccEntityTypeName: "string", // mandatory 
			sAccBindingPathEntityType: "string", // mandatory in case if sCurrentView is "details"
			sAccBindingPathEntitySet: "string", // mandatory in case if sCurrentView is "list"
			oModel: "object", // optional in case of smart templates
			bEditMode: "boolean", // mandatory
			bAccDetailsAsPopup: "boolean", // optional , default value is false
			sCurrentView: "string", // either list or details , in case if bAccDetailsAsPopup is true then sCurrentView cannot be details in any case
			bShowListHeader: "boolean" // optional, default value is true

		},
		dependencies: {
			libs: ["sap.m", "sap.ui.s2p.mm.lib.reuse.accounting"],
			components: ["sap.ui.s2p.mm.lib.reuse.accounting.component"]
		},
		events: {
			detailNavigation: {},
			listNavigation: {}
		}
	},

	/******************************************************************************
	 * CreateContent
	 ******************************************************************************/

	createContent: function() {
		// XML
		if (this.oComponentData.sCurrentView === "list") {
			this.page = new sap.ui.view({
				viewName: "sap.ui.s2p.mm.lib.reuse.accounting.component.view.AccountAssignment",
				type: sap.ui.core.mvc.ViewType.XML
			});
			this._setShowHeader(this.oComponentData.bShowListHeader);
		} else {
			this.page = new sap.ui.view({
				viewName: "sap.ui.s2p.mm.lib.reuse.accounting.component.view.AccountAssignmentDetail",
				type: sap.ui.core.mvc.ViewType.XML
			});
		}
		this._setPopDisplay(this.oComponentData.bAccDetailsAsPopup);
		this._setEditMode(this.oComponentData.bEditMode);
		// this.setShowHeader(this.oComponentData.bShowListHeader);

		return this.page;

	},

	_setPopDisplay: function(mode) {
		this.page.getController()._setPopDisplay(mode);
	},

	_setEditMode: function(mode) {
		this.page.getController()._setEditMode(mode);
	},
	_setShowHeader: function(mode) {
		this.page.getController()._setShowHeader(mode);
	},
	updateAccList: function(successFunction, errorFunction, parentController) {
		// Set attribute label
		this.page.getController().updateAccList(successFunction, errorFunction, parentController);
	}

});
