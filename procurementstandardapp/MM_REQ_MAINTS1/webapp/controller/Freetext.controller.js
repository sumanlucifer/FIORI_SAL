/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* Free text */
jQuery.sap.require("sap.ca.ui.message.message");
sap.ui.define([
	"ui/s2p/mm/requisition/maintain/s1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ui/s2p/mm/requisition/maintain/s1/model/formatter",
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	"ui/s2p/mm/requisition/maintain/s1/controller/Common"
], function(BaseController, JSONModel, formatter, MessageToast, MessageBox, Common) {
	"use strict";

	return BaseController.extend("ui.s2p.mm.requisition.maintain.s1.controller.Freetext", {
// DUMMY
		onInit: function() {

			this.oModel = this.getAppModel();
			this.batch_update = [];
			this.batch_create = [];
			this._notes = [];
			this.dummy = [];
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();
			var resourceBundle = this.getResourceBundle();
			this.firstTime = true;
			this.bFlag = false;
			this._oRouter.getRoute("Freetext").attachPatternMatched(this._onObjectMatched, this);

		},

		/**
		 * Setter method to set the ItemDraft Key.
		 * @public
		 * @param{draftKey}his. ItemDraft Key of the application
		 */

		setItemDraftKey: function(itemDraftKey) {
			this.itemDraftKey = itemDraftKey;
		},

		/**
		 * Getter  method to get the ItemDraft Key.
		 * @public
		 * returns ItemDraft Key {draftKey}
		 */
		getItemDraftKey: function() {
			return this.itemDraftKey;
		},

		/**
		 * Convenience method for doing a Dummy Post to get the Metadata for the Smart Fields in FreeText Screen
		 * @public
		 */

		getDummyItem: function() {
			var materialGroup = '01'; // this.getView().byId("material").getValue(); //MaterialGroup
			var description = 'DummyIgnoreThis'; // this.getView().byId("descrp").getValue(); //PurchaseRequisitionItemText
			var baseunit = 'EA'; //this.getView().byId("unit").getValue(); //BaseUnit
			var currency = 'EUR'; //this.getView().byId("currency").getValue(); //PurReqnItemCurrency

			var oData = {
				MaterialGroup: materialGroup,
				PurReqnDraftUUID: this.getHeaderDraftKey(),
				PurchaseRequisitionItemText: description,
				BaseUnit: baseunit,
				Currency: currency
			};

			var mParameters = this.getServiceCallParameter(this.successhandleAddtoCartPressDummy, this.serviceFail);
			this.dataManager.createNewItem(mParameters, this.getHeaderDraftKey(), this.getPurchaseRequisition(), oData);
		},

		/**
		 * This is Method Will be called on AttachPattern Matched (when ever we coem to this view from any other view),
		 * used to load different sections of the freetext Screen
		 * @public
		 */
		_onObjectMatched: function(oEvent) {
			if (this.getOwnerComponent().getComponentData().changingSourcePageAllowed) {
				this.setSourcePage("FreeText");
			}

			this.getView().setBusyIndicatorDelay(0);
			this.getView().setBusy(true);
			this.bFlag = false;
			this.setHeaderDraftKey(oEvent.getParameter("arguments").DraftKey);
			this.setPurchaseRequisition(oEvent.getParameter("arguments").PurchaseRequisition);
			var mParameters = this.getServiceCallParameter(this.headerSuccess, this.serviceFail);
			this.dataManager.getHeader(mParameters, this.getHeaderDraftKey(), this.getPurchaseRequisition());

			if (!this.getTestMode()) {
				this.getDummyItem();
			} else {
				this.successhandleAddtoCartPressDummy();
			}
			this.itemType = 0;
			// this.bFlag = false;

		},

		/**
		 * Convenience method for  upload/Viewing  the Attachments
		 * @public
		 */

		_loadattachments: function() {
			var self = this.getView();
			var owner = this.getOwnerComponent();
			var appKey = this.getHeaderDraftKey();
			appKey = appKey.replace(/-/g, "");
			var PRMode = "C";
			var attachmentView = self.byId("attachmentCompContainer");

			if ((owner._oCompFT !== null) && (owner._oCompFT) && (owner._oCompFT.getId() === "attachmentsrv.FreeText")) {
				owner._oCompFT.refresh(PRMode, "EBAN", appKey);
			} else {
				owner._oCompFT = sap.ui.getCore().createComponent({
					name: "sap.se.mi.plm.lib.attachmentservice.attachment",
					id: "attachmentsrv.FreeText",
					settings: {
						mode: "",
						objectKey: "",
						objectType: "EBAN"
					}
				});
				owner._oCompFT.setMode(PRMode);
				owner._oCompFT.setObjectKey(appKey);
				attachmentView.setComponent(owner._oCompFT);
			}
		},

		/**
		 * Convenience method for loading the smart form with default values
		 * @public
		 */

		successhandleAddtoCartPressDummy: function(oData) {
			this.getView().setModel(this.oModel);
			if (this.getTestMode()) {
				this.getView().bindElement("/" + this.entityConstants.getEntityName('itemEntity') +
					"(PurchaseRequisition='PurchaseRequisition 8',PurchaseRequisitionItem='PurchaseRequisitionItem 1',PurReqnItemDraftUUID=guid'c23e13de-8504-4180-88ba-d4f664219426')"
				);
			} else {
				var draftKey = this.getDraftKey(oData, true);
				this.setItemDraftKey(draftKey);

				this.getView().bindElement("/" + this.entityConstants.getEntityName('itemEntity') +
					"(PurchaseRequisition='" + this.getPurchaseRequisition() + "',PurchaseRequisitionItem='00000',PurReqnItemDraftUUID=guid'" +
					oData
					.PurReqnItemDraftUUID +
					"')");

				this._loadattachments();
				this.getView().setBusyIndicatorDelay(0);
				this.getView().setBusy(false);
				this.dummy = oData;
				var oMessageManager = sap.ui.getCore().getMessageManager();
				oMessageManager.removeAllMessages();

				var materialGroup = this.getView().byId("idMaterialGroup").getValue();
				// if (materialGroup) {

				// 	this.dataManager.getMaterialGroupDescription(this.getServiceCallParameter(this.successMaterialGroup, this.serviceFail),
				// 		materialGroup);
				// }

			}
		},

		/**
		 * Success message Toast method,  will be called when the item has been deleted successfully
		 * @public
		 */
		deleteSuccessItem: function() {
			sap.m.MessageToast.show(this.getResourceBundle().getText("delete"));
		},

		/**
		 * Convenience method for adding the Items to the Purchase Requisition
		 * @public
		 * successHandler - successhandleAddtoCartPress
		 * errorHandler - serviceFail
		 * @param{successHandler} : Success Handler function callback, this is called after the service call returns SUCCESS(Status Code : 200, 201)
		 * @param{errorHandler} : Error handler function callback, called when service fails(Status Codes : 400, 500, 401)
		 */

		handleAddtoCart: function() {

			this.supplierName = "";
			var oData = this.getView().byId("simpleForm").getBindingContext().getObject();
			if (!(this.Fixedsupplier1 === undefined)) {
				oData.FixedSupplier = this.Fixedsupplier1;

			}
			if (!(this.Supplier1 === undefined)) {
				oData.Supplier = this.Supplier1;
			}
			if (this.itemType === 1) {
				oData.ProductType = '2';
			} else {
				oData.ProductType = '';
			}
			if (oData.PurchasingDocumentItemCategory == "9") {
				oData.PurchasingDocumentItemCategory = "";
			}
			if (this.bFlag) {
				oData.FixedSupplier = "";
				oData.Supplier = "";
			}
			if (this.getTestMode()) {
				var order = true;
				if (order) {
					this.getView().setBusy(true);
					var mParameters = this.getServiceCallParameter(this.successhandleAddtoCartPress, this.serviceFail);
					this.dataManager.createNewItem(mParameters, this.getHeaderDraftKey(), this.getPurchaseRequisition(), oData);
				}
			} else {
				var order = false;
				if (this.matGrpValidation() && this.deliveryDtValidation() && this.quantityValidation()) {
					//if (this.materialValidation() && this.priceValidation()) { default changeset issue
					if (this.priceValidation()) {
						order = true;
					} else if (this.descvalidation() && this.priceValidation()) {
						order = true;
					}
					if (order) {
						this.getView().setBusy(true);
						var mParameters = this.getServiceCallParameter(this.successhandleAddtoCartPress, this.serviceFail);
						this.dataManager.createNewItem(mParameters, this.getHeaderDraftKey(), this.getPurchaseRequisition(), oData);
					}

				} else {
					//            sap.ui.getCore().getMessageManager().addMessages("PLease fill all the Mandatory Fields");

				}
			}

		},

		/**
		 * Convenience method for updating the Header Item
		 * @public
		 * successHandler - updateHeaderSuccess
		 * errorHandler - serviceFail
		 */
		updateHeader: function() {
			var mParameters = this.getServiceCallParameter(this.updateHeaderSuccess, this.serviceFail);
			this.dataManager.getHeader(mParameters, this.getHeaderDraftKey(), this.getPurchaseRequisition());

		},

		/**
		 * Convenience method for refreshing the MiniCart once Hedaer Item is updated.
		 * @public
		 */
		updateHeaderSuccess: function() {
			this.dataManager.updateHeaderSuccess(this.getView().byId('btnCart'), [this.getPurchaseRequisition(), "guid'" + this.getHeaderDraftKey() +
				"'"
			]);
			// this.getView().byId('btnCart').bindElement("/" + this.entityConstants.getEntityName('headerEntity') +
			// 	"(PurchaseRequisition='" + this.getPurchaseRequisition() + "',PurReqnDraftUUID=guid'" + this.getHeaderDraftKey() + "')");
			this.getView().setBusy(false);
			var that = this;
			setTimeout(function() {
				that.firstMiniCartOpen();
			}, 2000);
			this.retrieveMessages();
		},
		/**
		 * This Methods is called when the  Item is Successfully added to Cart & also refreshes all the Sections
		 * @public
		 */
		successhandleAddtoCartPress: function(data, headers) {
			this.storeMessages(data, headers);
			sap.m.MessageToast.show(this.getResourceBundle().getText("AddToCart"));
			if (this.getTestMode()) {
				this.getView().byId("btnCart").setText("1");
				this.getView().setBusy(false);
			} else {
				this.updateHeader();
				var oDataModel_Notes = this.entityConstants.getServiceName("purchaseRequisition");
				var oDataModel_Notes_Model = new sap.ui.model.odata.ODataModel(oDataModel_Notes);
				var mParameters1 = {
					"success": jQuery.proxy(this.successOnUpdate, this)
				};

				for (var i = 0; i < this.batch_create.length; i++) {
					this.dataManager.createNotes(this.getServiceCallParameter(this.successOnUpdate, this.errorServiceFail), oDataModel_Notes_Model,
						data.PurReqnItemDraftUUID, this.getPurchaseRequisition(), this.batch_create[i], data.PurchaseRequisitionItem);
				}

				this.getView().byId("textArea").setValue("");
				for (i = 0; i < this.getView().byId("idIconTabBarNoIcons").getItems().length; i++) {

					this.getView().byId("idIconTabBarNoIcons").getItems()[i].getContent()[0].setValue(" ");
				}

				this.Fixedsupplier1 = "";
				this.Supplier1 = "";
				this.onUnAssign();
				this.bFlag = false;
				var priceFloat = this.dummy.PurchaseRequisitionPrice;
				var quanityFloat = this.dummy.RequestedQuantity;
				var delDate = this.dummy.DeliveryDate;
				var matGroup = this.dummy.MaterialGroup;
				this.oModel.resetChanges();
			    this._loadattachments();
				this.getView().byId("idMaterialDescription").setEnabled(true);
				this.getView().byId("idMaterial").setValue(this.dummy.Material);
				this.getView().byId("idMaterialDescription").setValue(this.dummy.PurchaseRequisitionItemText);
				this.getView().byId("idMaterialDescription").setEditable(true);
				this.getView().byId("idMaterialGroup").setValue(this.dummy.MaterialGroup);
				this.getView().byId("idMaterialGroup").setEditable(true);
				this.getView().byId("idMaterialGroupText").setValue(this.dummy.MaterialGroup_Text);
				this.getView().byId("price").setValue("");
				this._notes = [];
				this.batch_create = [];
				var mParameters = this.getServiceCallParameter(function() {}, this.serviceFail);
				this.dataManager.readDummy(mParameters, ['', "00000", "guid'00000000-0000-0000-0000-000000000000'"]);
				this.itemType = 0;
				this.handleServiceLineDisplay(0);
				this.setServiceLineFieldsBlankValues();
				this.getView().byId("idDeliveryDate").setValue(delDate);
			}

			// if (headers.headers["sap-message"]) {

			// 	var message = JSON.parse(headers.headers["sap-message"]).message;
			// 	var oMessageManager = sap.ui.getCore().getMessageManager();
			// 	var errorMessage = new sap.ui.core.message.Message({
			// 		message: message,
			// 		type: sap.ui.core.MessageType.Error
			// 	});
			// 	oMessageManager.addMessages(errorMessage);
			// }

		},

		/**
		 * This Methods is called to show the Success Message Toast when  the  Item is Successfully added to Cart
		 * @public
		 */
		successOnUpdate: function() {
			sap.m.MessageToast.show(this.getResourceBundle().getText("AddToCart"));
			this.retrieveMessages();
		},

		/**
		 * This Methods is called  to get the Selcted value of the Radio Button in the Freetext Smart Form to determine whethere it is a service / Product
		 * @public
		 * @param (oEvent)
		 */

		selctedkey: function(oEvent) {

			this.itemType = oEvent.getParameter("selectedIndex");

		},

		/**
		 * This Methods is called  when ever oData Service Fails, it shows a Dialog box with the reson for failure
		 * @public
		 * @param (oError)
		 */

		failService: function(oError) {
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
				sMessage = this.getResourceBundle().getText("MESSAGE_ERROR_OCCURED");
				sDetails = "";
			}
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: sMessage,
				details: sDetails
			});
		},

		/**
		 * This is called to cleap up or destory the Popover/ Minicart / Fragments on Exit
		 * @public
		 */

		onExit: function() {
			if (this._oPopover) {
				this._oPopover.destroy();
				this._oPopover = null;
			}
			if (this._oMiniCart) {
				this._oMiniCart.destroy();
				this._oMiniCart = null;
			}

			if (this._oContent) {
				this._oContent.destroy();
				this._oContent = null;
			}
			if (sap.ui.getCore().byId("attachmentsrv.Freetext")) {

				sap.ui.getCore().byId("attachmentsrv.ItemDetails").destroy(true);
			}
			if (this.productList) {
				this.productList.destroy();
				//	this.productList.destroyContent();
				this.productList = null;
			}
		},

		/**
		 * This is called to go back to the previous page in history & cleap up or destory the Popover/ Minicart / Fragments on back
		 * @public
		 */

		onBack: function() {
			this.oModel.refresh(true);
			this.oModel.updateBindings();

			if (this._oPopover) {
				this._oPopover.destroy();
				this._oPopover = null;
			}
			if (this._oMiniCart) {
				this._oMiniCart.destroy();
				this._oMiniCart = null;
			}
			if (sap.ui.getCore().byId("attachmentsrv.FreeText")) {

				sap.ui.getCore().byId("attachmentsrv.FreeText").destroy(true);
			}
			window.history.go(-1);
		},

		/**
		 * Convenience Method for Validatiing the Material  field at the client side
		 * Sets the value state to Error if Material is blank or empty
		 * @public
		 * @returns true if it is not empty & false when it is empty
		 */

		materialValidation: function() {
			var material = this.getView().byId("idMaterial").getValue();
			this.oModel.resetChanges();
			if (material.trim() === "" || material === null) {
				this.getView().byId("idMaterialDescription").setValueState(sap.ui.core.ValueState.None);
				// this.getView().byId("idMaterialDescription").setEnabled(true);
				// this.getView().byId("idMaterialDescription").setValue("");
				// this.getView().byId("idMaterialGroup").setEnabled(true);
				// this.getView().byId("quantity").setUomEditable(true);
				// this.getView().byId("price").setUomEditable(true);
				this.getView().setBusy(true);
				var that = this;
				this.dataManager.getMaterialPrice(this.getServiceCallParameter(function() {
					that.getView().setBusy(false);
				}, this.serviceFail), material);
				// this.getView().byId("idMaterialDescription").setValue("");
				return false;
			} else {
				this.getView().setBusy(true);
				this.dataManager.getMaterialPrice(this.getServiceCallParameter(this.successMaterialPrice, this.serviceFail), material);
				// this.dataManager.getMaterialDescription(this.getServiceCallParameter(this.successMaterial, this.serviceFail), material);
				// this.getView().byId("idMaterialDescription").setEnabled(false);
				this.getView().byId("idMaterialDescription").setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		},
		successMaterial: function(oData) {
			var prData = oData.results ? oData.results[0] : oData;
			if (prData) {

				this.materialText = prData.Material_Text;
				// if((this.materialText)
				// this.getView().byId("idMaterialDescription").setValue(this.materialText);
				// this.getView().byId("idMaterialGroup").setValue(prData.MaterialGroup);
				// this.getView().byId("idMaterialGroup").setEnabled(false);
				// this.matGrpValidation();
				// this.getView().byId("quantity").setUnitOfMeasure(prData.MaterialBaseUnit);
				// this.getView().byId("quantity").setUomEditable(false);
				this.dataManager.getMaterialPrice(this.getServiceCallParameter(this.successMaterialPrice, this.serviceFail), this.getView().byId(
					"idMaterial").getValue());
			} else {
				this.getView().setBusy(false);
			}

		},
		successMaterialGroup: function(oData) {
			var prData = oData.results ? oData.results[0] : oData;
			this.materialgroupText = prData.MaterialGroup_Text;
			if (!this.materialText) {
				this.getView().byId("idMaterialGroupText").setValue(this.materialgroupText);
			}
		},
		successMaterialPrice: function(oData) {
			var prData = oData.results ? oData.results[0] : oData;
			// this.getView().byId("price").setValue(prData.PurchaseRequisitionPrice);
			// this.getView().byId("price").setUnitOfMeasure(prData.Currency);		
			// this.getView().byId("price").setUomEditable(false);
			this.getView().setBusy(false);

		},

		/**
		 * Convenience Method for Validatiing the  Quanityt field at the client side
		 * Sets the value state to Error if Quantity is not gresater than Zero & Numeric
		 * @public
		 * @returns true/ false based on the above condition
		 */

		quantityValidation: function() {

			var quantity = this.getView().byId("quantity").getValue();
			quantity = quantity.split('.').join('');
			quantity = quantity.split(',').join('');
			quantity = quantity.split(' ').join('');    //2902438
			quantity = Number(quantity);
			if (quantity <= 0 || isNaN(quantity)) {
				this.getView().byId("quantity").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("quantity").setValueStateText(this.getResourceBundle().getText("quantityError"));
				return false;
			} else {
				this.getView().byId("quantity").setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		},

		/**
		 * Convenience Method for Validatiing the  Short Description  field at the client side
		 * Sets the value state to Error if Short Description field if it is empty
		 * @public
		 * @returns true/ false based on the above condition
		 */

		descvalidation: function() {

			var Description = this.getView().byId("idMaterialDescription").getValue();
			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var sMessage = this.getResourceBundle().getText("MESSAGE_ERROR_SHORT_TEXT");
			var shortTextMessage = new sap.ui.core.message.Message({
				message: sMessage,
				type: sap.ui.core.MessageType.Error,
				target: "/idMaterialDescription/value",
				processor: oMessageProcessor
			});

			oMessageManager.registerMessageProcessor(oMessageProcessor);
			if (Description === "" || Description === " " || Description === null) {
				var matnr = this.materialValidation();
				if (!matnr) {
					this.getView().byId("idMaterialDescription").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("idMaterialDescription").setValueStateText(sMessage);
					oMessageManager.addMessages(shortTextMessage);
				}

				return false;
			} else {
				oMessageManager.removeAllMessages();
				this.getView().byId("idMaterialDescription").setValueState(sap.ui.core.ValueState.None);
				return true;
			}

		},

		/**
		 * Convenience Method for Validatiing the  Material Group  field at the client side
		 * Sets the value state to Error if Material Group field  is not an alapha numeric character
		 * @public
		 * @returns true/ false based on the above condition
		 */

		matGrpValidation: function(oEvent) {

			var MaterialGrp = this.getView().byId("idMaterialGroup").getValue();
			//var regex = /^[a-z\d\s\:._-]+$/i;  
			var regex = /^[a-z\d\s\u003a\u005f\u002d\u002e]+$/i; //:_-.

			if (!regex.test(MaterialGrp) || MaterialGrp === "" || MaterialGrp === " " || MaterialGrp === null) {

				this.getView().byId("idMaterialGroup").setValueState(sap.ui.core.ValueState.Error);

				return false;
			} else {
				this.getView().byId("idMaterialGroup").setValueState(sap.ui.core.ValueState.None);
				this.dataManager.getMaterialGroupDescription(this.getServiceCallParameter(this.successMaterialGroup, this.serviceFail),
					MaterialGrp);
				return true;
			}

		},

		/**
		 * Convenience Method for Validatiing the  Price field at the client side
		 * Sets the value state to Error if Price is not gresater than Zero & Numeric
		 * @public
		 * @returns true/ false based on the above condition
		 */

		priceValidation: function() {

			var price = this.getView().byId("price").getValue();
			price = price.split('.').join('');
			price = price.split(',').join('');
			price = Number(price);
			if (price <= 0 || isNaN(price)) {
				this.getView().byId("price").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("price").setValueStateText(this.getResourceBundle().getText("priceError"));
				return false;
			} else if (!this.isMaterial()) {
				if (price === 0) {
					this.getView().byId("price").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("price").setValueStateText(this.getResourceBundle().getText("priceError"));
					return false;
				} else {
					return true;
				}
			} else {
				this.getView().byId("price").setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		},

		isMaterial: function() {
			var material = this.getView().byId("idMaterial").getValue();
			if (material.trim() === "" || material === null) {
				return false;
			} else {
				return true;
			}
		},

		/**
		 * Convenience Method for Validatiing the  Delivery Date field at the client side
		 * Sets the value state to Error if Delivery Date is less than  current Date
		 * @public
		 * @returns true/ false based on the above condition
		 */

		deliveryDtValidation: function() {
			var DeliveryDt;
			var sMessage;

			if (this.getView().byId("productTypeSelect").getSelectedKey() === "1") {
				DeliveryDt = this.getView().byId("idDeliveryDateRange").getValue();
				sMessage = this.getResourceBundle().getText("MESSAGE_ERROR_VALIDITY_PERIOD");
			} else {
				DeliveryDt = this.getView().byId("idDeliveryDate").getValue();
				sMessage = this.getResourceBundle().getText("MESSAGE_ERROR_DELIVERY_DATE");
			}

			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			if (!DeliveryDt) {
				oMessageManager.registerMessageProcessor(oMessageProcessor);
				var deliveryDateMessage = new sap.ui.core.message.Message({
					message: sMessage,
					type: sap.ui.core.MessageType.Error,
					target: "/idDeliveryDate/value",
					processor: oMessageProcessor
				});
				oMessageManager.addMessages(deliveryDateMessage);
				if (this.getView().byId("productTypeSelect").getSelectedKey() === "1") {

					this.getView().byId("idDeliveryDateRange").setValueState(sap.ui.core.ValueState.Error);
				} else {
					this.getView().byId("idDeliveryDate").setValueState(sap.ui.core.ValueState.Error);
				}
				return false;

			} else {
				oMessageManager.removeAllMessages();
				this.getView().byId("idDeliveryDate").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idDeliveryDateRange").setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		},

		onSupplier: function() {
			if (!this._oContent) {
				this._oContent = sap.ui.xmlfragment("ui.s2p.mm.requisition.maintain.s1.view.Supplier", this);
				this.getView().addDependent(this._oContent);

			}
			sap.ui.getCore().byId("supplier").setValue("");
			//this._oContent.getButtons()[0].setEnabled(false);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oContent);
			sap.ui.getCore().byId("supplier").setValueState(sap.ui.core.ValueState.None);
			this._oContent.open();
		},
		onUnAssign: function() {
			this.getView().byId("sourceOfSupply").removeAllContent();
			var content = new sap.m.List({
				noDataText: this.getResourceBundle().getText("supplier")
			});

			this.getView().byId("sourceOfSupply").addContent(content);
			this.getView().byId("addSupplier1").setVisible(true);
			this.bFlag = true;
		},

		onCancelSupplier: function() {
			this._oContent.close();
		},
		onSelect: function(oEvent) {
			var sKey = oEvent.getParameter("selectedKey");
			for (var i = 0; i < this._notes.length; i++) {
				if (this._notes[i].DocumentText === sKey) {
					oEvent.getParameters().item.getContent()[0].setValue(this._notes[i].PurReqnItemLongtext);

					break;

				} else {
					oEvent.getParameters().item.getContent()[0].setValue("");

				}
			}

		},
		onChange: function(oEvent) {
			var key = oEvent.getSource().getBindingContext().getProperty("DocumentText");
			var text = oEvent.getSource().getValue();
			var elementPos = this._notes.map(function(x) {
				return x.DocumentText;
			}).indexOf(key);
			var valPrice = this.getView().byId("price").getValue();
			var validity = valPrice.replace(/,/g, "");
			validity = Number(validity);
			if (isNaN(validity)) {
				this.getView().byId("price").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.getView().byId("price").setValueState(sap.ui.core.ValueState.None);
			}

			if (elementPos != '-1') {
				this._notes[elementPos].PurReqnItemLongtext = text;
				var elementPos_inner = this.batch_update.map(function(x) {
					return x.DocumentText;
				}).indexOf(key);
				if (elementPos_inner != '-1') {
					this.batch_update[elementPos_inner].PurReqnItemLongtext = text;
				} else {
					this.batch_update.push({
						DocumentText: key,
						PurReqnItemLongtext: text,
						PurReqnItemDraftUUID: this._notes[elementPos].PurReqnItemDraftUUID,
						PurReqnItemTextDraftUUID: this._notes[elementPos].PurReqnItemTextDraftUUID

					});
				}

			} else

			{

				this._notes.push({
					DocumentText: key,
					PurReqnItemLongtext: text,
					PurReqnItemDraftUUID: this.getItemDraftKey()

				});
				var elementPos_inner = this.batch_create.map(function(x) {
					return x.DocumentText;
				}).indexOf(key);
				if (elementPos_inner != '-1') {
					this.batch_create[elementPos_inner].PurReqnItemLongtext = text;
				} else {
					this.batch_create.push({
						DocumentText: key,
						PurReqnItemLongtext: text,
						PurReqnItemDraftUUID: this.getItemDraftKey()
					});
				}

			}

		},

		formartServiceTypeVisiblity: function(productType) {
			var visible = false;
			var key = 0;
			if (this.itemType != undefined) {
				key = this.itemType;
			} else {
				var selectDropDown = this.getView().byId("productTypeSelect");
				if (selectDropDown != undefined) {
					key = parseInt(selectDropDown.getSelectedKey());
				}
			}
			if (key == 1) {
				visible = true;
			}
			return visible;
		},

		formartVisiblityDateSelector: function(productType) {
			var visible = true;
			var key = 0;
			if (this.itemType != undefined) {
				key = this.itemType;
			} else {
				var selectDropDown = this.getView().byId("productTypeSelect");
				if (selectDropDown != undefined) {
					key = parseInt(selectDropDown.getSelectedKey());
				}
			}
			if (key == 1) {
				visible = false;
			}
			return visible;
		},

		DateRangeValidation: function(oEvent) {
			var dateRangeControl = oEvent.getSource();

			var isValid = oEvent.getParameter('valid');
			if (isValid === true) {
				//	oMessageManager.removeAllMessages();
				this.removeMessage("/idDeliveryDateRange/value", "dateRangeNotCorrect");
				this.getView().byId("idDeliveryDateRange").setValueState(sap.ui.core.ValueState.None);
				var sFrom = oEvent.getSource().getDateValue();
				var sTo = oEvent.getSource().getSecondDateValue();

				dateRangeControl.getBindingContext().getObject().PerformancePeriodStartDate = sFrom;
				dateRangeControl.getBindingContext().getObject().PerformancePeriodEndDate = sTo;
			} else {
				this.raiseMessage("/idDeliveryDateRange/value", "dateRangeNotCorrect", sap.ui.core.MessageType.Error,
					"MESSAGE_ERROR_DELIVERY_DATE");
				//	oMessageManager.addMessages(deliveryDateMessage);
				this.getView().byId("idDeliveryDateRange").setValueState(sap.ui.core.ValueState.Error);
			}
		},
		selectionChanged: function(oEvent) {
			var selectedKey = oEvent.getParameter('selectedItem').getKey();
			this.itemType = parseInt(selectedKey);
			if (this.itemType == 1) {
				//Changing the binding type as value is not being set properly into the model
				var categoryControl = oEvent.getSource().getBindingContext();
				oEvent.getSource().getBindingContext().oModel.setProperty("ProductType", "2", categoryControl);

			} else {
				//Changing the binding type as value is not being set properly into the model
				var categoryControl = oEvent.getSource().getBindingContext();
				oEvent.getSource().getBindingContext().oModel.setProperty("ProductType", "", categoryControl);

			}
			this.handleServiceLineDisplay(this.itemType);
		},

		handleServiceLineDisplay: function(itemType) {
			if (itemType === 1) {
				this.getView().byId("idServicePerformer").setVisible(true);
				this.getView().byId("idServicePerformer").setShowLabel(true);
				this.getView().byId("idDeliveryDateRange").setVisible(true);
				this.getView().byId("idDeliveryDate").setVisible(false);
			} else {
				this.getView().byId("idServicePerformer").setVisible(false);
				this.getView().byId("idDeliveryDateRange").setVisible(false);
				this.getView().byId("idDeliveryDate").setVisible(true);
				this.getView().byId("idDeliveryDate").setShowLabel(true);
			}
		},

		setServiceLineFieldsBlankValues: function() {
			this.getView().byId("productTypeSelect").setSelectedKey('0');
			this.getView().byId("productTypeSelect").getBindingContext().getObject().ProductType = "";
			this.getView().byId("idServicePerformer").setValue("");

		},

		raiseMessage: function(oMessageTarget, oMessageId, messageType, oMessageText) {
			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var sMessage = this.getResourceBundle().getText(oMessageText);
			var oMessageRaised = [];
			var oMessage = new sap.ui.core.message.Message({
				id: oMessageId,
				message: sMessage,
				type: messageType,
				target: oMessageTarget,
				processor: oMessageProcessor
			});
			oMessageManager.registerMessageProcessor(oMessageProcessor);
			oMessageRaised = this.isMessageAvailable(oMessageTarget, oMessageId);
			if (oMessageRaised.length == 0) {
				oMessageManager.addMessages(oMessage);
			}
		},

		isMessageAvailable: function(oMessageTarget, oMessageId) {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageRaised = [];
			if (oMessageProcessor.mMessages != undefined) {
				if (oMessageProcessor.mMessages[oMessageTarget] != undefined) {
					var oMessageArray = oMessageProcessor.mMessages[oMessageTarget];
					//	var oMessageFound = false;
					if (oMessageArray.length > 0) {
						for (var i = 0; i < oMessageArray.length; i++) {
							if (oMessageArray[i].id == oMessageId) {
								//	oMessageFound = true;
								oMessageRaised.push(oMessageArray[i]);
							}
						}
					}
				}
			}
			return oMessageRaised;
		},

		removeMessage: function(oMessageTarget, oMessageId) {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var oMessageRaised = [];
			oMessageRaised = this.isMessageAvailable(oMessageTarget, oMessageId);
			if (oMessageRaised.length > 0) {
				oMessageManager.removeMessages(oMessageRaised);
			}

		}

	});
});