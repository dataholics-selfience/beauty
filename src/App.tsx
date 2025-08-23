import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { PromptInput } from './components/PromptInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ImageComparison } from './components/ImageComparison';
import { transformImage } from './services/replicate';
import { Sparkles, RotateCcw } from 'lucide-react';

type AppState = 'upload' | 'processing' | 'result';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [transformedImageUrl, setTransformedImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setError('');
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    setError('');
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) {
      setError('Por favor, envie uma imagem e descreva a transformação desejada.');
      return;
    }

    setState('processing');
    setError('');

    try {
      const resultUrl = await transformImage(selectedImage, prompt);
      setTransformedImageUrl(resultUrl);
      setState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setState('upload');
    }
  };

  const handleReset = () => {
    setState('upload');
    setSelectedImage(null);
    setPrompt('');
    setTransformedImageUrl('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        {state === 'upload' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onImageRemove={handleImageRemove}
              />
              
              <PromptInput
                value={prompt}
                onChange={handlePromptChange}
              />

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!selectedImage || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Gerar Simulação
              </button>
            </div>
          </div>
        )}

        {state === 'processing' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <LoadingSpinner />
          </div>
        )}

        {state === 'result' && selectedImage && transformedImageUrl && (
          <div className="space-y-6">
            <ImageComparison
              originalImage={selectedImage}
              transformedImageUrl={transformedImageUrl}
            />
            
            <div className="text-center">
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                Nova Transformação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;