var homeBookmarkNode;

function checkHomeDirectory(homeDir, callback){
	chrome.bookmarks.search(homeDir, function(bookmarktreenodes){
		var bookmarkNodesLength = bookmarktreenodes.length;
		if(bookmarkNodesLength == 0){
			addHomeDirectory(homeDir);
		}
		else if(bookmarkNodesLength == 1){
			homeBookmarkNode = bookmarktreenodes[0];
			console.log("Setting homeBookmarkNode");
			callback(); return;
		}
		else if(bookmarkNodesLength > 1){
			alert("There exists more than one home folder!");
			for(i = 0 ; i < bookmarktreenodes.length ; i++) {
				console.log("callback results: "+i + bookmarktreenodes[i].title);
			}
		}
	});
}


function addHomeDirectory(homeDir){
	chrome.bookmarks.create({'parentId': '2', 'title': homeDir},
		function(newHomeDir) {
			homeBookmarkNode = newHomeDir;
	        console.log("Saver added home folder: " + newHomeDir.title);
    	});
}

function addFile(extensionsFolderId){
	chrome.bookmarks.create({'parentId': extensionsFolderId.id,
                               'title': 'Extensions doc'});
}

function pickRandomBookmark(){
	chrome.bookmarks.getChildren(homeBookmarkNode.id, function(childBookmarks){
		if(childBookmarks.length == 0){
			alert("No more SAVER bookmarks. All done!");
			return;
		}
		var randPos = Math.floor((Math.random() * childBookmarks.length));
		openLink(childBookmarks[randPos]);
	});
}

function openLink(bookmarkToOpen){
	chrome.tabs.update(null, {url:bookmarkToOpen.url}, function(){
		console.log("Opened the link: " + bookmarkToOpen.url);
	});
}

chrome.browserAction.onClicked.addListener(function(tab) { 
	if(homeBookmarkNode == null){
		console.log("Home directory is not set! Setting home...");
		checkHomeDirectory("Saver bookmarks", function(){
			pickRandomBookmark();
		});
	}else{
		console.log("Preparing to open bookmark");
		pickRandomBookmark();
	}
});

chrome.runtime.onStartup.addListener(function(){
	console.log("Starting up and setting home directory");
	checkHomeDirectory("Saver bookmarks",null);
});

function bookmarkExists(url,callback){
	chrome.bookmarks.getChildren(homeBookmarkNode.id, function(childBookmarks){
		for(i = 0 ; i < childBookmarks.length ; i++){
			if(childBookmarks[i].url == url){
				callback(true,childBookmarks[i]); return;
			}
		}
		callback(false,null);
	});
}

//type: addTrue, addFalse, deleteTrue, deleteFalse
function makeToastr(type, msg){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {greeting: type, message: msg}, function(response) {
	    console.log(response.farewell);
	  });
	});
}

chrome.commands.onCommand.addListener(function(command) {
	checkHomeDirectory("Saver bookmarks",function(){
		console.log('Command:', command);
	    if(command == "save_page"){
	    	//alert("save_page");
	    	//get current page
	    	chrome.tabs.getSelected(null, function(tab) {
		        var tabUrl = tab.url;
		        var tabTitle = tab.title;
		        bookmarkExists(tabUrl,function(urlExists, bookmarkRef){
		        	if(!urlExists){
		        		chrome.bookmarks.create({parentId:homeBookmarkNode.id, title:tabTitle, url:tabUrl},
		        			function(){
		        				console.log("Added " + tabUrl + " to our bookmarks!");
		        				makeToastr("addTrue", tabUrl);
		        		});
		        	}else{
		        		//alert("URL: " + tabUrl +" already exists!");
		        		makeToastr("addFalse", tabUrl);
		        	}
		        });
		    });

    	//check if url is in bookmarks (find a way to check if 2 distinct urls are same in html content)
    	//if not in bookmars, add it.
    	//show toast or notification saying 'added'

	    }else if(command == "delete_page"){
	    	//alert("delete_page");
	    	//get current page
	    	chrome.tabs.getSelected(null, function(tab) {
		        var tabUrl = tab.url;
		        var tabTitle = tab.title;
		        bookmarkExists(tabUrl,function(urlExists, bookmarkRef){
		        	if(!urlExists){
		        		console.log("This page is not in our bookmarks!");
		        		makeToastr("deleteFalse", tabUrl);
		        	}else{
		        		chrome.bookmarks.remove(bookmarkRef.id,function(){
		        			console.log("Deleted page: " + tabUrl + " from bookmarks!");
		        			makeToastr("deleteTrue", tabUrl);
		        		});
		        	}
		        });
		    });
	    }
	});
    
});

