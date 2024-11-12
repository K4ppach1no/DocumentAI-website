import React, { Component } from 'react';

class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = { messageText: '' };
  }

  handleChange = (event) => {
    this.setState({ messageText: event.target.value });
  };

  handleSend = () => {
    const { messageText } = this.state;
    if (messageText.trim()) {
      this.props.onSendMessage(messageText);
      this.setState({ messageText: '' });
    }
  };

  render() {
    return (
      <div className="input-container">
        <input
          type="text"
          value={this.state.messageText}
          onChange={this.handleChange}
          placeholder="Type a message..."
        />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}

export default ChatInput;
