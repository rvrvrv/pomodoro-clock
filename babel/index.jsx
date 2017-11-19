/* global $ */
const ring = new Audio('https://a.clyp.it/j4hjat4o.mp3');
let mode;
let timer;
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
  // Update timer and UI
  active = false;
  clearInterval(timer);
  ring.play();
  $('.clock').css('background', 'hsl(0, 100%, 0%)');
  if (mode === 'Session Time Remaining:') {
    $('#clockHeader').text('Break Time Remaining:');
    $('#clockTime').text(breakLength);
    disableBtns('break');
    enableBtns('session');
    timeLeft = breakLength;
  } else {
    $('#clockHeader').text('Session Time Remaining:');
    $('#clockTime').text(sessionLength);
    disableBtns('session');
    enableBtns('break');
    timeLeft = sessionLength;
  }
  active = true;
  timer = setInterval(runTimer, 1000);
}

// Timer function
function runTimer() {
  // Gather timer stats
  mode = $('#clockHeader').text();
  sessionLength = $('#sessionValue').text();
  breakLength = $('#breakValue').text();
  let percent;
  // If time remains, count down and animate
  if (timeLeft > 0) {
    // Decrement counter
    timeLeft--;
    $('#clockTime').text(timeLeft);
    // Clock background animation
    if (mode === 'Session Time Remaining:') {
      percent = (100 - ((timeLeft / sessionLength) * 100));
      $('.clock').css('background', `hsl(0, ${percent}%, 12%)`);
    } else {
      percent = (100 - ((timeLeft / breakLength) * 100));
      $('.clock').css('background', `hsl(110, ${percent}%, 12%)`);
    }
  } else switchModes();
}

// Click handlers
$(document).ready(() => {
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
    // Keep session length below 100
    if (sessionLength < 99) {
      sessionLength++;
      sessionChanged = true;
      $('#sessionValue').text(sessionLength);
    }
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
    // Keep break length below 100
    if (breakLength < 99) {
      breakLength++;
      breakChanged = true;
      $('#breakValue').text(breakLength);
    }
  });

  // Clock: Start/Stop Button
  $('.clock').click(() => {
    // Update timer vars
    mode = $('#clockHeader').text();
    timeLeft = $('#clockTime').text();
    sessionLength = $('#sessionValue').text();
    breakLength = $('#breakValue').text();
    // If clock is not running, update UI as necessary
    if (!active) {
      if (mode === 'Session Time Remaining:') {
        // Update session when necessary
        if (sessionChanged) {
          sessionChanged = false;
          $('#clockTime').text(sessionLength);
          timeLeft = sessionLength;
        }
        disableBtns('session');
      } else {
        // Update break when necessary
        if (breakChanged) {
          breakChanged = false;
          $('#clockTime').text(breakLength);
          timeLeft = breakLength;
        }
        disableBtns('break');
      }
      // Then, resume the timer
      active = true;
      timer = setInterval(runTimer, 1000);
    } else {
      // If clock is running, pause it
      active = false;
      enableBtns();
      clearInterval(timer);
    }
  });
});
