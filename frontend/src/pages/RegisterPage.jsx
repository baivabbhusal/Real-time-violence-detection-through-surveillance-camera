import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import API_BASE from "../services/api";


const RegisterPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({

      username: "",
      email: "",
      password: "",

    });

  const [loading, setLoading] =
    useState(false);

  // ---------------------------------------
  // HANDLE CHANGE
  // ---------------------------------------

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,

    });
  };

  // ---------------------------------------
  // HANDLE REGISTER
  // ---------------------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      await axios.post(

        `${API_BASE}/api/register`,

        formData

      );

      toast.success(
        "Registration successful"
      );

      navigate("/login");

    }

    catch (err) {

      toast.error(

        err.response?.data?.message ||

        "Registration failed"

      );
    }

    finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-black text-white flex">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#071E22] via-black to-[#0D1117] items-center justify-center p-10 relative overflow-hidden">

        {/* GLOW */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,30,34,0.4),transparent_70%)]" />

        <div className="relative z-10 max-w-lg">

          {/* LOGO */}

          <div className="mb-8 flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-[#071E22] border border-[#1B5964] flex items-center justify-center text-3xl shadow-2xl">

              🛡️

            </div>

            <div>

              <h1 className="text-5xl font-bold tracking-wide text-[#1B5964]">

                VisionGuard

              </h1>

              <p className="text-gray-400 mt-2">

                AI-Powered Security Monitoring

              </p>

            </div>

          </div>

          {/* FEATURE CARD */}

          <div className="bg-[#0D1117]/70 backdrop-blur-xl border border-[#1A2B32] rounded-3xl p-8 shadow-2xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-4 h-4 rounded-full bg-[#1B5964] animate-pulse" />

              <span className="text-[#1B5964] font-semibold">

                SMART SECURITY PLATFORM

              </span>

            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">

              <div className="bg-black/50 rounded-2xl p-5 border border-[#1A2B32]">

                <div className="text-4xl mb-3">

                  🚨

                </div>

                <h3 className="font-bold mb-2">

                  Smart Alerts

                </h3>

                <p className="text-sm text-gray-400">

                  Real-time email notifications.

                </p>

              </div>

              <div className="bg-black/50 rounded-2xl p-5 border border-[#1A2B32]">

                <div className="text-4xl mb-3">

                  📹

                </div>

                <h3 className="font-bold mb-2">

                  Live Detection

                </h3>

                <p className="text-sm text-gray-400">

                  AI-based violence monitoring.

                </p>

              </div>

            </div>

            <p className="text-gray-300 leading-relaxed">

              Create your account to access
              the VisionGuard surveillance dashboard
              and monitor incidents in real time.

            </p>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#0D1117]">

        <div className="w-full max-w-md bg-black border border-[#1A2B32] rounded-3xl shadow-2xl p-8">

          <h2 className="text-4xl font-bold mb-2">

            Create Account

          </h2>

          <p className="text-gray-400 mb-8">

            Register to access VisionGuard.

          </p>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* USERNAME */}

            <div>

              <label className="block mb-2 text-gray-300">

                Username

              </label>

              <input

                type="text"

                name="username"

                value={formData.username}

                onChange={handleChange}

                required

                className="w-full bg-[#071E22] border border-[#1A2B32] rounded-xl px-4 py-3 outline-none focus:border-[#1B5964]"

              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="block mb-2 text-gray-300">

                Email

              </label>

              <input

                type="email"

                name="email"

                value={formData.email}

                onChange={handleChange}

                required

                className="w-full bg-[#071E22] border border-[#1A2B32] rounded-xl px-4 py-3 outline-none focus:border-[#1B5964]"

              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block mb-2 text-gray-300">

                Password

              </label>

              <input

                type="password"

                name="password"

                value={formData.password}

                onChange={handleChange}

                required

                className="w-full bg-[#071E22] border border-[#1A2B32] rounded-xl px-4 py-3 outline-none focus:border-[#1B5964]"

              />

            </div>

            {/* BUTTON */}

            <button

              type="submit"

              disabled={loading}

              className="w-full bg-[#071E22] hover:bg-[#0A2A30] transition rounded-xl py-3 font-semibold text-lg border border-[#1B5964]"

            >

              {loading
                ? "Creating..."
                : "Register"}

            </button>

          </form>

          {/* FOOTER */}

          <div className="mt-6 text-center text-gray-400">

            Already have an account?{" "}

            <Link

              to="/login"

              className="text-[#1B5964] hover:text-[#2A7C8A]"

            >

              Login

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default RegisterPage;