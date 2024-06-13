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
                orderItemCount: 0,
            });
            this.getView().setModel(oModel, "detailModel");
        },

        onTableUpdateFinished: function () {
            var oTable = this.byId("purchaseOrderTable");
            var aItems = oTable.getItems();
            var fTotal = 0;

            aItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext();
                var fOrderQuantity = parseFloat(oContext.getProperty("OrderQuantity").replace(/\./g, ''));
                var fNetPriceAmount = parseFloat(oContext.getProperty("NetPriceAmount"));
                var fSubtotal = fOrderQuantity * fNetPriceAmount;
                fTotal += isNaN(fSubtotal) ? 0 : fSubtotal;
            });

            var oPanel = this.byId("orderItemsPanel");
            var orderItemCount = aItems.length;
            oPanel.setHeaderText("Items (" + orderItemCount + ")");

            var oDetailModel = this.getView().getModel("detailModel");
            oDetailModel.setProperty("/totalSubtotal", this.formatTotalSubtotal(fTotal));
        },

        updateOrderItemCount: function() {
            var oList = this.getView().byId("purchaseOrderTable");
            var aOrderItems = oList.getItems();
            var orderItemCount = aOrderItems.length;
            this.getView().getModel("detailModel").setProperty("/orderItemCount", orderItemCount);
        },

        formatPricePerPiece: function(price) {
            price = price.replace('.', ',');
            price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return price;
        },

        calculateSubtotal: function(orderQuantity, netPriceAmount) {
            var fOrderQuantity = parseFloat(orderQuantity.replace(/\./g, ''));
            var fNetPriceAmount = parseFloat(netPriceAmount);
            var fSubtotal = fOrderQuantity * fNetPriceAmount;
            var formattedSubtotal = fSubtotal.toFixed(2); // Formatieren auf zwei Dezimalstellen
            // Das Dezimaltrennzeichen ersetzen
            formattedSubtotal = formattedSubtotal.replace('.', ',');
            // Tausenderstellen mit einem Punkt trennen
            formattedSubtotal = formattedSubtotal.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return formattedSubtotal;
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
                percent = parseFloat(percent).toFixed(2).replace('.', ',');
            }
            return days + " Tage, " + percent + " %";
        },

        // Funktion zur Ersetzung des Dezimaltrennzeichens und Trennung der Tausenderstellen
        replaceDecimalSeparatorAndThousandSeparator: function(value) {
            value = value.replace('.', ',');
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return value;
        },

        // Methode zur Formatierung des Gesamtsubtotals
        formatTotalSubtotal: function(totalSubtotal) {
            totalSubtotal = parseFloat(totalSubtotal).toFixed(2);
            totalSubtotal = this.replaceDecimalSeparatorAndThousandSeparator(totalSubtotal);
            return totalSubtotal;
        }
    });
});
