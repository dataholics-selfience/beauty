import React from 'react';

interface ImageComparisonProps {
  originalImage: File;
  transformedImageUrl: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalImage,
  transformedImageUrl
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Imagem Original</h3>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={URL.createObjectURL(originalImage)}
            alt="Original"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resultado da IA</h3>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={transformedImageUrl}
            alt="Transformed"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};