const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// publicフォルダ内のファイルを配信
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket通信処理
wss.on('connection', (ws) => {
  console.log('新しいクライアントが接続しました');

  ws.on('message', (message) => {
    console.log('受信:', message.toString());
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

// Render対応：環境変数PORTを使う
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`サーバー起動中: ポート ${PORT}`);
});
