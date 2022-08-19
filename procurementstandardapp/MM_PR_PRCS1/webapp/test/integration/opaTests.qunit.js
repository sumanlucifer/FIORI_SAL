/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["ui/ssuite/s2p/mm/pur/pr/prcss/s1/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
