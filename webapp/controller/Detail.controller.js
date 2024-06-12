sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "ui5/walkthrough/models/formatter",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, formatter, History, JSONModel) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Detail", {
        formatter: formatter,

        onInit: function() {
            var oModel = new JSONModel({
                orderItemCount: 0
            });
            this.getView().setModel(oModel, "detailModel");
        },

        updateOrderItemCount: function() {
            var oList = this.getView().byId("purchaseOrderTable");
            var aOrderItems = oList.getItems();
            var orderItemCount = aOrderItems.length;
            this.getView().getModel("detailModel").setProperty("/orderItemCount", orderItemCount);
        },

        formatPricePerPiece: function(price) {
            // Das Dezimaltrennzeichen ersetzen
            price = price.replace('.', ',');
            // Tausenderstellen mit einem Punkt trennen
            price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return price;
        },        

        calculateSubtotal: function(quantity, price) {
            var subtotal = quantity * price;
            // Den Wert auf zwei Nachkommastellen begrenzen und das Dezimaltrennzeichen ersetzen
            subtotal = subtotal.toFixed(2).replace('.', ',');
            // Tausenderstellen mit einem Punkt trennen
            subtotal = subtotal.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return subtotal;
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
        }

    });
});
