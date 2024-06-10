// ui5/walkthrough/model/formatter.js
sap.ui.define([], function() {
    "use strict";
    return {
        dateFormatter: function(date) {
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
        }
    };
});