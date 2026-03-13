document.getElementById("carPartQuiz").addEventListener("submit",
    (event) => {
        event.preventDefault();
       
        let rearAxle = 0;
        let frontRightFender = 0;
        let rim = 0;
        let exhaustPipe = 0;
        let sparkPlug = 0;

        stateOfMatterResult = document.getElementById('stateOfMatter').ariaValueMax;
        if(stateOfMatterResult == "Solid"){
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
       
        bedtimeResult = document.getElementById("bedtime").value;
        bedtimeHours = (Number)(bedtimeResult.split(":")[0]);
        bedtimeMinutes = (Number)(bedtimeResult.split(":")[1]);
        if(bedtimeHours <= 3){
            rim++;
        }
        if(bedtimeHours <= 9){
            rearAxle++;
        }
        if(bedtimeHours <= 15){
            sparkPlug++;
        }
        if(bedtimeHours <= 19){
            exhaustPipe++;
            sparkPlug++;
        }

        gameQuizResult = document.getElementById("gameQuiz").value;
        if(gameQuizResult == "Spotify"){
            rim++;
            frontRightFender++;
        }
        if(gameQuizResult == "Minecraft"){
            rearAxle++;
        }
        if(gameQuizResult == "The Weather App"){
            exhaustPipe++;
        }
        if(gameQuizResult == "Batman's Guide to Being Cool"){
            sparkPlug++;
            frontRightFender++;
        }
        if(gameQuizResult == "Grown Ups 2"){
            sparkPlug++;
            exhaustPipe++;
        }

        if(document.getElementById("marzahl").checked){

        }

        if(document.getElementById("pineapple").checked){
            
        }
    }
)