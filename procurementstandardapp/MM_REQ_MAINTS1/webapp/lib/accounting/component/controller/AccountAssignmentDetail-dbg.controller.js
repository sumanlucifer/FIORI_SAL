/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/ui/s2p/mm/lib/reuse/accounting/component/util/HelperFunctions"
	],

	function(Controller, HelperFunctions) {
		"use strict";

		return Controller.extend("sap.ui.s2p.mm.lib.reuse.accounting.component.controller.AccountAssignmentDetail", {

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf src.sap.s2p.mm.lib.reuse.accounting.src.sap.s2p.mm.lib.reuse.accounting.component.view.AccountAssignmentDetail
			 */
			onInit: function() {
				this.oi18nModel = new sap.ui.model.resource.ResourceModel({
					bundleName: "sap.ui.s2p.mm.lib.reuse.accounting.messagebundle",
					bundleLocale: sap.ui.getCore().getConfiguration().getFormatLocale()
				});
				// Texts
				this.getView().setModel(this.oi18nModel, "i18n");
				this.oTextBundle = this.oi18nModel.getResourceBundle();
				this.oView = this.getView();
				this.binded = false;
				this.ownerData = null;
				this.oModel = null;
				this.sAccBindingPathEntityType = null;
				this.accAssignMetadata = [
					[],
					[]
				];
				this.oSmartForm = this.oView.byId("accAssignSmartForm");
				if (!this.oSmartForm) {
					this.oSmartForm = sap.ui.getCore().byId("accAssignSmartForm");
				}
				this.bAccDetailsAsPopup = null;
				this.EditMode = null;

			},
			/******************************************************************************
			 * _setPopDisplay
			 * Parameters: mode                          Boolean Value based on bAccDetailsAsPopup
			 * =============================================================================
			 * Sets the UIMode of the component.
			 ******************************************************************************/
			_setPopDisplay: function(mode) {
				this.bAccDetailsAsPopup = mode;

			},
			/******************************************************************************
			 * _setEditMode
			 * Parameters: mode                          EditMode as set by the consumer
			 * =============================================================================
			 * Sets the EditMode of the component.
			 ******************************************************************************/
			_setEditMode: function(mode) {
				this.EditMode = mode;
			},
			/******************************************************************************
			 * _setBackButtonVisibility
			 * =============================================================================
			 * Set the Visiblity of back button on the Accounting Form.
			 ******************************************************************************/
			_setBackButtonVisibility: function(mode) {
				this.getView().byId("navBack").setVisible(mode);
			},

			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf src.sap.s2p.mm.lib.reuse.accounting.src.sap.s2p.mm.lib.reuse.accounting.component.view.AccountAssignmentDetail
			 */
			onBeforeRendering: function() {

				// var oView = this.getView();
				if (this.bAccDetailsAsPopup === false) {
					this._setBackButtonVisibility(false);
					// this.getView().byId("accountColumn").setType("Navigation");
				}
				if (!this.getOwnerComponent()) {
					this.ownerData = this.ownerData;
				} else {
					this.ownerData = this.getOwnerComponent().oComponentData;
				}
				this.oModel = this.ownerData.oModel;
				if (!this.oModel) {
					this.oModel = this.getView().getModel();
				}
				if (!this.sAccBindingPathEntityType) {
					this.sAccBindingPathEntityType = "/" + this.getOwnerComponent().oComponentData.sAccBindingPathEntityType;
				}
				this.oSmartForm.setEntityType(this.ownerData.sAccEntityTypeName);
				HelperFunctions.setLayoutProperties(this.oView);
				if (this.accAssignMetadata[0].length === 0 && this.accAssignMetadata[1].length === 0) {
					this.accAssignMetadata = this.addAccAssignAttributesFromMetaData(this.oModel, this.oView, this.ownerData.sAccEntityTypeName);
				}
				this.getView().setModel(this.oModel);
				this.oSmartForm.setModel(this.oModel);
				this.oSmartForm.bindElement(this.sAccBindingPathEntityType);
				this.getView().byId("accAssignSmartForm").setEditable(this.EditMode);

			},
			/******************************************************************************
			 * setContextPath
			 * =============================================================================
			 * Set the context path for the accouting line item.
			 ******************************************************************************/
			setContextPath: function(bindingPath) {
				this.sAccBindingPathEntityType = bindingPath;
			},
			/******************************************************************************
			 * NavBack
			 * Parameters: oEvent       The event fired when clicked the back button in Accouting Form
			 * =============================================================================
			 * This is the event for navigate back to the Accouting List
			 ******************************************************************************/
			NavBack: function(oEvent) {
				this.getOwnerComponent().fireEvent("listNavigation", {
					accountingEvent: oEvent
				});

			},
			/******************************************************************************
			 * setOwnerData
			 * =============================================================================
			 * Set the Component Data for this view in case of Pop Up
			 ******************************************************************************/
			setOwnerData: function(odata) {
				this.ownerData = odata;
			},
			/******************************************************************************
			 * addAccAssignAttributesFromMetaData
			 * Parameters: oModel   			The oModel has the oData model
			 * Parameters: oView    			The oView has the view details
			 * Parameters: vEntityTypeName  	The vEntityTypeName has the entity type name
			 * =============================================================================
			 * Read the annotation by the given Id in respective entity type
			 ******************************************************************************/
			addAccAssignAttributesFromMetaData: function(oModel, oView, vEntityTypeName) {

				// Get metadata attributes
				var oAttributesFromMetadata = HelperFunctions.getAttributesFromMetadata(oModel, vEntityTypeName);
				var oAccAssignGroupAttributes = HelperFunctions.getAccAssignAnnotationFromMetadata(oModel, vEntityTypeName, "AccGroup");
				var oAccAssignGroupAttributes1 = HelperFunctions.getAccAssignAnnotationFromMetadata(oModel, vEntityTypeName, "SecondGroup");
				var oAccAssignGroupAttributes2 = HelperFunctions.getAccAssignAnnotationFromMetadata(oModel, vEntityTypeName, "ThirdGroup");

				var oGroup = sap.ui.getCore().byId("AccGroup");
				if (!oGroup) {
					oGroup = oView.byId("AccGroup");
				}

				HelperFunctions.clearAttributes(oGroup);

				var oGroup1 = sap.ui.getCore().byId("SecondGroup");
				if (!oGroup1) {
					oGroup1 = oView.byId("SecondGroup");
				}

				HelperFunctions.clearAttributes(oGroup1);

				var oGroup2 = sap.ui.getCore().byId("ThirdGroup");
				if (!oGroup2) {
					oGroup2 = oView.byId("ThirdGroup");
				}

				HelperFunctions.clearAttributes(oGroup2);

				var aAccAssign = [];
				var i, j, k;
				var cnt, propValue, textAvailable;
				//AccGroup
				if (oAccAssignGroupAttributes) {
					if (oAccAssignGroupAttributes.length === 0) {
						oGroup.setVisible(false);
					}
					for (i = 0; i < oAccAssignGroupAttributes.length; i++) {
						textAvailable = false;
						if (oAccAssignGroupAttributes[i].propertyValue) {
							//Text fields need not be added to the smart form as smart fields
							// Remove all the text fields while adding account assingment attributes
							
							if (oAccAssignGroupAttributes[i].propertyValue[0].path.lastIndexOf("_Text") === -1) {
								propValue = oAccAssignGroupAttributes[i].propertyValue[0].path;
								for (cnt = 0; cnt < oAccAssignGroupAttributes.length; cnt++) {
									if (oAccAssignGroupAttributes[cnt].propertyValue[0].path === propValue + "_Text") {
										textAvailable = true;
										break;
									}
								}
								if (textAvailable === true) {
									this.addAccAssignAttribute(oView, oGroup, oAccAssignGroupAttributes[i].propertyValue[0].path, "accAssignGroupElement",
										textAvailable);
								} else {
									this.addAccAssignAttribute(oView, oGroup, oAccAssignGroupAttributes[i].propertyValue[0].path, "accAssignGroupElement");
								}

								aAccAssign.push(oGroup, oAccAssignGroupAttributes[i].propertyValue[0].path);
							}
						} else {
							for (k = 0; k < oAccAssignGroupAttributes[i].length; k++) {
								//if (oAccAssignGroupAttributes[i][k].Value.Path === oAttributesFromMetadata[j].name) {
								//Text fields need not be added to teh smartf form as smart fields
								if (oAccAssignGroupAttributes[i][k].Value.Path.lastIndexOf("_Text") !== oAccAssignGroupAttributes[i][k].Value.Path.length -
									"_Text".length) {
									this.addAccAssignAttribute(oView, oGroup, oAccAssignGroupAttributes[i][k].Value.Path, "accAssignGroupElement");
									aAccAssign.push(oGroup, oAccAssignGroupAttributes[i][k].Value.Path);
								}

								//}
							}
						}

					}
				} else {
					if (oGroup) {
						oGroup.destroy();
					}
				}
				//First Group
				if (oAccAssignGroupAttributes1) {
					if (oAccAssignGroupAttributes1.length === 0) {
						oGroup1.setVisible(false);
					}
					for (i = 0; i < oAccAssignGroupAttributes1.length; i++) {
						if (oAccAssignGroupAttributes1[i].propertyValue) {
							this.addAccAssignAttribute(oView, oGroup1, oAccAssignGroupAttributes1[i].propertyValue[0].path, "accAssignGroupElement");
							aAccAssign.push(oGroup1, oAccAssignGroupAttributes1[i].propertyValue[0].path);
						} else {
							for (k = 0; k < oAccAssignGroupAttributes1[i].length; k++) {
								//if (oAccAssignGroupAttributes[i][k].Value.Path === oAttributesFromMetadata[j].name) {
								//Text fields need not be added to teh smartf form as smart fields
								if (oAccAssignGroupAttributes1[i][k].Value.Path.lastIndexOf("_Text") !== oAccAssignGroupAttributes1[i][k].Value.Path.length -
									"_Text".length) {
									this.addAccAssignAttribute(oView, oGroup1, oAccAssignGroupAttributes1[i][k].Value.Path, "accAssignGroupElement");
									aAccAssign.push(oGroup1, oAccAssignGroupAttributes1[i][k].Value.Path);
								}

								//}
							}
						}

					}
				} else {
					if (oGroup1) {
						oGroup1.destroy();
					}
				}
				//Second group
				if (oAccAssignGroupAttributes2) {
					if (oAccAssignGroupAttributes2.length === 0) {
						oGroup2.setVisible(false);
					}
					for (i = 0; i < oAccAssignGroupAttributes2.length; i++) {
						if (oAccAssignGroupAttributes2[i].propertyValue) {
							this.addAccAssignAttribute(oView, oGroup2, oAccAssignGroupAttributes2[i].propertyValue[0].path, "accAssignGroupElement");
							aAccAssign.push(oGroup2, oAccAssignGroupAttributes2[i].propertyValue[0].path);
						} else {
							for (k = 0; k < oAccAssignGroupAttributes2[i].length; k++) {
								//if (oAccAssignGroupAttributes[i][k].Value.Path === oAttributesFromMetadata[j].name) {
								//Text fields need not be added to teh smartf form as smart fields
								if (oAccAssignGroupAttributes2[i][k].Value.Path.lastIndexOf("_Text") !== oAccAssignGroupAttributes2[i][k].Value.Path.length -
									"_Text".length) {
									this.addAccAssignAttribute(oView, oGroup2, oAccAssignGroupAttributes2[i][k].Value.Path, "accAssignGroupElement");
									aAccAssign.push(oGroup2, oAccAssignGroupAttributes2[i][k].Value.Path);
								}

								//}
							}
						}

					}
				} else {
					if (oGroup2) {
						oGroup2.destroy();
					}
				}

				//                                            } else {
				// for (k = 0; k < oAccAssignGroupAttributes[i].length; k++) {
				//            if (oAccAssignGroupAttributes[i][k].Value.Path === oAttributesFromMetadata[j].name) {
				//                            if (i === 2) {
				//                                            this.addAccAssignAttribute(oView, oGroup, oAttributesFromMetadata[j].name, "accAssignGroupElement");
				//                                            aAccAssign.push(oGroup, oAttributesFromMetadata[j].name);
				//                            } else if (i === 0) {
				//                                            this.addAccAssignAttribute(oView, oGroup1, oAttributesFromMetadata[j].name, "accAssignGroupElement");
				//                                            aAccAssign.push(oGroup1, oAttributesFromMetadata[j].name);
				//                            } else {
				//                                            this.addAccAssignAttribute(oView, oGroup2, oAttributesFromMetadata[j].name, "accAssignGroupElement");
				//                                            aAccAssign.push(oGroup2, oAttributesFromMetadata[j].name);
				//                            }

				//            }
				// }
				// }
				//            }
				// }

				// } 
				// else {
				//            if (oGroup2) {
				//                            oGroup2.destroy();
				//            }
				// }

				return [aAccAssign];
			},

			/******************************************************************************
			 * addAccAssignAttributesFromMetaData
			 * Parameters: oView    		The oView has the view details
			 * Parameters: oGroup  			The oGroup has the group id
			 * Parameters: sAttributeName
			 * Parameters: sGroupPrefix
			 * =============================================================================
			 * Create the smartfield dynamically for the Accounting SmartForm
			 ******************************************************************************/
			addAccAssignAttribute: function(oView, oGroup, sAttributeName, sGroupPrefix, textAvailable) {

				var vViewId = oView.getId();
				var oGroupElement = new sap.ui.comp.smartform.GroupElement();

				var oSmartField = new sap.ui.comp.smartfield.SmartField({
					id: vViewId + "_" + sGroupPrefix + sAttributeName,
					value: "{" + sAttributeName + "}"
				});

				//var oSmartField = new sap.ui.comp.smartfield.SmartField({
				//            id: vViewId + "_" + sGroupPrefix + sAttributeName,
				//            value: "{parts:[{path: '" + sAttributeName + "'},{path:'" + sAttributeName +
				//                            "_Text'}], formatter: 'sap.ui.s2p.mm.lib.reuse.accounting.component.util.formatter.returnText'}"
				//});

				oSmartField.attachEvent("change", this.changeAccounting, this);

				var oConfiguration = new sap.ui.comp.smartfield.Configuration();
				oConfiguration.setDisplayBehaviour("descriptionAndId");
				oSmartField.setConfiguration(oConfiguration);

				oGroupElement.addElement(oSmartField);
				if (this.EditMode === true && textAvailable === true) {
					//var oText = new sap.m.Text({
					//            text: "{" + sAttributeName + "_Text}"
					//});
					var oSmartFieldTxt = new sap.ui.comp.smartfield.SmartField({
						id: vViewId + "_" + sGroupPrefix + sAttributeName + "_Text",
						value: "{" + sAttributeName + "_Text}",
						showLabel: false,
						editable: false
					});
					oGroupElement.addElement(oSmartFieldTxt);
				}
				oGroup.addGroupElement(oGroupElement);
			},

			/******************************************************************************
			 * changeAccounting
			 * =============================================================================
			 * This event will trigger when you change the focus from the smart field
			 * in accouting details
			 ******************************************************************************/
			changeAccounting: function() {
				this.getView().setBusy(true);
				var OData = this.getView().byId("accAssignSmartForm").getBindingContext().getModel().getData(this.getView().byId(
						"accAssignSmartForm")
					.getBindingContext().getPath());
				var prop;
				try {
					delete OData.HasDraftEntity;
					delete OData.DraftAdministrativeDataUUID;
					delete OData.IsActiveEntity;
					delete OData.HasActiveEntity;
					delete OData.MultipleAcctAssgmtDistrPercent;
					delete OData.CompanyCode;
					delete OData.CostElement;
					delete OData.PurReqnAcctDraftUUID;
					delete OData.PurReqnDraftUUID;
					delete OData.PurReqnItemDraftUUID;
					for (prop in OData)
						if (typeof(OData[prop]) === "object") {
							delete OData[prop];
						}
					for (prop in OData) {
						if (prop.search('UxFc') !== -1) {
							delete OData[prop];
						}
					}
				} catch (e) { //do nothing
				}
				this.adjustPayload(OData);
				var oModel = this.getView().byId("accAssignSmartForm").getBindingContext().getModel();

				if (oModel) {
					oModel.update(this.getView().byId("accAssignSmartForm").getBindingContext().getPath(), OData, {
						"success": jQuery.proxy(this.successHandler, this),
						"error": jQuery.proxy(this.errorHandler, this)
					});
				} else {
					this.getView().getModel().update(this.getView().byId("accAssignSmartForm").getBindingContext().getPath(), OData, {
						"success": jQuery.proxy(this.successHandler, this),
						"error": jQuery.proxy(this.errorHandler, this)
					});
				}

			},
			/******************************************************************************
			 * successHandler
			 * =============================================================================
			 * This is the success handle event to update the value of smart field
			 * in accouting details
			 ******************************************************************************/
			successHandler: function() {
				sap.m.MessageToast.show(this.oTextBundle.getText("updateSuccess"));
				this.getView().byId("accAssignSmartForm").getBindingContext().getModel().refresh();
				this.getView().setBusy(false);
			},
			errorHandler: function() {
				//alert("fail");
			},
			adjustPayload: function(oData) {
				for (var prop in oData) {
					if (prop.search('_fc') < 0) {
						var property = prop.toString() + "_fc";
						if (oData[property] === 1 || oData[property] === 0) {
							delete oData[prop];
							delete oData[property];
						}
					}
				}
				return oData;
			}

			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf src.sap.s2p.mm.lib.reuse.accounting.src.sap.s2p.mm.lib.reuse.accounting.component.view.AccountAssignmentDetail
			 */
			//	onExit: function() {
			//
			//	}
		});
	});
