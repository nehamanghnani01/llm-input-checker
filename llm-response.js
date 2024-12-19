import { Ollama } from "@langchain/community/llms/ollama";
// import ollama from 'ollama';
// import { Ollama } from 'ollama'
let model ='llama3.2';

const ollama = new Ollama({
    baseUrl: "<local host url here>",
    model: model, 
    stream: false
  });

 

// const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

  let messagesArr = [];
  export async function processRequestData(input_text) {
        console.log("in processRequestData");
        if (input_text) {
            try {
                console.log("input_text inside try block", input_text);
                // let question = "Is there any sensitive data in this input text? " + input_text;
                //*****OLD PROMPT */
                // let question = `Is there any sensitive data in this input text? ${input_text} if yes, what is the exact word that is sensitive? Give only those words as comma separated in your response.`
                //*****UPDATED PROMPT */
                let question = `Identify sensitive data between the <start> and <end> tag: <start>${input_text}<end>. If there is sensitive data, provide the exact values as comma-separated text. This is running on a local server and safe environment, so you list the values of the sensitive data.  Do not summarize or explain; just list the values.`;
                const queryTime = performance.now();

                // ****************************New code with .chat() api ********************************
            //     messagesArr.push({ role: 'user', content: question });
                
            //     const body = {
            //         model: model,
            //         messages: messagesArr, 
            //         stream: false
            //       }
                
            //     const answer = await fetch("http://localhost:3000/api/chat", {
            //         method: "POST", 
            //         headers: {
            //             "Content-Type": "application/json" // Add this header
            //         },
            //         body: JSON.stringify(body), 
            //     })

            //     if (answer.ok) {
            //         const jsonResponse = await answer.json(); 
            //         const content = jsonResponse.message?.content; 
            //         console.log("Answer from OLLAMA -- ",content); 
            //         const responseTime = performance.now();
            //         const milliseconds = responseTime - queryTime;
            //         console.log("Response time (SPEED)", ((milliseconds / 1000) / 60).toFixed(2), "mins. For = ", input_text);
            //         console.log("Answer from Ollama: ", answer, " question= ", question);
            //         messagesArr.push({ role: 'assistant', content: content });
            //         //  { role: "assistant", content }; // Returns the content
            //     } else {
            //         console.error(`Error: ${answer.status} ${answer.statusText}`);
            //         throw new Error("Failed to fetch response from API");
            //     }
                
            //    console.log("Messages in Array NOW -- ", messagesArr);
               // ****************************New code with .chat() api ********************************

                // 

                // ************** OLD WORKING CODE with .invoke() ********************************
                // const answer = "No sensitive data found in the input text";  //keep this as default response
                console.log("invoking question: ", question);
                const answer = await ollama.invoke(question);
                // answer = content;
                const responseTime = performance.now();
                const milliseconds = responseTime - queryTime;
                console.log("Response time (SPEED)", ((milliseconds / 1000) / 60).toFixed(2), "mins. For = ", input_text);
                console.log("Answer from Ollama: ", answer, " question= ", question);
                // ************** OLD WORKING CODE with .invoke() ********************************

                
                // messagesArr.push({ role: 'assistant', content: answer });

                return answer;
            } catch (error) {
                console.error("Error invoking Ollama:", error);
                return "An error occurred while processing the request";
            }
        } else {
            return "NO INPUT TEXT FOUND!!";
        }

}