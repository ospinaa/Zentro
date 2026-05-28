// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import './styles/auth.css'
import './styles/dashboard.css'
import './styles/projects.css'
import './styles/profile.css'
import './styles/calendar.css'
import './styles/events.css'   // ← new unified events styles
import './styles/home.css'     // ← new home page styles
import "./styles/academic.css";
import "./styles/sports.css";

import { AuthProvider }    from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContexts'
import { ProjectProvider } from './context/ProjectContext'
import { SessionProvider } from './context/SessionContext'
import { AcademicProvider } from './context/AcademicContext'
import { SportsProvider }  from './context/SportsContext'

import { ProtectedRoute } from './components/ProtectedRoute'

import { LoginPage }    from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage }     from './pages/HomePage'
import { AcademicPage } from './pages/AcademicPage'
import { SportsPage }   from './pages/SportsPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProfilePage }  from './pages/ProfilePage'
import { CalendarPage } from './pages/CalendarPage'
import { SearchPage }   from './pages/SearchPage'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './styles/auth.css'
import './styles/dashboard.css'
import { AcademicPage } from './pages/AcademicPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilePage } from './pages/ProfilePage'
import { SportsPage } from './pages/SportsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/academic" element={<AcademicPage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )

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


import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import { SessionProvider } from "./context/SessionContext";
import { ProfileProvider } from "./context/ProfileContexts";

import { AcademicProvider } from "./context/AcademicContext";
import { SportsProvider } from "./context/SportsContext";


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
            <AcademicProvider>
              <SportsProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public */}
                    <Route path="/"        element={<Navigate to="/login" replace />} />
                    <Route path="/login"   element={<LoginPage />} />
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
        </ProjectProvider>
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App