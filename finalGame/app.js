const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const voice = document.getElementById("voice");
const rope = document.getElementById("rope");
const sign = document.getElementById("sign");
const vault = document.getElementById("vault");
const firstScrews = document.querySelectorAll(".firstScrew");
const finalScrew = document.getElementById("finalScrew");
const glass = document.getElementById("glass");
const redButton = document.getElementById("redButton");
const deckArea = document.getElementById("deckArea");
const drawCard = document.getElementById("drawCard");
const deckInfo = document.getElementById("deckInfo");
const blueScreen = document.getElementById("blueScreen");
const toolButtons = document.querySelectorAll(".tool");
const letters = document.querySelectorAll("#titleLetters span");

const toolDeck = Array.from(toolButtons);
const voiceAudio = new Audio();
const toolCursor = document.createElement("div");

let tool = "";
let nextCard = 0;
let ropeCut = false;
let hammerHits = 0;
let vaultScrewsGone = 0;
let glassScrewsGone = 0;
let squirrelUsed = false;
let lettersFallen = 0;

function shuffleDeck(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const card = cards[i];
    cards[i] = cards[j];
    cards[j] = card;
  }
}

function playVoiceLine(cue) {
  if (!cue) {
    return;
  }

  voiceAudio.pause();
  voiceAudio.currentTime = 0;
  voiceAudio.src = "audio/" + cue + ".mp3";
  voiceAudio.play().catch(function () {
    // Audio files and browser autoplay permission are optional; captions still show.
  });
}

function say(text, cue) {
  voice.textContent = text;
  playVoiceLine(cue);
}

function toolImage(name) {
  return "images/" + name + ".png";
}

function setImageBackground(element, name) {
  element.style.backgroundImage = "url('" + toolImage(name) + "')";
}

function applyToolImages() {
  setImageBackground(rope, "rope");
  setImageBackground(sign, "sign");
  setImageBackground(redButton, "button");
  setImageBackground(vault, "vault");
  setImageBackground(glass, "glass");

  for (let i = 0; i < toolButtons.length; i++) {
    const button = toolButtons[i];
    const name = button.dataset.tool;
    const icon = document.createElement("img");
    icon.src = toolImage(name);
    icon.alt = "";
    icon.className = "toolIcon";
    button.prepend(icon);
  }
}

function updateToolCursor(event) {
  if (!tool) {
    return;
  }

  toolCursor.style.left = event.clientX + "px";
  toolCursor.style.top = event.clientY + "px";
}

function showToolCursor(name) {
  toolCursor.style.backgroundImage = "url('" + toolImage(name) + "')";
  toolCursor.classList.add("show");
}

function hideToolCursor() {
  toolCursor.classList.remove("show");
}

function startGame() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  deckArea.style.display = "block";
  say("Please do not draw those cards.", "1b");
}

function dropLetter(letter) {
  if (letter.classList.contains("fall")) {
    return;
  }

  letter.classList.add("fall");
  lettersFallen++;

  if (lettersFallen < letters.length) {
    say("Stop clicking the title. Those letters are not buttons.", "2a");
  } else {
    say("Fine. The letters fell. Still not a game.", "2b");
    setTimeout(startGame, 600);
  }
}

function drawTool() {
  if (nextCard >= toolDeck.length) {
    drawCard.disabled = true;
    drawCard.style.display = "none";
    say("No cards left. That is probably your fault.", "2c");
    return;
  }

  const button = toolDeck[nextCard];
  button.style.display = "inline-block";
  deckInfo.textContent = "Deck: " + (toolDeck.length - nextCard - 1) + " cards";

  const cueByTool = {
    scissors: "3a",
    hammer: "3b",
    screwdriver: "3c",
    squirrel: "3d"
  };

  say("You drew " + button.dataset.tool + ". This is not helping.", cueByTool[button.dataset.tool]);
  nextCard++;

  if (nextCard >= toolDeck.length) {
    drawCard.disabled = true;
    drawCard.style.display = "none";
  }
}

function selectTool(button) {
  for (let i = 0; i < toolButtons.length; i++) {
    toolButtons[i].classList.remove("active");
  }

  tool = button.dataset.tool;
  button.classList.add("active");
  showToolCursor(tool);

  const cueByTool = {
    scissors: "4a",
    hammer: "4b",
    screwdriver: "4c",
    squirrel: "4d"
  };

  if (tool === "squirrel") {
    say("That is a squirrel. It is not a tool.", cueByTool[tool]);
  } else {
    say("You selected the " + tool + ". Please do not use it.", cueByTool[tool]);
  }
}

