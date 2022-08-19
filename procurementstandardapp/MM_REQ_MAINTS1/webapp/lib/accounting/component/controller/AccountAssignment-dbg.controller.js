/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/Dialog",
		"sap/ui/s2p/mm/lib/reuse/accounting/component/util/HelperFunctions"

	],
	function(Controller, Dialog) {
		"use strict";

		return Controller.extend("sap.ui.s2p.mm.lib.reuse.accounting.component.controller.AccountAssignment", {

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf sap.ui.s2p.mm.accassignment.lib.reuse.src.sap.ui.s2p.mm.accassignment.lib.reuse.component.view.AccountAssignment
			 */
			onInit: function() {
				this.oi18nModel = new sap.ui.model.resource.ResourceModel({
					bundleName: "sap.ui.s2p.mm.lib.reuse.accounting.messagebundle",
					bundleLocale: sap.ui.getCore().getConfiguration().getFormatLocale()
				});
				// Texts
				this.getView().setModel(this.oi18nModel, "i18n");
				this.oTextBundle = this.oi18nModel.getResourceBundle();
				this.accAssignMetadata = [
					[],
					[]
				];
				this.bAccDetailsAsPopup = null;
				this.EditMode = null;
				this.ShowHeader = null;
				this.oDialog = null;
				this.sAccEntitySetName = this.getOwnerComponent().oComponentData.sAccEntitySetName;
				this.sAccTableBindingPath = this.getOwnerComponent().oComponentData.sAccBindingPathEntitySet;
				this.oModel = "";
				if (this.getOwnerComponent().oComponentData.oModel) {
					this.oModel = this.getOwnerComponent().oComponentData.oModel;
				} else {
					this.oModel = this.getView().getModel();
				}
			},

			/******************************************************************************
			 * _setDetailsButtonVisibility
			 * Parameters: oValue                         Boolean Value based on bAccDetailsAsPopup
			 * =============================================================================
			 * Sets the details button visibility
			 ******************************************************************************/
			_setDetailsButtonVisibility: function(oValue) {
				this.getView().byId("detailsButton").setVisible(oValue);
			},
			/******************************************************************************
			 * _showNavigationButton
			 * =============================================================================
			 * Sets the navigation property for a column based on UIMode
			 ******************************************************************************/

			_showNavigationButton: function() {
				this.getView().byId("accountColumn").setType("Navigation");
			},

			/******************************************************************************
			 * _showListCRUDActions
			 * =============================================================================
			 * Sets the add and delete button based on EditMode
			 ******************************************************************************/

			_showListCRUDActions: function() {
				this.getView().byId("addButton").setEnabled(this.EditMode);
				this.getView().byId("deleteButton").setEnabled(this.EditMode);

			},
			/******************************************************************************
			 * _showListHeader
			 * =============================================================================
			 * Sets the header text on the table and its count.
			 ******************************************************************************/

			_showListHeader: function() {
				if (this.ShowHeader) {
					this.getView().byId("accBasicTable").setHeader(this.oTextBundle.getText("header"));
					this.getView().byId("accBasicTable").setShowRowCount(true);
				}
			},
			onUpdateFinished: function() {
				this.getView().byId("accountingTable").getItems()[0].setSelected(true);
			},

			onBeforeRendering: function() {
				if (this.bAccDetailsAsPopup === true) {
					this._setDetailsButtonVisibility(true);
				}

				if (this.bAccDetailsAsPopup === false) {
					this._showNavigationButton();
					this._setDetailsButtonVisibility(false);
				}
				this._showListCRUDActions();
				this._showListHeader();
				this.getView().byId("accBasicTable").setEditable(this.EditMode);
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
			 * _setShowHeader
			 * Parameters: mode                          HeaderMode as set by the consumer
			 * =============================================================================
			 * Sets the Visibility of the header.
			 ******************************************************************************/

			_setShowHeader: function(mode) {
				this.ShowHeader = mode;
			},

			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf sap.ui.s2p.mm.accassignment.lib.reuse.src.sap.ui.s2p.mm.accassignment.lib.reuse.component.view.AccountAssignment
			 */
			//            onBeforeRendering: function() {
			//
			//            },

			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf sap.ui.s2p.mm.accassignment.lib.reuse.src.sap.ui.s2p.mm.accassignment.lib.reuse.component.view.AccountAssignment
			 */
			onAfterRendering: function() {
				this.getView().setModel(this.oModel);
				this.getView().byId("accBasicTable").setModel(this.oModel);
				this.getView().byId("accBasicTable").setEntitySet(this.sAccEntitySetName);
				this.getView().byId("accBasicTable").setTableBindingPath(this.sAccTableBindingPath);
				this.getView().byId("accBasicTable").setEditable(this.EditMode);

			},

			/******************************************************************************
			 * onDetail
			 * =============================================================================
			 * This is the event for the details buttons and open the details of the accounting
			 * line in a dialog.
			 ******************************************************************************/

			onDetail: function() {
				var lineSelected = this.getView().byId("accountingTable").getSelectedContexts();
				if (lineSelected.length > 0) {
					this.bindingPath = this.getView().byId("accountingTable").getSelectedContexts()[0].getPath();
					this.page = new sap.ui.view({
						viewName: "sap.ui.s2p.mm.lib.reuse.accounting.component.view.AccountAssignmentDetail",
						type: sap.ui.core.mvc.ViewType.XML

					});
					var that = this;
					this.oDialog = new Dialog({
						title: this.oTextBundle.getText("accAssignTitle"),
						content: this.page,
						beginButton: new sap.m.Button({
							text: "Close",
							press: function() {
								that.oDialog.close();
							}
						})
					});
					this.getView().addDependent(this.oDialog);
					this.page.getController().setContextPath(this.bindingPath);
					this.page.getController()._setEditMode(this.EditMode);
					this.page.getController().setOwnerData(this.getOwnerComponent().oComponentData);
					this.oModel.read(this.bindingPath, {
						success: jQuery.proxy(this.onRead, this)
					});
				} else {
					sap.m.MessageToast.show(this.oTextBundle.getText("accErrorMessage"));
				}

			},

			/******************************************************************************
			 * onRead
			 * =============================================================================
			 * This is the success handler event for onDetail function which will open
			 * Pop Up.
			 ******************************************************************************/
			onRead: function() {

				this.oDialog.open();
			},
			/******************************************************************************
			 * onLineItemPressed
			 * Parameters: oEvent       The event fired when clicked the navigation of item
			 * =============================================================================
			 * This is the event for the navigation on the table and open the details of
			 * accounting line in an object page or as defined by the consumer application.
			 ******************************************************************************/
			onLineItemPressed: function(oEvent) {
				var lineSelected = this.getView().byId("accountingTable").getSelectedContexts();
				if (lineSelected.length > 0) {
					var sPath = this.getView().byId("accountingTable").getSelectedContexts()[0].getPath();
					this.getOwnerComponent().fireEvent("detailNavigation", {
						detailEvent: oEvent,
						bindpath: sPath
					});
				} else {
					sap.m.MessageToast.show(this.oTextBundle.getText("accErrorMessage"));
				}
			},

			/******************************************************************************
			 * onCloseDialog
			 * =============================================================================
			 * This is the event for the Close Button in Detail dialog which will close
			 * the Pop Up.
			 ******************************************************************************/
			onCloseDialog: function() {
				this._oDialog.close();

			},
			/******************************************************************************
			 * onCreate
			 * =============================================================================
			 * This is the event for the create button on the Accounting table
			 ******************************************************************************/
			onCreate: function(oEvent) {
				var oEventLocal = oEvent;
				var sUrl = this.sAccTableBindingPath;
				var oData = {
					Quantity: "0.000"
				};
				this.oModel.create(sUrl, oData, {
					success: jQuery.proxy(this.successHandlerCreate, this, oEventLocal),
					error: jQuery.proxy(this.errorHandlerCreate, this)
				});

			},
			/***********************************************************************************
			 * successHandlerCreate
			 * Parameters: oEvent       The event fired when clicked the navigation of item
			 * Parameters: oResponse    The oResponse had the information about the service call
			 * =================================================================================
			 * This is the success handler event for the create button on
			 * the Accounting table
			 ******************************************************************************/
			successHandlerCreate: function(oEvent, oResponse) {
				var sLocation = oResponse.__metadata.uri;
				var result = sLocation.split("/");
				this.bindingPath = "/" + result[result.length - 1];

				if (this.bAccDetailsAsPopup === true) {

					this.onDetailAfterCreate(this.bindingPath);
				}
				if (this.bAccDetailsAsPopup === false) {

					this.onLineItemPressedAfterCreate(oEvent, this.bindingPath);
				}

				this.getView().byId("accountingTable").getModel().refresh();

			},
			/****************************************************************************************
			 * onDetailAfterCreate
			 * Parameters: bindingPath       The bindingPath contains the path of the accounting item
			 * ======================================================================================
			 * This method will be called from success handler event for the create button on
			 * Accouting table
			 ******************************************************************************/
			onDetailAfterCreate: function(bindingPath) {
				this.bindingPath = bindingPath;
				this.page = new sap.ui.view({
					viewName: "sap.ui.s2p.mm.lib.reuse.accounting.component.view.AccountAssignmentDetail",
					type: sap.ui.core.mvc.ViewType.XML

				});
				var oDialog = new Dialog({
					content: this.page,
					beginButton: new sap.m.Button({
						text: "Close",
						press: function() {
							oDialog.close();
						}
					})
				});
				this.getView().addDependent(oDialog);
				this.page.getController().setContextPath(this.bindingPath);
				this.page.getController()._setEditMode(this.EditMode);
				this.page.getController().setOwnerData(this.getOwnerComponent().oComponentData);
				oDialog.open();
			},
			/******************************************************************************
			 * onLineItemPressedAfterCreate
			 * Parameters: oEvent       The event fired when clicked the navigation of item
			 * Parameters: bindingPath  The bindingPath contains the path of the accounting item
			 * =============================================================================
			 * This is the event for the navigation on the table and open the details of
			 * accounting line in an object page or as defined by the consumer application.
			 ******************************************************************************/
			onLineItemPressedAfterCreate: function(oEvent, bindingPath) {
				var sPath = bindingPath;
				this.getOwnerComponent().fireEvent("detailNavigation", {
					detailEvent: oEvent,
					bindpath: sPath
				});
			},
			/******************************************************************************
			 * onDelete
			 * =============================================================================
			 * This is the event for the delete button on the Accounting table
			 ******************************************************************************/
			onDelete: function() {
				var bindingPath = this.getView().byId("accountingTable").getSelectedContexts()[0].getPath();
				this.oModel.remove(bindingPath, {
					batchGroupId: 1,
					changeSetId: 1,
					success: jQuery.proxy(this.successHandlerDelete, this)
				});

			},
			/***********************************************************************************
			 * successHandlerDelete
			 * =================================================================================
			 * This is the success handler event for the delete button on
			 * the Accounting table
			 ******************************************************************************/
			successHandlerDelete: function() {

				var sSuccessMsg = this.oTextBundle.getText("msg_success_delete");
				sap.m.MessageToast.show(sSuccessMsg, {
					duration: 2000
				});
				this.oModel.refresh();
			},
			updateAccList: function(successFunction, errorFunction, parentController) {
				var oModel = this.oModel;
				var accEntityList = [];
				var odata1 = [];
				for (var obj in oModel.oData) {
					if (obj.indexOf(this.sAccEntitySetName) >= 0) {
						accEntityList.push(obj);
					}
				}
				for (var i = 0; i < accEntityList.length; i++) {
					var oData = oModel.getData("/" + accEntityList[i]);
					var prop;
					try {
						if (oData.hasOwnProperty('HasDraftEntity')) {
							delete oData.HasDraftEntity;
						}
						delete oData.DraftAdministrativeDataUUID;
						delete oData.IsActiveEntity;
						delete oData.HasActiveEntity;
						delete oData.MultipleAcctAssgmtDistrPercent;
						delete oData.CompanyCode;
						delete oData.CostElement;
						delete oData.PurReqnAcctDraftUUID;
						delete oData.PurReqnDraftUUID;
						delete oData.PurReqnItemDraftUUID;
						for (prop in oData)
							if (typeof(oData[prop]) === "object") {
								delete oData[prop];
							}
						for (prop in oData) {
							if (prop.search('UxFc') !== -1) {
								delete oData[prop];
							}
						}
						
						odata1.push(this.adjustPayload(oData));
					} catch (e) { //do nothing
					}
					// oModel.update("/" + accEntityList[i], oData, {
					// 	success: jQuery.proxy(this.successHandler, this, successFunction, parentController),
					// 	error: jQuery.proxy(this.errorHandler, this, errorFunction, parentController)
					// });
				}
				
				var length = accEntityList.length;
				var count = 0;
				this.accountObject = {
					length1: length,
					count: count,
					accEntityList: accEntityList,
					oData: odata1,
					errorFunction: errorFunction
				};
				oModel.update("/" + accEntityList[count], odata1[count], {
					success: jQuery.proxy(this.successHandler, this, successFunction, parentController),
					error: jQuery.proxy(this.errorHandler, this, errorFunction, parentController)
				});

			},
			successHandler: function(successFunction, data) {
				this.accountObject.count = this.accountObject.count + 1;
				if (this.accountObject.count >= this.accountObject.length1) {
					successFunction(data);
				} else {
					this.oModel.update("/" + this.accountObject.accEntityList[this.accountObject.count], this.accountObject.oData[this.accountObject.count], {
						success: jQuery.proxy(this.successHandler, this, successFunction, data),
						error: jQuery.proxy(this.errorHandler, this, this.accountObject.errorFunction, data)
					});
				}
				// successFunction(data);

			},
			errorHandler: function(errorFunction, data) {
				errorFunction(data);
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
			 * @memberOf sap.ui.s2p.mm.accassignment.lib.reuse.src.sap.ui.s2p.mm.accassignment.lib.reuse.component.view.AccountAssignment
			 */
			//            onExit: function() {
			//
			//            }
		});
	});
