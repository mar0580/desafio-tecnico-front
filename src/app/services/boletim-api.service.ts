import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AvaliacaoDTO,
  DisciplinaDTO,
  LancamentoNotasDTO,
  LancamentoNotasRequest,
  LancamentoNotasResponse,
  TurmaDTO
} from '../models/boletim.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletimApiService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listarTurmas(): Observable<TurmaDTO[]> {
    return this.http.get<TurmaDTO[]>(`${this.baseUrl}/api/turmas`);
  }

  listarDisciplinasPorTurma(turmaId: number): Observable<DisciplinaDTO[]> {
    return this.http.get<DisciplinaDTO[]>(`${this.baseUrl}/api/disciplinas/turma/${turmaId}`);
  }

  obterLancamentoNotas(turmaId: number, disciplinaId: number): Observable<LancamentoNotasDTO> {
    const params = new HttpParams()
      .set('turmaId', turmaId)
      .set('disciplinaId', disciplinaId);

    return this.http.get<LancamentoNotasDTO>(`${this.baseUrl}/api/notas/lancamento`, { params });
  }

  salvarNotasEmLote(request: LancamentoNotasRequest): Observable<LancamentoNotasResponse> {
    return this.http.post<LancamentoNotasResponse>(`${this.baseUrl}/api/notas/lancamento`, request);
  }
}
