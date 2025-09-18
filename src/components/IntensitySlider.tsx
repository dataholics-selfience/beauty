import React from 'react';

interface IntensitySliderProps {
  intensity: number;
  onIntensityChange: (intensity: number) => void;
  disabled?: boolean;
}

export const IntensitySlider: React.FC<IntensitySliderProps> = ({
  intensity,
  onIntensityChange,
  disabled = false
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">
          Intensidade do Tratamento
        </label>
        <span className="text-sm text-purple-600 font-semibold">
          {intensity}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={intensity}
        onChange={(e) => onIntensityChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${intensity}%, #e5e7eb ${intensity}%, #e5e7eb 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Sutil</span>
        <span>Moderado</span>
        <span>Intenso</span>
      </div>
    </div>
  );
};