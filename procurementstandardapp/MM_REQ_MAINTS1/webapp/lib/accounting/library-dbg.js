/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
/**
 * Initialization Code and shared classes of library sap.ui.s2p.mm.lib.reuse.accounting.
 */
sap.ui.define(["jquery.sap.global",
		"sap/ui/core/library"
	], // library dependency
	function(jQuery) {

		"use strict";

		/**
		 *
		 *
		 * @namespace
		 * @name sap.ui.s2p.mm.lib.reuse.accounting
		 * @author SAP SE
		 * @version 4.0.9
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "sap.ui.s2p.mm.lib.reuse.accounting",
			version: "4.0.9",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [],
			elements: []
		});

		return sap.ui.s2p.mm.lib.reuse.accounting;

	}, /* bExport= */ true);
