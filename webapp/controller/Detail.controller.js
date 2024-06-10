sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
], function (Controller, History) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Detail", {

        onInit: function () {
            this._oDetails = this.getView();
            var oRouter = this.getRouter();
            if(oRouter)
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sOrderId = oEvent.getParameter("arguments").orderId;
            this.getView().bindElement({
                path: "/A_PurchaseOrder('" + sOrderId + "')"
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("StartScreenView", {}, true);
            }
        }
    });
});
