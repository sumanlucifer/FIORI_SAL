/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comsalinprocess/myrequest_inprocess_card/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
