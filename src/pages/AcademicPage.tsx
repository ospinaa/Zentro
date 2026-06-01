// src/pages/AcademicPage.tsx
import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { useAcademic } from "../context/AcademicContext";
import { auth } from "../services/firebase";
import { ImagePicker } from "../components/imagePicker";

const ACADEMIC_ACCENT = "#3b5bdb";

export function AcademicPage() {
  const { events, addEvent, editEvent, removeEvent } = useAcademic();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => { document.title = "Academic · Zentro"; }, []);

  async function handleSubmit() {
    if (!title.trim()) return;
    const payload = { title, description, eventTime, externalLink, imageUrl };
    if (editingId) {
      await editEvent(editingId, payload);
    } else {
      await addEvent(payload);
    }
    resetForm();
  }

  function resetForm() {
    setTitle(""); setDescription(""); setEventTime("");
    setExternalLink(""); setImageUrl(""); setEditingId(null); setShowForm(false);
  }

  function handleEdit(event: typeof events[number]) {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setEventTime(event.eventTime);
    setExternalLink(event.externalLink);
    setImageUrl(event.imageUrl ?? "");
    setShowForm(true);
  }

  return (
    <DashboardLayout>
      <div className="ac-page">
        <div className="ac-layout">

          {/* ── LEFT: Events feed ── */}
          <main className="ac-main">
            <div className="ac-main__header">
              <h2 className="ac-main__title">Publicaciones</h2>
              <span className="ac-main__count">
                {events.length} evento{events.length !== 1 ? "s" : ""}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="ac-empty">
                <span className="ac-empty__icon">🎓</span>
                <p className="ac-empty__text">No hay eventos académicos aún.</p>
                <button className="ac-btn ac-btn--primary" onClick={() => setShowForm(true)}>
                  + Crear el primero
                </button>
              </div>
            ) : (
              <div className="ac-grid">
                {events.map((e) => {
                  const isOwner = auth.currentUser?.uid === e.firebase_uid;
                  return (
                    <div key={e.id} className="ac-card">
                      {/* Banner visual — image or gradient fallback */}
                      <div className="ac-card__banner">
                        {e.imageUrl ? (
                          <img
                            src={e.imageUrl}
                            alt={e.title}
                            className="ac-card__banner-img"
                          />
                        ) : (
                          <span className="ac-card__banner-icon">🎓</span>
                        )}
                        <span className="ac-card__banner-tag">Académico</span>
                      </div>
                      {/* Content */}
                      <div className="ac-card__inner">
                        <div className="ac-card__top">
                          <div className="ac-card__body">
                            <h3 className="ac-card__title">{e.title}</h3>
                            <p className="ac-card__desc">{e.description}</p>
                          </div>
                        </div>
                        <div className="ac-card__footer">
                          <span className="ac-card__time">🕒 {e.eventTime}</span>
                          {e.externalLink && (
                            <a
                              href={e.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ac-card__link"
                            >
                              Más info →
                            </a>
                          )}
                        </div>
                        {isOwner && (
                          <div className="ac-card__actions">
                            <button
                              className="ac-card__action-btn ac-card__action-btn--edit"
                              onClick={() => handleEdit(e)}
                            >
                              Editar
                            </button>
                            <button
                              className="ac-card__action-btn ac-card__action-btn--delete"
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
          <aside className="ac-sidebar">

            <div className="ac-sidebar__hero">
              <p className="ac-sidebar__eyebrow">Comunidad académica</p>
              <h1 className="ac-sidebar__title">Academic Exchange</h1>
              <p className="ac-sidebar__subtitle">
                Comparte conocimiento, publica eventos académicos y conecta con estudiantes.
              </p>
              {!showForm && (
                <button className="ac-btn ac-btn--white" onClick={() => setShowForm(true)}>
                  + Publicar evento
                </button>
              )}
            </div>

            {showForm && (
              <div className="ac-sidebar__form">
                <h2 className="ac-sidebar__form-title">
                  {editingId ? "Editar evento" : "Nuevo evento académico"}
                </h2>

                {/* Image picker — subir o URL */}
                <div className="auth-field">
                  <label className="auth-label">Imagen del evento</label>
                  <ImagePicker
                    value={imageUrl}
                    onChange={setImageUrl}
                    accent={ACADEMIC_ACCENT}
                    defaultEmoji="🎓"
                  />
                </div>

                <div className="ac-form-grid">
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
                  <label className="auth-label">Link externo</label>
                  <input
                    className="auth-input"
                    placeholder="https://..."
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                  />
                </div>

                <div className="ac-form-actions">
                  <button className="ac-btn ac-btn--primary" onClick={handleSubmit}>
                    {editingId ? "Guardar cambios" : "Publicar"}
                  </button>
                  <button className="ac-btn ac-btn--ghost" onClick={resetForm}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="ac-sidebar__stats">
              <div className="ac-stat">
                <span className="ac-stat__value">{events.length}</span>
                <span className="ac-stat__label">Eventos publicados</span>
              </div>
              <div className="ac-stat">
                <span className="ac-stat__value">
                  {events.filter(e => auth.currentUser?.uid === e.firebase_uid).length}
                </span>
                <span className="ac-stat__label">Tus publicaciones</span>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}