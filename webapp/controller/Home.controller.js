sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library"
], function(Controller, UIComponent, mobileLibrary) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Home", {
        
        _oDetails : undefined,
        getRouter : function () {
            return UIComponent.getRouterFor(this);
        },
        
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
        },
        onRouteFromDetail: function(purchaseOrder, purchaseOrderItem) {
            this.getSplitAppObj().to("__xmlview3");
            console.log("Function test_function called with parameters: purchaseOrder=" + purchaseOrder + ", purchaseOrderItem=" + purchaseOrderItem);
        },

        getSplitAppObj: function () {
			var result = this.byId("overviewSplitApp");
			if (!result) {
				console.log("SplitApp object can't be found");
			}
			return result;
		}
    });
});
