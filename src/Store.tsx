import React from 'react';
import Navbar from './components/Navbar';

const Store = () => (
  <div className="min-h-screen flex flex-col w-screen">
    <Navbar />
    <div className="h-4"></div>
    <main className="flex-1 w-full bg-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Store</h1>
        <p className="text-lg text-gray-600">Coming soon.</p>
      </div>
    </main>
  </div>
);

export default Store;

