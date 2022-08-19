/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.m.TablePersoController");
jQuery.sap.require("sap.m.TablePersoDialog");
jQuery.sap.require("sap.m.TablePersoProvider");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter");
jQuery.sap.require("sap.ui.core.search.OpenSearchProvider");
jQuery.sap.require("sap.ui.model.FilterOperator");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.model.SimpleType");
jQuery.sap.require("ui.ssuite.s2p.mm.pur.pr.prcss.s1.model.types.QuantityType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.DemoPersoService");
sap.ca.scfld.md.controller.BaseFullscreenController
	.extend(
		"ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.S1", {
			inputId: '',
			onInit: function() {
				this.navigationToHome = false;
				//	this.navFromOVP = false;
				this.oRouter
					.attachRouteMatched(
						jQuery.proxy(function(evt) {
							var sName = evt.getParameter('name');
							if (sName == 'fullscreen') {
								var oModelForPRCount = this.oApplicationFacade
									.getODataModel(); // main PR List model
								oModelForPRCount.refresh();
								var vURLCount = "/PurchaseReqItemSet/$count";
								jQuery.proxy(oModelForPRCount.read(vURLCount, null,
									null, true, jQuery.proxy(function(data,
										response) {
										var oDataCount = {
											PurchaseReqItemCount: response.body
										};
										this.vPRCount = response.body;
										this.byId('PRListToolbar').setModel(
											new sap.ui.model.json.JSONModel(
												oDataCount));
									}, this),
									function(error) {
										// show error message box
									}), this);
								//Check if some PRs are selected, if yes, enable create PO button
								this.CreatePOEnableCheck();
								if (this.oApplicationFacade.oApplicationImplementation.getModel("oDraftRFQTypes") === undefined) {
									var oModelForPOTypes = this.oApplicationFacade.getODataModel(); // main PR List model
									var vURLRFQTypes = "/C_RfqTypeVH";
									oModelForPOTypes.read(vURLRFQTypes, null,
										null, true, jQuery.proxy(function(data,
											response) {
											this.oApplicationFacade.oApplicationImplementation.setModel(data, "oDraftRFQTypes");
										}, this),
										function(error) {
											// show error message box
										});
								}
							}
						}, this));

				if (!jQuery.support.touch) {
					this.getView().addStyleClass("sapUiSizeCompact");
				}

				//                                                            var asearchPRs = jQuery.sap.getUriParameters().get("PurchaseRequisition", true);
				var oStartupParameters = this.getMyComponent().getComponentData().startupParameters;
				if (oStartupParameters !== undefined) {
					if (oStartupParameters.PurchaseRequisition !== undefined) {
						var asearchPRs = oStartupParameters.PurchaseRequisition;
					}
					if (oStartupParameters.FormattedPurRequisitionItem !== undefined) {
						this.bIsNavigatedFromOVP = true;
						var asearchPRItems = oStartupParameters.FormattedPurRequisitionItem;
					}
					if (oStartupParameters.source !== undefined){						//2917548
						if (oStartupParameters.source[0] === 'lpd') {					//2917548
							this.navigationToHome = true;								//2917548
						}																//2917548
					}																	//2917548

					if (oStartupParameters.PresentationVariant !== undefined) {
						var aPresentationVariant = oStartupParameters.PresentationVariant;
						if (aPresentationVariant[0] === "PRDue") {
							var oTable = this.byId("purchaseRequisitionItemTable");
							var oBinding = oTable.getBinding("items");
							var aSorters = [];

							aSorters = [
								new sap.ui.model.Sorter("Deliverydate", false),
								new sap.ui.model.Sorter("PurReqnPrice", true)
							];
							oBinding.sort(aSorters);
						}
					}

					if (oStartupParameters.Supplier !== undefined) {
						var asearchSupplier = oStartupParameters.Supplier;
						var asearchFixedSupplier = oStartupParameters.FixedSupplier;
						var asearchMaterial = oStartupParameters.Material;
						var asearchMaterialGroup = oStartupParameters.MaterialGroup;
						var asearchPurchasingGroup = oStartupParameters.PurchasingGroup;
						var asearchPurchasingOrganization = oStartupParameters.PurchasingOrganization;
						var asearchPlant = oStartupParameters.Plant;

						var oTable = this.getView().byId("purchaseRequisitionItemTable");
						var oBinding = oTable.getBinding("items");
						//for PRs with no supplier assigned when navigating from OVP card
						var aSearchFilters = [];
						var filterSupplierParam = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.EQ, asearchSupplier);
						aSearchFilters.push(filterSupplierParam);
						var filterFixedSupplierParam = new sap.ui.model.Filter("Fixedvendor", sap.ui.model.FilterOperator.EQ, asearchFixedSupplier);
						aSearchFilters.push(filterFixedSupplierParam);
						//for PRs with filters assigned when navigating from OVP card
						if (oStartupParameters.Material !== undefined) {
							var filterMaterialParam = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, asearchMaterial);
							aSearchFilters.push(filterMaterialParam);
						}
						if (oStartupParameters.MaterialGroup !== undefined) {
							var filterMaterialGroupParam = new sap.ui.model.Filter("Materialgroup", sap.ui.model.FilterOperator.EQ, asearchMaterialGroup);
							aSearchFilters.push(filterMaterialGroupParam);
						}
						if (oStartupParameters.PurchasingGroup !== undefined) {
							var filterPurchasingGroupParam = new sap.ui.model.Filter("Purchasinggroup", sap.ui.model.FilterOperator.EQ, asearchPurchasingGroup);
							aSearchFilters.push(filterPurchasingGroupParam);
						}
						if (oStartupParameters.PurchasingOrganization !== undefined) {
							var filterPurchasingOrganizationParam = new sap.ui.model.Filter("Purchasingorganization", sap.ui.model.FilterOperator.EQ,
								asearchPurchasingOrganization);
							aSearchFilters.push(filterPurchasingOrganizationParam);
						}
						if (oStartupParameters.Plant !== undefined) {
							var filterPlantParam = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, asearchPlant);
							aSearchFilters.push(filterPlantParam);
						}
						oBinding.filter(aSearchFilters, true);
						//to set count
						oBinding.attachChange(function() {
							this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
							var sPrText = this.oResourceBundle.getText("PROD");
							var rowCount = oBinding.getLength();
							var sPrCountText = sPrText + ' (' + rowCount + ')';
							this.getView().byId("labelCount").setText(sPrCountText);
						}.bind(this));

					} else {
						if (oStartupParameters.PurchaseRequisition === undefined) {
							//		this.navFromOVP = true;
							//		this.byId("smartFilterId").getBasicSearchControl().fireSearch();
						}
					}
				}
				for (var i in asearchPRs) {
					var searchValueForPR = asearchPRs[i];
					this.byId("smartFilterId").getBasicSearchControl().setValue(searchValueForPR);
					this.byId("smartFilterId").getBasicSearchControl().fireSearch();
				}
				for (var iCnt in asearchPRItems) {
					var searchValueForPRItem = asearchPRItems[iCnt];
					this.byId("smartFilterId").getBasicSearchControl().setValue(searchValueForPRItem);
					this.byId("smartFilterId").getBasicSearchControl().fireSearch();
				}

				/*           var p = 0,
                                                                urlLength = 0;
                                                                var complete_url = window.location.href;
                                                                var pieces = complete_url.split("?");
                                                                urlLength = pieces.length;
                                                                if (pieces[urlLength - 1] != null) {
                                                                                var params = pieces[urlLength - 1].split("&");
                                                                                if (params.length > 1) {
                                                                                                for (p = 0; p < params.length; p++) {
                                                                                                                var purchaserequisition = params[p].split("=");
                                                                                                                if (purchaserequisition[0] == "PurchaseRequisition") {
                                                                                                                                var searchValueForPR = purchaserequisition[1];
                                                                                                                                this.byId("smartFilterId").getBasicSearchControl().setValue(searchValueForPR);
                                                                                                                                this.byId("smartFilterId").getBasicSearchControl().fireLiveChange();
                                                                                                                }
                                                                                                }
                                                                                }
                                                                }*/

				this.mGroupFunctions = {
					Purchaserequisition: function(oContext) {
						var name = oContext
							.getProperty("Purchaserequisition");
						return {
							key: name,
							text: name
						};
					},

					Purchaserequisitionitemtext: function(oContext) {
						var name = oContext
							.getProperty("Purchaserequisitionitemtext");
						return {
							key: name,
							text: name
						};
					},

					Materialgroup: function(oContext) {
						var name = oContext
							.getProperty("Materialgroup");
						return {
							key: name,
							text: name
						};
					},

					Quantity: function(oContext) {
						var name = oContext
							.getProperty("Quantity");
						return {
							key: name,
							text: name
						};
					},

					Materialcomponentprice: function(oContext) {
						var name = oContext
							.getProperty("Materialcomponentprice");
						return {
							key: name,
							text: name
						};
					},

					Sos_count: function(oContext) {
						var name = oContext
							.getProperty("Sos_count");
						return {
							key: name,
							text: name
						};
					},

					Deliverydate: function(oContext) {
						var nameDate = oContext.getProperty("Deliverydate").getDate();
						var nameMonth = oContext.getProperty("Deliverydate").getMonth();
						var nameYear = oContext.getProperty("Deliverydate").getFullYear();
						nameMonth = nameMonth + 1;
						var name = nameDate + "/" + nameMonth + "/" + nameYear;
						return {
							key: name,
							text: name
						};
					}
				};

				var oPersId = {
					container: "ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.S1",
					item: "columns"
				};

				// Get a personalization service provider from the shell (or create your own)
				var oProvider = sap.ushell.Container.getService("Personalization").getPersonalizer(oPersId);

				// Instantiate a controller connecting your table and the persistence service

				this._oTPC = new sap.m.TablePersoController({
					table: this.getView().byId("purchaseRequisitionItemTable"),
					persoService: oProvider
				}).activate();

				// Get PO Types

				if (this.oApplicationFacade.oApplicationImplementation.getModel("oJMDraftPOTypes") == undefined) {
					var oModelForPOTypes = this.oApplicationFacade.getODataModel(); // main PR List model
					var vURLPOTypes = "/DraftPOTypeSet";
					oModelForPOTypes.read(vURLPOTypes, null,
						null, true, jQuery.proxy(function(data,
							response) {
							this.oApplicationFacade.oApplicationImplementation.setModel(data, "oJMDraftPOTypes");
						}, this),
						function(error) {
							// show error message box
						});
				}
				// Check Authorization to create RFQ
				// var oModelForRFQAuthCheck = this.oApplicationFacade.getODataModel();
				// var vURLRFQAuthCheck = "/RFQAuthCheckSet";
				// oModelForRFQAuthCheck.read(vURLRFQAuthCheck, null,
				// 	null, true, jQuery.proxy(function(data,
				// 		response) {
				// 		this.bIsRFQAuthorized = data.results[0].Auth_Boolean;
				// 	}, this),
				// 	function(error) {}
				// );
			},

			getMyComponent: function() {
				"use strict";
				var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
				return sap.ui.component(sComponentId);
			},

			onNavBack: function() {
				// Navigate to the launchpad in all cases
				if (this.navigationToHome) {
					var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
					oCrossAppNavigator.toExternal({
						target: {
							semanticObject: "Shell",
							action: "home"
						}
					});
				} else {
					window.history.go(-1);
				}
			},

			onSearch: function(oEvt) {
				// add filter for search in SoS fragment
				var aFilters = [];
				var sQuery = oEvt.getParameter('value');
				if (sQuery && sQuery.length > 0) {
					var filter = new sap.ui.model.Filter("Supplier",
						sap.ui.model.FilterOperator.Contains,
						sQuery);
					aFilters.push(filter);
				}

				// update list binding
				var list = sap.ui.getCore().byId("idList");
				var binding = list.getBinding("items");
				binding.filter(aFilters, "Application");
			},

			handleChangeInFilterBar: function(oEvent) {
				this.bFilterUpdated = true;
			},
			CreatePOEnableCheck: function(oEvent) { // to enable create PO button
				var oSelectedItems = this.byId("purchaseRequisitionItemTable").getSelectedContexts();
				var items, oData, bEnabled;
				if (oSelectedItems.length == 0) // atleast one item should be selected
				{
					bEnabled = false;
					// Added for the Demo for RFQ
					this.byId("CreateRFQ").setEnabled(false);
				} else {
					for (items = 0; items < oSelectedItems.length; items++) {

						oData = oSelectedItems[items].getProperty(oSelectedItems[items].getPath()); // selected item should have a SoS selected
						if ((oData.Fixedvendor == null || oData.Fixedvendor == undefined || oData.Fixedvendor == "") && (oData.Supplier == null || oData.Supplier ==
								undefined || oData.Supplier == "")) {
							bEnabled = false;
							break;
						} else {
							bEnabled = true;
						}
					}
					// Added for the Demo for RFQ
					//Check authorization to create RFQ
					//	if (this.bIsRFQAuthorized) {
					//		
					//	}
					this.byId("CreateRFQ").setEnabled(true);
				}
				this.byId("CreatePO").setEnabled(bEnabled);
			},

			onPersoButtonPressed: function(oEvent) {
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oTPC);
				this._oTPC.openDialog();
			},

			onTablePersoRefresh: function() {
				ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.DemoPersoService
					.resetPersData();
				this._oTPC.refresh();
			},

			doReload: function(aFilters, oParameters) {
				var oTable = this.getView().byId("purchaseRequisitionItemTable");
				var oBinding = oTable.getBinding("items");
				//for search term as PR/Item
				var searchString = oParameters.custom.search;
				var aSearchFilters = [];
				var containsItemNumber = oParameters.custom.search.search("/");
				if (containsItemNumber >= 0) {
					var prNumber = searchString.split(/[.?/]/)[0];
					var itemNumber = searchString.split(/[.?/]/)[1];
					var filterPrParam = new sap.ui.model.Filter("Purchaserequisition", sap.ui.model.FilterOperator.Contains, prNumber);
					aSearchFilters.push(filterPrParam);
					var filterItemParam = new sap.ui.model.Filter("Purchaserequisitionitem", sap.ui.model.FilterOperator.Contains, itemNumber);
					aSearchFilters.push(filterItemParam);
					oBinding.filter(aSearchFilters, true);
					//to set count
					oBinding.attachChange(function() {
						this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
						var sPrText = this.oResourceBundle.getText("PROD");
						var rowCount = oBinding.getLength();
						var sPrCountText = sPrText + ' (' + rowCount + ')';
						this.getView().byId("labelCount").setText(sPrCountText);
					}.bind(this));
				}
				/*else if (this.navFromOVP === true) {
					var filterPrParam = new sap.ui.model.Filter("Fixedvendor", sap.ui.model.FilterOperator.EQ, "");
					aSearchFilters.push(filterPrParam);
					var filterItemParam = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.EQ, "");
					aSearchFilters.push(filterItemParam);
					oBinding.filter(aSearchFilters, true);
					//to set count
					oBinding.attachChange(function() {
						this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
						var sPrText = this.oResourceBundle.getText("PROD");
						var rowCount = oBinding.getLength();
						var sPrCountText = sPrText + ' (' + rowCount + ')';
						this.getView().byId("labelCount").setText(sPrCountText);
					}.bind(this));
				} */
				else {
					if (oParameters) {
						oBinding.sCustomParams = oBinding.getModel().createCustomParams({
							custom: {
								search: oParameters.custom.search
							}
						});
					}
					if (aFilters && aFilters.length > 0) {
						oBinding.filter(aFilters, oParameters);
						var oModelForPRCount = this.oApplicationFacade
							.getODataModel(); // main PR List model
						var vURLCountPR = "/PurchaseReqItemSet/$count?" + oBinding.filter(aFilters).sFilterParams;
						//To export the data to the spreadsheet with filters
						this.vURLPR = vURLCountPR.substring(26);
						jQuery.proxy(oModelForPRCount.read(vURLCountPR, null,
							null, true, jQuery.proxy(function(data,
								response) {
								var oDataCount = {

									PurchaseReqItemCount: response.body
								};

								this.byId('PRListToolbar').setModel(
									new sap.ui.model.json.JSONModel(
										oDataCount));

							}, this),
							function(error) {
								// show error message box
							}), this);

					} else {
						oBinding.filter([]);
						var oModelForPRCount = this.oApplicationFacade
							.getODataModel(); // main PR List model
						var searchString = oBinding.filter([]).sCustomParams;

						var vURLCountPR = "/PurchaseReqItemSet/$count?" + searchString.split('&')[0];
						//To export the data to the spreadsheet with filters
						this.vURLPR = vURLCountPR.substring(26);
						jQuery.proxy(oModelForPRCount.read(vURLCountPR, null,
							null, true, jQuery.proxy(function(data,
								response) {
								var oDataCount = {
									PurchaseReqItemCount: response.body
								};

								this.byId('PRListToolbar').setModel(
									new sap.ui.model.json.JSONModel(
										oDataCount));
							}, this),
							function(error) {
								// show error message box
							}), this);
					}

					if (aFilters.length > 0 && oParameters) {
						var oModelForPRCount = this.oApplicationFacade
							.getODataModel(); // main PR List model
						var searchString = oBinding.filter([]).sCustomParams;
						var vURLCountPR = "/PurchaseReqItemSet/$count?" + searchString.split('&')[0] + "&" + oBinding.filter(aFilters).sFilterParams;
						//To export the data to the spreadsheet with filters
						this.vURLPR = vURLCountPR.substring(26);
						jQuery.proxy(oModelForPRCount.read(vURLCountPR, null,
							null, true, jQuery.proxy(function(data,
								response) {
								var oDataCount = {

									PurchaseReqItemCount: response.body
								};
								this.byId('PRListToolbar').setModel(
									new sap.ui.model.json.JSONModel(
										oDataCount));

							}, this),
							function(error) {
								// show error message box
							}), this);
					}
				}
			},
			onSearchButtonPressed: function(oEvt) {
				var oSmartFilterBar = oEvt.getSource(),
					aFilters = [],
					oParameters = [];
				aFilters = oSmartFilterBar.getFilters();
				oParameters = oSmartFilterBar.getParameters();
				this.doReload(aFilters, oParameters);
			},

			onDateChanged: function(oEvent) {
				this.bDateChanged = true;
				oEvent.getSource().exit();
			},

			onDialogCloseButton: function(oEvent) {
				oEvent.getSource().getParent().getParent().close();
			},

			onEditDialogCloseButton: function(oEvent) {
				var dialog = sap.ui.getCore().byId("editDialog");
				dialog.close();
			},

			handleOpenDialog: function(oEvent) {
				var vPurchaserequisition = oEvent.getSource().getModel().getProperty('Purchaserequisition', oEvent.getSource().getBindingContext());
				var vPurchaserequisitionitem = oEvent.getSource().getModel().getProperty('Purchaserequisitionitem', oEvent.getSource().getBindingContext());
				var vSourcesOfSupplyCount = oEvent.getSource().getModel().getProperty('Sos_count', oEvent.getSource().getBindingContext());
				var vQuantity = oEvent.getSource().getModel().getProperty('Quantity', oEvent.getSource().getBindingContext());
				var vDesiredSupplier = oEvent.getSource().getModel().getProperty('Supplier', oEvent.getSource().getBindingContext());
				var vDateOfDelivery = oEvent.getSource().getModel().getProperty('Deliverydate', oEvent.getSource().getBindingContext());
				var vQuantityMeasureUnit = oEvent.getSource().getModel().getProperty('Materialbaseunit', oEvent.getSource().getBindingContext());
				var sShortText = oEvent.getSource().getModel().getProperty('Purchaserequisitionitemtext', oEvent.getSource().getBindingContext());
				var vMaterialNumber = oEvent.getSource().getModel().getProperty('Material', oEvent.getSource().getBindingContext());
				var vPlant = oEvent.getSource().getModel().getProperty('Plant', oEvent.getSource().getBindingContext());
				var vFixedVendor = oEvent.getSource().getModel().getProperty('Fixedvendor', oEvent.getSource().getBindingContext());
				var vCurrency = oEvent.getSource().getModel().getProperty('Purgdoctransactioncurrency', oEvent.getSource().getBindingContext());
				var vInfoRecord = oEvent.getSource().getModel().getProperty('Purchasinginforecord', oEvent.getSource().getBindingContext());
				var vNetPrice = oEvent.getSource().getModel().getProperty('Materialcomponentprice', oEvent.getSource().getBindingContext());
				var vPurchasingDocCat = oEvent.getSource().getModel().getProperty('Purchasingdocumentitemcategory', oEvent.getSource().getBindingContext());
				var vPurchaseContract = oEvent.getSource().getModel().getProperty('PurchaseContract', oEvent.getSource().getBindingContext());
				var vPurchaseContractItem = oEvent.getSource().getModel().getProperty('PurchaseContractItem', oEvent.getSource().getBindingContext());
				var vRequisitionSourceOfSupplyType = oEvent.getSource().getModel().getProperty('RequisitionSourceOfSupplyType', oEvent.getSource().getBindingContext());
				var vAcctCat = oEvent.getSource().getModel().getProperty('Acctassignmentcategory', oEvent.getSource().getBindingContext());
				var vConsumPost = oEvent.getSource().getModel().getProperty('Consumptionposting', oEvent.getSource().getBindingContext());
				//for UTC
				var vDeliveryDate = new Date(vDateOfDelivery);
				var utc = vDeliveryDate.getTime() + (vDeliveryDate.getTimezoneOffset() * 60000);
				var offset = 0;
				var edate = new Date(utc + (3600000 * offset));
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd.MM.yyyy"
				});
				//vDateOfDelivery = oDateFormat.format(edate);
				vDateOfDelivery = new Date(edate);
				
				var oDataForEditModel = {
					'Purchaserequisition': vPurchaserequisition,
					'Purchaserequisitionitem': vPurchaserequisitionitem,
					'Sos_count': vSourcesOfSupplyCount,
					'Quantity': vQuantity,
					'Supplier': vDesiredSupplier,
					'Materialbaseunit': vQuantityMeasureUnit,
					'Deliverydate': vDateOfDelivery,
					'Purchaserequisitionitemtext': sShortText,
					'Upd_scenario': 'E',
					'Material': vMaterialNumber,
					'Plant': vPlant,
					'Fixedvendor': vFixedVendor,
					'Purchasinginforecord': vInfoRecord,
					'Purgdoctransactioncurrency': vCurrency,
					'Materialcomponentprice': vNetPrice,
					'Purchasingdocumentitemcategory': vPurchasingDocCat,
					'PurchaseContract': vPurchaseContract,
					'PurchaseContractItem': vPurchaseContractItem,
					'RequisitionSourceOfSupplyType': vRequisitionSourceOfSupplyType,
					'Acctassignmentcategory': vAcctCat,
					'Consumptionposting': vConsumPost

				}; //data for the edit fragment dialog box

				this.oModelEdit = new sap.ui.model.json.JSONModel(oDataForEditModel); // model created for edit fragment populated with oDataForEditModel

				this.openDialog('editDialog'); // to open edit dialog
			},
			onChangeSupplier: function(oEvent) {
				var sUserEnteredSupplier = oEvent.getSource().getValue();
				oEvent.getSource().getModel().getData().tempSupplier = sUserEnteredSupplier;

			},

			openDialog: function(sFragmentType) { //same function used to open other fragment thus sFragmentType specifies which fragment is being called
				switch (sFragmentType) {
					case 'editDialog':
						{
							if (!this[sFragmentType]) {
								this[sFragmentType] = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.editDialog",
									this // associate controller with the fragment
								);
							}
							this.oApplicationFacade.oApplicationImplementation.setModel(this.oModelEdit, 'ModelEditFragment');
							this[sFragmentType].setModel(this.oModelEdit);
							this.getView().addDependent(this[sFragmentType]);
							jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this[sFragmentType]);
							this[sFragmentType].open();
						}

					case 'SoSDialog':
						{
							if (!this[sFragmentType]) {
								this[sFragmentType] = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.SosDialog",
									this // associate controller with the fragment
								);
								this.getView().addDependent(this[sFragmentType]);
							}
							jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this[sFragmentType]);
							this[sFragmentType].open();

						}
				}
			},

			handleSoSDialog: function(oEvent) {
				this.oEventSource = oEvent.getSource();
				var vMaterialNumber, vPlant, vQuantity, vPurchasingDocCat, vFixedvendor, vContract, vContractitem, vSostype, vAcctCat, vConsumPost,
					vPurDocType, vPurCatType;
				this.idSourceSOSFgt = oEvent.getSource().getId();
				if (oEvent.getSource().getBindingContext() == undefined) //in case opened from edit fragment or item details screen
				{
					vMaterialNumber = oEvent.getSource().getModel().getData().Material;
					vPlant = oEvent.getSource().getModel().getData().Plant;
					vQuantity = oEvent.getSource().getModel().getData().Quantity;
					vPurchasingDocCat = oEvent.getSource().getModel().getData().Purchasingdocumentitemcategory;
					vPurDocType = oEvent.getSource().getModel().getData().Purchasingdocumenttype;
					vPurCatType = oEvent.getSource().getModel().getData().Purchasingdocumentcategory;
					vAcctCat = oEvent.getSource().getModel().getData().Acctassignmentcategory;
					vConsumPost = oEvent.getSource().getModel().getData().Consumptionposting;
					this.selectedPurReq = oEvent.getSource().getModel().getData().Purchaserequisition;
					this.selectedPurReqItem = oEvent.getSource().getModel().getData().Purchaserequisitionitem;
					vFixedvendor = oEvent.getSource().getModel().getData().Fixedvendor;
					this.selectedContract = oEvent.getSource().getModel().getData().PurchaseContract;
					this.selectedContractItem = oEvent.getSource().getModel().getData().PurchaseContractItem;
					this.selectedInforecord = oEvent.getSource().getModel().getData().Purchasinginforecord;

				} else // opened from edit fragment
				{
					vFixedvendor = oEvent.getSource().getModel().getProperty('Fixedvendor', oEvent.getSource().getBindingContext());
					vMaterialNumber = oEvent.getSource().getModel().getProperty('Material', oEvent.getSource().getBindingContext());
					vPlant = oEvent.getSource().getModel().getProperty('Plant', oEvent.getSource().getBindingContext());
					vQuantity = oEvent.getSource().getModel().getProperty('Quantity', oEvent.getSource().getBindingContext());
					vPurchasingDocCat = oEvent.getSource().getModel().getProperty('Purchasingdocumentitemcategory', oEvent.getSource().getBindingContext());
					vContract = oEvent.getSource().getModel().getProperty('PurchavMaterialNumberseContract', oEvent.getSource().getBindingContext());
					vContractitem = oEvent.getSource().getModel().getProperty('PurchaseContractItem', oEvent.getSource().getBindingContext());
					vSostype = oEvent.getSource().getModel().getProperty('RequisitionSourceOfSupplyType', oEvent.getSource().getBindingContext());
					vAcctCat = oEvent.getSource().getModel().getProperty('Acctassignmentcategory', oEvent.getSource().getBindingContext());
					vConsumPost = oEvent.getSource().getModel().getProperty('Consumptionposting', oEvent.getSource().getBindingContext());
					vPurDocType = oEvent.getSource().getModel().getProperty('Purchasingdocumenttype', oEvent.getSource().getBindingContext());
					vPurCatType = oEvent.getSource().getModel().getProperty('Purchasingdocumentcategory', oEvent.getSource().getBindingContext());
					this.selectedPurReq = oEvent.getSource().getModel().getProperty('Purchaserequisition', oEvent.getSource().getBindingContext());
					this.selectedPurReqItem = oEvent.getSource().getModel().getProperty('Purchaserequisitionitem', oEvent.getSource().getBindingContext());
					this.selectedContract = oEvent.getSource().getModel().getProperty('PurchaseContract', oEvent.getSource().getBindingContext());
					this.selectedContractItem = oEvent.getSource().getModel().getProperty('PurchaseContractItem', oEvent.getSource().getBindingContext());
					this.selectedInforecord = oEvent.getSource().getModel().getProperty('Purchasinginforecord', oEvent.getSource().getBindingContext());
				}
				/*	var vMaterialNumberLength = vMaterialNumber.length;
					if (vMaterialNumberLength !== 18) {
						var iNoOfZerosToAppend = 18 - vMaterialNumberLength;
						for (var iCount = 0; iCount < iNoOfZerosToAppend; iCount++) {
							vMaterialNumber = "0" + vMaterialNumber;
						}
					}*/
				var oModelSoS = this.oApplicationFacade.getODataModel(); // main PR List model
				if (vQuantity.split) {
					var aQuanSplit = vQuantity.split('.');
				} else {
					vQuantity = "'" + vQuantity + "'";
					var aQuanSplit = vQuantity.split('.');
					this.openDialog('SoSDialog');
				}
				vQuantity = aQuanSplit[0];
				if (vPurCatType === undefined) {
					vPurCatType = "";
				}
				if (vPurDocType === undefined) {
					vPurDocType = "";
				}
				var vURLSos = "SourceOfSupplySet/?$filter=MATNR eq '" + vMaterialNumber + "'and WERKS eq '" +
					vPlant + "'and MENGE eq " + vQuantity + " and PSTYP eq '" + vPurchasingDocCat + "' and KNTTP eq '" + vAcctCat + "' and KZVBR eq '" +
					vConsumPost + "' and BSART eq '" + vPurDocType + "' and BSTYP eq '" + vPurCatType + "'"; //URL for getting all suppliers for single material number
				// the quantity decimal value has to be handled. Is not working in cc2 with precision in quantity.
				jQuery.proxy(oModelSoS.read(
						vURLSos, null, null, true, jQuery.proxy(
							function(data, response) {
								var iIndexSelected = -1;
								for (var i = 0; i < data.results.length; i++) {
									data.results[i].Supplier = data.results[i].LIFNR + ':' + data.results[i].NAME + ':' + data.results[i].INFNR + ':' + data.results[
											i]
										.EBELN;
									if (this.selectedContract != '') {

										if (this.selectedContract == data.results[i].EBELN && this.selectedContractItem == data.results[i].EBELP) {
											iIndexSelected = i;
										}
									}
									if (this.selectedInforecord != '') {

										if (this.selectedInforecord == data.results[i].INFNR) {
											iIndexSelected = i;
										}
									}
								}
								var oJSSrcSupply = {
									'SourceOfSupplySet': data.results
								}; // results fetched through readstored in results
								this.openDialog('SoSDialog');
								this['SoSDialog'].setModel(new sap.ui.model.json.JSONModel(oJSSrcSupply)); //model set for Sos fragment
								var list = sap.ui.getCore().byId("idList");
								if (iIndexSelected != -1) { //to show the value that has been selcted previously as fixed vendor for the same
									list.getItems()[iIndexSelected].setSelected(true);
								}
							},
							this),
						function(error) {
							// show error message box
						}),
					this);
			},

			onDataExport: function(oEvent) {
				var oModelForPRCount = this.oApplicationFacade
					.getODataModel(); // main PR List model
					var vURLCountPR;
				if (this.vURLPR != undefined || this.vURLPR != null) {
					//read the data with filters
					if (this.vURLPR.length > 9) {
						vURLCountPR = "/PurchaseReqItemSet" + this.vURLPR +
							"&$select=Purchaserequisition%2cPurchaserequisitionitem%2cPurchaserequisitionitemtext%2cQuantity%2cMaterialcomponentprice%2cPurgdoctransactioncurrency%2cMaterialpriceunitqty%2cMaterialbaseunit%2cFixedvendor%2cSupplier%2cSupplyingvendorname%2cDeliverydate%2cSupplyingplantname%2cPlant%2cMaterial%2cMaterialname";
					} else {
						vURLCountPR = "/PurchaseReqItemSet?$skip=0&$top=" + this.vPRCount +
							"&$orderby=Purchaserequisition%20asc,Purchaserequisitionitem%20asc&$select=Purchaserequisition%2cPurchaserequisitionitem%2cPurchaserequisitionitemtext%2cQuantity%2cMaterialcomponentprice%2cPurgdoctransactioncurrency%2cMaterialpriceunitqty%2cMaterialbaseunit%2cFixedvendor%2cSupplier%2cSupplyingvendorname%2cDeliverydate%2cSupplyingplantname%2cPlant%2cMaterial%2cMaterialname";
					}
				} else {
					vURLCountPR = "/PurchaseReqItemSet?$skip=0&$top=" + this.vPRCount +
						"&$orderby=Purchaserequisition%20asc,Purchaserequisitionitem%20asc&$select=Purchaserequisition%2cPurchaserequisitionitem%2cPurchaserequisitionitemtext%2cQuantity%2cMaterialcomponentprice%2cPurgdoctransactioncurrency%2cMaterialpriceunitqty%2cMaterialbaseunit%2cFixedvendor%2cSupplier%2cSupplyingvendorname%2cDeliverydate%2cSupplyingplantname%2cPlant%2cMaterial%2cMaterialname";
				}
			//	var vURLCountPR = "/PurchaseReqItemSet?$skip=0&$top=" + this.vPRCount +
			//		"&$orderby=Purchaserequisition%20asc,Purchaserequisitionitem%20asc&$select=Purchaserequisition%2cPurchaserequisitionitem%2cPurchaserequisitionitemtext%2cQuantity%2cMaterialcomponentprice%2cPurgdoctransactioncurrency%2cMaterialpriceunitqty%2cMaterialbaseunit%2cFixedvendor%2cSupplier%2cSupplyingvendorname%2cDeliverydate%2cSupplyingplantname%2cPlant%2cMaterial%2cMaterialname";
				//	var vURLCountPR =
				//		"/PurchaseReqItemSet?$skip=0&$top=1000&$orderby=Purchaserequisition%20asc,Purchaserequisitionitem%20asc&$select=Purchaserequisition%2cPurchaserequisitionitem%2cPurchaserequisitionitemtext%2cQuantity%2cMaterialcomponentprice%2cPurgdoctransactioncurrency%2cMaterialpriceunitqty%2cMaterialbaseunit%2cFixedvendor%2cSupplier%2cSupplyingvendorname%2cDeliverydate%2cSupplyingplantname%2cPlant%2cMaterial";
				jQuery.proxy(oModelForPRCount.read(vURLCountPR, null,
					null, true, jQuery.proxy(function(data,
						response) {
						var oSmartFilterBar = this.byId("smartFilterId"),
							aFilters = [];
						aFilters = oSmartFilterBar.getFilters();
						var oPRlistJSModel = new sap.ui.model.json.JSONModel({
							'results': data.results //aPRlistRows
						});
						var oExport = new sap.ui.core.util.Export({
							exportType: new sap.ui.core.util.ExportTypeCSV({
								separatorChar: ","
							}), // Type that will be used to generate the content. Own ExportType's can be created to support other formats
							models: oPRlistJSModel, // Pass in the model created above
							rows: {
								path: "/results",
							//	filters: aFilters,
							//	threshold: 1000
									//                            sorter : oSorter
							}, // binding information for the rows aggregation
							columns: [ // column definitions with column name and binding info for the content
								//this.byId('purchaseRequisitionItemTable').getAggregation('columns')[0].getAggregation('header').getText()
								{
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[0].getAggregation('header').getText(),
									template: {
										content: "{parts:[{path:'Purchaserequisition'},{path:'Purchaserequisitionitem'}], formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatPrNumItmNum'}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[1].getAggregation('header').getText(),
									template: {
										content: "{Purchaserequisitionitemtext}"
									}
								}, {
									name: "{i18n>MAT}",
									template: {
										content: "{Material}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[2].getAggregation('header').getText(),
									template: {
										content: "{Materialname}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[3].getAggregation('header').getText(),
									template: {
										content: "{Quantity}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[4].getAggregation('header').getText(),
									template: {
										content: "{parts:[{path:'Materialcomponentprice'},{path:'Purgdoctransactioncurrency'},{path:'Materialpriceunitqty'},{path:'Materialbaseunit'}], formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatPrizeCurr'}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[5].getAggregation('header').getText(),
									template: {
										content: "{parts:[{path:'Fixedvendor'},{path:'Supplier'},{path:'Supplyingvendorname'}],formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatSelectSupplier'}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[6].getAggregation('header').getText(),
									template: {
										content: "{path:'Deliverydate',formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatDateRead'}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[7].getAggregation('header').getText(),
									template: {
										content: "{parts:[{path:'Supplyingplantname'},{path:'Plant'}], formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatDescMatnr'}"
									}
								},
							]
						});

						oExport.saveFile().always(function() { // download exported f ile
							this.destroy();
						});

					}, this),
					function(error) {
						// show error message box
					}), this);

				/*		var oSmartFilterBar = this.byId("smartFilterId"),
							aFilters = [];
						aFilters = oSmartFilterBar.getFilters();
						var aPRlistRows = new Array();
						var aSearch;
						var iCount;
						for (iCount = 0; iCount < this.byId("purchaseRequisitionItemTable").getAggregation('items').length; iCount++) {
							if (this.byId("purchaseRequisitionItemTable").getAggregation('items')[iCount].getBindingContext()) {
								aSearch = (this.byId("purchaseRequisitionItemTable").getAggregation('items')[iCount].getBindingContext().getPath());
								aSearch = aSearch.substring(1);
								aPRlistRows.push(this.byId("purchaseRequisitionItemTable").getModel().oData[aSearch]);
							}
						}
						//              for(var sProperty in this.byId("purchaseRequisitionItemTable").getModel().oData){
						//               aPRlistRows.push(this.byId("purchaseRequisitionItemTable").getModel().oData[sProperty]);
						//              }

						var oPRlistJSModel = new sap.ui.model.json.JSONModel({
							'results': aPRlistRows
						});
						var oExport = new sap.ui.core.util.Export({
							exportType: new sap.ui.core.util.ExportTypeCSV({
								separatorChar: ","
							}), // Type that will be used to generate the content. Own ExportType's can be created to support other formats
							models: oPRlistJSModel, // Pass in the model created above
							rows: {
								path: "/results",
								filters: aFilters,
								threshold: 1000
									//                            sorter : oSorter
							}, // binding information for the rows aggregation
							columns: [ // column definitions with column name and binding info for the content
								//this.byId('purchaseRequisitionItemTable').getAggregation('columns')[0].getAggregation('header').getText()
								{
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[0].getAggregation('header').getText(),
									template: {
										content: "{parts:[{path:'Purchaserequisition'},{path:'Purchaserequisitionitem'}], formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatPrNumItmNum'}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[1].getAggregation('header').getText(),
									template: {
										content: "{Purchaserequisitionitemtext}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[2].getAggregation('header').getText(),
									template: {
										content: "{Materialname}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[3].getAggregation('header').getText(),
									template: {
										content: "{Quantity}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[4].getAggregation('header').getText(),
									template: {
										content: "{parts:[{path:'Materialcomponentprice'},{path:'Purgdoctransactioncurrency'},{path:'Materialpriceunitqty'},{path:'Materialbaseunit'}], formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatPrizeCurr'}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[5].getAggregation('header').getText(),
									template: {
										content: "{parts:[{path:'Fixedvendor'},{path:'Supplier'},{path:'Supplyingvendorname'}],formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatSelectSupplier'}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[6].getAggregation('header').getText(),
									template: {
										content: "{path:'Deliverydate',formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatDateRead'}"
									}
								}, {
									name: this.byId("purchaseRequisitionItemTable").getAggregation('columns')[7].getAggregation('header').getText(),
									template: {
										content: "{parts:[{path:'Supplyingplantname'},{path:'Plant'}], formatter:'ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter.formatDescMatnr'}"
									}
								},
							]
						});

						oExport.saveFile().always(function() { // download exported f ile
							this.destroy();
						});
						*/

			},

			CreatePOEnableCheckPostUpdate: function(Purchaserequisition, Purchaserequisitionitem) {
				var oSelectedItems = this.byId("purchaseRequisitionItemTable").getSelectedContexts();
				var items, oData, bEnabled;
				if (oSelectedItems.length == 0) // atleast one item should be selected
				{
					bEnabled = false;
				} else {
					for (items = 0; items < oSelectedItems.length; items++) {
						oData = oSelectedItems[items].getProperty(oSelectedItems[items].getPath()); // selected item should have a SoS selected
						/*	if (oData.Purchaserequisition !== Purchaserequisition && //skipping the PR for which the SOS was assigned
								oData.Purchaserequisitionitem !== Purchaserequisitionitem) {*/
						if ((oData.Fixedvendor === null || oData.Fixedvendor === undefined || oData.Fixedvendor === "") &&
							(oData.Supplier === null || oData.Supplier === undefined || oData.Supplier === "")) {
							bEnabled = false;
							break;
						} else {
							bEnabled = true;
						}
						//	}
					}
				}
				this.byId("CreatePO").setEnabled(bEnabled);
			},

			onSosConfirm: function(oEvent) {

				var vsupplier = oEvent.getSource().getModel().getProperty('LIFNR', oEvent.getParameter('selectedContexts')[0]);
				var vInfoRecord = oEvent.getSource().getModel().getProperty('INFNR', oEvent.getParameter('selectedContexts')[0]);
				var vNetPrice = oEvent.getSource().getModel().getProperty('NETPR', oEvent.getParameter('selectedContexts')[0]);
				var vCurrency = oEvent.getSource().getModel().getProperty('WAERS', oEvent.getParameter('selectedContexts')[0]);
				var vContract = oEvent.getSource().getModel().getProperty('EBELN', oEvent.getParameter('selectedContexts')[0]);
				var vSosType = oEvent.getSource().getModel().getProperty('VRTYP', oEvent.getParameter('selectedContexts')[0]);
				var vContractItem = oEvent.getSource().getModel().getProperty('EBELP', oEvent.getParameter('selectedContexts')[0]);
				var vPurchasingOrg = oEvent.getSource().getModel().getProperty('EKORG', oEvent.getParameter('selectedContexts')[0]);

				var oModelEditFgt = this.oApplicationFacade.oApplicationImplementation.getModel('ModelEditFragment');
				if (this.idSourceSOSFgt == "linkSOSEditFgt") // opened from edit fragment
				{
					oModelEditFgt.getData().Fixedvendor = vsupplier; // updating supplier of model data
					oModelEditFgt.getData().Purchasinginforecord = vInfoRecord;
					oModelEditFgt.getData().Materialcomponentprice = vNetPrice;
					oModelEditFgt.getData().Purgdoctransactioncurrency = vCurrency;
					oModelEditFgt.getData().PurchaseContract = vContract;
					oModelEditFgt.getData().PurchaseContractItem = vContractItem;
					oModelEditFgt.getData().RequisitionSourceOfSupplyType = vSosType;
					oModelEditFgt.getData().FixedVendorSet = true;
					oModelEditFgt.getData().Supplier = '';
					this['editDialog'].setModel(oModelEditFgt);
					oModelEditFgt.refresh(); // refresh the data on UI
				} else {
					var oPayloadForSoSUpdate = {
						'Purchaserequisition': this.selectedPurReq,
						'Purchaserequisitionitem': this.selectedPurReqItem,
						'Fixedvendor': vsupplier,
						'Purchasinginforecord': vInfoRecord,
						'Materialcomponentprice': vNetPrice,
						'Purgdoctransactioncurrency': vCurrency,
						'PurchaseContract': vContract,
						'PurchaseContractItem': vContractItem,
						'RequisitionSourceOfSupplyType': vSosType,
						'Supplier': '',
						'Upd_scenario': 'S',
						'Purchasingorganization': vPurchasingOrg
					};

					var sURLUpdatePR = "/PurchaseReqItemSet(Purchaserequisition='" +
						oPayloadForSoSUpdate.Purchaserequisition + "',Purchaserequisitionitem='" + oPayloadForSoSUpdate.Purchaserequisitionitem + "')";
					var oModelForPRList = this.oApplicationFacade.getODataModel();
					if (oPayloadForSoSUpdate.tempSupplier !== undefined || oPayloadForSoSUpdate.tempSupplier !== null) {
						delete oPayloadForSoSUpdate.tempSupplier;
					}
					oModelForPRList.update(sURLUpdatePR, oPayloadForSoSUpdate, null,
						jQuery.proxy(function() { //function for success
							this.CreatePOEnableCheckPostUpdate(oPayloadForSoSUpdate.Purchaserequisition, oPayloadForSoSUpdate.Purchaserequisitionitem);
						}, this),
						function(oErrorUpdate) { //function for error
							var error = "";
							var oError = JSON.parse(oErrorUpdate.response.body).error;
							error += oError.message.value;
							//Uncomment if you want to display the all the errors coming from backend                    
							/*           for (var errorCnt=0; errorCnt < oError.innererror.errordetails.length-1; errorCnt++) {
                                                                                                                                if (errorCnt==0) {
                                                                                                                                                error+="\n\n";
                                                                                                                                                error+="Details:\n";
                                                                                                                                }

                                                                                                                                if (oError.innererror.errordetails[errorCnt].code!="/IWBEP/CX_MGW_BUSI_EXCEPTION") {
                                                                                                                                                //error+="\n";
                                                                                                                                                error+=oError.innererror.errordetails[errorCnt].message;
                                                                                                                                                if (errorCnt < (oError.innererror.errordetails.length-1)) {
                                                                                                                                                                error+="\n";
                                                                                                                                                }
                                                                                                                                }
                                                                                                                }*/
							sap.ca.ui.message
								.showMessageBox({
									type: sap.ca.ui.message.Type.ERROR,
									message: error,
								}, null);
						});
				}

			},

			onDialogOkButton: function(oEvent) {
				//focus has to be shifted for update in iPad
				oEvent.getSource().focus();
				var oModelForPRList = this.oApplicationFacade.getODataModel(); // main PR List model
				var oPayloadForUpdatePR = oEvent.getSource().getModel().getData(); // getting updated data from edit fragment
				var userEnteredVendor = sap.ui.getCore().byId('supplierF4multiInput').getValue();
				if (oEvent.getSource().getModel().getData().tempSupplier) {
					oEvent.getSource().getModel().getData().Supplier = oEvent.getSource().getModel().getData().tempSupplier;
					delete oEvent.getSource().getModel().getData().tempSupplier;
					oEvent.getSource().getModel().getData().Fixedvendor = '';
					oEvent.getSource().getModel().getData().Purchasinginforecord = '';
					oEvent.getSource().getModel().getData().PurchaseContract = '';
					oEvent.getSource().getModel().getData().PurchaseContractItem = '';
					oEvent.getSource().getModel().getData().RequisitionSourceOfSupplyType = '';
				}
				if (oPayloadForUpdatePR.Deliverydate === "" || oPayloadForUpdatePR.Deliverydate === undefined ||
					oPayloadForUpdatePR.Deliverydate === null) // delivery date is required field
				{
					this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl()
						.getResourceBundle();
					var mandatoryMsg = this.oResourceBundle.getText("EditMessage");
					sap.ca.ui.message
						.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: mandatoryMsg
						}, null);
				} else if (oPayloadForUpdatePR.Quantity === "" || oPayloadForUpdatePR.Quantity === "NaN" || oPayloadForUpdatePR.Quantity === undefined ||
					oPayloadForUpdatePR.Quantity < 0 || oPayloadForUpdatePR.Quantity === 0 || oPayloadForUpdatePR.Quantity === "0") // Quantity is required field
				{
					this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl()
						.getResourceBundle();
					var mandatoryqtyMsg = this.oResourceBundle.getText("MandatoryQuantity");
					sap.ca.ui.message
						.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: mandatoryqtyMsg
						}, null);
				} else {
					if (this.bDateChanged) {
						var oDeliveryDate = new Date(oPayloadForUpdatePR.Deliverydate);
						if (oDeliveryDate.getUTCDate() != oDeliveryDate.getDate()) {
							oDeliveryDate.setDate(oPayloadForUpdatePR.Deliverydate.getDate() + 1);
						}
						oPayloadForUpdatePR.Deliverydate = oDeliveryDate;
					}
					if (!oPayloadForUpdatePR.FixedVendorSet) {
						if (userEnteredVendor === "Supplier") // code not required as 'Supplier' mentioned as placeholder text and not watermark
						{
							oPayloadForUpdatePR.Fixedvendor = "";
							oPayloadForUpdatePR.Supplier = ""; // set to blank if sos not selected. (else default "Supplier" would get updated in backend.
						} // set to blank if sos not selected. (else default "Supplier" would get updated in backend.
						else {
							oPayloadForUpdatePR.Supplier = userEnteredVendor;
						}
					}

					if (oPayloadForUpdatePR.FixedVendorSet) {
						delete oPayloadForUpdatePR.FixedVendorSet;
					}
					var sURLUpdatePR = "/PurchaseReqItemSet(Purchaserequisition='" +
						oPayloadForUpdatePR.Purchaserequisition + "',Purchaserequisitionitem='" + oPayloadForUpdatePR.Purchaserequisitionitem + "')"; //URL for calling update
					if (oPayloadForUpdatePR.tempSupplier != undefined || oPayloadForUpdatePR.tempSupplier != null) {
						delete oPayloadForUpdatePR.tempSupplier;
					}
					oModelForPRList.update(sURLUpdatePR, oPayloadForUpdatePR, null,
						jQuery.proxy(function() { //function for success
							//create PO button enable check
							this.CreatePOEnableCheckPostUpdate(oPayloadForUpdatePR.Purchaserequisition, oPayloadForUpdatePR.Purchaserequisitionitem);
						}, this),
						jQuery.proxy(function(oErrorUpdate) {

							//function for error
							var error = "";
							if (JSON.parse(oErrorUpdate.response.body).error != "undefined" && JSON.parse(oErrorUpdate.response.body).error != "NULL" &&
								oErrorUpdate.response.body != "NULL" && oErrorUpdate.response.body != "undefined") {
								var oError = JSON.parse(oErrorUpdate.response.body).error;
								var iChangeRespCount = oError.innererror.errordetails.length;
								var iNoOfErrorMsgs = 0;
								if (iChangeRespCount > 0) {
									var iMsgCount = 0;
									var aMessages = oError.innererror.errordetails;
									var aCompErrMessage = new Array();
									for (iMsgCount = 0; iMsgCount < aMessages.length; iMsgCount++) {
										var oCompErrMessage = {
											name: aMessages[iMsgCount].message,
											state: this._getMessageState(aMessages[iMsgCount].severity),
											icon: this._getMessageIcon(aMessages[iMsgCount].severity)
										};
										if (aMessages[iMsgCount].severity == 'warning' || aMessages[iMsgCount].severity == 'error') {
											aCompErrMessage.push(oCompErrMessage);
											iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
										}
									}
									var oMessagePopup = this._getMessagePopupForEdit(aCompErrMessage);
									if (iNoOfErrorMsgs > 1) {
										//                                                            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
										oMessagePopup.open();
									}

								}
							}
						}, this));
					oEvent.getSource().getParent().close();
				}
				this.bDateChanged = false;
			},

			handleNav: function(oEvent) {
				var selectedLine = oEvent.getSource().getBindingContext().getObject();

				var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");

				oCrossAppNavigator.toExternal({

					target: {
						semanticObject: "PurchaseRequisition",
						action: "displayFactSheet"
					},

					params: {
						PurchaseRequisition: [selectedLine.Purchaserequisition],
						PurchaseRequisitionItem: [selectedLine.Purchaserequisitionitem]
					}

				});
			},

			onPressDrpDnList: function(oEvent) {
				if (!this._oDialog) {
					this._oDialog = sap.ui
						.xmlfragment(
							"ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.sortDialog",
							this);
				}
				this._oDialog.setModel(this.getView().getModel());
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this
					.getView(), this._oDialog);
				this.getView().addDependent(this._oDialog);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				this._oDialog.open();
			},

			onPressGrouping: function(oEvent) {
				if (!this._oDialogGroup) {
					this._oDialogGroup = sap.ui
						.xmlfragment(
							"ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.groupingDialog",
							this);
				}
				this._oDialogGroup.setModel(this.getView().getModel());
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this
					.getView(), this._oDialog);
				this.getView().addDependent(this._oDialogGroup);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogGroup);
				this._oDialogGroup.open();
			},

			handleConfirm: function(oEvent) {
				var oTable = this.byId("purchaseRequisitionItemTable");
				var mParams = oEvent.getParameters();
				var oBinding = oTable.getBinding("items");
				var aSorters = [];
				var sPath = mParams.sortItem.getKey();
				var bDescending = mParams.sortDescending;
				if (sPath == "Supplier") {
					aSorters = [
						new sap.ui.model.Sorter("Fixedvendor", bDescending),
						new sap.ui.model.Sorter("Supplier", bDescending)
					];
					oBinding.sort(aSorters);
				} else if (sPath === "Purchaserequisition") {
					aSorters = [
						new sap.ui.model.Sorter("Purchaserequisition", bDescending),
						new sap.ui.model.Sorter("Purchaserequisitionitem", bDescending)
					];
					oBinding.sort(aSorters);
				} else {
					aSorters.push(new sap.ui.model.Sorter(sPath,
						bDescending));
					oBinding.sort(aSorters);
				}
			},

			handleConfirmGrouping: function(oEvent) {
				var oTable = this.byId("purchaseRequisitionItemTable");
				var mParams = oEvent.getParameters();
				var oBinding = oTable.getBinding("items");
				var bSorters = [];
				var sPath;
				var bDescending;
				if (mParams.groupItem) {
					sPath = mParams.groupItem.getKey();
					bDescending = mParams.groupDescending;
					var vGroup = this.mGroupFunctions[sPath];
					if (sPath !== undefined && sPath !== "") {
						bSorters.push(new sap.ui.model.Sorter(sPath,
							bDescending, vGroup));
						oBinding.sort(bSorters);
					}
				}
				sPath = "Purchaserequisition";
				bDescending = mParams.sortDescending;
				bSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
				oBinding.sort(bSorters);
			},

			onExit: function() {
				if (this._oDialog) {
					this._oDialog.destroy();
				}

				if (this._oPopover) {
					this._oPopover.destroy();
				}
			},

			handleBusinessCard: function(oEvent) {
				this.idSourceVendorFgt = oEvent.getSource().getId();
				var vVendor = oEvent.getSource().getText();
				var aVendorId = vVendor.split('(');
				var sVendorId = aVendorId[aVendorId.length - 1];
				var oModelVendor = this.oApplicationFacade.getODataModel();
				var vURLVendor = "/VendorSet(Supplier='" + sVendorId + "')";

				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.businessCard", this);
					this.getView().addDependent(this._oPopover);
				}
				jQuery.proxy(oModelVendor.read(
						vURLVendor, null, null, true, jQuery.proxy(
							function(data, response) {
								this._oPopover.setModel(new sap.ui.model.json.JSONModel(data));
								this._oPopover.setContentHeight('auto');
							},
							this),
						function(error) {

						}),
					this);
				//                                                            delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
				var oFixedVendorClick = oEvent.getSource();
				jQuery.sap.delayedCall(0, this, function() {
					this._oPopover.openBy(oFixedVendorClick);
				});
			},

			onValueHelpRequest: function(oEvent) {
				this.theTokenInput = this.getView().byId("supplierF4multiInput");
				var oInputFieldSupplier = oEvent.getSource();
				this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var supplierValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
					title: this.oResourceBundle.getText("SUP"),
					modal: true,
					supportMultiselect: false,
					supportRanges: false,
					supportRangesOnly: false,
					key: "Supplier",
					descriptionKey: "Vendorname",
					ok: jQuery.proxy(function(oControlEvent) {

						var sUserEnteredSupplier = oInputFieldSupplier.setValue(oControlEvent.getParameter("tokens")[0].getKey());
						// oInputFieldSupplier.setTokens(oControlEvent.getParameter("tokens"));
						oInputFieldSupplier.getModel().getData().tempSupplier = sUserEnteredSupplier;
						supplierValueHelpDialog.close();
					}, this),

					cancel: function(oControlEvent) {
						supplierValueHelpDialog.close();
					},

					afterClose: function() {
						supplierValueHelpDialog.destroy();
					}
				});

				var oModelSoS = this.oApplicationFacade.getODataModel(); // 
				var vURLVendor = "/VendorSet";

				jQuery.proxy(oModelSoS.read(
						vURLVendor, null, null, true, jQuery.proxy(
							function(data, response) {

								var supplierF4ColModel = new sap.ui.model.json.JSONModel();
								supplierF4ColModel.setData({
									cols: [{
										label: this.oResourceBundle.getText("SID"),
										template: "Supplier"
									}, {
										label: this.oResourceBundle.getText("SNAME"),
										template: "Vendorname"
									}]
								});
								supplierValueHelpDialog.setModel(supplierF4ColModel, "columns");
								var supplierF4RowsModel = new sap.ui.model.json.JSONModel();
								supplierF4RowsModel.setData(data.results);
								supplierValueHelpDialog.setModel(supplierF4RowsModel);
								supplierValueHelpDialog.getTable().bindRows("/");
								//                                            supplierValueHelpDialog.theTable.getTitle().setText('Supplier');
							},
							this),
						function(error) {
							// show error message box
						}),
					this);

				supplierValueHelpDialog.setKey("Supplier");
				supplierValueHelpDialog.setKeys(["Supplier", "Vendorname"]);

				supplierValueHelpDialog.setRangeKeyFields([{
					label: this.oResourceBundle.getText("SID"),
					key: "Supplier"
				}, {
					label: this.oResourceBundle.getText("SNAME"),
					key: "Vendorname"
				}]);

				supplierValueHelpDialog.setTokens(oInputFieldSupplier.getTokens());
				var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
					//		id: "F4SupplierDialog",
					advancedMode: true,
					filterBarExpanded: false,
					filterGroupItems: [
						new sap.ui.comp.filterbar.FilterGroupItem({
							groupName: "SID",
							name: "S_ID",
							label: this.oResourceBundle.getText("SID"),
							control: new sap.m.Input()
						}),
						new sap.ui.comp.filterbar.FilterGroupItem({
							groupName: "SNAME",
							name: "S_NAME",
							label: this.oResourceBundle.getText("SNAME"),
							control: new sap.m.Input()
						})
					],
					search: function(oEvent) {
						var aSelectionSet = oEvent.getParameters().selectionSet;
						var oBinding = supplierValueHelpDialog.theTable.getBinding("rows");
						//            var oBinding = oEvent.getSource().getParent().getParent().getBinding("rows");
						var aFilterItems = [];
						var bAllFieldsEmpty = true;
						var oFilter = {};
						var aFilter = [];
						if (aSelectionSet[0].getValue() != "") {
							var oFilterCode = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, aSelectionSet[0].getValue());
							aFilterItems.push(oFilterCode);
							bAllFieldsEmpty = false;
						}
						if (aSelectionSet[1].getValue() != "") {
							var oFilterName = new sap.ui.model.Filter("Vendorname", sap.ui.model.FilterOperator.Contains, aSelectionSet[1].getValue());
							aFilterItems.push(oFilterName);
							bAllFieldsEmpty = false;
						}
						if (!bAllFieldsEmpty) {
							oFilter = new sap.ui.model.Filter(aFilterItems, true);
							aFilter.push(oFilter);
						}
						oBinding.filter(aFilter);
					}
				});
				if (oFilterBar.setBasicSearch) {
					oFilterBar.setBasicSearch(new sap.m.SearchField({
						showSearchButton: sap.ui.Device.system.phone,
						placeholder: "{i18n>SRCH}",
						id: "SupplierBasicSearch",
						search: function(event) {
							var supplierBasicSearchText = event.getSource().getValue();
							if (supplierBasicSearchText !== "") {
								var aFilterItems = [];
								var oFilter = {};
								var aFilter = [];
								var oBinding = supplierValueHelpDialog.theTable.getBinding("rows");
								var oFilterCode = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, supplierBasicSearchText);
								aFilterItems.push(oFilterCode);
								var oFilterName = new sap.ui.model.Filter("Vendorname", sap.ui.model.FilterOperator.Contains, supplierBasicSearchText);
								aFilterItems.push(oFilterName);
								oFilter = new sap.ui.model.Filter(aFilterItems, false);
								aFilter.push(oFilter);
								oBinding.filter(aFilter);
							}
						}
					}));
				}
				supplierValueHelpDialog
					.setFilterBar(oFilterBar);
				if (oInputFieldSupplier.$()
					.closest(".sapUiSizeCompact").length > 0) { // check if the Token field runs in Compact mode
					supplierValueHelpDialog.addStyleClass("sapUiSizeCompact");
				}
				supplierValueHelpDialog.open();
			},

			// Added for the Demo for RFQ
			onPressCreateDraftRFQ: function(oEvent) {
				var selecteditems = this.byId("purchaseRequisitionItemTable").getSelectedContexts();
				this.oApplicationFacade.oApplicationImplementation.setModel(selecteditems, "selectedRFQItem");
				var firstrfq = selecteditems[0].getProperty(selecteditems[0].getPath());
				var vPurOrg = firstrfq.Purchasingorganization;
				var vPurGrp = firstrfq.Purchasinggroup;
				var porgflag = true;
				var vNavFlag = false;
				var bIsRfq = true;
				var aAddrErrMessage = new Array();
				var oMessagePopup;
				for (var i = 1; i < selecteditems.length; i++) {
					var chkrfq = selecteditems[i].getProperty(selecteditems[i].getPath());
					if (vPurOrg != chkrfq.Purchasingorganization || vPurGrp != chkrfq.Purchasinggroup) {
						//oMessagePopup = this._getPopupforDiffPorg(oEvent);
						//	oMessagePopup.open();
						var oPorgErrMsg = {
							name: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PopUpTxt"),
							state: this._getMessageState("error"),
							icon: this._getMessageIcon("error")
						};
						aAddrErrMessage.push(oPorgErrMsg);
						porgflag = false;
						break;
					}
				}
				for (i = 0; i < selecteditems.length; i++) {
					var oRFQForAddr = selecteditems[i].getProperty(selecteditems[i].getPath());
					//check if the purchasingdocumentitemcategory - only standard and third party supported
					if (oRFQForAddr.Purchasingdocumentitemcategory !== "0" && oRFQForAddr.Purchasingdocumentitemcategory !== "5") {
						var oAddrErrMsg = {
							name: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("errPRCategory") +
								" " + oRFQForAddr.Purchaserequisition + "/" + oRFQForAddr.Purchaserequisitionitem,
							state: this._getMessageState("error"),
							icon: this._getMessageIcon("error")
						};
						aAddrErrMessage.push(oAddrErrMsg);
					} else if (oRFQForAddr.Cityname === "" || oRFQForAddr.Country === "") {
						var oAddrErrMsg = {
							name: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("errAdd") + " " + oRFQForAddr.Purchaserequisition +
								"/" +
								oRFQForAddr.Purchaserequisitionitem,
							state: this._getMessageState("error"),
							icon: this._getMessageIcon("error")
						};
						aAddrErrMessage.push(oAddrErrMsg);
					}
					var oDeliverydate = oRFQForAddr.Deliverydate;
					var oCurrDate = new Date();
					if (oCurrDate > oDeliverydate && oCurrDate.getDate() != oDeliverydate.getDate()) {
						var oDelErrMsg = {
							name: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("errDeliveryDate") + " " + oRFQForAddr.Purchaserequisition +
								"/" +
								oRFQForAddr.Purchaserequisitionitem,
							state: this._getMessageState("error"),
							icon: this._getMessageIcon("error")
						};
						aAddrErrMessage.push(oDelErrMsg);
					}
				}
				if (aAddrErrMessage.length > 0) {
					oMessagePopup = this._getMessagePopup(aAddrErrMessage, vNavFlag, bIsRfq);
					jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
					oMessagePopup.open();
				} else if (porgflag == true) {
					var buttonID = oEvent.getSource().getId();
					var isRFQButton = buttonID.match("CreateRFQ");
					if (isRFQButton !== null || isRFQButton !== undefined) {
						this.onPressCreateDraft(oEvent, true);
					}
				}
			},

			onPressCreateDraft: function(oEvent, bIsRFQCreateDraft) {
				var aBatch = [];
				var sFollowOnDocumentType;
				this.byId('CreatePO').setEnabled(false);
				this.byId('CreateRFQ').setEnabled(false);
				var oSelectedItems = this.byId("purchaseRequisitionItemTable").getSelectedContexts();

				var oDataModel = this.oApplicationFacade.getODataModel();

				if (bIsRFQCreateDraft) {
					sFollowOnDocumentType = "RFQ";
				} else {
					sFollowOnDocumentType = "PO";
				}

				for (var i = 0; i < oSelectedItems.length; i++) {

					var oData = oSelectedItems[i].getProperty(oSelectedItems[i].getPath());
					var sUrl = "CreateDrafts?Purchaserequisition='" + oData.Purchaserequisition +
						"'&Purchaserequisitionitem='" + oData.Purchaserequisitionitem +
						"'&Followondocumenttype='" + sFollowOnDocumentType + "'";
					var oPayload = {
						'Purchaserequisition': oData.Purchaserequisition,
						'Purchaserequisitionitem': oData.Purchaserequisitionitem,
						'Followondocumenttype': sFollowOnDocumentType
					};
					aBatch.push(oDataModel.createBatchOperation(sUrl, "POST", oPayload));
				}
				oDataModel.addBatchChangeOperations(aBatch);
				if (sFollowOnDocumentType === "RFQ") {
					oDataModel.submitBatch(jQuery.proxy(this.successCreateDraft, this, "RFQ"), jQuery.proxy(this.errorCreateDraft, this),
						true);
				} else if (sFollowOnDocumentType === "PO") {
					oDataModel.submitBatch(jQuery.proxy(this.successCreateDraft, this, "PO"), jQuery.proxy(this.errorCreateDraft, this),
						true);
				}
			},

			successCreateDraft: function(doctype, data, response) {
				var iChangeRespCount = data.__batchResponses[0].__changeResponses.length;
				if (doctype == "RFQ") {
					var vRFQDraftID;
					var vErrorCode = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).code;
					if (vErrorCode === "DraftId/101") {
						vRFQDraftID = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message;
					}
					// else {
					// 	vRFQDraftID = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).details[0].message;
					// }
				}
				var iNoOfErrorMsgs = 0;
				var vNavFlag = true;
				if (iChangeRespCount > 0 && data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']) {
					var iMsgCount = 0;
					var bResponseMsg = data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message'];
					if (bResponseMsg !== undefined) {
						var aMessages = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).details;
						var aCompErrMessage = new Array();
						var oCompErrMessage = {
							name: JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message,
							state: this._getMessageState(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity),
							icon: this._getMessageIcon(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity)
						};
						if (JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity == 'warning' ||
							JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity == 'error') {
							if ((JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).code) == 'NO_NAV/100' &&
								(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message) == 'S:NO_NAV:100')
								vNavFlag = false;
							else {
								aCompErrMessage.push(oCompErrMessage);
								iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
							}
						}

						for (iMsgCount = 0; iMsgCount < aMessages.length; iMsgCount++) {
							var oCompErrMessage = {
								name: aMessages[iMsgCount].message,
								state: this._getMessageState(aMessages[iMsgCount].severity),
								icon: this._getMessageIcon(aMessages[iMsgCount].severity)
							};
							if (aMessages[iMsgCount].severity == 'warning' || aMessages[iMsgCount].severity == 'error') {
								if ((aMessages[iMsgCount].code == 'NO_NAV/100') && (aMessages[iMsgCount].message == 'S:NO_NAV:100')) {
									vNavFlag = false;
								} else {
									aCompErrMessage.push(oCompErrMessage);
									iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
								}
							}
						}
						if (doctype == "PO") {
							var oMessagePopup = this._getMessagePopup(aCompErrMessage, vNavFlag, false);
						} else {
							var oMessagePopup = this._getMessagePopup(aCompErrMessage, vNavFlag, true, vRFQDraftID);
						}
						if (iNoOfErrorMsgs > 0) {
							jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
							oMessagePopup.open();
						} else {
							if (doctype == "PO") {
								this.oRouter.navTo("purchaseOrdersPreview");
							} else {
								this.oApplicationFacade.oApplicationImplementation.setModel(vRFQDraftID, "selectedRFQDraftId");
								this.oRouter.navTo("RFQPreview");
							}
						}
					} else {
						if (doctype == "PO") {
							this.oRouter.navTo("purchaseOrdersPreview");
						} else {
							this.oApplicationFacade.oApplicationImplementation.setModel(vRFQDraftID, "selectedRFQDraftId");
							this.oRouter.navTo("RFQPreview");
						}
					}
				} else {
					if (doctype == "PO") {
						this.oRouter.navTo("purchaseOrdersPreview");
					} else {
						this.oApplicationFacade.oApplicationImplementation.setModel(vRFQDraftID, "selectedRFQDraftId");
						this.oRouter.navTo("RFQPreview");
					}
				}
			},

			/*	successCreateRFQDraft: function(data, response) {
					var iChangeRespCount = data.__batchResponses[0].__changeResponses.length;
					var iNoOfErrorMsgs = 0;
					var vNavFlag = true;
					var vRFQDraftID;
					var vErrorCode = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).code;
					if (vErrorCode === "DraftId/101") {
						vRFQDraftID = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message;
					} else {
						vRFQDraftID = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).details[0].message;
					}
					if (iChangeRespCount > 0) {
						var iMsgCount = 0;
						var aMessages = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).details;
						var aCompErrMessage = new Array();
						var oCompErrMessage = {
							name: JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message,
							state: this._getMessageState(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity),
							icon: this._getMessageIcon(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity)
						};
						if (JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity == 'warning' ||
							JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity == 'error') {
							if ((JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).code) == 'NO_NAV/100' &&
								(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message) == 'S:NO_NAV:100')
								vNavFlag = false;
							else {
								aCompErrMessage.push(oCompErrMessage);
								iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
							}
						}
						for (iMsgCount = 0; iMsgCount < aMessages.length; iMsgCount++) {
							var oCompErrMessage = {
								name: aMessages[iMsgCount].message,
								state: this._getMessageState(aMessages[iMsgCount].severity),
								icon: this._getMessageIcon(aMessages[iMsgCount].severity)
							};
							if ((aMessages[iMsgCount].severity == 'warning') || (aMessages[iMsgCount].severity == 'error')) {
								if ((aMessages[iMsgCount].code == 'NO_NAV/100') && (aMessages[iMsgCount].message == 'S:NO_NAV:100')) {
									vNavFlag = false;
								} else {
									aCompErrMessage.push(oCompErrMessage);
									iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
								}
							}
						}
						var oMessagePopup = this._getMessagePopup(aCompErrMessage, vNavFlag, true, vRFQDraftID);
						if (iNoOfErrorMsgs > 0) {
							jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
							oMessagePopup.open();
						} else {
							this.oApplicationFacade.oApplicationImplementation.setModel(vRFQDraftID, "selectedRFQDraftId");
							this.oRouter.navTo("RFQPreview");
						}
					} else {
						this.oApplicationFacade.oApplicationImplementation.setModel(vRFQDraftID, "selectedRFQDraftId");
						this.oRouter.navTo("RFQPreview");
					}
				},

				successCreateDraft: function(data, response) {

					var iChangeRespCount = data.__batchResponses[0].__changeResponses.length;
					var iNoOfErrorMsgs = 0;
					var vNavFlag = true;
					if (iChangeRespCount > 0) {
						var iMsgCount = 0;
						var aMessages = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).details;
						var aCompErrMessage = new Array();
						var oCompErrMessage = {
							name: JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message,
							state: this._getMessageState(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity),
							icon: this._getMessageIcon(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity)
						};
						if (JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity == 'warning' ||
							JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity == 'error') {
							if ((JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).code) == 'NO_NAV/100' &&
								(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message) == 'S:NO_NAV:100')
								vNavFlag = false;
							else {
								aCompErrMessage.push(oCompErrMessage);
								iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
							}
						}

						for (iMsgCount = 0; iMsgCount < aMessages.length; iMsgCount++) {
							var oCompErrMessage = {
								name: aMessages[iMsgCount].message,
								state: this._getMessageState(aMessages[iMsgCount].severity),
								icon: this._getMessageIcon(aMessages[iMsgCount].severity)
							};
							if (aMessages[iMsgCount].severity == 'warning' || aMessages[iMsgCount].severity == 'error') {
								if ((aMessages[iMsgCount].code == 'NO_NAV/100') && (aMessages[iMsgCount].message == 'S:NO_NAV:100')) {
									vNavFlag = false;
								} else {
									aCompErrMessage.push(oCompErrMessage);
									iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
								}
							}
						}
						var oMessagePopup = this._getMessagePopup(aCompErrMessage, vNavFlag, false);
						if (iNoOfErrorMsgs > 0) {
							jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
							oMessagePopup.open();
						} else {
							this.oRouter.navTo("purchaseOrdersPreview");
						}
					} else
						this.oRouter.navTo("purchaseOrdersPreview");
				},*/
			errorCreateDraft: function(err) {},

			_getMessageState: function(severity) {
				switch (severity) {
					case 'error':
						return sap.ui.core.ValueState.Error;
						break;
					case 'warning':
						return sap.ui.core.ValueState.Warning;
						break;
					case 'success':
						return sap.ui.core.ValueState.Success;
						break;
					case 'info':
						return sap.ui.core.ValueState.Success;
						break;
				}
			},
			_getMessageIcon: function(severity) {
				switch (severity) {
					case 'error':
						return "sap-icon://error";
						break;
					case 'warning':
						return "sap-icon://notification";
						break;
					case 'success':
						return "sap-icon://sys-enter";
						break;
					case 'info':
						return "sap-icon://sys-enter";
						break;
				}
			},

			_getMessagePopup: function(aMessages, vNavFlag, bIsRfq, RfqDraft) {
				var data = {
					"messages": aMessages
				};
				var oTable = new sap.m.Table({
					growing: true,
					inset: false,
					fixedLayout: false,
					backgroundDesign: sap.m.BackgroundDesign.Transparent,
					showSeparators: "Inner",
					columns: [
						new sap.m.Column({
							width: "25rem",
							styleClass: "name",
							hAlign: "Left",
							vAlign: "Top",
						})
					]
				});
				var template = new sap.m.ColumnListItem({
					unread: false,
					vAlign: "Top",
					cells: [
						new sap.ui.layout.Grid({
							vSpacing: 0,
							hSpacing: 1,
							content: [
								new sap.m.ObjectStatus({
									icon: "{icon}",
									state: "{state}",
									layoutData: new sap.ui.layout.GridData({
										span: "L2 M2 S2"
									})
								}),
								new sap.m.Text({
									text: "{name}",
									layoutData: new sap.ui.layout.GridData({
										span: "L10 M10 S10"
									})
								})
							]
						})
					]
				});
				this.vNumberofMessages = data.messages.length;
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data);
				oTable.setModel(oModel);
				oTable.bindAggregation("items", "/messages", template);
				this.oMessageDialog = new sap.m.Dialog({
					content: [
						oTable
					],
					buttons: [
						new sap.m.Button({
							text: "{i18n>OK}",
							press: jQuery.proxy(function(e) {
								this.oMessageDialog.close();
								if (vNavFlag == true && bIsRfq == false) {
									this.oRouter.navTo("purchaseOrdersPreview");
								}
								/*if (vNavFlag == true && bIsRfq == true) {
									this.oApplicationFacade.oApplicationImplementation.setModel(RfqDraft, "selectedRFQDraftId");
									this.oRouter.navTo("RFQPreview");
								}*/
								//            this.oRouter.navTo("RFQPreview");
							}, this),
						}),
					],
					state: "None",
					contentWidth: "25rem",
				});
				this.oMessageDialog.setTitle("{i18n>MSG}" + ' (' + this.vNumberofMessages + ')');
				this.getView().addDependent(this.oMessageDialog);
				this.oMessageDialog.addStyleClass("sapUiSizeCompact");
				return this.oMessageDialog;
			},

			_getPopupforDiffPorg: function(oEvent) {
				this.oMessageDialog = new sap.m.Dialog({
					content: new sap.m.Text({
						text: "{i18n>PopUpTxt}"
					}),
					buttons: [
						new sap.m.Button({
							text: "{i18n>OK}",
							press: jQuery.proxy(function(e) {
								this.oMessageDialog.close();
								//	this.onPressCreateDraft(oEvent, true);
							}, this)
						})
						/*	,
							new sap.m.Button({
								text: "{i18n>Cancel}",
								press: jQuery.proxy(function(e) {
									this.oMessageDialog.close();
								}, this)
							})*/
					],
					state: "None",
					contentWidth: "40rem"
				});
				this.oMessageDialog.setTitle("{i18n>Error}");
				this.getView().addDependent(this.oMessageDialog);
				this.oMessageDialog.addStyleClass("sapUiSizeCompact");
				return this.oMessageDialog;
			},

			_getMessagePopupForEdit: function(aMessages) {
				var data = {
					"messages": aMessages
				};
				var oTable = new sap.m.Table({
					growing: true,
					inset: false,
					fixedLayout: false,
					backgroundDesign: sap.m.BackgroundDesign.Transparent,
					showSeparators: "Inner",
					columns: [
						new sap.m.Column({
							width: "25rem",
							styleClass: "name",
							hAlign: "Left",
							vAlign: "Top",
						})
					]
				});

				var template = new sap.m.ColumnListItem({
					unread: false,
					vAlign: "Top",
					cells: [
						new sap.ui.layout.Grid({
							vSpacing: 0,
							hSpacing: 1,
							content: [

								new sap.m.ObjectStatus({
									icon: "{icon}",
									state: "{state}",
									layoutData: new sap.ui.layout.GridData({
										span: "L2 M2 S2"
									})
								}),
								new sap.m.Text({
									text: "{name}",
									layoutData: new sap.ui.layout.GridData({
										span: "L10 M10 S10"
									})
								})
							]
						})
					]
				});

				this.vNumberofMessages = data.messages.length;
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data);
				oTable.setModel(oModel);
				oTable.bindAggregation("items", "/messages", template);
				this.oMessageDialog = new sap.m.Dialog({

					content: [
						oTable,

					],
					buttons: [
						new sap.m.Button({
							text: "{i18n>OK}",
							tap: jQuery.proxy(function(e) {
								this.oMessageDialog.close();
							}, this),

						}),
					],
					state: "None",
					contentWidth: "25rem",
				});
				this.oMessageDialog.setTitle("{i18n>MSG}" + ' (' + this.vNumberofMessages + ')');
				this.getView().addDependent(this.oMessageDialog);
				this.oMessageDialog.addStyleClass("sapUiSizeCompact");
				return this.oMessageDialog;
			},

			onInputCurrencyChanged: function(oEvent) {
				var oQuantity = this.getView().byId("idInputQuantity");
				var oControlBinding = oQuantity.getBinding("value");
				oQuantity.bindProperty("value", oQuantity.getBindingInfo("value"), oControlBinding.getPath(), "app", null, null,
					new ui.ssuite.s2p.mm.pur.pr.prcss.s1.model.types.QuantityType(oEvent.getSource().getValue()));
			},
			callBusinessCard: function(oEvent) {
				sap.m.URLHelper.triggerTel(oEvent.getSource().getText());
			},

			emailBusinessCard: function(oEvent) {
				sap.m.URLHelper.triggerEmail(oEvent.getSource().getText());
			},

			handleMaterialFactSheetNavigation: function(oEvent) {
				var selectedLine = oEvent.getSource().getBindingContext().getObject();
				var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "Material",
						action: "displayFactSheet"
					},
					params: {
						Material: [selectedLine.Material]
					}
				});
			}
		});