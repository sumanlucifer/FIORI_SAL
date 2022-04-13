sap.ui.define([], function () {
    "use strict";
    return {
        changeIcon: function (sValue) {
            switch (sValue) {
                case 1:
                    return 'sap-icon://create-leave-request';
                    break;
                case 2:
                    return 'sap-icon://flight';
                    break;
                case 3:
                    return 'sap-icon://stethoscope';
                    break;
                case 4:
                    return 'sap-icon://loan';
                    break;
                case 5:
                    return 'sap-icon://business-card';
                    break;
                case 6:
                    return 'sap-icon://travel-expense';
                    break;
                case 7:
                    return 'sap-icon://business-card';
                    break;
                case 8:
                    return 'sap-icon://business-card';
                    break;
                case 9:
                    return 'sap-icon://business-card';
                    break;
                case 10:
                    return 'sap-icon://travel-expense';
                    break;
                case 11:
                    return 'sap-icon://business-card';
                    break;
                case 12:
                    return 'sap-icon://quality-issue';
                    break;
                case 13:
                    return 'sap-icon://quality-issue';
                    break;
                case 14:
                    return 'sap-icon://quality-issue';
                    break;
                case 15:
                    return 'sap-icon://quality-issue';
                    break;
                case 16:
                    return 'sap-icon://quality-issue';
                    break;
                case 17:
                    return 'sap-icon://quality-issue';
                    break;
                case 18:
                    return 'sap-icon://quality-issue';
                    break;
            }
        },

        viewFileNames: function (oData) {
            if (oData) {
                if (oData.fileContent.length > 0)
                    return true;
                else
                    return false;
            } else {
                return false;
            }
        },
        viewItemsFileUploader: function (oData) {
            if (oData) {
                if (oData.length > 0)
                    return false;
                else
                    return true;
            } else {
                return true;
            }
        },


        ticketStatusText: function (sValue) {
            switch (sValue) {
                case 'CANCELLED':
                    sValue = "CANCELLED";
                    break;
                case 'APPROVED':
                    sValue = "APPROVED";
                    break;
                case 'PENDING':
                    sValue = "PENDING";
                    break;
                case 'REJECTED':
                    sValue = "REJECTED";
                    break;
            }
            return sValue;
        },
        ticketStatus: function (sValue) {
            var returnStatus = "None";
            switch (sValue) {
                case 'CANCELLED':
                    returnStatus = "Error";
                    break;
                case 'REJECTED':
                    returnStatus = "Error";
                    break;
                case 'APPROVED':
                    returnStatus = "Success";
                    break;
                case 'PENDING':
                    returnStatus = "Warning";
                    break;
                default:
                    returnStatus = "None";
            }
            return returnStatus;
        },

        formatCostCenter: function (oValue) {
            console.log(oValue);
            return oValue.results[0].name_defaultValue;
        },

        handleNoData: function (sValue) {
            if (!sValue) {
                var sNoData = "NA";
                return sNoData;
            } else {
                return sValue;
            }
        },

        setIDCardManagerActionVisibility: function (sStatus, sWorkflowRequestId) {
            var bIsUserManager = this.getOwnerComponent().getModel("EmpInfoModel").getProperty("/IsUserManager");

            if (bIsUserManager && sStatus === "PENDING" && sWorkflowRequestId !== null) {
                return true;
            } else {
                return false;
            }
        }
    };
});