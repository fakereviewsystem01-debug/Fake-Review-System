import React, { useState } from 'react';
import {
  Shield,
  Lock,
  User as UserIcon,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { signIn, signUp } from '../services/storageService';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const user = signIn(email, password);
        onLogin(user);
      } else {
        if (!name.trim()) throw new Error('Name is required');

        const user = signUp(email, password, name);
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary-600/20 p-2.5 sm:p-3 rounded-full">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary-500" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <p className="text-slate-400 text-center text-sm sm:text-base mb-6 sm:mb-8">
            Fake Review System
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 sm:top-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-sm sm:text-base"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 sm:top-3.5 text-slate-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-sm sm:text-base"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 sm:top-3.5 text-slate-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-sm sm:text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 text-sm sm:text-base"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-xs sm:text-sm">
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-primary-500 hover:text-primary-400 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
