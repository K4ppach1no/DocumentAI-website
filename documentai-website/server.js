const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

app.post('/log', (req, res) => {
  const messages = req.body.messages;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(__dirname, 'logs', `chat-log-${timestamp}.json`);

  if (!fs.existsSync(path.join(__dirname, 'logs'))) {
    fs.mkdirSync(path.join(__dirname, 'logs'));
  }

  fs.writeFileSync(logFile, JSON.stringify(messages, null, 2), 'utf8');
  res.status(200).send('Log saved');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
