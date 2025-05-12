import { ref, onUnmounted } from "vue";

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

export function useWebSocket(url: string = "ws://localhost:3000") {
  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const lastMessage = ref<WebSocketMessage | null>(null);
  const error = ref<Event | null>(null);

  // Connect to the WebSocket server
  const connect = () => {
    socket.value = new WebSocket(url);

    socket.value.onopen = () => {
      console.log("WebSocket connected");
      isConnected.value = true;
    };

    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        lastMessage.value = data;
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
    if (socket.value && isConnected.value) {
      socket.value.close();
      isConnected.value = false;
    }
  };

  // Send a message to the WebSocket server
  const send = (data: { type: "spin" }) => {
    if (socket.value && isConnected.value) {
      const message = typeof data === "string" ? data : JSON.stringify(data);
      socket.value.send(message);
    } else {
      console.error("Cannot send message: WebSocket is not connected");
    }
  };

  // Clean up on component unmount
  onUnmounted(() => {
    disconnect();
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
