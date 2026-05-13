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
const toolMessages = {
  scissors: {
    draw: ["You drew scissors... How will that help.", "3a"],
    select: ["You selected the scissors... Please do not use it.", "4a"]
  },
  hammer: {
    draw: ["You drew hammer... Don't break the game.", "3b"],
    select: ["You selected the hammer... I hope it breaks", "4b"]
  },
  screwdriver: {
    draw: ["You drew screwdriver... For what?.", "3c"],
    select: ["You selected the screwdriver? Why?.", "4c"]
  },
  squirrel: {
    draw: ["You drew squirrel... Wait... Thats in the deck???", "3d"],
    select: ["That is a squirrel. It is not a tool.", "4d"]
  }
};
const imageProps = [
  [rope, "rope"],
  [sign, "sign"],
  [redButton, "button"],
  [vault, "vault"],
  [glass, "glass"]
];

let tool = "";
let nextCard = 0;
let ropeCut = false;
let hammerHits = 0;
let vaultScrewsGone = 0;
let glassScrewsGone = 0;
let squirrelUsed = false;
let lettersFallen = 0;
let redButtonDodges = 0;

function shuffleDeck(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
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

function imageUrl(name) {
  return "images/" + name + ".png";
}

function setImageBackground(element, name) {
  element.style.backgroundImage = "url('" + imageUrl(name) + "')";
  element.classList.add("imageBacked");
}

function applyImages() {
  for (let i = 0; i < imageProps.length; i++) {
    setImageBackground(imageProps[i][0], imageProps[i][1]);
  }

  for (let i = 0; i < toolButtons.length; i++) {
    const button = toolButtons[i];
    const icon = document.createElement("img");
    icon.src = imageUrl(button.dataset.tool);
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
  toolCursor.style.backgroundImage = "url('" + imageUrl(name) + "')";
  toolCursor.classList.add("show");
}

function hideToolCursor() {
  toolCursor.classList.remove("show");
}

function startGame() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  deckArea.style.display = "block";
  say("Hey don't take my cards!", "2d");
}

function dropLetter(letter) {
  if (letter.classList.contains("fall")) {
    return;
  }

  letter.classList.add("fall");
  lettersFallen++;

  if (lettersFallen === 1) {
    say("Stop clicking the title. Those letters are not buttons.", "2a");
  } else if (lettersFallen < letters.length) {
    say("HEY those are EXPENSIVE!", "2b");
  } else {
    say("Still not a game.", "2c");
    setTimeout(startGame, 600);
  }
}

function drawTool() {
  if (nextCard >= toolDeck.length) {
    drawCard.disabled = true;
    drawCard.style.display = "none";
    say("No cards left. The deck is emptier than my patience.", "2d");
    return;
  }

  const button = toolDeck[nextCard];
  const name = button.dataset.tool;
  button.style.display = "inline-block";
  deckInfo.textContent = "Deck: " + (toolDeck.length - nextCard - 1) + " cards";
  say(toolMessages[name].draw[0], toolMessages[name].draw[1]);
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

  say(toolMessages[tool].select[0], toolMessages[tool].select[1]);
}

function stealDeckText() {
  if (squirrelUsed) {
    say("The squirrel already stole something. It has a tiny lawyer now.", "5a");
    return;
  }

  squirrelUsed = true;
  deckInfo.textContent = "Deck: stolen";
  deckInfo.classList.add("stolen");
  say("The squirrel stole the deck counter. Great. Just great.", "5a");
}

function unscrew(screw, onDone) {
  if (tool !== "screwdriver") {
    say("Those corner screws need to stay, IF YOU TAKE THEM SO HELP ME GOD.", "8a");
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
      say("Stop removing the glass screws you're not supposed to do that.", "8d");
    }

    if (glassScrewsGone === 36) {
      glass.style.display = "none";
      finalScrew.style.display = "block";
      finalScrew.style.zIndex = "4";
      say("Do not touch the final screw, if you don't ill give you 10 bucks!", "8e");
    }
  });
}

function moveRedButton() {
  const maxLeft = gameScreen.clientWidth - redButton.offsetWidth - 20;
  const maxTop = gameScreen.clientHeight - redButton.offsetHeight - 20;
  redButton.style.left = 10 + Math.floor(Math.random() * Math.max(maxLeft, 1)) + "px";
  redButton.style.top = 10 + Math.floor(Math.random() * Math.max(maxTop, 1)) + "px";
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
applyImages();
say("There is no game. Seriously. Do not press start.", "1a");
document.addEventListener("mousemove", updateToolCursor);

startButton.onclick = function () {
  say("See no game.", "1b");
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
  say("Wait... You can cut that??", "6b");

  setTimeout(function () {
    sign.classList.add("fall");
    say("That was not intended.", "7c");

    setTimeout(function () {
      redButton.style.display = "block";
      vault.style.display = "block";
      say("There is NO screws AT ALL.", "7d");
    }, 700);
  }, 300);
};

for (let i = 0; i < firstScrews.length; i++) {
  firstScrews[i].onclick = function (event) {
    event.stopPropagation();

    unscrew(firstScrews[i], function () {
      vaultScrewsGone++;
      say("Stop. Please stop. PLEASE STOP. NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", "8b");

      if (vaultScrewsGone === 4) {
        setTimeout(function () {
          glass.style.display = "block";
          setImageBackground(glass, hammerHits > 0 ? "cracked-glass" : "glass");
          makeScrews();
          say("Oh no. Reinforced glass with 36 SCREWS HA HA.", "8c");
        }, 400);
      }
    });
  };
}

finalScrew.onclick = function (event) {
  event.stopPropagation();

  unscrew(finalScrew, function () {
    vault.classList.add("opened");
    redButton.classList.add("dodging");
    say("No no nO NO—", "10a");
  });
};

redButton.onclick = function (event) {
  event.stopPropagation();

  if (!vault.classList.contains("opened")) {
    say("Nice try. The vault panel is still in the way.", "7e");
    return;
  }

  if (redButtonDodges < 3) {
    const dodgeLines = [
      ["The button has chosen cowardice. Click attempt 1 was denied.", "10c"],
      ["The button is doing cardio. Click attempt 2 was denied.", "10d"],
      ["Stop making the button exercise. Click attempt 3 was denied.", "10e"]
    ];
    redButtonDodges++;
    moveRedButton();
    say(dodgeLines[redButtonDodges - 1][0], dodgeLines[redButtonDodges - 1][1]);
    return;
  }

  redButton.style.display = "none";
  say("You pressed it. Of course you did.", "10a");
  setTimeout(crash, 500);
};

glass.onclick = function () {
  if (tool !== "hammer") {
    return;
  }

  hammerHits++;

  if (hammerHits === 1) {
    glass.classList.add("cracked");
    setImageBackground(glass, "cracked-glass");
    say("That was a bad idea.", "9a");
    return;
  }

  tool = "";
  hideToolCursor();
  document.querySelector('[data-tool="hammer"]').classList.add("broken");
  say("The hammer broke. Nice job. GREAT JOB, you just break everything", "9b");
};

deckInfo.onclick = function () {
  if (tool === "squirrel") {
    stealDeckText();
  }
};
