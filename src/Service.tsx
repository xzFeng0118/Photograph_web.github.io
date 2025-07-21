import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Service = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Page content goes here */}
      </main>
      <Footer />
    </div>
  );
};

export default Service; 