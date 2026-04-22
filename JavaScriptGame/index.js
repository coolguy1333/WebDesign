let player = {
    "currencies": {
        "scrap": 0,
        "armor": 0
    },
    "scraps": {
        "perClick": 1
    },
    "production": {
        "passiveScraps": {
            "active": false,
            "timeRequired": 20,
            "cost": null,
            "output": {
                "scrap": 1
            }
        },
        "scrapsForArmor":{
            "active": false,
            "timeRequired": 10,
            "cost": {
                "scrap": 15
            },
            "output": {
                "armor": 1
            }
        },
        "passiveArmor":{
            "active": false,
            "timeRequired": 90,
            "cost": null,
            "output": {
                "armor": 1
            }
        }
    },
    "workers": 1
};


let storedData = localStorage.getItem("playerData");
if(storedData){
    player = JSON.parse(storedData);
    document.getElementById("scrapsOwned").textContent = player.currencies.scrap;
}

document.getElementById("shopButton").addEventListener(
    "click", () => {
        saveGame();
        window.location.href = "./shop.html"
})

document.getElementById("scrapsClicker").addEventListener(
    "click", () => {
        player.currencies.scrap += player.scraps.perClick;
        document.getElementById("scrapsOwned").textContent = player.currencies.scrap;
})

function saveGame(){
    localStorage.setItem('playerData', JSON.stringify(player));
}

function productionClicked(type){
    let activeWorkers = 0;
    for (producer in player.production) {
        if (player.production[producer].active) {
            activeWorkers++;
        }
    }
    if(player.production[type].active){
        player.production[type].active = false;
        document.getElementById(`${type}Progress`).value = 0;
    }
    else if(player.workers > activeWorkers){
        player.production[type].active = "true";
    }
}


/* ********* */
/* Game Loop */
/* ********* */
let secondsPassed = 0;
let oldTimeStamp = 0;

// Beginning the game loop
window.requestAnimationFrame(gameLoop);

function gameLoop(timeStamp) {
    // Calculate how much time has passed
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Pass the time to the update
    update(secondsPassed);

    window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed){
    let passiveScrapsProgress = document.getElementById("passiveScrapsProgress");
    let scrapsForArmorProgress = document.getElementById("scrapsForArmorProgress");
    let passiveArmorProgress = document.getElementById("passiveArmorProgress");
    if(player.production.passiveScraps.active){
        passiveScrapsProgress.value += 100 / player.production.passiveScraps.timeRequired * secondsPassed;
        if(passiveScrapsProgress.value >= 100){
            passiveScrapsProgress.value = 0;
            player.currencies.scrap += player.production.passiveScraps.output.scrap;
        }
    }
    if(player.production.scrapsForArmor.active){
        scrapsForArmorProgress.value += 100 / player.production.scrapsForArmor.timeRequired * secondsPassed;
        if(scrapsForArmorProgress.value >= 100){
            scrapsForArmorProgress.value = 0;
            if(player.currencies.scrap >= player.production.scrapsForArmor.cost.scrap){
                player.currencies.scrap -= player.production.scrapsForArmor.cost.scrap;
                player.currencies.armor += player.production.scrapsForArmor.output.armor;
            }
        }
    }
    if(player.production.passiveArmor.active){
        passiveArmorProgress.value += 100 / player.production.passiveArmor.timeRequired * secondsPassed;
        if(passiveArmorProgress.value >= 100){
            passiveArmorProgress.value = 0;
            player.currencies.armor += player.production.passiveArmor.output.armor;
        }
    }
}