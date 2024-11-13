// src/ChatInput.js
import React, { Component } from 'react';

class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift + Enter: add a new line
        this.setState((prevState) => ({ message: prevState.message }));
      } else {
        // Enter: send the message
        event.preventDefault();
        this.handleSendMessage();
      }
    }
  };

  handleSendMessage = () => {
    const { message } = this.state;
    if (message.trim()) {
      this.props.onSendMessage(message);
      this.setState({ message: '' });
    }
  };

  render() {
    return (
      <div className="ChatInputContainer">
      <div className="ChatInput">
        <textarea
        value={this.state.message}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        placeholder="Type a message..."
        rows="3"
        />
        <button onClick={this.handleSendMessage} className='SendButton'>Send</button>
      </div>
      </div>
    );
  }
}

export default ChatInput;
