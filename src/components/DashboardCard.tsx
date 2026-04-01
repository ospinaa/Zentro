import { Link } from 'react-router-dom'

export interface DashboardCardProps {
  title: string
  description: string
  to: string
  ctaLabel?: string
}

export function DashboardCard({
  title,
  description,
  to,
  ctaLabel = 'Explore',
}: DashboardCardProps) {
  return (
    <article className="dash-card">
      <h2 className="dash-card__title">{title}</h2>
      <p className="dash-card__desc">{description}</p>
      <Link to={to} className="dash-card__link">
        {ctaLabel}
      </Link>
    </article>
  )
}
