import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hey! How can I help you today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  function handleSend() {
    if (!inputValue.trim() || isBotTyping) return; 
    setMessages((prev) => [...prev, { role: 'user', text: inputValue.trim() }]);
    setInputValue('');
    setIsBotTyping(true); // Disable input while bot is responding

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'sigma ligma alpha' },
      ]);
      setIsBotTyping(false);
    }, 1000);
  }

  return (
    <div className="container">
      <h1>NFTeez</h1>

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
          disabled={isBotTyping} // Disable input while bot is typing
        />
        <button className="sendButton" onClick={handleSend} disabled={isBotTyping}>
          {isBotTyping ? '...' : 'Send'} {}
        </button>
      </div>
    </div>
  );
}