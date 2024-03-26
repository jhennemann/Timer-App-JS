const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");

var countdownInterval;
var startPauseVal = false;
var reset = false;
var hours = 0;
var minutes = 0;
var seconds = 0;
var stopVal = false;
var pomoCycle = 1;
var currentCycle = "Work";
var pomoPause = false;
var mode = "timer";
const pomoLength = {
  short: 5,
  long: 30,
  work: 25,
};

const secText = document.querySelector("#secs");
const minText = document.querySelector("#mins");
const hourText = document.querySelector("#hoursOut");
const timerText = document.querySelector("#timer");

startPauseBtn.addEventListener("click", startBtnCommands);
resetBtn.addEventListener("click", resetCommands);
const startPauseBtnText = document.querySelector("#startPauseBtn");

function startBtnCommands() {
  if (mode == "timer") {
    startPauseVal = !startPauseVal;
    if (reset) {
      resetTimer();
    }
    if (seconds == 0 && minutes == 0 && hours == 0) {
      startPauseVal = !startPauseVal;
      alert("Add time to the timer.");
    } else if (startPauseVal) {
      startTimer();
      startPauseBtnText.textContent = "Pause";
      document.getElementById("resetBtn").style.display = "none";

      document.getElementById("addTime").style.display = "none";
      document.getElementById("timerTypes").style.display = "none";
    } else {
      clearInterval(countdownInterval);
      reset = false;
      startPauseBtnText.textContent = "Resume";
      document.getElementById("resetBtn").style.display = "inline";

      document.getElementById("addTime").style.display = "block";
      document.getElementById("timerTypes").style.display = "inline";
    }
  } else if (mode == "pomo") {
    startPauseVal = !startPauseVal;
    if (startPauseVal) {
      if (!pomoPause) {
        checkPomoCycle(pomoCycle);
      }
      startTimer();
      startPauseBtnText.textContent = "Pause";
      document.getElementById("resetBtn").style.display = "none";
      document.getElementById("timerTypes").style.display = "none";
      document.getElementById("pomoRoute").style.display = "none";
    } else {
      clearInterval(countdownInterval);
      pomoPause = true;
      startPauseBtnText.textContent = "Resume";
      document.getElementById("resetBtn").style.display = "inline";
      document.getElementById("timerTypes").style.display = "inline";
      document.getElementById("pomoRoute").style.display = "inline";
    }
  }
}

function resetCommands() {
  clearInterval(countdownInterval);
  resetTimer();
  startPauseVal = false;
  pomoPause = false;
  if (mode == "pomo") {
    checkPomoCycle(pomoCycle);
    minText.textContent = minutes;
  }
}

function startTimer() {
  countdownInterval = setInterval(countdown, 1000);
  function countdown() {
    if (seconds <= 0 && minutes <= 0 && hours <= 0) {
      clearInterval(countdownInterval);
      showNotification();
      pomoCycle++;
      checkPomoCycle(pomoCycle);
      minText.textContent = minutes;
      resetCommands();
      return;
    }

    if (minutes <= 0 && hours > 0) {
      minutes += 60;
      hours--;
    }

    if (seconds <= 0 && minutes > 0) {
      seconds += 60;
      minutes--;
    }

    seconds--;
    if (mode != "pomo") {
      hourText.textContent = formatTime(hours);
      minText.textContent = formatTime(minutes);
      secText.textContent = formatTime(seconds);
    } else {
      minText.textContent = minutes;
      secText.textContent = formatTime(seconds);
    }
  }
}

function checkPomoCycle() {
  if (pomoCycle % 8 === 0) {
    document.querySelector("#pomoText").textContent = "Long Break";
    minutes = pomoLength.long;
    currentCycle = "Long Break";
  } else if (pomoCycle % 2 == 0) {
    document.querySelector("#pomoText").textContent = "Short Break";
    minutes = pomoLength.short;
    currentCycle = "Short Break";
  } else {
    document.querySelector("#pomoText").textContent = "Study Time";
    minutes = pomoLength.work;
    currentCycle = "Work";
  }
}

