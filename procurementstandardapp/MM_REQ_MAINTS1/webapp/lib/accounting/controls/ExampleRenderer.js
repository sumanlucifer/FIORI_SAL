/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var E={};E.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapRULTExample");r.writeClasses();r.write(">");r.writeEscaped(c.getText());r.write("</div>");};return E;},true);
