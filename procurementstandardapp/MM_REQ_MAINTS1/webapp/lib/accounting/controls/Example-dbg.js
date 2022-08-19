/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
// Provides control sap.ui.s2p.mm.lib.reuse.accounting.Example.
sap.ui.define(["jquery.sap.global", "./../library", "sap/ui/core/Control"],
	function(jQuery, library, Control) {
		"use strict";
		/**
		 * Constructor for a new Example control.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * Some class description goes here.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 4.0.9
		 *
		 * @constructor
		 * @public
		 * @alias sap.ui.s2p.mm.lib.reuse.accounting.controls.Example
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var Example = Control.extend("sap.ui.s2p.mm.lib.reuse.accounting.controls.Example", {
			metadata: {
				library: "sap.ui.s2p.mm.lib.reuse.accounting",
				properties: {

					/**
					 * text
					 */
					text: {
						type: "string",
						group: "Misc",
						defaultValue: null
					}

				},
				events: {
					/**
					 * Event is fired when the user clicks on the control.
					 */
					press: {}

				}
			}
		});
		return Example;
	}, /* bExport= */ true);
