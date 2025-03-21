// History of messages 
let messages = { history: [], };

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

    // Call the server API using a relative URL
    const response = await fetch("https://mon-chatbot-backend.onrender.com/api/chat", {
      method: "POST",  
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    // Log response status
    console.log("Statut de la réponse :", response.status);

    // Vérifie si la requête a réussi
    if (!response.ok) {
      throw new Error(`Erreur du serveur: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log("Réponse du serveur :", data); // Debugging

    // Vérifie si 'message' est présent dans la réponse
    if (!data || !data.message) {  
      throw new Error("Réponse invalide du serveur.");
    }

    // Utilise la clé 'message' dans la réponse
    const botReply = data.message;

    // Remove the loader
    loader.remove();

    // Affiche la réponse du chatbot
    displayMessage(botReply);

    // Update message history if needed
    messages.history.push(
      { role: "user", parts: [{ text: userMessage }] },
      { role: "model", parts: [{ text: botReply }] }
    );
  } catch (error) { 
    console.error("Error while sending message:", error.message); 
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-model"); 
    const errorP = document.createElement("p"); 
    errorP.textContent = "This message could not be sent, please try again."; 
    errorDiv.appendChild(errorP); 
    chatWindow.appendChild(errorDiv); 
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

// Fonction pour afficher le message du chatbot
function displayMessage(message) {
  const chatWindow = document.querySelector(".chat-window .chat");

  // Créer un élément pour le message du modèle
  const modelDiv = document.createElement("div");
  modelDiv.classList.add("model");

  const modelP = document.createElement("p");
  modelP.textContent = message;

  modelDiv.appendChild(modelP);
  chatWindow.appendChild(modelDiv);

  // Défilement automatique vers le bas de la fenêtre de chat
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Close the Chatbot 
document.querySelector(".chat-window button.close").addEventListener("click", () => { 
  document.querySelector(".chat-window").classList.remove("open"); 
});
