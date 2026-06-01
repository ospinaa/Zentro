// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/projects.css";
import "./styles/profile.css";
import "./styles/calendar.css";
import "./styles/events.css";
import "./styles/home.css";
import "./styles/academic.css";
import "./styles/sports.css";
import "./styles/Projects collaborative.css";
import "./styles/imagePicker.css";

import { AuthProvider }    from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContexts";
import { CollaborativeProjectProvider } from "./context/Collaborativeprojectcontext";
import { SessionProvider } from "./context/SessionContext";
import { AcademicProvider } from "./context/AcademicContext";
import { SportsProvider }  from "./context/SportsContext";

import { ProtectedRoute } from "./components/ProtectedRoute";

import { LoginPage }    from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage }     from "./pages/HomePage";
import { AcademicPage } from "./pages/AcademicPage";
import { SportsPage }   from "./pages/SportsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProfilePage }  from "./pages/ProfilePage";
import { CalendarPage } from "./pages/CalendarPage";
import { SearchPage }   from "./pages/SearchPage";

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <CollaborativeProjectProvider>
          <SessionProvider>
            <AcademicProvider>
              <SportsProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public */}
                    <Route path="/"         element={<Navigate to="/login" replace />} />
                    <Route path="/login"    element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected */}
                    <Route path="/home"     element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                    <Route path="/academic" element={<ProtectedRoute><AcademicPage /></ProtectedRoute>} />
                    <Route path="/sports"   element={<ProtectedRoute><SportsPage /></ProtectedRoute>} />
                    <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
                    <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                    <Route path="/search"   element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </BrowserRouter>
              </SportsProvider>
            </AcademicProvider>
          </SessionProvider>
        </CollaborativeProjectProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;