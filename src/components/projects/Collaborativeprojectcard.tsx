// src/components/projects/CollaborativeProjectCard.tsx
import { useState } from 'react'
import type { CollaborativeProject } from '../../services/Collaborativeprojectservice'
import { SegmentedCircularProgress, getMemberColor } from './Segmentedcircularprogress'
import { ProjectDetailPanel } from './Projectdetailpane'

interface CollaborativeProjectCardProps {
  project: CollaborativeProject
}

export function CollaborativeProjectCard({ project }: CollaborativeProjectCardProps) {
  const [showDetail, setShowDetail] = useState(false)

  const segments = project.memberProgress.map((mp, i) => ({
    uid: mp.uid,
    name: mp.name,
    pct: mp.pct,
    color: getMemberColor(i),
  }))

  const done = project.tasks.filter((t) => t.status === 'completed').length
  const inProgress = project.tasks.filter((t) => t.status === 'in-progress').length
  const blocked = project.tasks.filter((t) => t.status === 'blocked').length

  return (
    <>
      <article
        className="cpcard"
        onClick={() => setShowDetail(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowDetail(true)}
      >
        <div className="cpcard__left">
          <SegmentedCircularProgress segments={segments} size={58} stroke={6} />
        </div>

        <div className="cpcard__body">
          <div className="cpcard__top">
            <span className="cpcard__type-badge">
              {project.type === 'collaborative' ? '👥' : '👤'}
            </span>
            <h3 className="cpcard__name">{project.name}</h3>
          </div>

          {project.description && (
            <p className="cpcard__desc">{project.description}</p>
          )}

          <div className="cpcard__stats">
            <span className="cpcard__stat">{project.tasks.length} tareas</span>
            {done > 0 && <span className="cpcard__stat cpcard__stat--done">✅ {done}</span>}
            {inProgress > 0 && <span className="cpcard__stat cpcard__stat--wip">🔄 {inProgress}</span>}
            {blocked > 0 && <span className="cpcard__stat cpcard__stat--blocked">🚫 {blocked}</span>}
          </div>

          {/* Member avatars */}
          {project.members.length > 0 && (
            <div className="cpcard__members">
              {project.members.slice(0, 5).map((m, i) => (
                <div
                  key={m.user_uid}
                  className="cpcard__member-avatar"
                  style={{ borderColor: getMemberColor(i) }}
                  title={m.name ?? 'Usuario'}
                >
                  {m.photo
                    ? <img src={m.photo} alt={m.name} />
                    : <span>{(m.name ?? 'U').charAt(0).toUpperCase()}</span>}
                </div>
              ))}
              {project.members.length > 5 && (
                <span className="cpcard__members-more">+{project.members.length - 5}</span>
              )}
            </div>
          )}
        </div>

        <div className="cpcard__right">
          <span className="cpcard__progress-label">{project.progress}%</span>
          <span className="cpcard__chevron">›</span>
        </div>
      </article>

      {showDetail && (
        <ProjectDetailPanel
          project={project}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  )
}