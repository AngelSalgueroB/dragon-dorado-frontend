import { DocumentType, PageableParams } from "../common";

export interface GetClientsParams extends PageableParams {
  name?: string;

  documentType?: DocumentType;
  documentNumber?: string;

  phoneNumber?: string;
  email?: string;

  active?: boolean;

  startDate?: string;
  endDate?: string;

}

export interface ClientResponse {
  id: number;

  name: string;

  documentType: DocumentType;
  documentNumber: string;

  phoneNumber: string;
  email: string;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  name: string;

  phoneNumber: string;

  documentType?: DocumentType;
  documentNumber?: string;

  email?: string;
}

export interface UpdateClientRequest {
  name: string;

  email?: string;

  phoneNumber: string;

  active: boolean;
}
