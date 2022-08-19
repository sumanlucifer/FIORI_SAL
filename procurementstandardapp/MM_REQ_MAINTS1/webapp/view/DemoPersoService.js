/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.DemoPersoService");

// Very simple page-context personalization
// persistence service, not for productive use!
ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.DemoPersoService = {

	oData: {
		_persoSchemaVersion: "1.0",
		aColumns: [
			{
				id: "purchaseRequisitionItemTable-Shopping",
				order: 0,
				text: "{i18n>PUR_REQ}",
				visible: true
      },
			{
				id: "purchaseRequisitionItemTable-Description",
				order: 1,
				text: "{i18n>DESC}",
				visible: true
      },
      /*{
        id: "purchaseRequisitionItemTable-Category",
        order: 2,
        text: "{i18n>CAT}",
        visible: false
      },*/
			{
				id: "purchaseRequisitionItemTable-Quantity",
				order: 3,
				text: "{i18n>QUANT}",
				visible: true
      },
			{
				id: "purchaseRequisitionItemTable-Price",
				order: 4,
				text: "{i18n>PRICE}",
				visible: true
      },
			{
				id: "purchaseRequisitionItemTable-Sources",
				order: 5,
				text: "{i18n>SOS}",
				visible: true
        },
			{
				id: "purchaseRequisitionItemTable-Notes",
				order: 5,
				text: "{i18n>NOTES}",
				visible: true
          },
			{
				id: "purchaseRequisitionItemTable-DeliveryDate",
				order: 5,
				text: "{i18n>DELIVDATE}",
				visible: true
          },
			{
				id: "purchaseRequisitionItemTable-Edit",
				order: 5,
				text: "{i18n>ED}",
				visible: true
            },

    ]
	},

	getPersData: function() {
		var oDeferred = new jQuery.Deferred();
		if (!this._oBundle) {
			this._oBundle = this.oData;
		}
		var oBundle = this._oBundle;
		oDeferred.resolve(oBundle);
		return oDeferred.promise();
	},

	setPersData: function(oBundle) {
		var oDeferred = new jQuery.Deferred();
		this._oBundle = oBundle;
		oDeferred.resolve();
		return oDeferred.promise();
	},

	resetPersData: function() {
		var oDeferred = new jQuery.Deferred();
		var oInitialData = {
			_persoSchemaVersion: "1.0",
			aColumns: [
				{
					id: "purchaseRequisitionItemTable-Shopping",
					order: 0,
					text: "{i18n>PR}",
					visible: true
                        },
				{
					id: "purchaseRequisitionItemTable-Description",
					order: 1,
					text: "{i18n>Dscp}",
					visible: true
                        },
                        /*{
                          id: "purchaseRequisitionItemTable-Category",
                          order: 2,
                          text: "{i18n>CATE}",
                          visible: false
                        },*/
				{
					id: "purchaseRequisitionItemTable-Quantity",
					order: 3,
					text: "{i18n>Quant}",
					visible: true
                        },
				{
					id: "purchaseRequisitionItemTable-Price",
					order: 4,
					text: "{i18n>PRICE}",
					visible: true
                        },
				{
					id: "purchaseRequisitionItemTable-Sources",
					order: 5,
					text: "{i18n>SOS}",
					visible: true
                          },
				{
					id: "purchaseRequisitionItemTable-Notes",
					order: 5,
					text: "{i18n>NOTES}",
					visible: true
                            },
				{
					id: "purchaseRequisitionItemTable-Edit",
					order: 5,
					text: "{i18n>ED}",
					visible: true
                              },
                                ]
		};

		//set personalization
		this._oBundle = oInitialData;

		//reset personalization, i.e. display table as defined
		//    this._oBundle = null;

		oDeferred.resolve();
		return oDeferred.promise();
	},

	//this caption callback will modify the TablePersoDialog' entry for the 'Weight' column
	//to 'Weight (Important!)', but will leave all other column names as they are.

	getGroup: function(oColumn) {
		if (oColumn.getId().indexOf('Shopping') != -1 ||
			oColumn.getId().indexOf('Quantity') != -1) {
			return "Primary Group";
		}
		return "Secondary Group";
	}
};