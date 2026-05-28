// ─── src/pages/SportsPage.tsx ────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { useSports } from "../context/SportsContext";
import { auth } from "../services/firebase";

export function SportsPage() {

  const {
    events,
    addEvent,
    editEvent,
    removeEvent,
  } = useSports();

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [eventTime, setEventTime] =
    useState("");

  const [externalLink, setExternalLink] =
    useState("");

  useEffect(() => {
    document.title =
      "Sports · Zentro";
  }, []);

  async function handleSubmit() {

    if (!title.trim()) return;

    const payload = {
      title,
      description,
      eventTime,
      externalLink,
    };

    if (editingId) {

      await editEvent(
        editingId,
        payload
      );

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

    setDescription(
      event.description
    );

    setEventTime(
      event.eventTime
    );

    setExternalLink(
      event.externalLink
    );

    setShowForm(true);
  }

  return (
    <DashboardLayout>

      <div className="dash-page">

        {/* ───────────────── HERO ───────────────── */}

        <div className="dash-hero sports-hero">

          <div>
            <p className="dash-hero__eyebrow">
              Comunidad deportiva
            </p>

            <h1 className="dash-hero__title">
              Sports Activities
            </h1>

            <p className="dash-hero__subtitle">
              Únete a actividades deportivas,
              crea torneos y conecta con otros estudiantes.
            </p>
          </div>

          <button
            className="proj-page__new-btn"
            onClick={() =>
              setShowForm(true)
            }
          >
            + Publicar evento
          </button>
        </div>

        {/* ───────────────── FORM ───────────────── */}

        {showForm && (

          <div className="event-form-card">

            <h2 className="event-form-card__title">
              {editingId
                ? "Editar evento"
                : "Nuevo evento deportivo"}
            </h2>

            <div className="auth-field">
              <label className="auth-label">
                Título
              </label>

              <input
                className="auth-input"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">
                Descripción
              </label>

              <textarea
                className="auth-input"
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">
                Hora
              </label>

              <input
                type="time"
                className="auth-input"
                value={eventTime}
                onChange={(e) =>
                  setEventTime(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">
                Link o contacto
              </label>

              <input
                className="auth-input"
                placeholder="https://..."
                value={externalLink}
                onChange={(e) =>
                  setExternalLink(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="event-form-card__actions">

              <button
                className="auth-btn auth-btn--primary"
                onClick={handleSubmit}
              >
                {editingId
                  ? "Guardar cambios"
                  : "Publicar"}
              </button>

              <button
                className="auth-btn auth-btn--secondary"
                onClick={resetForm}
              >
                Cancelar
              </button>

            </div>
          </div>
        )}

        {/* ───────────────── EVENTS ───────────────── */}

        <div className="events-grid">

          {events.map((e) => {

            const isOwner =
              auth.currentUser?.uid ===
              e.firebase_uid;

            return (

              <div
                key={e.id}
                className="event-card"
              >

                <div className="event-card__top">

                  <div className="event-card__icon">
                    🏀
                  </div>

                  <div className="event-card__content">

                    <h3 className="event-card__title">
                      {e.title}
                    </h3>

                    <p className="event-card__description">
                      {e.description}
                    </p>

                  </div>
                </div>

                <div className="event-card__footer">

                  <div className="event-card__time">
                    🕒 {e.eventTime}
                  </div>

                  {e.externalLink && (
                    <a
                      href={e.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-card__link"
                    >
                      Más info
                    </a>
                  )}

                </div>

                {isOwner && (

                  <div className="event-card__actions">

                    <button
                      className="auth-btn auth-btn--secondary"
                      onClick={() =>
                        handleEdit(e)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="cal-action-btn cal-action-btn--delete"
                      onClick={() =>
                        removeEvent(
                          e.id
                        )
                      }
                    >
                      Eliminar
                    </button>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
}