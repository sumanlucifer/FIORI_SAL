/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/UIComponent", "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"],
	function(UIComponent, ReuseComponentSupport) {
		"use strict";

		var Component = UIComponent.extend("sap.se.mi.plm.lib.attachmentservice.attachment.components.stcomponent.Component", {
			metadata: {
				manifest: "json",
				library: "sap.se.mi.plm.lib.attachmentservice",
				publicMethods: ["save", "cancel", "refresh", "getApplicationState", "getAttachmentCount"],
				properties: {
					mode: {
						type: 'string',
						group: 'Misc',
						defaultValue: 'D'
					},
					objectKey: {
						type: 'string',
						group: 'Misc',
						bindable: true,
						defaultValue: null
					},
					objectType: {
						type: 'string',
						group: 'Misc',
						bindable: true,
						defaultValue: null
					},
					isDraft: {
						type: 'boolean',
						group: 'Misc',
						bindable: true,
						defaultValue: false
					},
					semanticObject: {
						type: 'string',
						group: 'Misc',
						bindable: true,
						defaultValue: null
					},
					attachmentCount: {
						type: 'int',
						group: 'Misc',
						bindable: true,
						defaultValue: null
					},
					attributeHandling: {
						type: 'object',
						group: 'Misc',
						bindable: true,
						defaultValue: null
					},
					flavor: {
						type: 'string',
						group: 'Misc',
						defaultValue: "withoutCheckIn"
					}

				},
				events: {
					"onupload": {}

				}

			},
			init: function() {
				(UIComponent.prototype.init || jQuery.noop).apply(this, arguments);
				//Transform this component into a reuse component for smart templates:            
				ReuseComponentSupport.mixInto(this);
			},
			createContent: function() {
				this.page = new sap.ui.view({
					viewName: "sap.se.mi.plm.lib.attachmentservice.attachment.view.Attachment",
					type: sap.ui.core.mvc.ViewType.XML
				});
				return this.page;
			},
			setProperty: function(sName, oValue) {
				sap.ui.core.UIComponent.prototype.setProperty.apply(this, arguments);
			},
			stStart: function(oModel, oBindingContext, oExtensionAPI) {
				var self = this;
				this.isSmartTemplate = true;
				if (oExtensionAPI.getTransactionController().attachAfterActivate) {
					oExtensionAPI.getTransactionController().attachAfterActivate(function() {
						self.page.getController().setProperties(self.getMode(), self.getObjectType(), self.getObjectKey(), self.getSemanticObject());
					});
				} else if (oExtensionAPI.getTransactionController().attachAfterSave) {
					oExtensionAPI.getTransactionController().attachAfterSave(function() {
						self.page.getController().setProperties(self.getMode(), self.getObjectType(), self.getObjectKey(), self.getSemanticObject());
					});
				}
				oExtensionAPI.attachPageDataLoaded(function() {
					self.page.getController().setProperties(self.getMode(), self.getObjectType(), self.getObjectKey(), self.getSemanticObject());
				});
				oExtensionAPI.getTransactionController().attachAfterCancel(function() {
					self.page.getController().setProperties(self.getMode(), self.getObjectType(), self.getObjectKey(), self.getSemanticObject());
				});
			},
			stRefresh: function(oModel, oBindingContext, oExtensionAPI) {

			},
			setMode: function(value) {
				this.setProperty("mode", value);
				this.page.getController().setModeProperty();
			},
			setAttributeHanding: function(value) {
				this.page.getController().setAttributes(value);
			},
			getAttributes: function() {
				return this.page.getController().getAttributeList();
			},

			setAttributes: function(attr) {
				this.page.getController().setAttributes(attr);
			},

			save: function(isReferesh) {
				return this.page.getController().commitChanges(isReferesh);
			},
			cancel: function(isReferesh) {
				return this.page.getController().cancelChanges(isReferesh);
			},
			refresh: function(asMode, objectType, objectKey, semanticObject) {
				this.page.getController().setProperties(asMode, objectType, objectKey, semanticObject);
			},
			getApplicationState: function() {
				return this.page.getController().getApplicationState();
			},
			getAttachmentCount: function() {
				return this.page.getController().getAttachmentCount();
			}

		});

		return Component;

	});
