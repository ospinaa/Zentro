import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { ProfileEditModal } from "../components/ProfileEditModal";

export interface SocialLink {
  id: string;
  platform:
    | "whatsapp"
    | "github"
    | "linkedin"
    | "discord"
    | "youtube"
    | "other";
  url: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
}

export interface ProfileData {
  name: string;
  bio: string;
  photo: string | null;
  tags: string[];
  socials: SocialLink[];
  services: Service[];
  sessions: Session[];
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const INITIAL: ProfileData = {
  name: "Tu Nombre",
  bio: "Escribe algo sobre ti...",
  photo: null,
  tags: ["DMI", "COM"],
  socials: [
    { id: uid(), platform: "github", url: "https://github.com" },
    { id: uid(), platform: "linkedin", url: "https://linkedin.com" },
  ],
  services: [
    {
      id: uid(),
      title: "Programación",
      description: "Principiantes y avanzados",
      icon: "",
    },
    {
      id: uid(),
      title: "Diseño",
      description: "Ilustraciones y edición",
      icon: "",
    },
  ],
  sessions: [
    {
      id: uid(),
      title: "Introducción a React",
      date: "20 de marzo",
      time: "15:00 pm",
    },
    {
      id: uid(),
      title: "Curso básico en Photoshop",
      date: "20 de marzo",
      time: "15:00 pm",
    },
  ],
};

const SOCIAL_META: Record<
  string,
  { label: string; color: string}
> = {
  whatsapp: { label: "WhatsApp", color: "#25d366" },
  github: { label: "GitHub", color: "#1a1a2e" },
  linkedin: { label: "LinkedIn", color: "#0a66c2" },
  discord: { label: "Discord", color: "#5865f2" },
  youtube: { label: "YouTube", color: "#ff0000" },
  other: { label: "Otro", color: "#6b7280" },
};


export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(INITIAL);
  const [editing, setEditing] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Perfil · Zentro";
  }, []);

  return (
    <DashboardLayout userInitials={profile.name.slice(0, 2).toUpperCase()}>
      <div className="pf-root">
        
        <button
          className="pf-sidebar-toggle"
          type="button"
          onClick={() => setMobileSidebarOpen((v) => !v)}
          aria-label="Menú"
        >
          ☰
        </button>

        
        {mobileSidebarOpen && (
          <div
            className="pf-sidebar-overlay"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <nav className="pf-sidebar" onClick={(e) => e.stopPropagation()}>
              <div className="pf-sidebar__avatar">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="avatar"
                    className="pf-sidebar__img"
                  />
                ) : (
                  <span className="pf-sidebar__initials">
                    {profile.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              {[
                { label: "Home", icon: "", href: "/home" },
                { label: "Actividades", icon: "", href: "#" },
                { label: "Sesiones", icon: "", href: "#" },
                { label: "Monitores", icon: "", href: "#" },
                { label: "Perfil", icon: "", href: "/profile" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="pf-sidebar__item"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <span className="pf-sidebar__icon">{item.icon}</span>
                  <span className="pf-sidebar__label">{item.label}</span>
                </a>
              ))}
              <button className="pf-sidebar__add" type="button">
                +
              </button>
            </nav>
          </div>
        )}

        
        <div className="pf-card pf-header-card">
          <div className="pf-header-card__left">
            <div className="pf-avatar-wrap">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="foto de perfil"
                  className="pf-avatar"
                />
              ) : (
                <div className="pf-avatar pf-avatar--placeholder">
                  <span>{profile.name.slice(0, 2).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="pf-identity">
              <h1 className="pf-name">{profile.name}</h1>
              <div className="pf-tags">
                {profile.tags.map((tag) => (
                  <span key={tag} className="pf-tag">
                    {tag}
                  </span>
                ))}
                <button
                  className="pf-share-btn"
                  type="button"
                  title="Compartir"
                >
                  ↗
                </button>
              </div>
              <p className="pf-bio">{profile.bio}</p>
            </div>
          </div>

          <div className="pf-header-card__right">
            <div className="pf-socials">
              {profile.socials.map((s) => {
                const meta = SOCIAL_META[s.platform];
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-social-btn"
                    style={{ background: meta.color }}
                    title={meta.label}
                  >
                  </a>
                );
              })}
            </div>
            <button
              className="pf-edit-btn"
              type="button"
              onClick={() => setEditing(true)}
            >
              Editar perfil
            </button>
          </div>
        </div>

        
        <section className="pf-section">
          <h2 className="pf-section__title">Servicios que ofrezco</h2>
          <div className="pf-services-grid">
            {profile.services.map((svc) => (
              <div key={svc.id} className="pf-service-card">
                <span className="pf-service-card__icon">{svc.icon}</span>
                <p className="pf-service-card__title">{svc.title}</p>
                <p className="pf-service-card__desc">{svc.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pf-section">
          <h2 className="pf-section__title">Sesiones</h2>
          <div className="pf-sessions">
            {profile.sessions.map((ses) => (
              <div key={ses.id} className="pf-session-card">
                <span className="pf-session-card__icon"></span>
                <div>
                  <p className="pf-session-card__title">{ses.title}</p>
                  <p className="pf-session-card__date">
                    {ses.date} {ses.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {editing && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={(updated) => {
            setProfile(updated);
            setEditing(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}
