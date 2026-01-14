# 🥗 NutriScan - Pronto para Deploy

App de análise nutricional por foto com IA, pronto para hospedar.

## 🚀 Deploy em 3 Minutos

### Opção 1: Vercel (Recomendado)

1. **Crie uma conta** em [vercel.com](https://vercel.com)

2. **Instale a CLI** (no terminal):
```bash
npm install -g vercel
```

3. **Na pasta do projeto, execute:**
```bash
npm install
vercel
```

4. **Pronto!** Você recebe uma URL tipo: `nutriscan-app.vercel.app`

---

### Opção 2: Netlify

1. Acesse [netlify.com](https://netlify.com) e crie uma conta

2. Arraste a pasta `build/` para o Netlify:
```bash
npm install
npm run build
# Arraste a pasta 'build' para o site do Netlify
```

---

### Opção 3: GitHub Pages

1. Crie um repositório no GitHub

2. Faça push do código:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/nutriscan.git
git push -u origin main
```

3. Vá em **Settings → Pages → Source: GitHub Actions**

4. Crie o arquivo `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## 📱 Funcionalidades

- ✅ **Responsivo** - Funciona em celular, tablet e desktop
- ✅ **PWA** - Pode ser instalado como app
- ✅ **Offline** - Dados salvos localmente
- ✅ **Câmera** - Acesso nativo à câmera do celular
- ✅ **Tema escuro** - Design moderno

## 📂 Estrutura

```
nutriscan-deploy/
├── public/
│   ├── index.html      # HTML principal
│   ├── manifest.json   # Config do PWA
│   └── sw.js           # Service Worker
├── src/
│   ├── App.js          # App completo
│   └── index.js        # Entry point
├── package.json        # Dependências
└── README.md           # Este arquivo
```

## 🔧 Comandos

```bash
# Instalar dependências
npm install

# Rodar localmente
npm start

# Build para produção
npm run build
```

## 🌐 URLs de Exemplo

Após o deploy, seu app estará disponível em:
- Vercel: `https://nutriscan-xxx.vercel.app`
- Netlify: `https://nutriscan-xxx.netlify.app`
- GitHub: `https://seuusuario.github.io/nutriscan`

## 📲 Instalar como App

No celular:
1. Acesse a URL pelo Chrome/Safari
2. Toque em "Adicionar à tela inicial"
3. Pronto! O app aparece como ícone

---

## 🔮 Próximos Passos

Para análise de IA **real**, você precisará:

1. **Backend** - Conectar ao backend que eu criei
2. **API Key** - Chave da Anthropic para Claude Vision
3. **Banco de dados** - PostgreSQL para salvar dados

Quer ajuda com isso? Me avise!

---

Feito com 💚 para o NutriScan
