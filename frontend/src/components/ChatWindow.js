import React, { useState, useEffect } from "react";
import { Form, Button, Image } from "react-bootstrap";
import Message from "./Message";

const ChatWindow = ({ user }) => {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");

  // Reset tin nhắn khi user thay đổi
  useEffect(() => {
    setMessages([]);
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "You" }]);
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* Header của khung chat */}
      <div className="chat-header">
        <div className="chat-user-info">
          <Image src={user.avatar} roundedCircle className="chat-user-avatar" />
          <span className="chat-user-name">{user.name}</span>
        </div>
        <button className="info-btn">ℹ️</button>
      </div>

      {/* Khu vực tin nhắn */}
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <Message key={index} text={msg.text} sender={msg.sender} />
          ))}
        </div>
        <Form className="input-area" onSubmit={sendMessage}>
          <Form.Control
            type="text"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" variant="primary">Gửi</Button>
        </Form>
      </div>
    </div>
  );
};

export default ChatWindow;
