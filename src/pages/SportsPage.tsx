// src/pages/SportsPage.tsx
import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { useSports } from "../context/SportsContext";
import { auth } from "../services/firebase";

export function SportsPage() {
  const { events, addEvent, editEvent, removeEvent } = useSports();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [externalLink, setExternalLink] = useState("");

  useEffect(() => {
    document.title = "Sports · Zentro";
  }, []);

  async function handleSubmit() {
    if (!title.trim()) return;
    const payload = { title, description, eventTime, externalLink };
    if (editingId) {
      await editEvent(editingId, payload);
    } else {
      await addEvent(payload);
    }
    resetForm();
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setEventTime("");
    setExternalLink("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(event: {id: string; title: string; description: string; eventTime: string; externalLink: string; firebase_uid: string}) {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setEventTime(event.eventTime);
    setExternalLink(event.externalLink);
    setShowForm(true);
  }

  return (
    <DashboardLayout>
      <div className="sp-page">
        <div className="sp-layout">

          {/* ── LEFT: Events feed ── */}
          <main className="sp-main">
            <div className="sp-main__header">
              <h2 className="sp-main__title">Publicaciones</h2>
              <span className="sp-main__count">
                {events.length} evento{events.length !== 1 ? "s" : ""}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="sp-empty">
                <span className="sp-empty__icon">⚽</span>
                <p className="sp-empty__text">No hay eventos deportivos aún.</p>
                <button className="sp-btn sp-btn--primary" onClick={() => setShowForm(true)}>
                  + Crear el primero
                </button>
              </div>
            ) : (
              <div className="sp-grid">
                {events.map((e) => {
                  const isOwner = auth.currentUser?.uid === e.firebase_uid;
                  return (
                    <div key={e.id} className="sp-card">
                      {/* Banner visual */}
                      <div className="sp-card__banner">
                        <span className="sp-card__banner-icon">🏀</span>
                        <span className="sp-card__banner-tag">Deporte</span>
                      </div>
                      {/* Content */}
                      <div className="sp-card__inner">
                        <div className="sp-card__top">
                          <div className="sp-card__body">
                            <h3 className="sp-card__title">{e.title}</h3>
                            <p className="sp-card__desc">{e.description}</p>
                          </div>
                        </div>
                        <div className="sp-card__footer">
                          <span className="sp-card__time">🕒 {e.eventTime}</span>
                          {e.externalLink && (
                            <a
                              href={e.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sp-card__link"
                            >
                              Más info →
                            </a>
                          )}
                        </div>
                        {isOwner && (
                          <div className="sp-card__actions">
                            <button
                              className="sp-card__action-btn sp-card__action-btn--edit"
                              onClick={() => handleEdit(e)}
                            >
                              Editar
                            </button>
                            <button
                              className="sp-card__action-btn sp-card__action-btn--delete"
                              onClick={() => removeEvent(e.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="sp-sidebar">

            {/* Hero / Header */}
            <div className="sp-sidebar__hero">
              <p className="sp-sidebar__eyebrow">Comunidad deportiva</p>
              <h1 className="sp-sidebar__title">Sports Activities</h1>
              <p className="sp-sidebar__subtitle">
                Únete a actividades deportivas, crea torneos y conecta con otros estudiantes.
              </p>
              {!showForm && (
                <button className="sp-btn sp-btn--white" onClick={() => setShowForm(true)}>
                  + Publicar evento
                </button>
              )}
            </div>

            {/* Form */}
            {showForm && (
              <div className="sp-sidebar__form">
                <h2 className="sp-sidebar__form-title">
                  {editingId ? "Editar evento" : "Nuevo evento deportivo"}
                </h2>

                <div className="sp-form-grid">
                  <div className="auth-field">
                    <label className="auth-label">Título</label>
                    <input
                      className="auth-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nombre del evento"
                    />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Hora</label>
                    <input
                      type="time"
                      className="auth-input"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-label">Descripción</label>
                  <textarea
                    className="auth-input"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe el evento..."
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">Link o contacto</label>
                  <input
                    className="auth-input"
                    placeholder="https://..."
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                  />
                </div>

                <div className="sp-form-actions">
                  <button className="sp-btn sp-btn--primary" onClick={handleSubmit}>
                    {editingId ? "Guardar cambios" : "Publicar"}
                  </button>
                  <button className="sp-btn sp-btn--ghost" onClick={resetForm}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="sp-sidebar__stats">
              <div className="sp-stat">
                <span className="sp-stat__value">{events.length}</span>
                <span className="sp-stat__label">Eventos publicados</span>
              </div>
              <div className="sp-stat">
                <span className="sp-stat__value">
                  {events.filter(e => auth.currentUser?.uid === e.firebase_uid).length}
                </span>
                <span className="sp-stat__label">Tus publicaciones</span>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}