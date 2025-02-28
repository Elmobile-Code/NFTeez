import React, { useState } from "react";

interface Collection {
  title: string;
  url: string;
}

interface NFT {
  title: string;
  price: string;
  owner: string;
  image: string;
}

async function getFeaturedCollections(): Promise<Collection[]> {
  try {
    const response = await fetch("/api/collections"); // Proxy API route
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // Adjust mapping as needed based on the Paras API response structure
    return data?.data?.results.map((item: any) => ({
      title: item.collection, // Or item.metadata.title if available
      url: item.url || `https://paras.id/collection/${item.collection_id}`, // Generate a URL if not provided
    })) || [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

// Fetch NFT price for a specific NFT using collection name and token series ID
async function getNFTPrice(nftQuery: string): Promise<NFT | null> {
  try {
    // Match input like "What is the price of Rogue Genesis 1:290"
    const match = nftQuery.match(/what\s+is\s+the\s+price\s+of\s+([\w\s]+)\s+(\d+:\d+)/i);
    if (!match) {
      console.log("Invalid NFT query format:", nftQuery);
      return null;
    }

    const collectionName = match[1].trim(); 
    const tokenSeriesId = match[2].trim();   

    let contractId = "";
    if (
      collectionName.toLowerCase() === "rogue genesis" ||
      collectionName.toLowerCase() === "rogues genesis"

    ) {
      contractId = "rogues-genesis.nfts.fewandfar.near";
    } else {
      console.log("No contract mapping for collection:", collectionName);
      return null;
    }

    console.log(
      `Fetching NFT data for collection: ${collectionName} with token_series_id: ${tokenSeriesId} using contract: ${contractId}`
    );

    // Call Next.js API proxy
    const response = await fetch(
      `/api/getNFTPrice?tokenSeriesId=${encodeURIComponent(tokenSeriesId)}&contractId=${encodeURIComponent(contractId)}`
    );

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (!data.data?.results || data.data.results.length === 0) {
      console.log("NFT not found on Paras for token_series_id:", tokenSeriesId);
      return null;
    }

    const nft = data.data.results[0]; // Get the first result

    return {
      title: nft.metadata.title,
      price: nft.price
        ? (parseFloat(nft.price) / 1e18).toFixed(2) + " yoctoNEAR"
        : "Not listed",
      owner: nft.owner_id,
      image: nft.metadata.media
        ? nft.metadata.media.replace("ipfs://", "https://ipfs.io/ipfs/")
        : "",
    };
  } catch (error) {
    console.error("Error fetching NFT price:", error);
    return null;
  }
}

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  async function handleSend() {
    if (!inputValue.trim() || isBotTyping) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInputValue("");
    setIsBotTyping(true);

    let botResponse = "I'm not sure how to answer that.";

    // Detect if the user is asking for an NFT price
    const priceMatch = userMessage.match(/what\s+is\s+the\s+price\s+of\s+([\w\s]+)\s+(\d+:\d+)/i);
    if (priceMatch) {
      const nftData = await getNFTPrice(userMessage);
      botResponse = nftData
        ? `The NFT <strong>${nftData.title}</strong> is listed for <strong>${nftData.price}</strong>.<br>Owner: ${nftData.owner}<br><br><img src="${nftData.image}" alt="NFT Image" width="200"/>`
        : `I couldn't find the NFT for the query <strong>${userMessage}</strong> on Paras.`;
    }
    // Detect if the user is asking for top collections
    else if (
      userMessage.toLowerCase().includes("top collections") ||
      userMessage.toLowerCase().includes("top collection")
    ) {
      const collections = await getFeaturedCollections();
      botResponse =
        collections.length > 0
          ? `Here are the top collections:<br>${collections
              .slice(0, 5)
              .map(
                (col, index) =>
                  `${index + 1}. ${col.title} - <a href="${col.url}" target="_blank">View Collection</a>`
              )
              .join("<br>")}`
          : "I couldn't fetch the top collections at the moment.";
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: botResponse },
      ]);
      setIsBotTyping(false);
    }, 1000);
  }

  return (
    <div className="container">
      <h1>Chatbot Page</h1>
      <div className="chatWindow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`messageBubble ${
              msg.role === "user" ? "userBubble" : "botBubble"
            }`}
          >
            <strong>{msg.role}:</strong>{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: msg.text.replace(/\n/g, "<br>"),
              }}
            />
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
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isBotTyping}
        >
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