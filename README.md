# Pizzaria – Iteração 2

Aplicação web de cardápio e pedidos de uma pizzaria, construída com **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, **Prisma** e **PostgreSQL**.  
Permite visualizar o cardápio (pizzas salgadas, pizzas doces e bebidas), adicionar itens ao carrinho e finalizar pedidos. [web:49][web:50]

---
## Membros do Grupo:
- Amany Serhan - 10403229
- Gabriel Barros - 10400300
- Benny Machado - 10424035
- Eduardo Sanchez - 10415259
- Vitor Batista Souza - 10424618

## Tecnologias utilizadas

- **Next.js 15** (App Router) [web:50][web:55]
- **React 19** [web:50][web:52]
- **TypeScript** [web:50][web:55]
- **Tailwind CSS** [web:49][web:52]
- **Prisma ORM** [web:38][web:44]
- **PostgreSQL** como banco de dados [web:38][web:40]
- **pnpm** como gerenciador de pacotes [web:53][web:58]

---

## Pré‑requisitos

Antes de executar o projeto localmente, você precisa ter instalado: [web:55][web:58]

- **Node.js** (versão LTS recomendada, por exemplo 20.x) [web:55][web:58]
- **pnpm** (recomendado; pode ser instalado via `npm install -g pnpm`) [web:53][web:58]
- **PostgreSQL** em execução local ou em um servidor acessível [web:38][web:40]
- **Git** para clonar o repositório [web:55][web:58]

---

## Clonando o repositório

No terminal, execute: [web:55][web:58]

git clone <URL-DO-REPOSITORIO>
cd <NOME-DA-PASTA-DO-PROJETO>

text

Substitua `<URL-DO-REPOSITORIO>` pela URL HTTPS ou SSH do seu repositório no Git. [web:55][web:58]

---

## Configuração das variáveis de ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env` (se ainda não existir). [web:55][web:58]
2. Adicione pelo menos as seguintes variáveis (ajuste conforme sua configuração real): [web:38][web:40]

URL de conexão do PostgreSQL (exemplo local)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pizzaria?schema=public"

Chave usada para criptografia de tokens de sessão/autenticação (se aplicável)
NEXTAUTH_SECRET="uma-string-secreta-bem-grande"

Outras variáveis que seu projeto usar (exemplos):
VERCEL_ANALYTICS_ID="..."
SESSION_COOKIE_NAME="pizzaria-session"
text

- Garanta que o banco configurado em `DATABASE_URL` exista e esteja acessível. [web:38][web:40]

---

## Instalação das dependências

Com o `pnpm` instalado, execute na raiz do projeto: [web:53][web:58]

pnpm install

text

Isso fará o download de todas as dependências do `package.json`. [web:55][web:58]

---

## Configurando o banco de dados

O projeto utiliza Prisma para gerenciar o esquema do banco. [web:38][web:44]

1. **Aplicar as migrations** (criar/atualizar a estrutura do banco): [web:38][web:44]

npx prisma migrate dev

text

2. **Popular o banco (seed)** com dados iniciais do cardápio (pizzas salgadas, pizzas doces, bebidas): [web:38][web:44]

npx prisma db seed

text

- Esse comando executa o script de seed configurado em `prisma/seed.ts`, criando os registros iniciais no banco. [web:38][web:44]

3. (Opcional) **Prisma Studio** para visualizar e editar os dados via interface web: [web:38][web:44]

npx prisma studio

text

---

## Executando a aplicação em modo desenvolvimento

Para rodar o servidor de desenvolvimento do Next.js: [web:55][web:58]

pnpm dev

text

- A aplicação ficará disponível em: [web:50][web:55]

http://localhost:3000

text

- Qualquer alteração nos arquivos será recarregada automaticamente (Hot Reload). [web:50][web:55]

---

## Build para produção (opcional)

Caso queira gerar o build de produção localmente: [web:50][web:55]

pnpm build
pnpm start

text

- `pnpm build` gera o build otimizado. [web:50][web:55]
- `pnpm start` inicia o servidor Next.js em modo produção (por padrão na porta 3000). [web:50][web:55]

---

## Estrutura geral do projeto

A estrutura pode variar, mas em linhas gerais: [web:49][web:50]


