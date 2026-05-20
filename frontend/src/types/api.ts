export type MatchStatus = "OPEN" | "CLOSED" | "FINISHED";
export type WinnerChoice = "TEAM_A" | "TEAM_B" | "DRAW";

export interface CustomerSession {
  customerId: number;
  apelido: string;
  telefone?: string;
  mesaId: number;
  mesaCodigo: string;
  barNome: string;
  barSlug: string;
}

export interface Match {
  id: number;
  timeA: string;
  timeB: string;
  dataHora: string;
  status: MatchStatus;
  golsTimeA?: number;
  golsTimeB?: number;
}

export interface Bet {
  id: number;
  jogoId: number;
  timeA: string;
  timeB: string;
  vencedorEscolhido: WinnerChoice;
  placarTimeA?: number;
  placarTimeB?: number;
  quantidadeCervejas: number;
  pontos: number;
  status: MatchStatus;
  dataHora: string;
  createdAt: string;
}

export interface RankingEntry {
  customerId: number;
  apelido: string;
  mesaCodigo: string;
  totalApostas: number;
  totalCervejas: number;
  totalPontos: number;
}

export interface TableItem {
  id: number;
  barId: number;
  codigo: string;
  descricao: string;
  qrCodeUrl: string;
  ativa: boolean;
}

export interface TableQrCode {
  codigo: string;
  targetUrl: string;
  qrCodeDataUrl: string;
}

export interface Dashboard {
  jogosAbertos: number;
  totalApostas: number;
  jogos: Match[];
  ranking: RankingEntry[];
}
