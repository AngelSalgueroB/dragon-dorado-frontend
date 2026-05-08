export interface DeliveryAddressResponse {
  id: number;

  phoneNumber: string;

  addressLine: string;
  reference: string;

  googleMapLink: string;

  details: string;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateDeliveryAddressRequest {
  phoneNumber: string;

  addressLine: string;

  reference?: string;
  googleMapsLink?: string;
  details?: string;
}