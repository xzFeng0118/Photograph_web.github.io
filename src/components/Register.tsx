import Navbar from './Navbar';
import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password });
      
      // Show registration success and email verification message
      setError('');
      setSuccess(response.data.message);
      
      // Redirect to verification page after 3 seconds
      setTimeout(() => {
        window.location.href = '/verify-email';
      }, 3000);
    } catch (e: any) {
      const message = e?.response?.data?.message || 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/70 backdrop-blur rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create account</h1>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {success}
                </div>
                <p className="text-sm mt-2">Redirecting to email verification page in 3 seconds...</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 underline underline-offset-4">Sign in</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;

