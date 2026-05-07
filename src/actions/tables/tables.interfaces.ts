export interface TableResponse {
  id: number;

  name: string;
  description: string;

  number: number;
  capacity: number;

  status: TableStatus;

  active: boolean;
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export interface GetTablesParams {
  name?: string;

  number?: number;

  capacity?: number;

  status?: TableStatus;

  active?: boolean;
}

export interface CreateTableRequest {
  name?: string;

  description?: string;

  number: number;

  capacity: number;
}

export interface UpdateTableRequest {
  name: string;

  description?: string;

  capacity: number;

  status: TableStatus;

  active: boolean;
}