import { BoletimRegrasService } from './boletim-regras.service';
import { AvaliacaoDTO } from '../models/boletim.models';

describe('BoletimRegrasService', () => {
  let service: BoletimRegrasService;

  beforeEach(() => {
    service = new BoletimRegrasService();
  });

  it('deve calcular a média ponderada corretamente', () => {
    const avaliacoes: AvaliacaoDTO[] = [
      { id: 1, nome: 'Prova 1', peso: 2, disciplinaId: 10 },
      { id: 2, nome: 'Prova 2', peso: 3, disciplinaId: 10 }
    ];

    const notas = {
      '1': 7,
      '2': 9
    };

    const media = service.calcularMediaPonderada(avaliacoes, notas);
    expect(media).toBeCloseTo(8.2, 1);
  });

  it('deve retornar null quando não houver notas válidas', () => {
    const avaliacoes: AvaliacaoDTO[] = [
      { id: 1, nome: 'Prova 1', peso: 2, disciplinaId: 10 }
    ];

    const notas = {
      '1': null
    };

    const media = service.calcularMediaPonderada(avaliacoes, notas);
    expect(media).toBeNull();
  });
});
