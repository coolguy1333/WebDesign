var guessWords;
var solutionWords;
var wordleWord;
fetch('./guess_words.txt')
  .then(response => response.text())
  .then(data => {
    guessWords = data.split("\r\n")
  })
fetch('./solution_words.txt')
  .then(response => response.text())
  .then(data => {
    solutionWords = data.split("\r\n");
    wordleWord = solutionWords[Math.floor(Math.random() * solutionWords.length)];
  })

function displayWordleWord(){
    console.log(wordleWord);
}