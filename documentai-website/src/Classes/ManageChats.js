import React, { Component } from 'react';
import OpenWebUIApi from './OpenWebUI';
import MessageList from '../Components/MessageList';
import ChatInput from './ChatInput'; // Import ChatInput
import { Link } from 'react-router-dom';

class ManageChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      selectedChatId: '',
      messages: [],
    };

    this.apiClient = new OpenWebUIApi("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0YTBhZjIyLTIwOGMtNGNkMC1iNzkyLWEyZjRhYzg4MzhkOCJ9.NTW3wveB3kuSdSEntaXo7cRprG5E8SMkH7kDJk4WIqw");
  }

  async componentDidMount() {
    try {
      const chats = await this.apiClient.getUserChats();
      this.setState({ chats: Array.isArray(chats) ? chats : [] });
    } catch (error) {
      console.error("Error fetching chats:", error);
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

  handleChatChange = async (event) => {
    const selectedChatId = event.target.value;
    this.setState({ selectedChatId });

    if (selectedChatId) {
      try {
        const chatContent = await this.apiClient.getChatContent(selectedChatId);
        const messages = Object.values(chatContent.chat.history.messages).map(msg => ({
          sender: msg.role === 'user' ? 'User' : 'Assistant',
          text: msg.content,
          references: msg.sources ? msg.sources.map(source => ({
            name: source.source.name,
            content: source.document.join('\n'),
            metadata: source.metadata
          })) : []
        }));
        this.setState({ messages });
      } catch (error) {
        console.error("Error fetching chat content:", error);
      }
    } else {
      this.setState({ messages: [] });
    }
  };

  handleCreateChat = async () => {
    const chatTitle = prompt("Enter the title for the new chat:");
    if (chatTitle) {
      try {
        const newChat = await this.apiClient.createChat(chatTitle);
        this.setState((prevState) => ({
          chats: [...prevState.chats, newChat],
          selectedChatId: newChat.id,
          messages: []
        }));
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    }
  };

  handleSendMessage = async (messageText) => {
    const { selectedChatId } = this.state;
    if (!selectedChatId) {
      alert("Please select a chat first.");
      return;
    }

    const userMessage = { sender: 'User', text: messageText };
    this.setState((prevState) => ({
      messages: [...prevState.messages, userMessage],
    }));

    try {
      const response = await this.apiClient.sendMessageToChat(selectedChatId, userMessage.text);
      const botMessage = { sender: 'Assistant', text: response.message };
      this.setState((prevState) => ({
        messages: [...prevState.messages, botMessage],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      this.setState((prevState) => ({
        messages: [...prevState.messages, { sender: 'Bot', text: 'Error sending message.' }],
      }));
    }
  };

  render() {
    const { chats, selectedChatId, messages } = this.state;

    return (
      <div className="ManageChats">
        <header className="App-header">
          <div className="navbar">
            <h1>Document AI</h1>
            <Link to="/">Home</Link>
          </div>
        </header>
        <div className='option-container'>
          <div className='option-container-item'>
            <label htmlFor="chatSelect">Select Chat: </label>
            <select
              id="chatSelect"
              value={selectedChatId}
              onChange={this.handleChatChange}
            >
              <option value="">Select a chat</option>
              {chats.map((chat) => (
                <option key={chat.id} value={chat.id}>
                  {chat.title}
                </option>
              ))}
            </select>
          </div>
          <div className='option-container-item'>
            <button onClick={this.handleCreateChat}>Create New Chat</button>
          </div>
        </div>
        <MessageList messages={messages} />
        <ChatInput onSendMessage={this.handleSendMessage} />
        <div ref={(el) => { this.messagesEnd = el; }} />
      </div>
    );
  }
}

export default ManageChats;
