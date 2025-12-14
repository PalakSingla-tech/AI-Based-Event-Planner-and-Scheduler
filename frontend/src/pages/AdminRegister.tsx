import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const params = new URLSearchParams({
      fullName: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: 'admin',
    });

      const response = await fetch(`http://localhost:8080/register?${params.toString()}`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ ${data.message || 'Registration successful!'}`);
        onNavigate('login');
      } else {
        const error = await response.text();
        setMessage(`❌ ${error || 'Registration failed'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Server unreachable. Please try again later.');
    } finally {
      setLoading(false);
    }
    console.log('Register submitted:', formData);
    toast.success("Registration successful!");

    // redirect to login page after a short delay
    setTimeout(() => {
      navigate('login');
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE – Gradient Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-350 to-teal-400 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"></div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white w-full">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="text-3xl font-bold">Eventura</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">Get Started with <br />your Admin Account</h1>
            <p className="text-lg text-white/90 mb-8">
              Sign up to organize events, manage users, and grow your planner network.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <img src="https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&w=300" className="rounded-xl shadow-lg opacity-90" />
              <img src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&w=300" className="rounded-xl shadow-lg opacity-90" />
              <img src="https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&w=300" className="rounded-xl shadow-lg opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE – Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-md border border-teal-500/30 rounded-3xl p-8 md:p-10 shadow-lg shadow-teal-500/10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="relative">
                <div className="absolute left-4 top-4 text-teal-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-teal-500/30 rounded-xl text-white placeholder-transparent focus:border-teal-500 outline-none transition-all"
                  placeholder="Full Name"
                  required
                />
                <label
                  htmlFor="name"
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                    focusedField === 'name' || formData.name
                      ? '-top-6 text-sm text-teal-400'
                      : 'top-4 text-white/50'
                  }`}
                >
                  Full Name
                </label>
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute left-4 top-4 text-teal-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-teal-500/30 rounded-xl text-white placeholder-transparent focus:border-teal-500 outline-none transition-all"
                  placeholder="Email Address"
                  required
                />
                <label
                  htmlFor="email"
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                    focusedField === 'email' || formData.email
                      ? '-top-6 text-sm text-teal-400'
                      : 'top-4 text-white/50'
                  }`}
                >
                  Email Address
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute left-4 top-4 text-teal-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border-2 border-teal-500/30 rounded-xl text-white placeholder-transparent focus:border-teal-500 outline-none transition-all"
                  placeholder="Password"
                  required
                />
                <label
                  htmlFor="password"
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                    focusedField === 'password' || formData.password
                      ? '-top-6 text-sm text-teal-400'
                      : 'top-4 text-white/50'
                  }`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-white/50 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <div className="absolute left-4 top-4 text-teal-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border-2 border-teal-500/30 rounded-xl text-white placeholder-transparent focus:border-teal-500 outline-none transition-all"
                  placeholder="Confirm Password"
                  required
                />
                <label
                  htmlFor="confirmPassword"
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                    focusedField === 'confirmPassword' || formData.confirmPassword
                      ? '-top-6 text-sm text-teal-400'
                      : 'top-4 text-white/50'
                  }`}
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-white/50 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 rounded border-2 border-teal-500/30 bg-white/5 checked:bg-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
                  required
                />
                <label htmlFor="terms" className="text-white/70 text-sm">
                  I agree to the{' '}
                  <button type="button" className="text-teal-400 hover:text-teal-300">Terms of Service</button>{' '}
                  and{' '}
                  <button type="button" className="text-teal-400 hover:text-teal-300">Privacy Policy</button>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit" 
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-lg hover:scale-105 transition-all shadow-lg shadow-teal-500/30"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-8">
              Already have an account?{' '}
              <button onClick={() => navigate('login')} className="text-teal-400 hover:text-teal-300 font-semibold">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
