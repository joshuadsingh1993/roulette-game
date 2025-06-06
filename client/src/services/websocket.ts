import { ref, onUnmounted, shallowRef } from "vue";
import { useGameStore } from "../stores/gameStore";

export interface WebSocketData {
  color: "red" | "black";
  number: number;
  timestamp: number;
  type: "result";
}

export interface WebSocketMessage {
  type: string;
  data: WebSocketData;
}

// Create a singleton instance that can be shared across components
const socket = shallowRef<WebSocket | null>(null);
const isConnected = ref(false);
const lastMessage = ref<WebSocketMessage | null>(null);
const error = ref<Event | null>(null);

export function useWebSocket(url: string = "ws://localhost:3000") {
  // Create the store reference at the composable level
  const gameStore = useGameStore();

  // Connect to the WebSocket server only if not already connected
  const connect = () => {
    // Check if socket already exists and is connected or connecting
    if (
      socket.value &&
      (socket.value.readyState === WebSocket.OPEN ||
        socket.value.readyState === WebSocket.CONNECTING)
    ) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    // Close existing socket if in an invalid state
    if (socket.value) {
      socket.value.close();
    }

    socket.value = new WebSocket(url);

    socket.value.onopen = () => {
      console.log("WebSocket connected");
      isConnected.value = true;
    };

    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        lastMessage.value = data;
        // Use the store reference
        gameStore.startSpin(5, data.number);

        console.log("Message received:", data);
      } catch (e) {
        lastMessage.value = {
          type: "raw",
          data: event.data,
        };
        console.log("Raw message received:", event.data);
      }
    };

    socket.value.onerror = (event) => {
      console.error("WebSocket error:", event);
      error.value = event;
    };

    socket.value.onclose = () => {
      console.log("WebSocket disconnected");
      isConnected.value = false;
    };
  };

  // Disconnect from the WebSocket server
  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
      isConnected.value = false;
    }
  };

  // Send a message to the WebSocket server
  const send = (data: { type: "spin" }) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      const message = typeof data === "string" ? data : JSON.stringify(data);
      socket.value.send(message);
    } else {
      console.error("Cannot send message: WebSocket is not connected");
      // Optionally reconnect and then send
      // connect();
      // setTimeout(() => send(data), 500);
    }
  };

  // Clean up on component unmount - but be careful not to disconnect
  // if other components are still using the websocket
  onUnmounted(() => {
    // Only disconnect if this is the last component using the socket
    // For a more robust solution, you may want to implement a reference counter
    // disconnect();
  });

  return {
    connect,
    disconnect,
    send,
    isConnected,
    lastMessage,
    error,
  };
}
