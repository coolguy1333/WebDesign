var clickCounter = 0;

function funFunction(){
    clickCounter++;
    myParagraph = document.getElementById("resultParagraph");
    if(clickCounter == 1){
    myParagraph.textContent = "Ow, You Clicked me too hard!";
    }
    else if(clickCounter == 2){
        myParagraph.textContent = "Why would you do that";
    }
    else if(clickCounter == 3){
        myParagraph.textContent = "GET OUT";
    }
    else if(clickCounter == 4){
        myParagraph.textContent = "GO TO AP";
    }
    else{
        myParagraph.textContent = "GO TO MRS. HOLLY JOLLY BODISH!!!";
    }
}