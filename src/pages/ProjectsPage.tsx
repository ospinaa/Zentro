// src/pages/ProjectsPage.tsx
import { useEffect, useState } from 'react'
import { DashboardLayout } from '../layout/DashboardLayout' 
import { useProfile } from '../context/ProfileContexts'
import { useCollaborativeProjects } from '../context/Collaborativeprojectcontext'
import { CollaborativeProjectCard } from '../components/projects/Collaborativeprojectcard'
import { CollaborativeProjectModal } from '../components/projects/Collaborativeprojectmodal'
import type { ProjectType } from '../services/Collaborativeprojectservice'

// Keep old academic types here for the academic sidebar section
interface Entrega { id: string; nombre: string; nota: number; peso: number }
interface Materia { id: string; nombre: string; entregas: Entrega[] }

function calcNotaFinal(entregas: Entrega[]): number {
  const totalPeso = entregas.reduce((s, e) => s + e.peso, 0)
  if (totalPeso === 0) return 0
  return entregas.reduce((s, e) => s + e.nota * e.peso, 0) / totalPeso
}
function calcPromedio(materias: Materia[]): number {
  if (materias.length === 0) return 0
  return materias.map((m) => calcNotaFinal(m.entregas)).reduce((s, n) => s + n, 0) / materias.length
}