function stealDeckText() {
  if (squirrelUsed) {
    say("The squirrel already stole something.", "5a");
    return;
  }

  squirrelUsed = true;
  deckInfo.textContent = "Deck: stolen";
  deckInfo.classList.add("stolen");
  say("The squirrel stole the deck counter. Great. Very useful.", "5a");
}

function unscrew(screw, onDone) {
  if (tool !== "screwdriver") {
    say("Those screws need a screwdriver.", "8a");
    return false;
  }

  if (screw.classList.contains("unscrewed")) {
    return false;
  }

  screw.classList.add("unscrewed");

  setTimeout(function () {
    screw.style.display = "none";

    if (onDone) {
      onDone();
    }
  }, 900);

  return true;
}

function makeScrews() {
  glass.innerHTML = "";
  glassScrewsGone = 0;

  for (let i = 0; i < 36; i++) {
    const screw = document.createElement("div");
    screw.className = "smallScrew";

    if (i < 10) {
      screw.style.left = 10 + i * 28 + "px";
      screw.style.top = "10px";
    } else if (i < 20) {
      screw.style.left = 10 + (i - 10) * 28 + "px";
      screw.style.top = "216px";
    } else if (i < 28) {
      screw.style.left = "10px";
      screw.style.top = 38 + (i - 20) * 22 + "px";
    } else {
      screw.style.left = "266px";
      screw.style.top = 38 + (i - 28) * 22 + "px";
    }

    screw.onclick = function (event) {
      event.stopPropagation();
      removeGlassScrew(screw);
    };

    glass.appendChild(screw);
  }
}

function removeGlassScrew(screw) {
  unscrew(screw, function () {
    screw.remove();
    glassScrewsGone++;

    if (glassScrewsGone === 1) {
      say("Stop removing the glass screws.", "8d");
    }

    if (glassScrewsGone === 36) {
      glass.style.display = "none";
      finalScrew.style.display = "block";
      say("The glass is gone, but the screw panel is still hiding something.", "8e");
    }
  });
}

function crash() {
  blueScreen.style.display = "grid";
  say("I told you there was no game.", "10b");

  setTimeout(function () {
    location.reload();
  }, 2000);
}

document.body.appendChild(toolCursor);
toolCursor.id = "toolCursor";
shuffleDeck(toolDeck);
applyToolImages();
say("There is no game. Seriously. Do not press start.", "1a");
document.addEventListener("mousemove", updateToolCursor);

startButton.onclick = function () {
  say("No. Click the letters if you must ruin something.", "1b");
};

for (let i = 0; i < letters.length; i++) {
  letters[i].onclick = function () {
    dropLetter(letters[i]);
  };
}
drawCard.onclick = drawTool;

for (let i = 0; i < toolButtons.length; i++) {
  toolButtons[i].onclick = function () {
    selectTool(toolButtons[i]);
  };
}

rope.onclick = function () {
  if (tool !== "scissors" || ropeCut) {
    say("That rope is decorative.", "6a");
    return;
  }

  ropeCut = true;
  rope.style.display = "none";
  say("Wait. You were not supposed to cut that.", "6b");

  setTimeout(function () {
    sign.classList.add("fall");
    say("That was not intended.", "8a");

    setTimeout(function () {
      redButton.style.display = "block";
      vault.style.display = "block";
      say("Do not touch the corner screws. They are definitely not all removable.", "8a");
    }, 700);
  }, 300);
};

for (let i = 0; i < firstScrews.length; i++) {
  firstScrews[i].onclick = function (event) {
    event.stopPropagation();

    unscrew(firstScrews[i], function () {
      vaultScrewsGone++;
      say("Stop. Please stop.", "8b");

      if (vaultScrewsGone === 4) {
        setTimeout(function () {
          glass.style.display = "block";
          makeScrews();
          say("Oh no. Screws around the glass. Every one of them comes out.", "8c");
        }, 400);
      }
    });
  };
}

finalScrew.onclick = function (event) {
  event.stopPropagation();

  unscrew(finalScrew, function () {
    vault.classList.add("opened");
    say("The panel is open. Please ignore the big red button behind it.", "10a");
  });
};

redButton.onclick = function (event) {
  event.stopPropagation();
  redButton.style.display = "none";
  say("You pressed it. Of course you did.", "10a");
  setTimeout(crash, 500);
};

glass.onclick = function () {
  if (tool === "hammer") {
    hammerHits++;

    if (hammerHits === 1) {
      glass.classList.add("cracked");
      setImageBackground(glass, "cracked-glass");
      say("That was a bad idea.", "9a");
    } else {
      tool = "";
      hideToolCursor();
      document.querySelector('[data-tool="hammer"]').classList.add("broken");
      say("The hammer broke. Nice job.", "9b");
    }
  }
};

deckInfo.onclick = function () {
  if (tool === "squirrel") {
    stealDeckText();
  }
};
