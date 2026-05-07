export interface TableTest {
    id: number;
    number: string;
    status: string;
    capacity: number;
}

export const tablesData = [
  { id: 1, number: '01', status: 'disponible', capacity: 4 },
  { id: 2, number: '02', status: 'ocupada', capacity: 2 },
  { id: 3, number: '03', status: 'limpieza', capacity: 6 },
  { id: 4, number: '04', status: 'disponible', capacity: 4 },
  { id: 5, number: '05', status: 'reservada', capacity: 8 },
  { id: 6, number: '06', status: 'ocupada', capacity: 4 },
  { id: 7, number: '07', status: 'disponible', capacity: 2 },
  { id: 8, number: '08', status: 'disponible', capacity: 4 },
];
