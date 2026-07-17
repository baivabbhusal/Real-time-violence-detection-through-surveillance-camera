import { useEffect, useState } from "react";

import axios from "axios";

import {
  FiCamera,
  FiActivity,
  FiAlertTriangle,
  FiShield,
} from "react-icons/fi";

import Sidebar from "../components/Sidebar";

import API_BASE from "../services/api";

const DashboardPage = () => {
  const [aiRunning, setAiRunning] = useState(false);

  const [confidence, setConfidence] = useState(0);

  const [isViolent, setIsViolent] = useState(false);

  // ---------------------------------------
  // START MONITORING
  // ---------------------------------------

  const startDetection = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE}/api/start-ai`,

        {},

        {
          headers: {
            Authorization: token,
          },
        },
      );

      setAiRunning(true);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------------
  // STOP MONITORING
  // ---------------------------------------

  const stopDetection = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE}/api/stop-ai`,

        {},

        {
          headers: {
            Authorization: token,
          },
        },
      );

      setAiRunning(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------------
  // FETCH STATUS
  // ---------------------------------------

  useEffect(() => {
    let interval;

    // ---------------------------------------
    // FETCH STATUS
    // ---------------------------------------

    if (aiRunning) {
      interval = setInterval(async () => {
        try {
          const token = localStorage.getItem("token");

          const res = await axios.get(
            `${API_BASE}/api/status`,

            {
              headers: {
                Authorization: token,
              },
            },
          );

          setConfidence(res.data.confidence || 0);

          setIsViolent(res.data.is_violent);
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    }

    // ---------------------------------------
    // CLEANUP
    // ---------------------------------------

    return async () => {
      clearInterval(interval);

      // AUTO STOP CAMERA

      if (aiRunning) {
        try {
          const token = localStorage.getItem("token");

          await axios.post(
            `${API_BASE}/api/stop-ai`,

            {},

            {
              headers: {
                Authorization: token,
              },
            },
          );

          console.log("Camera stopped on page exit.");
        } catch (err) {
          console.error(err);
        }
      }
    };
  }, [aiRunning]);

  return (
    <div className="flex min-h-screen bg-[#071E22] text-white">
      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <div className="flex-1 overflow-auto">
        {/* HEADER */}

        <header className="h-24 border-b border-[#16343A] bg-[#071E22]/95 backdrop-blur-xl flex items-center justify-between px-12 sticky top-0 z-50">
          {/* LEFT */}

          <div>
            <h1 className="text-2xl font-semibold">Monitoring Dashboard</h1>

            <p className="text-slate-400 text-sm mt-1">
              Live stream monitoring and activity analysis
            </p>
          </div>

          {/* STATUS */}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#0D2A30] border border-[#16343A] px-5 py-3 rounded-2xl">
              <div
                className={`w-3 h-3 rounded-full ${
                  aiRunning ? "bg-green-500 animate-pulse" : "bg-slate-500"
                }`}
              />

              <span className="text-sm text-slate-300">
                {aiRunning ? "Monitoring Active" : "Monitoring Offline"}
              </span>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div className="p-12">
          {/* TOP SECTION */}

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            {/* CAMERA */}

            <div className="lg:col-span-2 bg-[#0D2A30] border border-[#16343A] rounded-[32px] overflow-hidden">
              {/* TOP */}

              <div className="flex items-center justify-between px-8 py-6 border-b border-[#16343A]">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">
                    Live Monitoring Feed
                  </h2>

                  <p className="text-slate-400">
                    Real-time video stream analysis
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      aiRunning ? "bg-green-500 animate-pulse" : "bg-slate-500"
                    }`}
                  />

                  <span className="text-slate-300 text-sm">
                    {aiRunning ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>

              {/* VIDEO */}

              <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                {aiRunning ? (
                  <img
                    src={`${API_BASE}/api/video-feed`}
                    alt="Video Feed"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-[#071E22] border border-[#16343A] flex items-center justify-center text-[#3AA6B9] text-4xl mx-auto mb-6">
                      <FiCamera />
                    </div>

                    <h3 className="text-2xl font-semibold mb-3">
                      Monitoring Inactive
                    </h3>

                    <p className="text-slate-400">
                      Start monitoring to begin analyzing live streams.
                    </p>
                  </div>
                )}
              </div>

              {/* BUTTONS */}

              <div className="p-8 flex gap-5">
                {!aiRunning ? (
                  <button
                    onClick={startDetection}
                    className="bg-[#3AA6B9] hover:opacity-90 transition text-black px-8 py-4 rounded-2xl font-semibold"
                  >
                    Start Monitoring
                  </button>
                ) : (
                  <button
                    onClick={stopDetection}
                    className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition text-red-400 px-8 py-4 rounded-2xl font-semibold"
                  >
                    Stop Monitoring
                  </button>
                )}
              </div>
            </div>

            {/* SIDE PANEL */}

            <div className="space-y-8">
              {/* STATUS */}

              <div className="bg-[#0D2A30] border border-[#16343A] rounded-[32px] p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#071E22] border border-[#16343A] flex items-center justify-center text-[#3AA6B9] text-2xl">
                    <FiActivity />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">Detection Status</h3>

                    <p className="text-slate-400 text-sm">
                      Activity confidence tracking
                    </p>
                  </div>
                </div>

                {/* CONFIDENCE */}

                <div className="mb-6">
                  <div className="flex justify-between mb-3">
                    <span className="text-slate-300">Confidence</span>

                    <span className="font-semibold text-[#3AA6B9]">
                      {(confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-[#071E22] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isViolent ? "bg-red-500" : "bg-[#3AA6B9]"
                      }`}
                      style={{
                        width: `${confidence * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* RESULT */}

                <div
                  className={`rounded-2xl p-5 border ${
                    isViolent
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-green-500/10 border-green-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {isViolent ? (
                      <FiAlertTriangle className="text-red-400 text-xl" />
                    ) : (
                      <FiShield className="text-green-400 text-xl" />
                    )}

                    <span
                      className={`font-semibold ${
                        isViolent ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {isViolent
                        ? "Suspicious Activity Detected"
                        : "Environment Normal"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {isViolent
                      ? "Potential violent activity detected in live stream."
                      : "No suspicious activity currently detected."}
                  </p>
                </div>
              </div>

              {/* INFO */}

              <div className="bg-[#0D2A30] border border-[#16343A] rounded-[32px] p-8">
                <h3 className="text-2xl font-semibold mb-5">
                  Monitoring Overview
                </h3>

                <p className="text-slate-400 leading-relaxed mb-6">
                  The monitoring system continuously analyzes live video streams
                  and evaluates activity patterns to identify suspicious
                  incidents.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#3AA6B9]" />

                    <span className="text-slate-300">
                      Real-time activity analysis
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#3AA6B9]" />

                    <span className="text-slate-300">
                      Automated alert system
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#3AA6B9]" />

                    <span className="text-slate-300">
                      Evidence and incident tracking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
