import React from 'react';
import { Camera } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Camera className="w-8 h-8 text-purple-600" />
        <h1 className="text-4xl font-bold text-gray-800">AI Photo Styler</h1>
      </div>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Transforme suas fotos com poder da inteligência artificial. 
        Aplique estilos, edições e simulações incríveis em segundos.
      </p>
    </header>
  );
};