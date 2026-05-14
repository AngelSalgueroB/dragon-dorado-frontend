import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let clientWs: Client | null = null;

export function connectWebSocket() {
  const token = localStorage.getItem('accessToken');

  if (!token) return;

  clientWs = new Client({
    webSocketFactory: () =>
      new SockJS(
        `${import.meta.env.VITE_BACKEND_URL}/ws`
      ),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    debug: (str) => {
      console.log(str);
    },

    onConnect: () => {
      console.log('WebSocket conectado');
    },

    onStompError: (frame) => {
      console.error('Error STOMP', frame);
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