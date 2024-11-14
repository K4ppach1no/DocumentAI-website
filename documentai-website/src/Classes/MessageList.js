import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="MessageList">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          <span className="role">{message.role}:</span> {message.content}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
