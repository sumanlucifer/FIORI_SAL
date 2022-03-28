/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comsalreports/tickets_summary_report/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
