import apiClient from "../../config/api";
import { CashRegisterResponse } from "./cash-register.interfaces";

export async function closeCashRegister(id: number) : Promise<CashRegisterResponse> {
    const { data } = await apiClient.post<CashRegisterResponse>(`/cash-registers/${id}/close`);
    return data;
}