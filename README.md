# Deepgram WebSocket Proxy

This project implements a secure approach for connecting to Deepgram's WebSocket API using a proxy server. It consists of:

1. **Frontend**: An Angular application that captures audio and displays transcriptions
2. **Backend**: A Node.js server that acts as a proxy between the frontend and Deepgram's API

## Project Structure

- `/frontend` - Angular application code
- `/backend` - Node.js proxy server code

## Features

- Secure API key handling (stored only on the server)
- WebSocket proxy to handle authentication with Deepgram
- Real-time audio transcription
- Robust error handling and connection management

## Setup

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

## Environment Variables

Create a `.env` file in the backend directory with your Deepgram API key:

```
DEEPGRAM_API_KEY=your_api_key_here
```
