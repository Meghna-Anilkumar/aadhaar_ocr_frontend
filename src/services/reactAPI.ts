import axios, { AxiosError, AxiosInstance } from 'axios';
import { OcrResult } from '@/utils/types';


interface ErrorResponse {
  error?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const serverInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


serverInstance.interceptors.request.use(
  (config) => {
    console.log('API request:', config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);


serverInstance.interceptors.response.use(
  (response) => {
    console.log('API response:', response.data);
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    console.error('Response interceptor error:', error);
    let errorMessage = 'Error processing images. Please try again.';

    if (error.response?.data && 'error' in error.response.data) {
      errorMessage = error.response.data.error || errorMessage;
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid request. Please check your images and try again.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    return Promise.reject({ ...error, message: errorMessage });
  }
);

export const ocrService = {
  processImages: async (frontImage: File, backImage: File): Promise<OcrResult> => {
    const formData = new FormData();
    formData.append('frontImage', frontImage);
    formData.append('backImage', backImage);
    
    const response = await serverInstance.post<OcrResult>('/api/ocr/process', formData);
    return response.data;
  },
};