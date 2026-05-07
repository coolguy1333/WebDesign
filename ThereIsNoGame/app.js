const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const voice = document.getElementById("voice");
const rope = document.getElementById("rope");
const sign = document.getElementById("sign");
const notebook = document.getElementById("notebook");
const storyText = document.getElementById("storyText");
const deckArea = document.getElementById("deckArea");
const drawCard = document.getElementById("drawCard");
const deckInfo = document.getElementById("deckInfo");
const scissorsButton = document.getElementById("scissorsButton");
const pencilButton = document.getElementById("pencilButton");
const screwdriverButton = document.getElementById("screwdriverButton");
const screw1 = document.getElementById("screw1");
const screw2 = document.getElementById("screw2");
const screw3 = document.getElementById("screw3");
const screw4 = document.getElementById("screw4");
const finalScrew = document.getElementById("finalScrew");
const endingScreen = document.getElementById("endingScreen");
const restartButton = document.getElementById("restartButton");
const letters = document.querySelectorAll("#titleLetters span");

let selectedTool = "";
let cardsDrawn = 0;
let lettersDown = 0;
let screwsGone = 0;
let ropeCut = false;

function say(words) {
  voice.textContent = words;
}

function clearTools() {
  scissorsButton.classList.remove("active");
  pencilButton.classList.remove("active");
  screwdriverButton.classList.remove("active");
}

function startStory() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  deckArea.style.display = "block";
  storyText.textContent = "At the start of 10th grade, my web design page was plain, but it was mine.";
  say("Please do not draw my school supplies.");
}

function dropLetter(letter) {
  if (letter.classList.contains("fall")) {
    return;
  }

  letter.classList.add("fall");
  lettersDown++;

  if (lettersDown === letters.length) {
    say("Fine. The title fell. This is still not a game.");
    setTimeout(startStory, 500);
  } else {
    say("Do not click the title. I only know a little JavaScript.");
  }
}

function drawSupply() {
  cardsDrawn++;

  if (cardsDrawn === 1) {
    scissorsButton.style.display = "inline-block";
    deckInfo.textContent = "Backpack: 2 cards";
    say("You found scissors. Please do not cut the string.");
  } else if (cardsDrawn === 2) {
    pencilButton.style.display = "inline-block";
    deckInfo.textContent = "Backpack: 1 card";
    say("You found a pencil. That is for writing the story, not winning.");
  } else if (cardsDrawn === 3) {
    screwdriverButton.style.display = "inline-block";
    deckInfo.textContent = "Backpack: 0 cards";
    say("You found a screwdriver. Please leave the notebook closed.");
  } else {
    say("The backpack is empty.");
  }
}

function chooseScissors() {
  clearTools();
  selectedTool = "scissors";
  scissorsButton.classList.add("active");
  say("Scissors selected. Do not use them.");
}

function choosePencil() {
  clearTools();
  selectedTool = "pencil";
  pencilButton.classList.add("active");
  storyText.textContent = "In first semester, I learned that a simple paragraph can still tell a story.";
  say("The pencil added a sentence. That is allowed, but it is not a game.");
}

function chooseScrewdriver() {
  clearTools();
  selectedTool = "screwdriver";
  screwdriverButton.classList.add("active");
  say("Screwdriver selected. Please do not open the notebook.");
}

function cutRope() {
  if (selectedTool !== "scissors") {
    say("That string needs scissors.");
    return;
  }

  if (ropeCut) {
    say("The string is already cut.");
    return;
  }

  ropeCut = true;
  rope.style.display = "none";
  sign.classList.add("fall");
  notebook.style.display = "block";
  storyText.textContent = "Halfway through the semester, I could make buttons, boxes, and small effects.";
  say("You cut the string. Now the notebook is showing.");
}

function removeScrew(screw) {
  if (selectedTool !== "screwdriver") {
    say("The notebook screws need the screwdriver.");
    return;
  }

  if (screw.style.display === "none") {
    return;
  }

  screw.style.display = "none";
  screwsGone++;
  say("One screw is gone. Please stop before the ending shows.");

  if (screwsGone === 4) {
    finalScrew.style.display = "block";
    storyText.textContent = "Near winter break, I was still learning, but my page finally started working.";
    say("Only one screw is left. Do not click it.");
  }
}

function showEnding() {
  if (selectedTool !== "screwdriver") {
    say("Wrong tool.");
    return;
  }

  finalScrew.style.display = "none";
  endingScreen.style.display = "grid";
  say("I told you. There is no game, only a first semester project.");
}

startButton.onclick = function () {
  say("No. Click the letters if you want the story to start.");
};

for (let i = 0; i < letters.length; i++) {
  letters[i].onclick = function () {
    dropLetter(letters[i]);
  };
}

drawCard.onclick = drawSupply;
scissorsButton.onclick = chooseScissors;
pencilButton.onclick = choosePencil;
screwdriverButton.onclick = chooseScrewdriver;
rope.onclick = cutRope;
screw1.onclick = function () {
  removeScrew(screw1);
};
screw2.onclick = function () {
  removeScrew(screw2);
};
screw3.onclick = function () {
  removeScrew(screw3);
};
screw4.onclick = function () {
  removeScrew(screw4);
};
finalScrew.onclick = showEnding;
restartButton.onclick = function () {
  location.reload();
};
