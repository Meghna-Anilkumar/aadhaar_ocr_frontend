import React, { useState } from 'react';
import { useOcr } from '@/hooks/useOcr';
import Alert from '@/components/Alert';

const AadhaarUploadPage: React.FC = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const { ocrResult, loading, error, processImages, reset } = useOcr();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    console.log(`Attempting to upload ${side} image:`, file);
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        console.log(`Invalid file type for ${side} image: ${file.type}`);
        processImages(null, null); 
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.log(`File size too large for ${side} image: ${file.size} bytes`);
        processImages(null, null);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      console.log(`Successfully set ${side} image preview:`, previewUrl);
      if (side === 'front') {
        setFrontImage(file);
        setFrontPreview(previewUrl);
      } else {
        setBackImage(file);
        setBackPreview(previewUrl);
      }
    }
  };

  const handleReset = () => {
    setFrontImage(null);
    setBackImage(null);
    setFrontPreview(null);
    setBackPreview(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Aadhaar Card OCR</h1>
          
          {error && <Alert type="error" message={error} className="mb-4" />}
          
          <Alert
            type="info"
            message={
              <div>
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Upload Instructions:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload the <strong>front side</strong> (with photo and personal details) in the first slot</li>
                  <li>• Upload the <strong>back side</strong> (with address and UIDAI info) in the second slot</li>
                  <li>• Ensure images are clear and well-lit</li>
                  <li>• Maximum file size: 5MB per image</li>
                </ul>
              </div>
            }
            className="mb-6"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Aadhaar Front Side
                <span className="text-xs text-gray-500 block font-normal">
                  (Side with photo and personal details)
                </span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleImageUpload(e, 'front')}
                className="mb-4 p-2 border rounded text-sm"
              />
              {frontPreview && (
                <div className="relative">
                  <img src={frontPreview} alt="Front Preview" className="max-h-48 rounded shadow-md" />
                  <button
                    onClick={() => {
                      setFrontImage(null);
                      setFrontPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Aadhaar Back Side
                <span className="text-xs text-gray-500 block font-normal">
                  (Side with address and UIDAI contact)
                </span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleImageUpload(e, 'back')}
                className="mb-4 p-2 border rounded text-sm"
              />
              {backPreview && (
                <div className="relative">
                  <img src={backPreview} alt="Back Preview" className="max-h-48 rounded shadow-md" />
                  <button
                    onClick={() => {
                      setBackImage(null);
                      setBackPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => processImages(frontImage, backImage)}
              disabled={loading || !frontImage || !backImage}
              className="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Parse Aadhaar'
              )}
            </button>
            
            {(frontImage || backImage || ocrResult) && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          
          {ocrResult && (
            <Alert
              type="success"
              message={
                <div>
                  <h2 className="text-lg font-semibold text-green-800 mb-2">Parsed Data</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name:</p>
                      <p className="font-medium text-gray-900">{ocrResult.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Aadhaar Number:</p>
                      <p className="font-medium text-gray-900">{ocrResult.aadhaarNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth:</p>
                      <p className="font-medium text-gray-900">{ocrResult.dob}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Address:</p>
                      <p className="font-medium text-gray-900">{ocrResult.address}</p>
                    </div>
                  </div>
                </div>
              }
              className="mt-6"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AadhaarUploadPage;