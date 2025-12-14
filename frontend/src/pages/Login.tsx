import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams({
        email: formData.email,
        password: formData.password,
      });
      const response = await fetch(`${API_BASE_URL}/login?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      // Save user info and token (JWT)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userEmail', data.email);

      // Navigate to dashboard
      if (data.role === 'admin') {
        navigate('/adminDashboard');
        return;
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid email or password. Please try again.');
    }
    console.log('Login submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      {/* Left side with gradient background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAgMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNHYxMmMwIDIuMjA5IDEuNzkxIDQgNCA0czQtMS43OTEgNC00VjM0eiIvPjwvZz48L2c+PC9zdmc+')]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white w-full">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="text-3xl font-bold">Eventura</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Welcome Back to <br /> Eventura
            </h2>

            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Sign in to plan your perfect events, collaborate with planners, and create memorable experiences.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span>AI-Powered Event Suggestions</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span>Seamless Planner Collaboration</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span>Smart Scheduling & Tracking</span>
              </div>
            </div>

            <div className="mt-12">
              <img
                src="https://images.pexels.com/photos/1916824/pexels-photo-1916824.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Events"
                className="rounded-2xl shadow-2xl opacity-90"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right side (Login form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-white/10 p-8 md:p-10 shadow-xl dark:shadow-lg transition-all duration-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
              <p className="text-gray-600 dark:text-white/70">Access your personalized event dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <div className="absolute left-4 top-4 text-teal-600 dark:text-teal-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-teal-500/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal-500 transition-all"
                  placeholder="Email Address"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute left-4 top-4 text-teal-600 dark:text-teal-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-teal-500/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal-500 transition-all"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-gray-300 dark:border-teal-500/30 bg-white dark:bg-white/5 checked:bg-teal-500 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-gray-600 dark:text-white/70">Remember me</span>
                </label>
                <button type="button" className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 text-white font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-lg shadow-teal-500/20"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-white/70">
                Don’t have an account?{' '}
                <Link
                  to="/register"
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-semibold transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
              <p className="text-gray-400 dark:text-white/50 text-xs">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
