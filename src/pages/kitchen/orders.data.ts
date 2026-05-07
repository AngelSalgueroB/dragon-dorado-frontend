export interface OrderTest {
    id: string;
    table: string;
    waiter: string;
    time: string;
    status: OrderTestStatus;
    items: {
        qty: number;
        name: string;
        note: string;
    }[];
}

export enum OrderTestStatus {
    new = 'new',
    warning = 'warning',
    danger = 'danger'
}

export const initialOrders : OrderTest[] = [
  {
    id: 'ORD-001',
    table: '04',
    waiter: 'Admin_Chifa',
    time: '12 min',
    status: OrderTestStatus.warning,
    items: [{ qty: 2, name: 'Arroz Chaufa Especial', note: 'Sin cebolla' }],
  },
  {
    id: 'ORD-002',
    table: '07',
    waiter: 'Mozo_Juan',
    time: '25 min',
    status: OrderTestStatus.danger,
    items: [{ qty: 1, name: 'Aeropuerto', note: 'Bien frito' }],
  },
  {
    id: 'ORD-003',
    table: '02',
    waiter: 'Mozo_Ana',
    time: '2 min',
    status: OrderTestStatus.new,
    items: [{ qty: 3, name: 'Tallarín Saltado', note: '' }],
  },
];
