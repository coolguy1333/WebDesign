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
const pauseButton = document.getElementById("pauseButton");
const pauseFlash = document.getElementById("pauseFlash");
const toolButtons = document.querySelectorAll(".tool");
const letters = document.querySelectorAll("#titleLetters span");

const toolDeck = Array.from(toolButtons);
const voiceAudio = new Audio();
const toolCursor = document.createElement("div");
const toolMessages = {
  scissors: {
    draw: ["You drew scissors... How will that help.", "3a"],
    select: ["You selected the scissors... Please do not use it.", "4a"]
  },
  hammer: {
    draw: ["You drew hammer... Don't break the game.", "3b"],
    select: ["You selected the hammer... I hope it breaks", "4b"]
  },
  screwdriver: {
    draw: ["You drew screwdriver... For what?.", "3c"],
    select: ["You selected the screwdriver? Why?.", "4c"]
  },
  squirrel: {
    draw: ["You drew squirrel... Wait... Thats in the deck???", "3d"],
    select: ["That is a squirrel wearing a tool belt made of stolen receipts.", "4d"]
  }
};
const letterLines = [
  ["Stop clicking the title. Those letters are not buttons.", "2a"],
  ["HEY those are EXPENSIVE! I rented that alphabet.", "2b"],
  ["That letter had a family. Mostly vowels, but still.", "2e"],
  ["Please stop alphabet vandalism before the title becomes interpretive dance.", "2f"],
  ["I am running out of letters and emotional support pixels.", "2g"]
];
const screwProgressLines = [
  [1, "Stop removing the glass screws you're not supposed to do that.", "8d"],
  [6, "Six screws gone. The glass is now held on by spite and bad planning.", "8f"],
  [12, "Twelve screws. Did you bring snacks for this hardware marathon?", "8g"],
  [18, "Halfway through thirty-six screws. This is not gameplay, this is a 9 to 5 job simulator.", "8h"],
  [27, "Twenty-seven screws. The screwdriver is filing a complaint with management.", "8i"],
  [35, "One glass screw left. Do not get dramatic. Actually, no, you will.", "8j"]
];
const imageProps = [
  [rope, "rope"],
  [sign, "sign"],
  [redButton, "button"],
  [vault, "vault"],
  [glass, "glass"]
];

let tool = "";
let nextCard = 0;
let ropeCut = false;
let hammerHits = 0;
let vaultScrewsGone = 0;
let glassScrewsGone = 0;
let squirrelUsed = false;
let lettersFallen = 0;
let redButtonDodges = 0;
let cornerFinalScrew = null;
let idleTimer = null;
let canPlayTitleVoice = true;
let nextVoiceTime = 0;

function shuffleDeck(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

function playVoiceLine(cue) {
  if (!cue) {
    return;
  }
  if (Date.now() < nextVoiceTime) {
    return;
  }

  voiceAudio.pause();
  voiceAudio.currentTime = 0;
  voiceAudio.src = "audio/" + cue + ".mp3";
  nextVoiceTime = Date.now() + 450;
  voiceAudio.play().catch(function () {
  });
}

function say(text, cue) {
  voice.textContent = text;
  playVoiceLine(cue);
}

function resetIdleLine() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(function () {
    say("You went quiet. I got suspicious and narrated anyway.", "12a");
  }, 12000);
}

function imageUrl(name) {
  return "images/" + name + ".png";
}

function setImageBackground(element, name) {
  element.style.backgroundImage = "url('" + imageUrl(name) + "')";
  element.classList.add("imageBacked");
}

function applyImages() {
  for (let i = 0; i < imageProps.length; i++) {
    setImageBackground(imageProps[i][0], imageProps[i][1]);
  }

  for (let i = 0; i < toolButtons.length; i++) {
    const button = toolButtons[i];
    const icon = document.createElement("img");
    icon.src = imageUrl(button.dataset.tool);
    icon.alt = "";
    icon.className = "toolIcon";
    button.prepend(icon);
  }
}

function updateToolCursor(event) {
  if (!tool) {
    return;
  }

  toolCursor.style.left = event.clientX + "px";
  toolCursor.style.top = event.clientY + "px";
}

function showToolCursor(name) {
  toolCursor.style.backgroundImage = "url('" + imageUrl(name) + "')";
  toolCursor.classList.add("show");
}

function hideToolCursor() {
  toolCursor.classList.remove("show");
}

function startGame() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  deckArea.style.display = "block";
  say("Hey don't take my cards!", "2d");
}

