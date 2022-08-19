/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
//jQuery.sap.declare("se.mi.plm.attachmenttestapp.Component");
var appId = "ui.s2p.mm.requisition.maintain.s1";
var formatteAppId = appId.replaceAll(".", "/");
var appPath = jQuery.sap.getModulePath(formatteAppId);

jQuery.sap.registerModulePath("sap.ui.s2p.mm.lib.reuse.accounting", appPath + "/resources/sap/ui/s2p/mm/lib/reuse/accounting");
jQuery.sap.registerModulePath("sap.se.mi.plm.lib.attachmentservice", appPath + "/resources/sap/se/mi/plm/lib/attachmentservice");

sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/model/resource/ResourceModel",
		"ui/s2p/mm/requisition/maintain/s1/model/models",
		"sap/ui/Device",
		"ui/s2p/mm/requisition/maintain/s1/controller/ErrorHandler",
		"ui/s2p/mm/requisition/maintain/s1/controller/BaseController",
		"ui/s2p/mm/requisition/maintain/s1/localService/mockserver",
        "ui/s2p/mm/requisition/maintain/s1/lib/attachService/library",
        "ui/s2p/mm/requisition/maintain/s1/lib/attachService/library-preload",
        "ui/s2p/mm/requisition/maintain/s1/lib/attachService/attachment/Component",
        "ui/s2p/mm/requisition/maintain/s1/lib/accounting/library",
        "ui/s2p/mm/requisition/maintain/s1/lib/accounting/library-preload",
        "ui/s2p/mm/requisition/maintain/s1/lib/accounting/component/Component"
		//	"sap/ca/scfld/md/ComponentBase"

	],

	function(UIComponent, ResourceModel, models, Device, ErrorHandler, BaseController, Mockserver, attachServiceLibrary, attachServiceLibPreload, atachServiceComponent, accountingLibrary, accountingLibPreload, accountingComponent) {
		"use strict";

		return UIComponent.extend("ui.s2p.mm.requisition.maintain.s1.Component", {

			metadata: {
				manifest: "json",
				config: {
					fullWidth: true
				}
			},
	// dummy
			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * In this function, the resource and application models are set and the router is initialized.
			 * @public
			 * @override
			 */
			init: function() {

				var productDetailsUrl = window.location;

				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);

				// initialize the error handler with the component
				this._oErrorHandler = new ErrorHandler(this);
				// this._oBaseController = new BaseController(this);
				// set the device model
				this.setModel(models.createDeviceModel(), "device");
				// set the FLP model
				this.setModel(models.createFLPModel(), "FLP");
				// create the views based on the url/hash
				this.getRouter().initialize();
				this.getComponentData().changingSourcePageAllowed = true;
				// var urlParameter = window.location.href.toString();
				// if(urlParameter.search("create") === 0) {
				var urlParameter = this.getComponentData();

				if (urlParameter.startupParameters["page"]) {
					this.getComponentData().sourcePage = urlParameter.startupParameters["page"][0];
					this.getComponentData().changingSourcePageAllowed = false;
				}

				if (urlParameter.startupParameters["draftKey"]) {
					this.getComponentData().draftKey = urlParameter.startupParameters["draftKey"][0];
				}
				if (urlParameter.startupParameters["DocumentNo"]) {
					this.getComponentData().purchaseRequisition = urlParameter.startupParameters["DocumentNo"][0];
				}
				if (urlParameter.startupParameters["DocumentItemNo"]) {
					this.getComponentData().purReqnItem = urlParameter.startupParameters["DocumentItemNo"][0];
				}
				if (urlParameter.startupParameters["DocumentItemDraft"]) {
					this.getComponentData().purReqnItemDraft = urlParameter.startupParameters["DocumentItemDraft"][0];
				}
				if (urlParameter.startupParameters["ItemPath"]) {
					this.getComponentData().PRitemPath = urlParameter.startupParameters["ItemPath"][0];
				}
				if (Mockserver.MockServerMode) {
					this.getRouter().navTo("Search");
				} else {
					window.decodeURIComponent(productDetailsUrl);
					productDetailsUrl += " ";

					if (productDetailsUrl.search("searchTerm") < 0) {
						if (urlParameter.startupParameters["mode"] == "create") {
							//	this._oBaseController.setKeys(urlParameter);
							this.getRouter().navTo("Search");
						} else {
							//	this._oBaseController.setKeys(urlParameter);
							this.getRouter().navTo("PurReqList");
						}
					}
				}
				// Adding user defaults in applications buttons
				var button = new sap.m.Button({
					text: this.getModel("i18n").getResourceBundle().getText("usersettings"),
					tooltip: this.getModel("i18n").getResourceBundle().getText("usersettings"),
					press: jQuery.proxy(function() {
						this.showSettingsDialog({});
					}, this)
				});
				button.addStyleClass("sapUshellActionItem");
				sap.ushell.services.AppConfiguration.addApplicationSettingsButtons([button]);

			},

			showSettingsDialog: function() {

				var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
				var mode = this.getComponentData().startupParameters["mode"];
				var intent;
				if (mode[0] === "create") {
					intent = "create";
				} else {
					intent = "manageLineItems";
				}
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "UserDefaults",
						action: "manage"
					},

					params: {
						BusinessObject: ["PurchaseRequisition"],
						Intent: [intent],
						Mode: [mode],
						page: [this.getComponentData().sourcePage],
						draftKey: [this.getComponentData().draftKey],
						DocumentNo: [this.getComponentData().purchaseRequisition],
						DocumentItemNo: [this.getComponentData().purReqnItem],
						DocumentItemDraft: [this.getComponentData().purReqnItemDraft],
						ItemPath: [this.getComponentData().PRitemPath]
							// 	PurchaseRequisitionItem: [selectedLine.Purchaserequisitionitem]
					}

				});
			},
			getQueryVariable: function(variable) {
				var query = window.location.search.substring(1);
				var vars = query.split("&");
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split("=");
					if (pair[0] === variable) {
						return pair[1];
					}
				}
				return (false);
			},

			/**
			 * In this function, the rootView is initialized and stored.
			 * @public
			 * @override
			 * @returns {sap.ui.mvc.View} the root view of the component
			 */
			createContent: function() {
				// call the base component's createContent function
				var oRootView = UIComponent.prototype.createContent.apply(this, arguments);
				oRootView.addStyleClass(this.getContentDensityClass());
				return oRootView;
			},

			/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy'
			 */
			getContentDensityClass: function() {
				if (!this._sContentDensityClass) {
					if (Device.system.desktop) { // apply compact mode if touch is not supported; this could me made configurable for the user on "combi" devices with touch AND mouse
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						this._sContentDensityClass = "sapUiSizeCozy"; //sapUiSizeCompact needed for desktop-first controls like sap.ui.table.Table
					}
				}
				return this._sContentDensityClass;
			}

		});

	});