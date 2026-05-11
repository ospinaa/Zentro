import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";

import { useAcademic } from "../context/AcademicContext";

import { auth } from "../services/firebase";

export function AcademicPage() {

  const {
    events,
    addEvent,
    editEvent,
    removeEvent,
  } = useAcademic();

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
      "Academic · Zentro";
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

      <div className="dash-placeholder">

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 className="dash-placeholder__title">
            Academic Exchange
          </h1>

          <button
            className="proj-page__new-btn"
            onClick={() =>
              setShowForm(true)
            }
          >
            + Publicar evento
          </button>
        </div>


        {showForm && (

          <div className="pm-panel">

            <div className="auth-field">
              <label>Título</label>

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
              <label>
                Descripción
              </label>

              <textarea
                className="auth-input"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="auth-field">
              <label>Hora</label>

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
              <label>Link</label>

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

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >
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


        <div
          style={{
            display: "grid",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {events.map((e) => {

            const isOwner =
              auth.currentUser?.uid ===
              e.firebase_uid;

            return (

              <div
                key={e.id}
                className="pf-service-card"
              >
                <h3>
                  {e.title}
                </h3>

                <p>
                  {e.description}
                </p>

                <p>
                  🕒 {e.eventTime}
                </p>

                {e.externalLink && (
                  <a
                    href={e.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      className="auth-btn auth-btn--primary"
                    >
                      Más info por este medio
                    </button>
                  </a>
                )}

                {isOwner && (

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "15px",
                    }}
                  >
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