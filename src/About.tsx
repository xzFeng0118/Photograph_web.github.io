import React from 'react';
import Navbar from './components/Navbar'

const About = () => (
  <div>
    <Navbar />
    <div className="h-4"></div>
    {/* 个人简介内容 */}
    <section className="w-full min-h-[calc(100vh-4rem)] flex justify-end items-center bg-white bg-opacity-80">
      <div className="flex flex-col md:flex-row items-start justify-center gap-12 w-full md:w-2/3 mx-auto">
        {/* 左侧个人照片 */}
        <div className="w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-200 flex-shrink-0 mx-auto md:mx-0">
          <img src="/selfie/selfie.jpg" alt="个人照片" className="w-full h-full object-cover" />
        </div>
        {/* 右侧个人描述 */}
        <div className="mt-8 md:mt-0 max-w-xl text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">James</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            A photographer currently living in Melbourne, I am good at landscape photography and am also practicing portrait photography. My main job is IT-related.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default About; 