├── app/  
│ ├── layout.tsx # Layout raiz  
│ ├── page.tsx # Página inicial  
│ ├── menu/page.tsx # Página do cardápio  
│ ├── carrinho/page.tsx # Página do carrinho  
│ ├── checkout/page.tsx # Página de checkout  
│ └── actions/  
│ ├── pizza-actions.ts # Ações server-side para pizzas  
│ └── pedido-actions.ts # Ações server-side para pedidos  
│  
├── components/  
│ ├── header.tsx # Cabeçalho da aplicação  
│ ├── pizza-card.tsx # Componente de card para itens do cardápio  
│ └── ui/ # Componentes UI (botões, inputs etc.)  
│  
├── context/  
│ └── cart-context.tsx # Contexto global do carrinho  
│  
├── prisma/  
│ ├── schema.prisma # Definição do modelo de dados  
│ └── seed.ts # Script de seed do banco  
│  
├── public/  
│ └── images/  
│ ├── pizzas/ # Imagens de pizzas salgadas  
│ ├── pizzas-doces/ # Imagens de pizzas doces  
│ └── bebidas/ # Imagens de bebidas  
│  
├── lib/  
│ ├── db.ts # Configuração do Prisma Client  
│ └── price.ts # Função utilitária de formatação de preços  
│  
├── package.json  
├── pnpm-lock.yaml  
└── README.md  

---

## Fluxo principal da aplicação

1. **Cardápio (`/menu`)**  
   - Carrega pizzas salgadas, pizzas doces e bebidas a partir do banco via server actions. [web:50][web:52]
   - Exibe os itens em cards com imagem, descrição e preço. [web:49][web:52]

2. **Carrinho**  
   - O usuário adiciona itens ao carrinho diretamente do cardápio. [web:50][web:52]
   - O estado do carrinho é mantido em um contexto (`cart-context`) e também persistido em `localStorage`. [web:18][web:21]

3. **Checkout**  
   - A partir do carrinho, o usuário segue para a tela de checkout. [web:50][web:52]
   - É criado um registro de pedido no banco via `pedido-actions.ts`, vinculando os itens (pizzas, pizzas doces, bebidas) a um usuário. [web:38][web:44]

---

## Scripts úteis

No `package.json`, alguns scripts comuns (podem variar levemente conforme o projeto): [web:55][web:58]

- `pnpm dev` – Inicia o servidor de desenvolvimento. [web:55][web:58]
- `pnpm build` – Gera o build de produção. [web:55][web:58]
- `pnpm start` – Sobe o servidor em modo produção. [web:55][web:58]
- `pnpm lint` – (se configurado) roda o linter para análise de código. [web:53][web:58]

---

## Notas sobre autenticação e middleware

- O projeto pode utilizar cookies de sessão (`pizzaria-session`) para identificar o usuário logado. [web:33][web:41]
- Em versões mais recentes do Next.js, o acesso a cookies e headers em middlewares e server components deve ser feito de forma assíncrona, seguindo a documentação oficial. [web:33][web:35][web:37]

---

## Branches e tags (Iteração 2)

Para fins de acompanhamento da disciplina: [web:44][web:55]

- **`master`**: branch principal do projeto. [web:44][web:55]
- **`iteracao2`**: branch criado a partir de `master` contendo as modificações referentes à Iteração 2. [web:44][web:55]
- **Tag `v2`**: marca o estado do código correspondente à entrega da Iteração 2. [web:44][web:55]
- **Tag `v2.3`**: marca uma pré‑release com melhorias no cardápio (pizzas doces e bebidas). [web:44][web:55]

---

## Como contribuir / desenvolver em cima da Iteração 2

1. Criar um branch a partir de `master` ou `iteracao2`. [web:44][web:55]
2. Implementar as mudanças desejadas. [web:44][web:55]
3. Garantir que os testes básicos (build, dev) passam. [web:50][web:55]
4. Abrir um Pull Request para `master` (ou branch indicado pelo professor). [web:44][web:55]

---

## Licença

Este projeto é de uso acadêmico, desenvolvido para fins educacionais em disciplina de desenvolvimento web.  
Verifique com o professor/orientador quais são as regras para reutilização ou publicação pública. [web:54][web:56]

# Ignorar abaixo
*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/eduardos-projects-2ea7c2a4/v0-pizzaria-mackenzie)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/rExaTkt1e52)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/eduardos-projects-2ea7c2a4/v0-pizzaria-mackenzie](https://vercel.com/eduardos-projects-2ea7c2a4/v0-pizzaria-mackenzie)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/rExaTkt1e52](https://v0.app/chat/projects/rExaTkt1e52)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

