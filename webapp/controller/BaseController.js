sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library"
], function (Controller, UIComponent, mobileLibrary) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.BaseController", {
      
        _oDetails : undefined,
        getRouter : function () {
            return UIComponent.getRouterFor(this);
        }

    });

});