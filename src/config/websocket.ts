import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let clientWs: Client | null = null;

export function connectWebSocket(
  onConnected: (client: Client) => void,
) {
  const token = localStorage.getItem('accessToken');

  if (!token) return;

  clientWs = new Client({
    webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    onConnect: () => {
      console.log('WebSocket conectado');

      onConnected(clientWs!);
    },
  });

  clientWs.activate();
}

export function disconnectWebSocket() {
  clientWs?.deactivate();
}

export function getWebSocketClient() {
  return clientWs;
}