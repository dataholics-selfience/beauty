import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { TreatmentSelector } from './components/TreatmentSelector';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EnhancedImageComparison } from './components/EnhancedImageComparison';
import { transformImage } from './services/replicate';
import { Treatment } from './types/treatments';
import { Sparkles, RotateCcw } from 'lucide-react';

type AppState = 'upload' | 'processing' | 'result';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setError('');
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleTreatmentSelect = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setError('');
  };

  const handleGenerate = async () => {
    if (!selectedImage || !selectedTreatment) {
      setError('Por favor, envie uma imagem e selecione um tratamento.');
      return;
    }

    setState('processing');
    setError('');
    setProgress(0);

    try {
      const resultUrl = await transformImage(
        selectedImage, 
        selectedTreatment.prompt,
        setProgress
      );
      setTransformedImageUrl(resultUrl);
      setState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setState('upload');
      setProgress(0);
    }
  };

  const handleReset = () => {
    setState('upload');
    setSelectedImage(null);
    setSelectedTreatment(null);
    setTransformedImageUrl('');
    setProgress(0);
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
              
              <TreatmentSelector
                selectedTreatment={selectedTreatment}
                onTreatmentSelect={handleTreatmentSelect}
              />

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!selectedImage || !selectedTreatment}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Simular {selectedTreatment?.name || 'Tratamento'}
              </button>
            </div>
          </div>
        )}

        {state === 'processing' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <LoadingSpinner 
              progress={progress}
              treatmentName={selectedTreatment?.name || 'tratamento'}
            />
          </div>
        )}

        {state === 'result' && selectedImage && transformedImageUrl && selectedTreatment && (
          <div className="space-y-6">
            <EnhancedImageComparison
              originalImage={selectedImage}
              transformedImageUrl={transformedImageUrl}
              treatmentName={selectedTreatment.name}
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