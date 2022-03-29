'use strict';

chrome.contextMenus.create({
	id: 'boroscope_context',
	title: 'Right-Click Borescope',
	contexts: ['all']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	chrome.tabs.sendMessage(tab.id, {}, {frameId: info.frameId}, response => {});
});
