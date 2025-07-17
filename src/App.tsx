import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AadhaarUploadPage from './components/AadhaarUpload';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<AadhaarUploadPage />} />
    </Routes>
  );
};

export default App;