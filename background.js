'use strict';

chrome.runtime.onMessage.addListener((position, sender, sendResponse) => {
	chrome.storage.local.set({position});
	sendResponse({status: 'ok'});
});

chrome.contextMenus.create({
	id: 'boroscope_context',
	title: 'Right-Click Borescope',
	contexts: ['all']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	chrome.storage.local.get(["position"], ({ position }) => {
		if (typeof position === "undefined") {
			return;
		}
		// console.log('Position X: ' + position.x + '\nPosition Y: ' + position.y );
		chrome.tabs.sendMessage(tab.id, position, response => {});
	});
});
