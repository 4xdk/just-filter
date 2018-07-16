'use strict';

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({color: '#ff0000'}, function() {
		console.log('storage set');
	});


	

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
        	new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'www.just-eat.co.uk'}})
    	],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});

