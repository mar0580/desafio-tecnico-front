export interface TurmaDTO {
  id: number;
  nome: string;
  ano: string;
}

export interface DisciplinaDTO {
  id: number;
  nome: string;
}

export interface AvaliacaoDTO {
  id: number;
  nome: string;
  peso: number;
  disciplinaId: number;
}

export interface AlunoDTO {
  id: number;
  nome: string;
  matricula: string;
  turmaId: number;
}

export interface AlunoNotasDTO {
  alunoId: number;
  nomeAluno: string;
  matricula: string;
  notas: Record<string, number>;
  mediaPonderada?: number;
}

export interface LancamentoNotasDTO {
  turma: TurmaDTO;
  disciplina: DisciplinaDTO;
  avaliacoes: AvaliacaoDTO[];
  alunos: AlunoNotasDTO[];
}

export interface NotaDTO {
  id?: number;
  valor: number;
  alunoId: number;
  avaliacaoId: number;
}

export interface LancamentoNotasRequest {
  notas: NotaDTO[];
}

export interface LancamentoNotasResponse {
  totalSalvas: number;
  notasSalvas: NotaDTO[];
  mensagem: string;
}
