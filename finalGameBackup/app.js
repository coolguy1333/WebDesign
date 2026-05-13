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

let tool = "";
let nextCard = 0;
let ropeCut = false;
let hammerHits = 0;
let vaultScrewsGone = 0;
let glassScrewsGone = 0;
let squirrelUsed = false;
let lettersFallen = 0;

function say(text) {
  voice.textContent = text;
}

function startGame() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  deckArea.style.display = "block";
  say("Please do not draw those cards.");
}

function dropLetter(letter) {
  if (letter.classList.contains("fall")) {
    return;
  }

  letter.classList.add("fall");
  lettersFallen++;

  if (lettersFallen < letters.length) {
    say("Stop clicking the title. Those letters are not buttons.");
  } else {
    say("Fine. The letters fell. Still not a game.");
    setTimeout(startGame, 600);
  }
}

function drawTool() {
  if (nextCard >= toolButtons.length) {
    say("No cards left. That is probably your fault.");
    return;
  }

  const button = toolButtons[nextCard];
  button.style.display = "inline-block";
  deckInfo.textContent = "Deck: " + (toolButtons.length - nextCard - 1) + " cards";
  say("You drew " + button.dataset.tool + ". This is not helping.");
  nextCard++;
}

function selectTool(button) {
  for (let i = 0; i < toolButtons.length; i++) {
    toolButtons[i].classList.remove("active");
  }

  tool = button.dataset.tool;
  button.classList.add("active");

  if (tool === "squirrel") {
    say("That is a squirrel. It is not a tool.");
  } else {
    say("You selected the " + tool + ". Please do not use it.");
  }
}

function stealDeckText() {
  if (squirrelUsed) {
    say("The squirrel already stole something.");
    return;
  }

  squirrelUsed = true;
  deckInfo.textContent = "Deck: stolen";
  deckInfo.classList.add("stolen");
  say("The squirrel stole the deck counter. Great. Very useful.");
}

function unscrew(screw, onDone) {
  if (tool !== "screwdriver") {
    say("Those screws need a screwdriver.");
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
  }, 250);

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
      say("Stop removing the glass screws.");
    }

    if (glassScrewsGone === 36) {
      glass.style.display = "none";
      finalScrew.style.display = "block";
      say("The glass is gone, but the screw panel is still hiding something.");
    }
  });
}

function crash() {
  blueScreen.style.display = "grid";
  say("I told you there was no game.");

  setTimeout(function () {
    location.reload();
  }, 2000);
}

startButton.onclick = function () {
  say("No. Click the letters if you must ruin something.");
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
    say("That rope is decorative.");
    return;
  }

  ropeCut = true;
  rope.style.display = "none";
  say("Wait. You were not supposed to cut that.");

  setTimeout(function () {
    sign.classList.add("fall");
    say("That was not intended.");

    setTimeout(function () {
      redButton.style.display = "block";
      vault.style.display = "block";
      say("Do not touch the corner screws. They are definitely not all removable.");
    }, 700);
  }, 300);
};

for (let i = 0; i < firstScrews.length; i++) {
  firstScrews[i].onclick = function (event) {
    event.stopPropagation();

    unscrew(firstScrews[i], function () {
      vaultScrewsGone++;
      say("Stop. Please stop.");

      if (vaultScrewsGone === 4) {
        setTimeout(function () {
          glass.style.display = "block";
          makeScrews();
          say("Oh no. Screws around the glass. Every one of them comes out.");
        }, 400);
      }
    });
  };
}

finalScrew.onclick = function (event) {
  event.stopPropagation();

  unscrew(finalScrew, function () {
    vault.classList.add("opened");
    say("The panel is open. Please ignore the big red button behind it.");
  });
};

redButton.onclick = function (event) {
  event.stopPropagation();
  say("You pressed it. Of course you did.");
  setTimeout(crash, 500);
};

glass.onclick = function () {
  if (tool === "hammer") {
    hammerHits++;

    if (hammerHits === 1) {
      glass.classList.add("cracked");
      say("That was a bad idea.");
    } else {
      tool = "";
      document.querySelector('[data-tool="hammer"]').classList.add("broken");
      say("The hammer broke. Nice job.");
    }
  }

  if (tool === "squirrel") {
    stealDeckText();
  }
};

gameScreen.onclick = function () {
  if (tool === "squirrel") {
    stealDeckText();
  }
};