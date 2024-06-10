sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "ui5/walkthrough/models/formatter",
    "sap/ui/model/json/JSONModel"
], function(Controller, UIComponent, formatter, JSONModel) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Master", {
        formatter: formatter,

        onInit: function() {
            var oModel = new JSONModel({
                orderCount: 0,
                selectedOrder: {}
            });
            this.getView().setModel(oModel, "orderModel");
        },

        onSearch: function(oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("AddressName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("CreatedByUser", sap.ui.model.FilterOperator.Contains, sQuery),
                    ],
                    and: false
                }));
            }
            var oList = this.getView().byId("PurchaseOrderList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        },

        updateOrderCount: function() {
            var oList = this.getView().byId("PurchaseOrderList");
            var oOrders = oList.getItems();
            var orderCount = oOrders.length;
            this.getView().getModel("orderModel").setProperty("/orderCount", orderCount);
        },

        onOrderPress: function(oEvent) {
            var oItem = oEvent.getSource().getSelectedItem();
            var oContext = oItem.getBindingContext();
            var oSelectedOrder = oContext.getObject();

            // Set the selected order to the model
            this.getView().getModel("orderModel").setProperty("/selectedOrder", oSelectedOrder);

            // Get the SplitApp and set the detail view content
            var oSplitApp = this.getView().getParent().getParent();
            var oDetailPage = oSplitApp.getDetailPages()[0];
            oDetailPage.bindElement({
                path: oContext.getPath()
            });
        }
    });
});
