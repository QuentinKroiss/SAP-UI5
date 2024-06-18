sap.ui.define([
    'sap/m/MessageToast',
    "sap/ui/core/mvc/Controller"
], function (MessageToast, Controller) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.OrderItemDetail", {
        onInit: function () {
            var eventBus = sap.ui.getCore().getEventBus();
            // 1. ChannelName, 2. EventName, 3. Function to be executed, 4. Listener
            eventBus.subscribe("OrderDetailChannel", "onNavigateEvent", this.onDataReceived, this);
            var oView = this.getView();
            var oDataModel = new sap.ui.model.json.JSONModel();
            oView.setModel(oDataModel, "orderItemModel");
        },

        
        onDataReceived: function (channel, event, data) {
            // do something with the data (bind to model)

            //console.log(JSON.stringify(data));

            var oView = this.getView();

            // Access the OData model
            var oModel = oView.getModel();
            var oOrderItemModel = oView.getModel("orderItemModel");

            // Example: Read data from the OData service
            var sPath = "/A_PurchaseOrderItem(PurchaseOrder='" + data.purchaseOrder + "',PurchaseOrderItem='" + data.purchaseOrderItem + "')";
            oModel.read(sPath, {
                success: function (oData) {

                    //console.log(oData);
                    oOrderItemModel.setData(oData);
                    let subtotal = parseFloat(oData.OrderQuantity) * parseFloat(oData.NetPriceAmount);
                    oOrderItemModel.setProperty("/Subtotal", subtotal.toFixed(2).replace('.', ','));

                },
                error: function (oError) {
                    // Handle errors
                    console.error("Error reading data: ", oError);

                }
            });
        },
        onPressDetailBack: function () {
            this.getView().getParent().getParent().backDetail();
        },

        onPressDetailUp: function () {
            //console.log(this.getView().getModel("orderItemModel").oData.PurchaseOrder); 
            //console.log(this.getView().getModel("orderItemModel").oData.PurchaseOrderItem);
            let purchaseOrder = this.getView().getModel("orderItemModel").oData.PurchaseOrder;
            let purchaseOrderItem = parseInt(this.getView().getModel("orderItemModel").oData.PurchaseOrderItem) - 1;
            var oView = this.getView();

            // Access the OData model
            var oModel = oView.getModel();
            var oOrderItemModel = oView.getModel("orderItemModel");

            // Example: Read data from the OData service
            var sPath = "/A_PurchaseOrderItem(PurchaseOrder='" + purchaseOrder + "',PurchaseOrderItem='" + purchaseOrderItem + "')";
            oModel.read(sPath, {
                success: function (oData) {

                    //console.log(oData);
                    //console.log(oData.PurchaseOrderItem);
                    oOrderItemModel.setData(oData);
                    let subtotal = parseFloat(oData.OrderQuantity.replace(/\./g, '')) * parseFloat(oData.NetPriceAmount);
                    oOrderItemModel.setProperty("/Subtotal", subtotal.toFixed(2).replace('.', ','));


                },
                error: function (oError) {
                    // Handle errors
                    //console.error("Error reading data: ", oError);
                    MessageToast.show("Keine weiteren Einträge vorhanden");

                }
            });

        },
        onPressDetailDown: function () {

            let purchaseOrder = this.getView().getModel("orderItemModel").oData.PurchaseOrder;
            let purchaseOrderItem = parseInt(this.getView().getModel("orderItemModel").oData.PurchaseOrderItem) + 1;
            var oView = this.getView();

            // Access the OData model
            var oModel = oView.getModel();
            var oOrderItemModel = oView.getModel("orderItemModel");

            // Example: Read data from the OData service
            var sPath = "/A_PurchaseOrderItem(PurchaseOrder='" + purchaseOrder + "',PurchaseOrderItem='" + purchaseOrderItem + "')";
            oModel.read(sPath, {
                success: function (oData) {

                    oOrderItemModel.setData(oData);
                    let subtotal = parseFloat(oData.OrderQuantity) * parseFloat(oData.NetPriceAmount);
                    oOrderItemModel.setProperty("/Subtotal", subtotal.toFixed(2).replace('.', ','));

                },
                error: function (oError) {
                    // Handle errors
                    //console.error("Error reading data: ", oError);
                    MessageToast.show("Keine weiteren Einträge vorhanden");

                }
            });

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
        }


    });
});