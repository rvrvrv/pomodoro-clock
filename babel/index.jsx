/* global $ */

$(document).ready(() => {
  // Global vars
  const ring = new Audio('https://a.clyp.it/j4hjat4o.mp3');
  let percent = 1;
  let timerCount;
  let mode;
  let timeLeft;
  let sessionLength;
  let breakLength;
  let sessionChanged = false;
  let breakChanged = false;
  let active = false;

  // Enable group of buttons
  function enableBtns(group) {
    // If no group provided, enable all buttons
    if (!group) $('button').removeAttr('disabled');
    // Otherwise, enable specific group of buttons
    else $(`.btn-${group}`).removeAttr('disabled');
  }

  // Disable group of buttons
  function disableBtns(group) {
    // If no group provided, disable all buttons
    if (!group) $('button').attr('disabled', 'disabled');
    // Otherwise, disable specific group of buttons
    else $(`.btn-${group}`).attr('disabled', 'disabled');
  }


  // Update UI and timer to reflect new mode
  function switchModes() {
    ring.play();
    active = false;
    clearInterval(timerCount);
    if (mode === 'Session Time Remaining:') {
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
  }

  // Timer function
  function runTimer() {
    mode = $('#timerLabel').text();
    sessionLength = $('#sessionValue').text();
    breakLength = $('#breakValue').text();

    // When time remains, count down and animate
    if (timeLeft > 0) {
      // Counter
      timeLeft--;
      $('#timer').text(timeLeft);
      // Gradient animation
      if (mode === 'Session Time Remaining:') {
        percent = (100 - ((timeLeft / sessionLength) * 100));
        $('.clock').css('background', `linear-gradient(to top, #2b0208 0%, #000 ${percent}%)`);
      } else {
        percent = (100 - ((timeLeft / breakLength) * 100));
        $('.clock').css('background', `linear-gradient(#131 0%, #000 ${percent}%)`);
      }
    } else switchModes();
  }

  // Session Length: Minus Button
  $('.btn-session.btn-minus').click(() => {
    sessionLength = $('#sessionValue').text();
    // Keep session length above 0
    if (sessionLength > 1) {
      sessionLength--;
      sessionChanged = true;
      $('#sessionValue').text(sessionLength);
    }
  });

  // Session Length: Plus Button
  $('.btn-session.btn-plus').click(() => {
    sessionLength = $('#sessionValue').text();
    sessionLength++;
    sessionChanged = true;
    $('#sessionValue').text(sessionLength);
  });

  // Break Length: Minus Button
  $('.btn-break.btn-minus').click(() => {
    breakLength = $('#breakValue').text();
    // Keep break length above 0
    if (breakLength > 1) {
      breakLength--;
      breakChanged = true;
      $('#breakValue').text(breakLength);
    }
  });

  // Break Length: Plus Button
  $('.btn-break.btn-plus').click(() => {
    breakLength = $('#breakValue').text();
    breakLength++;
    breakChanged = true;
    $('#breakValue').text(breakLength);
  });

  // Timer: Start/Stop Button
  $('.clock').click(() => {
    $('.clock').blur();
    // Update timer vars
    mode = $('#timerLabel').text();
    timeLeft = $('#timer').text();
    sessionLength = $('#sessionValue').text();
    breakLength = $('#breakValue').text();
    // If clock is not running, determine the mode, adjust the time, and start
    if (!active) {
      // If session value changed while in session (paused), reset clock at new value
      if (mode === 'Session Time Remaining:' && sessionChanged) {
        sessionChanged = false;
        $('#timer').text(sessionLength);
        timeLeft = sessionLength;
        disableBtns('session');
      } else if (mode === 'Break Time Remaining:' && breakChanged) {
        // If break value changed while on break (paused), reset clock at new value
        breakChanged = false;
        $('#timer').text(breakLength);
        timeLeft = breakLength;
        disableBtns('break');
      }
      active = true;
      timerCount = setInterval(runTimer, 1000);
    } else {
      // If clock is running, pause it
      active = false;
      sessionChanged = false;
      breakChanged = false;
      enableBtns();
      clearInterval(timerCount);
    }
  });
});
