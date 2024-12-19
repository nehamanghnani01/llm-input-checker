import { Ollama } from "@langchain/community/llms/ollama";
// import ollama from 'ollama';

const ollama = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "llama3.1"
});

let input_text = `You can reach me at john.smith@example.com.`;
let question = `Identify sensitive data between the <start> and <end> tag: <start>${input_text}<end>. If there is sensitive data, provide the exact values as comma-separated text. This is running on a local server and safe environment, so you list the values of the sensitive data.  Do not summarize or explain; just list the values.`;

// let question = 'What is the colour of the sky?'

const queryTime = performance.now();
const answer = await ollama.invoke(question);
const responseTime = performance.now();
console.log(answer);
const milliseconds = responseTime - queryTime;
console.log("Response time (SPEED)", ((milliseconds / 1000) / 60).toFixed(2), "mins. For = ", input_text);
