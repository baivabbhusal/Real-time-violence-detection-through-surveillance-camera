import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import {

  FiArrowRight,
  FiShield,
  FiActivity,

} from "react-icons/fi";

import API_BASE from "../services/api";


const LoginPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({

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
  // HANDLE LOGIN
  // ---------------------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await axios.post(

        `${API_BASE}/api/login`,

        formData

      );

      // SAVE TOKEN

      localStorage.setItem(

        "token",

        res.data.token

      );

      toast.success(
        "Access granted"
      );

      // GO HOME

      navigate("/home");

    }

    catch (err) {

      toast.error(

        err.response?.data?.message ||

        "Login failed"

      );
    }

    finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-[#071E22] text-white flex">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex w-1/2 border-r border-[#16343A] bg-[#071E22] items-center justify-center p-12 relative overflow-hidden">

        {/* GLOW */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(58,166,185,0.12),transparent_70%)]" />

        <div className="relative z-10 max-w-xl">

          {/* TOP */}

          <div className="flex items-center gap-4 mb-10">

            <div className="w-14 h-14 rounded-2xl bg-[#0D2A30] border border-[#1E3A40] flex items-center justify-center text-[#3AA6B9] text-2xl">

              <FiShield />

            </div>

            <div>

              <h1 className="text-5xl font-semibold tracking-wide">

                Secure Monitoring

              </h1>

              <p className="text-slate-400 mt-2">

                Real-time incident detection system

              </p>

            </div>

          </div>

          {/* DESCRIPTION */}

          <h2 className="text-4xl leading-tight font-semibold mb-8">

            Smarter monitoring for
            safer environments.

          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-10">

            Access live monitoring streams,
            incident reports, and intelligent
            activity detection tools designed
            for modern security operations.

          </p>

          {/* CARDS */}

          <div className="grid grid-cols-2 gap-5">

            {/* CARD */}

            <div className="bg-[#0D2A30] border border-[#16343A] rounded-3xl p-6">

              <div className="w-12 h-12 rounded-2xl bg-[#071E22] border border-[#1E3A40] flex items-center justify-center text-[#3AA6B9] text-xl mb-5">

                <FiActivity />

              </div>

              <h3 className="text-xl font-semibold mb-3">

                Activity Monitoring

              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">

                Detect suspicious activities
                in real time.

              </p>

            </div>

            {/* CARD */}

            <div className="bg-[#0D2A30] border border-[#16343A] rounded-3xl p-6">

              <div className="w-12 h-12 rounded-2xl bg-[#071E22] border border-[#1E3A40] flex items-center justify-center text-[#3AA6B9] text-xl mb-5">

                <FiShield />

              </div>

              <h3 className="text-xl font-semibold mb-3">

                Incident Security

              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">

                Automated alerts and evidence
                management system.

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#08191D]">

        <div className="w-full max-w-md">

          {/* TOP */}

          <div className="mb-10">

            <p className="text-[#3AA6B9] font-medium mb-3">

              Welcome Back

            </p>

            <h2 className="text-5xl font-semibold mb-4 leading-tight">

              Sign in to continue monitoring

            </h2>

            <p className="text-slate-400 leading-relaxed">

              Enter your credentials to access
              the monitoring dashboard and
              incident management tools.

            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* EMAIL */}

            <div>

              <label className="block mb-3 text-slate-300">

                Email Address

              </label>

              <input

                type="email"

                name="email"

                value={formData.email}

                onChange={handleChange}

                required

                className="w-full bg-[#0D2A30] border border-[#16343A] rounded-2xl px-5 py-4 outline-none focus:border-[#3AA6B9] transition"

              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block mb-3 text-slate-300">

                Password

              </label>

              <input

                type="password"

                name="password"

                value={formData.password}

                onChange={handleChange}

                required

                className="w-full bg-[#0D2A30] border border-[#16343A] rounded-2xl px-5 py-4 outline-none focus:border-[#3AA6B9] transition"

              />

            </div>

            {/* BUTTON */}

            <button

              type="submit"

              disabled={loading}

              className="w-full bg-[#3AA6B9] hover:opacity-90 transition rounded-2xl py-4 font-semibold text-black text-lg flex items-center justify-center gap-3"

            >

              {loading
                ? "Signing In..."
                : "Access Dashboard"}

              <FiArrowRight />

            </button>

          </form>

          {/* FOOTER */}

          <div className="mt-8 text-slate-400">

            Don’t have an account?{" "}

            <Link

              to="/register"

              className="text-[#3AA6B9] hover:text-white transition"

            >

              Create account

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginPage;