/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter");
jQuery.sap.require('jquery.sap.resources');

ui.ssuite.s2p.mm.pur.pr.prcss.s1.util.Formatter = {

	formatPrNumItmNum: function(vPrNum, vPrItmNum) {
		return vPrNum + '/' + (vPrItmNum / 1);
	},

	formatDateValidation: function(date) {
		var today = new Date();
		var selectedDate = date;
		var sToday = today.toDateString();
		var sSelectedDate = date.toDateString();
		if (sToday === sSelectedDate) {
			return sap.ui.core.ValueState.None;
		} else
		if (today > selectedDate) {
			return sap.ui.core.ValueState.Error;
		} else {
			return sap.ui.core.ValueState.None;
		}
	},

	formatDateOkButton: function(date) {
		var today = new Date();
		var sToday = today.toDateString();
		var selectedDate = date;
		var sSelectedDate = date.toDateString();
		if (sToday === sSelectedDate) {
			return true;
		} else
		if (today >= selectedDate) {
			return false;
		} else {
			return true;
		}
	},

	formatDraftId: function(draftId) {
		this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl()
			.getResourceBundle();
		var title = this.oResourceBundle.getText("PurchaseOrder");
		return title + ' ' + draftId;
	},

	formatDisplayText: function(txt, value) {
		return txt + ' ' + value;

	},
	formatLinkDisable: function(Soscount) {
		if (Soscount == 0)
			return false;
		else
			return true;
	},

	formatQuantity: function(nQuantity, sUnit) {
		//var nFormattedAndQuantity = sap.ca.ui.model.format.QuantityFormat.FormatQuantityStandard(nQuantity, sUnit);
		var sQuantityAndUnit = nQuantity + " " + sUnit;
		return sQuantityAndUnit;
	},

	formatDisplayTxt: function(edit, txt, value) {
		if (value) {
			return edit + ' ' + txt + ' ' + '(' + value + ')';
		} else {
			return edit + ' ' + txt;
		}
	},

	formatQuant: function(vQuant, vUnit) {
		return vQuant + ' ' + vUnit;
	},

	formatCurrency: function(nAmount, sCurrency) {
		//	var nFormattedAmount = sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(nAmount, sCurrency);
		var sAmountAndCurrency = nAmount + " " + sCurrency;
		return sAmountAndCurrency;

	},

	formatTotal: function(title, nAmount, sCurrency) {

		//	var nFormattedAmount = sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(nAmount, sCurrency);
		var sAmountAndCurrency = nAmount + " " + sCurrency;
		return title + ' ' + sAmountAndCurrency;
	},

	/*formatTotal : function(vTotal, vCurrency) {
                                       this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl()
                                                                       .getResourceBundle();
                                       var title = this.oResourceBundle.getText("TOTAL");
                                       return title + ' ' + vTotal + ' ' + vCurrency;
                       },

              */
	formatDocItemCategory: function(vItemCategory) {
		if (vItemCategory == '6')
			return false;
		else
			return true;
	},
	formatDescMatnr: function(vdesc, vmatnr) {
		if (vmatnr == "") {

			return vdesc;
		} else {
			return vdesc + ' (' + vmatnr + ')';
		}
	},

	materialLinkDisable: function(vmatnr) {
		if (vmatnr === "")
			return false;
		else
			return true;
	},

	formatPriceCurrency1: function(nAmount, sCurrency) {
		//	var nFormattedAmount = sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(nAmount, sCurrency);
		return nAmount + ' ' + sCurrency;
	},

	formatPriceCurrency2: function(sCurrency, nQuantity, sUnit) {
		//var nFormattedAndQuantity = sap.ca.ui.model.format.QuantityFormat.FormatQuantityStandard(nQuantity, sUnit);
		var sQuantityAndUnit = "/" + nQuantity + " " + sUnit;
		if (sUnit == "") {
			return "";
		} else {
			return sQuantityAndUnit;
		}
	},

	formatDateRead: function(vDate) { //formatter to convert ABAP date into Date picker format
		if (vDate) {
		/*	var sysLang = sap.ui.getCore().getConfiguration().getLanguage();
			var oLocale = new sap.ui.core.Locale(sysLang);
			var formattedDate = sap.ui.core.format.DateFormat.getDateInstance({
				style: "medium"
			}, oLocale).format(new Date(vDate));*/
			var vDeliveryDate= new Date(vDate);
			var utc = vDeliveryDate.getTime() + (vDeliveryDate.getTimezoneOffset() * 60000);
			var offset = 0;
			var edate = new Date(utc + (3600000 * offset));
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd.MM.yyyy"
			});
			var formattedDate = oDateFormat.format(edate);
			return formattedDate;
		} else {
			return "";
		}
	},

	formatNotes: function(vNotes) {
		return '(' + vNotes + ')';
	},

	formatPRMNum: function(vdesc, vmatnr) {
		return vdesc + ' (' + vmatnr + ')';

	},

	formatAcct: function(vname, vnr) {
		return vname + ' (' + vnr + ')';
	},

	formatSos: function(vcount) {
		return vcount + ' ' + 'Source' + '(s)';
	},

	formatDisplayCount: function(oTxt, oValue) {
		return oTxt + ' (' + oValue + ')';
	},

	formatSoSTotalPrice: function(total, nAmount, sCurrency) {
		var sysLang = sap.ui.getCore().getConfiguration().getLanguage();
		var oLocale = new sap.ui.core.Locale(sysLang);
		var currencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance(oLocale);
		var nFormattedAmount = currencyFormat.format(nAmount);
		var sAmountAndCurrency = nFormattedAmount + " " + sCurrency;
		return total + ' ' + sAmountAndCurrency;
		// var nFormattedAmount = sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(nAmount, sCurrency);
		// var sAmountAndCurrency = nFormattedAmount + " " + sCurrency;
		// return total + ' ' + sAmountAndCurrency;
	},

	formatLinkText: function(FixedvendorCheck) {
		if (FixedvendorCheck) {
			return true;
		} else {
			return false;
		}
	},
	formatSpace: function(value) {
		if (value) {
			return ' ';
		} else {
			return '';
		}
	},
	formatSupplierText: function(fixedV, desiredV) {

		if (fixedV) {
			return fixedV; // replace with i18
		} else if (desiredV) {
			return desiredV;
		}

	},

	formatSelectSupplier: function(fixedV, desiredV, supplyingvendorname) {
		if (fixedV) {
			if (supplyingvendorname) {
				return supplyingvendorname + " (" + fixedV + ")";
			} else {
				return fixedV;
			}
			// replace with i18
		} else if (desiredV) {
			if (supplyingvendorname) {
				return supplyingvendorname + " (" + desiredV + ")";
			} else {
				return desiredV;
			}
		}
	},

	formatBrackets: function(bracketsText) {
		return "(" + bracketsText;
	},

	formatBracketsEnd: function(AnyText) {
		return ")";
	},

	formatDisplayLinkOutOf: function(OutOf) {
		return '(' + OutOf + ' ';
	},

	formatDisplayLinkBracket: function(OutOf) {
		return ')';
	},
	formatSosInfoCtr: function(vInfrtxt, vInfrvalue, vCtrtxt, vCtrvalue) {
		if (vInfrvalue)
			return vInfrtxt + ' (' + vInfrvalue + ')';
		else
			return vCtrtxt + ' (' + vCtrvalue + ')';
	},

	formatDisplayBidder: function(vSupplier, vSupplierName, vAddress) {
		var newlin = "\n";
		return vSupplier + "\n" + vSupplierName + "\n" + vAddress;
	},
	formatPurOrg: function(vdesc, vmatnr) {
		if ((vmatnr === "" || vmatnr === undefined) && (vdesc === undefined || vmatnr === "")) {
			return;
		} else if (vdesc === undefined) {
			return ' (' + vmatnr + ')';
		} else if (vmatnr === undefined) {
			return vdesc;
		}
		return vdesc + ' (' + vmatnr + ')';
	}
};