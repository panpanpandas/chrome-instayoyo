var downloader = downloader || {};
var BUTTON_CSS = 'button_wrapper';
var BUTTON_PROFILE_CSS = 'profile_button_wrapper';
var IMG_SELECTOR = 'img';
var profileRows = 0;

downloader.setAnalytics = function() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-98026045-1', 'auto');
  ga('send', 'pageview');
};

downloader.createButtonElement = function(href, classAtr) {
	var button = document.createElement('a'); 
	button.setAttribute('class', classAtr);
	button.setAttribute('href', href);
	button.setAttribute('download', 'instagram.jpg');

	var buttonImg = document.createElement('img');
	buttonImg.setAttribute('src', downloader.settingIconUrl);
	button.appendChild(buttonImg);

	return button;
};

downloader.addButtonInHome = function() {
	var articles = document.querySelectorAll('article');

	for (i = 0; i < articles.length; i++) {
		var article = articles[i];
		var body = article.childNodes[1];
		var target = body.querySelector(IMG_SELECTOR) || body.querySelector('video'); // skip header
		if (!target) { // error handling
			continue;
		}

		var existed = article.querySelector('.' + BUTTON_CSS);
		if (existed) {
			if (existed.href != target.src) {
				existed.href = target.src; // src needs to be updated
			}

			continue;
		} 

		var buttonDiv = article.childNodes[2].childNodes[0];
		if (buttonDiv && buttonDiv.childNodes && buttonDiv.childNodes.length <= 2) {
			var buttonElement = downloader.createButtonElement(target.src, BUTTON_CSS);
			buttonDiv.append(buttonElement);
		}
	}
};

downloader.addButtonInProfile = function() {
	var article = document.querySelector('article');

	var grid = article.childNodes[1].childNodes[0];
	if (profileRows >= grid.childNodes.length) {
		return;
	}

	profileRows = grid.childNodes.length;

	// loop each row
	for (i = 0; i < grid.childNodes.length; i++) {
		var row = grid.childNodes[i];

		// deal with each item
		for(j = 0; j < row.childNodes.length; j++) {
			var item = row.childNodes[j];
			if(!item) {
				continue;
			}

			var target = item.querySelector(IMG_SELECTOR);
			if (!target) { // error handling
				continue;
			}

			var existed = item.querySelector('.' + BUTTON_PROFILE_CSS);
			if (existed) {
				if (existed.href != target.src) {
					existed.href = target.src;
				}

				continue;
			}

			var newDiv = document.createElement('div'); 
			newDiv.setAttribute('style', 'flex: 1 0 0%; margin-right: 3px');
			row.replaceChild(newDiv, row.childNodes[j]);

			var buttonElement = downloader.createButtonElement(target.src, BUTTON_PROFILE_CSS);
			newDiv.appendChild(item);
			newDiv.appendChild(buttonElement);
		}

	}
};

downloader.addButtons = function() {
	var pathname = document.location.pathname.split('/').filter(Boolean);
	if (pathname.length == 1) { // profile page like https://www.instagram.com/nasa/
		downloader.addButtonInProfile();
	} else if (pathname.length == 0) {
		downloader.addButtonInHome();
		profileRows = 0;
	}	
};

downloader.listenToChanges = function() {
	var target = document.querySelector('body');
	var observer = new MutationObserver(function(mutations) {
	    mutations.forEach(function(mutation) {
	        downloader.addButtons();
	    });
	});	 
	var config = {subtree: true, childList: false, attributes: true}
	 
	observer.observe(target, config);	
};

downloader.setAnalytics();
downloader.addButtons();
downloader.listenToChanges();

