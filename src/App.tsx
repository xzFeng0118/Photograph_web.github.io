import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./About";
import Navbar from "./components/Navbar";
import ImageManager from "./components/ImageManager";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

const images = [
  "/images/000380330011.jpg",
  "/images/000315840004.jpg",
  "/images/000256160005.jpg",
  "/images/000189280002.jpg",
];

const digitalImages = ["/digital/DSCF1902.webp", "/digital/DSCF1861.webp"];

const filmImages = [
  "/images/000315840004.jpg",
  "/images/000380330011.jpg",
  "/images/000189280002.jpg",
  "/images/000256160005.jpg",
];

function Home({
  current,
  nextImage,
  prevImage,
}: {
  current: number;
  nextImage: () => void;
  prevImage: () => void;
}) {
  const [digitalCurrent, setDigitalCurrent] = useState(0);
  const nextDigitalImage = () =>
    setDigitalCurrent((digitalCurrent + 1) % digitalImages.length);
  const prevDigitalImage = () =>
    setDigitalCurrent(
      (digitalCurrent - 1 + digitalImages.length) % digitalImages.length
    );

  const [filmCurrent, setFilmCurrent] = useState(0);
  const nextFilmImage = () =>
    setFilmCurrent((filmCurrent + 1) % filmImages.length);
  const prevFilmImage = () =>
    setFilmCurrent((filmCurrent - 1 + filmImages.length) % filmImages.length);
  return (
    <div>
      <Navbar />
      {/* 图片轮播大框 */}
      <div className="w-screen h-[40rem] relative">
        <div className="relative w-screen h-[40rem] overflow-hidden flex items-center">
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow transition z-10"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <img
            src={images[current]}
            alt="preview"
            className="w-screen h-[40rem] object-cover object-center transition-all duration-500"
            style={{ zIndex: 0 }}
          />
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow transition z-10"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 新的区域 - 宽度为整个网页，高度与轮播一样 */}
      <div className="w-screen h-[40rem] relative overflow-hidden">
        {/* 左侧背景图+小轮播，flex居中 */}
        <div className="absolute left-70 top-0 w-1/2 h-full flex items-center justify-center">
          <img
            src="/images/Fujixt50.jpg"
            alt="Fuji X-T50 Camera"
            className="h-full rounded-2xl object-cover"
            style={{ maxWidth: "60rem" }}
          />
          <div className="w-full h-full flex items-center justify-center">
            <div
              style={{
                width: "28rem",
                height: "18rem",
                transform: "translate(-180%, 34.5%)",
              }}
              className="relative z-10 flex items-center justify-center"
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full h-full flex items-center justify-center">
                {/* 小型轮播 */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <button
                    onClick={prevDigitalImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-lg transition-all duration-200 z-20"
                  >
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <img
                    src={digitalImages[digitalCurrent]}
                    alt="Digital Photography"
                    className="object-cover rounded-lg transition-all duration-500 w-full h-full"
                    style={{ maxWidth: "140%", maxHeight: "140%" }}
                  />
                  <button
                    onClick={nextDigitalImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-lg transition-all duration-200 z-20"
                  >
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 右侧区域 */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-white flex items-center justify-center">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-2">
                Digital Photography
              </h2>
              <p className="text-xl text-gray-600">by Fujifilm X-T50</p>
            </div>
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg">
              Browse All
            </button>
          </div>
        </div>
      </div>

      {/* 第三个区域 - 胶片风格 */}
      <div
        className="w-screen h-[40rem] relative overflow-x-auto overflow-y-hidden"
        style={{
          background:
            "linear-gradient(180deg, #a97c50 0%, #e2c9a0 50%, #a97c50 100%)",
          boxShadow: "inset 0 8px 32px #6b3e1b, inset 0 -8px 32px #6b3e1b",
        }}
      >
        {/* 竖排标题 */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30"
          style={{ height: "80%", display: "flex", alignItems: "center" }}
        >
          <span
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontWeight: "bold",
              fontSize: "2.5rem",
              color: "#6b3e1b",
              letterSpacing: "0.2em",
              textShadow: "0 2px 8px #e2c9a0",
              opacity: 0.85,
            }}
          >
            Film Photography
          </span>
        </div>
        {/* 竖排右侧按钮 */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30"
          style={{ height: "80%", display: "flex", alignItems: "center" }}
        >
          <button
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontWeight: "bold",
              fontSize: "2rem",
              color: "#fff",
              background: "#6b3e1b",
              border: "none",
              borderRadius: "1.2rem",
              letterSpacing: "0.15em",
              boxShadow: "0 2px 8px #a97c50",
              opacity: 0.92,
              padding: "1.2rem 0.7rem",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s, opacity 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#a97c50";
              e.currentTarget.style.color = "#6b3e1b";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#6b3e1b";
              e.currentTarget.style.color = "#fff";
            }}
          >
            Browse All
          </button>
        </div>
        {/* 胶片上下深色边带 */}
        <div className="absolute top-0 left-0 w-full h-8 bg-[#6b3e1b] z-10 flex items-center">
          {/* 上齿孔 */}
          <div className="flex w-full justify-between px-2">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-5 h-4 bg-white rounded-sm"></div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-[#6b3e1b] z-10 flex items-center">
          {/* 下齿孔 */}
          <div className="flex w-full justify-between px-2">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-5 h-4 bg-white rounded-sm"></div>
            ))}
          </div>
        </div>
        {/* 胶片格图片展示 */}
        <div className="relative z-20 flex items-center justify-center h-full">
          <div className="flex flex-row items-center justify-center w-[160vw] h-[28rem] gap-4">
            {filmImages.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                className="bg-[#e2c9a0] border-4 border-[#a97c50] rounded-lg shadow-lg h-full flex items-center justify-center overflow-hidden"
              >
                <img
                  src={img}
                  alt={`film-${idx}`}
                  className="h-full w-auto max-w-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 新增空白区域：与春夏秋冬区域同高 */}
      <div className="w-screen h-[40rem] bg-white flex items-center justify-between px-24">
        {/* 左侧标题和按钮 */}
        <div className="flex flex-col items-center justify-center h-[25.6rem] w-[18rem] ml-80">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-2">Sunset</h2>
            </div>
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg">
              Browse All
            </button>
          </div>
        </div>
        {/* 右侧图片及小轮播 */}
        <div
          className="relative h-full flex items-center justify-center"
          style={{ maxWidth: "48rem", width: "100%", transform: "translateX(-15rem)" }}
        >
          {/* 小型轮播叠加在图片上方 */}
          <div
            className="absolute left-1/2 top-1/2 z-20"
            style={{
              width: "15rem",
              height: "15rem",
              transform: "translate(-40%, -60%)",
            }}
          >
            {/* 半透明渐变边缘 */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0) 60%, rgba(255,255,255,0.7) 100%)",
                zIndex: 30,
              }}
            />
            <div className="bg-white border-0 rounded-xl shadow-xl overflow-hidden w-full h-full flex items-center justify-center relative z-10">
              <div className="relative w-full h-full flex items-center justify-center">
                <button
                  onClick={prevDigitalImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-lg transition-all duration-200 z-20"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <img
                  src={digitalImages[digitalCurrent]}
                  alt="Sunset Small Carousel"
                  className="object-cover rounded-lg transition-all duration-500 w-full h-full"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
                <button
                  onClick={nextDigitalImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-lg transition-all duration-200 z-20"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* 右侧大图片 */}
          <img
            src="/images/hasselblad.jpg"
            alt="hasselblad"
            className="h-full rounded-2xl object-cover"
            style={{ maxWidth: "48rem" }}
          />
        </div>
      </div>

      {/* 新区域：与上方胶片区域尺寸一致 */}
      <div className="w-screen h-[40rem] flex flex-row">
        {[
          { img: "/seasons/Spring.webp", label: "Spring" },
          { img: "/seasons/Summer.webp", label: "Summer" },
          { img: "/seasons/Autumn.webp", label: "Autumn" },
          { img: "/seasons/Winter.webp", label: "Winter" },
        ].map((item, idx) => (
          <div key={idx} className="w-1/4 h-full relative overflow-hidden">
            <img
              src={item.img}
              alt={`season-${idx}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="text-white text-5xl font-extrabold drop-shadow-lg tracking-widest"
                style={{ textShadow: "0 4px 24px #000, 0 1px 2px #000" }}
              >
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 新区域：与春夏秋冬区域尺寸一致 */}
      <div className="w-screen h-[40rem] flex items-center justify-center bg-white px-8 gap-12">
        {/* 左侧横向标题和按钮（与板块一一致） */}
        <div className="flex flex-col items-center justify-center h-[25.6rem] w-[18rem]">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-2">
                Portrait
              </h2>
            </div>
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg">
              Browse All
            </button>
          </div>
        </div>
        {/* 木质相框轮播（立体感+木纹） */}
        <div className="flex items-center justify-center h-[25.6rem] w-1/3">
          <div
            className="relative h-full w-full flex items-center justify-center"
            style={{
              borderRadius: "1.5rem",
              boxShadow:
                "0 12px 48px #b88654, 0 4px 16px #7c5a36, 0 0 0 16px #6b3e1b",
              background: `url('/texture/wood.jfif') center/cover repeat, linear-gradient(135deg, #7c5a36 60%, #b88654 100%)`,
              padding: "2.4rem", // 边框宽度加宽一倍
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* 金色内边 */}
            <div
              style={{
                border: "3px solid #d4af37",
                borderRadius: "1rem",
                padding: "0.7rem",
                background: "#fff",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 12px #b88654 inset",
              }}
            >
              {/* 照片 */}
              <div
                style={{
                  width: "70%",
                  height: "80%",
                  background: "#222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 12px #aaa",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/portrait/000414710005.jpg"
                  alt="portrait"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [current, setCurrent] = useState(0);
  const nextImage = () => setCurrent((current + 1) % images.length);
  const prevImage = () =>
    setCurrent((current - 1 + images.length) % images.length);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/manage" element={<ImageManager />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route
            path="*"
            element={
              <Home
                current={current}
                nextImage={nextImage}
                prevImage={prevImage}
              />
            }
          />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
