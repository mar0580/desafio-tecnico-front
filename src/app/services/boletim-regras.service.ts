import { Injectable } from '@angular/core';
import { AvaliacaoDTO, DisciplinaDTO } from '../models/boletim.models';

@Injectable({
  providedIn: 'root'
})
export class BoletimRegrasService {
  filtrarAvaliacoesPorDisciplina(
    disciplina: DisciplinaDTO | null | undefined,
    avaliacoes: AvaliacaoDTO[]
  ): AvaliacaoDTO[] {
    if (!this.isDisciplinaMatematica(disciplina?.nome)) {
      return avaliacoes;
    }

    const filtradas = avaliacoes.filter((avaliacao) => this.isPrimeiroBimestre(avaliacao.nome));
    return filtradas.length > 0 ? filtradas : avaliacoes;
  }

  calcularMediaPonderada(
    avaliacoes: AvaliacaoDTO[],
    notas: Record<string, number | null>
  ): number | null {
    let somaPesos = 0;
    let somaPonderada = 0;

    avaliacoes.forEach((avaliacao) => {
      const valor = notas[String(avaliacao.id)];
      if (valor === null || valor === undefined) {
        return;
      }

      const numero = Number(valor);
      if (Number.isNaN(numero)) {
        return;
      }

      somaPesos += avaliacao.peso;
      somaPonderada += numero * avaliacao.peso;
    });

    if (somaPesos === 0) {
      return null;
    }

    return somaPonderada / somaPesos;
  }

  formatarMedia(media: number | null): string {
    if (media === null) {
      return '-';
    }

    return media.toFixed(1).replace('.', ',');
  }

  private isDisciplinaMatematica(nome?: string): boolean {
    return this.normalizarTexto(nome) === 'matematica';
  }

  private isPrimeiroBimestre(nome?: string): boolean {
    const texto = this.normalizarTexto(nome);
    const temBimestre = /(bimestre|bim)\b/.test(texto);
    const primeiro = /(^|\b)(1|1o|1º|primeiro)\b/.test(texto);
    return temBimestre && primeiro;
  }

  private normalizarTexto(valor?: string | null): string {
    return (valor ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
