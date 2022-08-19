/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require('jquery.sap.resources');
jQuery.sap.require("ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter");
sap.ca.scfld.md.controller.BaseFullscreenController.extend(
	"ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.S4", {

		onInit: function() {
			this.selectedRFQDrafts = new Array();
			this.oRouter
				.attachRouteMatched(
					jQuery.proxy(function(evt) {
						var sName = evt.getParameter("name");
						if (sName === "RFQPreview") {
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
							var oDraftRFQTypeSet = this.oApplicationFacade.oApplicationImplementation.getModel("oDraftRFQTypes");
							var oRFQTypeModel = new sap.ui.model.json.JSONModel();
							oRFQTypeModel.setData(oDraftRFQTypeSet);
							this.getView().setModel(oRFQTypeModel, "DraftRFQType");
							this.vRFQDraftId = this.oApplicationFacade.oApplicationImplementation.getModel("selectedRFQDraftId");
							if (this.vRFQDraftId === undefined || this.vRFQDraftId === null) {
								window.history.go(-1);
							} else {
								this.vRFQDraftId = this.vRFQDraftId.substr(0, 8) + '-' + this.vRFQDraftId.substr(8, 4) + '-' + this.vRFQDraftId.substr(12, 4) +
									'-' + this.vRFQDraftId.substr(
										16, 4) + '-' + this.vRFQDraftId.substr(20, 12);
								var draftURL = "DraftRFQHeaderSet(Draftid=guid'" + this.vRFQDraftId + "')";
								var oModelDrafts = this.oApplicationFacade.getODataModel();
								oModelDrafts.read(draftURL, null, ["$expand=DraftRFQHeaderItemNav"],
									//,DraftRFQBidderNav"],
									true,
									jQuery.proxy(this.onSuccessRFQDraftRequest, this),
									jQuery.proxy(this.onErrorRFQDraftRequest, this)
								);
								/*	for (var iSlNo = 1; iSlNo <= oData.data.results.length; iSlNo++) {
										oData.data.results[iSlNo - 1].DraftSlNo = iSlNo;
										oData.data.results[iSlNo - 1].DraftRFQHeaderItemNav = oData.data.results[iSlNo - 1].DraftRFQHeaderItemNav.results;
										oData.data.results[iSlNo - 1]['DraftRFQHeaderItemNav?DraftPOTypeSet'] = this.oApplicationFacade.oApplicationImplementation.getModel(
											"oJMDraftPOTypes").results;
									}*/
							}
						}
					}), this);
		},

		onSuccessRFQDraftRequest: function(oResponse, oData) {
			if (!oData.data || oData.data.Draftid === "00000000-0000-0000-0000-000000000000") {
				//	this.oRouter.navTo("fullscreen");
				window.history.go(-1);
			}
			// oData.data.DraftRFQTypeSet = this.oApplicationFacade.oApplicationImplementation.getModel("oDraftRFQTypes");
			var oRFQHeaderModel = new sap.ui.model.json.JSONModel();
			var oRFQItemModel = new sap.ui.model.json.JSONModel();
			var oRFQBidderModel = new sap.ui.model.json.JSONModel();
			//var oRFQTypeModel = new sap.ui.model.json.JSONModel();
			oRFQHeaderModel.setData(oData.data);
			oRFQItemModel.setData(oData.data.DraftRFQHeaderItemNav);
			//oRFQTypeModel.setData(oData.data.DraftRFQTypeSet);
			oRFQBidderModel.setData(oData.data.DraftRFQHeaderBidderNav);
			this.getView().setModel(oRFQHeaderModel, "DraftRFQHeader");
			this.getView().setModel(oRFQItemModel, "DraftRFQItem");
			this.getView().setModel(oRFQBidderModel, "DraftRFQBidder");
			if (oData.data.Purchasingdocumenttype) {
				this.getView().byId("idRFQTypes").setValueState("None");
				// bIsChanged = false;
			} else {
				this.getView().byId("idRFQTypes").setValueState("Error");
			}
			//this.getView().setModel(oRFQTypeModel, "DraftRFQType");
			//this.byId("idRFQTypes").refresh();
			//oRFQBidderModel.setData(oData.data.results.DraftRFQHeaderBidderNav);
		},

		onRFQTypeChange: function(oEvent) {
			var selectedRFQTypeKey = oEvent.getSource().getProperty('selectedKey', oEvent.getSource().getBindingContext());
			if (selectedRFQTypeKey == "") {
				oEvent.getSource().setValueState("Error");
				//this.byId('idButPOSubmit').setEnabled(false);
			} else {
				oEvent.getSource().setValueState("None");
			}
		},

		onChangeRFQDraft: function(oEvent) {
			var oDataModel = this.oApplicationFacade.getODataModel();
			// var vRFQDate = this.getView().byId("idRFQDate").getDateValue();
			var vRFQDescription = this.getView().byId("idRFQDescription").getValue();
			var vRFQType = this.getView().byId('idRFQTypes').getSelectedKey();
			var vRFQSubmission = this.getView().byId("idRFQSubmission").getDateValue();
			var vCurrentDay = new Date();
			if (vRFQSubmission !== null){
				var oSubmissionDate = new Date(vRFQSubmission);
			}
			// var oStartDate = new Date(vRFQDate);
			// var bIsChanged = true;
			if (vRFQSubmission === null) {
				this.getView().byId("idRFQSubmission").setValueState("Error");
				// bIsChanged = false;
			} else {
				if (vCurrentDay.getDate() == oSubmissionDate.getDate() || vCurrentDay < oSubmissionDate) {
					oSubmissionDate.setDate(vRFQSubmission.getDate() + 1);
					this.getView().byId("idRFQSubmission").setValueState("None");
				} else {
					this.getView().byId("idRFQSubmission").setValueState("Error");
					// bIsChanged = false;
				}
			}
			// if (vRFQDate != null) {
			// 	if (vCurrentDay.getDate() == oStartDate.getDate() || vCurrentDay < oStartDate) {
			// 		oStartDate.setDate(vRFQDate.getDate() + 1);
			// 		this.getView().byId("idRFQDate").setValueState("None");
			// 	} else {
			// 		this.getView().byId("idRFQDate").setValueState("Error");
			// 		// bIsChanged = false;
			// 	}
			// }
			if (vRFQType === "") {
				this.getView().byId("idRFQTypes").setValueState("Error");
				// bIsChanged = false;
			} else {
				this.getView().byId("idRFQTypes").setValueState("None");
			}
			// if (vRFQSubmission != null && vRFQDate != null) {
			// 	var compareDate = (oSubmissionDate > oStartDate) || (oSubmissionDate.getDate() == oStartDate.getDate());
			// 	if (compareDate === false) {
			// 		this.getView().byId("idRFQSubmission").setValueState("Error");
			// 		// bIsChanged = false;
			// 	}

			/*else{
				this.getView().byId("idRFQSubmission").setValueState("None");
			}*/
			// }
			// if (bIsChanged === true) {
			var oPayload = {
				'Draftid': this.vRFQDraftId,
				// 'Quotationearliestsubmsndate': oStartDate,
				'Quotationlatestsubmissiondate': oSubmissionDate,
				'Requestforquotationname': vRFQDescription,
				'Purchasingdocumenttype': vRFQType
			};
			var sRFQDraftUrl = "/DraftRFQHeaderSet(Draftid=guid'" + this.vRFQDraftId + "')";
			oDataModel.update(sRFQDraftUrl, oPayload, true, jQuery.proxy(this.oSuccessUpdate, this), jQuery.proxy(this.onErrorUpdate,
				this));
			// }
		},

		oSuccessUpdate: function(data, response) {
			/*	if (JSON.parse(response.headers['sap-message']).severity == 'warning' ||
					JSON.parse(response.headers['sap-message']).severity == 'error') {
					//open message pop

				}*/
			var iMsgCount = 0;
			var aMessages = JSON.parse(response.headers['sap-message']).details;
			var iNoOfErrorMsgs = 0;
			var aCompErrMessage = new Array();
			var oCompErrMessage = {
				name: JSON.parse(response.headers['sap-message']).message,
				state: this._getMessageState(JSON.parse(response.headers['sap-message']).severity),
				icon: this._getMessageIcon(JSON.parse(response.headers['sap-message']).severity)
			};
			if (JSON.parse(response.headers['sap-message']).severity == 'warning' ||
				JSON.parse(response.headers['sap-message']).severity == 'error') {
				aCompErrMessage.push(oCompErrMessage);
				iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
			}
			for (iMsgCount = 0; iMsgCount < aMessages.length; iMsgCount++) {
				var oCompErrMessage = {
					name: aMessages[iMsgCount].message,
					state: this._getMessageState(aMessages[iMsgCount].severity),
					icon: this._getMessageIcon(aMessages[iMsgCount].severity)
				};
				if ((aMessages[iMsgCount].severity == 'warning') || (aMessages[iMsgCount].severity == 'error')) {
					aCompErrMessage.push(oCompErrMessage);
					iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
				}
			}

			if (iNoOfErrorMsgs > 0) {
				var oMessagePopup = this._getMessagePopup(aCompErrMessage);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
				oMessagePopup.open();
			}
			this.successAddBidder();
		},

		onPressAddBidder: function(oEvent) {
			if (!this.bidderFragment) {
				this.bidderFragment = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.BidderDialog",
					this // associate controller with the fragment
				);
				this.getView().addDependent(this.bidderFragment);
				this.bidderFragment.setRememberSelections(false);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.bidderFragment);
			this.bidderFragment.open();
			// var sRFQBidderUrl = "/C_RfqBidderVH";
		},

		onSuccessGetBidder: function(data, response) {
			// var oRFQBidderSet = {
			// 	'RFQBidderSet': data
			// };
			var oBidderModel = new sap.ui.model.json.JSONModel();
			oBidderModel.setData(data);
			this.bidderFragment.setModel(oBidderModel, "RFQBidderSet");
			this.bidderFragment.open();
		},

		onSearchBidder: function(oEvent) {
			// add filter for search in SoS fragment
			var aFilters = [];
			var sQuery = oEvent.getParameter('value');
			sQuery.replace("*", "");
			if (sQuery && sQuery.length > 0) {
				var filter1 = new sap.ui.model.Filter("Supplier",
					sap.ui.model.FilterOperator.Contains,
					sQuery);
				var filter2 = new sap.ui.model.Filter("SupplierName",
					sap.ui.model.FilterOperator.Contains,
					sQuery);
				var filter3 = new sap.ui.model.Filter("AddressID",
					sap.ui.model.FilterOperator.Contains,
					sQuery);
				var filter4 = new sap.ui.model.Filter("PhoneNumber",
					sap.ui.model.FilterOperator.Contains,
					sQuery);
				var filter5 = new sap.ui.model.Filter("EmailAddress",
					sap.ui.model.FilterOperator.Contains,
					sQuery);
				var filter = new sap.ui.model.Filter({
					filters: [filter1, filter2, filter3, filter4, filter5],
					and: false
				});
				aFilters.push(filter);
			}
			// update list binding
			var list = sap.ui.getCore().byId("idList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},

		onPressOkBidder: function(oEvent) {
			var aSelectedContexts = oEvent.getParameter("selectedContexts");
			if (aSelectedContexts.length) {
				var aBatchCreateBidder = [];
				var oDataModel = this.oApplicationFacade.getODataModel();
				for (var i = 0; i < aSelectedContexts.length; i++) {
					var vBidderId = oEvent.getParameter("selectedContexts")[i].getObject().Supplier;

					var sUrl = "AddRFQBidders?Draftid=guid'" + this.vRFQDraftId + "'&Supplier='" + vBidderId + "'";
					aBatchCreateBidder.push(oDataModel.createBatchOperation(sUrl, "POST", null));
				}
				oDataModel.addBatchChangeOperations(aBatchCreateBidder);
				oDataModel.submitBatch(jQuery.proxy(this.successAddBidder, this), jQuery.proxy(this.errorAddBidder, this), true);
			}
		},

		successAddBidder: function() {
			var oDataModel = this.oApplicationFacade.getODataModel();
			this.vRFQDraftId = this.oApplicationFacade.oApplicationImplementation.getModel("selectedRFQDraftId");
			this.vRFQDraftId = this.vRFQDraftId.substr(0, 8) + '-' + this.vRFQDraftId.substr(8, 4) + '-' + this.vRFQDraftId.substr(12, 4) +
				'-' + this.vRFQDraftId.substr(
					16, 4) + '-' + this.vRFQDraftId.substr(20, 12);
			var sDraftUrl = "DraftRFQHeaderSet(Draftid=guid'" + this.vRFQDraftId + "')";
			oDataModel.read(sDraftUrl, null, ["$expand=DraftRFQHeaderItemNav,DraftRFQHeaderBidderNav"],
				true,
				jQuery.proxy(this.onSuccessRFQDraftRequest, this),
				jQuery.proxy(this.onErrorRFQDraftRequest, this)
			);
		},

		handleBidderDelete: function(oEvent) {
			var oBnCtxtDraftItem = oEvent.getParameter('listItem').getBindingContext('DraftRFQBidder');
			//var vItemNo = oBnCtxtDraftItem.sPath.substring(9, oBnCtxtDraftItem.sPath.length);
			var vBidderNo = oBnCtxtDraftItem.sPath.match(/\d+/)[0];
			var oDraftBidder = oEvent.getParameter("listItem").getBindingContext('DraftRFQBidder').getModel().getData().results[vBidderNo];
			var vDraftHdrId = oDraftBidder.Draftid;
			var vDraftBidderId = oDraftBidder.Draftrfqbidder;
			var draftURL = "DraftRFQBidderSet(Draftid=guid'" + vDraftHdrId + "',Draftrfqbidder=guid'" + vDraftBidderId + "')";
			var oModelDrafts = this.oApplicationFacade.getODataModel();
			oModelDrafts.remove(draftURL, null,
				jQuery.proxy(this.onSuccessBidderDelete, this));
		},

		onSuccessBidderDelete: function() { //function for RFQ delete success
			var oModelDrafts = this.oApplicationFacade.getODataModel();
			this.vRFQDraftId = this.oApplicationFacade.oApplicationImplementation.getModel("selectedRFQDraftId");
			this.vRFQDraftId = this.vRFQDraftId.substr(0, 8) + '-' + this.vRFQDraftId.substr(8, 4) + '-' + this.vRFQDraftId.substr(12, 4) +
				'-' + this.vRFQDraftId.substr(
					16, 4) + '-' + this.vRFQDraftId.substr(20, 12);

			var draftURL = "DraftRFQHeaderSet(Draftid=guid'" + this.vRFQDraftId + "')";
			var oModelDrafts = this.oApplicationFacade.getODataModel();
			oModelDrafts.read(draftURL, null, ["$expand=DraftRFQHeaderItemNav,DraftRFQHeaderBidderNav"],
				true,
				jQuery.proxy(this.onSuccessRFQDraftRequest, this),
				jQuery.proxy(this.onErrorRFQDraftRequest, this)
			);
		},

		handleRFQDelete: function(oEvent) {
			var oBnCtxtDraftItem = oEvent.getParameter('listItem').getBindingContext('DraftRFQItem');
			//var vItemNo = oBnCtxtDraftItem.sPath.substring(9, oBnCtxtDraftItem.sPath.length);
			var vItemNo = oBnCtxtDraftItem.sPath.match(/\d+/)[0];
			var oDraftItem = oEvent.getParameter("listItem").getBindingContext('DraftRFQItem').getModel().getData().results[vItemNo];
			var vDraftHdrId = oDraftItem.Draftid;
			var vDraftItmId = oDraftItem.Draftrfqitem;
			var draftURL = "DraftRFQItemSet(Draftid=guid'" + vDraftHdrId + "',Draftrfqitem=guid'" + vDraftItmId + "')";
			var oModelDrafts = this.oApplicationFacade.getODataModel();
			oModelDrafts.remove(draftURL, null,
				jQuery.proxy(this.onSuccessRFQDelete, this));
		},

		onSuccessRFQDelete: function() { //function for RFQ delete success
			var oModelDrafts = this.oApplicationFacade.getODataModel();
			this.vRFQDraftId = this.oApplicationFacade.oApplicationImplementation.getModel("selectedRFQDraftId");
			this.vRFQDraftId = this.vRFQDraftId.substr(0, 8) + '-' + this.vRFQDraftId.substr(8, 4) + '-' + this.vRFQDraftId.substr(12, 4) +
				'-' + this.vRFQDraftId.substr(
					16, 4) + '-' + this.vRFQDraftId.substr(20, 12);

			var draftURL = "DraftRFQHeaderSet(Draftid=guid'" + this.vRFQDraftId + "')";
			var oModelDrafts = this.oApplicationFacade.getODataModel();
			oModelDrafts.read(draftURL, null, ["$expand=DraftRFQHeaderItemNav,DraftRFQHeaderBidderNav"],
				true,
				jQuery.proxy(this.onSuccessRFQDraftRequest, this),
				jQuery.proxy(this.onErrorRFQDraftRequest, this)
			);
		},
		fnRFQSave: function(oEvent) {
			var vRFQNumber = this.oApplicationFacade.oApplicationImplementation.getModel("RFQnumber");
			var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
			if (vRFQNumber !== undefined && vRFQNumber !== null) {
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "RequestForQuotation",
						action: "manage"
					},
					params: {
						RequestForQuotation: [vRFQNumber]
					}
				});
			} else {
				var aBatchPostCreateRFQ = [];
				var oDataModel = this.oApplicationFacade.getODataModel();
				var sUrl = "ActivateRFQ?Draftid=guid'" + this.vRFQDraftId + "'&IsPublish=''";
				aBatchPostCreateRFQ.push(oDataModel.createBatchOperation(sUrl, "POST", null));
				oDataModel.addBatchChangeOperations(aBatchPostCreateRFQ);
				oDataModel.submitBatch(jQuery.proxy(this.successSaveRFQ, this), jQuery.proxy(this.errorCreateRFQ, this), true);
			}
		},
		fnRFQPublish: function() {
			var that = this;
			this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
			sap.m.MessageBox.show(this.oResourceBundle.getText("PublishMsg"), {
				icon: sap.m.MessageBox.Icon.CONFIRMATION,
				title: that.oResourceBundle.getText("PUBLISH"),
				actions: [that.oResourceBundle.getText("PUBLISH"), that.oResourceBundle.getText("Cancel")],
				onClose: function(oAction) {
					if (oAction === that.oResourceBundle.getText("PUBLISH")) {
						var aBatchPostCreateRFQ = [];
						var oDataModel = that.oApplicationFacade.getODataModel();
						var sUrl = "ActivateRFQ?Draftid=guid'" + that.vRFQDraftId + "'&IsPublish='X'";
						aBatchPostCreateRFQ.push(oDataModel.createBatchOperation(sUrl, "POST", null));
						oDataModel.addBatchChangeOperations(aBatchPostCreateRFQ);
						oDataModel.submitBatch(jQuery.proxy(that.successPublishRFQ, that), jQuery.proxy(this.errorCreateRFQ, that), true);
					}
				},
				initialFocus: that.oResourceBundle.getText("PUBLISH")
			});

		},

		handleRFQDraftSelect: function(oEvent) {
			var iSelectedDraftNo = oEvent.getSource().getBindingContext().sPath.substring(16, oEvent.getSource().getBindingContext().sPath.length);
			var iSelectedDraftId = this.getView().getModel().oData.DraftRFQHeader[iSelectedDraftNo].Draftguid;
			if (oEvent.getSource().getSelected()) {
				this.selectedRFQDrafts.push({
					'draftId': iSelectedDraftId
				});
			} else {
				this._removeArrayValue(this.selectedRFQDrafts, iSelectedDraftId);
			}
			if (this.selectedRFQDrafts.length > 0) {
				this.byId('idRFQSubmit').setEnabled(true);
			} else {
				this.byId('idRFQSubmit').setEnabled(false);
			}
		},

		//Commented code for External Navigation upon click of save
		successPublishRFQ: function(data, response) {
			var iChangeRespCount = data.__batchResponses[0].__changeResponses.length;
			var vRfqNumber = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message;
			var vPublishMsgCode = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).code;
			var iNoOfErrorMsgs = 0;
			var vNavFlag = true;
			var aMessage = new Array();
			var aCompErrMessage = new Array();
			if (vPublishMsgCode === "APPL_MM_PR/003") {
				var vRFQNo = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).details.message;
				this.oApplicationFacade.oApplicationImplementation.setModel(vRFQNo, "RFQnumber");
				// sap.m.MessageToast.show(vRfqNumber, {
				// 	duration: 5000
				// });
				var oMessage = {
					name: vRFQNo,
					state: this._getMessageState(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity),
					icon: this._getMessageIcon(JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).severity)
				};
				aMessage.push(oMessage);
				var oMessagePopup = this._getMessagePopup(aMessage, vNavFlag, true);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
				oMessagePopup.open();
			} else if (vPublishMsgCode === "APPL_MM_PR/001") {
				sap.m.MessageToast.show(vRfqNumber, {
					duration: 15000
				});
				jQuery.sap.delayedCall(2000, this, function() {
					/*	this.oRouter.navTo("fullscreen", {
							from: "RFQPreview"
						});*/
					window.history.go(-1);
				});
			} else if (iChangeRespCount > 0) {
				var iMsgCount = 0;
				var aMessages = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).details;
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
				var oMessagePopup = this._getMessagePopup(aCompErrMessage, vNavFlag, true);
				if (iNoOfErrorMsgs > 0) {
					jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
					oMessagePopup.open();
				}
			}
		},

		successSaveRFQ: function(data, response) {
			var iChangeRespCount = data.__batchResponses[0].__changeResponses.length;
			var vSuccessCode = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).code;
			var vCompErrMessage;
			var vRFQ;
			if (vSuccessCode == "RFQId/101") {
				vCompErrMessage = JSON.parse(data.__batchResponses[0].__changeResponses[iChangeRespCount - 1].headers['sap-message']).message;
				this.oApplicationFacade.oApplicationImplementation.setModel(vCompErrMessage, "RFQnumber");
				vRFQ = this.oApplicationFacade.oApplicationImplementation.getModel("RFQnumber");
			}
			var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
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
					if ((aMessages[iMsgCount].severity == 'warning') || (aMessages[iMsgCount].severity == 'error')) {
						if ((aMessages[iMsgCount].code == 'NO_NAV/100') && (aMessages[iMsgCount].message == 'S:NO_NAV:100')) {
							vNavFlag = false;
						} else {
							aCompErrMessage.push(oCompErrMessage);
							iNoOfErrorMsgs = iNoOfErrorMsgs + 1;
						}
					}
				}
				var oMessagePopup = this._getMessagePopup(aCompErrMessage, vNavFlag);
				if (iNoOfErrorMsgs > 0) {
					jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oMessagePopup);
					oMessagePopup.open();
				} else {
					//this.oApplicationFacade.oApplicationImplementation.setModel(vCompErrMessage, "selectedRFQDraftId");
					//this.oRouter.navTo("RFQPreview");
					oCrossAppNavigator.toExternal({
						target: {
							semanticObject: "RequestForQuotation",
							action: "manage"
						},
						params: {
							RequestForQuotation: [vRFQ]
						}
					});
				}
			} else {
				//this.oApplicationFacade.oApplicationImplementation.setModel(vCompErrMessage, "selectedRFQDraftId");
				//this.oRouter.navTo("RFQPreview");
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "RequestForQuotation",
						action: "manage"
					},
					params: {
						RequestForQuotation: [vRFQ]
					}
				});

			}
			/*           oCrossAppNavigator.toExternal({
			                                                target: {
			                                                                semanticObject: "RequestForQuotation",
			                                                                action: "manage"
			                                                },
			                                                params: {
			                                                                Requestforquotation : [vRFQ]
			                                                }
			                                });*/
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
		_getMessagePopup: function(aMessages, vNavFlag, bIsPublish) {

			var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
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
					oTable
				],

				buttons: [
					new sap.m.Button({
						text: "{i18n>OK}",
						tap: jQuery.proxy(function(e) {
							this.oMessageDialog.close();
							/*	if (bIsPublish == true) {
									jQuery.sap.delayedCall(2000, this, function() {
										this.oRouter.navTo("fullscreen", {
											from: "RFQPreview"
										});
									});
								}*/
							/*else{
							//*         
							}*/

							//            this.oRouter.navTo("RFQPreview");

						}, this),

					}),
				],
				state: "None",
				contentWidth: "25rem"
			});
			//                                                            }

			this.oMessageDialog.setTitle("{i18n>MSG}" + ' (' + this.vNumberofMessages + ')');
			this.getView().addDependent(this.oMessageDialog);

			this.oMessageDialog.addStyleClass("sapUiSizeCompact");

			return this.oMessageDialog;

		},

		handleNav: function(oEvent) {
			var aSelectedItem = oEvent.getSource().getText().split("/");
			var vPRNo = aSelectedItem[0];
			var vPRItemNo = aSelectedItem[1];

			var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");

			oCrossAppNavigator.toExternal({

				target: {
					semanticObject: "PurchaseRequisition",
					action: "displayFactSheet"
				},

				params: {
					PurchaseRequisition: [vPRNo],
					PurchaseRequisitionItem: [vPRItemNo]
				}

			});
		},

		_removeArrayValue: function(aSelectedDrafts, draftId) {
			for (var aIndex = 0; aIndex < aSelectedDrafts.length; aIndex++) {
				if (aSelectedDrafts[aIndex].draftId == draftId) {
					aSelectedDrafts.splice(aIndex, 1);
				}
			}
		},
		onNavBack: function() {
			/*	this.oRouter.navTo("fullscreen", {
					from: "RFQPreview"
				});*/
			window.history.go(-1);
		},

		onPressEmailBidder: function(oEvent) {
			sap.m.URLHelper.triggerEmail(oEvent.getSource().getText());
		}
	});