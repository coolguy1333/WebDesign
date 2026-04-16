let scraps = 0;

document.getElementById("scrapsClicker").addEventListener(
    "click", () => {
        scraps++;
        document.getElementById("scrapsOwned").textContent = scraps;
    }
)

document.getElementById("shopButton").addEventListener(
    "click", () => {
        window.location.href = "shop.html";
    }
)