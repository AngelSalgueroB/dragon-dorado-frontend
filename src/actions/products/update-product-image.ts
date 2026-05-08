import apiClient from '../../config/api';
import { MessageResponse } from '../common';

export async function updateProductImage(
  productId: number,
  image: File,
): Promise<MessageResponse> {
  const formData = new FormData();

  formData.append('image', image);

  const { data } = await apiClient.patch<MessageResponse>(
    `/products/${productId}/image`,
    formData,
  );

  return data;
}
