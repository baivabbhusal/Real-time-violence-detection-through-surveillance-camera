import { useNavigate } from "react-router-dom";

import {

  FiArrowRight,
  FiShield,
  FiCamera,
  FiAlertTriangle,
  FiActivity,
  FiMonitor,

} from "react-icons/fi";

import Sidebar from "../components/Sidebar";


const HomePage = () => {

  const navigate = useNavigate();

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

            <h1 className="text-2xl font-semibold tracking-wide">

              Security Monitoring Platform

            </h1>

            <p className="text-slate-400 text-sm mt-1">

              Real-time incident detection and monitoring

            </p>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">

            {/* STATUS */}

            <div className="hidden md:flex items-center gap-3 bg-[#0D2A30] border border-[#16343A] px-5 py-3 rounded-2xl">

              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

              <span className="text-sm text-slate-300">

                Monitoring Active

              </span>

            </div>

            {/* ALERTS */}

            <button

              onClick={() =>
                navigate("/alerts")
              }

              className="px-6 py-3 rounded-2xl border border-[#1E3A40] text-slate-300 hover:bg-[#0D2A30] transition"

            >

              Alerts

            </button>

            {/* START */}

            <button

              onClick={() =>
                navigate("/detect")
              }

              className="px-6 py-3 rounded-2xl bg-[#3AA6B9] text-black font-semibold hover:opacity-90 transition flex items-center gap-2"

            >

              Start Monitoring

              <FiArrowRight />

            </button>

            {/* LOGOUT */}

            <button

              onClick={() => {

                localStorage.removeItem(
                  "token"
                );

                navigate("/login");

              }}

              className="px-6 py-3 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"

            >

              Logout

            </button>

          </div>

        </header>

        {/* HERO */}

        <section className="px-12 py-20 border-b border-[#16343A]">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}

            <div>

              <div className="inline-flex items-center gap-3 bg-[#0D2A30] border border-[#1E3A40] px-5 py-3 rounded-full text-sm text-slate-300 mb-8">

                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

                Live Surveillance Active

              </div>

              <h1 className="text-6xl leading-tight font-semibold mb-8 max-w-3xl">

                Advanced Monitoring &
                Violence Incident
                Detection System

              </h1>

              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mb-10">

                Intelligent real-time monitoring,
                automated incident alerts,
                evidence tracking, and activity
                analysis for modern security
                environments.

                The platform continuously analyzes
                live video streams to identify
                suspicious activities and assist
                with faster incident response.

              </p>

              <div className="flex gap-5">

                <button

                  onClick={() =>
                    navigate("/detect")
                  }

                  className="bg-[#3AA6B9] hover:opacity-90 transition text-black px-8 py-4 rounded-2xl font-semibold flex items-center gap-3"

                >

                  Start Monitoring

                  <FiArrowRight />

                </button>

                <button

                  onClick={() =>
                    navigate("/alerts")
                  }

                  className="border border-[#1E3A40] hover:bg-[#0D2A30] transition px-8 py-4 rounded-2xl text-slate-300"

                >

                  View Incidents

                </button>

              </div>

            </div>

            {/* RIGHT */}

            <div className="relative">

              {/* GLOW */}

              <div className="absolute inset-0 bg-[#3AA6B9]/10 blur-3xl rounded-full" />

              {/* IMAGE */}

              <img

                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop"

                alt="Monitoring"

                className="relative z-10 rounded-[32px] border border-[#16343A] shadow-2xl"

              />

              {/* FLOATING CARD */}

              <div className="absolute bottom-6 left-6 z-20 bg-[#071E22]/90 backdrop-blur-xl border border-[#1E3A40] rounded-2xl p-5 w-72">

                <div className="flex items-center gap-3 mb-4">

                  <FiMonitor className="text-[#3AA6B9] text-2xl" />

                  <div>

                    <h3 className="font-semibold">

                      Monitoring Status

                    </h3>

                    <p className="text-sm text-slate-400">

                      Real-time activity tracking

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

                  <span className="text-green-400 text-sm">

                    Stream Connected

                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="px-12 py-20">

          <div className="mb-16 max-w-3xl">

            <p className="text-[#3AA6B9] font-semibold tracking-wide uppercase mb-4">

              Platform Features

            </p>

            <h2 className="text-5xl font-semibold leading-tight mb-6">

              Intelligent Monitoring For
              Modern Security Operations

            </h2>

            <p className="text-slate-400 text-lg leading-relaxed">

              Built for continuous monitoring,
              automated incident detection,
              and faster response management.

            </p>

          </div>

          {/* CARDS */}

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

            {/* CARD */}

            <div className="bg-[#0D2A30] border border-[#16343A] rounded-[28px] p-8 hover:border-[#3AA6B9] transition duration-300">

              <div className="w-16 h-16 rounded-2xl bg-[#071E22] border border-[#1E3A40] flex items-center justify-center text-2xl text-[#3AA6B9] mb-8">

                <FiCamera />

              </div>

              <h3 className="text-2xl font-semibold mb-5">

                Real-Time Monitoring

              </h3>

              <p className="text-slate-400 leading-relaxed">

                Monitor live streams and
                identify suspicious activities
                instantly.

              </p>

            </div>

            {/* CARD */}

            <div className="bg-[#0D2A30] border border-[#16343A] rounded-[28px] p-8 hover:border-[#3AA6B9] transition duration-300">

              <div className="w-16 h-16 rounded-2xl bg-[#071E22] border border-[#1E3A40] flex items-center justify-center text-2xl text-[#3AA6B9] mb-8">

                <FiAlertTriangle />

              </div>

              <h3 className="text-2xl font-semibold mb-5">

                Smart Alerts

              </h3>

              <p className="text-slate-400 leading-relaxed">

                Receive automated notifications
                during unusual activity events.

              </p>

            </div>

            {/* CARD */}

            <div className="bg-[#0D2A30] border border-[#16343A] rounded-[28px] p-8 hover:border-[#3AA6B9] transition duration-300">

              <div className="w-16 h-16 rounded-2xl bg-[#071E22] border border-[#1E3A40] flex items-center justify-center text-2xl text-[#3AA6B9] mb-8">

                <FiActivity />

              </div>

              <h3 className="text-2xl font-semibold mb-5">

                Activity Analysis

              </h3>

              <p className="text-slate-400 leading-relaxed">

                Analyze monitoring confidence
                and incident activity patterns.

              </p>

            </div>

            {/* CARD */}

            <div className="bg-[#0D2A30] border border-[#16343A] rounded-[28px] p-8 hover:border-[#3AA6B9] transition duration-300">

              <div className="w-16 h-16 rounded-2xl bg-[#071E22] border border-[#1E3A40] flex items-center justify-center text-2xl text-[#3AA6B9] mb-8">

                <FiShield />

              </div>

              <h3 className="text-2xl font-semibold mb-5">

                Incident Management

              </h3>

              <p className="text-slate-400 leading-relaxed">

                Store evidence screenshots
                and review historical incidents.

              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default HomePage;