import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, finalize, takeUntil } from 'rxjs';
import {
  AlunoNotasDTO,
  AvaliacaoDTO,
  DisciplinaDTO,
  LancamentoNotasDTO,
  NotaDTO,
  TurmaDTO
} from './models/boletim.models';
import { BoletimApiService } from './services/boletim-api.service';
import { BoletimRegrasService } from './services/boletim-regras.service';
import { UiFeedbackService } from './services/ui-feedback.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Boletim do Aluno';

  turmas: TurmaDTO[] = [];
  disciplinas: DisciplinaDTO[] = [];
  avaliacoes: AvaliacaoDTO[] = [];
  alunos: AlunoNotasDTO[] = [];

  selectedTurmaId: number | null = null;
  selectedDisciplinaId: number | null = null;

  loadingTurmas = false;
  loadingDisciplinas = false;
  loadingLancamento = false;
  saving = false;

  form: FormGroup;
  displayedColumns: string[] = [];
  mediaByAlunoId = new Map<number, string>();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly api: BoletimApiService,
    private readonly fb: FormBuilder,
    private readonly regras: BoletimRegrasService,
    private readonly ui: UiFeedbackService
  ) {
    this.form = this.fb.group({
      linhas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.carregarTurmas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get linhas(): FormArray {
    return this.form.get('linhas') as FormArray;
  }

  carregarTurmas(): void {
    this.loadingTurmas = true;
    this.api.listarTurmas()
      .pipe(finalize(() => (this.loadingTurmas = false)))
      .subscribe({
        next: (turmas) => {
          this.turmas = turmas;
        },
        error: () => this.ui.error('Não foi possível carregar as turmas.')
      });
  }

  onTurmaChange(turmaId: number | null): void {
    this.selectedTurmaId = turmaId;
    this.selectedDisciplinaId = null;
    this.disciplinas = [];
    this.limparLancamento();

    if (!turmaId) {
      return;
    }

    this.loadingDisciplinas = true;
    this.api.listarDisciplinasPorTurma(turmaId)
      .pipe(finalize(() => (this.loadingDisciplinas = false)))
      .subscribe({
        next: (disciplinas) => {
          this.disciplinas = disciplinas;
        },
        error: () => this.ui.error('Não foi possível carregar as disciplinas da turma selecionada.')
      });
  }

  onDisciplinaChange(disciplinaId: number | null): void {
    this.selectedDisciplinaId = disciplinaId;
    this.limparLancamento();

    if (!this.selectedTurmaId || !this.selectedDisciplinaId) {
      return;
    }

    this.carregarLancamento(this.selectedTurmaId, this.selectedDisciplinaId);
  }

  carregarLancamento(turmaId: number, disciplinaId: number): void {
    this.loadingLancamento = true;
    this.api.obterLancamentoNotas(turmaId, disciplinaId)
      .pipe(finalize(() => (this.loadingLancamento = false)))
      .subscribe({
        next: (lancamento) => this.prepararLancamento(lancamento),
        error: () => this.ui.error('Não foi possível carregar os dados do lançamento de notas.')
      });
  }

  prepararLancamento(lancamento: LancamentoNotasDTO): void {
    this.avaliacoes = this.regras.filtrarAvaliacoesPorDisciplina(
      lancamento.disciplina,
      lancamento.avaliacoes ?? []
    );
    this.alunos = lancamento.alunos ?? [];

    this.displayedColumns = [
      'aluno',
      ...this.avaliacoes.map((avaliacao) => this.colunaAvaliacao(avaliacao.id)),
      'media'
    ];

    this.linhas.clear();
    this.mediaByAlunoId.clear();

    this.alunos.forEach((aluno) => {
      const notasGroup = this.fb.group({});

      this.avaliacoes.forEach((avaliacao) => {
        const valorInicial = aluno.notas?.[String(avaliacao.id)] ?? null;
        const control = new FormControl<number | null>(valorInicial, {
          validators: [Validators.min(0), Validators.max(10)]
        });

        notasGroup.addControl(String(avaliacao.id), control);
      });

      const linha = this.fb.group({
        alunoId: [aluno.alunoId],
        nomeAluno: [aluno.nomeAluno],
        matricula: [aluno.matricula],
        notas: notasGroup
      });

      this.linhas.push(linha);
      this.atualizarMedia(aluno.alunoId, notasGroup.getRawValue() as Record<string, number | null>);

      notasGroup.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.atualizarMedia(aluno.alunoId, value as Record<string, number | null>);
        });
    });
  }

  salvarNotas(): void {
    if (!this.form.valid) {
      this.ui.error('Existem notas inválidas. Verifique os campos destacados.');
      this.form.markAllAsTouched();
      return;
    }

    const notas: NotaDTO[] = [];

    this.linhas.controls.forEach((linha) => {
      const alunoId = linha.get('alunoId')?.value as number;
      const notasGroup = linha.get('notas') as FormGroup;

      this.avaliacoes.forEach((avaliacao) => {
        const control = notasGroup.get(String(avaliacao.id));
        const valorRaw = control?.value;

        if (valorRaw === null || valorRaw === undefined) {
          return;
        }

        const valor = Number(valorRaw);

        if (Number.isNaN(valor)) {
          return;
        }

        notas.push({
          alunoId,
          avaliacaoId: avaliacao.id,
          valor
        });
      });
    });

    if (notas.length === 0) {
      this.ui.error('Nenhuma nota informada para salvar.');
      return;
    }

    this.saving = true;
    this.api.salvarNotasEmLote({ notas })
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (response) => {
          this.ui.success(response.mensagem || 'Notas salvas com sucesso.');
        },
        error: () => this.ui.error('Não foi possível salvar as notas. Tente novamente.')
      });
  }

  getNotasGroup(linha: FormGroup): FormGroup {
    return linha.get('notas') as FormGroup;
  }

  hasNotaError(linha: FormGroup, avaliacaoId: number): boolean {
    const control = this.getNotasGroup(linha).get(String(avaliacaoId));
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  mediaPorAlunoId(alunoId: number): string {
    return this.mediaByAlunoId.get(alunoId) ?? '-';
  }

  trackByAvaliacao(_: number, avaliacao: AvaliacaoDTO): number {
    return avaliacao.id;
  }

  trackByLinha(_: number, linha: AbstractControl): number {
    return (linha as FormGroup).get('alunoId')?.value as number;
  }

  colunaAvaliacao(avaliacaoId: number): string {
    return `avaliacao_${avaliacaoId}`;
  }

  private limparLancamento(): void {
    this.avaliacoes = [];
    this.alunos = [];
    this.displayedColumns = [];
    this.mediaByAlunoId.clear();
    this.linhas.clear();
  }

  private atualizarMedia(alunoId: number, notas: Record<string, number | null>): void {
    const media = this.regras.calcularMediaPonderada(this.avaliacoes, notas);
    this.mediaByAlunoId.set(alunoId, this.regras.formatarMedia(media));
  }
}
