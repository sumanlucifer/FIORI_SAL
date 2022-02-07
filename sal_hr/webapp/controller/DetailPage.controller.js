// sap.ui.define([
//     "./BaseController",
//     "sap/ui/core/mvc/Controller"
// ],
   
//     function (BaseController,Controller) {
//         "use strict";
//         return BaseController.extend("com.sal.salhr.controller.DetailPage", {
          
//             onInit: function () {

//                 this.oRouter = this.getRouter();
//             this.oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

//             },  
//             _onObjectMatched: function (oEvent) {
//                 debugger;
//                 this.sParentID = oEvent.getParameter("arguments").parentMaterial;
//                 var sLayout = oEvent.getParameter("arguments").layout;
//                 // if (sLayout == 'TwoColumnsMidExpanded') {
//                 //     this.byId("idViewBOQListButton").setPressed(false);
//                 //     this.getViewModel("objectViewModel").setProperty("/sViewBOQButtonName", "View BOQ List");
//                 // }
//                 // this.getView().getModel().setProperty("/busy", false);
//                 this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
//                 this._bindView("/MasterSubModules" + this.sParentID);
//                 // this._filterPCListTable(this.UserEmail);
//             },

//             _bindView: function (sObjectPath) {
//                 var objectViewModel = this.getViewModel("objectViewModel");
//                 var that = this;
//             //    var sTickets = sObjectPath + "/tickets";
//                 this.getOwnerComponent().getModel().read(sObjectPath,{
//                  success:function(oData,oResponse){
//                      var s = oResponse;
//                  },
//                  error:function(){

//                  }
//                 });



//             },



//             onPressTicketItem: function (oEvent) {

//                 // var supplierPath = oEvent.getSource().getBindingContext("products").getPath(),

//                 //     supplier = supplierPath.split("/").slice(-1).pop();

//                 this.oRouter.navTo("detailDetail", { layout: fioriLibrary.LayoutType.ThreeColumnsMidExpanded });
//             },
//             onPressRaiseRequest:function(){
//                 this.oRouter.navTo("RaiseRequest")
//             }

//         });
//     });        

sap.ui.define([ 
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],

    function (BaseController, Controller,JSONModel) {
        "use strict";
        return BaseController.extend("com.sal.salhr.controller.DetailPage", {

            onInit: function () {

                this.oRouter = this.getRouter();
                this.oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

            },
            _onObjectMatched: function (oEvent) {
                debugger;
                this.sParentID = oEvent.getParameter("arguments").parentMaterial;
                var sLayout = oEvent.getParameter("arguments").layout;
                // if (sLayout == 'TwoColumnsMidExpanded') {
                //     this.byId("idViewBOQListButton").setPressed(false);
                //     this.getViewModel("objectViewModel").setProperty("/sViewBOQButtonName", "View BOQ List");
                // }
                // this.getView().getModel().setProperty("/busy", false);
                this.getView().getModel("layoutModel").setProperty("/layout", sLayout);
                this._bindView();
                // this._filterPCListTable(this.UserEmail);
            },

            _bindView: function () {
                var objectViewModel = this.getViewModel("objectViewModel");
                var that = this;
                var oComponentModel = this.getComponentModel();
                //    var sTickets = sObjectPath + "/tickets";
                var sKey = oComponentModel.createKey("/MasterSubModules", {
                    ID: this.sParentID
                });

                this.getView().bindElement({
                    path: sKey
                });

                
            },
            

            onPressTicketItem: function (oEvent) {

                // var supplierPath = oEvent.getSource().getBindingContext("products").getPath(),

                //     supplier = supplierPath.split("/").slice(-1).pop();

                this.oRouter.navTo("detailDetail", { layout: fioriLibrary.LayoutType.ThreeColumnsMidExpanded });
            },
            onPressRaiseRequest: function () {
                this.oRouter.navTo("RaiseRequest",{
                    parentMaterial: this.sParentID,
                    layout: "EndColumnFullScreen"
                })
            }

        });
    });        
