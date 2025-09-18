import React from 'react';
import { Loader2 } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface LoadingSpinnerProps {
  progress?: number;
  treatmentName?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  progress = 0, 
  treatmentName = 'tratamento' 
}) => {
  return (
    <div className="text-center py-12">
      <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Aplicando {treatmentName}...
      </h3>
      <p className="text-gray-600">
        A IA está simulando o tratamento estético. Isso pode levar alguns minutos.
      </p>
      
      {progress > 0 && (
        <div className="mt-6 max-w-md mx-auto">
          <ProgressBar progress={progress} />
          <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% concluído</p>
        </div>
      )}
    </div>
  );
};