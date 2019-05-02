var INNER_HEIGHT = window.innerHeight;

console.log("on load window.innerHeight: ", INNER_HEIGHT );
setRowHeights();

window.addEventListener('resize', () => {
	INNER_HEIGHT = window.innerHeight;
	console.log("resize window.innerHeight: ", INNER_HEIGHT );
	setRowHeights();
});

function setRowHeights(height) {
	var rows = Array.from(document.getElementsByClassName('row'));
	rows.forEach(function(row) {
		row.style.height = INNER_HEIGHT + "px";
	});
}

const idToAnimationClass = {
	'coup': 'slide-in-left',
	'lemon': 'slide-in-left',
	'bottle': 'slide-in-right',
	'highball-tonic': 'slide-in-left',
	'bottle-spritz': 'slide-in-right'
};

var positionIndicator = document.getElementById('position-indicator');

// Detect Scrolls/Swipes
(function() {
	"use strict";
	/*[pan and container CSS scrolls]*/
	var numRows = document.querySelectorAll('.row').length,
		scdir, hold = false;

	function _scrollY(obj) {
		var slength, plength, pan, step = INNER_HEIGHT,
			vh = INNER_HEIGHT / 100,
			vmin = Math.min(window.innerHeight, window.innerWidth) / 100;
    
		if ((this !== undefined && this.id === 'content-container') || (obj !== undefined && obj.id === 'content-container')) {
			pan = this || obj;
			console.log("offsetHeight: ", pan.offsetHeight);
			plength = parseInt(pan.offsetHeight);
		}
    
		if (pan === undefined) {
			return;
		}

		console.log("vmin: ", vmin);
		console.log("pan.offsetHeight: ", pan.offsetHeight);
		console.log("vh: ", vh);
    
		plength = plength || parseInt(pan.offsetHeight / vmin);
		slength = parseInt(pan.style.transform.replace('translateY(', ''));
    
		if (scdir === 'up' && Math.abs(slength) < (plength - plength / numRows)) {
			slength = slength - step;
		} else if (scdir === 'down' && slength < 0) {
			slength = slength + step;
		} else if (scdir === 'top') {
			slength = 0;
		}

		const panelNumber = 1 + (Math.abs(slength) / step);
		animatePanel(panelNumber);
		animatePositionIndicator(panelNumber);

		console.log("slength: ", slength);
		console.log("plength: ", plength);

		pan.style.transform = 'translateY(' + slength + 'px)';
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
			element.className = "animated rotated";
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

	const panelNumberToPositionIndicatorClassMap = {
		1: 'visible',
		2: 'hidden',
		3: 'visible',
		4: 'visible',
		5: 'hidden',
		6: 'hidden',
		7: 'visible'
	}

	const panelNumberToPositionIndicatorBGImageMap = {
		1: 'assets/PNG/2x/position-indicator-1@2x.png',
		2: 'hidden',
		3: 'assets/PNG/2x/position-indicator-2@2x.png',
		4: 'assets/PNG/2x/position-indicator-3@2x.png',
		5: 'hidden',
		6: 'hidden',
		7: 'assets/PNG/2x/position-indicator-4@2x.png'
	}

	function animatePositionIndicator(panelNumber) {
		positionIndicator.className = "position-indicator";
		positionIndicator.className += " " +  panelNumberToPositionIndicatorClassMap[panelNumber];
		const image = panelNumberToPositionIndicatorBGImageMap[panelNumber];
		if(image !== 'hidden') {
			const url = 'url(' + image + ')';
			positionIndicator.style.backgroundImage = url;
		}
	}

	/*[swipe detection on touchscreen devices]*/
	function _swipe(obj) {
		var swdir,
			sX,
			sY,
			dX,
			dY,
			threshold = 10,
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
			e.preventDefault();
		}, false);

		obj.addEventListener('touchmove', function(e) {
			e.preventDefault(); /*[prevent scrolling when inside DIV]*/
		}, { passive: false });

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
						scdir = swdir
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