import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0); // 只要不在页面最顶部就触发
    };

    // Check user login status
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      setUser(JSON.parse(authUser));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full shadow z-50 backdrop-blur-md transition-all duration-300 ${
        isScrolled 
          ? 'bg-white bg-opacity-50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="focus:outline-none">
              <span className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 drop-shadow-lg font-sans cursor-pointer select-none">
                James' Photography
              </span>
            </Link>
          </div>
          {/* Center Nav */}
          <div className="flex-1 flex justify-center items-center">
            <div className="flex space-x-8">
              <Link to="/gallery" className="text-gray-700 hover:text-blue-600 font-medium transition">Gallery</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition">About</Link>
              {user && (
                <Link to="/manage" className="text-gray-700 hover:text-blue-600 font-medium transition">Manage</Link>
              )}
              <Link to="/service" className="text-gray-700 hover:text-blue-600 font-medium transition">Service</Link>
              <Link to="/store" className="text-gray-700 hover:text-blue-600 font-medium transition">Store</Link>
            </div>
          </div>
          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    window.location.href = '/';
                  }}
                  className="text-gray-700 hover:text-red-600 font-medium underline underline-offset-4"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-blue-600 font-medium underline underline-offset-4"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar; 