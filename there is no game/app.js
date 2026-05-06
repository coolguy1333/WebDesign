const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const voice = document.getElementById("voice");
const rope = document.getElementById("rope");
const sign = document.getElementById("sign");
const vault = document.getElementById("vault");
const firstScrew = document.getElementById("firstScrew");
const glass = document.getElementById("glass");
const deckArea = document.getElementById("deckArea");
const drawCard = document.getElementById("drawCard");
const deckInfo = document.getElementById("deckInfo");
const tools = document.getElementById("tools");
const blueScreen = document.getElementById("blueScreen");

let tool = "";
let ropeCut = false;
let hammerHits = 0;
let removedScrews = 0;
let squirrelUsed = false;

const deck = ["scissors", "hammer", "screwdriver", "squirrel"];

function say(text) {
  voice.textContent = text;
}

function startGame() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  deckArea.style.display = "block";
  say("There. The game has started. Except there is still no game.");
}

function drawTool() {
  if (deck.length === 0) {
    say("No cards left. That is probably your fault.");
    return;
  }

  const name = deck.shift();
  const button = document.createElement("button");

  button.textContent = name;
  button.className = "tool";
  button.onclick = function () {
    tool = name;
    selectTool(button);

    if (tool === "squirrel") {
      say("That is a squirrel. It is not a tool.");
    } else {
      say("You selected the " + tool + ". Please do not use it.");
    }
  };

  tools.appendChild(button);
  deckInfo.textContent = "Deck: " + deck.length + " cards";
  say("You drew " + name + ". This is not helping.");
}

function selectTool(button) {
  const buttons = document.querySelectorAll(".tool");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  button.classList.add("active");
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

function makeScrews() {
  glass.innerHTML = "";
  removedScrews = 0;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const screw = document.createElement("div");
      screw.className = "smallScrew";
      screw.style.left = 18 + col * 46 + "px";
      screw.style.top = 18 + row * 36 + "px";
      screw.onclick = function (event) {
        event.stopPropagation();
        removeScrew(screw);
      };
      glass.appendChild(screw);
    }
  }
}

function removeScrew(screw) {
  if (tool !== "screwdriver") {
    say("Those need a screwdriver.");
    return;
  }

  screw.remove();
  removedScrews++;

  if (removedScrews === 1) {
    say("Stop removing the screws.");
  }

  if (removedScrews === 36) {
    showFinalScrew();
  }
}

function showFinalScrew() {
  glass.style.display = "none";

  const finalScrew = document.createElement("div");
  finalScrew.className = "screw";
  finalScrew.style.left = "120px";
  finalScrew.style.top = "95px";
  finalScrew.onclick = function () {
    if (tool !== "screwdriver") {
      say("Wrong tool.");
      return;
    }

    finalScrew.remove();
    say("No no no no—");
    setTimeout(crash, 500);
  };

  vault.appendChild(finalScrew);
  say("Do not touch the final screw.");
}

function crash() {
  blueScreen.style.display = "grid";
  say("I told you there was no game.");

  setTimeout(function () {
    location.reload();
  }, 2000);
}

startButton.onclick = startGame;
drawCard.onclick = drawTool;

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
      vault.style.display = "block";
      say("Do not touch that vault.");
    }, 700);
  }, 300);
};

firstScrew.onclick = function (event) {
  event.stopPropagation();

  if (tool !== "screwdriver") {
    say("That screw needs a screwdriver.");
    return;
  }

  firstScrew.remove();
  say("Stop. Please stop.");

  setTimeout(function () {
    glass.style.display = "block";
    makeScrews();
    say("Oh no. More screws.");
  }, 400);
};

glass.onclick = function () {
  if (tool === "hammer") {
    hammerHits++;

    if (hammerHits === 1) {
      glass.classList.add("cracked");
      say("That was a bad idea.");
    } else {
      const buttons = document.querySelectorAll(".tool");

      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent === "hammer") {
          buttons[i].classList.add("broken");
        }
      }

      tool = "";
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

say("There is no game. Seriously. Do not press start.");
