const state = {
  clicks: 0,
  tool: null,
  ropeCut: false,
  firstScrewRemoved: false,
  screwsRemoved: 0,
  hammerHits: 0,
  hammerBroken: false,
  finalScrewReady: false,
};

const el = {
  app: document.getElementById("app"),
  voice: document.getElementById("voice"),
  start: document.getElementById("start"),
  title: document.getElementById("title"),
  arena: document.getElementById("arena"),
  rope: document.getElementById("rope"),
  sign: document.getElementById("sign"),
  vault: document.getElementById("vault"),
  firstScrew: document.getElementById("firstScrew"),
  glass: document.getElementById("glass"),
  tools: document.getElementById("tools"),
  blueScreen: document.getElementById("blueScreen"),
};

const toolNames = ["scissors", "hammer", "screwdriver", "squirrel"];

function speak(text) {
  el.voice.textContent = text;
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.97;
    u.pitch = 0.68;
    speechSynthesis.speak(u);
  }
}

function setupFallingTitle() {
  const chars = [..."THERE IS NO GAME"];
  el.title.innerHTML = "";
  chars.forEach((ch) => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.title.appendChild(span);
  });

  setTimeout(() => {
    [...el.title.querySelectorAll(".letter")].forEach((node, i) => {
      setTimeout(() => node.classList.add("fall"), i * 80);
    });
  }, 1500);
}

function wrongClick() {
  const lines = [
    "Why are you clicking? There’s nothing to do.",
    "I told you… this is not a game.",
    "Still clicking? You’re very determined for no reason.",
  ];
  speak(lines[Math.min(state.clicks, 2)]);
  state.clicks += 1;
}

function buildTools() {
  el.tools.innerHTML = "";
  for (const tool of toolNames) {
    const card = document.createElement("button");
    card.className = "tool";
    card.textContent = tool[0].toUpperCase() + tool.slice(1);
    card.dataset.tool = tool;
    card.type = "button";
    card.addEventListener("click", () => selectTool(tool));
    el.tools.appendChild(card);
  }
}

function selectTool(tool) {
  if (tool === "hammer" && state.hammerBroken) return;

  state.tool = tool;
  for (const card of el.tools.querySelectorAll(".tool")) {
    card.classList.toggle("active", card.dataset.tool === tool);
  }

  if (tool === "squirrel") {
    speak("…that’s a squirrel. Why would that help?");
  } else {
    speak("Oh great. Now you have tools. That definitely won’t help.");
  }

  document.body.style.cursor =
    tool === "screwdriver" ? "crosshair" :
    tool === "hammer" ? "grab" :
    tool === "scissors" ? "cell" : "help";
}

function createGlassScrews() {
  el.glass.innerHTML = "";
  state.screwsRemoved = 0;

  for (let i = 0; i < 36; i++) {
    const screw = document.createElement("div");
    screw.className = "mini-screw";
    screw.style.left = `${Math.random() * 250}px`;
    screw.style.top = `${Math.random() * 200}px`;

    screw.addEventListener("click", (event) => {
      event.stopPropagation();

      if (state.tool !== "screwdriver") {
        speak("Use the screwdriver. Obviously.");
        return;
      }

      screw.remove();
      state.screwsRemoved += 1;

      if (state.screwsRemoved === 1) {
        speak("This is getting out of hand. You’re not supposed to win.");
      }

      if (state.screwsRemoved === 36) {
        el.glass.style.display = "none";
        state.finalScrewReady = true;

        const finalScrew = document.createElement("div");
        finalScrew.className = "screw";
        finalScrew.id = "finalScrew";
        finalScrew.style.left = "calc(50% - 12px)";
        finalScrew.style.top = "calc(50% - 12px)";
        finalScrew.addEventListener("click", () => {
          if (state.tool !== "screwdriver") {
            speak("Not like that.");
            return;
          }
          finalScrew.remove();
          speak("No no no no—");
          setTimeout(triggerCrash, 450);
        });

        el.vault.appendChild(finalScrew);
        speak("Don’t you dare…");
      }
    });

    el.glass.appendChild(screw);
  }
}

function triggerCrash() {
  el.blueScreen.style.display = "grid";
  speak("I told you there was no game.");
  setTimeout(() => window.location.reload(), 2000);
}

function boot() {
  setupFallingTitle();
  speak("There is no game. Seriously… there is nothing here. You should probably stop.");

  el.start.addEventListener("click", wrongClick);
  el.arena.addEventListener("click", (e) => {
    if (e.target === el.arena) wrongClick();
  });

  setTimeout(() => {
    el.start.innerHTML = `
      <div>
        <h1>THERE IS NO GAME</h1>
        <p class="subtitle">don’t click to start</p>
      </div>`;

    el.arena.style.display = "block";
    el.tools.style.display = "flex";
    buildTools();
    speak("Oh great. Now you have tools. That definitely won’t help.");
  }, 3300);

  el.rope.addEventListener("click", (e) => {
    e.stopPropagation();

    if (state.tool === "scissors" && !state.ropeCut) {
      state.ropeCut = true;
      el.rope.style.display = "none";
      speak("Wait— You weren’t supposed to do that.");

      setTimeout(() => {
        el.sign.classList.add("fall");
        speak("That was… not intended.");

        setTimeout(() => {
          el.vault.style.display = "block";
          speak("That’s just decoration. Don’t touch it.");
        }, 850);
      }, 250);
    } else {
      speak("That rope is decorative. Leave it alone.");
    }
  });

  el.firstScrew.addEventListener("click", (e) => {
    e.stopPropagation();

    if (state.tool !== "screwdriver") {
      speak("You might need a more pointy thought.");
      return;
    }

    el.firstScrew.remove();
    state.firstScrewRemoved = true;
    speak("Stop. Please stop.");

    setTimeout(() => {
      el.glass.style.display = "block";
      createGlassScrews();
      speak("Oh no. You broke something important.");
    }, 500);
  });

  el.glass.addEventListener("click", () => {
    if (state.tool === "hammer") {
      state.hammerHits += 1;
      el.app.classList.add("shake");
      setTimeout(() => el.app.classList.remove("shake"), 350);

      if (state.hammerHits === 1) {
        el.glass.classList.add("cracked");
        speak("That was a bad idea.");
      } else if (state.hammerHits === 2) {
        state.hammerBroken = true;
        const hammerCard = el.tools.querySelector('[data-tool="hammer"]');
        if (hammerCard) hammerCard.classList.add("broken");
        if (state.tool === "hammer") state.tool = null;
        speak("…and now it’s broken. Good job.");
      }
      return;
    }

    if (state.tool === "squirrel") {
      speak("why do you have a squirrel?");
      return;
    }

    if (state.tool !== "screwdriver") {
      speak("Random smashing is not progress. Or is it?");
    }
  });
}

boot();
