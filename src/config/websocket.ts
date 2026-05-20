import { Client } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';

let clientWs: Client | null = null;
let errorSubscribed = false;


export function connectWebSocket(onReady?: (client: Client) => void) {
  if (clientWs?.connected) {
    onReady?.(clientWs);
    return;
  }

  clientWs = new Client({
    webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),

    reconnectDelay: 5000,

    beforeConnect: () => {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token');

      clientWs!.connectHeaders = {
        Authorization: `Bearer ${token}`,
      };
    },

    onConnect: () => {
      console.log('WebSocket conectado');

      if (!errorSubscribed) {
        clientWs!.subscribe('/user/queue/errors', (message) => {
          const error = JSON.parse(message.body);

          toast.error(error.message);

          error.details?.forEach((d: string) => toast.error(d));
        });

        errorSubscribed = true;
      }

      onReady?.(clientWs!);
    },
  });

  clientWs.activate();
}