export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  WAITER = 'WAITER',
  CASHIER = 'CASHIER',
  KITCHEN = 'KITCHEN',
}

export interface UserResponse {
  id: number;

  username: string;
  email: string;

  firstName: string;
  lastName: string;

  role: Role;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface GetUsersParams {
  username?: string;

  email?: string;

  fullName?: string;

  role?: Role;

  active?: boolean;

  startDate?: string;
  endDate?: string;
}

export enum CreateUserRole {
  MANAGER = 'MANAGER',
  WAITER = 'WAITER',
  CASHIER = 'CASHIER',
  KITCHEN = 'KITCHEN',
}

export interface CreateUserRequest {
  email: string;

  firstName: string;

  lastName: string;

  role: CreateUserRole;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserActiveRequest {
  active: boolean;
}