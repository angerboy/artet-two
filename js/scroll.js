const idToAnimationClass = {
	'coup': 'slide-in-top-fast',
	'bottle': 'slide-in-top-slow',
	'highball-tonic': 'slide-in-left',
	'bottle-spritz': 'slide-in-right'
};

// Detect Scrolls/Swipes
(function() {
	"use strict";
	/*[pan and container CSS scrolls]*/
	var numRows = document.querySelectorAll('.row').length,
		scdir, hold = false;

	function _scrollY(obj) {
		var slength, plength, pan, step = 100,
			vh = window.innerHeight / 100,
			vmin = Math.min(window.innerHeight, window.innerWidth) / 100;
    
		if ((this !== undefined && this.id === 'content-container') || (obj !== undefined && obj.id === 'content-container')) {
			pan = this || obj;
			plength = parseInt(pan.offsetHeight / vh);
		}
    
		if (pan === undefined) {
			return;
		}
    
		plength = plength || parseInt(pan.offsetHeight / vmin);
		slength = parseInt(pan.style.transform.replace('translateY(', ''));
    
		if (scdir === 'up' && Math.abs(slength) < (plength - plength / numRows)) {
			slength = slength - step;
		} else if (scdir === 'down' && slength < 0) {
			slength = slength + step;
		} else if (scdir === 'top') {
			slength = 0;
		}

		const panelNumber = 1 + (Math.abs(slength) / 100);
		animatePanel(panelNumber);

		pan.style.transform = 'translateY(' + slength + 'vh)';
		pan.removeEventListener('wheel', _scrollY);

		setTimeout(function() {
			pan.addEventListener('wheel', _scrollY);
			hold = false;
		}, 1500);
	}

	var animatedElements = [];

	function animatePanel(panelNumber) {

		// remove animation classes to repeat animations
		animatedElements.forEach(function(element) {
			element.className = "animated";
		})

		animatedElements = [];

		var panel = document.getElementById('panel-' + panelNumber);
		if (panel !== undefined && panel !== null) {
			var animatedDivs = Array.from(panel.getElementsByClassName("animated"));
			animatedElements = animatedDivs
			if (animatedDivs !== undefined && animatedDivs !== null && animatedDivs.length > 0) {
				animatedDivs.forEach(function(div) {
					div.className += " " + idToAnimationClass[div.id];
				})
			}
		}
	}

	/*[swipe detection on touchscreen devices]*/
	function _swipe(obj) {
		var swdir,
			sX,
			sY,
			dX,
			dY,
			threshold = 100,
			/*[min distance traveled to be considered swipe]*/
			slack = 50,
			/*[max distance allowed at the same time in perpendicular direction]*/
			alT = 500,
			/*[max time allowed to travel that distance]*/
			elT, /*[elapsed time]*/
			stT; /*[start time]*/
		obj.addEventListener('touchstart', function(e) {
			var tchs = e.changedTouches[0];
			swdir = 'none';
			sX = tchs.pageX;
			sY = tchs.pageY;
			stT = new Date().getTime();
			//e.preventDefault();
		}, false);

		obj.addEventListener('touchmove', function(e) {
			e.preventDefault(); /*[prevent scrolling when inside DIV]*/
		}, false);

		obj.addEventListener('touchend', function(e) {
			var tchs = e.changedTouches[0];
			dX = tchs.pageX - sX;
			dY = tchs.pageY - sY;
			elT = new Date().getTime() - stT;
			if (elT <= alT) {
				if (Math.abs(dX) >= threshold && Math.abs(dY) <= slack) {
					swdir = (dX < 0) ? 'left' : 'right';
				} else if (Math.abs(dY) >= threshold && Math.abs(dX) <= slack) {
					swdir = (dY < 0) ? 'up' : 'down';
				}
				if (obj.id === 'content-container') {
					if (swdir === 'up') {
						scdir = swdir;
						_scrollY(obj);
					} else if (swdir === 'down' && obj.style.transform !== 'translateY(0)') {
						scdir = swdir;
						_scrollY(obj);

					}
					e.stopPropagation();
				}
			}
		}, false);
	}

	var container = document.getElementById('content-container');
	container.style.transform = 'translateY(0)';

	container.addEventListener('wheel', function(e) {
		if (e.deltaY < 0) {
			scdir = 'down';
		}
		if (e.deltaY > 0) {
			scdir = 'up';
		}
		e.stopPropagation();
	});

	container.addEventListener('wheel', _scrollY);
	_swipe(container);

})();