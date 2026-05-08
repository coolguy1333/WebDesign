const titleText = "THERE IS NO GAME";
const title = document.querySelector("#title");
const titleWrap = document.querySelector("#titleWrap");
const subtitle = document.querySelector("#subtitle");
const narrator = document.querySelector("#narrator");
const stage = document.querySelector("#stage");
const toolDeck = document.querySelector("#toolDeck");
const ropeScene = document.querySelector("#ropeScene");
const rope = document.querySelector("#rope");
const sign = document.querySelector("#sign");
const vaultScene = document.querySelector("#vaultScene");
const firstScrew = document.querySelector("#firstScrew");
const glass = document.querySelector("#glass");
const cracks = document.querySelector("#cracks");
const screwField = document.querySelector("#screwField");
const finalScrew = document.querySelector("#finalScrew");
const blueScreen = document.querySelector("#blueScreen");

const state = {
  stage: "title",
  removedLetters: 0,
  selectedTool: null,
  hammerHits: 0,
  hammerBroken: false,
  firstScrewRemoved: false,
  glassScrewsRemoved: 0,
  finalStarted: false,
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
  [...titleText].forEach((character, index) => {
    if (character === " ") {
      const space = document.createElement("span");
      space.className = "space";
      space.textContent = "\u00A0";
      title.append(space);
      return;
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
  });
}

function removeLetter(letter) {
  if (state.stage !== "title") {
    return;
  }

  letter.classList.add("falling");
  state.removedLetters += 1;

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
  toolDeck.classList.remove("hidden");
  titleWrap.classList.add("pinned");
  ropeScene.classList.remove("hidden");
  setTimeout(() => say("Don't touch that."), 650);
}

function selectTool(button) {
  if (button.classList.contains("broken")) {
    say("That used to be a hammer.");
    return;
  }

  document.querySelectorAll(".tool").forEach((tool) => tool.classList.remove("selected"));
  button.classList.add("selected");
  state.selectedTool = button.dataset.tool;

  if (state.selectedTool === "squirrel") {
    say("…why do you have a squirrel?");
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

function cutRope() {
  if (state.stage !== "rope") {
    return;
  }

  if (state.selectedTool !== "scissors") {
    wrongTool("That won't cut it.");
    return;
  }

  state.stage = "vault";
  rope.classList.add("snapped");
  sign.classList.add("fallen");
  bumpScreen();
  say("Wait— You weren't supposed to do that.");

  setTimeout(() => {
    ropeScene.classList.add("hidden");
    vaultScene.classList.remove("hidden");
    say("That's just decoration.");
  }, 850);
}

function removeFirstScrew() {
  if (state.stage !== "vault" || state.firstScrewRemoved) {
    return;
  }

  if (state.selectedTool !== "screwdriver") {
    wrongTool("It's decorative. Obviously.");
    return;
  }

  state.firstScrewRemoved = true;
  firstScrew.classList.add("removing");
  leaveHole(firstScrew.offsetLeft + firstScrew.offsetWidth / 2, firstScrew.offsetTop + firstScrew.offsetHeight / 2, firstScrew.parentElement);
  say("Oh no.");

  setTimeout(() => {
    firstScrew.classList.add("hidden");
    state.stage = "glass";
    glass.classList.remove("hidden");
    createGlassScrews();
  }, 520);
}

function createGlassScrews() {
  screwField.replaceChildren();
  const rings = [
    { count: 8, radius: 24 },
    { count: 12, radius: 35 },
    { count: 16, radius: 46 },
  ];

  rings.forEach((ring, ringIndex) => {
    for (let index = 0; index < ring.count; index += 1) {
      const angle = (Math.PI * 2 * index) / ring.count - Math.PI / 2 + ringIndex * 0.08;
      const x = 50 + Math.cos(angle) * ring.radius;
      const y = 50 + Math.sin(angle) * ring.radius;
      const screw = document.createElement("button");
      screw.type = "button";
      screw.className = "screw ring-screw";
      screw.style.left = `${x}%`;
      screw.style.top = `${y}%`;
      screw.setAttribute("aria-label", "glass cover screw");
      screw.addEventListener("click", () => removeGlassScrew(screw), { once: true });
      screwField.append(screw);
    }
  });
}

function removeGlassScrew(screw) {
  if (state.stage !== "glass") {
    return;
  }

  if (state.selectedTool !== "screwdriver") {
    wrongTool("Not with that.");
    screw.addEventListener("click", () => removeGlassScrew(screw), { once: true });
    return;
  }

  state.glassScrewsRemoved += 1;
  screw.classList.add("removing");
  leaveHole(screw.style.left, screw.style.top, screwField);

  if (screwLines.has(state.glassScrewsRemoved)) {
    say(screwLines.get(state.glassScrewsRemoved));
  }

  if (state.glassScrewsRemoved === 36) {
    state.stage = "final";
    setTimeout(dropGlass, 550);
  }
}

function leaveHole(left, top, container) {
  const hole = document.createElement("span");
  hole.className = "hole";
  hole.style.left = typeof left === "number" ? `${left}px` : left;
  hole.style.top = typeof top === "number" ? `${top}px` : top;
  container.prepend(hole);
}

function hitGlass() {
  if (state.stage !== "glass" || state.selectedTool !== "hammer") {
    return;
  }

  state.hammerHits += 1;
  bumpScreen();

  if (state.hammerHits === 1) {
    cracks.classList.add("cracked");
    say("That was a bad idea.");
    return;
  }

  state.hammerBroken = true;
  document.querySelector('[data-tool="hammer"]').classList.add("broken");
  if (state.selectedTool === "hammer") {
    state.selectedTool = null;
  }
  say("…and now it's broken. Good job.");
}

function dropGlass() {
  glass.classList.add("falling");
  bumpScreen();
  say("Don't you dare.");

  setTimeout(() => {
    glass.classList.add("hidden");
    finalScrew.classList.remove("hidden");
  }, 760);
}

function startCrash() {
  if (state.stage !== "final" || state.finalStarted) {
    return;
  }

  if (state.selectedTool !== "screwdriver") {
    wrongTool("Absolutely not.");
    return;
  }

  state.finalStarted = true;
  finalScrew.classList.add("removing");
  say("No no no no—");

  setTimeout(() => {
    titleWrap.classList.add("glitch");
    bumpScreen();
  }, 900);

  setTimeout(() => {
    blueScreen.classList.remove("hidden");
    blueScreen.setAttribute("aria-hidden", "false");
    say("…I told you there was no game.");
  }, 1700);

  setTimeout(() => {
    window.location.reload();
  }, 3700);
}

document.querySelectorAll(".tool").forEach((button) => {
  button.addEventListener("click", () => selectTool(button));
});

rope.addEventListener("click", cutRope);
sign.addEventListener("click", cutRope);
firstScrew.addEventListener("click", removeFirstScrew);
glass.addEventListener("click", hitGlass);
finalScrew.addEventListener("click", startCrash);

buildTitle();
