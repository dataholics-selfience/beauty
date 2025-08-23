import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Processando sua imagem...</h3>
      <p className="text-gray-600">
        A IA está aplicando as transformações. Isso pode levar alguns segundos.
      </p>
    </div>
  );
};