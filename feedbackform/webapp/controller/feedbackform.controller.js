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
            oComplainPayloadObj = this.fnGetComplainPayload(),
            sRatingEntityPath = "/Rating",
            sSuggestionEntityPath = "/Suggestion",
            sComplainEntityPath = "/Answer";

          this.getView().setBusy(true);
          Promise.allSettled([

            this.callAPIServiceInstance(sRatingEntityPath, oRatingPayloadObj),
            this.callAPIServiceInstance(sSuggestionEntityPath, oSuggestionPayloadObj),
            this.callAPIServiceInstance(sComplainEntityPath, oComplainPayloadObj)
        ]).then(this.PromiseResponse.bind(this)).catch(function (error) {}.bind(this));

      
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
            questionId: 2,
            source : "EP_PORTLET"
         
          };
        },

        fnGetSuggestionPayload: function () {
            var  sEmployeeID = this.getOwnerComponent().getModel("EmpInfoModel").getData().userId;
          return {
            employeeId: sEmployeeID,
            moduleId: 4,
            masterSubModuleId: 2,
            questionId: 3,
            suggestion: this.getView().byId("idSuggestion").getValue(),
            source : "EP_PORTLET"
          
          };
        },

        fnGetComplainPayload :  function()
        {
            var  sEmployeeID = this.getOwnerComponent().getModel("EmpInfoModel").getData().userId;
            return {
              employeeId: sEmployeeID,
              moduleId: 4,
              masterSubModuleId: 2,
              questionId: 5,
              answerText: this.getView().byId("idComplains").getValue(),
              source : "EP_PORTLET"
            
            };
        }
      }
    );
  }
);
