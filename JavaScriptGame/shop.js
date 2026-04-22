let player = {
    "currencies": {
        "scrap": 0,
        "armor": 0
    },
    "scraps": {
        "perClick": 1
    }
};



let storedData = localStorage.getItem("playerData");
if(storedData){
    player = JSON.parse(storedData);
}

document.getElementById("gameButton").addEventListener(
    "click", () => {
        saveGame();
        window.location.href = "./index.html"
})

document.getElementById("scrapClickUpgrade").addEventListener(
    "click", () => {
        upgrade = document.getElementById("scrapClickUpgrade");
        if(player.currencies.scrap >= upgrade.value){
            player.currencies.scrap -= upgrade.value;
            player.scraps.perClick += 1;
            upgrade.value = Math.floor(upgrade.value * 1.5);
            saveGame();
        }
    }
)

function saveGame(){
    localStorage.setItem('playerData', JSON.stringify(player));
}