function dropLetter(letter) {
  if (letter.classList.contains("fall")) {
    return;
  }

  letter.classList.add("fall");
  lettersFallen++;

  if (lettersFallen < letters.length) {
    if (canPlayTitleVoice) {
      const line = letterLines[(lettersFallen - 1) % letterLines.length];
      say(line[0], line[1]);
    }
    canPlayTitleVoice = !canPlayTitleVoice;
  } else {
    say("Still not a game. Mostly because you just deleted the title.", "2c");
    setTimeout(startGame, 600);
  }
}

function drawTool() {
  if (nextCard >= toolDeck.length) {
    drawCard.disabled = true;
    drawCard.style.display = "none";
    say("No cards left. The deck is emptier than my patience.", "2d");
    return;
  }

  const button = toolDeck[nextCard];
  const name = button.dataset.tool;
  button.style.display = "inline-block";
  deckInfo.textContent = "Deck: " + (toolDeck.length - nextCard - 1) + " cards";
  say(toolMessages[name].draw[0], toolMessages[name].draw[1]);
  nextCard++;

  if (nextCard >= toolDeck.length) {
    drawCard.disabled = true;
    drawCard.style.display = "none";
  }
}

function selectTool(button) {
  for (let i = 0; i < toolButtons.length; i++) {
    toolButtons[i].classList.remove("active");
  }

  tool = button.dataset.tool;
  button.classList.add("active");
  showToolCursor(tool);

  say(toolMessages[tool].select[0], toolMessages[tool].select[1]);
}

function stealDeckText() {
  if (squirrelUsed) {
    say("The squirrel already stole something. It has a tiny lawyer, a fake mustache, and your browser history.", "5b");
    return;
  }

  squirrelUsed = true;
  deckInfo.textContent = "Deck: stolen by squirrel";
  deckInfo.classList.add("stolen");
  say("The squirrel stole the deck counter, saluted, and escaped into a tax loophole.", "5a");
}

function squirrelAction() {
  if (tool !== "squirrel") {
    return false;
  }

  const squirrelLines = [
    "The squirrel tightened one screw for chaos, then untightened it for art.",
    "The squirrel filed a permit before causing nonsense.",
    "The squirrel is now foreman of bad ideas.",
    "The squirrel submitted a risk assessment that just says 'hehe'.",
    "The squirrel brought a tape measure and no plan.",
    "The squirrel is speedrunning OSHA violations."
  ];
  say(squirrelLines[Math.floor(Math.random() * squirrelLines.length)], "5b");
  return true;
}

function unscrew(screw, onDone) {
  if (tool !== "screwdriver") {
    say("Those corner screws need to stay, IF YOU TAKE THEM SO HELP ME GOD.", "8a");
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
  }, 900);

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

    for (let i = 0; i < screwProgressLines.length; i++) {
      if (glassScrewsGone === screwProgressLines[i][0]) {
        say(screwProgressLines[i][1], screwProgressLines[i][2]);
        break;
      }
    }

    if (glassScrewsGone === 36) {
      glass.style.display = "none";
      if (cornerFinalScrew) {
        cornerFinalScrew.style.zIndex = "5";
        cornerFinalScrew.style.pointerEvents = "auto";
      }
      say("Fine. One final corner screw. Do not touch it, and I will pay you ten imaginary dollars.", "8e");
    }
  });
}

function moveRedButton() {
  const maxLeft = gameScreen.clientWidth - redButton.offsetWidth - 20;
  const maxTop = gameScreen.clientHeight - redButton.offsetHeight - 20;
  redButton.style.left = 10 + Math.floor(Math.random() * Math.max(maxLeft, 1)) + "px";
  redButton.style.top = 10 + Math.floor(Math.random() * Math.max(maxTop, 1)) + "px";
}

function crash() {
  var blueScreen = document.getElementById("blueScreen");
  var videoContainer = document.getElementById("endVideo");
  var endImage = document.getElementById("endImage");
  var video = document.getElementById("fullscreen-video");

  blueScreen.style.display = "block";
  say("I told you there was no game.", "10b");

  setTimeout(function () {
    blueScreen.style.display = "none";
    endImage.style.display = "block";
    videoContainer.style.display = "block";
    video.currentTime = 0;
    video.play().catch(function () {
    });

    if (video.requestFullscreen) {
      video.requestFullscreen().catch(function () {
      });
    }
  }, 1200);

  video.onended = function () {
    location.reload();
  };
}

document.body.appendChild(toolCursor);
toolCursor.id = "toolCursor";
shuffleDeck(toolDeck);
applyImages();
say("There is no game. Seriously. Do not press start.", "1a");
document.addEventListener("mousemove", updateToolCursor);

