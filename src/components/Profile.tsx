import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  email_verified?: boolean;
  created_at: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUser(response.data.user);
      setFormData({
        name: response.data.user.name || '',
        bio: response.data.user.bio || ''
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      } else {
        setError('Failed to load user information');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: user?.name || '',
      bio: user?.bio || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${API_BASE_URL}/api/auth/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUser(response.data.user);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Failed to load user information</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* 头部区域 */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  {editing && (
                    <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">
                    {user.name || 'No name set'}
                  </h1>
                  <p className="text-blue-100 text-lg mt-1">{user.email}</p>
                  <p className="text-blue-200 text-sm mt-2">
                    Registered on {new Date(user.created_at).toLocaleDateString('en-US')}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {!editing ? (
                    <button
                      onClick={handleEdit}
                      className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="px-8 py-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                {/* 基本信息 */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900">{user.email}</p>
                      {user.email_verified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    {!user.email_verified && (
                      <p className="text-sm text-yellow-600 mt-1">
                        <a href="/verify-email" className="underline hover:text-yellow-700">
                          Verify Email Address
                        </a>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    {editing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900 whitespace-pre-wrap">{user.bio || 'No bio yet'}</p>
                    )}
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">User ID</span>
                      <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{user.id}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Registration Date</span>
                      <span className="text-gray-900">{new Date(user.created_at).toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account Status</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-bold text-blue-800 mb-3">📸 Photography Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-600">Photos Uploaded</span>
                        <span className="font-bold text-blue-800">0 photos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Albums</span>
                        <span className="font-bold text-blue-800">0 albums</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Likes Received</span>
                        <span className="font-bold text-blue-800">0 likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;