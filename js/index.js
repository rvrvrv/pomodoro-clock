/*jshint browser: true, esversion: 6*/
/* global $, console */

$(document).ready(() => {
	//Global vars
	const ring = new Audio('https://a.clyp.it/j4hjat4o.mp3');
	var percent = 1;
	var timerCount;
	var mode;
	var timeLeft;
	var sessionLength;
	var breakLength;
	var sessChanged = false;
	var breakChanged = false;
	var active = false;


	//Timer function
	function runTimer() {
		mode = $('#timerLabel').text();
		sessionLength = $('#sessionValue').text();
		breakLength = $('#breakValue').text();

		//When time on clock, count down and animate
		if (timeLeft > 0) {
			//Counter
			timeLeft--;
			$('#timer').text(timeLeft);
			//Animation
			if (mode == 'Session Time Remaining:') {
				percent = (100 - (timeLeft / sessionLength) * 100);
				$('.clock').css('background', `linear-gradient(to top, #2b0208 0%, black ${percent}%)`);
			} else {
				percent = (100 - (timeLeft / breakLength) * 100);
				$('.clock').css('background', `linear-gradient(#20591e 0%, black ${percent}%)`);
			}
		} else {
			//When time reaches zero, switch modes
			ring.play();
			active = false;
			clearInterval(timerCount);
			$('.clock').fadeTo(200, 0, () => {
				$('.clock').css('background', 'black');
				if (mode == 'Session Time Remaining:') {
					$('#timerLabel').text('Break Time Remaining:');
					$('#timer').text(breakLength);
					timeLeft = breakLength;
				} else {
					//Switch to session, fade smoothly
					$('#timerLabel').text('Session Time Remaining:');
					$('#timer').text(sessionLength);
					timeLeft = sessionLength;
				}
				active = true;
				timerCount = setInterval(runTimer, 1000);
			}).fadeTo(200, 1);
		}
	}

	//Session Length: Minus Button
	$('#sessionMinus').click(() => {
		//Only allow changes when not running,
		//or on break
		if (!active || $('#timerLabel').text() == 'Break Time Remaining:') {
			sessionLength = $('#sessionValue').text();
			if (sessionLength > 1) {
				sessionLength--;
				sessChanged = true;
				$('#sessionValue').text(sessionLength);
			}
		}
	});

	//Session Length: Plus Button
	$('#sessionPlus').click(() => {
		//Only allow changes when not running,
		//or on break
		if (!active || mode == 'Break Time Remaining:') {
			sessionLength = $('#sessionValue').text();
			sessionLength++;
			sessChanged = true;
			$('#sessionValue').text(sessionLength);
		}
	});

	//Break Length: Minus Button
	$('#breakMinus').click(() => {
		//Only allow changes when not running,
		//or in session (not on break)
		if (!active || mode == 'Session Time Remaining:') {
			var breakLength = $('#breakValue').text();
			if (breakLength > 1) {
				breakLength--;
				breakChanged = true;
				$('#breakValue').text(breakLength);
			}
		}
	});

	//Break Length: Plus Button
	$('#breakPlus').click(() => {
		//Only allow changes when not running,
		//or in session (not on break)
		if (!active || mode == 'Session Time Remaining:') {
			breakLength = $('#breakValue').text();
			breakLength++;
			breakChanged = true;
			$('#breakValue').text(breakLength);
		}
	});

	//Timer: Start/Stop Button
	$('.clock').click(() => {
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

});
