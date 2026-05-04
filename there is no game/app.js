const state = {
  tool: null,
  clicks: 0,
  ropeCut: false,
  hammerHits: 0,
  screwsRemoved: 0,
};

const title = document.getElementById("title");
const start = document.getElementById("start");
const voice = document.getElementById("voice");
const arena = document.getElementById("arena");
const tools = document.getElementById("tools");
const rope = document.getElementById("rope");
const sign = document.getElementById("sign");
const vault = document.getElementById("vault");
const firstScrew = document.getElementById("firstScrew");
const glass = document.getElementById("glass");
const blue = document.getElementById("blueScreen");

function say(text) {
  voice.textContent = text;
}

function makeTitleFall() {
  title.innerHTML = "";
  const text = "THERE IS NO GAME";
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = text[i] === " " ? "\u00A0" : text[i];
    title.appendChild(span);
  }

  setTimeout(() => {
    const letters = document.querySelectorAll("#title .letter");
    letters.forEach((letter, i) => {
      setTimeout(() => letter.classList.add("fall"), i * 70);
    });
  }, 1500);
}

function wrongClick() {
  const lines = [
    "Why are you clicking? There’s nothing to do.",
    "I told you… this is not a game.",
  ];
  say(lines[Math.min(state.clicks, 1)]);
  state.clicks++;
}

function showTools() {
  const list = ["scissors", "hammer", "screwdriver", "squirrel"];
  tools.innerHTML = "";

  list.forEach((name) => {
    const btn = document.createElement("button");
    btn.className = "tool";
    btn.textContent = name;
    btn.dataset.tool = name;
    btn.addEventListener("click", () => selectTool(name));
    tools.appendChild(btn);
  });
}

function selectTool(name) {
  state.tool = name;
  document.querySelectorAll(".tool").forEach((b) => {
    b.classList.toggle("active", b.dataset.tool === name);
  });

  if (name === "squirrel") {
    say("…that’s a squirrel. Why would that help?");
  } else {
    say("Oh great. Now you have tools. That definitely won’t help.");
  }
}

function createGlassScrews() {
  glass.innerHTML = "";
  state.screwsRemoved = 0;

  for (let i = 0; i < 36; i++) {
    const s = document.createElement("div");
    s.className = "mini-screw";
    s.style.left = Math.random() * 245 + "px";
    s.style.top = Math.random() * 200 + "px";

    s.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.tool !== "screwdriver") {
        say("Use the screwdriver.");
        return;
      }

      s.remove();
      state.screwsRemoved++;

      if (state.screwsRemoved === 1) {
        say("This is getting out of hand. You’re not supposed to win.");
      }

      if (state.screwsRemoved === 36) {
        glass.style.display = "none";
        const finalScrew = document.createElement("div");
        finalScrew.className = "screw";
        finalScrew.style.left = "calc(50% - 11px)";
        finalScrew.style.top = "calc(50% - 11px)";
        vault.appendChild(finalScrew);
        say("Don’t you dare…");

        finalScrew.addEventListener("click", () => {
          if (state.tool !== "screwdriver") return;
          finalScrew.remove();
          say("No no no no—");
          setTimeout(() => {
            blue.style.display = "grid";
            say("I told you there was no game.");
            setTimeout(() => location.reload(), 2000);
          }, 400);
        });
      }
    });

    glass.appendChild(s);
  }
}

makeTitleFall();
say("There is no game. Seriously… there is nothing here. You should probably stop.");

start.addEventListener("click", wrongClick);

setTimeout(() => {
  start.innerHTML = '<h1>THERE IS NO GAME</h1><p class="subtitle">don’t click to start</p>';
  arena.style.display = "block";
  tools.style.display = "flex";
  showTools();
  say("Oh great. Now you have tools. That definitely won’t help.");
}, 3300);

rope.addEventListener("click", (e) => {
  e.stopPropagation();
  if (state.tool !== "scissors" || state.ropeCut) {
    say("That rope is decorative. Leave it alone.");
    return;
  }

  state.ropeCut = true;
  rope.style.display = "none";
  say("Wait— You weren’t supposed to do that.");

  setTimeout(() => {
    sign.classList.add("fall");
    say("That was… not intended.");
    setTimeout(() => {
      vault.style.display = "block";
      say("That’s just decoration. Don’t touch it.");
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
  say("Stop. Please stop.");
  setTimeout(() => {
    glass.style.display = "block";
    createGlassScrews();
    say("Oh no. You broke something important.");
  }, 500);
});

glass.addEventListener("click", () => {
  if (state.tool === "hammer") {
    state.hammerHits++;
    if (state.hammerHits === 1) {
      glass.classList.add("cracked");
      say("That was a bad idea.");
    } else if (state.hammerHits === 2) {
      const hammer = document.querySelector('[data-tool="hammer"]');
      hammer.classList.add("broken");
      say("…and now it’s broken. Good job.");
      if (state.tool === "hammer") state.tool = null;
    }
  } else if (state.tool === "squirrel") {
    say("why do you have a squirrel?");
  }
});
