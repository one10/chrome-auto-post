// Auto-post values from file to a URL
// https://github.com/one10/chrome-auto-post
// based on chrome ext. examples

var defaultPause = 2000; // e.g., 3000 is 3 seconds

var postUrl = 'https://search.yahoo.com/search';
var valuesFilename = 'values.txt';
var min = 1;
var max = 5;
var current = min;
var i = 0;
var isRunning = 0;
var vals;

// just in case...
updateIcon();

// load values file
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = parseVals;
xhr.open("GET", chrome.extension.getURL(valuesFilename), true);
xhr.send(null);

// allow disabling the loop via icon click
chrome.browserAction.onClicked.addListener(toggleRunning);

// kick off perpetual visitUrl with the default interval
var interval = setInterval(visitUrl, defaultPause);

// helpers
function visitUrl() {
    if (isRunning == 1 && i >= vals.length) {
        isRunning = 0;
        alert("Done");
    }

    if (isRunning == 1) {
	    updateIcon();

	    var url = 'data:text/html;charset=utf8,';
	    function appendParameterToForm(key, value) {
	        var input = document.createElement('textarea');
	        input.setAttribute('name', key);
	        input.textContent = value;
	        form.appendChild(input);
	    }
	    var form = document.createElement('form');
	    form.method = 'POST';
	    form.action = postUrl;
        appendParameterToForm('q', vals[i]);

	    url += encodeURIComponent(form.outerHTML);
	    url += encodeURIComponent('<script>document.forms[0].submit();</script>');
	    chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.update(tab.id, {url: url});
        });
        i += 1;
    }
}

function toggleRunning() {
    isRunning = isRunning == 1 ? 0 : 1;
    updateIcon();
}

function updateIcon() {
    chrome.browserAction.setIcon({path:"images/icon" + current + ".png"});
    current = current == max ? min : current + 1;
}

function parseVals() { 
    if (xhr.readyState == 4) {
        if (xhr.responseText)
            vals = xhr.responseText.trim().split('\n');
        
        if (!xhr.responseText || !urlJson || urlJson.urls.length == 0) {
            alert("Error loading the URL JSON, extension not running");
            isRunning = 0;
        }
        else {
            isRunning = 1;
        }
    }
}
