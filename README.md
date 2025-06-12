# 🎲 European Roulette App

This project is a work-in-progress web-based European Roulette game featuring a real-time spinning wheel powered by WebSockets. The app consists of a client and server setup that work together to provide interactive gameplay.

> 🚧 **Disclaimer:** This project is incomplete.  
> 🛠 It is **not fully responsive** and may not be mobile-friendly. Expect bugs and incomplete features.

---

## 🛠️ Getting Started

Follow the steps below to start the development version of the app:

### 1. Start the Server (WebSocket)

Navigate to the `server` directory and run the WebSocket server:

```bash
cd server
npm install
npm run start
```

Server will start on port 3000

### 2. Start the Client

Open a new terminal, return to the root, and go into the client folder:

```bash
cd ..
cd client
npm install
npm run build
npm run preview
```

Client app will start on port 5173

## 🎮 How to Play

Once both the server and client are running:

Open your browser and go to http://localhost:5173

You should see the European Roulette game interface

Press the spin button to spin the roulette wheel!

## 📌 Notes

WebSocket communication is used for real-time spin results

## 📂 Project Structure

```plaintext
├── client   # Frontend application
└── server   # WebSocket server
```
