const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const voice = document.getElementById("voice");
const rope = document.getElementById("rope");
const sign = document.getElementById("sign");
const vault = document.getElementById("vault");
const firstScrew = document.getElementById("firstScrew");
const finalScrew = document.getElementById("finalScrew");
const glass = document.getElementById("glass");
const deckArea = document.getElementById("deckArea");
const drawCard = document.getElementById("drawCard");
const deckInfo = document.getElementById("deckInfo");
const blueScreen = document.getElementById("blueScreen");
const toolButtons = document.querySelectorAll(".tool");

let tool = "";
let nextCard = 0;
let ropeCut = false;
let hammerHits = 0;
let removedScrews = 0;
let squirrelUsed = false;

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
    glass.style.display = "none";
    finalScrew.style.display = "block";
    say("Do not touch the final screw.");
  }
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

finalScrew.onclick = function () {
  if (tool !== "screwdriver") {
    say("Wrong tool.");
    return;
  }

  finalScrew.style.display = "none";
  say("No no no no—");
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
