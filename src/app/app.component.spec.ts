import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { BoletimApiService } from './services/boletim-api.service';
import { UiFeedbackService } from './services/ui-feedback.service';

describe('AppComponent', () => {
  const apiMock = {
    listarTurmas: jasmine.createSpy('listarTurmas').and.returnValue(of([])),
    listarDisciplinasPorTurma: jasmine.createSpy('listarDisciplinasPorTurma').and.returnValue(of([])),
    obterLancamentoNotas: jasmine.createSpy('obterLancamentoNotas').and.returnValue(of({
      turma: { id: 1, nome: 'Turma A', ano: '2026' },
      disciplina: { id: 1, nome: 'Matemática' },
      avaliacoes: [],
      alunos: []
    })),
    salvarNotasEmLote: jasmine.createSpy('salvarNotasEmLote').and.returnValue(of({
      totalSalvas: 0,
      notasSalvas: [],
      mensagem: 'Ok'
    }))
  };

  const uiMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: BoletimApiService, useValue: apiMock },
        { provide: UiFeedbackService, useValue: uiMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`deve ter o título 'Boletim do Aluno'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Boletim do Aluno');
  });

  it('deve renderizar o título na tela', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Boletim do Aluno');
  });

  it('deve carregar as turmas ao iniciar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(apiMock.listarTurmas).toHaveBeenCalled();
  });
});
