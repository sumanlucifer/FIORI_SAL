/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.model.SimpleType");
jQuery.sap.declare("ui.ssuite.s2p.mm.pur.pr.prcss.s1.model.types.QuantityType");

sap.ui.model.type.Float.extend("ui.ssuite.s2p.mm.pur.pr.prcss.s1.model.types.QuantityType", {

	constructor: function(sUnitOfMeasure) {
		sap.ui.model.SimpleType.apply(this, arguments);
		this.sName = "ui.ssuite.s2p.mm.pur.pr.prcss.s1.model.types.QuantityType";
		this.sInternalType = "number";
		this.oQuantityFormat = sap.ui.core.format.NumberFormat.getInstance();
		sap.ui.model.SimpleType.prototype.sUnitOfMeasure = sUnitOfMeasure;
	},

	// formatValue: function(oValue) {
	// 	return (oValue) ? sap.ca.ui.model.format.QuantityFormat.FormatQuantityStandard(parseFloat(oValue), sap.ui.model.SimpleType.prototype.sUnitOfMeasure) :
	// 		oValue;
	// },

	parseValue: function(oValue) {
		return (oValue) ? this.oQuantityFormat.convertToDecimal(this.oQuantityFormat.parse(oValue)) : 0;
	}

});