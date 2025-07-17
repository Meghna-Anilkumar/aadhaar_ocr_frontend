import React, { useState } from 'react';
import { serverInstance } from '@/services';
import { OcrResult } from '@/utils/types';

const AadhaarUploadPage: React.FC = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    console.log(`[DEBUG] Attempting to upload ${side} image:`, file);
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        console.log(`[DEBUG] Invalid file type for ${side} image: ${file.type}`);
        setError('Please upload a valid image (JPEG or PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.log(`[DEBUG] File size too large for ${side} image: ${file.size} bytes`);
        setError('File size exceeds 5MB limit');
        return;
      }
      setError(null);
      const previewUrl = URL.createObjectURL(file);
      console.log(`[DEBUG] Successfully set ${side} image preview:`, previewUrl);
      if (side === 'front') {
        setFrontImage(file);
        setFrontPreview(previewUrl);
      } else {
        setBackImage(file);
        setBackPreview(previewUrl);
      }
    }
  };

  const handleOCRProcess = async () => {
    if (!frontImage || !backImage) {
      console.log('[DEBUG] Missing images:', { frontImage, backImage });
      setError('Please upload both front and back images');
      return;
    }
    setLoading(true);
    setError(null);
    console.log('[DEBUG] Starting OCR process with images:', { frontImage, backImage });
    try {
      const formData = new FormData();
      formData.append('frontImage', frontImage);
      formData.append('backImage', backImage);
      console.log('[DEBUG] FormData prepared:', Object.fromEntries(formData));

      const response = await serverInstance.post<OcrResult>('/api/ocr/process', formData);
      console.log('[DEBUG] OCR API response:', response.data);
      setOcrResult(response.data);
    } catch (err) {
      console.log('[DEBUG] OCR API error:', err);
      
      // Handle different types of errors
      let errorMessage = 'Error processing images. Please try again.';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your images and try again.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      console.error(err);
    } finally {
      console.log('[DEBUG] OCR process completed, loading set to false');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFrontImage(null);
    setBackImage(null);
    setFrontPreview(null);
    setBackPreview(null);
    setOcrResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Aadhaar Card OCR</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Upload Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload the <strong>front side</strong> (with photo and personal details) in the first slot</li>
                <li>• Upload the <strong>back side</strong> (with address and UIDAI info) in the second slot</li>
                <li>• Ensure images are clear and well-lit</li>
                <li>• Maximum file size: 5MB per image</li>
              </ul>
            </div>
          </div>

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
                      setError(null);
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
                      setError(null);
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
              onClick={handleOCRProcess}
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
                onClick={resetForm}
                className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          
          {ocrResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-lg font-semibold text-green-800">Parsed Data</h2>
              </div>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AadhaarUploadPage;