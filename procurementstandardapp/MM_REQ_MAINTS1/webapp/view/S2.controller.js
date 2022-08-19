/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("ui.ssuite.s2p.mm.pur.pr.prcss.util.Formatter");

sap.ca.scfld.md.controller.BaseFullscreenController
	.extend(
		"ui.ssuite.s2p.mm.pur.pr.prcss.view.S2", {
			onInit: function() {

				this.oRouter
					.attachRouteMatched(
						function(evt) {

							var sName = evt.getParameter('name');
							if (sName == 'itemDetails') {
								var vPRNo = this.oApplicationFacade.oApplicationImplementation.getModel("selectedPRItem").getData().Purchaserequisition;
								var vPRItemNo = this.oApplicationFacade.oApplicationImplementation.getModel("selectedPRItem").getData().Purchaserequisitionitem;
								var PRNO = "00" + vPRNo;
								var vURLNotes = "/PurchaseReqItemSet(Purchaserequisition='" + PRNO + "',Purchaserequisitionitem='" + vPRItemNo +
									"')/PurchaseReqNotesSet";
								var oModelPurNotes = this.oApplicationFacade.getODataModel();
								jQuery.proxy(
									oModelPurNotes.read(
										vURLNotes, null, null, true, jQuery.proxy(
											function(data) {
												this.oDataItemDetailsMerged = {
													itemDetails: this.oApplicationFacade.oApplicationImplementation.getModel("selectedPRItem").getData(),
													PurchaseReqNotesSet: data.results
												};
												//                                                                                                     this.oApplicationFacade.getODataModel().oData = oDataItemDetailsMerged;
												this.byId('ItemDetailPage').setModel(
													new sap.ui.model.json.JSONModel(this.oDataItemDetailsMerged));
											},
											this),
										function(error) {
											// show error message box
										}),
									this);
							}
						}, this);

			},

			handleSoSDialog: function(oEvent) {

				var vMaterialNumber = this.oApplicationFacade.oApplicationImplementation.getModel("selectedPRItem").getData().Material;
				var vPlant = this.oApplicationFacade.oApplicationImplementation.getModel("selectedPRItem").getData().Plant;
				this.selectedPurReq = this.oApplicationFacade.oApplicationImplementation.getModel("selectedPRItem").getData().Purchaserequisition;
				var vQuantity = this.oApplicationFacade.oApplicationImplementation.getModel("selectedPRItem").getData().Quantity;
				this.selectedPurReqItem = this.oApplicationFacade.oApplicationImplementation.getModel("selectedPRItem").getData().Purchaserequisitionitem;
				var oModelSoS = this.oApplicationFacade.getODataModel(); // main PR List model
				var aQuanSplit = vQuantity.split('.');
				vQuantity = aQuanSplit[0];
				var vURLSos = "SourceOfSupplySet/?$filter=MATNR eq '" + vMaterialNumber + "'and WERKS eq '" + vPlant + "'and MENGE eq " + vQuantity; //URL for getting all suppliers for single material number

				jQuery.proxy(oModelSoS.read(
						vURLSos, null, null, true, jQuery.proxy(
							function(data, response) {
								var oJSSrcSupply = {
									'SourceOfSupplySet': data.results
								}; // results fetched through readstored in results
								this.openDialog('SoSDialog');
								this['SoSDialog'].setModel(new sap.ui.model.json.JSONModel(oJSSrcSupply)); //model set for Sos fragment
							},
							this),
						function(error) {
							// show error message box
						}),
					this);

			},

			openDialog: function(sFragmentType) { //same function used to open other fragment thus sFragmentType specifies which fragment is being called

				if (!this[sFragmentType]) {
					this[sFragmentType] = sap.ui.xmlfragment("itemsSoS", "ui.ssuite.s2p.mm.pur.pr.prcss.view.SosDialog",
						this // associate controller with the fragment, itemsSoS to overcome idList duplicate name
					);
					this.getView().addDependent(this[sFragmentType]);
				}

				this[sFragmentType].open();

			},

			onSosConfirm: function(oEvent) {

				this.vsupplier = oEvent.getSource().getModel().getProperty('LIFNR', oEvent.getParameter('selectedContexts')[0]);
				this.vInfoRecord = oEvent.getSource().getModel().getProperty('INFNR', oEvent.getParameter('selectedContexts')[0]);
				var oPayloadForSoSUpdate = {
					'Purchaserequisition': this.selectedPurReq,
					'Purchaserequisitionitem': this.selectedPurReqItem,
					'Fixedvendor': this.vsupplier,
					'Purchasinginforecord': this.vInfoRecord,
					'Upd_scenario': 'S' // update scenario for backend 
				};

				var sURLUpdatePR = "/PurchaseReqItemSet(Purchaserequisition='" +
					oPayloadForSoSUpdate.Purchaserequisition + "',Purchaserequisitionitem='" + oPayloadForSoSUpdate.Purchaserequisitionitem + "')";
				var oModelForPRList = this.oApplicationFacade.getODataModel();
				jQuery.proxy(oModelForPRList.update(sURLUpdatePR, oPayloadForSoSUpdate, null,
					jQuery.proxy(function(data) { //function for success
						this.oDataItemDetailsMerged.itemDetails.Fixedvendor = this.vsupplier;
						this.oDataItemDetailsMerged.itemDetails.Purchasinginforecord = this.vInfoRecord;
						this.byId('ItemDetailPage').setModel(
							new sap.ui.model.json.JSONModel(this.oDataItemDetailsMerged)); // refresh data when supplier selected on item details screen

					}, this), function(oErrorUpdate) { //function for error
						var error = "";
						if (oErrorUpdate.response.statusCode == 400) {
							var oError = JSON.parse(oErrorUpdate.response.body).error;

							error += oError.message.value;

							for (var errorCnt = 0; errorCnt < oError.innererror.errordetails.length; errorCnt++) {
								if (errorCnt == 0) {
									error += "\n\n";
									error += "Details:\n";
								}

								if (oError.innererror.errordetails[errorCnt].code != "/IWBEP/CX_MGW_BUSI_EXCEPTION") {
									error += oError.innererror.errordetails[errorCnt].message;
									if (errorCnt < (oError.innererror.errordetails.length - 1)) {
										error += "\n";
									}
								}

							}
						} else {
							error = oErrorUpdate.response.statusCode + " " + oErrorUpdate.response.statusText;
						}
						sap.ca.ui.message
							.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: "Update of PR failed:\n" + error,
							}, null);
					}), this);

			},

			onSearch: function(oEvt) {

				// add filter for search
				var aFilters = [];
				var sQuery = oEvt.getParameter('value');
				if (sQuery && sQuery.length > 0) {
					var filter = new sap.ui.model.Filter("LIFNR",
						sap.ui.model.FilterOperator.Contains,
						sQuery);
					aFilters.push(filter);
				}

				// update list binding
				var list = sap.ui.getCore().byId("itemsSoS--idList");
				var binding = list.getBinding("items");
				binding.filter(aFilters, "Application");
			},
			handleBusinessCard: function(oEvent) {
				//	this.idSourceVendorFgt = oEvent.getSource().sId;
				var vVendor = oEvent.getSource().getText();
				var oModelVendor = this.oApplicationFacade.getODataModel(); // main PR List model
				var vURLVendor = "/VendorSet(Supplier='" + vVendor + "')";

				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.view.businessCard", this);
					this.getView().addDependent(this._oPopover);
				}
				jQuery.proxy(oModelVendor.read(
						vURLVendor, null, null, true, jQuery.proxy(
							function(data, response) {
								this._oPopover.setModel(new sap.ui.model.json.JSONModel(data));
							},
							this),
						function(error) {
						}),
					this);
				//				delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
				var oFixedVendorClick = oEvent.getSource();
				jQuery.sap.delayedCall(0, this, function() {
					this._oPopover.openBy(oFixedVendorClick);
				});
			},

			onNavBack: function(evt) {
				this.oRouter.navTo("fullscreen", {

					from: "itemDetails"

				});
			}
		});