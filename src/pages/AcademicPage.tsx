// src/pages/AcademicPage.tsx
import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { useAcademic } from "../context/AcademicContext";
import { auth } from "../services/firebase";

export function AcademicPage() {
  const { events, addEvent, editEvent, removeEvent } = useAcademic();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [externalLink, setExternalLink] = useState("");

  useEffect(() => {
    document.title = "Academic · Zentro";
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

  function handleEdit(event: any) {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setEventTime(event.eventTime);
    setExternalLink(event.externalLink);
    setShowForm(true);
  }

  return (
    <DashboardLayout>
      <div className="ac-page">

        {/* ── Hero ── */}
        <div className="ac-hero">
          <div className="ac-hero__text">
            <p className="ac-hero__eyebrow">Comunidad académica</p>
            <h1 className="ac-hero__title">Academic Exchange</h1>
            <p className="ac-hero__subtitle">
              Comparte conocimiento, publica eventos académicos y conecta con estudiantes.
            </p>
          </div>
          <button className="ac-hero__btn" onClick={() => setShowForm(true)}>
            + Publicar evento
          </button>
        </div>

        {/* ── Form ── */}
        {showForm && (
          <div className="ac-form-card">
            <h2 className="ac-form-card__title">
              {editingId ? "Editar evento" : "Nuevo evento académico"}
            </h2>

            <div className="ac-form-grid">
              <div className="auth-field">
                <label className="auth-label">Título</label>
                <input
                  className="auth-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Link</label>
              <input
                className="auth-input"
                placeholder="https://..."
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
              />
            </div>

            <div className="ac-form-card__actions">
              <button className="auth-btn auth-btn--primary" onClick={handleSubmit}>
                {editingId ? "Guardar cambios" : "Publicar"}
              </button>
              <button className="auth-btn auth-btn--secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* ── Events grid ── */}
        {events.length === 0 ? (
          <div className="ac-empty">
            <span className="ac-empty__icon">🎓</span>
            <p className="ac-empty__text">No hay eventos académicos aún.</p>
            <button className="ac-hero__btn" onClick={() => setShowForm(true)}>
              + Crear el primero
            </button>
          </div>
        ) : (
          <div className="ac-grid">
            {events.map((e) => {
              const isOwner = auth.currentUser?.uid === e.firebase_uid;
              return (
                <div key={e.id} className="ac-card">
                  <div className="ac-card__icon">🎓</div>
                  <div className="ac-card__body">
                    <h3 className="ac-card__title">{e.title}</h3>
                    <p className="ac-card__desc">{e.description}</p>
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
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}