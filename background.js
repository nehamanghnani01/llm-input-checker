console.log("Background script loaded");
import { processRequestData } from './llm-response.js';

//keep the extension window open at all times when in use
chrome.action.onClicked.addListener(() => {
    console.log("Extension icon clicked. Opening persistent popup window...");
    chrome.windows.create({
      url: "popup.html",  
      type: "popup",
      width: 400,
      height: 600,
    });
  });  

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "processText") {
      console.log("entered onMessage in background script");
      const inputText = message.inputText;
      try {
       console.log("Input text = ", inputText);
       const data = await processRequestData(inputText);
       console.log("Data from LLM at background.js :::", data);
       sendResponse(data.result || "No result from LLM.");
      } catch (error) {
        console.error("Error calling LLM API:", error);
        sendResponse("Error calling LLM API.");
      }
  
      // Return true to indicate that the response will be sent asynchronously
      return true;
    }
  });
    
  
  