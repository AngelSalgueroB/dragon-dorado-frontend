import { Client } from '@stomp/stompjs';
import { OrderStatus, UpdateOrderRequest } from './orders.interface';

export function updateOrder(
  client: Client | null,
  request: UpdateOrderRequest,
) {
  if (!client?.connected) {
    throw new Error('WebSocket no conectado');
  }

  client.publish({
    destination: '/app/orders/update',
    body: JSON.stringify(request),
  });
}

export function cancelOrder(
  client: Client | null,
  orderId: number,
  details?: string,
) {
  updateOrder(client, {
    orderId,
    status: OrderStatus.CANCELLED,
    details,
  });
}
