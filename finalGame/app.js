const titleText = "THERE IS NO GAME";
const title = document.querySelector("#title");
const titleWrap = document.querySelector("#titleWrap");
const subtitle = document.querySelector("#subtitle");
const startButton = document.querySelector("#startButton");
const narrator = document.querySelector("#narrator");
const deckArea = document.querySelector("#deckArea");
const drawCard = document.querySelector("#drawCard");
const deckInfo = document.querySelector("#deckInfo");
const ropeScene = document.querySelector("#ropeScene");
const rope = document.querySelector("#rope");
const sign = document.querySelector("#sign");
const vaultScene = document.querySelector("#vaultScene");
const panelCover = document.querySelector("#panelCover");
const panelScrews = document.querySelectorAll(".panel-screw");
const glass = document.querySelector("#glass");
const cracks = document.querySelector("#cracks");
const screwField = document.querySelector("#screwField");
const finalScrew = document.querySelector("#finalScrew");
const redButton = document.querySelector("#redButton");
const blueScreen = document.querySelector("#blueScreen");
const toolButtons = document.querySelectorAll(".tool");
const audioDirectory = "audio/";
const screwRemovalMs = 520;
const toolDeck = shuffle(Array.from(toolButtons));
let currentVoiceAudio = null;
const state = {
  stage: "title",
  removedLetters: 0,
  selectedTool: null,
  cardsDrawn: 0,
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

const drawVoiceIds = {
  scissors: "3a",
  hammer: "3b",
  screwdriver: "3c",
  squirrel: "3d",
};

const selectVoiceIds = {
  scissors: "4a",
  hammer: "4b",
  screwdriver: "4c",
  squirrel: "4d",
};

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function playVoiceLine(voiceId) {
  if (!voiceId) {
    return;
  }

  if (currentVoiceAudio) {
    currentVoiceAudio.pause();
    currentVoiceAudio.currentTime = 0;
  }

  currentVoiceAudio = new Audio(`${audioDirectory}${voiceId}.mp3`);
  currentVoiceAudio.volume = 0.9;
  void currentVoiceAudio.play().catch(() => {});
}

function say(line, voiceId) {
  narrator.textContent = line;
  playVoiceLine(voiceId);
  narrator.animate(
    [
      { transform: "translateY(0)", opacity: 0.75 },
      { transform: "translateY(-0.18rem)", opacity: 1 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 220, easing: "ease-out" },
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
      letter.addEventListener("click", () => removeLetter(letter), {
        once: true,
      });
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

  const line =
    titleLines[Math.min(state.removedLetters - 1, titleLines.length - 1)];
  say(line, `2${String.fromCharCode(96 + Math.min(state.removedLetters, 2))}`);

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
    say("There. Fixed.", "1b");
    showToolsAndRope();
  }, 430);
}

function showToolsAndRope() {
  state.stage = "rope";
  deckArea.classList.remove("hidden");
  titleWrap.classList.add("pinned");
  ropeScene.classList.remove("hidden");
  setTimeout(() => say("Please do not draw those cards.", "2c"), 650);
}

function drawTool() {
  if (state.cardsDrawn >= toolDeck.length) {
    drawCard.classList.add("hidden");
    drawCard.disabled = true;
    say("No cards left. That is probably your fault.");
    return;
  }

  const button = toolDeck[state.cardsDrawn];
  const remainingCards = toolDeck.length - state.cardsDrawn - 1;
  button.classList.add("revealed");
  deckInfo.textContent = `Deck: ${remainingCards} cards`;
  say(
    `You drew ${button.dataset.tool}. This is not helping.`,
    drawVoiceIds[button.dataset.tool],
  );
  state.cardsDrawn++;

  if (state.cardsDrawn >= toolDeck.length) {
    drawCard.classList.add("hidden");
    drawCard.disabled = true;
  }
}

function selectTool(button) {
  if (button.classList.contains("broken")) {
    say("That used to be a hammer.", "9b");
    return;
  }

  for (let index = 0; index < toolButtons.length; index++) {
    toolButtons[index].classList.remove("selected");
  }

  button.classList.add("selected");
  state.selectedTool = button.dataset.tool;

  if (state.selectedTool === "squirrel") {
    say("…why do you have a squirrel?", "4d");
  } else {
    say(
      `You selected the ${state.selectedTool}. Please do not use it.`,
      selectVoiceIds[state.selectedTool],
    );
  }
}

function wrongTool(defaultLine = "No.") {
  if (state.selectedTool === "squirrel") {
    const squirrelLines = [
      "That is still a squirrel.",
      "The squirrel cannot solve your problems.",
      "Why are you trying that?",
    ];
    say(squirrelLines[Math.floor(Math.random() * squirrelLines.length)], "4d");
    return;
  }

  if (!state.selectedTool) {
    say("With what, exactly?", "6a");
    return;
  }

  say(defaultLine);
}

function stealDeckText() {
  if (state.squirrelUsed) {
    say("The squirrel already stole something.", "5a");
    return;
  }

  state.squirrelUsed = true;
  deckInfo.textContent = "Deck: stolen";
  deckInfo.classList.add("stolen");
  say("The squirrel stole the deck counter. Great. Very useful.", "5a");
}

function cutRope() {
  if (state.stage !== "rope") {
    return;
  }

  if (state.selectedTool === "squirrel") {
    stealDeckText();
    return;
  }

  if (state.selectedTool !== "scissors") {
    wrongTool("That won't cut it.");
    return;
  }

  state.stage = "panel";
  rope.classList.add("snapped");
  sign.classList.add("fallen");
  bumpScreen();
  say("Wait— You weren't supposed to do that.", "6b");

  setTimeout(() => {
    ropeScene.classList.add("hidden");
    vaultScene.classList.remove("hidden");
    say(
      "Do not touch the panel screws. Every one of them is very important.",
      "8a",
    );
  }, 850);
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

function unscrew(
  screw,
  container,
  onDone,
  wrongLine = "Those screws need a screwdriver.",
) {
  if (state.selectedTool !== "screwdriver") {
    wrongTool(wrongLine);
    return false;
  }

  if (
    screw.classList.contains("removing") ||
    screw.classList.contains("removed")
  ) {
    return false;
  }

  const center = getScrewCenter(screw, container);
  screw.classList.add("removing");
  leaveHole(center.left, center.top, container);

  setTimeout(() => {
    screw.classList.add("hidden", "removed");

    if (onDone) {
      onDone();
    }
  }, screwRemovalMs);

  return true;
}

function removePanelScrew(screw) {
  if (state.stage !== "panel") {
    return;
  }

  unscrew(
    screw,
    panelCover,
    () => {
      state.panelScrewsRemoved++;
      say("Stop. Please stop.", "8b");

      if (state.panelScrewsRemoved === panelScrews.length) {
        state.stage = "glass";
        setTimeout(() => {
          glass.classList.remove("hidden");
          createGlassScrews();
          say(
            "Oh no. Screws around the glass. All of them come out too.",
            "8c",
          );
        }, 350);
      }
    },
    "Those panel screws need a screwdriver.",
  );
}

function createGlassScrews() {
  screwField.replaceChildren();
  state.glassScrewsRemoved = 0;

  const rings = [
    { count: 8, radius: 24 },
    { count: 12, radius: 35 },
    { count: 16, radius: 46 },
  ];

  for (let ringIndex = 0; ringIndex < rings.length; ringIndex++) {
    const ring = rings[ringIndex];

    for (let index = 0; index < ring.count; index++) {
      const angle =
        (Math.PI * 2 * index) / ring.count - Math.PI / 2 + ringIndex * 0.08;
      const x = 50 + Math.cos(angle) * ring.radius;
      const y = 50 + Math.sin(angle) * ring.radius;
      const screw = document.createElement("button");
      screw.type = "button";
      screw.className = "screw ring-screw";
      screw.style.left = `${x}%`;
      screw.style.top = `${y}%`;
      screw.setAttribute("aria-label", "glass cover screw");
      screw.addEventListener("click", (event) => {
        event.stopPropagation();
        removeGlassScrew(screw);
      });
      screwField.append(screw);
    }
  }
}

function removeGlassScrew(screw) {
  if (state.stage !== "glass") {
    return;
  }

  unscrew(
    screw,
    screwField,
    () => {
      state.glassScrewsRemoved++;

      if (screwLines.has(state.glassScrewsRemoved)) {
        say(screwLines.get(state.glassScrewsRemoved), "8d");
      }

      if (state.glassScrewsRemoved === 36) {
        state.stage = "final";
        setTimeout(dropGlass, 550);
      }
    },
    "Not with that.",
  );
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
    say("That was a bad idea.", "9a");
    return;
  }

  document.querySelector('[data-tool="hammer"]').classList.add("broken");

  if (state.selectedTool === "hammer") {
    state.selectedTool = null;
  }

  say("…and now it's broken. Good job.", "9b");
}

function dropGlass() {
  glass.classList.add("falling");
  bumpScreen();
  say(
    "The glass is gone, but the screw panel is still hiding something.",
    "8e",
  );

  setTimeout(() => {
    glass.classList.add("hidden");
    finalScrew.classList.remove("hidden");
  }, 760);
}

function removeFinalScrew() {
  if (state.stage !== "final" || state.finalScrewRemoved) {
    return;
  }

  unscrew(
    finalScrew,
    panelCover,
    () => {
      state.finalScrewRemoved = true;
      panelCover.classList.add("opened");
      bumpScreen();
      say(
        "The panel is open. Please ignore the big red button behind the glass and screws.",
        "10a",
      );
    },
    "Absolutely not.",
  );
}

function pressRedButton() {
  if (!state.finalScrewRemoved || state.buttonPressed) {
    say("That button is safely trapped behind the screw panel and the glass.");
    return;
  }

  state.buttonPressed = true;
  redButton.disabled = true;
  redButton.textContent = "WHY";
  redButton.classList.add("pressed");
  setTimeout(() => redButton.classList.add("hidden"), 240);
  titleWrap.classList.add("glitch");
  bumpScreen();
  say("You pressed it. Of course you did.", "10a");

  setTimeout(() => {
    blueScreen.classList.remove("hidden");
    blueScreen.setAttribute("aria-hidden", "false");
    say("…I told you there was no game.", "10b");
  }, 650);

  setTimeout(() => {
    window.location.reload();
  }, 2650);
}


startButton.addEventListener("click", () => {
  say("No. Click the letters if you must ruin something.", "1a");
});

drawCard.addEventListener("click", drawTool);

for (let index = 0; index < toolButtons.length; index++) {
  toolButtons[index].addEventListener("click", () =>
    selectTool(toolButtons[index]),
  );
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
