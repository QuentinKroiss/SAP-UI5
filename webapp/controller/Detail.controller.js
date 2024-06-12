sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "ui5/walkthrough/models/formatter",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, formatter, History, JSONModel) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Detail", {
        formatter: formatter, // Attach the formatter

        onInit: function () {
            // Initialize the view model only once during the controller's initialization
            var oViewModel = new JSONModel({
                showDetailedContent: false
            });
            this.getView().setModel(oViewModel, "view");
        
            // Select the InfoButton by default
            this.onInfoPress();
        },
        

        formatIncoterms: function (classification, location) {
            if (classification && location) {
                return classification + ", " + location;
            } else if (classification) {
                return classification;
            } else if (location) {
                return location;
            } else {
                return "";
            }
        },

        formatCashDiscount: function (days, percent) {
            if (percent !== undefined && percent !== null) {
                // Format the percent value to 2 decimal places and replace '.' with ','
                percent = parseFloat(percent).toFixed(2).replace('.', ',');
            }
            return days + " Tage, " + percent + " %";
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
        },

        onInfoPress: function () {
            var oModel = this.getView().getModel("view");
            oModel.setProperty("/showDetailedContent", true);
            oModel.setProperty("/showNoteContent", false);
        },

        onNotepadPress: function () {
            var oModel = this.getView().getModel("view");
            oModel.setProperty("/showDetailedContent", false);
            oModel.setProperty("/showNoteContent", true);
        }
    });
});
