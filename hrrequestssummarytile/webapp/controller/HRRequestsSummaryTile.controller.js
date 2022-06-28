sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sal.summarytiles.hrrequestssummarytile.controller.HRRequestsSummaryTile", {
            onInit: function () {
                this._bindView();
            },

            _bindView: function () {
                var requestForTeam = this.getOwnerComponent().getModel("EmpInfoModel").getData().IsUserManager.toString();
                this.getView().bindElement({
                    path: "/MasterModules(1)",
                    parameters: {
                        custom: {
                            "IsUserManager": requestForTeam
                        }
                    }   
                });
            }
        });
    });
