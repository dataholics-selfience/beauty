export const transformImage = async (image: File, prompt: string): Promise<string> => {
  try {
    console.log('Iniciando transformação da imagem...');

    // Converter imagem para base64
    const imageBase64 = await fileToBase64(image);
    
    const apiToken = import.meta.env.VITE_REPLICATE_API_TOKEN;
    
    if (!apiToken) {
      throw new Error('Token da API Replicate não configurado');
    }

    // Criar predição na Replicate
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiToken}`,
      },
      body: JSON.stringify({
        version: 'tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4',
        input: {
          image: imageBase64,
          prompt: prompt,
          num_steps: 20,
          style_strength_ratio: 20,
          num_outputs: 1
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro da API: ${JSON.stringify(errorData)}`);
    }

    const prediction = await response.json();
    console.log('Predição criada:', prediction.id);

    // Fazer polling para obter resultado
    const result = await pollForResult(prediction.id, apiToken);
    
    console.log('Transformação concluída com sucesso!');
    return result;

  } catch (error) {
    console.error('Erro ao transformar imagem:', error);
    
    if (error instanceof Error) {
      throw new Error(`Falha na transformação: ${error.message}`);
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
const pollForResult = async (predictionId: string, apiToken: string): Promise<string> => {
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