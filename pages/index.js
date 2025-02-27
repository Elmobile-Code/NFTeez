import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! How can I help you today?' },
  ]);
  const [inputValue, setInputValue] = useState('');

  function handleSend() {
    if (!inputValue.trim()) return;

    // user input
    const newUserMessage = { role: 'user', text: inputValue.trim() };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');

    // bot output
    setTimeout(() => {
      const botReply = {
        role: 'bot',
        text: 'output',
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  }

  return (
    <div className="container">
      <h1>Chatbot Page</h1>
      <div className="chatWindow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`messageBubble ${msg.role === 'user' ? 'userBubble' : 'botBubble'}`}
          >
            <strong>{msg.role}:</strong> {msg.text}
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
            if (e.key === 'Enter') handleSend();
          }}  
        />
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
