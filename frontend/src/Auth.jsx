import React, { useState } from 'react';
import axios from 'axios';
import { MdEmail, MdLock, MdShield } from 'react-icons/md';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const res = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
      
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        onAuthSuccess();
      } else {
        alert("Account Created! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Backend Connection Error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <MdShield className="text-blue-600 text-5xl mb-2" />
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {isLogin ? 'Secure Login' : 'Join Vision'}
          </h2>
          <p className="text-slate-500 text-sm">Protected by Smart Vision AI</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <MdEmail className="absolute left-3 top-3.5 text-slate-400 text-xl" />
            <input 
              type="email" placeholder="Email Address" 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
          </div>

          <div className="relative">
            <MdLock className="absolute left-3 top-3.5 text-slate-400 text-xl" />
            <input 
              type="password" placeholder="Password" 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-200">
            {isLogin ? <><FaSignInAlt /> Login</> : <><FaUserPlus /> Create Account</>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-sm">
          {isLogin ? "Don't have an account?" : "Already a member?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-bold ml-1 hover:underline underline-offset-4"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;