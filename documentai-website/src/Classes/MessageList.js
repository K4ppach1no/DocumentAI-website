import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

class MessageList extends Component {
  render() {
    return (
      <div className="message-container">
        {this.props.messages.map((msg, index) => (
          <div key={index} className="message">
            <p>
              <strong>{msg.sender}:</strong>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </p>
          </div>
        ))}
      </div>
    );
  }
}

export default MessageList;