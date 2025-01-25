const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.send(JSON.stringify({ type: 'history', messages: [] }));

  ws.on('message', (message) => {
    const msgData = JSON.parse(message);
    clients.forEach(client => {
      if (client !== ws) {
        client.send(JSON.stringify({ type: 'message', text: msgData.text }));
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
