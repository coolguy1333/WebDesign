document.getElementById("winPlace").style.display = "none";

const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

// 0 is X 1 is Y
let XorY = 0;

let Xcord = 0;
let Ycord = 0;

let draw = 0
let won = "N/A"

async function captureAndDisplay() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;  
    canvas.height = 64; 
    const context = canvas.getContext('2d');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      await video.play();

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      stream.getTracks().forEach(track => track.stop());

      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const photoFile = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });

        const myImageElement = document.getElementById('photoPreview');
        
        if (myImageElement) {
          myImageElement.src = URL.createObjectURL(photoFile);
        } else {
            myImageElement.src = URL("./images/O.png");
        }

      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error("Error capturing file:", error);
    }
}
  
  
function clicked(Xcord, Ycord){
    if(XorY == 0){
        document.getElementById(`row${Xcord}column${Ycord}`).style.backgroundImage = "url('./images/X.png')";
        document.getElementById(`row${Xcord}column${Ycord}`).disabled = true;
        board[Xcord - 1][Ycord - 1] = "X"
        XorY = 1;
    }
    else{
        document.getElementById(`row${Xcord}column${Ycord}`).style.backgroundImage = "url('./images/O.png')";
        document.getElementById(`row${Xcord}column${Ycord}`).disabled = true;
        board[Xcord - 1][Ycord - 1] = "O"
        XorY = 0;
    };

    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== 0 && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            won = board[i][0];
            winner(won);
            return;
        };
        if (board[0][i] !== 0 && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            won = board[0][i];
            winner(won);
            return;
        };
    };

    if (board[0][0] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        won = board[0][0];
        winner(won);
        return;
    };
    if (board[0][2] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        won = board[0][2];
        winner(won);
        return;
    };

    for (let i = 0; i < 3; i++){
        for (let k = 0; k < 3; k++){
            if (board[i][k] == 0){
                return;
            }
            else {
                draw++
            };
        };
    };
    if (draw > 0){
        winner("DRAW");
    }
};

function winner(won){
    captureAndDisplay()
    document.getElementById("winner").textContent = won;
    document.getElementById("winPlace").style.display = "flex";
};

function restart(){
    location.reload();
};