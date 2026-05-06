const title = document.getElementById("title");
const start = document.getElementById("start");
const voice = document.getElementById("voice");
const arena = document.getElementById("arena");
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

let selectedTool = "";
let clickedLetters = 0;
let ropeIsCut = false;
let hammerHits = 0;
let screwsGone = 0;
let squirrelStole = false;

const toolDeck = ["scissors", "hammer", "screwdriver", "squirrel"];
const drawnTools = [];

function say(words) {
  voice.textContent = words;
}

function makeTitle() {
  const words = "THERE IS NO GAME";
  title.innerHTML = "";

  for (let i = 0; i < words.length; i++) {
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = words[i] === " " ? "\u00A0" : words[i];

    if (words[i] !== " ") {
      letter.onclick = function () {
        if (letter.classList.contains("done")) return;

        letter.classList.add("done");
        clickedLetters++;

        if (clickedLetters < 11) {
          say("Stop clicking the title. Those letters are not buttons.");
        } else {
          showGame();
        }
      };
    }

    title.appendChild(letter);
  }
}

function showGame() {
  start.innerHTML = '<h1>THERE IS NO GAME</h1><p class="subtitle">do not draw cards</p>';
  arena.style.display = "block";
  deckArea.style.display = "block";
  say("Fine. You broke the title. Please do not draw those cards.");
}

function drawTool() {
  if (toolDeck.length === 0) {
    say("The deck is empty. Happy now?");
    return;
  }

  const tool = toolDeck.shift();
  drawnTools.push(tool);
  deckInfo.textContent = "Deck: " + toolDeck.length + " cards";
  showTools();

  if (tool === "squirrel") {
    say("That is a squirrel. That is not even a tool.");
  } else {
    say("You drew the " + tool + ". Please put it back.");
  }
}

function showTools() {
  tools.innerHTML = "";

  for (let i = 0; i < drawnTools.length; i++) {
    const button = document.createElement("button");
    button.className = "tool";
    button.textContent = drawnTools[i];

    button.onclick = function () {
      selectedTool = drawnTools[i];
      selectButton(button);

      if (selectedTool === "squirrel") {
        say("The squirrel is looking at the screen like it owns it.");
      }
    };

    tools.appendChild(button);
  }
}

function selectButton(chosenButton) {
  const buttons = document.querySelectorAll(".tool");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  chosenButton.classList.add("active");
}

function squirrelSteal() {
  if (squirrelStole) {
    say("The squirrel already stole something. It is full.");
    return;
  }

  squirrelStole = true;
  deckInfo.textContent = "Deck: stolen by squirrel";
  deckInfo.classList.add("stolen");
  say("HEY! The squirrel stole the deck counter. Why did you click it?");
}

function makeGlassScrews() {
  glass.innerHTML = "";
  screwsGone = 0;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const screw = document.createElement("div");
      screw.className = "mini-screw";
      screw.style.left = 18 + col * 46 + "px";
      screw.style.top = 18 + row * 36 + "px";

      screw.onclick = function (event) {
        event.stopPropagation();

        if (selectedTool !== "screwdriver") {
          say("Those screws need a screwdriver. Shocking, I know.");
          return;
        }

        screw.remove();
        screwsGone++;

        if (screwsGone === 1) {
          say("Stop. You are removing the screws in neat rows. That is worse.");
        }

        if (screwsGone === 36) {
          showFinalScrew();
        }
      };

      glass.appendChild(screw);
    }
  }
}

function showFinalScrew() {
  glass.style.display = "none";

  const finalScrew = document.createElement("div");
  finalScrew.className = "screw";
  finalScrew.style.left = "calc(50% - 10px)";
  finalScrew.style.top = "calc(50% - 10px)";

  finalScrew.onclick = function () {
    if (selectedTool !== "screwdriver") {
      say("No. Wrong tool. Still no game though.");
      return;
    }

    finalScrew.remove();
    say("No no no no—");

    setTimeout(showBlueScreen, 500);
  };

  vault.appendChild(finalScrew);
  say("Do not touch that last screw.");
}

function showBlueScreen() {
  blueScreen.style.display = "grid";
  say("I told you there was no game.");

  setTimeout(function () {
    location.reload();
  }, 2000);
}

rope.onclick = function () {
  if (selectedTool !== "scissors" || ropeIsCut) {
    say("That rope is decorative. Leave it alone.");
    return;
  }

  ropeIsCut = true;
  rope.style.display = "none";
  say("Wait— You were not supposed to do that.");

  setTimeout(function () {
    sign.classList.add("fall");
    say("That was not intended.");

    setTimeout(function () {
      vault.style.display = "block";
      say("That vault is just decoration. Do not touch it.");
    }, 800);
  }, 300);
};

firstScrew.onclick = function (event) {
  event.stopPropagation();

  if (selectedTool !== "screwdriver") {
    say("You need something twisty for that screw.");
    return;
  }

  firstScrew.remove();
  say("Stop. Please stop.");

  setTimeout(function () {
    glass.style.display = "block";
    makeGlassScrews();
    say("Oh no. You found the glass container.");
  }, 500);
};

glass.onclick = function () {
  if (selectedTool === "hammer") {
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

      selectedTool = "";
      say("And now the hammer is broken. Good job.");
    }
  }

  if (selectedTool === "squirrel") {
    squirrelSteal();
  }
};

arena.onclick = function () {
  if (selectedTool === "squirrel") {
    squirrelSteal();
  }
};

drawCard.onclick = drawTool;

makeTitle();
say("There is no game. Seriously. Do not click anything.");
