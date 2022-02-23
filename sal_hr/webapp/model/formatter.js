sap.ui.define([], function() {
	"use strict";


	return {
			changeIcon: function(sValue) {
           
			// if (sValue === "Leaves") {
			 
            //     return 'sap-icon://create-leave-request';
			
			// } else if (sValue === "Business Trip") {
            //     return 'sap-icon://stethoscope';
			// } else if (sValue === "Health Insurance") {
            //     return 'sap-icon://flight';
			// } 
            switch (sValue) {
                case 'Leave':
                return 'sap-icon://create-leave-request';
                break;
				case 'Business Trip':
                return 'sap-icon://flight';
                break;
                case 'Health Insurance':
                return 'sap-icon://stethoscope';
                break;
                case 'Loan and advance request':
                return 'sap-icon://loan';
                break;
                case 'Business Card Request':
                return 'sap-icon://business-card';
                break;
                case 'Airport Travel Pass':
                return 'sap-icon://travel-expense';
                break;
                case 'ID card replacement request':
                return 'sap-icon://business-card';
                break;
                case 'Apply for Jon vacancy':
                return 'sap-icon://business-card';
                break;
                case 'Bank Details':
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