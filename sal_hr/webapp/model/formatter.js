sap.ui.define([], function() {
	"use strict";


	return {
			changeIcon: function(sValue) {
            debugger;
			if (sValue === "Leave") {
			 
                return 'sap-icon://create-leave-request';
			
			} else if (sValue === "Business Trip") {
                return 'sap-icon://stethoscope';
			} else if (sValue === "Health Insurance") {
                return 'sap-icon://flight';
			} 
				
		}


	};


});