import Navbar from './components/Navbar';

const Service = () => {
  return (
    <div className="min-h-screen flex flex-col w-screen">
      <Navbar />
      <div className="h-4"></div>
      <main className="flex-1 w-full">
        <section className="w-full bg-white">
          <div className="max-w-screen-2xl mx-auto px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800">Services & Pricing</h2>
              <p className="text-gray-600 mt-3">Choose the plan that fits you best</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Event: Hourly (left-most) */}
              <div className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-8 flex flex-col h-full">
                <h3 className="text-2xl font-semibold text-gray-800">Event (Hourly)</h3>
                <p className="mt-2 text-gray-500">Corporate / Parties / Conferences</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">$35</span>
                  <span className="text-gray-500"> / hour</span>
                </div>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    On-site event coverage
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Minimum 2 hours
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Next-day preview selection
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Full gallery within 7 days
                  </li>
                </ul>
                <button className="mt-auto pt-4 w-full inline-flex justify-center items-center px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition">
                  Book now
                </button>
              </div>
              {/* 套餐 1：基础 */}
              <div className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-8 flex flex-col h-full">
                <h3 className="text-2xl font-semibold text-gray-800">Basic</h3>
                <p className="mt-2 text-gray-500">Portrait / Small Session</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">$129</span>
                  <span className="text-gray-500"> / session</span>
                </div>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    3-hour shoot
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    25 retouched photos
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Online gallery delivery
                  </li>
                </ul>
                <button className="mt-auto pt-4 w-full inline-flex justify-center items-center px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition">
                  Book now
                </button>
              </div>

              {/* 套餐 2：标准（高亮） */}
              <div className="relative rounded-2xl border-2 border-blue-500 ring-2 ring-blue-100 shadow-md hover:shadow-lg transition p-8 flex flex-col bg-white h-full">
                <span className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow">Most Popular</span>
                <h3 className="text-2xl font-semibold text-gray-800">Standard</h3>
                <p className="mt-2 text-gray-500">Couple/Family / Outdoor</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">$229</span>
                  <span className="text-gray-500"> / session</span>
                </div>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    4-hour shoot
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    40 retouched photos + all originals
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Up to 2 locations
                  </li>
                </ul>
                <button className="mt-auto pt-4 w-full inline-flex justify-center items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                  Book now
                </button>
              </div>

              {/* 套餐 3：专业 */}
              <div className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-8 flex flex-col h-full">
                <h3 className="text-2xl font-semibold text-gray-800">Pro</h3>
                <p className="mt-2 text-gray-500">Commercial Portrait / Brand / Event</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">$499</span>
                  <span className="text-gray-500"> / from</span>
                </div>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    4–6 hour shoot (customizable)
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Pro lighting & location coordination
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Commercial retouching & licensing
                  </li>
                </ul>
                <button className="mt-auto pt-4 w-full inline-flex justify-center items-center px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition">
                  Get a quote
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Service;