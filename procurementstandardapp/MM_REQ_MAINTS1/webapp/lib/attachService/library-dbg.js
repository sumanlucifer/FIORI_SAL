/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
/**
 * Initialization Code and shared classes of library sap.se.mi.plm.lib.attachmentservice.
 */
sap.ui.define(["sap/m/library","sap/ui/core/Core","sap/ui/core/library"],
	function(library2, Core, library1) {
	"use strict";

	/**
	 * UI Library for Attachment Service
	 *
	 * @namespace
	 * @name sap.se.mi.plm.lib.attachmentservice
	 * @public
	 */


	// library dependencies
	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.se.mi.plm.lib.attachmentservice",
		noLibraryCSS: true,
		dependencies : ["sap.ui.core","sap.m"],
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		version: "4.0.35"
	});

	return sap.se.mi.plm.lib.attachmentservice;

}, /* bExport= */ true);
