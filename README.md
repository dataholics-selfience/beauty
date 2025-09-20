# AI Photo Styler - Simulador de Tratamentos Estéticos

Uma aplicação React que simula tratamentos estéticos usando IA da Replicate.

## Funcionalidades

- Upload de imagens
- Simulação de tratamentos estéticos (Botox, Ácido Hialurônico, Laser, Bioestimulador)
- Comparação antes/depois com controle de intensidade
- Interface moderna e responsiva

## Deploy no Netlify

1. Faça push do código para o GitHub
2. Conecte seu repositório no Netlify
3. Configure a variável de ambiente no Netlify:
   - Vá em Site settings > Environment variables
   - Adicione: `VITE_REPLICATE_API_TOKEN` com sua chave da API do Replicate
   - IMPORTANTE: O nome deve ser exatamente `VITE_REPLICATE_API_TOKEN`
4. O deploy será automático

## Desenvolvimento Local

```bash
npm install
npm run dev
```

Certifique-se de ter o arquivo `.env` com:
```
VITE_REPLICATE_API_TOKEN=sua_chave_aqui
```