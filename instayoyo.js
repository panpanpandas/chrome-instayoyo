var settings = document.createElement("script");
settings.innerHTML = 'var downloader = downloader || {};\n';
settings.innerHTML += 'downloader.settingIconUrl ="' + chrome.extension.getURL("download.png") + '"';

var downloader = document.createElement('script');
downloader.src = chrome.extension.getURL('downloader.js');

(document.head || document.documentElement).appendChild(settings);
(document.head || document.documentElement).appendChild(downloader);