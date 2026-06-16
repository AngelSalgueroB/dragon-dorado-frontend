import { Role } from '../actions/users/users.interfaces';
import { OrderStatus, OrderType } from '../actions/orders/orders.interface';

const ALL_ROLES = [Role.ADMIN, Role.MANAGER, Role.WAITER, Role.CASHIER, Role.KITCHEN];
const ADMIN_MANAGER = [Role.ADMIN, Role.MANAGER];
const ORDER_CREATION_ROLES = [Role.ADMIN, Role.MANAGER, Role.WAITER];
const CASH_REGISTER_ROLES = [Role.ADMIN, Role.MANAGER, Role.CASHIER];

export function getHomePathForRole(role?: Role | null) {
  switch (role) {
    case Role.ADMIN:
    case Role.MANAGER:
      return '/dashboard';
    case Role.KITCHEN:
    case Role.WAITER:
    case Role.CASHIER:
      return '/pedidos';
    default:
      return '/login';
  }
}

export function canCreateOrders(role?: Role | null) {
  return !!role && ORDER_CREATION_ROLES.includes(role);
}

export function canCancelOrders(role?: Role | null) {
  return !!role && ADMIN_MANAGER.includes(role);
}

export function canAccessPath(role: Role, pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path === '/dashboard') return ADMIN_MANAGER.includes(role);

  if (path === '/pedidos') return ALL_ROLES.includes(role);

  if (
    path === '/pedidos/salon' ||
    path === '/pedidos/para-llevar' ||
    path === '/pedidos/delivery'
  ) {
    return ORDER_CREATION_ROLES.includes(role);
  }

  if (path === '/ordenes') return ALL_ROLES.includes(role);
  if (path === '/caja') return CASH_REGISTER_ROLES.includes(role);
  if (path === '/cocina') return [Role.ADMIN, Role.MANAGER, Role.KITCHEN].includes(role);
  if (path === '/salon') return [Role.ADMIN, Role.MANAGER, Role.WAITER].includes(role);

  if (
    path === '/usuarios' ||
    path === '/clientes' ||
    path === '/conductores' ||
    path === '/mesas' ||
    path === '/categorias' ||
    path === '/productos'
  ) {
    return ADMIN_MANAGER.includes(role);
  }

  return true;
}

export function getAllowedNextOrderStatuses(
  role: Role,
  currentStatus: OrderStatus,
  orderType: OrderType,
): OrderStatus[] {
  if ([OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(currentStatus)) {
    return [];
  }

  if (role === Role.ADMIN || role === Role.MANAGER) {
    return getBusinessNextStatuses(currentStatus, orderType);
  }

  if (role === Role.KITCHEN) {
    if (currentStatus === OrderStatus.PENDING) return [OrderStatus.PREPARING];
    if (currentStatus === OrderStatus.PREPARING) return [OrderStatus.READY];
    return [];
  }

  if (role === Role.WAITER) {
    if (orderType === OrderType.DINE_IN && currentStatus === OrderStatus.READY) {
      return [OrderStatus.SERVED];
    }
    return [];
  }

  if (role === Role.CASHIER) {
    if (orderType === OrderType.DELIVERY) {
      if (currentStatus === OrderStatus.READY) return [OrderStatus.OUT_FOR_DELIVERY];
      if (currentStatus === OrderStatus.OUT_FOR_DELIVERY) return [OrderStatus.DELIVERED];
      if (currentStatus === OrderStatus.DELIVERED) return [OrderStatus.COMPLETED];
      return [];
    }

    if (currentStatus === OrderStatus.READY) return [OrderStatus.SERVED];
    if (currentStatus === OrderStatus.SERVED) return [OrderStatus.COMPLETED];
    return [];
  }

  return [];
}

function getBusinessNextStatuses(
  currentStatus: OrderStatus,
  orderType: OrderType,
): OrderStatus[] {
  if (currentStatus === OrderStatus.PENDING) return [OrderStatus.PREPARING];
  if (currentStatus === OrderStatus.PREPARING) return [OrderStatus.READY];

  if (currentStatus === OrderStatus.READY) {
    return orderType === OrderType.DELIVERY
      ? [OrderStatus.OUT_FOR_DELIVERY]
      : [OrderStatus.SERVED];
  }

  if (currentStatus === OrderStatus.OUT_FOR_DELIVERY) return [OrderStatus.DELIVERED];

  if (currentStatus === OrderStatus.DELIVERED || currentStatus === OrderStatus.SERVED) {
    return [OrderStatus.COMPLETED];
  }

  return [];
}
