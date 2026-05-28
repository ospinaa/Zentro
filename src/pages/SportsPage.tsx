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
      <div className="sp-page">

        {/* ── Hero ── */}
        <div className="sp-hero">
          <div className="sp-hero__text">
            <p className="sp-hero__eyebrow">Comunidad deportiva</p>
            <h1 className="sp-hero__title">Sports Activities</h1>
            <p className="sp-hero__subtitle">
              Únete a actividades deportivas, crea torneos y conecta con otros estudiantes.
            </p>
          </div>
          <button className="sp-hero__btn" onClick={() => setShowForm(true)}>
            + Publicar evento
          </button>
        </div>

        {/* ── Form ── */}
        {showForm && (
          <div className="sp-form-card">
            <h2 className="sp-form-card__title">
              {editingId ? "Editar evento" : "Nuevo evento deportivo"}
            </h2>

            <div className="sp-form-grid">
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
              <label className="auth-label">Link o contacto</label>
              <input
                className="auth-input"
                placeholder="https://..."
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
              />
            </div>

            <div className="sp-form-card__actions">
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
          <div className="sp-empty">
            <span className="sp-empty__icon">⚽</span>
            <p className="sp-empty__text">No hay eventos deportivos aún.</p>
            <button className="sp-hero__btn" onClick={() => setShowForm(true)}>
              + Crear el primero
            </button>
          </div>
        ) : (
          <div className="sp-grid">
            {events.map((e) => {
              const isOwner = auth.currentUser?.uid === e.firebase_uid;
              return (
                <div key={e.id} className="sp-card">
                  <div className="sp-card__icon">🏀</div>
                  <div className="sp-card__body">
                    <h3 className="sp-card__title">{e.title}</h3>
                    <p className="sp-card__desc">{e.description}</p>
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
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}