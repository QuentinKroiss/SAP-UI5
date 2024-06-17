// ui5/walkthrough/model/formatter.js
sap.ui.define([], function () {
    "use strict";
    return {
        dateFormatter: function (date) {
            if (!date) {
                return "";
            }
            var oDate = new Date(date);
            var day = oDate.getDate();
            var month = oDate.getMonth() + 1; // Monate sind nullbasiert
            var year = oDate.getFullYear();

            return (day < 10 ? "0" + day : day) + "." +
                (month < 10 ? "0" + month : month) + "." +
                year;
        },
        fetchPriceOrderFormatter: function (purchaseOrder) {
            return new Promise((resolve, reject) => {
                // Access the view
                var oView = this.getView();

                // Access the OData model
                var oModel = oView.getModel();

                // Example: Read data from the OData service
                var sPath = "/A_PurchaseOrder('" + purchaseOrder + "')/to_PurchaseOrderItem";
                oModel.read(sPath, {
                    success: function (oData) {
                        // Process the returned data
                        let sum = 0;

                        oData.results.forEach(element => {
                            sum = parseFloat(element.NetPriceAmount * element.OrderQuantity) + sum

                        });
                        let formattedSum = parseFloat(sum.toFixed(2));
                        resolve(formattedSum);
                    },
                    error: function (oError) {
                        // Handle errors
                        console.error("Error reading data: ", oError);
                        reject(oError);
                    }
                });
            });

        }
    };
});