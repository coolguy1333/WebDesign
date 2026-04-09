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
  if(currentGuess.length > 0){``
    currentGuess.pop();
    updateHint();
  }
}

function submitGuess(){

  if(currentGuess.length != 5){
    return;
  }

  let currentGuessString = "";
  for(let i = 0; i < currentGuess.length; i++){
    currentGuessString = currentGuessString + currentGuess[i];
  }
  currentGuessString = currentGuessString.toLowerCase();
  if(guessWords.includes(currentGuessString) != true){
    return;
  }

  for(let i = 0; i < currentGuessString.length; i++){
    let found = "none";
    if(currentGuessString[i] == wordleWord[i]){
      document.getElementById(`guess${guessNumber}letter${i + 1}`).style.backgroundColor = "green";
      document.getElementById(`guess${guessNumber}letter${i + 1}`).style.color = "white";
      found = "green";
    }

    else if(wordleWord.includes(currentGuessString[i])){
      document.getElementById(`guess${guessNumber}letter${i + 1}`).style.backgroundColor = "yellow";
      found = "yellow";
    }

    else{
     document.getElementById(`guess${guessNumber}letter${i + 1}`).style.backgroundColor = "gainsboro";
    }

    if(found == "green"){
      document.getElementById(currentGuessString[i].toUpperCase()).style.backgroundColor = "green";
      document.getElementById(currentGuessString[i].toUpperCase()).style.color = "white";
    }

    else if(found == "yellow"){
      document.getElementById(currentGuessString[i].toUpperCase()).style.backgroundColor = "yellow";
    }

    else{
      document.getElementById(currentGuessString[i].toUpperCase()).style.backgroundColor = "gainsboro";
    }
  }
  currentGuess = [];
  guessNumber++;
  
  if (currentGuessString === wordleWord) {
    gameEnd();
    return;
  }

  if(guessNumber == 7){
    gameEnd();
    return;
  }
}

function updateHint(){
  for(let i = 1; i <= 5; i++) {
    document.getElementById(`guess${guessNumber}letter${i}`).textContent = "";
  }

  for(let i = 0; i < currentGuess.length; i++){
    document.getElementById(`guess${guessNumber}letter${i + 1}`).textContent = currentGuess[i];
  }
}

function gameEnd(){
  document.getElementById("solution").textContent = wordleWord;
  document.getElementById("solution").style.display = "block"
  document.getElementById("resetButton").style.display = "block"
}

let letterList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

function resetGame() {
  wordleWord = solutionWords[Math.floor(Math.random() * solutionWords.length)];
  
  letterList.forEach(letter => {
      let btn = document.getElementById(letter);
      btn.style.backgroundColor = "";
      btn.style.color = "black";
  });

  for(let i = 1; i <= 6; i++){
    for(let j = 1; j <= 5; j++){
      let cell = document.getElementById(`guess${i}letter${j}`);
      cell.style.backgroundColor = "white";
      cell.style.color = "black";
      cell.textContent = "";
    }
  }

  document.getElementById("solution").style.display = "none";
  document.getElementById("resetButton").style.display = "none";
  guessNumber = 1;
  currentGuess = [];
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