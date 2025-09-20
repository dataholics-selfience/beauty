# AI Photo Styler - Simulador de Tratamentos Estéticos

Uma aplicação React que simula tratamentos estéticos usando IA da Replicate.

## Funcionalidades

- Upload de imagens
- Simulação de tratamentos estéticos (Botox, Ácido Hialurônico, Laser, Bioestimulador)
- Comparação antes/depois com controle de intensidade
- Interface moderna e responsiva

## Deploy no Netlify

### IMPORTANTE: Configuração das Variáveis de Ambiente

1. Faça push do código para o GitHub
2. Conecte seu repositório no Netlify
3. **Configure a variável de ambiente no Netlify (PASSO CRÍTICO):**
   - Vá em Site settings > Environment variables
   - Clique em "Add a variable"
   - **Key:** `VITE_REPLICATE_API_TOKEN` (exatamente assim)
   - **Value:** Sua chave da API do Replicate (ex: r8_abc123...)
   - **Scopes:** Selecione "All deploy contexts"
   - Clique em "Create variable"
4. **Faça um novo deploy:**
   - Vá na aba "Deploys"
   - Clique em "Trigger deploy" > "Deploy site"
   - Aguarde o deploy completar

### Verificação

Após o deploy, abra o console do navegador na aplicação. Você verá logs detalhados mostrando se o token foi encontrado.

### Troubleshooting

Se ainda não funcionar:
1. Verifique se o nome da variável está exatamente como `VITE_REPLICATE_API_TOKEN`
2. Certifique-se de que fez um novo deploy após adicionar a variável
3. Verifique se sua chave da API do Replicate está correta
4. Abra o console do navegador para ver os logs de debug

## Desenvolvimento Local

```bash
npm install
npm run dev
```

Certifique-se de ter o arquivo `.env` com:
```
VITE_REPLICATE_API_TOKEN=sua_chave_aqui
```