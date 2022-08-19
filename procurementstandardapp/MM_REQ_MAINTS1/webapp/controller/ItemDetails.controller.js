/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.ui.message.message");
sap.ui.define([
	"ui/s2p/mm/requisition/maintain/s1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/UploadCollectionParameter',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	"ui/s2p/mm/requisition/maintain/s1/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("ui.s2p.mm.requisition.maintain.s1.controller.ItemDetails", {
		_loadattachments: function() {
			var PRNum = this.getPurchaseRequisition();
			var itemKey;
			var PRMode = 'C';
			if (!this.editable) {
				PRMode = "D";
			}

			if (PRNum) {
				while (PRNum.length < 10) {
					PRNum = "0" + PRNum;
				}
				var PRItmNum = this.prItem;
				if (PRItmNum) { //If its a new itemthat is created and an attachment is added to it PRItmNum will be initial
					itemKey = PRNum.concat(PRItmNum);
				} else {
					itemKey = this.itemDraftUUID;
				}

			} else {
				itemKey = this.itemDraftUUID;
			}
			itemKey = itemKey.replace(/-/g, "");
			var self = this.getView();
			var owner = this.getOwnerComponent();
			var attachmentView = self.byId("attachmentCompContainer");
			if ((owner._oComp !== null) && (owner._oComp) && (owner._oComp.getId() === "attachmentsrv.ItemDetails")) {
				if (owner._oComp.getProperty("objectKey") !== itemKey) {
					owner._oComp.refresh(PRMode, "EBAN", itemKey);
					owner._oComp.setObjectKey(itemKey);
			 	}	
			} else {
				owner._oComp = sap.ui.getCore().createComponent({
					name: "sap.se.mi.plm.lib.attachmentservice.attachment",
					id: "attachmentsrv.ItemDetails",
					settings: {
						mode: PRMode,
						objectKey: itemKey,
						objectType: "EBAN"
					}
				});
				owner._oComp.setMode(PRMode);
				owner._oComp.setObjectKey(itemKey);
				attachmentView.setComponent(owner._oComp);

			}
			this.prcsclPresent();
		},

		onInit: function() {
			var viewModel = new sap.ui.model.json.JSONModel();
			var mode = {
				editable: false
			};
			this.bFlag = false;
			if (this.getMode() === "edit") {

				viewModel.setData(mode);
				this.getView().byId("smartForm1").setModel(viewModel, "viewProperties");
				this.getView().byId("smartForm2").setModel(viewModel, "viewProperties");
				this.getView().byId("smartForm3").setModel(viewModel, "viewProperties");
			} else {
				mode = {
					editable: true
				};
				viewModel.setData(mode);
				this.getView().byId("smartForm1").setModel(viewModel, "viewProperties");
				this.getView().byId("smartForm2").setModel(viewModel, "viewProperties");
				this.getView().byId("smartForm3").setModel(viewModel, "viewProperties");
			}
			this.getView().setBusyIndicatorDelay(0);
			this.getView().setBusy(true);

			this._notes = [];
			this.batch_update = [];
			this.batch_create = [];
			this.accSection = false;

			this.oModel = this.getAppModel();
			this.oModel.setSizeLimit(500);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("ItemDetails").attachPatternMatched(this._onObjectMatched, this);

			var oModel = new sap.ui.model.json.JSONModel({
				"Salutation": [{
					"Key": "0001",
					"Name": "Ms."
				}, {
					"Key": "0002",
					"Name": "Mr."
				}, {
					"Key": "0003",
					"Name": "Company"
				}, {
					"Key": "0004",
					"Name": "Mr. and Mrs."
				}]
			});
			this.getView().setModel(oModel, "Title");
		},

		_onObjectMatched: function(oEvent) {
			this.readItemTextTypesMasterSet();
			if (this.getOwnerComponent().getComponentData().changingSourcePageAllowed) {
				this.setSourcePage("ItemDetails");
			}

			this.save = false;
			this.accSection = false;
			this.supplierNamesos = "";
			if (this._oContent_Supplier) {
				this._oContent_Supplier.destroy(true);
				this._oContent_Supplier = null;
			}

			if (this.productList) {
				this.productList.destroy(true);
				this.productList = null;
			}
			if (this._ocontent) {
				this._ocontent.destroy(true);
				this._ocontent = null;
			}

			this.setHeaderDraftKey(oEvent.getParameter("arguments").DraftKey);
			this.setPurchaseRequisition(oEvent.getParameter("arguments").PurchaseRequisition);
			this.itemDraftUUID = oEvent.getParameter("arguments").PurReqnItemDraftUUID;
			this.getOwnerComponent().getComponentData().purReqnItemDraft = this.itemDraftUUID;
			this.itmKey = oEvent.getParameter("arguments").OpnCtlgItemID;
			this.prItem = oEvent.getParameter("arguments").PurchaseRequisitionItem;
			this.getOwnerComponent().getComponentData().purReqnItem = this.prItem;
			this.itemPath = oEvent.getParameter("arguments").items;
			if (oEvent.getParameter("arguments").Editable === "true") {
				this.editable = true;
			} else {
				this.editable = false;
			}
			// this.editable = oEvent.getParameter("arguments").Editable;
			this.getOwnerComponent().getComponentData().PRitemPath = this.itemPath;
			this.itemBindingPath = "/" + this.itemPath + "/" + "to_PurReqnAccAssignment_WD";

			var sName = oEvent.getParameter("name");
			if (sName === "ItemDetails") {
				this._loadattachments();
			}

			this.getView().byId("smartForm1").bindElement({
				path: "/" + this.itemPath

			});
			this.getView().byId("smartForm2").bindElement({
				path: "/" + this.itemPath

			});
			// this.getDraftAccountId();
			this.checkAccAssignment();
			this.getApprovalPreviewSet();
			this.dataManager.getNotes(this.getServiceCallParameter(this.onSuccessNotes, this.serviceFail), this.itemDraftUUID, this.getPurchaseRequisition(),
				this.prItem);
			this.bFlag = false;
			this.showSource();
			var checkMaterial = this.getView().byId("smartForm1").getBindingContext().getObject().Material;
			if ((checkMaterial === "") || (checkMaterial === null)) {
				this.getView().byId("idMaterialDescription").setEnabled(true);
			} else {
				this.getView().byId("idMaterialDescription").setEnabled(false);
			}
			if (this.getPurchaseRequisition()) {
				this.getView().byId("addSupplier").setEnabled(this.getView().byId("idDescription").getEditable());
			}
			this.deletable = this.getView().byId("smartForm1").getBindingContext().getObject().delete_ac;
			this.getView().byId("idDeleteButton").setEnabled(this.deletable);
			this.getView().byId("idSaveButton").setEnabled(this.deletable);
			if (this.getPurchaseRequisition()) {
				if (sap.ui.getCore().byId("itemProcessFlow")) {
					sap.ui.getCore().byId("itemProcessFlow").destroy();
				}
				this.showItemStatus();
			}
			var mParameters = this.getServiceCallParameter(this.successItemDetails, this.errorServiceFail);
			this.dataManager.getItemDetails(mParameters, this.getHeaderDraftKey(), this.itemDraftUUID, this.getPurchaseRequisition(), this.prItem);
		},
		checkAccAssignment: function() {
			var accAssignCategory = this.getView().byId("smartForm1").getBindingContext().getProperty('AccountAssignmentCategory');
			var plant = this.getView().byId("smartForm1").getBindingContext().getProperty('Plant');
			if ((accAssignCategory === null) || (accAssignCategory === "") || (plant === null) || (plant === "")) {
				this.getView().byId("listAccAssignment").setVisible(false);
				this.getView().byId("formAccAssignment").setVisible(false);
				this.getView().setBusy(false);
			} else {
				this.dataManager.getAccAssignmentValue(this.getServiceCallParameter(this.checkAccountCategory, this.serviceFail),
					accAssignCategory);
			}

		},
		checkAccountCategory: function(data) {
			if (data.results[0] !== undefined) {

				this.accValue = data.results[0].ConsumptionPosting;
				if ((this.accValue === 'U') || (this.accValue === "")) {
					this.getView().byId("listAccAssignment").setVisible(false);
					this.getView().byId("formAccAssignment").setVisible(false);
					this.getView().setBusy(false);
					this.accSection = false;
				} else {
					// this.getView().getModel().refresh();
					this.getView().byId("listAccAssignment").setVisible(true);
					this.createAccComponent();
					this.sFin = false;
					if (this.sFin === true) {
						this.getView().byId("sFinlistAccAssignment").setVisible(true);
						this.createAccComponentsFin();
					}
					this.getView().setBusy(false);
					this.accSection = true;

				}
			} else {
				this.getView().byId("listAccAssignment").setVisible(false);
				this.getView().setBusy(false);
			}

		},
		createAccComponentsFin: function() {
			var sFinaccAssignComp = sap.ui.getCore().createComponent({
				"name": "sap.fin.acc.lib.codingblock.component",
				componentData: {
					"entitySetName": "C_Sspprmaint_Accassign",
					"entityTypeName": "C_Sspprmaint_AccassignType",
					"parentEntitySetName": "C_Sspprmaint_Itm",
					"parentEntityKey": {
						"PurchaseRequisition": this.getPurchaseRequisition(),
						"PurchaseRequisitionItem": this.prItem,
						"PurReqnItemDraftUUID": this.itemDraftUUID
					},
					"navigationName": "to_PurReqnAccAssignment_WD",
					"UIMode": "TABLE",
					"enableRowEditButtons": false
				}
			});
			//	accAssignComp.attachDetailNavigation(jQuery.proxy(this.accDetailsnavigation, this));
			sFinaccAssignComp.attachCodingBlockAttributeChanged(jQuery.proxy(this.onCodingBlockChange, this));
			this.getView().byId("sFinaccAssignmentCompContainer").setComponent(sFinaccAssignComp);
			//	this.accAssignComp = accAssignComp;

		},
		onCodingBlockChange: function(oEvent) {
			//this.onSmartFieldValueChange(oEvent.getParameter("codingBlockEvent"));
			var OData = oEvent.getParameter("codingBlockEvent").getSource().getModel().getData(oEvent.getParameter("codingBlockEvent").getSource()
				.getBindingContext()
				.sPath);
			var prop;
			try {
				delete OData.HasDraftEntity;
				delete OData.DraftAdministrativeDataUUID;
				delete OData.IsActiveEntity;
				delete OData.HasActiveEntity;
				delete OData.MultipleAcctAssgmtDistrPercent;
				delete OData.CompanyCode;
				delete OData.CostElement;
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

			var path = oEvent.getParameter("codingBlockEvent").getSource().getBindingContext().sPath;
			//this.onSmartFieldValueChange(oEvent.getParameter("codingBlockEvent"));
			var oModel = oEvent.getParameter("codingBlockEvent").getSource().getModel();

			if (oModel) {
				oModel.update(path, OData, {
					"success": jQuery.proxy(this.successHandler, this),
					"error": jQuery.proxy(this.errorHandler, this)
				});
			}
		},

		successHandler: function(oEvent) {
			sap.m.MessageToast.show(this.oTextBundle.getText("updateSuccess"));
			oEvent.getParameter("codingBlockEvent").getSource().getModel().refresh();

		},
		errorHandler: function() {
			//alert("fail");
		},

		netPriceValidation: function() {
			var quantity = this.getView().byId("idNetPriceQuantity").getValue();
			quantity = quantity.split('.').join('');
			quantity = quantity.split(',').join('');
			quantity = Number(quantity);
			if (quantity <= 0 || isNaN(quantity)) {
				this.getView().byId("idNetPriceQuantity").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("idNetPriceQuantity").setValueStateText(this.getResourceBundle().getText("quantityError"));
				return false;
			} else {
				this.getView().byId("idNetPriceQuantity").setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		},

		priceValidation: function() {

			var price = this.getView().byId("idPrice").getValue();
			price = price.split('.').join('');
			price = price.split(',').join('');
			price = Number(price);
			if (price <= 0 || isNaN(price)) {
				this.getView().byId("idPrice").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("idPrice").setValueStateText(this.getResourceBundle().getText("priceError"));
				return false;
			} else {
				this.getView().byId("idPrice").setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		},

		quantityValidation: function() {

			var quantity = this.getView().byId("idDescription").getValue();
			quantity = quantity.split('.').join('');
			quantity = quantity.split(',').join('');
			quantity = Number(quantity);
			if (quantity <= 0 || isNaN(quantity)) {
				this.getView().byId("idDescription").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("idDescription").setValueStateText(this.getResourceBundle().getText("quantityError"));
				return false;
			} else {
				this.getView().byId("idDescription").setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		},

		//Validation logic for mandatory feilds before item save.
		mandatoryFieldValidation: function() {
			var oData = this.getView().byId("smartForm1").getModel().getData("/" + this.itemPath);
			//WorkAround - Get form fields data for cross reference.
			var oDataRef = {};
			var smartFields = this.getView().byId("smartForm1").getSmartFields();
			for (var i = 0; i < smartFields.length; i++) {
				var key = smartFields[i].getDataProperty().typePath;
				var value = smartFields[i].getValue();
				oDataRef[key] = value;
				// Get Base Unit
				if (key === "NetPriceQuantity" || key === "RequestedQuantity") {
					oDataRef["BaseUnit"] = smartFields[i].getUnitOfMeasure();
				}
			}
			var allKeys = Object.keys(oData); //All keys in oData.
			for (i = 0; i < allKeys.length; i++) {
				key = allKeys[i].split("_"); // Split current Keys based on '_'.
				if (key[key.length - 1] === "fc") { // Check current key has 'fc'.
					if (oData[allKeys[i]] === 7) { // Check current key is MANDATORY.
						if (!oDataRef[key[0]]) { // Check if data for key from form is empty.
							return false;
						}
					}
				}
			}
			if ((oData['Plant_fc'] === 7) && this.getView().byId('idCompany').getValue() == '') // Plant and Company code have same FC
			{
				return false;
			}
			return true; //return TRUE if all mandatory feilds are not EMPTY.
		},

		getApprovalPreviewSet: function() {
			var prNum = this.getPurchaseRequisition();
			if (prNum.length !== 0) {
				this.dataManager.getApprovalPreviewSet(this.getServiceCallParameter(this.showApprovalPreview, this.serviceFail), prNum,
					this.prItem);
			} else {
				this.getView().byId("processflow2").setVisible(false);
				this.destroyContent("processflow2");
			}
		},

		getDraftAccountId: function() {
			this.getView().byId("smartForm3").setBusy(true);
			this.dataManager.getDraftAccountID(this.getServiceCallParameter(this.showAccountAssignment, this.serviceFail), this.itemDraftUUID,
				this.getPurchaseRequisition(), this.prItem);
		},
		showAccountAssignment: function(data) {

			this.getView().setBusy(false);

			if (data.results[0]) {
				var sUrl = data.results[0].__metadata.id;
				var result = sUrl.split("/");
				this.bindingPath = "/" + result[result.length - 1];
			}

			this.getView().byId("smartForm3").bindElement(this.bindingPath);
			this.getView().byId("smartForm3").setBusy(false);
			var accountAssignmentCategory = this.getView().byId("accAssCategory").getValue();

			// if (accountAssignmentCategory === "K" || accountAssignmentCategory === "F" || accountAssignmentCategory === "N")

			// {

			// 	this.getCostCentreText();
			// 	this.glAccountDescription();
			// } else {

			// 	this.glAccountDescription();

			// }

		},

		getCostCentreText: function() {
			this.getView().byId("costCenterDesc").setVisible(true);
			this.controllingArea = this.getView().byId("controllingArea").getValue();
			this.costCentre = this.getView().byId("costCenter").getValue();
			if ((this.controllingArea == "")) {
				this.dataManager.getCostCentreDescription(this.getServiceCallParameter(this.getCostCentreDesc, this.serviceFail), this.costCentre);
			} else {
				this.getCostCentreDescByCntrlArea();
			}

		},

		getCostCentreDesc: function(oData) {
			this.getView().byId("costCenterDesc").setVisible(true);
			var prData = oData.results ? oData.results[0] : oData;
			this.costCentreText = prData.CostCenter_Text;
			this.getView().byId("costCenterDesc").setValue(this.costCentreText);

		},
		getCostCentreDescByCntrlArea: function() {
			this.dataManager.getCostCentreDescByControllingArea(this.getServiceCallParameter(this.getCostCentreTextByCntrlArea, this.serviceFail),
				this.controllingArea, this.costCentre);
		},
		getCostCentreTextByCntrlArea: function(oData) {
			var prData = oData.results ? oData.results[0] : oData;
			this.costCentreTextByCntrlArea = prData.CostCenter_Text;
			this.getView().byId("costCenterDesc").setValue(this.costCentreTextByCntrlArea);
		},
		glAccountDescription: function() {
			this.companyCode = this.getView().byId("idCompany").getValue();
			this.glAccount = this.getView().byId("glaAccount").getValue();
			this.dataManager.getCostCentreDescription(this.getServiceCallParameter(this.getGLAccountDesc, this.serviceFail), this.companyCode,
				this.glAccount);
		},
		getGLAccountDesc: function(oData) {
			var prData = oData.results ? oData.results[0] : oData;
			this.glAccountText = prData.GLAccount_Text;
			this.getView().byId("lblGLAccount").setValue(this.glAccountText);
			this.getView().byId("lblGLAccount").setVisible(true);
		},
		showApprovalPreview: function(data) {
			if (data.results.length !== 0) {
				//		var approvalData = data.results ? data.results : data;
				var approvalData = data.results;
				var oDataLanes = {};
				var oDataProcessFlow = [];
				var len = data.results.length;
				for (var i = 0; i < len; i++) {
					var lanes = {};
					lanes.id = i;
					lanes.icon = "sap-icon://order-status";
					lanes.label = approvalData[i].toApprover.results[0].Stext;
					lanes.Userid = approvalData[i].toApprover.results[0].Objid;
					lanes.UserType = approvalData[i].toApprover.results[0].Otype;
					lanes.position = i;
					oDataProcessFlow.push(lanes);
				}
				oDataLanes.oDataProcessFlow = oDataProcessFlow;
				var oModelPf2 = new sap.ui.model.json.JSONModel();
				oModelPf2.setData(oDataLanes);
				this.getView().byId("processflow1").setModel(oModelPf2, "pf2");
			} else {
				this.getView().byId("processflow2").setVisible(false);
				this.destroyContent("processflow2");
			}

		},

		onApproverClick: function(oEvent) {
			this.oEventSrc = oEvent.getSource();
			var sApproverId = this.byId('processflow1').getModel().getProperty('Userid', oEvent.getSource().getBindingContext());
			this.dataManager.getApproverDetails(this.getServiceCallParameter(this.openApproverBusinessCard, this.serviceFail),
				sApproverId, this.getPurchaseRequisition(), this.prItem);
		},
		openApproverBusinessCard: function(data) {
			var oJSModelApprover = new sap.ui.model.json.JSONModel(data);
			if (!this._oApproverPopover) {
				this._oApproverPopover = sap.ui.xmlfragment("F1600.view.approverBusinessCard", this);
				this.getView().addDependent(this._oApproverPopover);
			}

			this._oApproverPopover.setModel(oJSModelApprover);
			this._oApproverPopover.setContentHeight('auto');
			this._oApproverPopover.openBy(this.oEventSrc);
		},
		onCallBusinessCard: function(oEvent) {
			sap.m.URLHelper.triggerTel(oEvent.getSource().getText());
		},

		onEmailBusinessCard: function(oEvent) {
			sap.m.URLHelper.triggerEmail(oEvent.getSource().getText());
		},
		/**
		 * Convenience Method for Validatiing the Material  field at the client side
		 * Sets the value state to Error if Material is blank or empty
		 * @public
		 * @returns true if it is not empty & false when it is empty
		 */

		materialValidation: function() {
			var material = this.getView().byId("idProductId").getValue();

			if (material === "") {
				this.saveItem();
				this.getView().byId("idMaterialDescription").setEnabled(true);
				this.getView().byId("idMaterialDescription").setValue("");
				this.getView().byId("idName").setEnabled(true);

			} else {
				this.dataManager.getMaterialDescription(this.getServiceCallParameter(this.successMaterial, this.serviceFail), material);
				this.getView().byId("idMaterialDescription").setEnabled(false);
			}
		},
		successMaterial: function(oData) {
			var prData = oData.results ? oData.results[0] : oData;
			this.materialText = prData.Material_Text;
			this.getView().byId("idMaterialDescription").setValue(this.materialText);
			this.getView().byId("idName").setValue(prData.MaterialGroup);
			this.getView().byId("idName").setEnabled(false);
			// this.getView().byId("idDescription").setUnitOfMeasure(prData.MaterialBaseUnit);
			this.saveItem(); // triggers determinations to get price for the new material

		},

		showSource: function() {
			this.material = this.getView().byId("smartForm1").getBindingContext().getProperty("Material");
			this.plant = this.getView().byId("smartForm1").getBindingContext().getProperty("Plant");
           var materialgrp;                 																		//^2936756
            if (this.getView().byId("smartForm1").getBindingContext().getProperty("MaterialGroup")) {
            materialgrp = this.getView().byId("smartForm1").getBindingContext().getProperty("MaterialGroup");
           }
           var deliverydate ;
           if (this.getView().byId("smartForm1").getBindingContext().getProperty("DeliveryDate")) {
            deliverydate = this.getView().byId("smartForm1").getBindingContext().getProperty("DeliveryDate");       //v2936756
          }
			var fixedSupplierValue = this.getView().byId("smartForm1").getBindingContext().getProperty("FixedSupplier");
			var purchasingInfoRecordValue = this.getView().byId("smartForm1").getBindingContext().getProperty("PurchasingInfoRecord");
			var purchaseContractValue = this.getView().byId("smartForm1").getBindingContext().getProperty("PurchaseContract");
			var purchaseContractItemValue = this.getView().byId("smartForm1").getBindingContext().getProperty("PurchaseContractItem");
			var supplierValue = this.getView().byId("smartForm1").getBindingContext().getProperty("Supplier");
			var oData = this.getView().byId("smartForm1").getModel().getData("/" + this.itemPath);
			// var titleKey = oData.FormOfAddress;
			// this.getView().byId("idTitle").setValue(titleKey);

			if (((fixedSupplierValue === '') || (fixedSupplierValue === undefined)) & ((purchasingInfoRecordValue === '') || (
					purchasingInfoRecordValue === undefined)) & ((purchaseContractValue === '') || (purchaseContractValue === undefined)) &
				((purchaseContractItemValue === '') || (purchaseContractItemValue === undefined) || (purchaseContractItemValue === '00000')) & ((
					supplierValue === '') || (supplierValue === undefined))) {
				this.getView().byId("addSupplier").setVisible(true);
				if (!this._ocontent) {
					this._ocontent = sap.ui.xmlfragment("ui.s2p.mm.requisition.maintain.s1.view.SourceOfSupply", this);

				}
				this.getView().byId("sourceOfSupply").removeAllContent();
				this.getView().byId("sourceOfSupply").addContent(this._ocontent);
				var tableBinding = sap.ui.getCore().byId("idProductsTable").getBinding("items");
				var afilter = [];
				afilter.push(new sap.ui.model.Filter("Material", "EQ", this.material));
				afilter.push(new sap.ui.model.Filter("Plant", "EQ", this.plant));
				afilter.push(new sap.ui.model.Filter("Materialgroup", "EQ", materialgrp));      //2936756
				afilter.push(new sap.ui.model.Filter("Deliverydate", "EQ", deliverydate));      //2936756
				tableBinding.filter(afilter);

			} else {
				this.getView().byId("sourceOfSupply").removeAllContent();
				var FixedSupplier = this.getView().byId("smartForm1").getBindingContext().getProperty("FixedSupplier");
				var supplier = this.getView().byId("smartForm1").getBindingContext().getProperty("Supplier");
				var catalogItem = this.getView().byId("smartForm1").getBindingContext().getProperty("PurReqnSSPCatalog");

				if (FixedSupplier !== '') {
					this.text = this.getResourceBundle().getText("Fixed");
					this.sText = FixedSupplier;

				} else if (supplier !== '') {
					this.text = this.getResourceBundle().getText("Preferred");
					this.sText = supplier;
				}

				this.dataManager.getSupplierName(this.getServiceCallParameter(this.successSupplier, this.serviceFail), this.sText);

				if (!this.productList) {
					this.productList = sap.ui.xmlfragment("ui.s2p.mm.requisition.maintain.s1.view.AssignedSupplier", this);
					this.getView().addDependent(this.productList);
				}

				this.getView().byId("sourceOfSupply").addContent(this.productList);
				// this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[1].getItems()[0].getAttributes()[0].setText(this.supplierNamesos);
				this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[1].getItems()[0].getAttributes()[1].setText(this.sText);
				this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[1].getItems()[0].getAttributes()[2].setText(this.text);
				this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[2].setText(this.getResourceBundle().getText(
					"assigned"));
				this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[4].setType("Reject");
				if (!(catalogItem === "")) {
					this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[4].setVisible(false);
					this.getView().byId("addSupplier").setVisible(false);
				} else {
					this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[4].setVisible(true);
					this.getView().byId("addSupplier").setVisible(true);
				}

			}

		},
		onUpdateFinished: function() {

			var itemCount = sap.ui.getCore().byId("idProductsTable").getItems().length;
			if (itemCount === 1) {
				sap.ui.getCore().byId("idProductsTable").getItems()[0].getCells()[4].setType("Reject");
				sap.ui.getCore().byId("idProductsTable").getItems()[0].getCells()[4].setText(this.getResourceBundle().getText("Unassign"));
				sap.ui.getCore().byId("idProductsTable").getItems()[0].getCells()[2].setText(this.getResourceBundle().getText(
					"assigned"));
				this.Fixedsupplier1 = sap.ui.getCore().byId("idProductsTable").getItems()[0].getCells()[1].getItems()[0].getAttributes()[1].getText();
				this.Supplier1 = "";

			}
			if (this.getPurchaseRequisition()) {
				for (var i = 0; i < itemCount; i++) {
					sap.ui.getCore().byId("idProductsTable").getItems()[i].getCells()[4].setEnabled(this.editable);
				}
			}

		},
		disableSections: function(oEvent) {
			if ((this.getPurchaseRequisition()) && (oEvent.getSource().getEditable() === false)) {
				this.getView().byId("textArea").setEnabled(false);
				this.getView().byId("addSupplier").setEnabled(false);
				// 	this.getView().byId("idDeleteButton").setEnabled(false);
				// 	this.getView().byId("idSaveButton").setEnabled(false);
			}
		},

		successSupplier: function(oData) {
			this.getView().byId("sourceOfSupply").setBusy(true);
			var prData = oData.results ? oData.results[0] : oData;
			if (prData) {
				this.supplierNamesos = prData.SupplierName;
				// this.getView().byId("sourceOfSupply").addContent(this.productList);
				this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[1].getItems()[0].getAttributes()[0].setText(this.supplierNamesos);
			}
			this.getView().byId("sourceOfSupply").setBusy(false);
		},

		cartService: function() {
			this.dataManager.updateHeaderSuccess(this.getView().byId("btnCart"), [this.getPurchaseRequisition(), "guid'" + this.getHeaderDraftKey() +
				"'"
			]);
			// this.getView().byId("btnCart").bindElement("/" + this.entityConstants.getEntityName('headerEntity') + "(PurchaseRequisition='" +
			// 	this.getPurchaseRequisition() + "',PurReqnDraftUUID=guid'" + this.getHeaderDraftKey() + "')");

		},

		onPressSave: function(oEvent) {
			var titleKey = this.getView().byId("idTitle").getValue();

			if (this.priceValidation() && this.quantityValidation() && this.netPriceValidation() && this.mandatoryFieldValidation()) {
				// if (true) {
				var oData = this.getView().byId("smartForm1").getModel().getData("/" + this.itemPath);

				if (!(this.Fixedsupplier1 === undefined)) {
					oData.FixedSupplier = this.Fixedsupplier1;

				}
				//else {
				//            oData.FixedSupplier = "";
				// }

				if (!(this.Supplier1 === undefined)) {
					oData.Supplier = this.Supplier1;
				}
				//  else {
				//            oData.Supplier = "";
				// }

				if (this.bFlag) {
					oData.FixedSupplier = "";
					oData.Supplier = "";
				}

			/*	if (this.oProductType != undefined) {
					oData.ProductType = this.oProductType;
				}*/
				if (oData.PurchasingDocumentItemCategory == "9") {
					oData.PurchasingDocumentItemCategory = "";
				}

				oData.FormOfAddress = titleKey;
				this.getView().setBusy(true);

				var oDataModel_Notes = this.entityConstants.getServiceName("purchaseRequisition");
				var oDataModel_Notes_Model = new sap.ui.model.odata.ODataModel(oDataModel_Notes);
				var mParameters1 = {
					"success": jQuery.proxy(this.successOnUpdate, this)
				};
				this.captureItemNoteTextsChanges();
				for (var i = 0; i < this.batch_update.length; i++) {
					this.dataManager.updateNotes(this.getServiceCallParameter(this.successOnUpdate, this.serviceFail), oDataModel_Notes_Model,
						this.batch_update[i].PurReqnItemTextDraftUUID, this.getPurchaseRequisition(), this.batch_update[i], this.prItem);

				}

				for (i = 0; i < this.batch_create.length; i++) {
					this.dataManager.createNotes(this.getServiceCallParameter(this.successOnUpdate, this.serviceFail), oDataModel_Notes_Model,
						this.itemDraftUUID, this.getPurchaseRequisition(), this.batch_create[i], this.prItem);

				}
				oData = this.adjustPayload(oData);
				this.dataManager.updateItemDetails(this.getServiceCallParameter(this.successItemUpdate, this.serviceFail), this.itemDraftUUID,
					this.getPurchaseRequisition(), oData, this.prItem);
				// }
				
				this.dataManager.getNotes(this.getServiceCallParameter(this.onSuccessNotes, this.serviceFail), this.itemDraftUUID, this.getPurchaseRequisition(),
					this.prItem);
			}
		},
		updateAccAssignment: function() {
			if (this.accSection) {
				var oData = this.getAppModel().getData(this.getView().byId("smartForm3").getBindingContext().getPath());
				try {
					delete oData.HasActiveEntity;
					delete oData.HasDraftEntity;
					delete oData.IsActiveEntity;

					for (var prop in oData) {
						if (prop.search('UxFc') !== -1) {
							delete oData[prop];
						}
					}

					delete oData.MultipleAcctAssgmtDistrPercent;
					delete oData.CompanyCode;
					delete oData.CostElement;
				} catch (e) { //do nothing
				}

				this.dataManager.updateAccountAssignment(this.getServiceCallParameter(this.successUpdate, this.serviceFail), this.draftAccountID,
					this.getPurchaseRequisition(), oData, this.prItem, this.bindingPath);
			} else {
				this.successUpdate();
			}

		},
		successUpdate: function() {
			this.getView().setBusy(false);
			sap.m.MessageToast.show(this.getResourceBundle().getText("update"));
			this.bFlag = false;
			this.save = true;
		},

		successItemUpdate: function() {
			if (this.accSection) {
				this.accAssignComp.updateAccList(this.successAccUpdate, this.serviceFail, this);
			} else {
				this.successUpdate();
			}
			this.oModel.resetChanges();
		},
		successAccUpdate: function(obj) {

			obj.getView().setBusy(false);
			sap.m.MessageToast.show(obj.getResourceBundle().getText("update"));
			obj.bFlag = false;
			obj.save = true;
		},

		// onAssign: function(oEvent) {

		// 	if (oEvent.getSource().getText() === "Assign") {
		// 		oEvent.getSource().setType("Reject");
		// 		oEvent.getSource().setText("Unassign");
		// 		sap.ui.getCore().byId("State-idProductsTable-" + oEvent.getSource().toString().slice(-1)).setText("Assigned");
		// 	} else {
		// 		oEvent.getSource().setType("Default");
		// 		oEvent.getSource().setText("Assign");
		// 		sap.ui.getCore().byId("State-idProductsTable-" + oEvent.getSource().toString().slice(-1)).setText("");
		// 	}

		// 	this.Fixedsupplier = oEvent.getSource().getBindingContext().getProperty("Fixedsupplier");
		// 	this.Supplier = oEvent.getSource().getBindingContext().getProperty("Supplyingvendorname").substr(0, 9);
		// },

		onSupplier: function() {
			var checkItemCount, checkStatus;
			var status = this.getResourceBundle().getText("assigned");
			this.cFlag = true;
			if (sap.ui.getCore().byId("idProductsTable")) {

				checkItemCount = sap.ui.getCore().byId("idProductsTable").getItems().length;
				for (var i = 0; i <= checkItemCount - 1; i++) {

					if (status === sap.ui.getCore().byId("idProductsTable").getItems()[i].getCells()[2].getText()) {

						checkStatus = this.getResourceBundle().getText("assigned");
						break;
					}

				}
			} else {
				checkItemCount = this.getView().byId("sourceOfSupply").getContent()[0].getItems().length;
				for (var a = 0; a <= checkItemCount - 1; a++) {

					if (status === this.getView().byId("sourceOfSupply").getContent()[0].getItems()[a].getCells()[2].getText()) {

						checkStatus = this.getResourceBundle().getText("assigned");
						break;
					}

				}
			}

			for (var c = 0; c <= checkItemCount - 1; c++) {

				if (status === checkStatus) {
					sap.m.MessageToast.show(this.getResourceBundle().getText("unAssignMessage"));
					this.cFlag = false;
					break;
				}

			}
			if (this.cFlag) {
				if (!this._oContent_Supplier) {
					this._oContent_Supplier = sap.ui.xmlfragment("ui.s2p.mm.requisition.maintain.s1.view.Supplier", this);
					sap.ui.getCore().byId('simpleForm').bindElement({
						path: "/" + this.itemPath
					});
					this.getView().addDependent(this._oContent_Supplier);
				}
				sap.ui.getCore().byId("supplier").setValue("");
				this._oContent_Supplier.getButtons()[0].setEnabled(true);
				var itemId = this.getView().byId("smartForm1").getBindingContext().getProperty("PurReqnItemDraftUUID");
				this._oContent_Supplier.bindElement("/" + this.entityConstants.getEntityName('itemEntity') +
					"(PurchaseRequisition='',PurchaseRequisitionItem='00000',PurReqnItemDraftUUID=guid'" +
					itemId + "')");
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oContent_Supplier);
				this._oContent_Supplier.open();
				this.getView().byId("sourceOfSupply").removeContent();
			}

		},
		onAddSupplier: function(oEvent) {
			this.getView().byId("sourceOfSupply").removeContent();
			this.sText = "";
			this.sText = sap.ui.getCore().byId("supplier").getValue();
			var preferred = sap.ui.getCore().byId("preferred").getSelected();
			// var fixed = sap.ui.getCore().byId("fixed").getSelected();

			if (preferred === true) {
				this.text = sap.ui.getCore().byId("preferred").getText();
				this.Supplier = this.sText;
				this.Fixedsupplier = "";
			} else {
				this.text = sap.ui.getCore().byId("fixed").getText();
				this.Fixedsupplier = this.sText;
				this.Supplier = "";
			}

			if (!this.productList) {
				this.productList = sap.ui.xmlfragment("ui.s2p.mm.requisition.maintain.s1.view.AssignedSupplier", this);
				this.getView().addDependent(this.productList);
			}

			var supplierId = sap.ui.getCore().byId("supplier");
			var supplierNameoData = supplierId.getBindingContext().getModel().oData;

			// if (MaterialGrp.search(" -- ")>0){
			var supplierEntity = "I_Supplier('" + this.sText + "')";
			var supplierName = supplierNameoData[supplierEntity].SupplierName;

			// oEvent.getSource().getParent().getParent().getParent().byId("sourceOfSupply").removeAllContent();
			this.getView().byId("sourceOfSupply").removeAllContent();
			this.getView().byId("addSupplier").setVisible(false);
			this.getView().byId("sourceOfSupply").addContent(this.productList);
			this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[1].getItems()[0].getAttributes()[0].setText(
				supplierName);
			this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[1].getItems()[0].getAttributes()[1].setText(this.sText);
			this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[1].getItems()[0].getAttributes()[2].setText(this.text);
			this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[2].setText(this.getResourceBundle().getText(
				"assigned"));
			this.getView().byId("sourceOfSupply").getContent()[0].getItems()[0].getCells()[4].setType("Reject");
			this.Fixedsupplier1 = this.Fixedsupplier;
			this.Supplier1 = this.Supplier;
			this.bFlag = false;
			this._oContent_Supplier.close();
		},

		onCancelSupplier: function() {
			this._oContent_Supplier.close();
		},
		onUnAssign: function() {
			this.getView().byId("sourceOfSupply").removeAllContent();
			var content = new sap.m.List({
				noDataText: this.getResourceBundle().getText("supplier")
			});
			this.getView().byId("addSupplier").setVisible(true);
			this.getView().byId("sourceOfSupply").addContent(content);
			var oData = this.getView().byId("smartForm1").getModel().getData("/" + this.itemPath);
			oData.FixedSupplier = "";
			oData.Supplier = "";
			this.bFlag = true;

			if (!this._ocontent) {
				this._ocontent = sap.ui.xmlfragment("ui.s2p.mm.requisition.maintain.s1.view.SourceOfSupply", this);

			}
			this.getView().byId("sourceOfSupply").removeAllContent();
			this.getView().byId("sourceOfSupply").addContent(this._ocontent);
			var tableBinding = sap.ui.getCore().byId("idProductsTable").getBinding("items");
			var afilter = [];
			afilter.push(new sap.ui.model.Filter("Material", "EQ", this.material));
			afilter.push(new sap.ui.model.Filter("Plant", "EQ", this.plant));
			tableBinding.filter(afilter);

		},

		onSelect: function(oEvent) {
			var sKey = oEvent.getParameter("selectedKey");
			oEvent.getParameters().item.getContent()[0].setValue(""); 
			for (var i = 0; i < this._notes.length; i++) {
				if (this._notes[i].DocumentText === sKey) {
					oEvent.getParameters().item.getContent()[0].setValue(this._notes[i].PurReqnItemLongtext);
					if ((this.getPurchaseRequisition()) && (!this.getView().byId("idDescription").getEditable())) {
						oEvent.getParameters().item.getContent()[0].setEnabled(false);
					}

					break;

				} else {
					oEvent.getParameters().item.getContent()[0].setValue("");
					if ((this.getPurchaseRequisition()) && (!this.getView().byId("idDescription").getEditable())) {
						oEvent.getParameters().item.getContent()[0].setEnabled(false);
					}
				}

			}

		},
		onChange: function(oEvent) {
			var key = oEvent.getSource().getBindingContext().getProperty("DocumentText");
			var text = oEvent.getSource().getValue();
			var index;
			var elementPos = this._notes.map(function(x) {
				return x.DocumentText;
			}).indexOf(key);
			var objectFound = this._notes[elementPos];

			var valPrice = this.getView().byId("idPrice").getValue();
			var validity = valPrice.replace(/,/g, "");
			validity = Number(validity);
			if (isNaN(validity)) {
				this.getView().byId("idPrice").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.getView().byId("idPrice").setValueState(sap.ui.core.ValueState.None);
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
						PurReqnItemDraftUUID: this.itemDraftUUID,
						PurReqnItemTextDraftUUID: this._notes[elementPos].PurReqnItemTextDraftUUID

					});
				}

			} else

			{

				this._notes.push({
					DocumentText: key,
					PurReqnItemLongtext: text,
					PurReqnItemDraftUUID: this.itemDraftUUID

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
						PurReqnItemDraftUUID: this.itemDraftUUID
					});
				}

			}

		},

		successOnUpdate: function() {
			var msgMgr = sap.ui.getCore().getMessageManager();
			var messages = msgMgr.getMessageModel().getData();
			var flag = -1;
			for (var i = 0; i < messages.length; i++) {
				if (messages[i].message && messages[i].code === "MMPUR_REQ_COMMON/022") {
					sap.m.MessageToast.show(messages[i].message);
					flag = 1;
					break;
				} else {
					flag = 0;
				}
			}

			if (flag !== 1) {
				sap.m.MessageToast.show(this.getResourceBundle().getText("itemDetailUpdate"));
			}
		},

		itemServiceFailure: function(oError) {
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
			this.getView().setBusy(false);
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: sMessage,
				details: sDetails
			});
		},

		onBack: function() {
			if (!this.mandatoryFieldValidation()) {
				sap.m.MessageToast.show(this.getResourceBundle().getText("MandatoryFields"));
				return;
			}

			// if (!this.save) {
			// 	this.oModel.resetChanges();
			// }
			if (this._oContent) {
				this._oContent.destroy();
				this._oContent = null;
			}
			var that = this;
			if (this._oContent_Supplier) {
				this._oContent_Supplier.destroy(true);
				//            this._oContent_Supplier.destroyContent();
				this._oContent_Supplier = null;
			}
			if (sap.ui.getCore().getComponent("attachmentsrv.ItemDetails")) {
				//sap.ui.getCore().getComponent("attachmentsrv.ItemDetails").destroy(true);
			}
			if (sap.ui.getCore().byId("buttonUnAssign1")) {
				sap.ui.getCore().byId("buttonUnAssign1").destroy();
			}
			if (sap.ui.getCore().byId("textArea")) {
				sap.ui.getCore().byId("textArea").destroy();
			}
			this.captureItemNoteTextsChanges();
			if (this.oModel.hasPendingChanges() || this.batch_update.length > 0 || this.batch_create.length > 0) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.show(
					this.getResourceBundle().getText("MESSAGE_DATA_LOST_POPUP"), {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: this.getResourceBundle().getText("MESSAGE_SEVERITY_WARNING"),
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								that.oModel.refresh();
								window.history.back();
							}
						},
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			} else {
				window.history.back();
			}
		},

		validateFax: function() {

			var faxregex = /^[+\-0-9()/A-Z ]+$/;
			var fax = this.getView().byId("fax").getValue();
			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var sMessage = this.getResourceBundle().getText("MESSAGE_ERROR_TELEFAX_NUMBER");
			var faxMessage = new sap.ui.core.message.Message({
				message: sMessage,
				type: sap.ui.core.MessageType.Error,
				target: "/fax/value", 
				processor: oMessageProcessor
			});

			oMessageManager.registerMessageProcessor(oMessageProcessor);

			if (fax.length === 0 || !faxregex.test(fax)) {
				oMessageManager.addMessages(faxMessage);

				this.getView().byId("fax").setValueState(sap.ui.core.ValueState.Error);
				return false;
			} else {
				oMessageManager.removeAllMessages();
				return true;

			}
		},
		
		readItemTextTypesMasterSet: function () {
			var textTypesModel = this.getView().getModel("Notes");
			if(!textTypesModel || textTypesModel === undefined){
				this.oNotesJSModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(this.oNotesJSModel, "Notes");
			}
			var odefGroup = this.getAppModel().getDeferredGroups();
			odefGroup[odefGroup.length] = "itemMetaInfoRead" ;
			this.getAppModel().setDeferredGroups(odefGroup);
			this.getAppModel().read("/C_Sspprmaint_Itmtexttypes", {
				method: "GET",
				groupId: "itemMetaInfoRead"
			});
			this.getAppModel().submitChanges({
				groupId: "itemMetaInfoRead",
				success: jQuery.proxy(this.onItemTextTypesMasterDataLoadSuccess, this),
				error: function () {}
			});
		},

		onItemTextTypesMasterDataLoadSuccess: function (oData) {
			var itemNoteTexts = [];
			if (oData.__batchResponses["0"] && oData.__batchResponses["0"].data && oData.__batchResponses["0"].data.results) {
				var noteTexts = oData.__batchResponses["0"].data.results;
				for (var i = 0; i < noteTexts.length; i++) {
					var itemNoteText = {};
					itemNoteText.key = noteTexts[i].DocumentText;
					itemNoteText.name = noteTexts[i].DocumentText_Text;
					itemNoteText.value = "";
					itemNoteTexts.push(itemNoteText);
				}
			}
			this.getView().getModel("Notes").setProperty("/itemTextTypes", itemNoteTexts);
		},
		
		onSuccessNotes: function (data) {
			this.backEndItemNoteTexts = [];
			//backup the itemNoteTextValues that are saved and retrieved from backend
			if (data.results && data.results.length > 0) {
				var bEndItemNoteTexts = data.results;
				for (var j = 0; j < bEndItemNoteTexts.length; j++) {
					var key = "";
					if (bEndItemNoteTexts[j].DocumentText !== "") {
						key = bEndItemNoteTexts[j].DocumentText;
						this.backEndItemNoteTexts[key.toString()] = bEndItemNoteTexts[j];
					} 
				}
			}

			//reset the texts in all tabs based on what comes from the backend
			var itemNoteTexts = this.getView().getModel("Notes").getProperty("/itemTextTypes");
			for (var i = 0; i < itemNoteTexts.length; i++) {
				var backEndItemNoteTextObj = this.backEndItemNoteTexts[itemNoteTexts[i].key.toString()];
				if (backEndItemNoteTextObj) {
					itemNoteTexts[i].value = backEndItemNoteTextObj.PurReqnItemLongtext;
				} else {
					itemNoteTexts[i].value = "";
				}
			}
			this.getView().getModel("Notes").setProperty("/itemTextTypes", itemNoteTexts);
			this.getView().byId("idIconTabBarNoIcons").setExpanded(true);
			this.getView().setBusy(false);
		},

		captureItemNoteTextsChanges: function () {
			this.batch_update = [];
			this.batch_create = [];

			var itemNoteTexts = this.getView().getModel("Notes").getProperty("/itemTextTypes");
			for (var i = 0; i < itemNoteTexts.length; i++) {
				var backEndItemNoteTextObj = this.backEndItemNoteTexts[itemNoteTexts[i].key.toString()];

				if (backEndItemNoteTextObj && itemNoteTexts[i].value !== backEndItemNoteTextObj.PurReqnItemLongtext) { //edit
					this.batch_update.push({
						DocumentText: itemNoteTexts[i].key,
						PurReqnItemLongtext: itemNoteTexts[i].value,
						PurReqnItemTextDraftUUID: backEndItemNoteTextObj.DraftUUID
					});
				} else if (!backEndItemNoteTextObj && itemNoteTexts[i].value !== "") { //create
					this.batch_create.push({
						DocumentText: itemNoteTexts[i].key,
						PurReqnItemLongtext: itemNoteTexts[i].value,
						ParentDraftUUID: this.itemDraftUUID
					});
				}
			}
		},
		
		onMaterialGroupUpdate: function() {
			this.getView().setBusy(true);
			var oData = this.getView().byId("smartForm1").getModel().getData("/" + this.itemPath);
			this.dataManager.updateItemDetails(this.getServiceCallParameter(this.checkAccAssignment, this.serviceFail), this.itemDraftUUID,
				this.getPurchaseRequisition(), oData, this.prItem);
		
		},
		
		validatePhone: function() {

			var phoneregex = /^[+\-0-9()/A-Z ]+$/;
			var phone = this.getView().byId("phone").getValue();
			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var sMessage = this.getResourceBundle().getText("MESSAGE_ERROR_TELEPHONE_NUMBER");
			var phoneMessage = new sap.ui.core.message.Message({
				message: sMessage,
				type: sap.ui.core.MessageType.Error,
				target: "/phone/value",
				processor: oMessageProcessor
			});

			oMessageManager.registerMessageProcessor(oMessageProcessor);

			if (phone.length === 0 || !phoneregex.test(phone)) {
				oMessageManager.addMessages(phoneMessage);

				this.getView().byId("phone").setValueState(sap.ui.core.ValueState.Error);
				return false;
			} else {
				oMessageManager.removeAllMessages();
				return true;

			}
		},
		onAssign: function(oEvent) {
			var listLength = oEvent.getSource().getParent().getParent().getItems().length;
			var status = this.getResourceBundle().getText("assigned");
			var flag = false;
			if (!(oEvent.getSource().getText() === this.getResourceBundle().getText("unAssign"))) {
				for (var i = 0; i < listLength; i++) {

					if (status === oEvent.getSource().getParent().getParent().getItems()[i].getCells()[2].getText()) {

						flag = true;
						break;
					}

				}
			}
			if (!flag) {
				if (oEvent.getSource().getText() === this.getResourceBundle().getText("assign")) {
					oEvent.getSource().getParent().getCells()[2].setText(this.getResourceBundle().getText("assigned"));
					oEvent.getSource().setText(this.getResourceBundle().getText("unAssign"));
					oEvent.getSource().setType(this.getResourceBundle().getText("reject"));
					this.Fixedsupplier1 = oEvent.getSource().getParent().getCells()[1].getItems()[0].getAttributes()[1].getText();
					this.Supplier1 = oEvent.getSource().getParent().getCells()[1].getItems()[0].getAttributes()[2].getText();
				} else {
					oEvent.getSource().getParent().getCells()[2].setText("");
					oEvent.getSource().setText(this.getResourceBundle().getText("assign"));
					oEvent.getSource().setType("Default");
					this.getView().byId("addSupplier").setVisible(true);
					this.Fixedsupplier1 = "";
					this.Supplier1 = "";
				}
			} else {
				sap.m.MessageToast.show(this.getResourceBundle().getText("unAssignMessage"));

			}

		},

		validateEmail: function() {
			var email = this.getView().byId("email").getValue();
			var mailregex = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))((\.([a-z]{2,3}))|(\.[a-z]{2,3}\.[a-z]{2,3})|(\.[a-z]{2,3}\.[a-z]{2,3}\.[a-z]{2,3}))$/;
			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var sMessage = this.getResourceBundle().getText("MESSAGE_ERROR_EMAIL");
			var emailMessage = new sap.ui.core.message.Message({
				message: sMessage,
				type: sap.ui.core.MessageType.Error,
				target: "/email/value",
				processor: oMessageProcessor
			});

			oMessageManager.registerMessageProcessor(oMessageProcessor);
			if (!mailregex.test(email) || email.length === 0) {
				oMessageManager.addMessages(emailMessage);
				this.getView().byId("email").setValueState(sap.ui.core.ValueState.Error);
				return false;
			} else {
				oMessageManager.removeAllMessages();
				return true;
			}
		},
		onAccCategoryUpdate: function() {
			var oData = this.getView().byId("smartForm1").getModel().getData("/" + this.itemPath);
			oData.FixedSupplier = this.Fixedsupplier;
			oData.Supplier = this.Supplier;
			this.getView().setBusy(true);
			this.adjustPayload(oData);
			this.dataManager.updateItemDetails(this.getServiceCallParameter(this.checkAccAssignment, this.serviceFail), this.itemDraftUUID,
				this.getPurchaseRequisition(), oData, this.prItem);

		},
		onPressDelete: function() {
			var mParameters = this.getServiceCallParameter(this.checkItemCount, this.errorServiceFail);
			this.dataManager.getHeader(mParameters, this.getHeaderDraftKey(), this.getPurchaseRequisition());
		},

		checkItemCount: function(data) {
			var that = this;
			var prData = data.results ? data.results[0] : data;
			this.itemCount = (prData.NumberOfItems);
			if (!this.getPurchaseRequisition() === '') {
				if (this.itemCount - 1 === 0) {
					sap.m.MessageBox.show(
						that.getResourceBundle().getText("msgDeleteLastItemCartMyPR"), {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: that.getResourceBundle().getText("msgBoxTitle"),
							actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
							styleClass: "sapUiSizeCompact",
							onClose: function(oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									var mparameters = that.getServiceCallParameter(that.successDelete, that.serviceFail);
									that.dataManager.deleteItem(mparameters, that.itemDraftUUID, that.getPurchaseRequisition(), that.prItem);
								}

							},
							initialFocus: sap.m.MessageBox.Action.OK
						}
					);
				} else {
					sap.m.MessageBox.show(
						that.getResourceBundle().getText("msgText"), {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: that.getResourceBundle().getText("msgBoxTitle"),
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							styleClass: "sapUiSizeCompact",
							onClose: function(oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {
									var mparameters = that.getServiceCallParameter(that.successDelete, that.serviceFail);
									that.dataManager.deleteItem(mparameters, that.itemDraftUUID, that.getPurchaseRequisition(), that.prItem);

								}

							},
							initialFocus: sap.m.MessageBox.Action.YES
						}
					);
				}
			} else {
				if (this.itemCount - 1 === 0) {
					sap.m.MessageBox.show(
						that.getResourceBundle().getText("msgDeleteLastItemCart"), {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: that.getResourceBundle().getText("msgBoxTitle"),
							actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
							styleClass: "sapUiSizeCompact",
							onClose: function(oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									var mparameters = that.getServiceCallParameter(that.successDelete, that.serviceFail);
									that.dataManager.deleteItem(mparameters, that.itemDraftUUID, that.getPurchaseRequisition(), that.prItem);
								}

							},
							initialFocus: sap.m.MessageBox.Action.OK
						}
					);
				} else {
					sap.m.MessageBox.show(
						that.getResourceBundle().getText("msgText"), {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: that.getResourceBundle().getText("msgBoxTitle"),
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							styleClass: "sapUiSizeCompact",
							onClose: function(oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {
									var mparameters = that.getServiceCallParameter(that.successDelete, that.serviceFail);
									that.dataManager.deleteItem(mparameters, that.itemDraftUUID, that.getPurchaseRequisition(), that.prItem);

								}

							},
							initialFocus: sap.m.MessageBox.Action.YES
						}
					);
				}

			}
		},
		successDelete: function() {
			sap.m.MessageToast.show(this.getResourceBundle().getText("delete"));
			// window.history.back();
			if (this.getPurchaseRequisition() === '') {
				this.getRouter().navTo("Search");
			} else {
				this.getRouter().navTo("PurReqList");
			}
		},
		createAccComponent: function() {
			var bEditMode = this.editable;
			var accAssignComp = sap.ui.getCore().createComponent({
				name: "sap.ui.s2p.mm.lib.reuse.accounting.component",
				componentData: {
					sAccEntitySetName: "C_Sspprmaint_Accassign",
					sAccEntityTypeName: "C_Sspprmaint_AccassignType",
					sAccBindingPathEntityType: "",
					sAccBindingPathEntitySet: this.itemBindingPath,
					oModel: this.getAppModel(),
					oRouter: this.oRouter,
					bEditMode: bEditMode,
					bAccDetailsAsPopup: false,
					sCurrentView: "list",
					bShowListHeader: true
				}
			});
			accAssignComp.attachDetailNavigation(jQuery.proxy(this.accDetailsnavigation, this));
			this.getView().byId("accAssignmentCompContainer").setComponent(accAssignComp);
			this.accAssignComp = accAssignComp;

		},
		accDetailsnavigation: function(oEvent) {
			var formBindPath = oEvent.getParameter('bindpath');
			this.getRouter().navTo("Account_Asisgnment_Detail", {
				formBindingPath: formBindPath.substr(1)

			});

		},
		PricescaleClick: function(oEvent) {
			if (!this._prcsclPopover) {
				this._prcsclPopover = sap.ui.xmlfragment("ui.s2p.mm.requisition.maintain.s1.view.PriceRange", this);
			}
			var ikey = "OpnCtlgItemID eq " + this.itmKey;
			var quant = oEvent.getSource().getParent().getParent().getParent().getBindingContext().getObject().NetPriceQuantity;
			var baseunit = oEvent.getSource().getParent().getParent().getParent().getBindingContext().getObject().BaseUnit;
			this.curr = oEvent.getSource().getParent().getParent().getParent().getBindingContext().getObject().Currency;
			quant = this.getResourceBundle().getText("price") + " " + this.getResourceBundle().getText("CurrencyPer") + " " + quant + " " +
				baseunit;

			var mparameters = this.getServiceCallParameter(this.successPrcScale, this.serviceFail);

			this.dataManager.priceScalefind(mparameters, ikey);
			this.getView().addDependent(this._prcsclPopover);

			var oPopoverlink = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function() {
				this._prcsclPopover.openBy(oPopoverlink);
			});
			this._prcsclPopover.setPlacement("Right");
			this._prcsclPopover.getAggregation("content")[0].getAggregation("columns")[1].getAggregation("header").setText(quant);

		},
		successPrcScale: function(data) {
			var oJSModelCart = new sap.ui.model.json.JSONModel(data);
			var len = oJSModelCart.oData.results.length;
			var i = 0;
			for (i = 0; i < len; i++) {
				oJSModelCart.oData.results[i].Currency = this.curr;
			}
			this._prcsclPopover.getContent()[0].setModel(oJSModelCart);
			this._prcsclPopover.getContent()[0].bindElement("/results");
		},
		prcsclPresent: function() {
			var ikey = "OpnCtlgItemID eq " + this.itmKey;
			var mparameters = this.getServiceCallParameter(this.successPrcScalePresent, this.serviceFail);
			this.dataManager.priceScalefind(mparameters, ikey);
		},
		successPrcScalePresent: function(data) {
			if (data.results.length) {
				this.getView().byId("l_prcscale").setVisible(true);
			} else {
				this.getView().byId("l_prcscale").setVisible(false);
			}
		},

		onExit: function() {
			if (this._oContent_Supplier) {
				this._oContent_Supplier.destroy(true);
				this._oContent_Supplier = null;
			}
			if (sap.ui.getCore().getComponent("attachmentsrv.ItemDetails")) {
				sap.ui.getCore().getComponent("attachmentsrv.ItemDetails").destroy(true);
			}
			if (this.productList) {
				this.productList.destroy(true);
				this.productList = null;
			}
			if (this._ocontent) {
				this._ocontent.destroy(true);
				this._ocontent = null;
			}

		},
		formartVisiblityDetailsPerformer: function(productType) {
			//	var a = 10;	
			/*if (this.oProductType != undefined) {
				productType = this.oProductType;
			}*/
			var visible = false;
			if (productType != undefined) {
				if (productType === '2') {
					visible = true;
				}
			}

			return visible;
		},

		formartVisiblityDetailsDateRange: function(productType) {
			//	var a = 10;	
		/*	if (this.oProductType != undefined) {
				productType = this.oProductType;
			}*/
			var visible = false;
			if (productType != undefined) {
				if (productType === '2') {
					visible = true;
				}
			}

			return visible;
		},

		formartVisiblityDetailsDate: function(productType) {
			//	var a = 10;	
		/*	if (this.oProductType != undefined) {
				productType = this.oProductType;
			}*/
			var visible = true;
			if (productType != undefined) {
				if (productType === '2') {
					visible = false;
				}
			}

			return visible;
		},

		selectionChangedDet: function(oEvent) {
			var selectedKey = oEvent.getSource().getValue();
			this.itemType = parseInt(selectedKey);
			if (this.itemType === 9) { //Service
				//Changing the binding type as value is not being set properly into the model
				var categoryControl = oEvent.getSource().getBindingContext();
				oEvent.getSource().getBindingContext().oModel.setProperty("ProductType", "2", categoryControl);
			//	this.oProductType = "2";
				this.getView().byId("idServicePerformerDet").setVisible(true);
				this.getView().byId("idServicePerformerDet").setShowLabel(true);
				this.getView().byId("idDeliveryDateRangeDet").setVisible(true);
				this.getView().byId("idDeliveryDateRangeDet").getParent().setVisible(true);
				this.getView().byId("idDate").setVisible(false);

			} else { //Material
				//Changing the binding type as value is not being set properly into the model
				var categoryControl = oEvent.getSource().getBindingContext();
				oEvent.getSource().getBindingContext().oModel.setProperty("ProductType", "", categoryControl);
				// this.oProductType = "";
				this.getView().byId("idServicePerformerDet").setVisible(false);
				this.getView().byId("idDeliveryDateRangeDet").setVisible(false);
				this.getView().byId("idDeliveryDateRangeDet").getParent().setVisible(false);
				this.getView().byId("idDate").setVisible(true);
				this.getView().byId("idDate").setShowLabel(true);

			}
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

		},
		checkDropDownEnabled: function(PurReqnSSPCatalog) {
			var isEnabled = true;
			if (PurReqnSSPCatalog !== "") {
				isEnabled = false;
			}
			return isEnabled;
		},

		formartPurchasingDocumentItemCategory: function(productDocumentItemCat, productType) {
			/*if (this.oProductType != undefined) {
				productType = this.oProductType;
			}*/
			if (productType == "2") {
				productDocumentItemCat = "9";
				if (this.getView().byId("smartForm1") != undefined) {
					//Changing the binding type as value is not being set into model properly
					var itemCatcontrol = this.getView().byId("smartForm1").getBindingContext();
					this.getView().byId("smartForm1").getBindingContext().oModel.setProperty("PurchasingDocumentItemCategory", "9", itemCatcontrol);

				}
			}
			return productDocumentItemCat;
		},
		changeName: function(oEvent) {
			oEvent.getSource().setTextLabel(this.getResourceBundle().getText("companyCode"));
		},
		saveItem: function() {
			var titleKey = this.getView().byId("idTitle").getValue();

			var oData = this.getView().byId("smartForm1").getBindingContext().getObject();
			oData.PurchaseRequisitionPrice = "0.00";
			if (!(this.Fixedsupplier1 === undefined)) {
				oData.FixedSupplier = this.Fixedsupplier1;
			}
			if (!(this.Supplier1 === undefined)) {
				oData.Supplier = this.Supplier1;
			}
			if (this.bFlag) {
				oData.FixedSupplier = "";
				oData.Supplier = "";
			}
			oData.FormOfAddress = titleKey;
			oData = this.adjustPayload(oData);
			this.getView().setBusy(true);

			this.dataManager.updateItemDetails(this.getServiceCallParameter(this.successItem, this.serviceFail), this.itemDraftUUID,
				this.getPurchaseRequisition(), oData, this.prItem);
		},
		successItem: function(data) {

			this.getAppModel().read("/" + this.itemPath, {
				success: jQuery.proxy(this.updateBasicData, this),
				error: jQuery.proxy(this.serviceFail, this)
			});
		},
		updateBasicData: function(data) {
			this.getView().byId("idPrice").setValue(data.PurchaseRequisitionPrice);
			this.getView().setBusy(false);

		},
		adjustPayload: function(oData) {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.removeAllMessages();
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
		},
		showItemStatus: function() {
			this.getView().byId("idItemLevelStatus").setVisible(true);
			var prNum = this.getPurchaseRequisition();
			var prItem = this.prItem;
			this.statusData(prNum, prItem);

		},
		setDefaultValue: function(event) {
			if (event.getSource().getDataProperty().typePath === "AddressStreetName") {
				event.getSource().setTextLabel(this.getResourceBundle().getText("houseNumber"));
			}
		}
	});

});