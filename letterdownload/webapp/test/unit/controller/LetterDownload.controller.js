/*global QUnit*/

sap.ui.define([
	"comsal/letterdownload/controller/LetterDownload.controller"
], function (Controller) {
	"use strict";

	QUnit.module("LetterDownload Controller");

	QUnit.test("I should test the LetterDownload controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
