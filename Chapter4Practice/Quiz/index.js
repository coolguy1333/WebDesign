document.getElementById("carPartQuiz").addEventListener("submit",
    (event) => {
        event.preventDefault();
        let rearAxle = 0;
        let frontRightFender = 0;
        let rim = 0;
        let exhaustPipe = 0;
        let sparkPlug = 0;

        stateOfMatterResult = document.getElementById("stateOfMatter").ariaValueMax
        if(stateOfMatterResult == "solid"){
            rim++;
            frontRightFender++;
        }
        if(stateOfMatterResult == "Liquid"){
            rearAxle++;
        }
        if(stateOfMatterResult == "Gas"){
            exhaustPipe++;
        }
        if(stateOfMatterResult == "Whatever a NeeDoh is"){
            sparkPlug++;
        }



        bedtimeResult = document.getElementById("bedtime").ariaValueMax
        if(stateOfMatterResult == "solid"){
            rim++;
            frontRightFender++;
        }
        if(stateOfMatterResult == "Liquid"){
            rearAxle++;
        }
        if(stateOfMatterResult == "Gas"){
            exhaustPipe++;
        }
        if(stateOfMatterResult == "Whatever a NeeDoh is"){
            sparkPlug++;
        }
    }
)