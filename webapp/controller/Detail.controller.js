sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "ui5/walkthrough/models/formatter",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast'
], function (Controller, UIComponent, formatter, History, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Detail", {
        formatter: formatter,

        onInit: function () {
            var oModel = new JSONModel({
                orderItemCount: 0,
            });
            this.getView().setModel(oModel, "detailModel");
            this._oSplitApp = this.byId("overviewSplitApp");
        },

        formatOrderQuantity: function (orderQuantity) {
            // Entferne alle Dezimalstellen
            var sanitizedQuantity = orderQuantity.split('.')[0];
            // Füge Tausendertrennzeichen hinzu
            var formattedQuantity = sanitizedQuantity.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return formattedQuantity;
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

            var oPanel = this.byId("orderItemsPanel");
            var orderItemCount = aItems.length;
            oPanel.setHeaderText("Items (" + orderItemCount + ")");

            var oDetailModel = this.getView().getModel("detailModel");
            oDetailModel.setProperty("/totalSubtotal", this.formatTotalSubtotal(fTotal));
        },

        updateOrderItemCount: function () {
            var oList = this.getView().byId("purchaseOrderTable");
            var aOrderItems = oList.getItems();
            var orderItemCount = aOrderItems.length;
            this.getView().getModel("detailModel").setProperty("/orderItemCount", orderItemCount);
        },

        formatPricePerPiece: function (price) {
            price = price.replace('.', ',');
            price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return price;
        },

        calculateSubtotal: function (orderQuantity, netPriceAmount) {
            var fOrderQuantity = parseFloat(orderQuantity);
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
        replaceDecimalSeparatorAndThousandSeparator: function (value) {
            value = value.replace('.', ',');
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return value;
        },

        // Methode zur Formatierung des Gesamtsubtotals
        formatTotalSubtotal: function (totalSubtotal) {
            totalSubtotal = parseFloat(totalSubtotal).toFixed(2);
            totalSubtotal = this.replaceDecimalSeparatorAndThousandSeparator(totalSubtotal);
            return totalSubtotal;
        },
        onNavToOrderItemDetail: function (oEvent) {

            let purchaseOrder = oEvent.getSource().mAggregations.customData[0].mProperties.value;
            let purchaseOrderItem = oEvent.getSource().mAggregations.customData[1].mProperties.value
            var eventBus = sap.ui.getCore().getEventBus();
            eventBus.publish("OrderDetailChannel", "onNavigateEvent", { purchaseOrder: purchaseOrder, purchaseOrderItem: purchaseOrderItem });
            this.getView().getParent().getParent().to("__xmlview3");

        },
        onPressAccept: function () {

            try {
                let purchaseOrderPath = this.getView().getBindingContext().sPath.substring(18);

                let purchaseOrderNumber = purchaseOrderPath.substring(0, purchaseOrderPath.length - 2);
                console.log(purchaseOrderNumber);
                let oHeaders = {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-Token": "Fetch"
                };
                let oURLParameters = {
                    "sap-client": "100",
                    PurchaseOrder: purchaseOrderNumber
                }
                this.getView().getModel().callFunction("/release", {
                    method: "POST",
                    urlParameters: oURLParameters,
                    headers: oHeaders,
                    success: jQuery.proxy(function () {
                        MessageToast.show("Bestellung erfolgreich angenommen");
                    }, this),
                    error: jQuery.proxy(function () {
                        console.log("Fehler")
                        MessageToast.show("Das hat leider nicht geklappt bitte nochmal versuchen");
                    }, this)
                });
            } catch (error) {
                MessageToast.show("Bitte wählen Sie eine Bestellung aus");
            }

        },
        onPressReject: function () {

            try{

                let purchaseOrderPath = this.getView().getBindingContext().sPath.substring(18);
                let purchaseOrderNumber = purchaseOrderPath.substring(0, purchaseOrderPath.length - 2);
                console.log(purchaseOrderNumber);
                let oHeaders = {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-Token": "Fetch"
                };
                let oURLParameters = {
                    "sap-client": "100",
                    PurchaseOrder: purchaseOrderNumber
                }
                this.getView().getModel().callFunction("/reject", {
                    method: "POST",
                    urlParameters: oURLParameters,
                    headers: oHeaders,
                    success: jQuery.proxy(function () {
                        MessageToast.show("Bestellung erfolgreich abgelehnt");
                    }, this),
                    error: jQuery.proxy(function () {
                        console.log("Fehler")
                        MessageToast.show("Das hat leider nicht geklappt bitte nochmal versuchen");
                    }, this)
                });

            }catch(error){
                MessageToast.show("Bitte wählen Sie eine Bestellung aus");
            }

        }
    });
});
