let scraps = 0;
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
    document.getElementById("scrapsOwned").textContent = player.currencies.scrap;
};

document.getElementById("shopButton").addEventListener(
    "click", () => {
        window.location.href = "shop.html";
    }
);

document.getElementById("scrapsClicker").addEventListener(
    "click", () => {
        if(player.scraps.fibClick){
            fibClick()
        }
        else{
            normalClick()
        }

        saveGame()
    }
)

function fibClick(){
    player.currencies.scrap += player.scraps.perClick;

    let nextFib = player.scraps.perClick + player.scraps.prevClick;

    player.scraps.prevClick = player.scraps.perClick;
    player.scraps.perClick = nextFib;

    document.getElementById("scrapsOwned").textContent = player.currencies.scrap;
}

function normalClick(){
    player.currencies.scrap += player.scraps.perClick
    document.getElementById("scrapsOwned").textContent = player.currencies.scrap;
}

function saveGame(){
    localStorage.setItem('playerData', JSON.stringify(player))
}