var homeBookmarkNode;

function checkHomeDirectory(homeDir){
	chrome.bookmarks.search(homeDir, function(bookmarktreenodes){
		bookmarkNodesLength = bookmarktreenodes.length;
		if(bookmarkNodesLength == 0){
			//create
			addHomeDirectory(homeDir);

		}
		else if(bookmarkNodesLength == 1){
			console.log("here" + bookmarktreenodes[0].title);
			homeBookmarkNode = bookmarktreenodes[0];
			console.log("Setting homeBookmarkNode");
			console.log("Preparing to open bookmark");
			pickRandomBookmark();
		}
		else if(bookmarkNodesLength > 1){
			//something wrong
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

	        console.log("Preparing to open bookmark");
			pickRandomBookmark();
    	});
}

function addFile(extensionsFolderId){
	chrome.bookmarks.create({'parentId': extensionsFolderId.id,
                               'title': 'Extensions doc'});
}

function pickRandomBookmark(){
	console.log(homeBookmarkNode.title);
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

document.addEventListener('DOMContentLoaded', function() {
	homeBookmarkNode = null;
	checkHomeDirectory("Saver bookmarks");
});


