/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* formatter */
sap.ui.define(["sap/ca/ui/model/format/AmountFormat",
	"sap/ui/core/format/DateFormat"
], function() {
	"use strict";

	return {
		/**
		 * Rounds the number unit value to 2 digits
		 *
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},
		quantity: function(value1, value2, value3) {

			return value1 + ":" + value2 + " " + value3;

		},
		totalText: function(value1) {
			return value1 + ":";
		},
		Supplier: function(fixedSupplier, prefferedSupplier) {
			if (fixedSupplier) {
				return fixedSupplier;

			} else {
				return prefferedSupplier;
			}
		},
		SourceOfSupply: function(infoRecord, agreementNumber, itemNumber) {

			if (infoRecord) {

				return this.getResourceBundle().getText("InfoRecord") + ":" + infoRecord;
			} else {
				return this.getResourceBundle().getText("agreementNumber") + "/" + this.getResourceBundle().getText("item") + ":" + agreementNumber +
					"/" + itemNumber;
			}

		},

		date: function(value) {
			if (value) {
				var Year = value.substr(0, 4);
				var Month = value.substr(4, 2);
				var date = value.substr(6, 2);
				return date + "." + Month + "." + Year;
			} else {
				return value;
			}
		},
		setTitle: function(value1) {
			if (value1) {
				return (this.getResourceBundle().getText("PurReqfor")) + " " + value1;
			} else {
				return (this.getResourceBundle().getText("PurReqfor"));
			}
		},
		netPrice: function(value1, value2) {

			return value1 + " " + value2;
		},
		ItemPrice: function(value1, value2, value3, value4) {
			var value5 = "per";

			return value1 + " " + value2 + " " + value5 + " " + value3 + " " + value4;
		},
		rating: function(value) {
			if (value) {
				return parseFloat(value);
			} else {
				return 0;
			}

		},
		setTotal: function(value) {
			var total = this.getResourceBundle().getText("totalMiniCart");
			return total + ": " + value;

		},

		tax: function(value) {
			if (value === 0) {
				return "Data is not maintained";
			} else {
				return value;
			}
		},

		totalValue: function(value) {
			if (value) {
				var num = parseFloat(value);
				var number = num.toFixed(2);
				return number;
			} else {
				return 0;
			}
		},

		convertInt: function(value) {
			if (value) {
				return parseInt(value);
			} else {
				return 0;
			}
		},
		imgnotfound: function(value) {
			if (value) {
				return value;
			} else {
				try {
					return this.getOwnerComponent().getManifest()["sap.platform.abap"].uri + "/images/dummyImg.png";
				} catch (e) {
					return "./images/dummyImg.png";
				}
			}
		},
		supplierImage: function(value) {
			if (value) {
				return value;
			} else {
				try {
					return this.getOwnerComponent().getManifest()["sap.platform.abap"].uri + "/images/Capture.JPG";
				} catch (e) {
					return "./images/Capture.JPG";
				}
			}

		},

		currency: function(value1, value2) {
			if (value1) {
				if (value2) {
					return value1 + " " + value2;
				}
			}
		},
		formatTotalCurrency: function(value1, value2) {
			var nFormattedAmount = sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(value1, value2);
			var sAmountAndCurrency = nFormattedAmount + " " + value2;
			return sAmountAndCurrency;
		},

		formatTotalValue: function(value1, value2) {
			var oFormatOptions = { style:      "standard",
                                   showMeasure: false};

			var oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance(oFormatOptions);
			var nFormattedAmount =  oCurrencyFormat.format(parseFloat(value1), value2);
			return (nFormattedAmount);			
		},

		formatCreatedDate: function(vDate) {
			if (vDate) {
				var sysLang = sap.ui.getCore().getConfiguration().getLanguage();
				var oLocale = new sap.ui.core.Locale(sysLang);
				var formattedDate = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium"
				}, oLocale).format(new Date(vDate),true);
				return formattedDate;
			} else {
				return "";
			}
		},

		reviewDate: function(value) {
			if (value) {
				var Year = value.substr(0, 4);
				var Month = value.substr(4, 2);
				var date = value.substr(6, 2);
				var hour = value.substr(8, 2);
				var mins = value.substr(10, 2);
				var completeDate = Year + "/" + Month + "/" + date + "," + hour + ":" + mins;
				// a=new Date("2015/12/12,12:53")
				completeDate = new Date(completeDate);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium"
				});
				return ": " + oDateFormat.format(completeDate);
			} else {
				return ": " + this.getResourceBundle().getText("dataNotMaintained");
			}

		},
		getGroupHeader: function(oGroup) {
			if (oGroup.key === "MANUFACTNAME") {
				oGroup.key = this.getResourceBundle().getText("Manufacturer");
			}
			if (oGroup.key === "VENDOR") {
				oGroup.key = this.getResourceBundle().getText("Supplier");
			}
			if (oGroup.key === "INTCATALOGNAME") {
				oGroup.key = this.getResourceBundle().getText("Catalog");
			}
			if (oGroup.key === "Z-Price Range") {
				oGroup.key = this.getResourceBundle().getText("PriceRange");
			}
			return new sap.m.GroupHeaderListItem({
				title: oGroup.key,
				upperCase: false
			});
		},
		formatMiniCart: function(value1, value2) {
			return value1 + ": " + value2;
		},
		formatMiniCartQuantity: function(value1, value2, value3) {
			return value1 + ": " + value2 + " " + value3;
		},
		formatWelcomeText: function(value1, value2) {
			return value1 + ",  " + value2;
		},
		formatPer: function(value1, value2, value3) {
			if (value2) {
				return value1 + " " + value2 + " " + value3;
			}
		},
		formatDeliveryDate: function(value1, value2) {
			if (value2) {
				value2 = value2.toDateString().substr(4);
				return value1 + ": " + value2;
			}
		},

		formatDeliveryDays: function(value) {
			if (value) {
				return this.getResourceBundle().getText("DeliveryDateText") + " " + value + " " + this.getResourceBundle().getText("Days");
			}
		},

		concat: function(vTeleNo, vExtNo) {
			return vTeleNo + " " + vExtNo;
		},

		formatEditDeleteLink: function(value) {
			if (value) {
				return true;
			} else {
				return false;
			}
		},
		reviewID: function(value) {
			if (value) {
				return value + ":";
			} else {
				return " : ";
			}
		},
		reviewText: function(value) {
			if (value) {
				value = " " + value;
				return value;
			} else {
				return " ";
			}
		},

		priceRange: function(value) {
			if (value === "X") {
				return this.getResourceBundle().getText("pricescale");
			}
		},

		pricerangelimit: function(value1, value2) {
			if (value2 > 0) {
				return value1 + " - " + value2;
			} else {
				return value1 + " " + this.getResourceBundle().getText("andAbove");
			}
		},

		appendCurrency: function(value1, value2) {
			return value1 + " " + value2;
		},
		formartOnMaterialVisibility: function(productType) {
			var isVisible = true;
			if (productType !== undefined) {
				if (productType == "2") {
					isVisible = false;
				}
			}
			return isVisible;
		},

		formartOnServiceVisibility: function(productType) {
			var isVisible = false;
			if (productType !== undefined) {
				if (productType == "2") {
					isVisible = true;
				}
			}
			return isVisible;
		},

		miniCartDateRangeFormartting: function(fromDate, toDate) {
			var finalDate = "";
			var sysLang = sap.ui.getCore().getConfiguration().getLanguage();
			var oLocale = new sap.ui.core.Locale(sysLang);

			if (fromDate != null && toDate != null) {
				var oFromDate = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium"
				}, oLocale).format(fromDate);

				var oToDate = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium"
				}, oLocale).format(toDate);

				finalDate = oFromDate + " - " + oToDate;
			}

			return finalDate;
		},
		deliveryDateFormartting: function(oDate) {
			var finalDate = "";
			var sysLang = sap.ui.getCore().getConfiguration().getLanguage();
			var oLocale = new sap.ui.core.Locale(sysLang);

			if (oDate != null) {
				var oFormattedDate = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium"
				}, oLocale).format(oDate);

				finalDate = oFormattedDate;
			}

			return finalDate;
		},
			formatNumberOfItems: function(value1){
			if(value1 === 1){
				return value1 + " " + this.getResourceBundle().getText("item");
			}else {
				return value1 + " " + this.getResourceBundle().getText("ITEMS");
			}
		}

	};

});