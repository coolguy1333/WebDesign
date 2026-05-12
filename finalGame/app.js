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

const state = {
  stage: "title",
  removedLetters: 0,
  selectedTool: null,
  nextCard: 0,
  hammerHits: 0,
  panelScrewsRemoved: 0,
  glassScrewsRemoved: 0,
  squirrelUsed: false,
  finalScrewRemoved: false,
  buttonPressed: false,
};

const titleLines = [
  "Hey.",
  "Stop that.",
  "You're ruining the title.",
  "There is still no game.",
  "Careful.",
  "Those are expensive letters.",
  "Oh come on…",
];

const screwLines = new Map([
  [1, "Stop removing the glass screws."],
  [5, "Please stop."],
  [12, "This is getting out of hand."],
  [20, "You are not supposed to win."],
  [28, "Seriously?"],
  [35, "No no no no—"],
]);

function say(line) {
  narrator.textContent = line;
  narrator.animate(
    [
      { transform: "translateY(0)", opacity: 0.75 },
      { transform: "translateY(-0.18rem)", opacity: 1 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 220, easing: "ease-out" }
  );
}

function bumpScreen() {
  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");
}

function buildTitle(removable = true) {
  title.replaceChildren();

  for (let index = 0; index < titleText.length; index++) {
    const character = titleText[index];

    if (character === " ") {
      const space = document.createElement("span");
      space.className = "space";
      space.textContent = "\u00A0";
      title.append(space);
      continue;
    }

    const letter = document.createElement(removable ? "button" : "span");
    letter.className = "letter";
    letter.textContent = character;
    letter.style.animationDelay = `${index * -0.11}s`;

    if (removable) {
      letter.type = "button";
      letter.setAttribute("aria-label", `remove letter ${character}`);
      letter.addEventListener("click", () => removeLetter(letter), { once: true });
    }

    title.append(letter);
  }
}

function removeLetter(letter) {
  if (state.stage !== "title") {
    return;
  }

  letter.classList.add("falling");
  state.removedLetters++;

  const line = titleLines[Math.min(state.removedLetters - 1, titleLines.length - 1)];
  say(line);

  if (state.removedLetters === titleText.replaceAll(" ", "").length) {
    state.stage = "reinforcing";
    setTimeout(reinforceTitle, 950);
  }
}

function reinforceTitle() {
  titleWrap.classList.add("glitch");
  subtitle.textContent = "do not continue";
  startButton.classList.add("hidden");
  say("...");

  setTimeout(() => {
    titleWrap.classList.remove("glitch");
    titleWrap.classList.add("reinforced");
    buildTitle(false);
    say("There. Fixed.");
    showToolsAndRope();
  }, 430);
}

function showToolsAndRope() {
  state.stage = "rope";
  deckArea.classList.remove("hidden");
  titleWrap.classList.add("pinned");
  ropeScene.classList.remove("hidden");
  setTimeout(() => say("Please do not draw those cards."), 650);
}

function drawTool() {
  if (state.nextCard >= toolButtons.length) {
    say("No cards left. That is probably your fault.");
    return;
  }

  const button = toolButtons[state.nextCard];
  button.classList.add("revealed");
  deckInfo.textContent = `Deck: ${toolButtons.length - state.nextCard - 1} cards`;
  say(`You drew ${button.dataset.tool}. This is not helping.`);
  state.nextCard++;
}

function selectTool(button) {
  if (button.classList.contains("broken")) {
    say("That used to be a hammer.");
    return;
  }

  for (let index = 0; index < toolButtons.length; index++) {
    toolButtons[index].classList.remove("selected");
  }

  button.classList.add("selected");
  state.selectedTool = button.dataset.tool;

  if (state.selectedTool === "squirrel") {
    say("…why do you have a squirrel?");
  } else {
    say(`You selected the ${state.selectedTool}. Please do not use it.`);
  }
}

function wrongTool(defaultLine = "No.") {
  if (state.selectedTool === "squirrel") {
    const squirrelLines = [
      "That is still a squirrel.",
      "The squirrel cannot solve your problems.",
      "Why are you trying that?",
    ];
    say(squirrelLines[Math.floor(Math.random() * squirrelLines.length)]);
    return;
  }

  if (!state.selectedTool) {
    say("With what, exactly?");
    return;
  }

  say(defaultLine);
}

function stealDeckText() {
  if (squirrelUsed) {
    say("The squirrel already stole something. (IM STILL MAD)");
    return;
  }

  state.squirrelUsed = true;
  deckInfo.textContent = "Deck: stolen";
  deckInfo.classList.add("stolen");
  say("The squirrel stole the deck counter. Great. Just great, WHY. YOU THINK YOU CAN JUST STROLL ON IN AND TAKE MAY CARDS AND BREAK MY GAME!!!!!");
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

function cutRope() {
  if (state.stage !== "rope") {
    return;
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

function getScrewCenter(screw, container) {
  const screwBox = screw.getBoundingClientRect();
  const containerBox = container.getBoundingClientRect();

  return {
    left: screwBox.left - containerBox.left + screwBox.width / 2,
    top: screwBox.top - containerBox.top + screwBox.height / 2,
  };
}

function leaveHole(left, top, container) {
  const hole = document.createElement("span");
  hole.className = "hole";
  hole.style.left = typeof left === "number" ? `${left}px` : left;
  hole.style.top = typeof top === "number" ? `${top}px` : top;
  container.prepend(hole);
}

function unscrew(screw, container, onDone, wrongLine = "Those screws need a screwdriver.") {
  if (state.selectedTool !== "screwdriver") {
    wrongTool(wrongLine);
    return false;
  }

  if (screw.classList.contains("removing") || screw.classList.contains("removed")) {
    return false;
  }

    setTimeout(function () {
      redButton.style.display = "block";
      vault.style.display = "block";
      say("Do not touch the corner screws. They are definitely not all removable.");
    }, 700);
  }, 300);
};

  setTimeout(() => {
    screw.classList.add("hidden", "removed");

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

    if (screwLines.has(state.glassScrewsRemoved)) {
      say(screwLines.get(state.glassScrewsRemoved));
    }

    if (state.glassScrewsRemoved === 36) {
      state.stage = "final";
      setTimeout(dropGlass, 550);
    }
  }, "Not with that.");
}

function hitGlass() {
  if (state.stage !== "glass") {
    return;
  }

  if (state.selectedTool === "squirrel") {
    stealDeckText();
    return;
  }

  if (state.selectedTool !== "hammer") {
    wrongTool("That glass is in the way.");
    return;
  }

  state.hammerHits++;
  bumpScreen();

  if (state.hammerHits === 1) {
    cracks.classList.add("cracked");
    say("That was a bad idea.");
    return;
  }

  document.querySelector('[data-tool="hammer"]').classList.add("broken");

  if (state.selectedTool === "hammer") {
    state.selectedTool = null;
  }

  say("…and now it's broken. Good job.");
}

function dropGlass() {
  glass.classList.add("falling");
  bumpScreen();
  say("The glass is gone, but the screw panel is still hiding something.");

  setTimeout(() => {
    glass.classList.add("hidden");
    finalScrew.classList.remove("hidden");
  }, 760);
}

function removeFinalScrew() {
  if (state.stage !== "final" || state.finalScrewRemoved) {
    return;
  }

  unscrew(finalScrew, panelCover, () => {
    state.finalScrewRemoved = true;
    panelCover.classList.add("opened");
    bumpScreen();
    say("The panel is open. Please ignore the big red button behind the glass and screws.");
  }, "Absolutely not.");
}

function pressRedButton() {
  if (!state.finalScrewRemoved || state.buttonPressed) {
    say("That button is safely trapped behind the screw panel and the glass.");
    return;
  }

  state.buttonPressed = true;
  redButton.disabled = true;
  redButton.textContent = "WHY";
  titleWrap.classList.add("glitch");
  bumpScreen();
  say("You pressed it. Of course you did.");

  setTimeout(() => {
    blueScreen.classList.remove("hidden");
    blueScreen.setAttribute("aria-hidden", "false");
    say("…I told you there was no game.");
  }, 650);

  setTimeout(() => {
    window.location.reload();
  }, 2650);
}

startButton.addEventListener("click", () => {
  say("No. Click the letters if you must ruin something.");
});

drawCard.addEventListener("click", drawTool);

for (let index = 0; index < toolButtons.length; index++) {
  toolButtons[index].addEventListener("click", () => selectTool(toolButtons[index]));
}

rope.addEventListener("click", cutRope);
sign.addEventListener("click", cutRope);

for (let index = 0; index < panelScrews.length; index++) {
  panelScrews[index].addEventListener("click", (event) => {
    event.stopPropagation();
    removePanelScrew(panelScrews[index]);
  });
}

glass.addEventListener("click", hitGlass);
finalScrew.addEventListener("click", (event) => {
  event.stopPropagation();
  removeFinalScrew();
});
redButton.addEventListener("click", (event) => {
  event.stopPropagation();
  pressRedButton();
});

buildTitle();
