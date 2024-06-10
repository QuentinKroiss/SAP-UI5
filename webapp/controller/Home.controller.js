sap.ui.define([
    "./BaseController",
], function(Controller) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Home", {
        onInit: function() {
            var oRouter = this.getRouter();
            oRouter.attachRouteMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function(oEvent) {
            var sRouteName = oEvent.getParameter("name");

            if (sRouteName === "RouteHomeView") {
                // Load the master and detail pages
                this.getView().byId("overviewSplitApp").addMasterPage(sap.ui.view({
                    id: "masterPage",
                    viewName: "ui5.walkthrough.view.Master",
                    type: "XML"
                }));

                this.getView().byId("overviewSplitApp").addDetailPage(sap.ui.view({
                    id: "detailPage",
                    viewName: "ui5.walkthrough.view.Detail",
                    type: "XML"
                }));
            }
        }
    });
});
