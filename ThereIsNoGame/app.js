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
const eraserButton = document.getElementById("eraserButton");
const screw1 = document.getElementById("screw1");
const screw2 = document.getElementById("screw2");
const screw3 = document.getElementById("screw3");
const screw4 = document.getElementById("screw4");
const finalScrew = document.getElementById("finalScrew");
const secretPage = document.getElementById("secretPage");
const endingScreen = document.getElementById("endingScreen");
const restartButton = document.getElementById("restartButton");
const letters = document.querySelectorAll("#titleLetters span");
const suspicionCount = document.getElementById("suspicionCount");
const questName = document.getElementById("questName");
const bug = document.getElementById("bug");

let selectedTool = "";
let cardsDrawn = 0;
let lettersDown = 0;
let screwsGone = 0;
let ropeCut = false;
let suspicion = 0;
let bugClicked = false;

function say(words) {
  voice.textContent = words;
}

function addSuspicion(amount) {
  suspicion += amount;
  suspicionCount.textContent = suspicion;
}

function changeQuest(words) {
  questName.textContent = words;
}

function clearTools() {
  scissorsButton.classList.remove("active");
  pencilButton.classList.remove("active");
  screwdriverButton.classList.remove("active");
  eraserButton.classList.remove("active");
}

function startStory() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  deckArea.style.display = "block";
  storyText.textContent = "At the start of 10th grade, my web design page was plain, but it had a border and confidence.";
  changeQuest("Ignore backpack");
  say("Please do not draw my school supplies. They are load-bearing supplies.");
}

function dropLetter(letter) {
  if (letter.classList.contains("fall")) {
    return;
  }

  letter.classList.add("fall");
  lettersDown++;
  addSuspicion(1);

  if (lettersDown === letters.length) {
    say("Fine. The title fell. This is still not a game; it is a dramatic typo accident.");
    setTimeout(startStory, 500);
  } else if (lettersDown > 8) {
    say("That title took me ten minutes to type. Please show respect to my keyboard.");
  } else {
    say("Do not click the title. I only know a little JavaScript and it gets nervous.");
  }
}

function drawSupply() {
  cardsDrawn++;
  addSuspicion(2);

  if (cardsDrawn === 1) {
    scissorsButton.style.display = "inline-block";
    deckInfo.textContent = "Backpack: 3 cards";
    changeQuest("Do not cut rope");
    say("You found scissors. They are decorative. Sharp decorations. Totally normal.");
  } else if (cardsDrawn === 2) {
    pencilButton.style.display = "inline-block";
    deckInfo.textContent = "Backpack: 2 cards";
    say("You found a pencil. That is for writing paragraphs with suspiciously large margins.");
  } else if (cardsDrawn === 3) {
    screwdriverButton.style.display = "inline-block";
    deckInfo.textContent = "Backpack: 1 card";
    changeQuest("Keep notebook closed");
    say("You found a screwdriver. Please do not open the notebook. It contains unfinished homework.");
  } else if (cardsDrawn === 4) {
    eraserButton.style.display = "inline-block";
    deckInfo.textContent = "Backpack: 0 cards";
    say("You found an eraser. It deletes mistakes, unless the mistake is clicking everything.");
  } else {
    say("The backpack is empty. You even checked the tiny crumb pocket.");
  }
}

function chooseTool(toolName, button, message) {
  clearTools();
  selectedTool = toolName;
  button.classList.add("active");
  say(message);
}

function choosePencil() {
  chooseTool("pencil", pencilButton, "Pencil selected. It has the power of one sentence.");
  storyText.textContent = "In first semester, I learned that a simple paragraph can still tell a story, especially if the narrator complains.";
  addSuspicion(1);
}

function chooseEraser() {
  chooseTool("eraser", eraserButton, "Eraser selected. It erased nothing because the CSS said no.");
  storyText.textContent = "The eraser tried to remove the story, but accidentally underlined the lesson: mistakes help you learn.";
}

function cutRope() {
  if (selectedTool !== "scissors") {
    say("That string needs scissors. Or patience. Mostly scissors.");
    return;
  }

  if (ropeCut) {
    say("The string is already cut. Please stop cutting invisible rope.");
    return;
  }

  ropeCut = true;
  rope.style.display = "none";
  sign.classList.add("fall");
  notebook.style.display = "block";
  storyText.textContent = "Halfway through the semester, I could make buttons, boxes, hover effects, and tiny chaos.";
  changeQuest("Do not unscrew");
  addSuspicion(5);
  say("You cut the string. The sign has fallen with great educational drama.");
}

function removeScrew(screw) {
  if (selectedTool !== "screwdriver") {
    say("The notebook screws need the screwdriver. The narrator needs a vacation.");
    return;
  }

  if (screw.style.display === "none") {
    return;
  }

  screw.style.display = "none";
  screwsGone++;
  addSuspicion(3);
  say("One screw is gone. That was probably not on the rubric.");

  if (screwsGone === 4) {
    finalScrew.style.display = "block";
    storyText.textContent = "Near winter break, I was still learning, but my page finally started working without exploding.";
    changeQuest("Absolutely stop");
    say("Only one dramatic screw is left. Do not click it. It has main-character energy.");
  }
}

function showEnding() {
  if (selectedTool !== "screwdriver") {
    say("Wrong tool. The final screw respects tool safety.");
    return;
  }

  finalScrew.style.display = "none";
  secretPage.style.display = "block";
  addSuspicion(10);
  changeQuest("Admit it was a game");
  say("I told you. There is no game, only a first-semester project wearing a fake mustache.");
  setTimeout(function () {
    endingScreen.style.display = "grid";
  }, 900);
}

function squishBug() {
  if (bugClicked) {
    say("The bug is already fixed. That is called debugging. Very professional.");
    return;
  }

  bugClicked = true;
  bug.classList.add("squished");
  bug.textContent = "fixed!";
  addSuspicion(4);
  storyText.textContent = "You fixed a bug. It was not required, but it looks great on a first-semester resume.";
  say("You clicked the bug. Congratulations, you are now technical support.");
}

startButton.onclick = function () {
  addSuspicion(1);
  say("No. That button is for decoration. Click the title letters if you insist on causing curriculum.");
};

for (let i = 0; i < letters.length; i++) {
  letters[i].onclick = function () {
    dropLetter(letters[i]);
  };
}

drawCard.onclick = drawSupply;
scissorsButton.onclick = function () {
  chooseTool("scissors", scissorsButton, "Scissors selected. This is where I remind you not to cut important plot rope.");
};
pencilButton.onclick = choosePencil;
screwdriverButton.onclick = function () {
  chooseTool("screwdriver", screwdriverButton, "Screwdriver selected. The notebook suddenly feels unsafe.");
};
eraserButton.onclick = chooseEraser;
rope.onclick = cutRope;
bug.onclick = squishBug;
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
