// ─── src/App.tsx ──────────────────────────────────────────────────────────────
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/projects.css";
import "./styles/profile.css";
import "./styles/calendar.css";

// ── Providers ─────────────────────────────────────────────────────────────────

import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import { SessionProvider } from "./context/SessionContext";
import { ProfileProvider } from "./context/ProfileContexts";
// ── Páginas ───────────────────────────────────────────────────────────────────
import { AcademicPage } from "./pages/AcademicPage";
import { CalendarPage } from "./pages/CalendarPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SearchPage } from "./pages/SearchPage";
import { SportsPage } from "./pages/SportsPage";

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ProjectProvider>
          <SessionProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />
                <Route
                  path="/login"
                  element={<LoginPage />}
                />
                <Route
                  path="/register"
                  element={<RegisterPage />}
                />
                <Route
                  path="/home"
                  element={<HomePage />}
                />
                <Route
                  path="/academic"
                  element={<AcademicPage />}
                />
                <Route
                  path="/sports"
                  element={<SportsPage />}
                />
                <Route
                  path="/projects"
                  element={<ProjectsPage />}
                />
                <Route
                  path="/profile"
                  element={<ProfilePage />}
                />
                <Route
                  path="/calendar"
                  element={<CalendarPage />}
                />
                <Route
                  path="/search"
                  element={<SearchPage />}
                />
                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />
              </Routes>
            </BrowserRouter>
          </SessionProvider>
        </ProjectProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
export default App;