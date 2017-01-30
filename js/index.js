/*jshint browser: true, esversion: 6*/
/* global $ */
var ring = new Audio('https://a.clyp.it/j4hjat4o.mp3');
var percent = 1;
$(document).ready(function () {
	var timerCount;
	var sessChanged = false;
	var breakChanged = false;
	var active = false;
	var mode = $('#timerLabel').text();
	var timeLeft = $('#timer').text();
	var sessionLength = $('#sessionValue').text();
	var breakLength = $('#breakValue').text();
	//Session Length: Minus Button
	$('#sessionMinus').click(function () {
		//Only allow changes when not running,
		//or on break
		if (!active || $('#timerLabel').text() == 'Break Time Remaining:') {
			var sessionLength = $('#sessionValue').text();
			if (sessionLength > 1) {
				sessionLength--;
				sessChanged = true;
				$('#sessionValue').text(sessionLength);
			}
		}
	});
	//Session Length: Plus Button
	$('#sessionPlus').click(function () {
		//Only allow changes when not running,
		//or on break
		if (!active || $('#timerLabel').text() == 'Break Time Remaining:') {
			var sessionLength = $('#sessionValue').text();
			sessionLength++;
			sessChanged = true;
			$('#sessionValue').text(sessionLength);
		}
	});
	//Break Length: Minus Button
	$('#breakMinus').click(function () {
		//Only allow changes when not running,
		//or in session (not on break)
		if (!active || $('#timerLabel').text() == 'Session Time Remaining:') {
			var breakLength = $('#breakValue').text();
			if (breakLength > 1) {
				breakLength--;
				breakChanged = true;
				$('#breakValue').text(breakLength);
			}
		}
	});
	//Break Length: Plus Button
	$('#breakPlus').click(function () {
		//Only allow changes when not running,
		//or in session (not on break)
		if (!active || $('#timerLabel').text() == 'Session Time Remaining:') {
			var breakLength = $('#breakValue').text();
			breakLength++;
			breakChanged = true;
			$('#breakValue').text(breakLength);
		}
	});
	//Timer: Start/Stop Button
	$('.clock').click(function () {
		mode = $('#timerLabel').text();
		timeLeft = $('#timer').text();
		sessionLength = $('#sessionValue').text();
		breakLength = $('#breakValue').text();
		//If clock is not running, determine the mode,
		//adjust time as necessary, and start it
		if (!active) {
			//If session value changed while in session (paused),
			//reset clock at new value
			if (mode == 'Session Time Remaining:' && sessChanged) {
				sessChanged = false;
				$('#timer').text(sessionLength);
				timeLeft = sessionLength;
			}
			//If break value changed while on break (paused),
			//reset clock at new value
			else if (mode == 'Break Time Remaining:' && breakChanged) {
				breakChanged = false;
				$('#timer').text(breakLength);
				timeLeft = breakLength;
			}
			active = true;
			timerCount = setInterval(runTimer, 1000);
		}
		//If clock is running, pause it
		else {
			active = false;
			sessChanged = false;
			breakChanged = false;
			clearInterval(timerCount);
		}
	});
	//Actual Timer Function
	function runTimer() {
		sessionLength = $('#sessionValue').text();
		breakLength = $('#breakValue').text();
		mode = $('#timerLabel').text();
		//When time on clock, count down and animate
		if (timeLeft > 0) {
			//Counter
			timeLeft--;
			$('#timer').text(timeLeft);
			//Animation
			if (mode == 'Session Time Remaining:') {
				percent = (100 - (timeLeft / sessionLength) * 100);
				$('.clock').css('background', `linear-gradient(to top, #2b0208 0%, black ${percent}%)`);
			}
			else {
				percent = (100 - (timeLeft / breakLength) * 100);
				$('.clock').css('background', `linear-gradient(#20591e 0%, black ${percent}%)`);
			}
		}
		else {
			//When time reaches zero, switch modes
			ring.play();
			active = false;
			clearInterval(timerCount);
			$('.clock').animate({opacity: 0}, 200, function () {
				$('.clock').css('background', 'black');
				if (mode == 'Session Time Remaining:') {
					//Switch to break, fade smoothly
					$('#timerLabel').fadeOut(100).text('Break Time Remaining:').fadeIn(100);
					$('#timer').fadeOut(100).text(breakLength).fadeIn(100);
					timeLeft = breakLength;
				}
				else {
					//Switch to session, fade smoothly
					$('#timerLabel').fadeOut(100).text('Session Time Remaining:').fadeIn(100);
					$('#timer').fadeOut(100).text(sessionLength).fadeIn(100);
					timeLeft = sessionLength;
				}
				active = true;
				timerCount = setInterval(runTimer, 1000);
			}).animate({opacity: 1}, 200);
		}
	}
});
