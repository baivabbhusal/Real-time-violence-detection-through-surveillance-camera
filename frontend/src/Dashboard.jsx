import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaVideo, FaVideoSlash, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Dashboard = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ is_violent: false, confidence: 0 });

  // 1. Poll the AI status every 1 second if streaming is active
  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/status');
          setStatus(res.data);
        } catch (err) {
          console.error("Failed to fetch AI status", err);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  // 2. Start the Camera
  const toggleCamera = async () => {
  const token = localStorage.getItem('token');
  
  if (!isStreaming) {
    // START LOGIC
    setLoading(true);
    await axios.post('http://localhost:5000/api/start-ai', {}, {
      headers: { Authorization: token }
    });
    setIsStreaming(true);
    setLoading(false);
  } else {
    // STOP LOGIC (This is what was missing!)
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/stop-ai', {}, {
        headers: { Authorization: token }
      });
      setIsStreaming(false);
      setStatus({ is_violent: false, confidence: 0 }); // Reset UI numbers
    } catch (err) {
      console.error("Failed to stop camera properly", err);
    }
    setLoading(false);
  }
};

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Live Monitoring</h1>
          <p className="text-slate-400">Neural Engine: {isStreaming ? 'Active' : 'Standby'}</p>
        </div>
        
        <button 
          onClick={toggleCamera}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            isStreaming 
            ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' 
            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'
          }`}
        >
          {loading ? 'Starting...' : isStreaming ? <><FaVideoSlash /> Stop System</> : <><FaVideo /> Initialize AI Camera</>}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* VIDEO FEED COLUMN */}
        <div className="lg:col-span-2 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl relative">
          {isStreaming ? (
            <img 
              src="http://localhost:5000/api/video-feed" 
              alt="Live AI Feed" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center text-slate-500">
              <FaVideo size={48} className="mb-4 opacity-20" />
              <p>Camera is offline</p>
            </div>
          )}
          
          {/* Overlay Alert */}
          {status.is_violent && (
            <div className="absolute top-0 left-0 w-full bg-red-600/90 text-white py-4 text-center font-black animate-pulse flex items-center justify-center gap-2">
              <FaExclamationTriangle /> VIOLENCE DETECTED - SECURITY ALERTED
            </div>
          )}
        </div>

        {/* STATUS COLUMN */}
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${status.is_violent ? 'bg-red-500/10 border-red-500/50' : 'bg-slate-800 border-slate-700'}`}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Threat Level</h3>
            <div className="flex items-center gap-3">
              {status.is_violent ? (
                <FaExclamationTriangle className="text-red-500 text-3xl" />
              ) : (
                <FaCheckCircle className="text-emerald-500 text-3xl" />
              )}
              <span className={`text-2xl font-bold ${status.is_violent ? 'text-red-500' : 'text-emerald-500'}`}>
                {status.is_violent ? 'CRITICAL' : 'SECURE'}
              </span>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">AI Confidence</h3>
            <div className="text-4xl font-mono font-bold text-blue-400">
              {(status.confidence * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-500" 
                style={{ width: `${status.confidence * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;