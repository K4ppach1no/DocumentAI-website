import React from 'react';

function ChatInput({ input, onInputChange, onSendMessage }) {
  const handleInputChange = (event) => {
    onInputChange(event);
  };

  const handleSendMessage = (event) => {
    onSendMessage(event);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage(event);
    }
  };

  return (
    <div className="ChatInputContainer">
      <div className="ChatInput">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows="3"
        />
        <button onClick={handleSendMessage} className='SendButton'>Send</button>
      </div>
    </div>
  );
}

export default ChatInput;
