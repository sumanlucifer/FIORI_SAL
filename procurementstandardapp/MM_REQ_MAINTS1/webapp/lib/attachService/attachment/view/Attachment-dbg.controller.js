/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/m/MessageBox", "sap/ui/core/format/DateFormat", "sap/ui/core/format/FileSizeFormat"],
	function (MessageBox) {
		"use strict";

		sap.ui.controller("sap.se.mi.plm.lib.attachmentservice.attachment.view.Attachment", {

			//	_mode is a constant object. Do not change any value while coding
			_MODE: {
				CREATE: "I",
				DISPLAY: "D",
				CHANGE: "C"
			},

			//	_action is a constant object. Do not change any value while coding
			_ACTION: {
				DELETEATTACHMENT: "Delete",
				RENAMEATTACHMENT: "Rename",
				LISTATTACHMENT: "List",
				SAVEATTACHMENT: "Save",
				CANCELATTACHMENT: "Cancel",
				DRAFTATTACHMENT: "Draft",
				COUNTATTACHMENT: "Count",
				CREATEURL: "CreateUrl"
			},

			onInit: function () {
				// _properties has been here from outside the onInit function to make it instance level. Otherwise, it is static for the controller		
				try {
					this._serviceUrl = this.getURLForService();
				} catch (error) {
					jQuery.sap.log.error(error);
					this._serviceUrl = "/sap/opu/odata/sap/CV_ATTACHMENT_SRV";
				}
				this.validURLType = ['text/url', 'text/html'];
				this._properties = {
					semanticObject: "",
					objectKey: "",
					objectType: "",
					documentPart: "",
					documentVersion: "",
					documentNumber: "",
					documentType: "",
					mode: "",
					visibleEdit: false,
					visibleDelete: false
				};
				this._objects = {
					oModel: undefined
				};

				this._fieldControl = {
					"_VisibleAttributes": {},
					"_VisibleActions": {}
				};

				this._fieldControl._VisibleAttributes.UPLOADEDBY = true;
				this._fieldControl._VisibleAttributes.UPLOADEDON = true;
				this._fieldControl._VisibleAttributes.FILESIZE = true;
				this._fieldControl._VisibleAttributes.ENABLELINK = true;
				this._fieldControl._VisibleAttributes.ATTACHMENTSTATUS = true;
				this._fieldControl._VisibleAttributes.ATTACHMENTTITLE = true;
				this._fieldControl._VisibleAttributes.SOURCE = true;
				this._fieldControl._VisibleAttributes.DIRDETAILS = false;
				this._fieldControl._VisibleActions.RENAME = true;
				this._fieldControl._VisibleActions.DELETE = true;
				this._fieldControl._VisibleActions.ADD = true;
				this._fieldControl._VisibleActions.ADDURL = true;
				this._fieldControl._VisibleActions.DOWNLOAD = false;

				this.oResult = {
					status: "",
					fileName: ""
				};

				this.uploadCount = 0;
				this.uploadCountSuccess = 0;
				this.uploadCountFailed = 0;
				this.uploadCountTerminated = 0;

				this._objects.oModel = new sap.ui.model.odata.ODataModel(this._serviceUrl, true);
				this._objects.oResModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: jQuery.sap.getModulePath("sap.se.mi.plm.lib.attachmentservice.attachment") + "/i18n/i18n.properties"
				});
				this.getView().setModel(this._objects.oResModel, "i18n");

				this._objects.oUiModel = new sap.ui.model.json.JSONModel({
					editMode: false
				});
				this.getView().setModel(this._objects.oUiModel, "ui");

				this.byId("myId").setModel(this._objects.oUiModel, "ui");
				//********************************************************************************************
				//*******************Set the properties of the buttons in the toolbar  **********************/
				this.checkedInStatusShow = false;
				this.itemforcheckingin = {};

				this.getView().byId("attachmentServiceFileUpload").addEventDelegate({
					onBeforeRendering: function () {
						this.getView().byId("attachmentTitle").setText(this._showAttachmentsNumber());
						// this.byId("attachmentServiceFileUpload").setUploadButtonInvisible(!this._fieldControl._VisibleActions.ADD);
						this.byId("AddUrl").setVisible(this._fieldControl._VisibleActions.ADDURL);
						this.getOwnerComponent().setAttachmentCount(this.byId("attachmentServiceFileUpload").getItems().length);
						//this.byId("Download").setVisible(this._fieldControl._VisibleActions.DOWNLOAD);
					}.bind(this)
				});

			},

			getURLForService: function () {
				var systemAlias = sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication().componentInstance.getComponentData().startupParameters[
					"sap-system"];
				if (systemAlias !== undefined) {
					systemAlias = sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication().componentInstance.getComponentData().startupParameters[
						"sap-system"][0];
				}
				return (sap.ui.model.odata.ODataUtils.setOrigin("/sap/opu/odata/sap/CV_ATTACHMENT_SRV", systemAlias));
			},

			getAttributeList: function () {
				var attrList = this._fieldControl;
				return attrList;
			},

			flavorControl: function (flavor) {
				if (flavor && flavor === "withCheckIn") {
					this.byId("CheckInButton").setVisible(true);
					this.byId("CheckOutButton").setVisible(true);
					this.byId("ResetCheckOutButton").setVisible(true);
					this.checkedInStatusShow = true;
					var oUploadCollection = this.byId("attachmentServiceFileUpload");
					oUploadCollection.setMode("MultiSelect");
					var selectedItems = oUploadCollection.getSelectedItems();
					jQuery.each(selectedItems, function (index) {
						oUploadCollection.setSelectedItem(selectedItems[index], false);
					});

				} else {
					this.byId("CheckInButton").setVisible(false);
					this.byId("CheckOutButton").setVisible(false);
					this.byId("ResetCheckOutButton").setVisible(false);
					this.byId("attachmentServiceFileUpload").setMode("None");
				}
			},

			setAttributes: function (attr) {

				this._fieldControl._VisibleAttributes.UPLOADEDBY = attr._VisibleAttributes.UPLOADEDBY;
				this._fieldControl._VisibleAttributes.UPLOADEDON = attr._VisibleAttributes.UPLOADEDON;
				this._fieldControl._VisibleAttributes.FILESIZE = attr._VisibleAttributes.FILESIZE;
				this._fieldControl._VisibleAttributes.ENABLELINK = attr._VisibleAttributes.ENABLELINK;
				this._fieldControl._VisibleAttributes.ATTACHMENTSTATUS = attr._VisibleAttributes.ATTACHMENTSTATUS;
				this._fieldControl._VisibleAttributes.ATTACHMENTTITLE = attr._VisibleAttributes.ATTACHMENTTITLE;
				this._fieldControl._VisibleAttributes.SOURCE = attr._VisibleAttributes.SOURCE;
				this._fieldControl._VisibleAttributes.DIRDETAILS = attr._VisibleAttributes.DIRDETAILS;
				this._fieldControl._VisibleActions.RENAME = attr._VisibleActions.RENAME;
				this._fieldControl._VisibleActions.DELETE = attr._VisibleActions.DELETE;
				this._fieldControl._VisibleActions.ADD = attr._VisibleActions.ADD;
				this._fieldControl._VisibleActions.ADDURL = attr._VisibleActions.ADDURL;
				this._fieldControl._VisibleActions.DOWNLOAD = attr._VisibleActions.DOWNLOAD;

			},

			onBeforeRendering: function () {
				var owner = this.getOwnerComponent();
				// this.setPropertiesOnly(owner.getMode(), owner.getObjectType(), owner.getObjectKey(), owner.getSemanticObject());
				this.flavorControl(this.getOwnerComponent().getFlavor());
				var editMode = owner.getMode() !== 'D' ? true : false;
				this._objects.oUiModel.setProperty("/editMode", editMode);

			},
			_changeHostname: function (linkStr) {
				var link = linkStr.split("/");
				link[2] = location.hostname + (location.port ? ":" + location.port : "");
				return link.join("/");
			},
			/***************************************************************************
			 * Backend Related Methods
			 **************************************************************************/
			_backendCall: function (action, oContext) {
				switch (action) {
				case this._ACTION.DELETEATTACHMENT:
					return this._onDeleteAttachment(this, oContext);
				case this._ACTION.LISTATTACHMENT:
					return this._retrieveAttachment(this, oContext);
				case this._ACTION.RENAMEATTACHMENT:
					return this._onRenameAttachment(this, oContext);
				case this._ACTION.COUNTATTACHMENT:
					return this._getAttachmentsCount(this, oContext);
				case this._ACTION.SAVEATTACHMENT:
					return this._commitChange(this, oContext);
				case this._ACTION.CANCELATTACHMENT:
					return this._cancelChange(this, oContext);
				case this._ACTION.DRAFTATTACHMENT:
					return this._getApplicationStatus(this, oContext);
				case this._ACTION.CREATEURL:
					return this._onCreateUrlAsAttachment(this, oContext);
				}
			},
			_onDeleteAttachment: function (self, item) {
				var oResponse = false;
				self._objects.oModel.setHeaders(self._setHeader(self._ACTION.DELETEATTACHMENT));
				var uri = "/OriginalContentSet(" + self._prepareUrlParameters(self._ACTION.DELETEATTACHMENT, item) + ")";
				self._objects.oModel.remove(uri, null, function () {
					oResponse = true;
				}, function (e) {
					self._showErrorMessage(JSON.parse(e.response.body).error.message.value, "");
				});
				return oResponse;
			},
			_retrieveAttachment: function (self, oContext) {
				// var isRetrived = false;
				// self._objects.oModel.read("/GetAllOriginals", null, self._prepareUrlParameters(self._ACTION.LISTATTACHMENT, null), false, function(
				// 	oData, oResponse) {
				// 	isRetrived = true;
				// 	self._setOriginal(oData);
				// 	if (oData.results && oData.results.length !== 0) {
				// 		if (oData.results[0].UxFCAdd === 0) {
				// 			self.byId("attachmentServiceFileUpload").setUploadEnabled(false);
				// 		}
				// 	}
				// }, function(e) {
				// 	self._showErrorMessage(JSON.parse(e.response.body).error.message.value, "");
				// });
				// return isRetrived;
				var isRetrived = false;
				var batchChanges = [];
				var encodeURL = encodeURI(self._prepareUrlParameters(self._ACTION.LISTATTACHMENT, null)); //"ObjectKey=%27demo_test%27&ObjectType=%27bus1001006%27&SemanticObjectType=%27Product%27";//
				batchChanges.push(self._objects.oModel.createBatchOperation("/GetAllOriginals?" + encodeURL, "GET"));
				batchChanges.push(self._objects.oModel.createBatchOperation("/GetArchiveLinkAttachments?" + encodeURI(self._prepareUrlParametersForArchiveLink(
					self._ACTION.LISTATTACHMENT), null), "GET"));

				self._objects.oModel.addBatchReadOperations(batchChanges);
				self._objects.oModel.submitBatch(function (oData) {
					self._objects.oModel.refresh();
					isRetrived = true;
					var results = [];
					oData.__batchResponses.forEach(function (resp) {
						if (resp.response) {
							self._showErrorMessage(JSON.parse(resp.response.body).error.message.value, "");
						} else {
							results = results.concat(resp.data.results);
						}

					});
					self._setOriginal({
						results: results
					});
					if (oData.results && oData.results.length !== 0) {
						if (oData.results[0].UxFCAdd === 0) {
							self.byId("attachmentServiceFileUpload").setUploadEnabled(false);
						}
					}
				}, function (e) {
					self._showErrorMessage(JSON.parse(e.response.body).error.message.value, "");
				});

				return isRetrived;

			},
			convertJSONtoXML: function (json, tab) {
				var toXml = function (v, name, ind) {
						var xml = "";
						if (v instanceof Array) {
							for (var i = 0, n = v.length; i < n; i++) {
								xml += ind + toXml(v[i], name, ind + "\t") + "\n";
							}
						} else if (typeof (v) == "object") {
							var hasChild = false;
							xml += ind + "<" + name;
							for (var m in v) {
								if (m.charAt(0) == "@") {
									xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
								} else {
									hasChild = true;
								}
							}
							xml += hasChild ? ">" : "/>";
							if (hasChild) {
								for (var m in v) {
									if (m == "#text") {
										xml += v[m];
									} else if (m == "#cdata") {
										xml += "<![CDATA[" + v[m] + "]]>";
									} else if (m.charAt(0) != "@") {
										xml += toXml(v[m], m, ind + "\t");
									}
								}
								xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
							}
						} else {
							xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
						}
						return xml;
					},
					xml = "";
				for (var m in json) {
					xml += toXml(json[m], m, "");
				}
				return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
			},
			onDownloadAll: function (attachmentList, callBack) {
				var self = this;
				var modIndex;
				var batchChanges = [];
				var returnList = {
					"FileList": []
				};
				var FileInfoJSON;
				jQuery.each(attachmentList.objectKeyList, function (index) {
					var oK = "ObjectKey='" + attachmentList.objectKeyList[index].objectKey + "'";
					var oT = "ObjectType='" + attachmentList.objectKeyList[index].objectType + "'";
					var aK = "ArchiveObjectID='" + attachmentList.objectKeyList[index].objectKey + "'";
					var aT = "ArchiveObjectType='" + attachmentList.objectKeyList[index].objectType + "'";
					var oS = "SemanticObjectType='" + "" + "'";

					var encodeURL = encodeURI(oK + "&" + oT + "&" + oS);
					var encodeARC = encodeURI(aK + "&" + aT + "&" + oS);

					batchChanges.push(self._objects.oModel.createBatchOperation("/GetAllOriginals?" + encodeURL, "GET"));
					batchChanges.push(self._objects.oModel.createBatchOperation("/GetArchiveLinkAttachments?" + encodeARC, "GET"));
				});

				self._objects.oModel.addBatchReadOperations(batchChanges);
				self._objects.oModel.submitBatch(function (oData) {
					var results = [];
					oData.__batchResponses.forEach(function (resp, index) {
						if (resp.response) {
							self._showErrorMessage(JSON.parse(resp.response.body).error.message.value, "");
						} else {
							results = results.concat(resp.data.results);

							for (var i = 0; i < resp.data.results.length; i++) {
								if (!resp.data.results[i].ContentSource) {
									modIndex = parseInt(index / 2);
									FileInfoJSON = {
										"objectType": attachmentList.objectKeyList[modIndex].objectType,
										"objectKey": attachmentList.objectKeyList[modIndex].objectKey,
										"FileName": results[i].Filename,
										"success": true,
										"messageText": "",
										"url": self._changeHostname(results[i].__metadata.media_src)
									};
									returnList.FileList.push(FileInfoJSON);

								}
							}
						}
					});
					var promiseArray = [];
					if (results.length !== 0) {
						for (var i = 0; i < results.length; i++) {
							if (!results[i].ContentSource) {
								var download = self._changeHostname(results[i].__metadata.media_src);
								promiseArray.push(self._downloadFilePromise(download, results[i].Filename, results[i].ContentType));
							}
						}
					}
					Promise.all(promiseArray).then(function (resolveValues) {
						for (i = 0; i < returnList.FileList.length; i++) {
							returnList.FileList[i].success = resolveValues[i];
						}
						callBack(returnList);
						sap.ui.core.util.File.save(self.convertJSONtoXML(returnList), "log-" + Date(), "xml", "application/xml", 'utf-8');
					});
				});

			},
			_downloadFilePromise: function (downloadURL, sFileName, sMimeType) {
				// XHR Request
				return new Promise(function (resolve, reject) {
					var oBlob = null;
					var returnStatus;
					var xhttp = new window.XMLHttpRequest();
					xhttp.open("GET", downloadURL, true);
					xhttp.responseType = "blob";
					xhttp.onload = function () {
						var oFileName = sFileName.split('.')[0];
						var oExtension = sFileName.split('.')[1];
						oBlob = xhttp.response;
						if (xhttp.status !== 400) {
							sap.ui.core.util.File.save(oBlob, oFileName, oExtension, sMimeType, 'utf-8');
							returnStatus = true;
						} else {
							returnStatus = false;
						}
						resolve(returnStatus);

					};
					xhttp.send();
				});
			},

			_onDownloadAllAttach: function (oEvent) {
				var oUploadCollection = this.getView().byId("attachmentServiceFileUpload");
				var aSelectedItems = oUploadCollection.getSelectedItems();
				if (aSelectedItems.length !== 0) {
					for (var i = 0; i < aSelectedItems.length; i++) {
						if (!this._isValidURLType(aSelectedItems[i].getMimeType())) {
							oUploadCollection.downloadItem(aSelectedItems[i], true);
						}
					}
				} else {
					oUploadCollection.selectAll();
					aSelectedItems = oUploadCollection.getItems();
					for (i = 0; i < aSelectedItems.length; i++) {
						if (!this._isValidURLType(aSelectedItems[i].getMimeType())) {
							oUploadCollection.downloadItem(aSelectedItems[i], true);
						}
					}
				}
			},

			_onRenameAttachment: function (self, item) {
				var oResponse = false;
				self._objects.oModel.create("/RenameAttachment?" + self._prepareUrlParameters(self._ACTION.RENAMEATTACHMENT, item), null, null,
					function (oData) {
						oResponse = oData;
					},
					function (e) {
						self._showErrorMessage(JSON.parse(e.response.body).error.message.value, "");
					});
				return oResponse;
			},
			_getAttachmentsCount: function (oSelf, oContext) {
				var oResult;
				oSelf._objects.oModel.read("/GetAttachmentCount", null, oSelf._prepareUrlParameters(oSelf._ACTION.COUNTATTACHMENT, null), false,
					function (oData, oResponse) {
						oResult = JSON.parse(oResponse.body).d.GetAttachmentCount;
					},
					function (e) {
						oSelf._showErrorMessage(JSON.parse(e.response.body).error.message.value, "");
					});
				return oResult;
			},
			_onCreateUrlAsAttachment: function (self, item) {
				var oResponse = false;

				self._objects.oModel.create("/CreateUrlAsAttachment?" + self._prepareParametersToCreateUrl(self._ACTION.CREATEURL), null, null,
					function (oData) {
						oResponse = true;
						var data1 = self.byId("attachmentServiceFileUpload").getModel("__attachmentData").getData();
						// 		var result = {
						// 			"content_type": oData.__metadata.content_type,
						// 			"Filename": oData.Filename,
						// 			"url": oData.ContentSource,
						// 			"FileId": oData.FileId,
						// 			"ApplicationId": oData.ApplicationId,
						// 			"Documentnumber": oData.Documentnumber,
						// 			"Documenttype": oData.Documenttype,
						// 			"Documentversion": oData.Documentversion,
						// 			"Documentpart": oData.Documentpart,
						// 			"attributes": self._getAttributes(oData),
						// 			"statuses": self._getDraftStatus(oData),
						// 			"enableEdit": self._getEditMode()
						// 		};
						data1.dataitems.unshift(self._mapResult(oData));
						var oModel = new sap.ui.model.json.JSONModel(data1);
						self.byId("attachmentServiceFileUpload").setModel(oModel, "__attachmentData");
					},
					function (e) {
						self._showErrorMessage(JSON.parse(e.response.body).error.innererror.errordetails[0].message, "");
					});
				return oResponse;
			},
			_commitChange: function (oSelf, oContext) {
				var oResult = {
					isSaved: false,
					isRetrieved: false,
					isCanceled: false,
					msgDetail: {},
					innerErrorDetails: []
				};
				var oResponse;
				oSelf._objects.oModel.create("/ConfirmAttachment?" + oSelf._prepareUrlParameters(oSelf._ACTION.SAVEATTACHMENT, null), null, null,
					function (e, r) {
						oResult.isSaved = JSON.parse(r.body).d.ConfirmAttachment.Success;
						oResponse = r.headers["sap-message"];
					},
					function (e) {
						oResponse = e.response.body;
					});
				if (oResponse) {
					oResponse = oSelf._prepareResponse(oResponse);
					oResult.msgDetail = oResponse.msgDetail;
					oResult.innerErrorDetails = oResponse.innerErrorDetails;
				}
				return oResult;
			},
			_cancelChange: function (oSelf, oContext) {
				var oResult = {
					isSaved: false,
					isRetrieved: false,
					isCanceled: false,
					msgDetail: {},
					innerErrorDetails: []
				};
				oSelf._objects.oModel.create("/CancelAttachment?" + oSelf._prepareUrlParameters(oSelf._ACTION.CANCELATTACHMENT, null), null, null,
					function () {
						oResult.isCanceled = true;
					},
					function (e) {
						var oResponse = oSelf._prepareResponse(e.response.body);
						oResult.msgDetail = oResponse.msgDetail;
						oResult.innerErrorDetails = oResponse.innerErrorDetails;
					});
				return oResult;
			},
			_getApplicationStatus: function (oSelf, oContext) {
				var oResult;
				oSelf._objects.oModel.read("/GetApplicationState", null, oSelf._prepareUrlParameters(this._ACTION.DRAFTATTACHMENT, null), false,
					function (oData, oResponse) {
						oResult = JSON.parse(oResponse.body).d.GetApplicationState.IsDirty;
					},
					function (e) {
						oSelf._showErrorMessage(JSON.parse(e.response.body).error.message.value, "");
					});
				return oResult;
			},
			_getToken: function () {
				var sToken = "",
					oControl = this;
				this._objects.oModel.refreshSecurityToken(function (e, o) {
					sToken = oControl._objects.oModel.getSecurityToken();
				}, function (e) {
					oControl._showErrorMessage($(e.response.body).find("message").first().text(), "");
				}, false);
				return sToken;
			},
			/***************************************************************************
			 * Methods calling Backend
			 **************************************************************************/

			_commitChanges: function (isRefresh) {
				var oResponse = this._backendCall(this._ACTION.SAVEATTACHMENT, null);
				if (oResponse.isSaved) {
					if (isRefresh) {
						var oResult = this._backendCall(this._ACTION.LISTATTACHMENT, null);
						oResponse.isRetrieved = oResult;
					}
				}
				return oResponse;
			},
			_cancelChanges: function (isRefresh) {
				var oResponse = this._backendCall(this._ACTION.CANCELATTACHMENT, null);
				if (oResponse.isCanceled) {
					if (isRefresh) {
						var oResult = this._backendCall(this._ACTION.LISTATTACHMENT, null);
						oResponse.isRetrieved = oResult;
					}
				}
				return oResponse;
			},
			_getApplicationState: function () {
				var oResponse = this._backendCall(this._ACTION.DRAFTATTACHMENT, null);
				return oResponse;
			},
			_getOriginal: function () {
				this._setProperty();
				this._backendCall(this._ACTION.LISTATTACHMENT);
			},
			_getAttachmentCount: function () {
				var attachmentCount = {
					totalAttachmentCount: 0,
					confirmedAttachmentCount: 0,
					unconfirmedAttachmentCount: 0
				};
				var oResponse = this._backendCall(this._ACTION.COUNTATTACHMENT, null);
				if (oResponse) {
					attachmentCount.totalAttachmentCount = oResponse.TotalCount;
					attachmentCount.confirmedAttachmentCount = oResponse.ConfirmedCount;
					attachmentCount.unconfirmedAttachmentCount = oResponse.UnconfirmedCount;
				}
				return attachmentCount;
			},
			/***************************************************************************
			 * Upload Collection Event
			 **************************************************************************/
			 
			_onUploadFile: function (oEvent) {
				var oData = this.byId("attachmentServiceFileUpload").getModel("__attachmentData").getData();
				var files = oEvent.getParameters().files;
				var msgTxt = '';
				for (var i = 0; i < files.length; i++) {
					this.oResult.fileName = files[i].fileName;
					if (files[i].status === 200 || files[i].status === 201) {
						this.uploadCountSuccess += 1;
						var oResponse = $.parseJSON(files[i].responseRaw).d;
						oResponse.CreatedAt = new Date(parseInt(oResponse.CreatedAt.substr(6)));
						if (this.checkingIn || this.checkingInAsNewVersion) {
							this._updateFile(oResponse);
							this.checkingIn = false;
							this.checkingInAsNewVersion = false;
						} else {
							oData.dataitems.unshift(this._mapResult(oResponse));
							this.byId("attachmentServiceFileUpload").getModel("__attachmentData").setData(oData);
						}
						this.oResult.status = "UPLOADSUCCESS";
						this.getOwnerComponent().fireOnupload(this.oResult);

					} else {

						msgTxt = msgTxt + files[i].fileName + ": " + $.parseJSON(files[i].responseRaw).error.innererror.errordetails[0].message + "\n";
						this.byId("attachmentServiceFileUpload").getModel("__attachmentData").refresh(true);
						this.uploadCountFailed += 1;
						this.oResult.status = "UPLOADFAILURE";
						this.getOwnerComponent().fireOnupload(this.oResult);
						this.checkingIn = false;
						this.checkingInAsNewVersion = false;

					}
				}
				if (this.uploadCount === this.uploadCountSuccess + this.uploadCountFailed + this.uploadCountTerminated) {
					this.oResult.status = "UPLOADCOMPLETED";
					this.oResult.fileName = "";
					this.getOwnerComponent().fireOnupload(this.oResult);
				}
				if (msgTxt) {
					this._showErrorMessage(this._objects.oResModel.getResourceBundle().getText("MESSAGE_UPLOAD_FAILED"), msgTxt);
				}

			},

			_onBeforeUploadStarts: function (oEvent) {
				var self = this,
					prop;
				var oUploadCollection = self.getView().byId("attachmentServiceFileUpload");
				this._setUploadCollectionHeader("objectkey", this._properties.objectKey, oEvent);
				this._setUploadCollectionHeader("objecttype", this._properties.objectType, oEvent);
				this._setUploadCollectionHeader("semanticobjecttype", this._properties.semanticObject, oEvent);
				this._setUploadCollectionHeader("documentType", this._properties.documentType, oEvent);
				this._setUploadCollectionHeader("documentNumber", this._properties.documentNumber, oEvent);
				this._setUploadCollectionHeader("documentVersion", this._properties.documentVersion, oEvent);
				this._setUploadCollectionHeader("documentPart", this._properties.documentPart, oEvent);
				this._setUploadCollectionHeader("Accept", "application/json", oEvent);
				this._setUploadCollectionHeader("slug", btoa(encodeURIComponent(oEvent.getParameters().fileName)), oEvent);
				this._setUploadCollectionHeader("customStuff", 'customDatas', oEvent);
				this._setUploadCollectionHeader("X-CSRF-Token", this._getToken(), oEvent);
				if (this.checkingIn) {
					prop = this._getSelectedItemProperties(this.itemforcheckingin, oUploadCollection);
					this._setUploadCollectionHeader("ApplicationId", prop.ApplicationId, oEvent);
					this._setUploadCollectionHeader("FileID", prop.FileId, oEvent);
					this._setUploadCollectionHeader("CheckIn", "X", oEvent);
					this._setUploadCollectionHeader("CheckInAsNewVersion", "", oEvent);
				} else if (this.checkingInAsNewVersion) {
					prop = this._getSelectedItemProperties(this.itemforcheckingin, oUploadCollection);
					this._setUploadCollectionHeader("ApplicationId", prop.ApplicationId, oEvent);
					this._setUploadCollectionHeader("FileID", prop.FileId, oEvent);
					this._setUploadCollectionHeader("CheckIn", "X", oEvent);
					this._setUploadCollectionHeader("CheckInAsNewVersion", "X", oEvent);
				}

			},
			_onBeforeUploadFile: function (oEvent) {
				// this._setUploadCollectionHeader("objectkey", this._properties.objectKey);
				// this._setUploadCollectionHeader("objecttype", this._properties.objectType);
				// this._setUploadCollectionHeader("semanticobjecttype", this._properties.semanticObject);
				// this._setUploadCollectionHeader("documentType", this._properties.documentType);
				// this._setUploadCollectionHeader("documentNumber", this._properties.documentNumber);
				// this._setUploadCollectionHeader("documentVersion", this._properties.documentVersion);
				// this._setUploadCollectionHeader("documentPart", this._properties.documentPart);  
				// this._setUploadCollectionHeader("Accept", "application/json");
				// this._setUploadCollectionHeader("slug", oEvent.getParameters().getParameters().files[0].name);
				// this._setUploadCollectionHeader("X-CSRF-Token",this._getToken());
				this.uploadCount += oEvent.getParameters().files.length;
				this.oResult.status = "UPLOADSTARTED";
				this.oResult.fileName = "";
				this.getOwnerComponent().fireOnupload(this.oResult);
				this.byId('attachmentServiceFileUpload').getModel("__attachmentData").refresh(true);
			},

			ShowUploadDialog: function () {
				var self = this;
				var dialog = new sap.m.Dialog({
					title: self._objects.oResModel.getResourceBundle().getText('Add_Url'),
					type: "Message",
					content: [
						new sap.m.Label({
							text: self._objects.oResModel.getResourceBundle().getText('URL'),
							labelFor: "URL"
						}),
						new sap.m.Input({

							maxLength: 4000,
							id: "URL",
							type: "Url",
							liveChange: function () {
								if (self._checkUrl(this.getValue())) {
									this.setValueState(sap.ui.core.ValueState.Success);

								} else {
									this.setValueState(sap.ui.core.ValueState.Error);
								}

							}

						}),
						new sap.m.Label({
							text: self._objects.oResModel.getResourceBundle().getText('URL_Description'),
							labelFor: "URLDesc"
						}),
						new sap.m.Input({

							maxLength: 255,
							id: "URLDesc"
						})
					],
					beginButton: new sap.m.Button({
						text: self._objects.oResModel.getResourceBundle().getText('OK_button'),
						enabled: true,
						press: function (oEvent) {
							if (sap.ui.getCore().byId("URL").getValue().length > 0) {
								if (self._checkUrl(sap.ui.getCore().byId("URL").getValue())) {
									self._backendCall(self._ACTION.CREATEURL, null);
									dialog.close();
								} else {
									self._showErrorMessage(self._objects.oResModel.getResourceBundle().getText('URL_INVALID'));
								}
							} else {
								self._showErrorMessage(self._objects.oResModel.getResourceBundle().getText('URL_BLANK'));
							}
						}
					}),
					endButton: new sap.m.Button({
						text: self._objects.oResModel.getResourceBundle().getText('Cancel_button'),
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();
			},
			_onRenameFile: function (r) {
				var self = this;
				if (self._properties.mode !== 'D') {
					var oResponse = this._backendCall(this._ACTION.RENAMEATTACHMENT, r.getParameters().item.getBindingContext("__attachmentData").getObject());
					if (oResponse === false) {
						this._backendCall(this._ACTION.LISTATTACHMENT, null);
					}
					if (oResponse !== null) {
						self._updateFile(oResponse);
					}

				}
			},
			_onDeleteFile: function (e) {
				var oSelf = this;
				var oData = oSelf.byId("attachmentServiceFileUpload").getModel("__attachmentData").getData();
				var aItems = oData.dataitems;
				jQuery.each(aItems, function (index) {
					if (aItems[index] && aItems[index].FileId === e.getParameters().item.getDocumentId()) {
						oSelf.oResult.fileName = aItems[index].Filename;
						if (oSelf._backendCall(oSelf._ACTION.DELETEATTACHMENT, aItems[index])) {
							aItems.splice(index, 1);
							oSelf.byId("attachmentServiceFileUpload").getModel("__attachmentData").setData(oData);
							//			    		oSelf.oResult.status = "DELETED";
							//			            oSelf.getOwnerComponent().fireOnupload(oSelf.oResult);
						} else {
							//						oSelf.oResult.status="DELETEFAILED";
							//						oSelf.getOwnerComponent().fireOnupload(oSelf.oResult);
						}
					}
				});
			},
			_onUploadTerminated: function (oEvent) {
				this.uploadCountTerminated += 1;
				this._showErrorMessage(this._objects.oResModel.getResourceBundle().getText("MESSAGE_UPLOAD_FAILED"), "");
				this.oResult.status = "TERMINATED";
				this.getOwnerComponent().fireOnupload(this.oResult);
				this.byId("attachmentServiceFileUpload").getModel("__attachmentData").refresh(true);
				if (this.uploadCount === this.uploadCountSuccess + this.uploadCountFailed + this.uploadCountTerminated) {
					this.oResult.status = "UPLOADCOMPLETED";
					this.oResult.fileName = "";
					this.getOwnerComponent().fireOnupload(this.oResult);
				}

			},
			/***************************************************************************
			 * Utilities Methods for Odata Model Binding, Response Parsing and Header
			 **************************************************************************/
			_setAttachmentModel: function (dataitem) {
				var oDataModel = new sap.ui.model.json.JSONModel({
					dataitems: dataitem
				});
				this.byId("attachmentServiceFileUpload").setModel(oDataModel, "__attachmentData");
			},
			_prepareResponse: function (body) {
				var msgDetails = {
					msgDetail: {},
					innerErrorDetails: []
				};
				var error = JSON.parse(body).error;
				msgDetails.msgDetail.msgText = error.message.value;
				msgDetails.msgDetail.code = error.code;
				error = error.innererror.errordetails;
				jQuery.each(error, function (index) {
					var msg = {};
					msg.msgText = error[index].message;
					msg.code = error[index].code;
					msg.severity = error[index].severity;
					msgDetails.innerErrorDetails.push(msg);
				});
				return msgDetails;
			},
			_setOriginal: function (oResult) {
				if (oResult !== null) {
					var dataitem = [];
					var i = 0,
						length = oResult.results.length;
					for (i = 0; i < length; i++) {
						dataitem.push(this._mapResult(oResult.results[i]));
					}
					this._setAttachmentModel(dataitem);

				}
			},
			_setUploadCollectionHeader: function (name, value, event) {
				var oCustomHeader = new sap.m.UploadCollectionParameter({
					name: name,
					value: value
				});
				event.getParameters().addHeaderParameter(oCustomHeader);
			},

			_prepareUrlParameters: function (action, r) {
				var fId, aId, fN, dN, dT, dP, dV;
				fId = aId = fN = dN = dT = dP = dV = "";
				if (r !== null) {
					fId = "FileId='" + r.FileId + "'";
					aId = "ApplicationId='" + r.ApplicationId + "'";
					fN = "Filename='" + r.Filename + "'";
					dN = "Documentnumber='" + r.Documentnumber + "'";
					dT = "Documenttype='" + r.Documenttype + "'";
					dP = "Documentpart='" + r.Documentpart + "'";
					dV = "Documentversion='" + r.Documentversion + "'";
				}
				var oK = "ObjectKey='" + this._properties.objectKey + "'";
				var oT = "ObjectType='" + this._properties.objectType + "'";
				var oS = "SemanticObjectType='" + this._properties.semanticObject + "'";

				switch (action) {
				case this._ACTION.DELETEATTACHMENT:
					return fId + "," + aId + "," + dN + "," + dT + "," + dP + "," + dV;
				case this._ACTION.RENAMEATTACHMENT:
					return oK + "&" + oT + "&" + oS + "&" + fId + "&" + aId + "&" + fN + "&" + dN + "&" + dT + "&" + dP + "&" + dV;
				case this._ACTION.LISTATTACHMENT:
					return oK + "&" + oT + "&" + oS + "&IsDraft=" + this.getOwnerComponent().getIsDraft();
				default:
					return oK + "&" + oT + "&" + oS;
				}
			},
			_prepareUrlParametersForArchiveLink: function (action) {
				var oK = "ArchiveObjectID='" + this._properties.objectKey + "'";
				var oT = "ArchiveObjectType='" + this._properties.objectType + "'";
				var oS = "SemanticObjectType='" + this._properties.semanticObject + "'";
				return oK + "&" + oT + "&" + oS;
			},
			_prepareParametersToCreateUrl: function (action) {
				var oK = "ObjectKey='" + this._properties.objectKey + "'";
				var oT = "ObjectType='" + this._properties.objectType + "'";
				var oS = "SemanticObjectType='" + this._properties.semanticObject + "'";
				var Ur = "URL='" + encodeURIComponent(sap.ui.getCore().byId("URL").getValue()) + "'";
				this._checkUrl(Ur);
				// var Urf =  Ur.replace(/&/g, "%26");
				var uD = "UrlDescription='" + encodeURIComponent(sap.ui.getCore().byId("URLDesc").getValue()) + "'";
				// uD = encodeURI(uD);
				// Ur = encodeURI(Ur);
				var mT = "MIMEType='text/url'";
				return oK + "&" + oT + "&" + oS + "&" + uD + "&" + Ur + "&" + mT;
			},

			_checkUrl: function (url) {
				var RegExp1 = /^(ftp|http|https):\/\/\\?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\.|\:)[a-z0-9]{2,5}(:[0-9]{1,5})?(\/.*)?$/ig;
				if (RegExp1.test(url)) {
					return true;
				} else {
					return false;
				}
			},
			_setHeader: function (action) {
				var oHeader = {
					"objectkey": this._properties.objectKey,
					"objecttype": this._properties.objectType,
					"semanticobjecttype": this._properties.semanticObject
				};

				if (action === this._ACTION.DELETEATTACHMENT) {
					oHeader.MarkForDeletion = true;
				}
				return oHeader;
			},

			_formatFileSize: function (sValue) {
				if (jQuery.isNumeric(sValue)) {
					return sap.ui.core.format.FileSizeFormat.getInstance({
						binaryFilesize: false,
						maxFractionDigits: 1,
						maxIntegerDigits: 3
					}).format(sValue);
				} else {
					return sValue;
				}
			},
			_showAttachmentsNumber: function () {
				var attachmentNo = this.byId("attachmentServiceFileUpload").getItems().length;
				var attachmentTitleText = this._objects.oResModel.getResourceBundle().getText("Attachment_Title");
				var shownText = attachmentTitleText + " (" + attachmentNo.toString() + ")";
				// this.byId("attachmentServiceFileUpload").setNumberOfAttachmentsText(shownText);
				return shownText;
			},
			_mapResult: function (oFile) {
				if (oFile.Documentnumber && this._properties.documentNumber === "") {
					this._properties.documentPart = oFile.Documentpart;
					this._properties.documentVersion = oFile.Documentversion;
					this._properties.documentNumber = oFile.Documentnumber;
					this._properties.documentType = oFile.Documenttype;
				}
				var authRename = false,
					authDel = false; //variables to hold user auth details
				if (oFile.UxFCDelete === 1) {
					authDel = true;
				}
				if (oFile.UxFCRename === 1) {
					authRename = true;
				}
				var object = {
					"content_type": oFile.__metadata.content_type,
					"Filename": oFile.Filename,
					//	"url" : oFile.__metadata.media_src,
					"url": this._getLinkStatus(oFile),
					"FileId": oFile.FileId ? oFile.FileId : oFile.ArchiveDocumentID,
					"ApplicationId": oFile.ApplicationId,
					"Documentnumber": oFile.Documentnumber,
					"Documenttype": oFile.Documenttype,
					"Documentversion": oFile.Documentversion,
					"Documentpart": oFile.Documentpart,
					"enableEdit": this._getEditMode(),
					"enableDelete": this._getDeleteMode() && authDel,
					"visibleEdit": this._properties.visibleEdit && authRename,
					"visibleDelete": this._properties.visibleDelete && authDel,
					"attributes": this._getAttributes(oFile),
					"statuses": this._getStatuses(oFile)
				};
				return object;
			},

			_getLinkStatus: function (oFile) {
				var url = '';

				if (this._fieldControl._VisibleAttributes.ENABLELINK === true) {
					if (oFile.ContentSource && oFile.ContentSource.length > 0) {
						url = oFile.ContentSource;
					} else {
						url = this._changeHostname(oFile.__metadata.media_src);
					}
				} else {
					url = '';
				}

				return url;

			},
			_getStatuses: function (oFile) {
				var statusList = [];
				var tempStatus;
				var draftDetails = {
					"title": this._objects.oResModel.getResourceBundle().getText("Status_Title"),
					"text": this._objects.oResModel.getResourceBundle().getText("Draft_Title")

				};
				if (this._fieldControl._VisibleAttributes.ATTACHMENTSTATUS && oFile.AttachmentStatus === "DRAFT") {
					statusList.push(draftDetails);
				}
				if (this._fieldControl._VisibleAttributes.SOURCE && oFile.Source) {
					var sourceDetails = {
						"title": this._objects.oResModel.getResourceBundle().getText("Source_Title"),
						"text": oFile.Source,
						"state": "Success"
					};
					statusList.push(sourceDetails);
				}
				if (this.checkedInStatusShow) {
					if (oFile.CheckedInStatus === true) {
						tempStatus = {
							"text": this._objects.oResModel.getResourceBundle().getText("CheckedIn"),
							"icon": "sap-icon://locked",
							"state": "Success"
						};
					} else {
						tempStatus = {
							"text": this._objects.oResModel.getResourceBundle().getText("CheckedOut"),
							"icon": "sap-icon://unlocked",
							"state": "Error"
						};
					}
					statusList.push(tempStatus);
				}

				return statusList;
			},
			_getAttributes: function (oFile) {
				var attrList = [];
				var temp = {};
				if (this._fieldControl._VisibleAttributes.UPLOADEDBY === true) {
					temp = {
						"title": this._objects.oResModel.getResourceBundle().getText("Uploaded_By_Title"),
						"text": oFile.FullName
					};
					attrList.push(temp);
				}

				if (this._fieldControl._VisibleAttributes.UPLOADEDON === true) {
					temp = {
						"title": this._objects.oResModel.getResourceBundle().getText("Uploaded_On_Title"),
						"text": sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "dd-MM-yyyy"
						}).format(oFile.CreatedAt)
					};
					attrList.push(temp);
				}

				if (this._fieldControl._VisibleAttributes.FILESIZE === true) {
					if (!this._isValidURLType(oFile.ContentType)) {
						temp = {
							"title": this._objects.oResModel.getResourceBundle().getText("File_Size_Title"),
							"text": this._formatFileSize(oFile.Filesize)
						};
						attrList.push(temp);
					}
				}
				if (this._fieldControl._VisibleAttributes.DIRDETAILS === true) {
					temp = {
						"title": this._objects.oResModel.getResourceBundle().getText("DIR_Details"),
						"text": oFile.Documenttype + "/" + oFile.Documentnumber + "/" + oFile.Documentversion + "/" + oFile.Documentpart,
						"active": true
					};
					attrList.push(temp);
				}
				return attrList;

			},
			/***************************************************************************
			 * Methods for Modifing Uploadcollection Properties
			 **************************************************************************/
			_getEditMode: function () {
				if (this._properties.documentType === "GOS") {
					this._properties.visibleEdit = false;
				}
				return this._properties.visibleEdit;
			},
			_getDeleteMode: function () {
				return this._properties.visibleDelete;
			},
			_showErrorMessage: function (msgText, msgDetail) {
				var self = this;
				MessageBox.error(msgText, {
					icon: MessageBox.Icon.ERROR,
					title: self._objects.oResModel.getResourceBundle().getText("Error_Title"),
					actions: [MessageBox.Action.CLOSE],
					details: msgDetail
				});
			},
			_setActionVisibility: function (isEdit) { // Here isEdit will be true for create and change mode
				this.byId("attachmentTitle").setVisible(this._fieldControl._VisibleAttributes.ATTACHMENTTITLE);
				if (isEdit === true) {
					//Check the updated JSON and update the action metadata accordingly
					this._properties.visibleEdit = this._fieldControl._VisibleActions.RENAME;
					this._properties.visibleDelete = this._fieldControl._VisibleActions.DELETE;
					this.byId("attachmentServiceFileUpload").setUploadEnabled(this._fieldControl._VisibleActions.ADD);
					// this.byId("attachmentServiceFileUpload").setUploadButtonInvisible(!this._fieldControl._VisibleActions.ADD);
					this.byId("AddUrl").setEnabled(this._fieldControl._VisibleActions.ADDURL);
					this.byId("AddUrl").setVisible(this._fieldControl._VisibleActions.ADDURL);
					this.byId("CheckInButton").setEnabled(false);
					this.byId("CheckOutButton").setEnabled(false);
					this.byId("ResetCheckOutButton").setEnabled(false);
					this.byId("Download").setVisible(this._fieldControl._VisibleActions.DOWNLOAD);
					this.byId("Download").setEnabled(this._fieldControl._VisibleActions.DOWNLOAD);
					this.flavorControl(this.getOwnerComponent().getFlavor());
				} else {
					this._properties.visibleEdit = false;
					this._properties.visibleDelete = false;
					this.byId("attachmentServiceFileUpload").setUploadEnabled(false);
					// this.byId("attachmentServiceFileUpload").setUploadButtonInvisible(!this._fieldControl._VisibleActions.ADD);
					this.byId("AddUrl").setEnabled(false);
					this.byId("AddUrl").setVisible(this._fieldControl._VisibleActions.ADDURL);
					this.byId("CheckInButton").setEnabled(false);
					this.byId("CheckOutButton").setEnabled(false);
					this.byId("ResetCheckOutButton").setEnabled(false);
					this.byId("Download").setVisible(this._fieldControl._VisibleActions.DOWNLOAD);
					this.byId("Download").setEnabled(this._fieldControl._VisibleActions.DOWNLOAD);
					this.byId("attachmentServiceFileUpload").setMode("None");
				}
			},
			_setProperty: function () {
				switch (this._properties.mode) {
				case this._MODE.CREATE:
					var dataitem = [];
					this._setAttachmentModel(dataitem);
					this._setActionVisibility(true);
					this.getView().getModel("ui").setProperty("/editMode", true);
					break;
				case this._MODE.CHANGE:
					this._setActionVisibility(true);
					break;
				default:
					this._setActionVisibility(false);
				}
			},
			_onSelectionChange: function () {
				var oUploadCollection = this.getView().byId("attachmentServiceFileUpload");
				// If there's any item selected, sets checkout button enabled
				if (oUploadCollection.getSelectedItems().length > 0 && (this._properties.mode === this._MODE.CREATE || this._properties.mode ===
						this._MODE.CHANGE)) {
					this.getView().byId("CheckOutButton").setEnabled(true);
					this.getView().byId("ResetCheckOutButton").setEnabled(true);
					if (oUploadCollection.getSelectedItems().length === 1) {
						this.getView().byId("CheckInButton").setEnabled(true);
					} else {
						this.getView().byId("CheckInButton").setEnabled(false);
					}
				} else {
					this.getView().byId("CheckOutButton").setEnabled(false);
					this.getView().byId("CheckInButton").setEnabled(false);
					this.getView().byId("ResetCheckOutButton").setEnabled(false);
				}
			},
			_onAttributePress: function (oEvent) {
				var concatDIR = oEvent.getSource().getText();
				var splitDIRArray = concatDIR.split("/");
				var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
				if (fgetService) {
					this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
					this.oCrossAppNavigator.toExternal({
						target: {
							semanticObject: "DocumentInfoRecord",
							action: "changeDIR"
						},
						params: {
							"DocumentInfoRecord": splitDIRArray[1],
							"DocumentType": splitDIRArray[0],
							"DocumentPart": splitDIRArray[3],
							"DocumentVersion": splitDIRArray[2]
						}
					});
				}
			},
			_onCheckIn: function (oEvent) {
				var oButton = oEvent.getSource();
				if (!this._actionSheet) {
					this._actionSheet = sap.ui.xmlfragment(
						"sap.se.mi.plm.lib.attachmentservice.attachment.fragment.checkInActionSheet",
						this
					);
					this.getView().addDependent(this._actionSheet);
				}
				this._actionSheet.openBy(oButton);

			},
			_onCheckInOriginalPress: function (oEvent) {
				var oUploadCollection = this.getView().byId("attachmentServiceFileUpload");
				var aSelectedItem = oUploadCollection.getSelectedItem();
				this.itemforcheckingin = oUploadCollection.getSelectedItem();
				this.checkingIn = true;
				oUploadCollection.setMultiple(false);
				oUploadCollection.openFileDialog();
				oUploadCollection.setMultiple(true);

			},
			_onCheckInAsNewVersionPress: function (oEvent) {
				var oUploadCollection = this.getView().byId("attachmentServiceFileUpload");
				var aSelectedItem = oUploadCollection.getSelectedItem();
				this.itemforcheckingin = oUploadCollection.getSelectedItem();
				this.checkingInAsNewVersion = true;
				oUploadCollection.setMultiple(false);
				oUploadCollection.openFileDialog();
				oUploadCollection.setMultiple(true);
			},
			_onCheckOut: function () {
				var self = this;
				var prop;
				var oUploadCollection = this.getView().byId("attachmentServiceFileUpload");
				var aSelectedItems = oUploadCollection.getSelectedItems();
				if (aSelectedItems) {

					for (var i = 0; i < aSelectedItems.length; i++) {

						prop = this._getSelectedItemProperties(aSelectedItems[i], oUploadCollection);
						// var encodeURL = encodeURI("ApplicationId='"+prop.ApplicationId+"'&FileId='"+prop.FileId+"'"); //"ObjectKey=%27demo_test%27&ObjectType=%27bus1001006%27&SemanticObjectType=%27Product%27";//
						self._objects.oModel.callFunction("/CheckOut", {
							method: "POST",
							urlParameters: {
								ApplicationId: prop.ApplicationId,
								FileId: prop.FileId
							},
							success: function (oData) {
								oUploadCollection.downloadItem(aSelectedItems[i], true);
								self._updateFile(oData);
							},
							error: function (e) {
								self._showErrorMessage(JSON.parse(e.response.body).error.message.value, "");
							}
						});
					}
				}
			},
			_onResetCheckOut: function () {
				var self = this;
				var prop;
				var oUploadCollection = this.getView().byId("attachmentServiceFileUpload");
				var aSelectedItems = oUploadCollection.getSelectedItems();
				if (aSelectedItems) {

					for (var i = 0; i < aSelectedItems.length; i++) {
						prop = this._getSelectedItemProperties(aSelectedItems[i], oUploadCollection);
						// var encodeURL = encodeURI("ApplicationId='"+prop.ApplicationId+"'&FileId='"+prop.FileId+"'"); //"ObjectKey=%27demo_test%27&ObjectType=%27bus1001006%27&SemanticObjectType=%27Product%27";//
						self._objects.oModel.callFunction("/ResetCheckOut", {
							method: "POST",
							urlParameters: {
								ApplicationId: prop.ApplicationId,
								FileId: prop.FileId
							},
							success: function (oData) {
								self._updateFile(oData);
							},
							error: function (e) {
								self._showErrorMessage(JSON.parse(e.response.body).error.message.value, "");
							}
						});
					}
				}
				// self._objects.oModel.addBatchChangeOperations(batchChanges);
				// self._objects.oModel.submitBatch(function(oData) {
				// 	self._objects.oModel.refresh();
				// 	var results = [];
				// 	oData.__batchResponses.forEach(function(resp) {
				// 		if(resp.response){
				// 				self._showErrorMessage(JSON.parse(resp.response.body).error.message.value, "");
				// 		}
				// 		else
				// 		{
				// 		results = results.concat(resp.__changeResponses[0].data);
				// 		self._updateFile(resp.__changeResponses[0].data);
				// 		}
				// 	});
				// }, function(e) {
				// 	self._showErrorMessage(JSON.parse(e.response.body).error.message.value, "");
				// });

			},

			_getSelectedItemProperties: function (SelectedItem, oUploadCollection) {

				var retProp = SelectedItem.data();

				return retProp;
			},
			_updateFile: function (fileDetails) {
				var self = this;
				var oData = this.getView().byId("attachmentServiceFileUpload").getModel("__attachmentData").getData();
				var aItems = jQuery.extend(true, {}, oData).dataitems;
				// Adds the new metadata to the file which was updated.
				for (var i = 0; i < aItems.length; i++) {
					if (aItems[i].ApplicationId === fileDetails.ApplicationId) {
						aItems[i] = self._mapResult(fileDetails);
					}
				}
				// Updates the model.
				this._setAttachmentModel(aItems);
			},
			/***************************************************************************
			 * Component Related Methods
			 **************************************************************************/
			commitChanges: function (isRefresh) {
				return this._commitChanges(isRefresh);
			},
			cancelChanges: function (isRefresh) {
				return this._cancelChanges(isRefresh);
			},
			setModeProperty: function (value) {
				this._properties.mode = value;
				this._setProperty();
			},
			// setPropertiesOnly :function(asMode, objectType, objectKey, semanticObject) {
			// 	if ((objectType || semanticObject) && objectKey) {
			// 		this.byId("attachmentServiceVBoxPage").setVisible(true);
			// 		this._properties.objectKey = objectKey;
			// 		this._properties.objectType = objectType;
			// 		this._properties.semanticObject = semanticObject;
			// 		this._properties.mode = asMode;
			// 		this._properties.documentPart = "";
			// 		this._properties.documentVersion = "";
			// 		this._properties.documentNumber = "";
			// 		this._properties.documentType = "";

			// 	}

			// },
			setProperties: function (asMode, objectType, objectKey, semanticObject) {
				if ((objectType || semanticObject) && objectKey) {
					this.byId("attachmentServiceVBoxPage").setVisible(true);
					this.getOwnerComponent().setProperty("objectKey", objectKey);
					this.getOwnerComponent().setProperty("objectType", objectType);
					this.getOwnerComponent().setProperty("mode", asMode);
					this.getOwnerComponent().setProperty("semanticObject", semanticObject);
					this._properties.objectKey = objectKey;
					this._properties.objectType = objectType;
					this._properties.semanticObject = semanticObject;
					this._properties.mode = asMode;
					this._properties.documentPart = "";
					this._properties.documentVersion = "";
					this._properties.documentNumber = "";
					this._properties.documentType = "";

					if (this._properties.objectKey && (this._properties.objectType || this._properties.semanticObject)) {
						this._getOriginal();
					} else {
						this._properties.mode = 'D';
					}
				}
				// } else {
				// 	this.byId("attachmentServiceVBoxPage").setVisible(false);
				// }
			},
			getApplicationState: function () {
				if ((this._properties.objectType || this._properties.semanticObject) && this._properties.objectKey) {
					return this._getApplicationState();
				}
			},
			getAttachmentCount: function () {
				if ((this._properties.objectType || this._properties.semanticObject) && this._properties.objectKey) {
					return this._getAttachmentCount();
				}
			},
			_isValidURLType: function (mimeType) {
				var isFound = false;
				if (this.validURLType.indexOf(mimeType.toLowerCase()) >= 0) {
					isFound = true;
				} else {
					isFound = false;
				}
				return isFound;
			}
		});

	}, /* bExport= */ true);
