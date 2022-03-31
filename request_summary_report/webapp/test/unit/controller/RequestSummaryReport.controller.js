/*global QUnit*/

sap.ui.define([
	"comsalreports/request_summary_report/controller/RequestSummaryReport.controller"
], function (Controller) {
	"use strict";

	QUnit.module("RequestSummaryReport Controller");

	QUnit.test("I should test the RequestSummaryReport controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
