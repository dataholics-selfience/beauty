export const transformImage = async (
  image: File, 
  prompt: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    console.log('=== INICIANDO TRANSFORMAÇÃO ===');
    onProgress?.(10);

    // Converter imagem para base64
    const imageBase64 = await fileToBase64(image);
    onProgress?.(20);

    // Obter token - versão simplificada
    const apiToken = import.meta.env.VITE_REPLICATE_API_TOKEN;
    
    console.log('=== DEBUG COMPLETO ===');
    console.log('Todas as variáveis import.meta.env:', import.meta.env);
    console.log('VITE_REPLICATE_API_TOKEN existe?', !!apiToken);
    console.log('Valor do token (primeiros 10 chars):', apiToken ? apiToken.substring(0, 10) + '...' : 'UNDEFINED');
    console.log('Tipo do token:', typeof apiToken);
    console.log('======================');
    
    if (!apiToken) {
      const availableVars = Object.keys(import.meta.env).join(', ');
      throw new Error(`Token da API Replicate não encontrado!

DIAGNÓSTICO:
- Variável procurada: VITE_REPLICATE_API_TOKEN
- Variáveis disponíveis: ${availableVars}
- Total de variáveis: ${Object.keys(import.meta.env).length}

SOLUÇÃO:
1. No Netlify: Site Settings > Environment Variables
2. Adicione: VITE_REPLICATE_API_TOKEN = sua_chave_replicate
3. Faça novo deploy
4. Certifique-se que a chave começa com 'r8_'`);
    }

    onProgress?.(30);

    console.log('Fazendo requisição para Replicate...');
    
    // Criar predição na Replicate
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiToken}`,
      },
      body: JSON.stringify({
        version: 'ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4',
        input: {
          image: imageBase64,
          prompt: prompt,
          num_steps: 30,
          style_strength_ratio: 25,
          num_outputs: 1
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da API Replicate:', errorData);
      throw new Error(`Erro da API Replicate: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const prediction = await response.json();
    console.log('Predição criada:', prediction.id);
    
    onProgress?.(40);

    // Fazer polling para obter resultado
    const result = await pollForResult(prediction.id, apiToken, onProgress);
    
    console.log('Transformação concluída com sucesso!');
    onProgress?.(100);
    return result;

  } catch (error) {
    console.error('=== ERRO COMPLETO ===');
    console.error('Erro:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('====================');
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro desconhecido na transformação da imagem');
  }
};

// Função auxiliar para converter arquivo para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Função para fazer polling do resultado
const pollForResult = async (
  predictionId: string, 
  apiToken: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  const maxAttempts = 60; // 5 minutos
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const prediction = await response.json();
      console.log(`Polling ${attempts + 1} - Status: ${prediction.status}`);
      
      // Update progress based on attempts (40% to 95%)
      const progressIncrement = (95 - 40) / maxAttempts;
      onProgress?.(40 + (attempts * progressIncrement));

      if (prediction.status === 'succeeded' && prediction.output?.length > 0) {
        return prediction.output[0];
      }

      if (prediction.status === 'failed') {
        throw new Error(prediction.error || 'Processamento falhou');
      }

      if (prediction.status === 'canceled') {
        throw new Error('Processamento cancelado');
      }

      // Aguardar 5 segundos
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;

    } catch (error) {
      throw error;
    }
  }

  throw new Error('Timeout: Processamento demorou mais de 5 minutos');
};