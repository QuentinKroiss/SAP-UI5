sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/json/JSONModel"
 ], function(Controller, MessageToast, UIComponent, ResourceModel, JSONModel){
    "use strict";
 
    return Controller.extend("ui5.walkthrough.controller.StartScreen", {
        onInit: function() {

            // set i18n model on view
			const i18nModel = new ResourceModel({
				bundleName: "ui5.walkthrough.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");
        },

        onPress: function() {
            UIComponent.getRouterFor(this).navTo("RouteHomeView");
        }

    });
 });