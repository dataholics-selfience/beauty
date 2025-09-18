import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Sparkles className="w-8 h-8 text-purple-600" />
        <h1 className="text-4xl font-bold text-gray-800">Simulador de Tratamentos Estéticos</h1>
      </div>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Visualize os resultados de tratamentos estéticos antes de realizá-los.
        Simule Botox, Ácido Hialurônico, Laser e Bioestimuladores com IA avançada.
      </p>
    </header>
  );
};