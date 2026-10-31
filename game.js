"use strict";

// Challenge variables (Steps 2, 4, and 7).
var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;

// A turn can be idle, showing a new color, accepting input, between levels,
// or over. Only the input phase accepts pad clicks.
var phase = "idle";
var nextLevelTimer = null;
var showTimer = null;
var errorTimer = null;
var pressTimers = {};
var bestScore = readSavedNumber("simon-best");
var muted = readSavedNumber("simon-muted") === 1;
var sounds = {};
var keyboardColours = { "1": "green", "2": "red", "3": "yellow", "4": "blue" };

buttonColours.concat("wrong").forEach(function (name) {
  sounds[name] = new Audio("sounds/" + name + ".mp3");
  sounds[name].preload = "auto";
  sounds[name].volume = 0.55;
});

$(function () {
  $("#best-score").text(formatScore(bestScore));
  renderSoundButton();

  // Step 7: a first keypress starts the game; later keys never add levels.
  $(document).on("keydown", function (event) {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (["Tab", "Shift", "Control", "Alt", "Meta", "CapsLock", "Escape"].indexOf(event.key) !== -1) return;

    // Let native buttons handle Enter/Space without a second document action.
    if ($(event.target).is("button, a, input, textarea, select")) {
      if (!keyboardColours[event.key]) return;
    }

    if (!started && errorTimer === null) {
      event.preventDefault();
      beginGame();
    } else if (phase === "input" && keyboardColours[event.key]) {
      event.preventDefault();
      chooseColour(keyboardColours[event.key]);
    }
  });

  $("#start-button").on("click", beginGame);

  // Steps 4 and 5: read the clicked pad's id, then animate, sound, and check it.
  $(".btn").on("click", function () {
    chooseColour($(this).attr("id"));
  });

  $("#sound-toggle").on("click", function () {
    muted = !muted;
    saveNumber("simon-muted", muted ? 1 : 0);
    if (muted) {
      Object.keys(sounds).forEach(function (name) { sounds[name].pause(); });
    }
    renderSoundButton();
  });
});

function beginGame() {
  if (started || errorTimer !== null) return;
  clearTimeout(nextLevelTimer);
  clearTimeout(showTimer);
  gamePattern = [];
  userClickedPattern = [];
  level = 0;
  started = true;
  $("body").removeClass("game-over");
  $("#start-button").addClass("is-playing").prop("disabled", true);
  $("#start-label").text("Game in progress");
  $("#keyboard-hint").text("click the pads or use keys 1, 2, 3, 4");
  nextSequence();
}

// Steps 2, 3, and 7: append and show ONE new color. Remember previous colors!
function nextSequence() {
  if (!started) return;
  nextLevelTimer = null;
  userClickedPattern = [];
  level += 1;
  setPhase("showing");
  $("#level-title").text("Level " + level);
  $("#game-status").text("Watch the new color. Remember the whole pattern.");

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  var pad = $("#" + randomChosenColour);
  pad.addClass("showing");
  // fadeTo preserves the grid position, unlike hiding the button with fadeOut.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    pad.stop(true, true).fadeTo(100, 0.35).fadeTo(140, 1);
  }
  playSound(randomChosenColour);

  showTimer = setTimeout(function () {
    showTimer = null;
    pad.stop(true, true).css("opacity", 1).removeClass("showing");
    if (!started) return;
    setPhase("input");
    $("#game-status").text("Your turn: 0 / " + level + " colors");
  }, 500);
}

function chooseColour(userChosenColour) {
  if (!started || phase !== "input") return;
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
}

// Step 5: use the same sound function for the computer and the player.
function playSound(name) {
  if (muted || !sounds[name]) return;
  var sound = sounds[name];
  sound.currentTime = 0;
  var result = sound.play();
  // If a browser blocks audio, the visual game remains playable.
  if (result && typeof result.catch === "function") {
    result.catch(function () {});
  }
}

// Step 6: briefly apply the provided pressed style for 100 milliseconds.
function animatePress(currentColour) {
  clearTimeout(pressTimers[currentColour]);
  $("#" + currentColour).addClass("pressed");
  pressTimers[currentColour] = setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
    delete pressTimers[currentColour];
  }, 100);
}

// Step 8: compare each input immediately, then wait 1000 ms after a full match.
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] !== userClickedPattern[currentLevel]) {
    endGame();
    return;
  }

  $("#game-status").text("Your turn: " + userClickedPattern.length + " / " + level + " colors");
  if (userClickedPattern.length === gamePattern.length) {
    setPhase("between");
    if (level > bestScore) {
      bestScore = level;
      saveNumber("simon-best", bestScore);
      $("#best-score").text(formatScore(bestScore));
    }
    $("#game-status").text("Pattern complete! Get ready for the next color.");
    nextLevelTimer = setTimeout(nextSequence, 1000);
  }
}

// Step 9: a wrong answer plays wrong.mp3 and flashes the background for 200 ms.
function endGame() {
  var completedLevels = level - 1;
  playSound("wrong");
  $("body").addClass("game-over");
  $("#level-title").text("Game Over, Press Any Key to Restart");
  $("#game-status").text("You completed " + completedLevels + " " + (completedLevels === 1 ? "level" : "levels") + ". Try again!");
  startOver();
  $("#start-label").text("Play again");
  $("#start-button").removeClass("is-playing").prop("disabled", true);
  $("#keyboard-hint").text("or press any key to restart");
  errorTimer = setTimeout(function () {
    errorTimer = null;
    $("body").removeClass("game-over");
    $("#start-button").prop("disabled", false);
  }, 200);
}

// Step 10: clear all game state and pending work before the next game.
function startOver() {
  clearTimeout(nextLevelTimer);
  clearTimeout(showTimer);
  nextLevelTimer = null;
  showTimer = null;
  Object.keys(pressTimers).forEach(function (color) { clearTimeout(pressTimers[color]); });
  pressTimers = {};
  $(".btn").stop(true, true).css("opacity", 1).removeClass("showing pressed");
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  setPhase("over");
}

function setPhase(value) {
  phase = value;
  $(".btn").prop("disabled", value !== "input");
}

function renderSoundButton() {
  $("#sound-toggle")
    .attr("aria-pressed", String(muted))
    .attr("aria-label", muted ? "Unmute sound" : "Mute sound")
    .attr("title", muted ? "Unmute sound" : "Mute sound");
}

function formatScore(score) { return String(score).padStart(2, "0"); }

// Storage may be restricted for local files or in private browsing.
function readSavedNumber(key) {
  try {
    var value = Number(localStorage.getItem(key));
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  } catch (error) { return 0; }
}

function saveNumber(key, value) {
  try { localStorage.setItem(key, String(value)); } catch (error) { /* Optional storage. */ }
}
