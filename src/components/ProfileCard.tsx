import type { UserProfile } from '../types/profile'

export interface ProfileCardProps {
  profile: UserProfile
  initials: string
  onEditAvatar: () => void
}

export function ProfileCard({ profile, initials, onEditAvatar }: ProfileCardProps) {
  return (
    <aside className="profile-summary" aria-labelledby="profile-summary-heading">
      <div className="profile-summary__card">
        <div className="profile-summary__avatar-wrap">
          <div className="profile-summary__avatar" aria-hidden="true">
            {initials.slice(0, 2)}
          </div>
          <button type="button" className="profile-summary__edit-photo" onClick={onEditAvatar}>
            Edit avatar
          </button>
        </div>
        <h2 id="profile-summary-heading" className="profile-summary__name">
          {profile.name || 'Your name'}
        </h2>
        <p className="profile-summary__email">{profile.email || '—'}</p>
        <p className="profile-summary__bio">
          {profile.bio.trim() ? profile.bio : 'No bio yet.'}
        </p>
      </div>
    </aside>
  )
}
