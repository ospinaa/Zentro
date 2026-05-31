// src/components/projects/ProjectDetailPanel.tsx
import { useEffect, useState } from 'react'
import type { CollaborativeProject, ActivityEntry, ProjectComment, TaskStatus } from '../../services/Collaborativeprojectservice'
import * as svc from '../../services/Collaborativeprojectservice'
import { useAuth } from '../../context/AuthContext'
import { SegmentedCircularProgress, getMemberColor } from './Segmentedcircularprogress'
import { TaskModal, STATUS_LABELS, STATUS_NEXT } from './Taskmodal'
import { useCollaborativeProjects } from '../../context/Collaborativeprojectcontext'

interface ProjectDetailPanelProps {
  project: CollaborativeProject
  onClose: () => void
}

type Tab = 'tasks' | 'activity' | 'comments' | 'team'

export function ProjectDetailPanel({ project, onClose }: ProjectDetailPanelProps) {
  const { user } = useAuth()
  const { createTask, changeTaskStatus, removeTask, removeProject } = useCollaborativeProjects()
  const [tab, setTab] = useState<Tab>('tasks')
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [comments, setComments] = useState<ProjectComment[]>([])
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showTaskModal, setShowTaskModal] = useState(false)

  useEffect(() => {
    if (tab === 'activity') loadActivity()
    if (tab === 'comments') loadComments()
  }, [tab, project.id])

  async function loadActivity() {
    const data = await svc.getProjectActivity(project.id)
    setActivity(data)
  }

  async function loadComments() {
    const data = await svc.getProjectComments(project.id)
    setComments(data)
  }

  async function handlePostComment() {
    if (!commentText.trim()) return
    await svc.postComment(project.id, commentText.trim(), null)
    setCommentText('')
    loadComments()
  }

  async function handlePostReply(parentId: string) {
    if (!replyText.trim()) return
    await svc.postComment(project.id, replyText.trim(), parentId)
    setReplyText('')
    setReplyingTo(null)
    loadComments()
  }

  const segments = project.memberProgress.map((mp, i) => ({
    uid: mp.uid,
    name: mp.name,
    pct: mp.pct,
    color: getMemberColor(i),
  }))

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  }

  function isOverdue(dueDate: string | null) {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const actionLabel: Record<string, string> = {
    created_task: 'creó',
    updated_task: 'actualizó',
    completed_task: 'completó',
    added_member: 'se unió al proyecto',
  }

  return (
    <div className="pdp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pdp-panel">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="pdp-header">
          <div className="pdp-header__left">
            <div className="pdp-progress-ring">
              <SegmentedCircularProgress segments={segments} size={72} stroke={7} />
            </div>
            <div>
              <div className="pdp-type-badge">
                {project.type === 'collaborative' ? '👥 Colaborativo' : '👤 Individual'}
              </div>
              <h2 className="pdp-title">{project.name}</h2>
              {project.description && <p className="pdp-desc">{project.description}</p>}
            </div>
          </div>
          <div className="pdp-header__actions">
            {user?.uid === project.owner_uid && (
              <button
                className="pdp-btn-danger"
                onClick={() => { removeProject(project.id); onClose() }}
                title="Eliminar proyecto"
              >
                🗑
              </button>
            )}
            <button className="pdp-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* ── Members strip ───────────────────────────────── */}
        <div className="pdp-members">
          {project.members.map((m, i) => (
            <div key={m.user_uid} className="pdp-member-chip" title={`${m.name} · ${m.role}`}>
              <div className="pdp-member-avatar" style={{ borderColor: getMemberColor(i) }}>
                {m.photo
                  ? <img src={m.photo} alt={m.name} />
                  : <span>{(m.name ?? 'U').charAt(0).toUpperCase()}</span>}
              </div>
              <div className="pdp-member-info">
                <span className="pdp-member-name">{m.name}</span>
                <span className="pdp-member-role">{m.role}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ────────────────────────────────────────── */}
        <div className="pdp-tabs">
          {(['tasks', 'team', 'activity', 'comments'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`pdp-tab ${tab === t ? 'pdp-tab--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'tasks' && '✅ Tareas'}
              {t === 'team' && '📊 Equipo'}
              {t === 'activity' && '📋 Actividad'}
              {t === 'comments' && '💬 Comentarios'}
            </button>
          ))}
        </div>

        {/* ── Tab content ─────────────────────────────────── */}
        <div className="pdp-body">

          {/* TASKS */}
          {tab === 'tasks' && (
            <div className="pdp-tasks">
              <div className="pdp-tasks-header">
                <span className="pdp-tasks-count">{project.tasks.length} tareas</span>
                <button className="pdp-btn-primary" onClick={() => setShowTaskModal(true)}>
                  + Nueva tarea
                </button>
              </div>

              {project.tasks.length === 0 ? (
                <div className="pdp-empty">
                  <p>Sin tareas aún. ¡Crea la primera!</p>
                </div>
              ) : (
                <ul className="pdp-task-list">
                  {project.tasks.map((task) => {
                    const overdue = isOverdue(task.due_date) && task.status !== 'completed'
                    return (
                      <li key={task.id} className={`pdp-task-item pdp-task-item--${task.status}`}>
                        <div className="pdp-task-main">
                          <div className="pdp-task-info">
                            <span className={`pdp-task-title ${task.status === 'completed' ? 'pdp-task-title--done' : ''}`}>
                              {task.title}
                            </span>
                            {task.description && (
                              <span className="pdp-task-desc">{task.description}</span>
                            )}
                            <div className="pdp-task-meta">
                              {task.assignee_name && (
                                <span className="pdp-task-assignee">👤 {task.assignee_name}</span>
                              )}
                              {task.due_date && (
                                <span className={`pdp-task-due ${overdue ? 'pdp-task-due--overdue' : ''}`}>
                                  📅 {task.due_date}{overdue ? ' · Vencida' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="pdp-task-actions">
                            <button
                              className={`pdp-status-badge pdp-status-badge--${task.status}`}
                              onClick={() => changeTaskStatus(project.id, task.id, STATUS_NEXT[task.status as TaskStatus])}
                              title="Cambiar estado"
                            >
                              {STATUS_LABELS[task.status as TaskStatus]}
                            </button>
                            <button
                              className="pdp-task-del"
                              onClick={() => removeTask(task.id)}
                              title="Eliminar tarea"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}

          {/* TEAM PERFORMANCE */}
          {tab === 'team' && (
            <div className="pdp-team">
              <h3 className="pdp-section-title">Desempeño del equipo</h3>
              <div className="pdp-team-cards">
                {project.memberProgress.map((mp, i) => {
                  const color = getMemberColor(i)
                  const overdueTasks = project.tasks.filter(
                    (t) => t.assignee_uid === mp.uid && isOverdue(t.due_date) && t.status !== 'completed'
                  ).length
                  return (
                    <div key={mp.uid} className="pdp-team-card">
                      <div className="pdp-team-card__header">
                        <div className="pdp-team-avatar" style={{ borderColor: color }}>
                          {mp.photo
                            ? <img src={mp.photo} alt={mp.name} />
                            : <span>{mp.name.charAt(0).toUpperCase()}</span>}
                        </div>
                        <div>
                          <span className="pdp-team-name">{mp.name}</span>
                          <span className="pdp-team-pct" style={{ color }}>{mp.pct}%</span>
                        </div>
                      </div>
                      <div className="pdp-team-bar-track">
                        <div
                          className="pdp-team-bar-fill"
                          style={{ width: `${mp.pct}%`, background: color }}
                        />
                      </div>
                      <div className="pdp-team-stats">
                        <span>📋 {mp.assigned} asignadas</span>
                        <span>✅ {mp.completed} completadas</span>
                        {overdueTasks > 0 && <span className="pdp-team-overdue">⚠️ {overdueTasks} vencidas</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend for circular ring */}
              <h3 className="pdp-section-title" style={{ marginTop: 24 }}>Progreso circular</h3>
              <div className="pdp-ring-legend">
                <SegmentedCircularProgress segments={segments} size={120} stroke={10} />
                <div className="pdp-ring-legend-labels">
                  {segments.map((s) => (
                    <div key={s.uid} className="pdp-legend-row">
                      <span className="pdp-legend-dot" style={{ background: s.color }} />
                      <span>{s.name}</span>
                      <span className="pdp-legend-pct" style={{ color: s.color }}>{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY */}
          {tab === 'activity' && (
            <div className="pdp-activity">
              <h3 className="pdp-section-title">Actividad del proyecto</h3>
              {activity.length === 0 ? (
                <p className="pdp-empty-text">Sin actividad registrada aún.</p>
              ) : (
                <ul className="pdp-activity-list">
                  {activity.map((entry) => (
                    <li key={entry.id} className="pdp-activity-item">
                      <div className="pdp-activity-avatar">
                        {entry.user_photo
                          ? <img src={entry.user_photo} alt={entry.user_name} />
                          : <span>{(entry.user_name ?? 'U').charAt(0).toUpperCase()}</span>}
                      </div>
                      <div className="pdp-activity-body">
                        <span className="pdp-activity-text">
                          <strong>{entry.user_name}</strong>{' '}
                          {actionLabel[entry.action] ?? entry.action}
                          {entry.task_title ? `: ${entry.task_title}` : ''}
                        </span>
                        <span className="pdp-activity-time">{formatDate(entry.created_at)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* COMMENTS */}
          {tab === 'comments' && (
            <div className="pdp-comments">
              <h3 className="pdp-section-title">Comentarios</h3>

              <div className="pdp-comment-input-wrap">
                <input
                  className="pdp-comment-input"
                  placeholder="Escribe un comentario… usa @nombre para etiquetar"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                />
                <button className="pdp-btn-primary" onClick={handlePostComment}>Enviar</button>
              </div>

              {comments.length === 0 ? (
                <p className="pdp-empty-text">Sé el primero en comentar.</p>
              ) : (
                <ul className="pdp-comment-list">
                  {comments.map((c) => (
                    <li key={c.id} className="pdp-comment-item">
                      <div className="pdp-comment-avatar">
                        {c.user_photo
                          ? <img src={c.user_photo} alt={c.user_name} />
                          : <span>{(c.user_name ?? 'U').charAt(0).toUpperCase()}</span>}
                      </div>
                      <div className="pdp-comment-body">
                        <div className="pdp-comment-meta">
                          <strong>{c.user_name}</strong>
                          <span className="pdp-comment-time">{formatDate(c.created_at)}</span>
                        </div>
                        <p className="pdp-comment-text">{c.content}</p>
                        <button
                          className="pdp-reply-btn"
                          onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                        >
                          Responder
                        </button>

                        {replyingTo === c.id && (
                          <div className="pdp-reply-input-wrap">
                            <input
                              className="pdp-comment-input"
                              placeholder="Responder…"
                              autoFocus
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handlePostReply(c.id)}
                            />
                            <button className="pdp-btn-primary" onClick={() => handlePostReply(c.id)}>
                              Responder
                            </button>
                          </div>
                        )}

                        {(c.replies ?? []).map((r) => (
                          <div key={r.id} className="pdp-reply-item">
                            <div className="pdp-comment-avatar pdp-comment-avatar--sm">
                              {r.user_photo
                                ? <img src={r.user_photo} alt={r.user_name} />
                                : <span>{(r.user_name ?? 'U').charAt(0).toUpperCase()}</span>}
                            </div>
                            <div className="pdp-comment-body">
                              <div className="pdp-comment-meta">
                                <strong>{r.user_name}</strong>
                                <span className="pdp-comment-time">{formatDate(r.created_at)}</span>
                              </div>
                              <p className="pdp-comment-text">{r.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {showTaskModal && (
          <TaskModal
            project={project}
            onClose={() => setShowTaskModal(false)}
            onSubmit={(title, desc, assignee, due) =>
              createTask(project.id, title, desc, assignee, due)
            }
          />
        )}
      </div>
    </div>
  )
}