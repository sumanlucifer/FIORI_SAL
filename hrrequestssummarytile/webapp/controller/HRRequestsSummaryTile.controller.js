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
                this.getView().bindElement({
                    path: "/MasterModules(1)",
                    parameters: {
                        custom: {
                            "IsUserManager": "true"
                        }
                    }   
                });
            }
        });
    });
