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
	var sessionChanged = false;
	var breakChanged = false;
	var active = false;

	//Timer function
	function runTimer() {
		mode = $('#timerLabel').text();
		sessionLength = $('#sessionValue').text();
		breakLength = $('#breakValue').text();

		//When time remains, count down and animate
		if (timeLeft > 0) {
			//Counter
			timeLeft--;
			$('#timer').text(timeLeft);
			//Gradient animation
			if (mode == 'Session Time Remaining:') {
				percent = (100 - (timeLeft / sessionLength) * 100);
				$('.clock').css('background', `linear-gradient(to top, #2b0208 0%, black ${percent}%)`);
			} else {
				percent = (100 - (timeLeft / breakLength) * 100);
				$('.clock').css('background', `linear-gradient(#20591e 0%, black ${percent}%)`);
			}
		} else switchModes();
	}

	//Update UI and timer to reflect new mode
	function switchModes() {
		ring.play();
		active = false;
		clearInterval(timerCount);
		$('.clock').fadeTo(200, 0, () => {
			$('.clock').css('background', 'black');
			if (mode == 'Session Time Remaining:') {
				$('#timerLabel').text('Break Time Remaining:');
				$('#timer').text(breakLength);
				disableBtns('break');
				enableBtns('session');
				timeLeft = breakLength;
			} else {
				$('#timerLabel').text('Session Time Remaining:');
				$('#timer').text(sessionLength);
				disableBtns('session');
				enableBtns('break');
				timeLeft = sessionLength;
			}
			active = true;
			timerCount = setInterval(runTimer, 1000);
		}).fadeTo(200, 1);
	}

	//Enable group of buttons
	function enableBtns(group) {
		//If no group provided, enable all buttons
		if (!group) $('.btn-sm').removeAttr('disabled');
		//Otherwise, enable specific group of buttons
		else $(`.${group}Btn`).removeAttr('disabled');
	}

	//Disable group of buttons
	function disableBtns(group) {
		//If no group provided, disable all buttons
		if (!group) $('.btn-sm').attr('disabled', 'disabled');
		//Otherwise, disable specific group of buttons
		else $(`.${group}Btn`).attr('disabled', 'disabled');
	}

	//Session Length: Minus Button
	$('#sessionMinus').click(() => {
		sessionLength = $('#sessionValue').text();
		//Keep session length above 0
		if (sessionLength > 1) {
			sessionLength--;
			sessionChanged = true;
			$('#sessionValue').text(sessionLength);
		}
	});

	//Session Length: Plus Button
	$('#sessionPlus').click(() => {
		sessionLength = $('#sessionValue').text();
		sessionLength++;
		sessionChanged = true;
		$('#sessionValue').text(sessionLength);
	});

	//Break Length: Minus Button
	$('#breakMinus').click(() => {
		breakLength = $('#breakValue').text();
		//Keep break length above 0
		if (breakLength > 1) {
			breakLength--;
			breakChanged = true;
			$('#breakValue').text(breakLength);
		}
	});

	//Break Length: Plus Button
	$('#breakPlus').click(() => {
		breakLength = $('#breakValue').text();
		breakLength++;
		breakChanged = true;
		$('#breakValue').text(breakLength);
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
			if (mode == 'Session Time Remaining:' && sessionChanged) {
				sessionChanged = false;
				$('#timer').text(sessionLength);
				timeLeft = sessionLength;
				disableBtns('session');
			}
			//If break value changed while on break (paused),
			//reset clock at new value
			else if (mode == 'Break Time Remaining:' && breakChanged) {
				breakChanged = false;
				$('#timer').text(breakLength);
				timeLeft = breakLength;
				disableBtns('break');
			}
			active = true;
			timerCount = setInterval(runTimer, 1000);
		}
		//If clock is running, pause it
		else {
			active = false;
			sessionChanged = false;
			breakChanged = false;
			enableBtns();
			clearInterval(timerCount);
		}
	});

});