function addTime(type, amount) {
  if (type == 0) {
    hours += amount;
  } else {
    minutes += amount;
  }

  if (minutes >= 60) {
    minutes -= 60;
    hours++;
  }

  if (seconds >= 60) {
    seconds -= 60;
    minutes++;
  }
  hourText.textContent = formatTime(hours);
  minText.textContent = formatTime(minutes);
  secText.textContent = formatTime(seconds);
}

function resetTimer() {
  clearInterval(countdownInterval);
  hours = 0;
  minutes = 0;
  seconds = 0;

  hourText.textContent = formatTime(hours);
  minText.textContent = formatTime(minutes);
  secText.textContent = formatTime(seconds);

  reset = false;
  startPauseVal = false;

  startPauseBtnText.textContent = "Start";
}

function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

function regularTimer() {
  document.querySelector("#timerText").textContent = "Study Timer";
  changeTimer("timer");
  resetTimer();
}

function pomoTimer() {
  document.querySelector("#pomoText").textContent = "Study Time";
  document.querySelector("#timerText").textContent = "Pomodoro Timer";
  changeTimer("pomo");
  resetTimer();
  minutes = 25;
  minText.textContent = formatTime(minutes);
  pomoCycle = 1;
}

function skip() {
  pomoCycle++;
  resetCommands();
}

function stopwatch() {
  document.querySelector("#timerText").textContent = "Stopwatch";
  changeTimer("stop");
  resetTimer();
}

function swStart() {
  stopVal = !stopVal;
  if (stopVal) {
    document.getElementById("swStart").textContent = "Stop";
    document.getElementById("resetBtn").style.display = "none";
    countdownInterval = setInterval(countup, 1000);
    function countup() {
      if (seconds >= 60) {
        seconds -= 60;
        minutes++;
      }
      if (minutes >= 60) {
        minutes -= 60;
        hours++;
      }

      seconds++;

      hourText.textContent = formatTime(hours);
      minText.textContent = formatTime(minutes);
      secText.textContent = formatTime(seconds);
    }
  } else {
    clearInterval(countdownInterval);
    document.getElementById("swStart").textContent = "Start";
    document.getElementById("resetBtn").style.display = "inline";
  }
}

function changeTimer(wantedMode) {
  if (wantedMode == "timer") {
    document.getElementById("addTime").style.display = "block";
    document.getElementById("startPauseBtn").style.display = "inline";
    document.getElementById("swStart").style.display = "none";
    document.getElementById("delHours").style.display = "inline";
    document.getElementById("resetBtn").style.display = "inline";
    document.getElementById("pomoText").style.display = "none";
    document.getElementById("skipBtn").style.display = "none";
    document.getElementById("pomoRoute").style.display = "none";
    startPauseVal = false;
  } else if (wantedMode == "pomo") {
    pause = false;
    document.getElementById("addTime").style.display = "none";
    document.getElementById("startPauseBtn").style.display = "inline";
    document.getElementById("swStart").style.display = "none";
    document.getElementById("delHours").style.display = "none";
    document.getElementById("resetBtn").style.display = "none";
    document.getElementById("pomoText").style.display = "inline";
    document.getElementById("skipBtn").style.display = "inline";
    document.getElementById("pomoRoute").style.display = "inline";
    startPauseVal = false;
  } else {
    //stopwatch
    stopVal = false;
    document.getElementById("addTime").style.display = "none";
    document.getElementById("startPauseBtn").style.display = "none";
    document.getElementById("swStart").style.display = "inline";
    document.getElementById("delHours").style.display = "inline";
    document.getElementById("resetBtn").style.display = "inline";
    document.getElementById("pomoText").style.display = "none";
    document.getElementById("skipBtn").style.display = "none";
    document.getElementById("pomoRoute").style.display = "none";
  }
  mode = wantedMode;
}

function showNotification() {
  if (Notification.permission === "granted") {
    new Notification(currentCycle + " Timer Finished");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        new Notification(currentCycle + " Timer Finished");
      }
    });
  }
}
