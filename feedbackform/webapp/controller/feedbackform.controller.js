sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/Device"],

  function (BaseController, JSONModel, Device) {
    "use strict";
    return BaseController.extend(
      "com.sal.feedbackform.controller.feedbackform",
      {
        onInit: function () {
          this.mainModel = this.getOwnerComponent().getModel();
          this.getView().byId("idRating").setSelectedIndex(null);
        },

        onSubmitPress: function () {
          // if (!this._validateMandatoryFields()) {

          //     return;
          // }
          var oRatingPayloadObj = this.fnGetRatingPayload(),
            oSuggestionPayloadObj = this.fnGetSuggestionPayload(),
            sRatingEntityPath = "/Rating",
            sSuggestionEntityPath = "/Suggestion";

          this.getView().setBusy(true);

          this.mainModel.create(sRatingEntityPath, oRatingPayloadObj, {
            success: function (oData, oResponse) {
              sap.m.MessageBox.success("Request Submitted Successfully.");
              this.getView().setBusy(false);
              this.getView().getModel().refresh();
              this.oRouter.navTo("detail", {
                parentMaterial: this.sParentID,
                layout: "TwoColumnsMidExpanded",
              });
            }.bind(this),
            error: function (oError) {
              this.getView().setBusy(false);
              sap.m.MessageBox.error(
                JSON.parse(
                  JSON.parse(oError.responseText).error.message.value
                ).error.message.value.split("]")[1]
              );
              this.getView().getModel().refresh();
            }.bind(this),
          });
        },

        fnGetRatingPayload: function () {
          return {
            employeeId: 12002024,
            moduleId: 1,
            masterSubModuleId: 60,
            rating: this.getView().byId("idRating").getSelectedIndex() === 0 ? 1 : this.getView().byId("idRating").getSelectedIndex(),
            questionId: 2,
            Source : "EP_Portlet"
          };
        },

        fnGetSuggestionPayload: function () {
          return {
            employeeId: 11,
            moduleId: 4,
            masterSubModuleId: 2,
            questionId: 3,
            suggestion: this.getView().byId("idSuggestion").getValue(),
            Source : "EP_Portlet"
          };
        },
      }
    );
  }
);
