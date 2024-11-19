// API Key: 

import axios from 'axios';

class OpenWebUIApi {
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
}

export default OpenWebUIApi;
