const REPLICATE_API_URL = '/api/v1/predictions';

// Facilmente modificável - troque aqui para testar diferentes modelos
const MODEL_VERSION = 'tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4';

interface ReplicateRequest {
  version: string;
  input: {
    image: string;
    prompt: string;
  };
}

interface ReplicateResponse {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  output?: string[];
  error?: string;
}

// Converte arquivo para base64 data URL
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const transformImage = async (image: File, prompt: string): Promise<string> => {
  try {
    // Converte a imagem para data URL
    const imageDataURL = await fileToDataURL(image);
    
    // Cria a requisição para a API
    const requestBody: ReplicateRequest = {
      version: MODEL_VERSION,
      input: {
        image: imageDataURL,
        prompt: prompt
      }
    };

    // Envia a requisição inicial
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const prediction: ReplicateResponse = await response.json();
    console.log('Prediction created:', prediction);
    
    // Polling para aguardar o resultado
    return await pollForResult(prediction.id);
    
  } catch (error) {
    console.error('Erro ao transformar imagem:', error);
    throw error; // Propagar o erro original para debug
  }
};

const pollForResult = async (predictionId: string): Promise<string> => {
  const maxAttempts = 60; // 5 minutos máximo
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const prediction: ReplicateResponse = await response.json();
      console.log(`Polling attempt ${attempts + 1}:`, prediction);
      
      if (prediction.status === 'succeeded' && prediction.output) {
        return prediction.output[0]; // URL da imagem gerada
      }
      
      if (prediction.status === 'failed') {
        throw new Error(prediction.error || 'Processamento falhou');
      }
      
      // Aguarda 5 segundos antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
      
    } catch (error) {
      console.error('Erro no polling:', error);
      throw error;
    }
  }
  
  throw new Error('Timeout: processamento demorou muito para ser concluído');
};