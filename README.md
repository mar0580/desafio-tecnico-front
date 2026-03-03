# Boletim Escolar (Front-end)

Aplicação Angular para lançamento de notas do boletim escolar. Consumindo a API do back-end e exibindo os lançamentos por turma e disciplina.

## Stack

- Angular 16
- Angular Material
- RxJS

## Arquitetura e organização

- `src/app/services`: serviços de comunicação e regras de negócio.
- `src/app/models`: contratos (DTOs) usados no front-end.
- `src/app/shared`: módulos compartilhados (Material).

Responsabilidades principais:

- `BoletimApiService`: comunicação HTTP com o back-end.
- `BoletimRegrasService`: regras de negócio (ex.: média ponderada e filtro de avaliações).
- `UiFeedbackService`: feedback consistente ao usuário (snackbars).

## Regras de negócio implementadas

- Cálculo de média ponderada por aluno.

## Tratamento de erros

Mensagens de erro e sucesso são apresentadas de forma consistente pelo `UiFeedbackService`.

## Como executar

### Pré-requisitos

- Node.js 18+
- Angular CLI 16+
- Back-end em execução em `http://localhost:8080`

### Instalação e execução

1. Instale as dependências:
	- `npm install`
2. Inicie a aplicação:
	- `npm start`
3. Acesse `http://localhost:4200/`.

### Seed (dados iniciais)

O front-end consome os dados já semeados pelo back-end. Certifique-se de subir o back-end com as informações iniciais (turmas, disciplinas, alunos e avaliações) antes de usar a tela de lançamento.

## Testes unitários

Há testes simples para regras de negócio (ex.: média ponderada) no serviço de regras.

Execute:

- `npm test`

## Integração com o back-end

Endpoints utilizados:

- `GET /api/turmas`
- `GET /api/disciplinas/turma/{turmaId}`
- `GET /api/notas/lancamento?turmaId=&disciplinaId=`
- `POST /api/notas/lancamento`

## Nota sobre autenticação/controle de acesso (front-end)

Em um cenário real, o front-end integraria com um provedor de identidade (ex.: OAuth2/OIDC) para obter um token de acesso. Esse token seria armazenado de forma segura (ex.: memory storage) e enviado em todas as requisições através de um `HttpInterceptor`. Também seriam aplicados `RouteGuards` para proteger rotas e diretivas para controle de permissões por perfil.

## Build

- `ng build`

