// API Key: 

import axios from 'axios';

class OpenWebUI {
  constructor(apiKey, baseUrl = 'http://localhost:8080/api') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // Method to retrieve all available models
  async getModels() {
    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.data;  // Return the models data
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  }

  // Method to get chat completions
  async getChatCompletion(model, messages) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;  // Return the chat completion response
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      throw error;
    }
  }

  // Method to get a chat completion with a file
  async getChatCompletionWithFile(model, messages, fileId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages,
          files: [
            {
              type: 'file',
              id: fileId
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;  // Return the chat completion response
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      throw error;
    }
  }

  // Method to get a chat completion with a collection
  async getChatCompletionWithCollection(model, messages, collectionId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages,
          'files': [
            {
              'type': 'collection',
              'id': collectionId
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;  // Return the chat completion response
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      throw error;
    }
  }

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${this.baseUrl}/v1/files/`, formData, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
      },
    });

    return response.data;
  }

  // Method to list existing files
  async getFiles() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/files/`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.data;  // Return the files data
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  }

  // Method to create a new collection (knowledge base)
  async createCollection(name, description) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/knowledge/create`,
        {
          "name": name,
          "description": description,
          "data": {}
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;  // Return the created collection data
    } catch (error) {
      console.error("Error creating collection:", error);
      throw error;
    }
  }

  // Method to list existing collections (knowledge bases)
  async getCollections() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/knowledge/`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.data;  // Return the collections data
    } catch (error) {
      console.error("Error fetching collections:", error);
      throw error;
    }
  }

  // Method to fetch collection details
  async getCollectionDetails(collectionId) {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/knowledge/${collectionId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.data;  // Return the collection details
    } catch (error) {
      console.error("Error fetching collection details:", error);
      throw error;
    }
  }

  // Method to get a user's chats
  async getUserChats() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/chats/list`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
      });
      return response.data;  // Return the user's chats data
    } catch (error) {
      console.error("Error fetching user's chats:", error);
      throw error;
    }
  }

  // Method to get the content of a specific chat
  async getChatContent(chatId) {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
      });
      return response.data;  // Return the chat content data
    } catch (error) {
      console.error("Error fetching chat content:", error);
      throw error;
    }
  }

  // Method to create a new chat
  async createChat(title) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/chats/new`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;  // Return the created chat data
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data.detail);
      } else {
        console.error("Error creating chat:", error);
      }
      throw error;
    }
  }

  // Method to send a message to a specific chat
  async sendMessageToChat(chatId, message) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/chats/${chatId}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;  // Return the response data
    } catch (error) {
      console.error("Error sending message to chat:", error);
      throw error;
    }
  }

}

export default OpenWebUI;