import React from 'react';
import Navbar from './components/Navbar'

const About = () => (
  <div className="min-h-screen flex flex-col w-screen">
    <Navbar />
    <div className="h-4"></div>
    {/* About页面内容 */}
    <section className="flex-1 w-full bg-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row items-center gap-40">
          {/* 自拍照 */}
          <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-gray-200 flex-shrink-0">
            <img 
              src="/selfie/selfie.jpg" 
              alt="James的自拍照" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* 个人介绍 */}
          <div className="text-center md:text-left max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              James Feng
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              A photographer currently living in Melbourne, I am good at landscape photography and am also practicing portrait photography.
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              Through my lens, I capture the beauty of nature and the essence of human moments, blending technical expertise with artistic vision.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Devices区域 */}
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">My Devices</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The tools I use to capture moments and create memories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Camera 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Fujifilm X-T50</h3>
              <p className="text-gray-600 leading-relaxed">
                My main digital camera for landscape and street photography
              </p>
            </div>
          </div>

          {/* Camera 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Hasselblad 500C/M</h3>
              <p className="text-gray-600 leading-relaxed">
                Medium format camera for professional portrait work
              </p>
            </div>
          </div>

          {/* Lens */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Various Lenses</h3>
              <p className="text-gray-600 leading-relaxed">
                Collection of prime and zoom lenses for different scenarios
              </p>
            </div>
          </div>

          {/* Olympus Pen D3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Olympus Pen D3</h3>
              <p className="text-gray-600 leading-relaxed">
                Classic half-frame film camera for unique perspective photography
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default About; 