startButton.onclick = function () {
  resetIdleLine();
  say("See no game.", "1b");
};

for (let i = 0; i < letters.length; i++) {
  letters[i].onclick = function () {
    dropLetter(letters[i]);
    resetIdleLine();
  };
}

drawCard.onclick = drawTool;
drawCard.addEventListener("click", resetIdleLine);

for (let i = 0; i < toolButtons.length; i++) {
  toolButtons[i].onclick = function () {
    selectTool(toolButtons[i]);
    resetIdleLine();
  };
}

rope.onclick = function () {
  resetIdleLine();
  if (squirrelAction()) {
    return;
  }
  if (tool !== "scissors" || ropeCut) {
    say("That rope is decorative.", "6a");
    return;
  }

  ropeCut = true;
  rope.style.display = "none";
  say("Wait... You can cut that??", "6b");

  setTimeout(function () {
    sign.classList.add("fall");
    say("That was not intended.", "7c");

    setTimeout(function () {
      redButton.style.display = "block";
      vault.style.display = "block";
      say("There is NO screws AT ALL.", "7d");
    }, 700);
  }, 300);
};

for (let i = 0; i < firstScrews.length; i++) {
  firstScrews[i].onclick = function (event) {
    event.stopPropagation();

    if (vaultScrewsGone >= 3) {
      return;
    }

    if (cornerFinalScrew && firstScrews[i] === cornerFinalScrew && glass.style.display !== "none") {
      say("Nice try. That last screw is trapped behind the glass.", "8e");
      return;
    }

    unscrew(firstScrews[i], function () {
      vaultScrewsGone++;
      say("Stop. Please stop. PLEASE STOP. NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", "8b");

      if (vaultScrewsGone === 4) {
        vault.classList.add("opened");
        redButton.classList.add("dodging");
        say("No no nO NO—", "10a");
      }

      if (vaultScrewsGone === 3) {
        cornerFinalScrew = null;
        for (let j = 0; j < firstScrews.length; j++) {
          if (!firstScrews[j].classList.contains("unscrewed")) {
            cornerFinalScrew = firstScrews[j];
            break;
          }
        }

        if (cornerFinalScrew) {
          cornerFinalScrew.classList.add("finalScrewReady");
          cornerFinalScrew.style.zIndex = "2";
          cornerFinalScrew.style.pointerEvents = "none";
        }

        setTimeout(function () {
          glass.style.display = "block";
          setImageBackground(glass, hammerHits > 0 ? "cracked-glass" : "glass");
          makeScrews();
          say("Oh no. Reinforced glass with 36 SCREWS and one last corner vault screw trapped behind it. Amazing.", "8c");
        }, 400);
      }
    });
  };
}

finalScrew.onclick = function () {
};

redButton.onclick = function (event) {
  event.stopPropagation();
  resetIdleLine();

  if (!vault.classList.contains("opened")) {
    say("Nice try. The vault panel is still in the way.", "7e");
    return;
  }

  if (redButtonDodges < 3) {
    const dodgeLines = [
      ["The button has flown away. Try 1 was embarrassing.", "10c"],
      ["The button is scared. Try 2 was equally tragic.", "10d"],
      ["Stop making the button run. Try 3 looked desperate.", "10e"]
    ];
    redButtonDodges++;
    moveRedButton();
    say(dodgeLines[redButtonDodges - 1][0], dodgeLines[redButtonDodges - 1][1]);
    return;
  }

  redButton.style.display = "none";
  say("You pressed it. Of course you did.", "10a");
  setTimeout(crash, 500);
};

glass.onclick = function () {
  resetIdleLine();
  if (squirrelAction()) {
    return;
  }
  if (tool !== "hammer") {
    return;
  }

  hammerHits++;

  if (hammerHits === 1) {
    glass.classList.add("cracked");
    setImageBackground(glass, "cracked-glass");
    say("That was a bad idea.", "9a");
    return;
  }

  tool = "";
  hideToolCursor();
  document.querySelector('[data-tool="hammer"]').classList.add("broken");
  say("The hammer broke. Nice job. GREAT JOB, you just break everything", "9b");
};

deckInfo.onclick = function () {
  resetIdleLine();
  if (tool === "squirrel") {
    stealDeckText();
  }
};

vault.onclick = function () {
  resetIdleLine();
  squirrelAction();
};

pauseButton.onclick = function () {
  resetIdleLine();
  pauseFlash.style.display = "grid";
  setTimeout(function () {
    pauseFlash.style.display = "none";
  }, 1000);
};

document.addEventListener("click", resetIdleLine);
resetIdleLine();
