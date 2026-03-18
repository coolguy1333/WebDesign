document.getElementById("carPartQuiz").addEventListener("submit",
    (event) => {
        event.preventDefault();
       
        let rearAxle = 0;
        let frontRightFender = 0;
        let rim = 0;
        let exhaustPipe = 0;
        let sparkPlug = 0;

        stateOfMatterResult = document.getElementById('stateOfMatter').value;
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
            rearAxle++;
        }
        else if(bedtimeHours <= 8){
            frontRightFender++;
        }
        else if(bedtimeHours <= 12){
            rim++;
        }
        else if(bedtimeHours <= 20){
            exhaustPipe++;
        }
        else{
            sparkPlug++;
        }

        gameQuizResult = document.getElementById("gameQuiz").value;
        if(gameQuizResult == "Spotify"){
            rearAxle++;
        }
        if(gameQuizResult == "Minecraft"){
            frontRightFender++;
        }
        if(gameQuizResult == "The Weather App"){
            rim++;
        }
        if(gameQuizResult == "Batman's Guide to Being Cool"){
            exhaustPipe++;
        }
        if(gameQuizResult == "Grown Ups 2"){
            sparkPlug++;
        }

        if(document.getElementById("marzahl").checked){
            rearAxle++;
            frontRightFender++;
        }
        if(document.getElementById("steffes").checked){
            rim++;
        }
        if(document.getElementById("dubz").checked){
            exhaustPipe++;
        }
        if(document.getElementById("barb").checked){
            sparkPlug++;
        }

        if(document.getElementById("pepperoni").checked){
            rearAxle++;
            frontRightFender++;
        }
        if(document.getElementById("pineapple").checked){
            rim++;
        }
        if(document.getElementById("apple").checked){
            exhaustPipe++;
        }
        if(document.getElementById("sausage").checked){
            sparkPlug++;
        }

        winner = [];
        if(rearAxle >= frontRightFender 
            && rearAxle >= rim 
            && rearAxle >= exhaustPipe
            && rearAxle >= sparkPlug
        )
        {
            winner.push("Rear Axle")
        }
        winner = [];
        if(frontRightFender >= rearAxle 
            && frontRightFender >= rim 
            && frontRightFender >= exhaustPipe
            && frontRightFender >= sparkPlug
        )
        {
            winner.push("Front Right Fender")
        }
        winner = [];
        if(rim >= frontRightFender 
            && rim >= rearAxle 
            && rim >= exhaustPipe
            && rim >= sparkPlug
        )
        {
            winner.push("Rim")
        }
        winner = [];
        if(exhaustPipe >= frontRightFender 
            && exhaustPipe >= rim 
            && exhaustPipe >= rearAxle
            && exhaustPipe >= sparkPlug
        )
        {
            winner.push("Exhaust Pipe")
        }
        winner = [];
        if(sparkPlug >= frontRightFender 
            && sparkPlug >= rim 
            && sparkPlug >= exhaustPipe
            && sparkPlug >= rearAxle
        )
        {
            winner.push("Spark Plug")
        }
    }
)