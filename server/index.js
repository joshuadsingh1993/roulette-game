const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

// Set up Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  // Handle messages from client
  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === "spin") {
      // Generate random number (0-36)
      const winningNumber = Math.floor(Math.random() * 37);

      // Broadcast result to all clients
      const response = {
        type: "result",
        number: winningNumber,
        color: getNumberColor(winningNumber),
        timestamp: Date.now(),
      };

      broadcastMessage(response);
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Broadcast message to all connected clients
function broadcastMessage(message) {
  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Helper function to get color based on roulette number
function getNumberColor(number) {
  if (number === 0) return "green";

  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  return redNumbers.includes(number) ? "red" : "black";
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
