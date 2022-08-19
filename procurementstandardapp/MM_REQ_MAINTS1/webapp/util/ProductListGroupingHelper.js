/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("ui.s2p.mm.requisition.maintain.s1.util.ProductListGroupingHelper");

sap.ui.base.Object.extend("ui.s2p.mm.requisition.maintain.s1.util.ProductListGroupingHelper", {
    _oResourceBundle : null,
    _oTableOperations : null,
    _oView : null,
    _oGroupDialog : null,

    constructor : function(oView) {
        var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(oView));
        this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
        this._oView = oView;
    },

    onPressCart: function(oEvent) {
		this.oEventSrc = oEvent.getSource();
		this.oModel.read("/I_Purchaserequisition_Wd(PurchaseRequisition='',PurReqnDraftUUID=guid'" + this.getAppkey() + "')/to_Item", {
			success: jQuery.proxy(this.handlePopoverCart, this)
		});

	},
	handlePopoverCart: function(data) {
		var oJSModelCart = new sap.ui.model.json.JSONModel(data);
		if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("ui.s2p.mm.requisition.maintain.s1.view.PopoverCart", this);
			this.getView().addDependent(this._oPopover);
		}
		this._oPopover.setModel(oJSModelCart);
		this._oPopover.setContentHeight("auto");
		this._oPopover.openBy(this.oEventSrc);
		this.totalPrice(data);
	}

});