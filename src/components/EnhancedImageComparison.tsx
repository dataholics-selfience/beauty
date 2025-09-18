import React, { useState, useEffect } from 'react';
import { IntensitySlider } from './IntensitySlider';

interface EnhancedImageComparisonProps {
  originalImage: File;
  transformedImageUrl: string;
  treatmentName: string;
}

export const EnhancedImageComparison: React.FC<EnhancedImageComparisonProps> = ({
  originalImage,
  transformedImageUrl,
  treatmentName
}) => {
  const [intensity, setIntensity] = useState(100);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleIntensityChange = (newIntensity: number) => {
    setIsTransitioning(true);
    setIntensity(newIntensity);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📷 Imagem Original
          </h3>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(originalImage)}
              alt="Original"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Result with Intensity Control */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ✨ Resultado - {treatmentName}
          </h3>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
            {/* Original image as background */}
            <img
              src={URL.createObjectURL(originalImage)}
              alt="Original background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Transformed image with opacity based on intensity */}
            <img
              src={transformedImageUrl}
              alt="Transformed"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isTransitioning ? 'opacity-50' : ''
              }`}
              style={{ 
                opacity: intensity / 100,
                filter: intensity < 100 ? 'none' : 'none'
              }}
            />
            
            {/* Intensity overlay indicator */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {intensity}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Intensity Control */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <IntensitySlider
          intensity={intensity}
          onIntensityChange={handleIntensityChange}
        />
        <p className="text-sm text-gray-600 mt-3 text-center">
          Ajuste a intensidade para visualizar diferentes níveis do tratamento {treatmentName.toLowerCase()}
        </p>
      </div>
    </div>
  );
};