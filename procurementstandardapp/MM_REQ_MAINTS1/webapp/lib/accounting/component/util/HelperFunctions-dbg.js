/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(function() {
	"use strict";

	var HelperFunctions = {

		/******************************************************************************
		 * SetLayoutProperties
		 * Parameters:  oComponentData
		 *  oView
		 * =============================================================================
		 * Set layout properties according to component properties:
		 * - HorizontalLayout
		 * - Editable
		 * - ProfitabilityAssignemntEnabled
		 ******************************************************************************/

		setLayoutProperties: function(oView) {

			// Set Style (use HorizontalLayout or don't)
			//var vUseHorizontalLayout = oComponentData.useHorizontalLayout;
			this.oSmartForm = oView.byId("accAssignSmartForm");
			if (!this.oSmartForm) {
				this.oSmartForm = sap.ui.getCore().byId("accAssignSmartForm");
			}
			var vUseHorizontalLayout;
			if (vUseHorizontalLayout === true) {
				this.oSmartForm.setUseHorizontalLayout(true);

				// Only set layout if exists
				if (oView.byId("AccGroup")) {
					oView.byId("AccGroup").setUseHorizontalLayout(true);
				}

			} else {
				this.oSmartForm.setUseHorizontalLayout(false);

				// Only set layout if exists

			}

			// Set if coding block is editable
			//var vEditmode = oComponentData.editMode;

			this.oSmartForm.setEditable(true);

		},

		/******************************************************************************
		 * GetAttributesFromMetadata
		 * Parameters: oModel                         Model to be considered
		 * sAccEntityTypeName                            Entity type name
		 * =============================================================================
		 * Returns a list of all attributes of the given EntityTypeName
		 ******************************************************************************/

		getAttributesFromMetadata: function(oModel, sAccEntityTypeName) {
			var oEntityTypeList = oModel.getServiceMetadata().dataServices.schema[0].entityType;

			for (var i = 0; i < oEntityTypeList.length; i++) {
				if (oEntityTypeList[i].name === sAccEntityTypeName) {
					return oEntityTypeList[i].property;
				}
			}
		},

		/******************************************************************************
		 * getAccAssignAnnotationFromMetadata
		 * Parameters: oModel   Model to be considered
		 * sAccEntityTypeName     EntityTypeName (annotation uses it)
		 * vGroupName          Name of the annotation group
		 * =============================================================================
		 * Returns a list of all attributes of the given EntityTypeName
		 ******************************************************************************/

		getAccAssignAnnotationFromMetadata: function(oModel, sAccEntityTypeName, vGroupName) {
			var dataAnnotation;
			var oAnnotationList = oModel.getServiceMetadata().dataServices.schema[0].annotations;
			var aEntityAnnotation = [];
			for (var i = 0; i < oAnnotationList.length; i++) {
				if (oAnnotationList[i].target.indexOf(sAccEntityTypeName) > -1) {
					for (var j = 0; j < oAnnotationList[i].annotation.length; j++) {
						if (oAnnotationList[i].annotation[j].extensions && oAnnotationList[i].annotation[j].extensions[0].name === "Qualifier" &&
							oAnnotationList[i].annotation[j].extensions[0].value === vGroupName) {
							for (var k = 0; k < oAnnotationList[i].annotation[j].record.propertyValue.length; k++) {
								if (oAnnotationList[i].annotation[j].record.propertyValue[k].property === "Data") {
									dataAnnotation = oAnnotationList[i].annotation[j].record.propertyValue[k].collection.record;
									return dataAnnotation;
								}
							}
						}
					}
				}
			}
			//Annotation as per smart templates
			if (!dataAnnotation) {
				oAnnotationList = oModel.getServiceAnnotations();
				var oEntityAnnotation = {};
				var entityTypeName = sAccEntityTypeName;
				for (var prop in oAnnotationList) {
					if (prop.search(entityTypeName) !== -1) {
						oEntityAnnotation = oAnnotationList[prop];
						break;
					}
				}
				for (var property in oEntityAnnotation) {
					if (((property.search("FieldGroup") !== -1) && (property.search(vGroupName) !== -1)) || (property.search("Identification") !== -1)) {
						if (oEntityAnnotation[property].Data) {
							aEntityAnnotation.push(oEntityAnnotation[property].Data);
						}
						//else {
						//	aEntityAnnotation.push(oEntityAnnotation[property]);
						//}
					}
				}

				return aEntityAnnotation;
			}

		},

		/******************************************************************************
		 * getKeyFromPath
		 * Parameters:  sPath
		 * =============================================================================
		 * Get key from path
		 ******************************************************************************/

		getKeyFromPath: function(sPath) {
			var aKey = [];

			var tmp = sPath.split("(");
			tmp = tmp[1].split(")");
			var aKeyStrings = tmp[0].split(",");

			for (var i = 0; i < aKeyStrings.length; i++) {
				tmp = aKeyStrings[i].split("=");
				var sKeyName = String(tmp[0]);
				var sKeyValue = String(tmp[1].replace("'", "").replace("'", ""));

				aKey.push([sKeyName, sKeyValue]);
			}

			return aKey;
		},

		/******************************************************************************
		 * GetUrlParametersFromKeyArray
		 * Parameters:  aKey
		 * =============================================================================
		 * Get key from path
		 ******************************************************************************/

		getUrlParametersFromKeyArray: function(aKey) {

			var sUrlParameters = '{';
			for (var i = 0; i < aKey.length; i++) {
				sUrlParameters = sUrlParameters + '"' + aKey[i][0] + '" : "' + aKey[i][1] + '"';
				if (i < aKey.length - 1) {
					sUrlParameters = sUrlParameters + ',';
				} else {
					sUrlParameters = sUrlParameters + '}';
				}
			}

			return JSON.parse(sUrlParameters);
		},

		/******************************************************************************
		 * GetKeyStringFromKeyJSON
		 * Parameters:  oKeyJSON
		 * =============================================================================
		 * Get Key String from Key JSON
		 ******************************************************************************/

		getKeyStringFromKeyJSON: function(oKeyJSON) {

			var aKey = [];
			for (var element in oKeyJSON) {
				aKey.push([element, oKeyJSON[element]]);
			}

			var vKey = aKey[0][0] + "='" + aKey[0][1] + "'";
			for (var i = 1; i < aKey.length; i++) {
				vKey = vKey + "," + aKey[i][0] + "='" + aKey[i][1] + "'";
			}

			return vKey;
		},

		/******************************************************************************
		 * ReplaceAll
		 * Parameters:  target
		 * =============================================================================
		 * Replace All
		 ******************************************************************************/

		replaceAll: function(target, replacement) {
			return this.split(target).join(replacement);
		},

		/******************************************************************************
		 * ContainsVisibleAttribute
		 * Parameters:  oGroup          Group for which it is checked if at least one
		 *                               attribute is visible
		 * =============================================================================
		 * Check if at least one attribute is visible
		 ******************************************************************************/

		containsVisibleAttribute: function(oGroup) {
			var oGroupElements = oGroup.getGroupElements();

			for (var i = 0; i < oGroupElements.length; i++) {
				if (oGroupElements[i].getVisible()) {
					return true;
				}
			}
			return false;
		},

		/******************************************************************************
		 * ClearAttributes
		 * Parameters:  oGroup          Group for which attributes shall be cleared
		 * =============================================================================
		 * Clears ALL attributes in the Coding Block form
		 ******************************************************************************/

		clearAttributes: function(oGroup) {
			if (oGroup && oGroup.getGroupElements().length > 0) {
				oGroup.destroyGroupElements();
			}
		}
	};

	return HelperFunctions;

}, /* bExport= */ true);
