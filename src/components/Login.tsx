import Navbar from './Navbar';

const Login = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/70 backdrop-blur rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <div className="mt-2 text-right">
                <a href="/forgot-password" className="text-sm text-gray-700 hover:text-blue-600 underline underline-offset-4">Forgot password?</a>
              </div>
            </div>
            <button
              type="button"
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              Sign in
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            <a href="/register" className="text-blue-600 hover:text-blue-700 underline underline-offset-4">Create account</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;

