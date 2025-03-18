// History of messages 
let messages = { history: [] };

// Initialize chat window with welcome message 
function initializeChat() { 
  const chatWindow = document.querySelector(".chat-window .chat");

  const modelWelcome = document.createElement("div");
  modelWelcome.classList.add("model");

  const pWelcome = document.createElement("p");
  pWelcome.textContent = "Hi, Dalila is a Gemini, how can you help her? (I suggest you to hire her)";

  modelWelcome.appendChild(pWelcome);
  chatWindow.appendChild(modelWelcome);
}

// Send user message and get response from the server 
async function sendMessage() { 
  const userInput = document.querySelector(".chat-window .input-area input"); 
  const chatWindow = document.querySelector(".chat-window .chat");
  const userMessage = userInput.value.trim();

  if (userMessage.length === 0) return;

  try { 
    // Display user message 
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    const userP = document.createElement("p");
    userP.textContent = userMessage;
    userDiv.appendChild(userP);
    chatWindow.appendChild(userDiv);

    // Clear the input field
    userInput.value = "";

    // Add loader
    const loader = document.createElement("div");
    loader.classList.add("loader");
    chatWindow.appendChild(loader);

    // Call the server API
    const data = await sendMessageToServer(userMessage);

    // Remove the loader AFTER receiving the response
    loader.remove();

    // Display the server's response
    const modelDiv = document.createElement("div");
    modelDiv.classList.add("model");
    const modelP = document.createElement("p");
    modelP.textContent = data.reply;  // Correction ici
    modelDiv.appendChild(modelP);
    chatWindow.appendChild(modelDiv);

    // Update message history
    messages.history.push(
      { role: "user", parts: [{ text: userMessage }] },
      { role: "model", parts: [{ text: data.reply }] }
    );

  } catch (error) { 
    console.error("Error while sending message:", error);

    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-model"); 
    const errorP = document.createElement("p"); 
    errorP.textContent = "This message could not be sent, please try again."; 
    errorDiv.appendChild(errorP); 
    chatWindow.appendChild(errorDiv); 
  } 
}

// Function to send the message to the server
async function sendMessageToServer(userMessage) {
  try {
    const response = await fetch("https://mon-chatbot-backend.onrender.com/api/chat", {
      method: "POST",  
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    console.log("Statut de la réponse :", response.status);

    if (!response.ok) {
      throw new Error(`Erreur du serveur: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Réponse du serveur :", data);

    if (!data || !data.reply) {
      throw new Error("Réponse invalide du serveur.");
    }

    return data;

  } catch (error) {
    console.error("Error while sending message:", error.message);
    throw error;
  }
}

// Initialize the chat window when the script is loaded 
initializeChat();

// Add event listener to the send button 
document.querySelector(".chat-window .input-area button").addEventListener("click", sendMessage);

// Add event listener for the "Enter" key 
document.querySelector(".chat-window .input-area input").addEventListener("keydown", (event) => { 
  if (event.key === "Enter" && !event.shiftKey) { 
    event.preventDefault();
    sendMessage();
  } 
});

// Open the Chatbot 
document.querySelector(".chat-button").addEventListener("click", () => { 
  document.querySelector(".chat-window").classList.add("open");
});

// Close the Chatbot 
document.querySelector(".chat-window button.close").addEventListener("click", () => { 
  document.querySelector(".chat-window").classList.remove("open");
});
