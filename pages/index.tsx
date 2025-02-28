import React, { useState, useEffect } from "react";

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
