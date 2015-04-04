
toastr.options.timeOut = 2000; // 1.5s

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
	    console.log(sender.tab ?
	                "from a content script:" + sender.tab.url :
	                "from the extension");
	    if( request.greeting == "addTrue" ){
	    	toastr.success("Successfully saved this page to SAVER!", "SAVER");
	      	sendResponse({farewell: "goodbye"});
	    }
	    else if( request.greeting == "addFalse" ){
	    	toastr.warning("This page has already been added!" , "SAVER");
	    	sendResponse({farewell: "goodbye"});
	    }
	    else if( request.greeting == "deleteTrue" ){
	    	toastr.info("This page has successfully deleted!" , "SAVER");
	    	sendResponse({farewell: "goodbye"});
	    }
	    else if( request.greeting == "deleteFalse" ){
	    	toastr.warning("This wasn't in your SAVER list!" , "SAVER");
	    	sendResponse({farewell: "goodbye"});
	    }
});
