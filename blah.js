
function HARRISON(justin){
	 chrome.bookmarks.create({'parentId': '1',
                               'title': 'Extension bookmarks'},
                              function(newFolder) {
        console.log("added folder: " + newFolder.title);
        justin(newFolder);
      });
}

function MICHAEL(extensionsFolderId){

chrome.bookmarks.create({'parentId': extensionsFolderId.id,
                               'title': 'Extensions doc',
                               'url': 'http://code.google.com/chrome/extensions'});

}

document.addEventListener('DOMContentLoaded', function() {
  HARRISON(MICHAEL);	
  
});