import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Aadhaar OCR App</h1>
        <p className="text-lg text-gray-600 mb-8">A MERN stack application to extract information from Aadhaar cards.</p>
        <Link
          to="/upload"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Go to Upload Page
        </Link>
      </div>
    </div>
  );
};

export default HomePage;