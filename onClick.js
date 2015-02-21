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
			callback();
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

chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    if(command == "save_page"){
    	//alert("save_page");
    	
    }else if(command == "delete_page"){
    	//alert("delete_page");
    }
});


