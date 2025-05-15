'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    email: 'peter@example.com',
    password: 'password123',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate successful login and redirect
    try {
      // For demo purposes, we'll just redirect directly
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left section - Purple gradient with information */}
      <div className="hidden lg:flex lg:w-3/5 2xl:w-2/3 bg-gradient-to-br from-purple-600 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots pattern-purple-500 pattern-bg-transparent pattern-opacity-20 pattern-size-6"></div>
        
        <div className="flex flex-col items-center justify-center px-12 py-24 relative z-10 w-full max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-tight mb-6">Currency Futures<br />Arbitrage Platform</h1>
          <p className="text-xl text-purple-100 text-center max-w-3xl mb-12">Advanced yield curve modeling and analysis powered by QuantLib</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Yield Curve Building</h3>
              <p className="text-purple-100">Create and visualize sophisticated yield curves using Nelson-Siegel-Svensson and other QuantLib models.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Cross-Currency Analysis</h3>
              <p className="text-purple-100">Analyze implied interest rate differentials and identify arbitrage opportunities across global markets.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Monitoring</h3>
              <p className="text-purple-100">Track changes in yield curves and basis spreads with advanced visualization tools.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Portfolio Integration</h3>
              <p className="text-purple-100">Seamlessly integrate trading signals with your portfolio management system.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right section - Login form */}
      <div className="w-full lg:w-2/5 2xl:w-1/3 flex items-center justify-center p-6 lg:p-10 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access the platform</p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formState.email}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-base"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formState.password}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-base"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">Forgot password?</a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-1">Demo account credentials:</p>
              <p className="text-sm font-medium text-gray-800">peter@example.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}