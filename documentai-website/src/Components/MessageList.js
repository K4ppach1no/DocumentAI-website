import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MessageList = ({ messages }) => {
  const [selectedReference, setSelectedReference] = useState(null);

  const handleReferenceClick = (reference) => {
    setSelectedReference(reference);
  };

  const handleClosePopup = () => {
    setSelectedReference(null);
  };

return (
    <div className="message-list">
        {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender.toLowerCase()}`}>
                <strong>{message.sender}:</strong>
                <div>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
                {message.references && message.references.length > 0 && (
                    <div className="references">
                        <strong>References:</strong>
                        <ul>
                            {message.references.map((ref, refIndex) => (
                                <li key={refIndex}>
                                    <button onClick={() => handleReferenceClick(ref)}>
                                        {ref.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        ))}
        {selectedReference && (
            <div className="popup">
                <div className="popup-content">
                    <span className="close" onClick={handleClosePopup}>&times;</span>
                    <h2>{selectedReference.name}</h2>
                    <div>
                        <ReactMarkdown>{selectedReference.content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default MessageList;
