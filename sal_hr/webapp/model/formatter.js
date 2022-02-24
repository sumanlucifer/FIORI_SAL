sap.ui.define([], function() {
	"use strict";


	return {
			changeIcon: function(sValue) {
            debugger;
			// if (sValue === "Leaves") {
			 
            //     return 'sap-icon://create-leave-request';
			
			// } else if (sValue === "Business Trip") {
            //     return 'sap-icon://stethoscope';
			// } else if (sValue === "Health Insurance") {
            //     return 'sap-icon://flight';
			// } 
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
                case 13:
                return 'sap-icon://quality-issue';
                break;

            }    
		},
        ticketStatusText: function (sValue) {

            switch (sValue) {
            case 'CANCELLED':
            sValue = "Rejected";
            break;
            case 'APPROVED':
            sValue = "Approved";
            break;
            case 'PENDING':
            sValue = "Pending";
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
            }


	};


});