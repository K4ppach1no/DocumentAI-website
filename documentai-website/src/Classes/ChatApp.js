// src/ChatApp.js
import React, { Component } from 'react';
import OpenWebUIApi from './OpenWebUI';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

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
    this.apiClient = new OpenWebUIApi("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkMDgyYzBiLTNmNWEtNDM0OS1hZDk2LTI1YjU2YzViMzY4ZCJ9.ZWwIyGYl-kx-LEE2F-3M59_LAuZ0YZAhqjDKFb18JMM");
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
      this.setState({ collections, selectedCollection: collections[0]?.id || '' });
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

  // Method to fetch collection details
  handleFetchCollectionDetails = async (collectionId) => {
    try {
      const collectionDetails = await this.apiClient.getCollectionDetails(collectionId);
      console.log("Collection details:", collectionDetails);
      this.setState((prevState) => ({
        messages: [...prevState.messages, { sender: 'System', text: 'Collection details: ' + JSON.stringify(collectionDetails) }],
      }));
    } catch (error) {
      console.error("Error fetching collection details:", error);
      this.setState((prevState) => ({
        messages: [...prevState.messages, { sender: 'System', text: 'Error fetching collection details.' }],
      }));
    }
  };

  handleModelChange = (event) => {
    this.setState({ selectedModel: event.target.value });
  };

  handleFileChange = (event) => {
    this.setState({ selectedFile: event.target.value });
  };

  handleCollectionChange = (event) => {
    this.setState({ selectedCollection: event.target.value });
  };

  handleCreateCollection = async (collectionName) => {
    try {
      const response = await this.apiClient.createCollection(collectionName);
      console.log("Collection created successfully:", response);
      this.setState((prevState) => ({
        collections: [...prevState.collections, { id: response.id, name: response.name }],
        messages: [...prevState.messages, { sender: 'System', text: 'Collection created successfully. Response: ' + JSON.stringify(response) }],
      }));
    } catch (error) {
      console.error("Error creating collection:", error);
      this.setState((prevState) => ({
        messages: [...prevState.messages, { sender: 'System', text: 'Error creating collection.' }],
      }));
    }
  };

  handleAddFileToCollection = async (fileId) => {
    const { selectedCollection } = this.state;
    if (selectedCollection) {
      try {
        const response = await this.apiClient.addFileToCollection(selectedCollection, fileId);
        console.log("File added to collection successfully:", response);
        this.setState((prevState) => ({
          messages: [...prevState.messages, { sender: 'assistant', text: 'File added to collection successfully. Response: ' + JSON.stringify(response) }],
        }));
      } catch (error) {
        console.error("Error adding file to collection:", error);
        this.setState((prevState) => ({
          messages: [...prevState.messages, { sender: 'assistant', text: 'Error adding file to collection.' }],
        }));
      }
    } else {
      this.setState((prevState) => ({
        messages: [...prevState.messages, { sender: 'assistant', text: 'No collection selected.' }],
      }));
    }
  };

  handleSendMessage = async (messageText) => {
    const { selectedModel, selectedFile, messages } = this.state;
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
      } else {
        response = await this.apiClient.getChatCompletion(selectedModel, messageHistory);
      }

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
      </div>
    );
  }
}

export default ChatApp;