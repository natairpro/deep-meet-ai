require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Check for required environment variables
if (!process.env.DEEPGRAM_API_KEY) {
  console.error('Error: DEEPGRAM_API_KEY environment variable is required');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the frontend build directory in production
app.use(express.static('../frontend/dist'));

// Handle WebSocket connections from the frontend
wss.on('connection', (ws) => {
  console.log('Frontend client connected');
  
  // Create a connection to Deepgram
  const deepgramWs = new WebSocket('wss://api.deepgram.com/v1/listen', {
    headers: {
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`
    }
  });

  let isDeepgramConnected = false;
  
  // Handle Deepgram connection events
  deepgramWs.on('open', () => {
    console.log('Connected to Deepgram WebSocket API');
    isDeepgramConnected = true;
    
    // Send initial parameters to Deepgram
    const params = {
      encoding: 'linear16',
      sample_rate: 16000,
      channels: 1,
      language: 'en',
      model: 'nova-2',
      smart_format: true,
      interim_results: true
    };
    
    deepgramWs.send(JSON.stringify(params));
  });

  deepgramWs.on('message', (data) => {
    // Forward Deepgram's response to the frontend
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data.toString());
    }
  });

  deepgramWs.on('error', (error) => {
    console.error('Deepgram WebSocket error:', error);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ error: 'Deepgram connection error' }));
    }
  });

  deepgramWs.on('close', (code, reason) => {
    console.log(`Deepgram WebSocket closed: ${code} - ${reason}`);
    isDeepgramConnected = false;
    
    // Inform the frontend that the Deepgram connection is closed
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ status: 'disconnected', code, reason }));
    }
  });

  // Handle messages from the frontend
  ws.on('message', (message) => {
    // Check if the message is binary (audio data) or text (control message)
    if (message instanceof Buffer) {
      // Forward audio data to Deepgram if connected
      if (isDeepgramConnected && deepgramWs.readyState === WebSocket.OPEN) {
        deepgramWs.send(message);
      }
    } else {
      // Handle control messages from frontend (if any)
      try {
        const controlMessage = JSON.parse(message.toString());
        console.log('Received control message:', controlMessage);
        
        // Handle specific control messages here if needed
      } catch (e) {
        console.error('Error parsing control message:', e);
      }
    }
  });

  // Handle frontend disconnection
  ws.on('close', () => {
    console.log('Frontend client disconnected');
    // Close the Deepgram connection when the frontend disconnects
    if (deepgramWs.readyState === WebSocket.OPEN) {
      deepgramWs.close();
    }
  });

  // Send initial connection status to the frontend
  ws.send(JSON.stringify({ status: 'connected' }));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
