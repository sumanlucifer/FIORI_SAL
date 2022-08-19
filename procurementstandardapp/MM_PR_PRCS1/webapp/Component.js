/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("ui.ssuite.s2p.mm.pur.pr.prcss.s1.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

//check for BSP environment and set reuse library path
(function() {
	var sPath = jQuery.sap.getModulePath("ui.ssuite.s2p.mm.pur.pr.prcss.s1");
	if (sPath.indexOf("/mm_pr_prcs1") !== -1) {
		if (sPath.lastIndexOf("/") !== sPath.length - 1) {
			sPath += "/";
		}
		// jQuery.sap.registerModulePath("sap.se.mi.plm.lib.attachmentservice", sPath + "../mi_plm_ath_cre/sap/se/mi/plm/lib/attachmentservice/");
		// jQuery.sap.registerModulePath("sap.ssuite.fnd.om.outputcontrol", sPath + "../fnd_om_out_cntl/sap/ssuite/fnd/om/outputcontrol/");
		// Output Control Component workaround: see Incident 1570743306:
		// jQuery.sap.registerModulePath("sap.ssuite.fnd.om.outputcontrol.outputitems.s1", jQuery.sap.getModulePath("sap.ssuite.fnd.om.outputcontrol.outputitems"));
		// jQuery.sap.registerModulePath("sap.cus.sd.lib.pricing", sPath + "../sd_prc_reusecom/sap/cus/sd/lib/pricing/");
	}
}());
// extent of sap.ca.scfld.md.ComponentBase
sap.ca.scfld.md.ComponentBase.extend("ui.ssuite.s2p.mm.pur.pr.prcss.s1.Component", {
	metadata: sap.ca.scfld.md.ComponentBase.createMetaData("FS", {
		"manifest": "json",

		viewPath: "ui.ssuite.s2p.mm.pur.pr.prcss.s1.view",
		fullScreenPageRoutes: {
			"fullscreen":
			// fill the routes to your full screen pages in here.
			{
				"pattern": "",
				"view": "S1",
				"viewLevel": 1
			},
			"itemDetails": {

				"pattern": "itemDetails",

				"view": "S2",
				"viewLevel": 2

			},
			"purchaseOrdersPreview": {
				"pattern": "purchaseOrdersPreview",

				"view": "S3",
				"viewLevel": 3
			},
			"RFQPreview": {
				"pattern": "RFQPreview",

				"view": "S4",
				"viewLevel": 3
			}
		}
	}),

	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent: function() {
		var oViewData = {
			component: this
		};
		return sap.ui.view({
			viewName: "ui.ssuite.s2p.mm.pur.pr.prcss.s1.Main",
			type: sap.ui.core.mvc.ViewType.XML,
			viewData: oViewData
		});
	}
});