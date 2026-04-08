var guessWords = [];
var solutionWords = [];
var wordleWord;

fetch('./guess_words.txt')
  .then(response => response.text())
  .then(data => {
    guessWords = data.split("\r\n");
  });

fetch('./solution_words.txt')
  .then(response => response.text())
  .then(data => {
    solutionWords = data.split("\r\n");
    wordleWord = solutionWords[Math.floor(Math.random() * solutionWords.length)];
  });

let guessNumber = 1;
let currentGuess = [];

function letterClicked(letter){
  if(currentGuess.length < 5){
    currentGuess.push(letter);
    updateHint();
  }
}

function deleteClicked(){
  if(currentGuess.length > 0){
    currentGuess.pop();
    updateHint();
  }
}

function submitGuess() {
  if (currentGuess.length !== 5) return;

  let currentGuessString = currentGuess.join("").toLowerCase();
  let solution = wordleWord.toLowerCase();

  if (!guessWords.includes(currentGuessString) && !solutionWords.includes(currentGuessString)) {
      alert("Not in word list");
      return;
  }

  for (let i = 0; i < 5; i++) {
      let letterElement = document.getElementById(`guess${guessNumber}letter${i + 1}`);

      if (char === solution[i]) {
          letterElement.style.backgroundColor = "green";
      } else if (solution.includes(currentGuessString[i])) {
          letterElement.style.backgroundColor = "yellow";
      } else {
          letterElement.style.backgroundColor = "gray";
      }
  }

  currentGuess = [];
  guessNumber++;
}

function updateHint(){
  for(let i = 1; i <= 5; i++) {
    document.getElementById(`guess${guessNumber}letter${i}`).textContent = "";
  }

  for(let i = 0; i < currentGuess.length; i++){
    document.getElementById(`guess${guessNumber}letter${i + 1}`).textContent = currentGuess[i];
  }
}

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key.length === 1 && key.match(/[a-z]/i)) {
    letterClicked(key.toUpperCase());
  }

  if (key === 'Backspace') {
    deleteClicked();
  }

  if (key === 'Enter') {
    submitGuess();
  }
});
