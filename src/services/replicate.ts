import axios from 'axios';

export const transformImage = async (
  image: File, 
  prompt: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    console.log('Iniciando transformação da imagem...');
    onProgress?.(10);

    // Converter imagem para base64
    const imageBase64 = await fileToBase64(image);
    onProgress?.(20);

    onProgress?.(30);

    // Enviar para o backend
    const response = await axios.post('http://localhost:3001/api/transform-image', {
      image: imageBase64,
      prompt: prompt
    }, {
      timeout: 300000, // 5 minutes timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    onProgress?.(90);

    if (response.data.success) {
      console.log('Transformação concluída com sucesso!');
      onProgress?.(100);
      return response.data.imageUrl;
    } else {
      throw new Error(response.data.error || 'Falha na transformação');
    }

  } catch (error) {
    console.error('Erro ao transformar imagem:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout: A transformação demorou mais que o esperado');
      }
      if (error.response?.data?.error) {
        throw new Error(`Erro do servidor: ${error.response.data.error}`);
      }
      throw new Error(`Erro de conexão: ${error.message}`);
    }
    
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

export const transformImageWithReplicate = async (
  image: File, 
  prompt: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    console.log('Iniciando transformação da imagem...');
    onProgress?.(10);

    // Converter imagem para base64
    const imageBase64 = await fileToBase64(image);
    onProgress?.(20);

    const apiToken = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
    if (!apiToken) {
      throw new Error('Token da API Replicate não configurado');
    }

    onProgress?.(30);

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
          num_steps: 30,
          style_strength_ratio: 25,
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
    
    onProgress?.(40);

    // Fazer polling para obter resultado
    const result = await pollForResult(prediction.id, apiToken, onProgress);
    
    console.log('Transformação concluída com sucesso!');
    onProgress?.(100);
    return result;

  } catch (error) {
    console.error('Erro ao transformar imagem:', error);
    
    if (error instanceof Error) {
      throw new Error(`Falha na transformação: ${error.message}`);
    }
    
    throw new Error('Erro desconhecido na transformação da imagem');
  }
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