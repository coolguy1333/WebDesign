document.getElementById("mcApplication").addEventListener("submit", (event) => {
    event.preventDefault();

    let join = 0;
    let never = 0;

    expLevel = document.getElementById('expLevel').value;
    if (expLevel.includes("Newbie")){
        never++
    };
    if (expLevel.includes("Casual")){
        never++ 
        join++
    };
    if (expLevel.includes("Pro")){
        join++
    };
    if (expLevel.includes("Hermit")){
        join =+ 2;
    }


    if (document.getElementById("survival").checked) {
        join++;
    }
    if (document.getElementById("pvp").checked) {
        never++;
        join++;
    }
    if (document.getElementById("creative").checked) {
        never += 2;
    }

    // 4. Skills Logic (Checkboxes)
    if (document.getElementById("redstone").checked) join += 2;
    if (document.getElementById("building").checked) never++;
    if (document.getElementById("farming").checked) join++;
    if (document.getElementById("mining").checked) never += 2;

    // 5. Determine the "Winner" (Suggested Role)
    winner = [];
    if (join >= never) {
        winner.push("You've been accepted to the server");
    }
    if (never >= join) {
        winner.push("You may not join the server");
    }

    winningIndex = Math.floor(Math.random() * winner.length);
    actualWinner = winner[winningIndex];

    username = document.getElementById("mcUsername").value;
    document.getElementById("resultParagraph").textContent = 
        `Congrats ${username}! ${actualWinner}.`;
});