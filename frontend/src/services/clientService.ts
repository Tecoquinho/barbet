import { api } from "./api";
import { Bet, CustomerSession, Match } from "../types/api";

export async function enterTable(payload: {
  apelido: string;
  telefone?: string;
  barSlug: string;
  mesaCodigo: string;
}): Promise<CustomerSession> {
  const { data } = await api.post<CustomerSession>("/customers/enter", payload);
  return data;
}

export async function getOpenMatches(barSlug: string): Promise<Match[]> {
  const { data } = await api.get<Match[]>("/matches/open", { params: { barSlug } });
  return data;
}

export async function createBet(payload: {
  clienteId: number;
  jogoId: number;
  vencedorEscolhido: "TEAM_A" | "TEAM_B" | "DRAW";
  placarTimeA?: number;
  placarTimeB?: number;
  quantidadeCervejas: number;
}): Promise<Bet> {
  const { data } = await api.post<Bet>("/bets", payload);
  return data;
}

export async function getCustomerBets(customerId: number): Promise<Bet[]> {
  const { data } = await api.get<Bet[]>(`/customers/${customerId}/bets`);
  return data;
}
