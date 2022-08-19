/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require('jquery.sap.resources');
jQuery.sap.require("ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter");
sap.ca.scfld.md.controller.BaseFullscreenController.extend(
	"ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.S3", {

		onInit: function() {

			this.selectedDrafts = new Array();
			this.bValidPOTypeSelected = "true";
			this.oRouter
				.attachRouteMatched(
					jQuery.proxy(function(evt) {

						var sName = evt.getParameter('name');
						if (sName === 'purchaseOrdersPreview') {
							var draftURL = "DraftsPOHeaderSet";

							var oModelDrafts = this.oApplicationFacade.getODataModel();

							oModelDrafts.read(draftURL, null, {
								"$expand": "DraftPOHeaderItemNav"
							}, true, jQuery.proxy(function(oResponse, oData) {
								if (oData.data.results.length === 0) {
									//	this.oRouter.navTo("fullscreen");
									window.history.go(-1);
								}
								for (var iSlNo = 1; iSlNo <= oData.data.results.length; iSlNo++) {
									oData.data.results[iSlNo - 1].DraftSlNo = iSlNo;
									oData.data.results[iSlNo - 1].DraftPOHeaderItemNav = oData.data.results[iSlNo - 1].DraftPOHeaderItemNav.results;
									oData.data.results[iSlNo - 1]['DraftPOHeaderItemNav?DraftPOTypeSet'] = this.oApplicationFacade.oApplicationImplementation.getModel(
										"oJMDraftPOTypes").results;
								}

								var oDataPODrafts = {
									'DraftsPOHeader': oData.data.results
								};

								this.getView().setModel(
									new sap.ui.model.json.JSONModel(oDataPODrafts));
							}, this));

						}
					}, this));

			if (!jQuery.support.touch) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
		},
		handleBusinessCard: function(oEvent) {
			this.idSourceVendorFgt = oEvent.getSource().getId();
			var vVendor = oEvent.getSource().getText();
			var aVendorId = vVendor.split('(');
			var sVendorId = aVendorId[aVendorId.length - 1];
			sVendorId = sVendorId.slice(0, sVendorId.length - 1);
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
					function(error) {}),
				this);
			//				delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oFixedVendorClick = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function() {
				this._oPopover.openBy(oFixedVendorClick);
			});
		},

		handleDelete: function(evt) {
			var oBnCtxtDraftItem = evt.getParameter('listItem').getBindingContext();
			var vDraftId = evt.getSource().getModel().getProperty('DraftId', oBnCtxtDraftItem);
			vDraftId = vDraftId.trim();
			var vItemNo = evt.getSource().getModel().getProperty('PoItem', oBnCtxtDraftItem);
			var draftURL = "DraftsPOItemSet(DraftId='" + vDraftId + "',PoItem='" + vItemNo + "')";
			var oModelDrafts = this.oApplicationFacade.getODataModel();

			oModelDrafts.remove(draftURL, null,
				jQuery.proxy(function() { //function for success
					var draftURL = "DraftsPOHeaderSet";

					var oModelDrafts = this.oApplicationFacade.getODataModel();

					oModelDrafts.read(draftURL, null, {
						"$expand": "DraftPOHeaderItemNav"
					}, true, jQuery.proxy(function(oResponse, oData) {

						for (var iSlNo = 1; iSlNo <= oData.data.results.length; iSlNo++) {
							oData.data.results[iSlNo - 1].DraftSlNo = iSlNo;
							oData.data.results[iSlNo - 1].DraftPOHeaderItemNav = oData.data.results[iSlNo - 1].DraftPOHeaderItemNav.results;
							oData.data.results[iSlNo - 1]['DraftPOHeaderItemNav?DraftPOTypeSet'] = this.oApplicationFacade.oApplicationImplementation.getModel(
								"oJMDraftPOTypes").results;
						}

						var oDataPODrafts = {
							'DraftsPOHeader': oData.data.results
						};

						this.getView().setModel(
							new sap.ui.model.json.JSONModel(oDataPODrafts));
						if (oData.data.results.length == 0) {
							this.oRouter.navTo("fullscreen");
						}
					}, this));

				}, this),
				function(oErrorUpdate) { //function for error
				});
		},

		handleDraftSelect: function(oEvent) {
			var iSelectedDraftId = this.getView().getModel().getProperty('DraftId', oEvent.getSource().getBindingContext());
			var sSelectedPOType = this.getView().getModel().getProperty('DocType', oEvent.getSource().getBindingContext());
			if (sSelectedPOType == "")
				sSelectedPOType = "NB";
			if (oEvent.getSource().getSelected()) {
				this.selectedDrafts.push({
					'draftId': iSelectedDraftId,
					'POType': sSelectedPOType
				});

			} else {
				this._removeArrayValue(this.selectedDrafts, iSelectedDraftId);
			}

			if ((this.selectedDrafts.length > 0) && (this.bValidPOTypeSelected === "true")) {
				this.byId('idButPOSubmit').setEnabled(true);
			} else {
				this.byId('idButPOSubmit').setEnabled(false);
			}

		},

		onNavBack: function(evt) {
			while (this.selectedDrafts.length > 0) {
				this.selectedDrafts.pop();
				this.selectedDrafts.POType = "NB";
			}

			this.byId('idButPOSubmit').setEnabled(false);
			this.byId('idCBPOTypes').setSelectedKey("NB");
			// this.oRouter.navTo("fullscreen", {
			// 	from: "purchaseOrdersPreview"
			// });
			window.history.go(-1);

		},

		onPOTypeChange: function(oEvent) {
			var selectedPOTypeKey = oEvent.getSource().getProperty('selectedKey', oEvent.getSource().getBindingContext());
			if (selectedPOTypeKey == "") {
				oEvent.getSource().setValueState("Error");
				this.byId('idButPOSubmit').setEnabled(false);
				this.bValidPOTypeSelected = "false";
			} else {
				oEvent.getSource().setValueState("None");
				this.bValidPOTypeSelected = "true";
				if (this.selectedDrafts.length > 0) {
					this.byId('idButPOSubmit').setEnabled(true);
				}
			}
		},

		handlePOType: function(oEvent) {
			var selectedDraftId = oEvent.getSource().getBindingContext().getProperty('DraftId');
			var selectedPOTypeKey;
			for (var i = 0; i < this.selectedDrafts.length; i++) {
				if (this.selectedDrafts[i].draftId == selectedDraftId)
					this.selectedDrafts[i].POType = oEvent.getSource().getProperty('selectedKey', oEvent.getSource().getBindingContext());
			}
			selectedPOTypeKey = oEvent.getSource().getModel().setProperty('DocType', oEvent.getSource().getProperty('selectedKey', oEvent.getSource()
				.getBindingContext()), oEvent.getSource().getBindingContext());
		},

		fnCreatePurchaseOrder: function() {

			var aBatchPostCreatePO = [];
			this.byId('idButPOSubmit').setEnabled(false);
			var oDataModel = this.oApplicationFacade.getODataModel();
			for (var i = 0; i < this.selectedDrafts.length; i++) {
				var sUrl = "CreatePurchaseOrder?DraftId='" + this.selectedDrafts[i].draftId + "'&PurchaseOrderType='" + this.selectedDrafts[i].POType +
					"'";
				aBatchPostCreatePO.push(oDataModel.createBatchOperation(sUrl, "POST", null));
			}
			oDataModel.addBatchChangeOperations(aBatchPostCreatePO);
			oDataModel.submitBatch(jQuery.proxy(this.successCreateFOD, this), jQuery.proxy(this.errorCreateFOD, this), true);

		},

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

		successCreateFOD: function(data, response) {

			var iChangeRespCount = data.__batchResponses[0].__changeResponses.length;
			var iMsgCount = 0;
			var aMessages = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).details;
			var aCompErrMessage = new Array();
			var oCompErrMessage = {
				name: JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message,
				state: this._getMessageState(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity),
				icon: this._getMessageIcon(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity)
			};

			aCompErrMessage.push(oCompErrMessage);
			for (iMsgCount = 0; iMsgCount < aMessages.length; iMsgCount++) {
				var oCompErrMessage = {
					name: aMessages[iMsgCount].message,
					state: this._getMessageState(aMessages[iMsgCount].severity),
					icon: this._getMessageIcon(aMessages[iMsgCount].severity)
				};
				aCompErrMessage.push(oCompErrMessage);
			}
			var oMessagePopup = this._getMessagePopup(aCompErrMessage);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
			oMessagePopup.open();
			while (this.selectedDrafts.length > 0) {
				this.selectedDrafts.pop();
			}
		},
		errorCreateFOD: function(error) {},

		_getMessagePopup: function(aMessages) {
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

			var oWindow = this.oRouter;
			var oDataModel = this.oApplicationFacade.getODataModel();

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
							// this.oMessageDialog.destroy();
							oDataModel.refresh();
							var draftURL = "DraftsPOHeaderSet";
							oDataModel.read(draftURL, null, {
								"$expand": "DraftPOHeaderItemNav"
							}, true, jQuery.proxy(function(oResponse, oData) {

								for (var iSlNo = 1; iSlNo <= oData.data.results.length; iSlNo++) {
									oData.data.results[iSlNo - 1].DraftSlNo = iSlNo;
									oData.data.results[iSlNo - 1].DraftPOHeaderItemNav = oData.data.results[iSlNo - 1].DraftPOHeaderItemNav.results;
									oData.data.results[iSlNo - 1]['DraftPOHeaderItemNav?DraftPOTypeSet'] = this.oApplicationFacade.oApplicationImplementation
										.getModel("oJMDraftPOTypes").results;
								}

								var oDataPODrafts = {
									'DraftsPOHeader': oData.data.results
								};
								this.getView().setModel(
									new sap.ui.model.json.JSONModel(oDataPODrafts));
								if (oData.data.results.length == 0) {
									window.history.go(-1);
									//	oWindow.navTo("fullscreen");

								}
							}, this));
						}, this)

					})
				],
				state: "None",
				contentWidth: "25rem"
			});
			//				}

			this.oMessageDialog.setTitle("{i18n>MSG}" + ' (' + this.vNumberofMessages + ')');
			this.getView().addDependent(this.oMessageDialog);

			this.oMessageDialog.addStyleClass("sapUiSizeCompact");

			return this.oMessageDialog;

		},

		_removeArrayValue: function(aSelectedDrafts, draftId) {

			for (var aIndex = 0; aIndex < aSelectedDrafts.length; aIndex++) {
				if (aSelectedDrafts[aIndex].draftId == draftId) {
					aSelectedDrafts.splice(aIndex, 1);
				}
			}
		}
	});