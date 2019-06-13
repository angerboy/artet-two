window.onload = () => {
	if(window.scrollY > 0) {
		animatePanel(3);
		animatePanel(4);
	}
}

var INNER_HEIGHT = window.innerHeight;

var positionIndicator = document.getElementById('position-indicator');
var style = getComputedStyle(positionIndicator);
const isMobile = style.display === 'none';

setRowHeights();

if(isMobile) {
	window.addEventListener('resize', () => {
		INNER_HEIGHT = window.innerHeight;
		setRowHeights();
	});
}

function setRowHeights() {
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
			plength = parseInt(pan.offsetHeight);
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

		const panelNumber = 1 + (Math.abs(slength) / step);
		animatePanel(panelNumber);
		animatePositionIndicator(panelNumber);

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
		var animationItems = document.getElementById('panel-' + panelNumber + '-animation-items');
		if(animationItems !== undefined && animationItems !== null) {
			animationItems.className = "animation-items visible";
		}
		if (panel !== undefined && panel !== null) {
			var animatedDivs = Array.from(panel.getElementsByClassName("animated"));
			animatedElements = animatedDivs
			if (animatedDivs !== undefined && animatedDivs !== null && animatedDivs.length > 0) {
				animatedDivs.forEach(function(div) {
					var animationClassName = idToAnimationClass[div.id];
					if(isMobile) {
						animationClassName += "-mobile";
					}
					div.className += " " + animationClassName;
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

	function isInViewport(element) {
		var rect = element.getBoundingClientRect();
		return ((rect.top - window.innerHeight) <= 0)
	}

	var isPanel3Visible = false;
	var isPanel4Visible = false;

	var panel3 = document.getElementById('panel-3-animation-items');
	var panel4 = document.getElementById('panel-4-animation-items');

	function animatePanelsIfVisible() {
		if(isInViewport(panel3)) {
			if(!isPanel3Visible) {
				isPanel3Visible = true;
				animatePanel(3);
			}
		}
		if(isInViewport(panel4)) {
			if(!isPanel4Visible) {
				isPanel4Visible = true;
				animatePanel(4);
			}
		}
	}

	function _swipe(obj) {
		obj.addEventListener('touchstart', function(e) {
			animatePanelsIfVisible();
		}, false);

		obj.addEventListener('touchmove', function(e) {
			animatePanelsIfVisible();
		}, false);

		obj.addEventListener('touchend', function(e) {
			animatePanelsIfVisible();
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