// src/ChatApp.js
import React, { Component } from 'react';
import OpenWebUIApi from './OpenWebUI';
import ChatInput from './ChatInput';
import MessageList from '../Components/MessageList';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import LogChat from './LogChat'; // Import LogChat

class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      models: [],
      selectedModel: '',
      files: [],
      selectedFile: '',
      collections: [],
      selectedCollection: '',
    };

    // Instantiate the API client with your Open-webUI API key
    this.apiClient = new OpenWebUIApi("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0YTBhZjIyLTIwOGMtNGNkMC1iNzkyLWEyZjRhYzg4MzhkOCJ9.NTW3wveB3kuSdSEntaXo7cRprG5E8SMkH7kDJk4WIqw");
  }

  async componentDidMount() {
    try {
      // Fetch the models when the component mounts
      const modelsData = await this.apiClient.getModels();
      const models = modelsData.data.map(model => ({
        id: model.id,
        name: model.name,
      }));
      const defaultModel = models.find(model => model.name === 'IoT')?.id || models[0]?.id || '';
      this.setState({ models, selectedModel: defaultModel });

      // Fetch the existing files when the component mounts
      const filesData = await this.apiClient.getFiles();
      const files = filesData.map(file => ({
        id: file.id,
        name: file.meta.name,
      }));
      files.unshift({ id: '', name: 'No file selected' });
      this.setState({ files, selectedFile: files[0]?.id || '' });

      // Fetch the collections when the component mounts
      const collectionsData = await this.apiClient.getCollections();
      const collections = Array.isArray(collectionsData) ? collectionsData.map(collection => ({
        id: collection.id,
        name: collection.name,
      })) : [];
      collections.unshift({ id: '', name: 'No collection selected' });
      const defaultCollection = collections.find(collection => collection.name === 'IoT')?.id || collections[0]?.id || '';
      this.setState({ collections, selectedCollection: defaultCollection });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.messages.length !== this.state.messages.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  handleModelChange = (event) => {
    this.setState({ selectedModel: event.target.value });
  };

  handleFileChange = (event) => {
    this.setState({ selectedFile: event.target.value });
    this.setState({ selectedCollection: '' });
  };

  handleCollectionChange = (event) => {
    this.setState({ selectedCollection: event.target.value });
    this.setState({ selectedFile: '' });
  };

  handleSendMessage = async (messageText) => {
    const { selectedModel, selectedFile, selectedCollection, messages } = this.state;
    const userMessage = { sender: 'User', text: messageText };
    this.setState((prevState) => ({
      messages: [...prevState.messages, userMessage],
    }));

    try {
      const messageHistory = messages.map(msg => ({ role: msg.sender.toLowerCase() === 'user' ? 'user' : 'assistant', content: msg.text }));
      messageHistory.push({ role: 'user', content: userMessage.text });

      let response;
      if (selectedFile) {
        response = await this.apiClient.getChatCompletionWithFile(selectedModel, messageHistory, selectedFile);
      } else if (selectedCollection) {
        response = await this.apiClient.getChatCompletionWithCollection(selectedModel, messageHistory, selectedCollection);
      } else {
        response = await this.apiClient.getChatCompletion(selectedModel, messageHistory);
      }

      const botMessage = {
        sender: selectedModel,
        text: response.choices[0].message.content,
        references: response.choices[0].message.sources ? response.choices[0].message.sources.map(source => ({
          name: source.source.name,
          content: source.document.join('\n'),
          metadata: source.metadata
        })) : []
      };
      this.setState((prevState) => ({
        messages: [...prevState.messages, botMessage],
      }), () => {
        LogChat.logMessageHistory(this.state.messages); // Log the chat history
      });
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
        this.setState((prevState) => ({
          messages: [...prevState.messages, { sender: 'System', text: 'File uploaded successfully. Response: ' + JSON.stringify(response) }],
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
    const { models, selectedModel, messages, files, selectedFile, collections, selectedCollection } = this.state;

    return (
      <div className="ChatApp">
        <header className="App-header">
          <div className="navbar">
            <h1>Document AI</h1>
            <Link to="/manage-collections">Manage Collections</Link>
            <Link to="/manage-chats">Manage Chats</Link>
          </div>
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
            <label htmlFor="fileSelect">Select Existing File: </label>
            <select
              id="fileSelect"
              value={selectedFile}
              onChange={this.handleFileChange}
            >
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>
          <div className='option-container-item'>
            <label htmlFor="collectionSelect">Select Collection: </label>
            <select
              id="collectionSelect"
              value={selectedCollection}
              onChange={this.handleCollectionChange}
            >
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
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
          <div ref={(el) => { this.messagesEnd = el; }} />
        <ChatInput onSendMessage={this.handleSendMessage} />
        <div ref={(el) => { this.messagesEnd = el; }} />
      </div>
    );
  }
}

export default ChatApp;