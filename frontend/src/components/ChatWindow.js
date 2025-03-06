import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Message from "./Message";

const ChatWindow = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Khi đổi sang người khác, xóa tin nhắn cũ
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
    <div className="chat-box">
      <div className="messages">
        <h5 className="text-center">Đang chat với {user?.name || "..."}</h5>
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
  );
};

export default ChatWindow;
