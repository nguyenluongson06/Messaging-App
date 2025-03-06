import React from "react";

const Message = ({ text, sender }) => {
  return (
    <div className={`message ${sender === "You" ? "you" : "other"}`}>
      <strong>{sender}:</strong> {text}
    </div>
  );
};

export default Message;
