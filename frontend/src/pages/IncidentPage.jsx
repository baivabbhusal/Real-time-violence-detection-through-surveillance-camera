import { useEffect, useState } from "react";

import axios from "axios";

import { FiAlertTriangle, FiClock, FiShield, FiImage } from "react-icons/fi";

import Sidebar from "../components/Sidebar";

import API_BASE from "../services/api";

const IncidentPage = () => {
  const [incidents, setIncidents] = useState([]);

  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // FETCH INCIDENTS
  // ---------------------------------------

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE}/api/incidents`,

          {
            headers: {
              Authorization: token,
            },
          },
        );

        setIncidents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

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
            <h1 className="text-2xl font-semibold">Incident History</h1>

            <p className="text-slate-400 text-sm mt-1">
              Recorded incidents and evidence tracking
            </p>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#0D2A30] border border-[#16343A] px-5 py-3 rounded-2xl">
              <FiShield className="text-[#3AA6B9]" />

              <span className="text-slate-300 text-sm">
                Incident Monitoring Active
              </span>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div className="p-12">
          {/* TOP SECTION */}

          <div className="mb-14">
            <div className="max-w-4xl">
              <p className="text-[#3AA6B9] font-semibold uppercase tracking-wide mb-4">
                Security Incident Records
              </p>

              <h1 className="text-5xl font-semibold leading-tight mb-6">
                Review Historical Activity & Detection Evidence
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed">
                Monitor detected incidents, review captured evidence, analyze
                confidence scores, and maintain historical activity records for
                security operations.
              </p>
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-[#16343A] border-t-[#3AA6B9] rounded-full animate-spin mx-auto mb-6" />

                <p className="text-slate-400 text-lg">
                  Loading incident records...
                </p>
              </div>
            </div>
          ) : incidents.length === 0 ? (
            <div className="bg-[#0D2A30] border border-[#16343A] rounded-[32px] p-16 text-center">
              <div className="w-24 h-24 rounded-full bg-[#071E22] border border-[#16343A] flex items-center justify-center text-[#3AA6B9] text-4xl mx-auto mb-8">
                <FiImage />
              </div>

              <h2 className="text-3xl font-semibold mb-4">
                No Incidents Recorded
              </h2>

              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Detected incidents and captured evidence will appear here once
                suspicious activities are identified.
              </p>
            </div>
          ) : (
            <>
              {/* STATS */}

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* CARD */}

                <div className="bg-[#0D2A30] border border-[#16343A] rounded-[28px] p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-slate-400 mb-2">Total Incidents</p>

                      <h2 className="text-5xl font-semibold">
                        {incidents.length}
                      </h2>
                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-[#071E22] border border-[#16343A] flex items-center justify-center text-[#3AA6B9] text-2xl">
                      <FiAlertTriangle />
                    </div>
                  </div>
                </div>

                {/* CARD */}

                <div className="bg-[#0D2A30] border border-[#16343A] rounded-[28px] p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-slate-400 mb-2">Latest Detection</p>

                      <h2 className="text-xl font-semibold leading-relaxed">
                        {new Date(incidents[0]?.timestamp).toLocaleDateString()}
                      </h2>
                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-[#071E22] border border-[#16343A] flex items-center justify-center text-[#3AA6B9] text-2xl">
                      <FiClock />
                    </div>
                  </div>
                </div>

                {/* CARD */}

                <div className="bg-[#0D2A30] border border-[#16343A] rounded-[28px] p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-slate-400 mb-2">Monitoring Status</p>

                      <h2 className="text-2xl font-semibold text-green-400">
                        Active
                      </h2>
                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-[#071E22] border border-[#16343A] flex items-center justify-center text-green-400 text-2xl">
                      <FiShield />
                    </div>
                  </div>
                </div>
              </div>

              {/* INCIDENT GRID */}

              <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-10">
                {incidents.map((incident) => (
                  <div
                    key={incident._id}
                    className="bg-[#0D2A30] border border-[#16343A] rounded-[32px] overflow-hidden hover:border-[#3AA6B9] transition duration-300 group"
                  >
                    {/* IMAGE */}

                    <div className="relative overflow-hidden">
                      <img
                        src={`http://127.0.0.1:5000/${incident.image}`}
                        alt="Incident"
                        className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                      />

                      {/* OVERLAY */}

                      <div className="absolute top-5 left-5 bg-red-500/90 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        <FiAlertTriangle />
                        Incident Detected
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="p-8">
                      {/* TITLE */}

                      <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-3">
                          Suspicious Activity
                        </h2>

                        <p className="text-slate-400 leading-relaxed">
                          Activity pattern exceeded monitoring threshold and
                          triggered an incident alert.
                        </p>
                      </div>

                      {/* CONFIDENCE */}

                      <div className="mb-6">
                        <div className="flex justify-between mb-3">
                          <span className="text-slate-300">
                            Detection Confidence
                          </span>

                          <span className="font-semibold text-[#3AA6B9]">
                            {(incident.confidence * 100).toFixed(1)}%
                          </span>
                        </div>

                        <div className="w-full h-3 rounded-full bg-[#071E22] overflow-hidden">
                          <div
                            className="h-full bg-red-500 transition-all duration-500"
                            style={{
                              width: `${incident.confidence * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* FOOTER */}

                      <div className="flex items-center justify-between pt-6 border-t border-[#16343A]">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">
                            Recorded At
                          </p>

                          <p className="text-slate-300 text-sm">
                            {new Date(incident.timestamp).toLocaleString()}
                          </p>
                        </div>

                        <div className="w-12 h-12 rounded-2xl bg-[#071E22] border border-[#16343A] flex items-center justify-center text-red-400">
                          <FiAlertTriangle />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentPage;
