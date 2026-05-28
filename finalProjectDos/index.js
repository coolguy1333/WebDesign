const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

// 0 is X 1 is Y
let XorY = 0;

let Xcord = 0;
let Ycord = 0;

function clicked(Xcord, Ycord){
    if(XorY == 0){
        document.getElementById(`row${Xcord}column${Ycord}`).textContent = "X";
        board[Xcord - 1][Ycord - 1] = "X"
        XorY = 1;
        alert(`row${Xcord}column${Ycord}` + "  " + XorY);
    }
    else{
        document.getElementById(`row${Xcord}column${Ycord}`).textContent = "O";
        board[Xcord - 1][Ycord - 1] = "O"
        XorY = 0;
        alert(`row${Xcord}column${Ycord}` + "  " + XorY);
    };
};