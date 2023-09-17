const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

// Store connected clients
const clients = new Map();

// Handle incoming WebSocket connections
wss.on("connection", (ws, request) => {
  // Assign a unique ID to the client
  const clientId = request.headers.client_id;
  clients.set(clientId, ws);

  // Send the list of recipient IDs to the connected client
  const recipientIds = Array.from(clients.keys());
  ws.send(JSON.stringify(recipientIds));
  // Log the connected clients
  console.log(`Client connected. Total clients: ${clients.size}`);
  console.log(Array.from(clients.keys()));

  // Handle incoming messages from the client
  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    // console.log(parsedMessage);
    const { recipientId, content } = parsedMessage;

    // Send the message to the intended recipient client
    const recipient = clients.get(recipientId);
    if (recipient && recipient.readyState === WebSocket.OPEN) {
      recipient.send(content);
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    // Remove the client from the set of connected clients
    clients.delete(clientId);
    console.log(`Client disconnected. Total clients: ${clients.size}`);
  });
});

console.log("WebRTC server is listening on port 8080");
