document.getElementById("fetchQuote").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "fetchMotivation" }, (response) => {
        document.getElementById("quoteDisplay").textContent = response.quote;
    });
});
