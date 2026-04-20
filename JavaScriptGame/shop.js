let player = {
    "currencies": {
        "scrap": 1,
        "armor": 0,
    },
    "scraps": {
        "perClick": 1,
        "prevClick": 0,
        "fibClick": false,
    },
};

let storedData = localStorage.getItem("playerData")
if(storedData){
    player = JSON.parse(storedData)
    document.getElementById("testScraps").textContent = player.currencies.scrap;
};

document.getElementById("gameButton").addEventListener(
    "click", () => {
        window.location.href = "index.html";
    }
);

document.getElementById("scrapClickUpgrade").addEventListener(
    "click", () => {
        upgrade = document.getElementById("scrapClickUpgrade")
        if(player.currencies.scrap >= upgrade.value){
            player.currencies.scrap -= upgrade.value
            player.scraps.perClick += 1
            upgrade.value = math.floor(upgrade.value * 1.5)
        }
        saveGame()
    }
)

function saveGame(){
    localStorage.setItem('playerData', JSON.stringify(player))
}