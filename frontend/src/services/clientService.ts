import { BeerOption, Bet, CustomerSession, Match, WinnerChoice } from "../types/api";

const sessionSequenceKey = "barbet-customer-seq";
const betsStorageKey = "barbet-mock-bets";

const mockMatches: Match[] = [
  {
    id: 101,
    timeA: "Brasil",
    timeB: "Alemanha",
    dataHora: "2026-05-20T16:00:00-03:00",
    status: "OPEN",
    competition: "Copa do Mundo BarBet",
    stage: "Fase de grupos",
    venue: "Arena Rio",
    oddTeamA: 1.72,
    oddDraw: 3.45,
    oddTeamB: 4.1,
  },
  {
    id: 102,
    timeA: "Argentina",
    timeB: "Franca",
    dataHora: "2026-05-20T19:00:00-03:00",
    status: "OPEN",
    competition: "Copa do Mundo BarBet",
    stage: "Fase de grupos",
    venue: "Arena Salvador",
    oddTeamA: 2.48,
    oddDraw: 3.1,
    oddTeamB: 2.76,
  },
  {
    id: 103,
    timeA: "Portugal",
    timeB: "Uruguai",
    dataHora: "2026-05-20T22:00:00-03:00",
    status: "OPEN",
    competition: "Copa do Mundo BarBet",
    stage: "Fase de grupos",
    venue: "Arena Recife",
    oddTeamA: 2.12,
    oddDraw: 3.22,
    oddTeamB: 3.38,
  },
];

const mockBeers: BeerOption[] = [
  { id: "brahma-duplo-malte", nome: "Brahma Duplo Malte", marca: "Brahma", preco: 11.9 },
  { id: "spaten", nome: "Spaten", marca: "Spaten", preco: 14.5 },
  { id: "original-600", nome: "Original 600ml", marca: "Original", preco: 16.9 },
];

function getNextCustomerId() {
  const current = Number(localStorage.getItem(sessionSequenceKey) ?? "1000");
  const next = current + 1;
  localStorage.setItem(sessionSequenceKey, String(next));
  return next;
}

function readStoredBets(): Bet[] {
  const raw = localStorage.getItem(betsStorageKey);
  if (!raw) return [];
  return JSON.parse(raw) as Bet[];
}

function writeStoredBets(bets: Bet[]) {
  localStorage.setItem(betsStorageKey, JSON.stringify(bets));
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function getChoiceLabel(match: Match, winner: WinnerChoice) {
  if (winner === "TEAM_A") return match.timeA;
  if (winner === "TEAM_B") return match.timeB;
  return "Empate";
}

export async function enterTable(payload: {
  nomeCompleto: string;
  cpf: string;
  barSlug: string;
  mesaCodigo: string;
}): Promise<CustomerSession> {
  const cpf = digitsOnly(payload.cpf);
  const nomeCompleto = payload.nomeCompleto.trim();

  if (nomeCompleto.split(" ").filter(Boolean).length < 2) {
    throw { response: { data: { details: ["Informe nome e sobrenome."] } } };
  }

  if (cpf.length !== 11) {
    throw { response: { data: { details: ["Informe um CPF com 11 digitos."] } } };
  }

  const firstName = nomeCompleto.split(" ")[0];

  return {
    customerId: getNextCustomerId(),
    nomeCompleto,
    cpf: formatCpf(cpf),
    apelido: firstName,
    mesaId: 1,
    mesaCodigo: payload.mesaCodigo,
    barNome: "Bar do Teco",
    barSlug: payload.barSlug,
  };
}

export async function getOpenMatches(_barSlug: string): Promise<Match[]> {
  return mockMatches;
}

export async function getBeerOptions(): Promise<BeerOption[]> {
  return mockBeers;
}

export async function createBet(payload: {
  clienteId: number;
  jogoId: number;
  vencedorEscolhido: WinnerChoice;
  placarTimeA?: number;
  placarTimeB?: number;
  quantidadeCervejas: number;
  cervejaId: string;
}): Promise<Bet> {
  const match = mockMatches.find((item) => item.id === payload.jogoId);
  const beer = mockBeers.find((item) => item.id === payload.cervejaId);

  if (!match || !beer) {
    throw { response: { data: { details: ["Nao foi possivel localizar o jogo ou a cerveja escolhida."] } } };
  }

  const storedBets = readStoredBets();
  const alreadyExists = storedBets.some(
    (bet) => bet.jogoId === payload.jogoId && Number((bet as Bet & { clienteId?: number }).clienteId) === payload.clienteId
  );

  if (alreadyExists) {
    throw { response: { data: { details: ["Voce ja fez uma aposta para este jogo."] } } };
  }

  const now = new Date().toISOString();

  const bet: Bet & { clienteId: number } = {
    id: Date.now(),
    clienteId: payload.clienteId,
    jogoId: match.id,
    timeA: match.timeA,
    timeB: match.timeB,
    vencedorEscolhido: payload.vencedorEscolhido,
    placarTimeA: payload.placarTimeA,
    placarTimeB: payload.placarTimeB,
    quantidadeCervejas: payload.quantidadeCervejas,
    cervejaId: beer.id,
    cervejaNome: beer.nome,
    cervejaMarca: beer.marca,
    precoCerveja: beer.preco,
    pontos: 0,
    acertouResultado: false,
    premioCervejas: 0,
    saldoLiquidoCervejas: 0,
    comissaoBarCervejas: 0,
    status: "OPEN",
    dataHora: match.dataHora,
    createdAt: now,
  };

  writeStoredBets([bet, ...storedBets]);
  return bet;
}

export async function getCustomerBets(customerId: number): Promise<Bet[]> {
  return readStoredBets()
    .filter((bet) => Number((bet as Bet & { clienteId?: number }).clienteId) === customerId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function getBetChoiceLabel(match: Match, winner: WinnerChoice) {
  return getChoiceLabel(match, winner);
}
