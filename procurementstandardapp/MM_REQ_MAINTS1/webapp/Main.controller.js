/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("ui.ssuite.s2p.mm.pur.pr.prcss.s1.Main", {

	onInit: function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('ui.ssuite.s2p.mm.pur.pr.prcss.s1', this);
	}
});