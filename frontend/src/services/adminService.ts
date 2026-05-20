import { api } from "./api";
import { Dashboard, Match, RankingEntry, TableItem, TableQrCode } from "../types/api";

export async function adminLogin(payload: { email: string; password: string }) {
  const { data } = await api.post<{ token: string; email: string }>("/admin/auth/login", payload);
  return data;
}

export async function getDashboard(barId = 1): Promise<Dashboard> {
  const { data } = await api.get<Dashboard>("/admin/dashboard", { params: { barId } });
  return data;
}

export async function getMatches(barId = 1): Promise<Match[]> {
  const { data } = await api.get<Match[]>("/admin/matches", { params: { barId } });
  return data;
}

export async function createMatch(payload: {
  barId: number;
  timeA: string;
  timeB: string;
  dataHora: string;
}) {
  const { data } = await api.post<Match>("/admin/matches", payload);
  return data;
}

export async function updateMatch(
  id: number,
  payload: { barId: number; timeA: string; timeB: string; dataHora: string }
) {
  const { data } = await api.put<Match>(`/admin/matches/${id}`, payload);
  return data;
}

export async function closeMatch(id: number) {
  const { data } = await api.patch<Match>(`/admin/matches/${id}/close`);
  return data;
}

export async function finishMatch(id: number, payload: { golsTimeA: number; golsTimeB: number }) {
  const { data } = await api.patch<Match>(`/admin/matches/${id}/finish`, payload);
  return data;
}

export async function getRanking(barId = 1): Promise<RankingEntry[]> {
  const { data } = await api.get<RankingEntry[]>("/admin/ranking", { params: { barId } });
  return data;
}

export async function getTables(barId = 1): Promise<TableItem[]> {
  const { data } = await api.get<TableItem[]>("/admin/tables", { params: { barId } });
  return data;
}

export async function createTable(payload: { barId: number; codigo: string; descricao: string }) {
  const { data } = await api.post<TableItem>("/admin/tables", payload);
  return data;
}

export async function getTableQrCode(id: number): Promise<TableQrCode> {
  const { data } = await api.get<TableQrCode>(`/admin/tables/${id}/qrcode`);
  return data;
}
