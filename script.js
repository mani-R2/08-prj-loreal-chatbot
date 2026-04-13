/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* Cloudflare Worker URL */
const workerUrl = "https://loreal-chatbot.iyrojas.workers.dev/";

/* Messages array */
let messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant for L'Oréal customers. Answer questions about products, provide recommendations, and assist with any inquiries related to L'Oréal's offerings. Remember user details like their name and preferences if they share them.Use that information in future responses. Only respond to questions related to L'Oréal products and services. If the user asks something outside of this scope, politely inform them that you can only assist with L'Oréal-related inquiries.",
  },
];

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  /* Show user message */
  chatWindow.textContent += `\n\nYou: ${userMessage}`;

  /* Add user message to messages array */
  messages.push({
    role: "user",
    content: userMessage,
  });

  userInput.value = "";

  try {
    /* Send requests to Cloudflare Worker */
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    /* Convert response to JSON */
    const data = await response.json();

    /* Get AI reply */
    const botReply = data.choices[0].message.content;

    /* Show AI reply */
    chatWindow.textContent += `\n\n\L'Oréal Bot: ${botReply}`;

    /* Save AI reply */
    messages.push({
      role: "assistant",
      content: botReply,
    });
  } catch (error) {
    console.error("Error:", error);
    chatWindow.textContent +=
      "\n\nBot: ⚠️ Error connecting to the server. Please try again later.";
  }
});
