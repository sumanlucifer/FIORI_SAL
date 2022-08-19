/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ui.s2p.mm.requisition.maintain.s1/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
