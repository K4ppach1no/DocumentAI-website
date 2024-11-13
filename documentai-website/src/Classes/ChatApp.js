// src/ChatApp.js
import React, { Component } from 'react';
import OpenWebUIApi from './OpenWebUI';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      models: [],
      selectedModel: '',
    };

    // Instantiate the API client with your Open-webUI API key
    this.apiClient = new OpenWebUIApi('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmZTM4ZmQwLTJlYTktNGUxMi05ZGZmLTljMTRlNjEzMTM0NCJ9.H5UPF1HUW-sjcZ_XHs0nX2br4tAt_7oQYyDaHtYf99Y');
  }

  async componentDidMount() {
    try {
      // Fetch the models when the component mounts
      const modelsData = await this.apiClient.getModels();
      const models = modelsData.data.map(model => ({
        id: model.id,
        name: model.name,
      }));
      this.setState({ models, selectedModel: models[0]?.id || '' });
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  }

  handleModelChange = (event) => {
    this.setState({ selectedModel: event.target.value });
  };

  handleSendMessage = async (messageText) => {
    const { selectedModel } = this.state;
    const userMessage = { sender: 'User', text: messageText };
    this.setState((prevState) => ({
      messages: [...prevState.messages, userMessage],
    }));

    try {
      const response = await this.apiClient.getChatCompletion(selectedModel, [
        { role: 'user', content: messageText },
      ]);

      const botMessage = { sender: selectedModel, text: response.choices[0].message.content };
      this.setState((prevState) => ({
        messages: [...prevState.messages, botMessage],
      }));
    } catch (error) {
      console.error("Error fetching response:", error);
      this.setState((prevState) => ({
        messages: [...prevState.messages, { sender: 'Bot', text: 'Error fetching response.' }],
      }));
    }
  };

  handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await this.apiClient.uploadFile(file);
        console.log("File uploaded successfully:", response);
        this.setState((prevState) => ({
          messages: [...prevState.messages, { sender: 'System', text: 'File uploaded successfully.' }],
        }));
      } catch (error) {
        console.error("Error uploading file:", error);
        this.setState((prevState) => ({
          messages: [...prevState.messages, { sender: 'System', text: 'Error uploading file.' }],
        }));
      }
    }
  };

  render() {
    const { models, selectedModel, messages } = this.state;

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
              onChange={this.handleModelChange}
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
              onChange={this.handleFileUpload}
            />
          </div>
        </div>

        <MessageList messages={messages} />
        <ChatInput onSendMessage={this.handleSendMessage} />
      </div>
    );
  }
}

export default ChatApp;