function AcademicSection() {
  const [materias, setMaterias] = useState<Materia[]>(() => {
    try { return JSON.parse(localStorage.getItem('zentro_materias') || '[]') } catch { return [] }
  })
  const [addingMateria, setAddingMateria] = useState(false)
  const [newMateria, setNewMateria] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function save(m: Materia[]) { setMaterias(m); localStorage.setItem('zentro_materias', JSON.stringify(m)) }
  function addMateria() {
    if (!newMateria.trim()) return
    const m: Materia = { id: Date.now().toString(), nombre: newMateria.trim(), entregas: [] }
    save([...materias, m]); setNewMateria(''); setAddingMateria(false); setExpandedId(m.id)
  }
  function removeMateria(id: string) { save(materias.filter((m) => m.id !== id)) }
  function addEntrega(materiaId: string) {
    save(materias.map((m) => m.id === materiaId
      ? { ...m, entregas: [...m.entregas, { id: Date.now().toString(), nombre: 'Entrega', nota: 0, peso: 0 }] } : m))
  }
  function updateEntrega(materiaId: string, entregaId: string, field: keyof Entrega, value: string | number) {
    save(materias.map((m) => m.id === materiaId
      ? { ...m, entregas: m.entregas.map((e) => e.id === entregaId ? { ...e, [field]: value } : e) } : m))
  }
  function removeEntrega(materiaId: string, entregaId: string) {
    save(materias.map((m) => m.id === materiaId
      ? { ...m, entregas: m.entregas.filter((e) => e.id !== entregaId) } : m))
  }

  const promedio = calcPromedio(materias)
  const notaColor = promedio >= 4 ? '#16a34a' : promedio >= 3 ? '#d97706' : '#dc2626'

  return (
    <div className="pj-academic">
      <div className="pj-section-header">
        <span className="pj-section-title">Rendimiento académico</span>
        {materias.length > 0 && <span className="pj-academic-avg" style={{ color: notaColor }}>{promedio.toFixed(2)}</span>}
      </div>
      {materias.length === 0 && !addingMateria && (
        <p className="pj-academic-empty">Agrega materias para calcular tu promedio.</p>
      )}
      <div className="pj-materia-list">
        {materias.map((m) => {
          const nota = calcNotaFinal(m.entregas)
          const isOpen = expandedId === m.id
          const notaC = nota >= 4 ? '#16a34a' : nota >= 3 ? '#d97706' : '#dc2626'
          return (
            <div key={m.id} className="pj-materia-card">
              <div className="pj-materia-header" onClick={() => setExpandedId(isOpen ? null : m.id)}>
                <span className="pj-materia-nombre">{m.nombre}</span>
                <div className="pj-materia-right">
                  {m.entregas.length > 0 && <span className="pj-materia-nota" style={{ color: notaC }}>{nota.toFixed(2)}</span>}
                  <span className="pj-chevron">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>
              {isOpen && (
                <div className="pj-materia-body">
                  {m.entregas.map((e) => (
                    <div key={e.id} className="pj-entrega-row">
                      <input className="pj-entrega-input pj-entrega-input--name" value={e.nombre}
                        onChange={(ev) => updateEntrega(m.id, e.id, 'nombre', ev.target.value)} placeholder="Entrega" />
                      <div className="pj-entrega-group">
                        <input className="pj-entrega-input pj-entrega-input--num" type="number" min={0} max={5} step={0.1}
                          value={e.nota} onChange={(ev) => updateEntrega(m.id, e.id, 'nota', parseFloat(ev.target.value) || 0)} placeholder="Nota" />
                        <input className="pj-entrega-input pj-entrega-input--num" type="number" min={0} max={100}
                          value={e.peso} onChange={(ev) => updateEntrega(m.id, e.id, 'peso', parseFloat(ev.target.value) || 0)} placeholder="%" />
                        <button className="pj-entrega-del" onClick={() => removeEntrega(m.id, e.id)}>×</button>
                      </div>
                    </div>
                  ))}
                  <div className="pj-materia-actions">
                    <button className="pj-btn-ghost pj-btn-ghost--sm" onClick={() => addEntrega(m.id)}>+ Entrega</button>
                    <button className="pj-btn-danger" onClick={() => removeMateria(m.id)}>Eliminar</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {addingMateria ? (
        <div className="pj-add-materia-form">
          <input className="pj-input" autoFocus placeholder="Nombre de la materia" value={newMateria}
            onChange={(e) => setNewMateria(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMateria()} />
          <div className="pj-add-materia-btns">
            <button className="pj-btn-primary pj-btn-primary--sm" onClick={addMateria}>Agregar</button>
            <button className="pj-btn-ghost pj-btn-ghost--sm" onClick={() => setAddingMateria(false)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <button className="pj-btn-ghost pj-btn-ghost--full" onClick={() => setAddingMateria(true)}>+ Agregar materia</button>
      )}
      {materias.length > 0 && (
        <div className="pj-materia-bars">
          {materias.map((m) => {
            const nota = calcNotaFinal(m.entregas)
            const pct = Math.min((nota / 5) * 100, 100)
            const color = nota >= 4 ? '#16a34a' : nota >= 3 ? '#d97706' : '#dc2626'
            return (
              <div key={m.id} className="pj-bar-row">
                <span className="pj-bar-label">{m.nombre}</span>
                <div className="pj-bar-track"><div className="pj-bar-fill" style={{ width: `${pct}%`, background: color }} /></div>
                <span className="pj-bar-val" style={{ color }}>{nota.toFixed(1)}</span>
              </div>
            )
          })}
          <div className="pj-bar-row pj-bar-row--total">
            <span className="pj-bar-label">Promedio general</span>
            <div className="pj-bar-track"><div className="pj-bar-fill pj-bar-fill--purple" style={{ width: `${Math.min((promedio / 5) * 100, 100)}%` }} /></div>
            <span className="pj-bar-val pj-bar-val--purple">{promedio.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────

export function ProjectsPage() {
  const { userInitials } = useProfile()
  const { projects, loading, createProject } = useCollaborativeProjects()
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'individual' | 'collaborative'>('all')

  useEffect(() => { document.title = 'Projects · Zentro' }, [])

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.type === filter)

  const totalTasks = projects.reduce((s, p) => s + p.tasks.length, 0)
  const doneTasks = projects.reduce((s, p) => s + p.tasks.filter((t) => t.status === 'completed').length, 0)
  const doneProjects = projects.filter((p) => p.progress === 100).length

  async function handleCreateProject(
    name: string,
    description: string,
    type: ProjectType,
    collaborators: string[]
  ) {
    await createProject(name, description, type, collaborators)
    setShowModal(false)
  }

  return (
    <DashboardLayout userInitials={userInitials}>
      <div className="pj-page">
        <div className="pj-layout">

          {/* ════════ LEFT — Project feed ════════ */}
          <main className="pj-main">
            <div className="pj-main-header">
              <div className="pj-main-header-left">
                <h2 className="pj-main-title">Mis proyectos</h2>
                <span className="pj-main-count">{projects.length} proyecto{projects.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="pj-filter-tabs">
                {(['all', 'individual', 'collaborative'] as const).map((f) => (
                  <button
                    key={f}
                    className={`pj-filter-tab ${filter === f ? 'pj-filter-tab--active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'Todos' : f === 'individual' ? '👤 Individual' : '👥 Colaborativo'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="pj-loading">
                <div className="pj-loading-spinner" />
                <span>Cargando proyectos…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="pj-empty">
                <div className="pj-empty__icon">🗂️</div>
                <p className="pj-empty__title">Sin proyectos aún</p>
                <p className="pj-empty__sub">Crea tu primer proyecto y empieza a organizar tus tareas.</p>
                <button className="pj-btn-primary" onClick={() => setShowModal(true)}>+ Nuevo proyecto</button>
              </div>
            ) : (
              <div className="pj-list">
                {filtered.map((p) => (
                  <CollaborativeProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </main>

          {/* ════════ RIGHT — Sidebar ════════ */}
          <aside className="pj-sidebar">
            <div className="pj-sidebar__hero">
              <p className="pj-sidebar__eyebrow">Gestión de proyectos</p>
              <h1 className="pj-sidebar__title">Projects</h1>
              <p className="pj-sidebar__subtitle">
                Gestiona tareas, sigue tu progreso y colabora con otros estudiantes.
              </p>
              <button className="pj-btn-white" onClick={() => setShowModal(true)}>+ Nuevo proyecto</button>
            </div>

            {/* Quick stats */}
            <div className="pj-stats-row">
              <div className="pj-stat-card">
                <span className="pj-stat-num" style={{ color: '#7c3aed' }}>{doneProjects}</span>
                <span className="pj-stat-card__label">Proyectos<br />finalizados</span>
              </div>
              <div className="pj-stat-card">
                <span className="pj-stat-num" style={{ color: '#0ea5e9' }}>{doneTasks}</span>
                <span className="pj-stat-card__label">Tareas<br />completadas</span>
              </div>
              <div className="pj-stat-card">
                <span className="pj-stat-num" style={{ color: '#16a34a' }}>{totalTasks}</span>
                <span className="pj-stat-card__label">Tareas<br />totales</span>
              </div>
            </div>

            {/* Academic grades */}
            <AcademicSection />
          </aside>
        </div>
      </div>

      {showModal && (
        <CollaborativeProjectModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </DashboardLayout>
  )
}