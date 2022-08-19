/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("ui.ssuite.s2p.mm.pur.pr.prcss.s1.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

function getServiceUrl(sServiceUrl) {
	if (window.location.hostname == "localhost") {
		return "/ui.ssuite.s2p.mm.pur.pr.prcss.s1/proxy" + sServiceUrl;
	} else {
		return sServiceUrl;
	}
}

sap.ca.scfld.md.ConfigurationBase.extend("ui.ssuite.s2p.mm.pur.pr.prcss.s1.Configuration", {

	oServiceParams: {
		serviceList: [
			{
				name: "MM_PUR_PR_PROCESS_Entities",

				masterCollection: "PurchaseReqItemSet",

				// serviceUrl: ui.ssuite.s2p.mm.pur.pr.prcss.s1.Component.getMetadata().getManifestEntry("sap.app").dataSources["MM_PUR_PR_PROCESS_Entities"].uri,
				serviceUrl: URI(getServiceUrl("/sap/opu/odata/sap/MM_PUR_PR_PROCESS_SRV/")).directory(),
				overrideGetPropertyMetadata: true,
			//	useBatch: true,
				isDefault: true,
				busyDialog: false
				// mockedDataSource: "/ui.ssuite.s2p.mm.pur.pr.prcss.s1/model/metadata.xml"
				//   mockedDataSource: jQuery.sap.getModulePath("ui.ssuite.s2p.mm.pur.pr.prcss.s1") + "/" + ui.ssuite.s2p.mm.pur.pr.prcss.s1.Component.getMetadata().getManifestEntry("sap.app").dataSources["MM_PUR_PR_PROCESS_Entities"].settings.localUri
			}
		]
	},

	getServiceParams: function() {
		return this.oServiceParams;
	},

	getAppConfig: function() {
		return this.oAppConfig;
	},

	/**
	 * @inherit
	 */
	getServiceList: function() {
		return this.oServiceParams.serviceList;
	},

	getMasterKeyAttributes: function() {
		return ["Id"];
	}

});