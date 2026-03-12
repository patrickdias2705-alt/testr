# Locar Lima

Site e API de pagamento PIX para a Locar Lima – locação de veículos para motoristas de aplicativo.

## Tecnologias

- Vite, React, TypeScript
- Tailwind CSS, shadcn/ui
- Backend Node (Express) para integração PagLoop

## Como rodar

```sh
npm install
npm run dev:all
```

No Windows: use o arquivo **INICIAR-SITE.bat** na raiz (dois cliques).

- Frontend: http://localhost:8080  
- Backend: http://localhost:3001  

## Pagamento PIX

1. Configure o `.env` na raiz com `PAGLOOP_CLIENT_ID`, `PAGLOOP_CLIENT_SECRET` e `CALLBACK_BASE_URL`.
2. No site, escolha um veículo, preencha o formulário e clique em **Pagar com PIX**.
3. Para testar a API com o servidor rodando: `npm run test:payment`.

## Deploy (Vercel)

Consulte **VERCEL-DEPLOY.md** para variáveis de ambiente e passos de publicação.
