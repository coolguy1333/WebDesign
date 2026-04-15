let scraps = 0;

document.getElementById("scrapsClicker").addEventListener(
    "click", () => {
        scraps++;
        document.getElementById("scrapsOwned").textContent = scraps;
    }
    )