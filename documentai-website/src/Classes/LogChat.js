import localforage from 'localforage';

class LogChat {
  static async logMessageHistory(messages) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logKey = `chat-log-${timestamp}`;

    try {
      await localforage.setItem(logKey, messages);
      console.log(`Chat log saved with key: ${logKey}`);

      const response = await fetch('http://localhost:3001/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (response.ok) {
        console.log('Chat log saved');
      } else {
        console.error('Error saving chat log:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving chat log:', error);
    }
  }
}

export default LogChat;
