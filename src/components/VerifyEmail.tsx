import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Get verification token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      verifyEmail(token);
    }
  }, []);

  const verifyEmail = async (token) => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-email`, { token });
      setMessage(response.data.message);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setError('Please enter email address');
      return;
    }
    
    setResending(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/resend-verification`, { email });
      setMessage(response.data.message);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white/70 backdrop-blur rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Email Verification</h1>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Verifying...</p>
            </div>
          )}

          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {message}
              </div>
                {message.includes('successfully') && (
                <div className="mt-4">
                  <a 
                    href="/login" 
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Login Now
                  </a>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {!loading && !message && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Didn't receive the verification email? Please enter your email address to resend the verification email.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <button
                onClick={resendVerification}
                disabled={resending || !email}
                className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
              
              <div className="text-center">
                <a href="/login" className="text-blue-600 hover:text-blue-700 underline underline-offset-4">
                  Back to Login
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;