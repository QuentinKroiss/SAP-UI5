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
                var fOrderQuantity = parseFloat(oContext.getProperty("OrderQuantity"));
                var fNetPriceAmount = parseFloat(oContext.getProperty("NetPriceAmount"));
                var fSubtotal = fOrderQuantity * fNetPriceAmount;
                fTotal += isNaN(fSubtotal) ? 0 : fSubtotal;
            });

            // Update the panel header text
            var oPanel = this.byId("orderItemsPanel");
            var orderItemCount = aItems.length;
            oPanel.setHeaderText("Items (" + orderItemCount + ")");

            // Update the total subtotal text in the model
            this.getView().getModel("detailModel").setProperty("/totalSubtotal", fTotal.toFixed(2));
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

        calculateSubtotal: function(orderQuantity, netPriceAmount) {
            var fOrderQuantity = parseFloat(orderQuantity);
            var fNetPriceAmount = parseFloat(netPriceAmount);
            var fSubtotal = fOrderQuantity * fNetPriceAmount;
            return isNaN(fSubtotal) ? "0.00" : fSubtotal.toFixed(2);
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
        },
        formatObjectHeaderAttributes: function(totalSubtotal) {
            return [{
                title: "Total Subtotal",
                text: totalSubtotal
            }];
        }

    });
});
