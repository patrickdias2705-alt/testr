# Deploy na Vercel (automático)

O projeto está pronto para a Vercel. O site e a API de pagamento PIX sobem juntos, **sem precisar iniciar nada manualmente**.

## 1. Conectar o repositório

1. Acesse [vercel.com](https://vercel.com) e faça login.
2. **Add New** → **Project** e importe o repositório do projeto.
3. A Vercel detecta Vite e usa o `vercel.json` (não precisa mudar nada).

## 2. Variáveis de ambiente

Em **Project → Settings → Environment Variables** adicione:

| Nome | Valor | Observação |
|------|--------|------------|
| `PAGLOOP_CLIENT_ID` | *(seu client_id da PagLoop)* | Obrigatório |
| `PAGLOOP_CLIENT_SECRET` | *(sua chave secreta)* | Sua client_secret da PagLoop |
| `CALLBACK_BASE_URL` | **https://SEU-DOMINIO.vercel.app** | URL do deploy (ex.: `https://locarlima.vercel.app`) |

**Importante:** depois do primeiro deploy, pegue a URL que a Vercel gerar (ex.: `https://locarlima-xxx.vercel.app`), coloque em `CALLBACK_BASE_URL` e faça um novo deploy (ou edite a variável e redeploy). Assim a PagLoop consegue enviar os callbacks de status do PIX para `https://SEU-DOMINIO.vercel.app/api/payments/callback`.

## 3. Deploy

- **Deploy automático:** a cada push no repositório a Vercel faz o build e o deploy.
- **Deploy manual:** no painel do projeto, **Deployments** → **Redeploy**.

Não é necessário rodar `npm run server` nem `start-tudo.bat`: a API roda como **Serverless Functions** na Vercel.

## 4. O que sobe sozinho

- **Frontend:** build do Vite (React) em `dist/`.
- **API:** funções em `api/payments/deposit.js`, `api/payments/callback.js`, `api/payments/check.js` (rotas `/api/payments/*`).

O frontend chama `/api/payments/deposit` na mesma origem, então tudo funciona no mesmo domínio da Vercel.
