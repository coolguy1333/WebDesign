// Simple game state (beginner friendly)
const state = {
  tool: null,
  ropeCut: false,
  hammerHits: 0,
  screwsRemoved: 0,
  lettersDone: 0,
  deck: ["scissors", "hammer", "screwdriver", "squirrel"],
  drawn: [],
  stolen: false
};

// Grab elements once
const title = document.getElementById("title");
const start = document.getElementById("start");
const voice = document.getElementById("voice");
const arena = document.getElementById("arena");
const rope = document.getElementById("rope");
const sign = document.getElementById("sign");
const vault = document.getElementById("vault");
const firstScrew = document.getElementById("firstScrew");
const glass = document.getElementById("glass");
const blue = document.getElementById("blueScreen");
const deckArea = document.getElementById("deckArea");
const drawCard = document.getElementById("drawCard");
const deckInfo = document.getElementById("deckInfo");
const tools = document.getElementById("tools");

// Voice lines in one place
const lines = {
  start: "There is no game. Seriously… there is nothing here. You should probably stop.",
  click1: "Why are you clicking? There’s nothing to do.",
  click2: "I told you… this is not a game.",
  tools: "Oh great. Now you have tools. That definitely won’t help.",
  squirrel: "…that’s a squirrel. Why would that help?",
  steal: "HEY! The squirrel stole your sign. Why do you even have that thing?",
  cut: "Wait— You weren’t supposed to do that.",
  fall: "That was… not intended.",
  vault: "That’s just decoration. Don’t touch it.",
  unscrew: "Stop. Please stop.",
  glass: "Oh no. You broke something important.",
  hit1: "That was a bad idea.",
  hit2: "…and now it’s broken. Good job.",
  removing: "This is getting out of hand. You’re not supposed to win.",
  final: "Don’t you dare…",
  preCrash: "No no no no—",
  blue: "I told you there was no game."
};

function say(text) {
  voice.textContent = text;
}

function buildClickableTitle() {
  const text = "THERE IS NO GAME";
  title.innerHTML = "";

  for (const ch of text) {
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = ch === " " ? "\u00A0" : ch;

    if (ch !== " ") {
      letter.addEventListener("click", () => {
        if (letter.classList.contains("done")) return;

        letter.classList.add("done");
        state.lettersDone++;

        if (state.lettersDone > 5) {
          say(lines.click2);
        } else {
          say(lines.click1);
        }

        if (state.lettersDone === 11) {
          startGame();
        }
      });
    }

    title.appendChild(letter);
  }
}

function startGame() {
  start.innerHTML = '<h1>THERE IS NO GAME</h1><p class="subtitle">don’t click to start</p>';
  arena.style.display = "block";
  deckArea.style.display = "block";
  say(lines.tools);
}

function renderTools() {
  tools.innerHTML = "";

  for (const toolName of state.drawn) {
    const btn = document.createElement("button");
    btn.className = "tool";
    btn.textContent = toolName;
    btn.dataset.tool = toolName;

    btn.addEventListener("click", () => {
      selectTool(toolName);
    });

    tools.appendChild(btn);
  }
}

function selectTool(toolName) {
  state.tool = toolName;

  const allButtons = document.querySelectorAll(".tool");
  allButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tool === toolName);
  });

  if (toolName === "squirrel") {
    say(lines.squirrel);
  }
}

function drawTool() {
  if (state.deck.length === 0) {
    say("No more cards in the deck.");
    return;
  }

  const tool = state.deck.shift();
  state.drawn.push(tool);

  deckInfo.textContent = `Deck: ${state.deck.length} cards`;
  renderTools();

  if (tool === "squirrel") {
    say(lines.squirrel);
  } else {
    say(`You drew ${tool}. This won't end badly.`);
  }
}

function squirrelSteal() {
  if (state.stolen) return;
  state.stolen = true;

  const target = sign.style.display !== "none" ? sign : deckInfo;
  const ghost = target.cloneNode(true);

  ghost.style.position = "absolute";
  ghost.style.left = (target.offsetLeft || 40) + "px";
  ghost.style.top = (target.offsetTop || 100) + "px";
  ghost.style.opacity = "1";
  ghost.style.transition = "transform 1s ease, opacity 1s";

  arena.appendChild(ghost);
  target.style.visibility = "hidden";

  setTimeout(() => {
    ghost.style.transform = "translate(240px,-140px) rotate(-25deg)";
    ghost.style.opacity = "0";
  }, 30);

  setTimeout(() => {
    ghost.remove();
  }, 1100);

  say(lines.steal);
}

function createRowScrews() {
  glass.innerHTML = "";
  state.screwsRemoved = 0;

  const cols = 6;
  const rows = 6;
  const startX = 18;
  const startY = 18;
  const gapX = 46;
  const gapY = 36;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const screw = document.createElement("div");
      screw.className = "mini-screw";
      screw.style.left = startX + c * gapX + "px";
      screw.style.top = startY + r * gapY + "px";

      screw.addEventListener("click", (e) => {
        e.stopPropagation();

        if (state.tool !== "screwdriver") {
          say("Use the screwdriver.");
          return;
        }

        screw.remove();
        state.screwsRemoved++;

        if (state.screwsRemoved === 1) {
          say(lines.removing);
        }

        if (state.screwsRemoved === 36) {
          glass.style.display = "none";

          const finalScrew = document.createElement("div");
          finalScrew.className = "screw";
          finalScrew.style.left = "calc(50% - 10px)";
          finalScrew.style.top = "calc(50% - 10px)";
          vault.appendChild(finalScrew);

          say(lines.final);

          finalScrew.addEventListener("click", () => {
            if (state.tool !== "screwdriver") return;

            finalScrew.remove();
            say(lines.preCrash);

            setTimeout(() => {
              blue.style.display = "grid";
              say(lines.blue);

              setTimeout(() => {
                location.reload();
              }, 2000);
            }, 400);
          });
        }
      });

      glass.appendChild(screw);
    }
  }
}

rope.addEventListener("click", (e) => {
  e.stopPropagation();

  if (state.tool !== "scissors" || state.ropeCut) {
    say("That rope is decorative. Leave it alone.");
    return;
  }

  state.ropeCut = true;
  rope.style.display = "none";
  say(lines.cut);

  setTimeout(() => {
    sign.classList.add("fall");
    say(lines.fall);

    setTimeout(() => {
      vault.style.display = "block";
      say(lines.vault);
    }, 800);
  }, 250);
});

firstScrew.addEventListener("click", (e) => {
  e.stopPropagation();

  if (state.tool !== "screwdriver") {
    say("You might need a screwdriver.");
    return;
  }

  firstScrew.remove();
  say(lines.unscrew);

  setTimeout(() => {
    glass.style.display = "block";
    createRowScrews();
    say(lines.glass);
  }, 500);
});

glass.addEventListener("click", () => {
  if (state.tool === "hammer") {
    state.hammerHits++;

    if (state.hammerHits === 1) {
      glass.classList.add("cracked");
      say(lines.hit1);
    } else if (state.hammerHits === 2) {
      const hammerBtn = [...document.querySelectorAll(".tool")].find((btn) => btn.dataset.tool === "hammer");
      if (hammerBtn) hammerBtn.classList.add("broken");
      if (state.tool === "hammer") state.tool = null;
      say(lines.hit2);
    }
  } else if (state.tool === "squirrel") {
    squirrelSteal();
  }
});

arena.addEventListener("click", () => {
  if (state.tool === "squirrel") {
    squirrelSteal();
  }
});

drawCard.addEventListener("click", drawTool);

buildClickableTitle();
say(lines.start);
