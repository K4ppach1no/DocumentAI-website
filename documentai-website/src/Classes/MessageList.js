import React, { Component } from 'react';

class MessageList extends Component {
  render() {
    return (
      <div className="message-container">
        {this.props.messages.map((msg, index) => (
          <div key={index} className="message">
            <p><strong>{msg.sender}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default MessageList;
