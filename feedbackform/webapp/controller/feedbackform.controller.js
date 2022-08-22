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
          Promise.allSettled([

            this.callAPIServiceInstance(sRatingEntityPath, oRatingPayloadObj),
            this.callAPIServiceInstance(sSuggestionEntityPath, oSuggestionPayloadObj)
        ]).then(this.PromiseResponse.bind(this)).catch(function (error) {}.bind(this));

        //   this.mainModel.create(sRatingEntityPath, oRatingPayloadObj, {
        //     success: function (oData, oResponse) {
        //       sap.m.MessageBox.success("Thank You for Your Feedback.");
        //       this.getView().setBusy(false);
        //       this.getView().getModel().refresh();
        //       this.oRouter.navTo("detail", {
        //         parentMaterial: this.sParentID,
        //         layout: "TwoColumnsMidExpanded",
        //       });
        //     }.bind(this),
        //     error: function (oError) {
        //       this.getView().setBusy(false);
        //       sap.m.MessageBox.error(
        //         JSON.parse(
        //           JSON.parse(oError.responseText).error.message.value
        //         ).error.message.value.split("]")[1]
        //       );
        //       this.getView().getModel().refresh();
        //     }.bind(this),
        //   });
        },


        callAPIServiceInstance: function (path, oPayload) {

			return new Promise(
				function (resolve, reject) {
                    this.mainModel.create(path, oPayload, {
						success: function (oData) {
							resolve(oData);
						},
						error: function (oResult) {
							reject(oResult);

						}
					});
				}.bind(this));
		},
        PromiseResponse : function(aValues)
        {
            this.getView().setBusy(false);
            sap.m.MessageBox.success("Thank You for Your Feedback.");
            this.getView().byId("idRating").setSelectedIndex(null);
            this.getView().byId("idSuggestion").setValue("");
        },
        fnGetRatingPayload: function () {
         var  sEmployeeID = this.getOwnerComponent().getModel("EmpInfoModel").getData().userId;

          return {
            employeeId: sEmployeeID,
            moduleId: 1,
            masterSubModuleId: 60,
            rating: this.getView().byId("idRating").getSelectedIndex() === 0 ? 1 : this.getView().byId("idRating").getSelectedIndex(),
            questionId: 2
         
          };
        },

        fnGetSuggestionPayload: function () {
            var  sEmployeeID = this.getOwnerComponent().getModel("EmpInfoModel").getData().userId;
          return {
            employeeId: sEmployeeID,
            moduleId: 4,
            masterSubModuleId: 2,
            questionId: 3,
            suggestion: this.getView().byId("idSuggestion").getValue()
          
          };
        },
      }
    );
  }
);
