sap.ui.define([], function() {
	"use strict";


	return {
			changeIcon: function(sValue) {
            debugger;
			if (sValue === "Leaves") {
			 
                return 'sap-icon://create-leave-request';
			
			} else if (sValue === "Business Trip") {
                return 'sap-icon://stethoscope';
			} else if (sValue === "Health Insurance") {
                return 'sap-icon://flight';
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