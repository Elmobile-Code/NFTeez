import React, { useState } from "react";

interface Collection {
  title: string;
  url: string;
}

// Fetch featured collections
async function getFeaturedCollections(): Promise<Collection[]> {
  try {
    const response = await fetch("/api/collections"); 

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    return data?.data?.results.map((item: any) => ({
      title: item.collection,
      url: item.url,
    })) || [];

  } catch (error) {
    console.error(" Error fetching collections:", error);
    return [{ title: " Failed to load collections", url: "" }];
  }
}

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "bot", text: " Hello! How can I help you today?" },
  ]);
  //user input
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  async function handleSend() {
    if (!inputValue.trim() || isBotTyping) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInputValue("");
    setIsBotTyping(true);

    let botResponse = " I'm not sure how to answer that.";

    // Check if user asks about "top collections"
    if (userMessage.toLowerCase().includes("top collection") || userMessage.toLowerCase().includes("top feature")) {
      const collections = await getFeaturedCollections();

      botResponse =
        collections.length > 0
          ? `Here are the top collections:\n${collections
              .slice(0, 5) // Display only top 5 collections
              .map(
                (col, index) => 
                  `${index + 1}. ${col.title} - <a href="${col.url}" target="_blank">View Collection</a>`
              )
              .join("<br>")}`
          : "I couldn't fetch the top collections at the moment.";
    }

    // Bot responds
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
      setIsBotTyping(false);
    }, 1000);
  }

  return (
    <div className="container">
      <h1>NFTeez</h1>

      <div className="chatWindow">
        {messages.map((msg, index) => (
          <div key={index} className={`messageBubble ${msg.role === "user" ? "userBubble" : "botBubble"}`}>
            <strong>{msg.role}:</strong>
            <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br>") }} />
          </div>
        ))}
      </div>

      <div className="inputArea">
        <input
          className="input"
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={isBotTyping}
        />
        <button className="sendButton" onClick={handleSend} disabled={isBotTyping}>
          {isBotTyping ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
} 

/**
 * import React, { useState, useEffect } from "react";

// Define message structure
interface Message {
  role: string;
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Step 1: Connect to WebSocket when the component loads
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765"); // Connect to WebSocket server

    // Log when the connection opens
    ws.onopen = () => {
      console.log("✅ WebSocket connected");  // Connection established
    };

    // Log when the WebSocket is receiving data
    ws.onmessage = (event) => {
      console.log("📨 Response from chatbot:", event.data); // Log received data
      setMessages((prev) => [...prev, { role: "bot", text: event.data }]);
      setIsBotTyping(false); // Bot stops typing when a response is received
    };

    // Log errors if the WebSocket fails to connect
    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);  // Connection error
    };

    // Log when the WebSocket is closed
    ws.onclose = () => {
      console.log("❌ WebSocket closed");  // Connection closed
    };

    setSocket(ws);  // Store the WebSocket connection

    return () => {
      if (ws) {
        ws.close();  // Cleanup on component unmount
      }
    };
  }, []);

  // Step 2: Send user input to chatbot
  async function handleSend() {
    console.log("🔴 handleSend triggered");

    if (!inputValue.trim() || isBotTyping || !socket) return;

    const userMessage = inputValue.trim();
    console.log("Sending user message:", userMessage);  // Log the user message
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInputValue("");
    setIsBotTyping(true); // Set bot as typing

    // Send message via WebSocket to the backend
    if (socket) {
      console.log("WebSocket sending:", userMessage);  // Log what will be sent
      socket.send(userMessage);
    }
  }

  return (
    <div className="container">
      <h1>NFTeez</h1>

      <div className="chatWindow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`messageBubble ${msg.role === "user" ? "userBubble" : "botBubble"}`}
          >
            <strong>{msg.role}:</strong>
            <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br>") }} />
          </div>
        ))}
      </div>

      <div className="inputArea">
        <input
          className="input"
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={isBotTyping}
        />
        <button className="sendButton" onClick={handleSend} disabled={isBotTyping}>
          {isBotTyping ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
 */