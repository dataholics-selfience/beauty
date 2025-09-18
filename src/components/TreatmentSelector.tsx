import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Treatment, TREATMENTS } from '../types/treatments';

interface TreatmentSelectorProps {
  selectedTreatment: Treatment | null;
  onTreatmentSelect: (treatment: Treatment) => void;
  disabled?: boolean;
}

export const TreatmentSelector: React.FC<TreatmentSelectorProps> = ({
  selectedTreatment,
  onTreatmentSelect,
  disabled = false
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Selecione o Tratamento Estético
      </label>
      <div className="relative">
        <select
          value={selectedTreatment?.id || ''}
          onChange={(e) => {
            const treatment = TREATMENTS.find(t => t.id === e.target.value);
            if (treatment) onTreatmentSelect(treatment);
          }}
          disabled={disabled}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Escolha um tratamento...</option>
          {TREATMENTS.map((treatment) => (
            <option key={treatment.id} value={treatment.id}>
              {treatment.icon} {treatment.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      
      {selectedTreatment && (
        <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{selectedTreatment.icon}</span>
            <h3 className="font-semibold text-purple-800">{selectedTreatment.name}</h3>
          </div>
          <p className="text-purple-700 text-sm">{selectedTreatment.description}</p>
        </div>
      )}
    </div>
  );
};