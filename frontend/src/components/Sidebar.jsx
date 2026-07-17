import {

  FiHome,
  FiCamera,
  FiAlertTriangle,
  FiLogOut,

} from "react-icons/fi";

import {

  Link,
  useLocation,
  useNavigate,

} from "react-router-dom";


const Sidebar = () => {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const links = [

    {
      name: "Home",
      path: "/home",
      icon: <FiHome />,
    },

    {
      name: "Detection",
      path: "/detect",
      icon: <FiCamera />,
    },

    {
      name: "Alerts",
      path: "/alerts",
      icon: <FiAlertTriangle />,
    },

  ];

  // ---------------------------------------
  // LOGOUT
  // ---------------------------------------

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    navigate("/login");
  };

  return (

    <div className="w-72 bg-[#071E22] border-r border-[#16343A] min-h-screen flex flex-col">

      {/* LOGO */}

      <div className="px-8 py-10 border-b border-[#16343A]">

        <h1 className="text-3xl font-bold tracking-wide text-white">

          VisionGuard

        </h1>

        <p className="text-sm text-slate-400 mt-2 leading-relaxed">

          AI-powered surveillance and
          violence detection platform.

        </p>

      </div>

      {/* NAVIGATION */}

      <div className="flex-1 px-5 py-8">

        <div className="space-y-3">

          {links.map((link) => {

            const isActive =

              location.pathname ===
              link.path;

            return (

              <Link

                key={link.name}

                to={link.path}

                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 border ${

                  isActive

                    ? "bg-[#0D2A30] border-[#3AA6B9] text-white shadow-lg"

                    : "border-transparent text-slate-300 hover:bg-[#0D2A30] hover:text-white"

                }`}

              >

                <div className="text-xl">

                  {link.icon}

                </div>

                <span className="font-medium">

                  {link.name}

                </span>

              </Link>

            );
          })}

        </div>

      </div>

      {/* FOOTER */}

      <div className="p-5 border-t border-[#16343A]">

        <div className="bg-[#0D2A30] rounded-2xl p-5 border border-[#16343A] mb-4">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

            <span className="text-sm font-semibold text-green-400">

              SYSTEM ACTIVE

            </span>

          </div>

          <p className="text-sm text-slate-400 leading-relaxed">

            Monitoring CCTV streams and
            analyzing suspicious activities
            in real time.

          </p>

        </div>

        {/* LOGOUT */}

        <button

          onClick={handleLogout}

          className="w-full flex items-center justify-center gap-3 bg-[#0D2A30] hover:bg-[#12343B] transition px-5 py-4 rounded-2xl text-slate-300 border border-[#16343A]"

        >

          <FiLogOut />

          Logout

        </button>

      </div>

    </div>
  );
};

export default Sidebar;