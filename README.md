# BookHiveApp
Este projeto é uma **Single Page Application (SPA)** desenvolvida com angular  para o gerenciamento de livros.

[![CodeFactor](https://www.codefactor.io/repository/github/oitom/book-hive-app/badge)](https://www.codefactor.io/repository/github/oitom/book-hive-app)
[![Build](https://github.com/oitom/book-hive-app/actions/workflows/ci.yaml/badge.svg)](https://github.com/oitom/book-hive-app/actions/workflows/ci.yaml)

---

## 2. Tecnologias Utilizadas

- `Angular 18.2`
- `Bootstrap 5.3`
- `Angular Material`
- `TypeScript`
- `HTML5/CSS3`

### Padrão Utilizado

Foi adotado um padrão de organização modular, visando a separação de responsabilidades. 
A estrutura do projeto segue o padrão abaixo:
```
/project
│
├── src
│   └── app
│       └── layout
│       └── models
│       └── pages
│       └── services
│   └── environments
```
## 3. Como Rodar o Projeto

### Pré-requisitos

- **Node.js** (versão mínima recomendada: 16.x)
- **npm** (gerenciador de pacotes)

### Passos para Instalação

1. **Clone** o repositório:
```bash
git clone https://github.com/seu-usuario/projeto-gerenciamento-livros.git
```

2. **Instale** as dependências: Navegue até a pasta raiz do projeto e execute o comando:
```bash
npm install
```
3. **Rodando** o servidor de desenvolvimento: Após instalar as dependências, execute o comando abaixo para rodar a aplicação:
```bash
ng serve
```
4. **Acessando** a aplicação: Abra o navegador e acesse:
[http://localhost:4200](http://localhost:4200)

---

## 4. Evidências de Telas

### Page Home
![Tela inicial](/public/assets/page-home-screen.png)
![Tela filtros](/public/assets/page-home-filtros-screen.png)
![Tela visualizar](/public/assets/page-home-visualizar-livro.png)
![Tela excluir](/public/assets/page-home-excluir-livro.png)

### Page Cadastro Livros
![Tela cadastro](/public/assets/page-cadastrar-livro.png)
![Tela cadastro](/public/assets/page-cadastrar-livro-2.png)

### Page Edição Livros
![Tela edição](/public/assets/page-editar-livro.png)


## 5. Melhorias e Desenvolvimento Futuro

### Melhorias Planejadas

- Autenticação e Autorização: 
Implementar controle de usuários com base em JWT e diferentes níveis de permissões.

- Internacionalização (i18n): 
Incluir suporte a múltiplos idiomas, permitindo que a interface seja acessível a diferentes públicos.
