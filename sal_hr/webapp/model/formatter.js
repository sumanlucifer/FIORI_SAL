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
        
        addDesc: function (sValue) {
            switch (sValue) {
                case 1:
                    return 'Create, edit or withdraw leave application';
                    break;
                case 2:
                    return 'Create, edit or withdraw request for business trip requests with required details';
                    break;
                case 3:
                    return 'Raise a request to add a health insurance dependant';
                    break;
                case 4:
                    return 'Create, edit or withdraw request for loan advance';
                    break;
                case 5:
                    return 'Create or withdraw request for business card ';
                    break;
                case 6:
                    return 'Create, edit or withdraw request for airport pass';
                    break;
                case 7:
                    return 'Create a request to update the Id card details';
                    break;
                case 8:
                    return 'Apply for job vacany';
                    break;
                case 9:
                    return 'Performance Management module';
                    break;
                case 10:
                    return 'Create a request for additional payment';
                    break;
                case 11:
                    return 'Raise a request to download Salary certificate or Introductory letter';
                    break;
                case 12:
                    return 'Create a request to HR for disciplinary action against subordinate';
                    break;
                case 13:
                    return 'Create or withdraw Bank account change';
                    break;
                case 14:
                    return 'Create a request to HR for Salary Increment of subordinate';
                    break;
                case 15:
                    return 'Create a request to HR for Promotion of subordinate';
                    break;
                case 16:
                    return 'Create a request to HR for Transfer of subordinate';
                    break;
                case 17:
                    return 'Create a request to HR for Termination of subordinate';
                    break;
                case 18:
                    return 'Learning module';
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

        setApproveRejectManagerActionVisibility: function (sStatus, sWorkflowRequestId) {
            var bIsUserManager = this.getOwnerComponent().getModel("EmpInfoModel").getProperty("/IsUserManager");

            if (bIsUserManager && sStatus === "PENDING" && sWorkflowRequestId !== null) {
                return true;
            } else {
                return false;
            }
        }
    };
});