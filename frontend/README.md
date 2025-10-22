# Frontend – Simple Todo JWT

Uma interface web simples e responsiva para gerenciar tarefas com autenticação baseada em JWT, construída com HTML, JavaScript e Bootstrap 5 (via CDN).

## Visão geral

- Fluxo: Registrar → Login → Tarefas.
- Autenticação: token JWT armazenado em `localStorage` após registrar/logar.
- Tarefas: criar, listar, alternar concluída/não concluída, editar (modal) e remover.
- UI: Navbar unificada, formulários e listas estilizadas com Bootstrap; CSS próprio mínimo (`style.css`).

## Tecnologias

- HTML5 + JavaScript (vanilla)
- [Bootstrap 5](https://getbootstrap.com/) via CDN (CSS e JS)
- CSS customizado leve (botão flutuante e estados de item)

## Estrutura

```
frontend/
├─ index.html        # Home com CTA e navegação
├─ login.html        # Tela de login (POST /auth/login)
├─ register.html     # Tela de registro (POST /auth/register)
├─ tasks.html        # Lista de tarefas (CRUD /tasks)
└─ style.css         # Ajustes visuais e botão "Next"
```

## Pré‑requisitos

- Backend disponível em: `http://localhost:4000/api`
  - Endpoints esperados:
    - `POST /auth/register` → `{ token }`
    - `POST /auth/login` → `{ token }`
    - `GET /tasks` → `[{ id, title, done }]`
    - `POST /tasks` → cria `{ title }`
    - `PUT /tasks/:id` → atualiza `{ title? , done? }`
    - `DELETE /tasks/:id`
- Navegador moderno. Não há build/empacotamento.

## Como executar

Opção 1 (simples):
- Abra diretamente os arquivos `.html` no navegador (duplo clique). Para recursos como `localStorage` e chamadas à API, isso é suficiente.

Opção 2 (servidor estático, recomendado para navegação limpa):
- Use uma extensão como “Live Server” no VS Code, ou um servidor estático (ex.: `python -m http.server`).

> Observação (Windows/PowerShell): se optar por servidor local, rode no diretório `frontend` e acesse o endereço indicado (ex.: http://localhost:5500).

## Uso

1. Acesse `index.html` e use os botões para navegar.
2. Em `register.html`, crie sua conta. O token é salvo em `localStorage` e você será redirecionado.
3. Em `login.html`, faça login. O token é salvo e você será redirecionado.
4. Em `tasks.html`, gerencie suas tarefas:
   - Adicionar: use o campo e clique em “Adicionar”.
   - Concluir/Desfazer: clique no título da tarefa.
   - Editar: clique no ícone ✏️ para abrir o modal, altere o título e salve.
   - Remover: clique no ícone 🗑️.
   - Logout: botão na navbar limpa o token e volta para o login.

## Detalhes de implementação

- Token JWT: armazenado em `localStorage` com a chave `token`.
- Cabeçalho de autenticação: `'Authorization': 'Bearer ' + token`.
- `tasks.html`:
  - Carregamento inicial faz `GET /tasks`; se 401, remove token e redireciona para login.
  - Edição: usa Modal do Bootstrap (id `editModal`), com funções `openEdit(id)` e `saveEdit()`.
  - Atualizações enviadas via `PUT /tasks/:id` com corpo `{ title }` ou `{ done }`.
  - Renderização com `list-group` do Bootstrap; botões com `btn-group btn-group-sm`.
- Estilos:
  - Bootstrap controla a base visual.
  - `style.css` mantém o botão flutuante “Next” da Home e a classe `.done` (riscado + cinza).

## Personalização

- Branding: altere o texto/brand na navbar (arquivo `index.html` e demais páginas).
- Cores: pode trocar classes do Bootstrap (ex.: `bg-dark`, `btn-primary`) ou ajustar `style.css`.
- API base: modifique a constante `API` nos arquivos `.html` para apontar para outro host/base path.

## Acessibilidade e responsividade

- Navbar responsiva com colapso em telas pequenas.
- Formulários com `label` e `form-control`.
- Componentes Bootstrap já prontos para vários tamanhos de tela.

## Segurança (recomendações)

- Produção: sirva via HTTPS.
- Não exponha segredos no frontend.
- Considere expirar tokens e lidar com refresh de token.
- Ative CORS corretamente no backend para o domínio do frontend.

## Troubleshooting

- “Fica na tela de login”: verifique se o backend está no ar e se o endpoint `/tasks` responde sem 401.
- “Não salva/edita”: confira o console do navegador (F12) e a aba Network; valide corpo e status das requisições.
- “Erro de CORS”: ajuste as permissões CORS no backend para permitir o host do frontend.
- “Bootstrap não funciona (modal/navbar)”: confirme que o bundle JS do Bootstrap está incluído antes do fechamento do `</body>`.
