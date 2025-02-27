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