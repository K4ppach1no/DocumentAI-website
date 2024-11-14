// src/ChatApp.js
import React, { useState, useEffect, useMemo } from 'react';
import OpenWebUIApi from './OpenWebUI';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [file, setFile] = useState(null);
  const [input, setInput] = useState('');

  const api = useMemo(() => new OpenWebUIApi('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmZTM4ZmQwLTJlYTktNGUxMi05ZGZmLTljMTRlNjEzMTM0NCJ9.H5UPF1HUW-sjcZ_XHs0nX2br4tAt_7oQYyDaHtYf99Y'), []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const modelsData = await api.getModels();
        const models = modelsData.data.map(model => ({
          id: model.id,
          name: model.name,
        }));
        setModels(models);
        setSelectedModel(models[0]?.id || '');
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, [api]);

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    if (event.preventDefault) {
      event.preventDefault();
    }
    const newMessages = [{ role: 'user', content: input }];
    setMessages(prevMessages => [...prevMessages, ...newMessages]);
    setInput('');

    try {
      let response;
      if (file) {
        response = await api.askQuestionsAboutDocument(file, selectedModel, newMessages.map(msg => msg.content));
      } else {
        response = await api.getChatCompletionWithMemory(selectedModel, newMessages, messages);
      }
      const aiMessage = { role: `${selectedModel}`, content: response.choices[0].message.content };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="ChatApp">
      <header className="App-header">
        <h1>Document AI</h1>
      </header>
      <div className='option-container'>
        <div className='option-container-item'>
          <label htmlFor="modelSelect">Select Model: </label>
          <select
            id="modelSelect"
            value={selectedModel}
            onChange={handleModelChange}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        <div className='option-container-item'>
          <label htmlFor="fileUpload">Upload File:</label>
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="message-container">
        <MessageList messages={messages} />
      </div>
      <ChatInput 
        input={input}
        onInputChange={handleInputChange}
        onSendMessage={handleSubmit}
      />
    </div>
  );
}

export default ChatApp;