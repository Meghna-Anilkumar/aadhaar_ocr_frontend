import { useState, useCallback } from 'react';
import { ocrService } from '@/services';
import { OcrResult } from '@/utils/types';

interface OcrState {
  ocrResult: OcrResult | null;
  loading: boolean;
  error: string | null;
}

export const useOcr = () => {
  const [state, setState] = useState<OcrState>({
    ocrResult: null,
    loading: false,
    error: null,
  });

  const processImages = useCallback(async (frontImage: File | null, backImage: File | null) => {
    if (!frontImage || !backImage) {
      setState((prev) => ({
        ...prev,
        error: 'Please upload both front and back images',
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await ocrService.processImages(frontImage, backImage);
      setState({ ocrResult: result, loading: false, error: null });
    } catch (err) {
      setState({ ocrResult: null, loading: false, error: err.message });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ ocrResult: null, loading: false, error: null });
  }, []);

  return { ...state, processImages, reset };
};