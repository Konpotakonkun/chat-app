// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// HTMLファイルを返す HTTP サーバー
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/chat.html') {
    const filePath = path.join(__dirname, 'chat.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('エラーが発生しました');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// WebSocketサーバーの作成
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('新しいクライアントが接続しました');

  ws.on('message', (message) => {
    // 他の全クライアントにブロードキャスト
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('クライアントが切断されました');
  });
});

// サーバー起動
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`サーバー起動中: http://localhost:${PORT}`);
});
