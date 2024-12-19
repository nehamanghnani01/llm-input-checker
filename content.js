// Check if the floating UI already exists
if (!document.getElementById("persistent-popup")) {
  const popupContainer = document.createElement("div");
  popupContainer.id = "persistent-popup";
  popupContainer.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 300px;
      height: 200px;
      background-color: #fff;
      border: 1px solid #ccc;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      padding: 10px;
      overflow: auto;
      border-radius: 8px;
  `;

  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: #f44336;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 5px;
      cursor: pointer;
  `;
  closeButton.onclick = () => popupContainer.remove();

  const content = document.createElement("div");
  content.id = "popup-content";
  content.innerHTML = `
      <p id="textfetched">Text fetched here</p>
      <button id="fetchText">Get Input Text</button>
      <div id="result"></div>
  `;

  popupContainer.appendChild(closeButton);
  popupContainer.appendChild(content);
  document.body.appendChild(popupContainer);

  document.getElementById("fetchText").addEventListener("click", async () => {
      console.log("fetchText clicked");

      try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          chrome.scripting.executeScript(
              {
                  target: { tabId: tab.id },
                  func: getInputText,
              },
              (results) => {
                  if (chrome.runtime.lastError || !results || !results[0]) {
                      console.error("Failed to get input text:", chrome.runtime.lastError);
                      document.getElementById("result").textContent = "Failed to fetch text.";
                  } else {
                      const inputText = results[0].result;
                      document.getElementById("textfetched").textContent = inputText || "No text found.";
                      chrome.runtime.sendMessage({ action: "processText", inputText }, (response) => {
                          document.getElementById("result").textContent = response || "Failed to get response.";
                      });
                  }
              }
          );
      } catch (error) {
          console.error("Error:", error);
          document.getElementById("result").textContent = "An error occurred.";
      }
  });
}

// Function to be executed in the content script context
function getInputText() {
  try {
      const divElement = document.getElementById("prompt-textarea");
      if (divElement) {
          const pElement = divElement.querySelector("p");
          return pElement ? pElement.textContent : "No text found.";
      }
      return "Element not found.";
  } catch (e) {
      return "Error occurred.";
  }
}
