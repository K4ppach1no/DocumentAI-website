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

  // Method to get chat completions with memory
  async getChatCompletionWithMemory(model, messages, memory = []) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages: [...memory, ...messages]
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

  // Method to ask questions about an uploaded document
  async askQuestionsAboutDocument(file, model, questions) {
    try {
      // Step 1: Upload the document
      const uploadResponse = await this.uploadFile(file);
      const documentId = uploadResponse.id; // Assuming the response contains an 'id' field

      // Step 2: Ask questions about the uploaded document
      const messages = questions.map(question => ({ role: 'user', content: question }));
      const response = await this.getChatCompletionWithMemory(model, messages, [{ role: 'system', content: `Document ID: ${documentId}` }]);

      return response;  // Return the response from the chat completion
    } catch (error) {
      console.error("Error asking questions about document:", error);
      throw error;
    }
  }
}

export default OpenWebUIApi;
