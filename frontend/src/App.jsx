import {

  Routes,
  Route,
  Navigate,

} from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import RegisterPage from "./pages/RegisterPage";

import HomePage from "./pages/HomePage";

import DashboardPage from "./pages/DashboardPage";

import IncidentPage from "./pages/IncidentPage";


function App() {

  const token =
    localStorage.getItem("token");

  return (

    <Routes>

      {/* LOGIN */}

      <Route

        path="/login"

        element={

          <LoginPage
            onLogin={() =>
              window.location.reload()
            }
          />

        }

      />

      {/* REGISTER */}

      <Route

        path="/register"

        element={<RegisterPage />}

      />

      {/* HOME */}

      <Route

        path="/home"

        element={

          token

            ? <HomePage />

            : <Navigate to="/login" />

        }

      />

      {/* DETECT */}

      <Route

        path="/detect"

        element={

          token

            ? (

              <DashboardPage

                onLogout={() =>
                  window.location.reload()
                }

              />

            )

            : <Navigate to="/login" />

        }

      />

      {/* ALERTS */}

      <Route

        path="/alerts"

        element={

          token

            ? <IncidentPage />

            : <Navigate to="/login" />

        }

      />

      {/* DEFAULT */}

      <Route

        path="*"

        element={

          <Navigate
            to={
              token
                ? "/home"
                : "/login"
            }
          />

        }

      />

    </Routes>

  );
}

export default App;