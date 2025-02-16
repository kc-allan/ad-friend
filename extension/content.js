console.log("AdFriend Content Script Loaded!");

// Function to fetch and parse the patterns.ini file
async function loadAdPatterns() {
    try {
        const response = await fetch(chrome.runtime.getURL("parsed_easylist.json"));
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        return data.adSelectors || []; // Ensure it always returns an array
    } catch (error) {
        console.error("Failed to load adSelectors:", error);
        return []; // Return an empty array to prevent undefined errors
    }
}


// Function to replace detected ads with motivational texts
async function replaceAds() {
    const adSelectors = await loadAdPatterns();
    if (!Array.isArray(adSelectors) || adSelectors.length === 0) return; // Prevent undefined errors

    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(ad => {
            if (!ad || ad.classList.contains("focusflow-replacement")) {
                return;
            }
            const adRect = ad.getBoundingClientRect();
            if (adRect.width < 10 || adRect.height < 10) return;

            const newElement = document.createElement("div");
            newElement.className = "focusflow-replacement";
            newElement.textContent = getMotivationalText();
            newElement.style = `
                background: #f3f3f3;
                padding: 10px;
                font-size: 16px;
                border: 1px solid #e0e0e0;
                text-align: center;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                overflow: hidden;
            `;

            ad.innerHTML = "";
            ad.appendChild(newElement);
            const closeBtn = document.createElement("button");
            closeBtn.textContent = "Close";
            closeBtn.style = `
                position: absolute;
                top: 0;
                right: 0;
                background: #f3f3f3;
                color: red;
                border: none;
                color: #333;
                font-size: 12px;
                padding: 5px;
                cursor: pointer;
            `;
            closeBtn.onclick = () => ad.remove();
            newElement.appendChild(closeBtn);
        });
    });
}


// Function to get a random motivational text
function getMotivationalText() {
    const messages = [
        "Stay focused, stay determined! 🚀",
        "Success is the sum of small efforts. 🌟",
        "Take a deep breath. You've got this! 💪",
        "Keep pushing forward! 🏆",
        "Focus on progress, not perfection. ✅"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Run the script every 3 seconds to catch dynamically loaded ads
setInterval(replaceAds, 5000);
