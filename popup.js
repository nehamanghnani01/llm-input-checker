document.getElementById("fetchText").addEventListener("click", async () => {
    console.log("fetchText clicked");
  
    // Use `chrome.scripting` to execute a script in the active tab
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
            

            console.log("Input text:", inputText);
            console.log("Sending message to background.js from popup.js");


            chrome.runtime.sendMessage({ action: "processText", inputText }, (response) => {
                console.log("Received response from background.js:", response);
                console.log("show on popup!!!", response);
                
                let responseText = response || "Failed to get response.";
                document.getElementById("result").textContent = responseText;


              });
            // *********** Breaking text into 4-word phrases and sending to background.js ***********
          //   if (inputText && inputText !== "No text found.") {
          //     const words = inputText.split(/\s+/); // Split input text into words
          //     const phrases = [];
          
          //     // Create 4-word phrases
          //     for (let i = 0; i < words.length; i += 4) {
          //         phrases.push(words.slice(i, i + 4).join(" "));
          //     }
          //     console.log("Phrases:", phrases.length);
          //     let sensitiveData = []; // To store sensitive data identified
          //     let phraseIndex = 0;
          
          //     const processPhrase = () => {
          //         if (phraseIndex >= phrases.length) {
          //             // All phrases processed
          //             document.getElementById("result").textContent = sensitiveData.length 
          //                 ? `Sensitive Data Found: ${sensitiveData.join(", ")}`
          //                 : "No sensitive data found.";
          //             console.log("All phrases are processed now!")
          //             console.log("Sensitive data length = ", sensitiveData.length);
          //             console.log("Sensitive data found = ", sensitiveData.join(", "));

          //             return;
          //         }
          
          //         const currentPhrase = phrases[phraseIndex];
          //         console.log("Processing phrase:", currentPhrase); // Log current phrase
          //         console.log("phrase index:", phraseIndex);
          //         // document.getElementById("result").textContent = `Processing phrase ${phraseIndex + 1} of ${phrases.length}...`;
          
          //         chrome.runtime.sendMessage({ action: "processText", inputText: currentPhrase }, (response) => {
          //             console.log(`Response for phrase ${phraseIndex + 1}:`, response);
          
          //             if (response!== "No result from LLM.") {
          //                 sensitiveData.push(response); // Add response if sensitive data is found
          //             }
          
          //             phraseIndex++;
          //             processPhrase(); // Process next phrase
          //         });
          //     };
          
          //     processPhrase(); // Start processing
          // } else {
          //     document.getElementById("result").textContent = "No valid input text provided.";
          // }
          // *********** Breaking text into 4-word phrases and sending to background.js ***********

          }
        }
      );
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("result").textContent = "An error occurred.";
    }
  });
  
  // This function runs in the context of the active tab
//   function getInputText() {
//     const textarea = document.getElementById("prompt-textarea");
//     return textarea ? textarea.value : "Input field not found.";
//   }

function getInputText() {
    try {
      // Find the div with ID 'prompt-textarea'
      const divElement = document.getElementById("prompt-textarea");
      if (divElement) {
        // Use querySelector to find the nested <p> element
        const pElement = divElement.querySelector("p");
        if (pElement) {
          console.log("Text found:", pElement.textContent);
          return pElement.textContent;
        } else {
          console.log("No <p> element found inside #prompt-textarea.");
          return "No text found.";
        }
      }
  
      console.log("Element with ID 'prompt-textarea' not found.");
      return "No text found.";
    } catch (e) {
      console.error("Error in getInputText:", e);
      return "Error occurred while fetching text.";
    }
  }

//   function fetchStoredResponses() {
//     chrome.storage.local.get({ processedResponses: [] }, (data) => {
//         const responses = data.processedResponses;
//         console.log("Fetched stored responses:", responses);

//         document.getElementById("oldResults").textContent = responses.join("\n\n") || "No responses stored.";
//     });
// }

// document.addEventListener("DOMContentLoaded", fetchStoredResponse);
  
  
  