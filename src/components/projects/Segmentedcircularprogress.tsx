/* eslint-disable react-refresh/only-export-components */
// src/components/projects/SegmentedCircularProgress.tsx
// Renders a pie-like progress ring with one arc-segment per member.
// Each segment fills proportionally to that member's task completion.

interface MemberSegment {
    uid: string
    name: string
    pct: number       // 0-100
    color: string
  }
  
  interface SegmentedCircularProgressProps {
    segments: MemberSegment[]
    size?: number
    stroke?: number
    showLabels?: boolean
  }
  
  // Palette for up to 8 members
  const COLORS = [
    '#7c3aed', // purple (owner)
    '#0ea5e9', // sky
    '#16a34a', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#f97316', // orange
  ]
  
  export function getMemberColor(index: number): string {
    return COLORS[index % COLORS.length]
  }
  
  export function SegmentedCircularProgress({
    segments,
    size = 80,
    stroke = 7,
    showLabels = false,
  }: SegmentedCircularProgressProps) {
    const cx = size / 2
    const cy = size / 2
    const r = (size - stroke) / 2
    const circ = 2 * Math.PI * r
    const gap = segments.length > 1 ? 2 : 0     // gap in px between segments
    const segmentCount = segments.length || 1
  
    // Each segment occupies an equal slice of the full circle
    const sliceDeg = 360 / segmentCount
    const sliceCirc = circ / segmentCount
  
    // For the background track per segment
    const trackDash = sliceCirc - gap
    const trackGap = circ - trackDash
  
    // Overall progress for center label
    const overall =
      segments.length > 0
        ? Math.round(segments.reduce((s, m) => s + m.pct, 0) / segments.length)
        : 0
  
    return (
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background tracks */}
          {segments.map((_, i) => {
            const offsetAngle = i * sliceDeg
            const rotation = `rotate(${offsetAngle} ${cx} ${cy})`
            return (
              <circle
                key={`bg-${i}`}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth={stroke}
                strokeDasharray={`${trackDash} ${trackGap}`}
                strokeDashoffset={0}
                transform={rotation}
              />
            )
          })}
  
          {/* Filled arcs */}
          {segments.map((seg, i) => {
            const offsetAngle = i * sliceDeg
            const filled = (seg.pct / 100) * (sliceCirc - gap)
            const rotation = `rotate(${offsetAngle} ${cx} ${cy})`
            return (
              <circle
                key={`fill-${seg.uid}`}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${filled} ${circ - filled}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                transform={rotation}
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
              />
            )
          })}
        </svg>
  
        {/* Center label */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size < 60 ? '0.65rem' : '0.78rem',
            fontWeight: 700,
            color: '#0f172a',
            pointerEvents: 'none',
          }}
        >
          {overall}%
        </span>
  
        {/* Segment labels (optional) */}
        {showLabels &&
          segments.map((seg, i) => {
            const angleDeg = i * sliceDeg + sliceDeg / 2 - 90
            const angleRad = (angleDeg * Math.PI) / 180
            const labelR = r + stroke / 2 + 14
            const lx = cx + labelR * Math.cos(angleRad)
            const ly = cy + labelR * Math.sin(angleRad)
            return (
              <span
                key={`lbl-${seg.uid}`}
                style={{
                  position: 'absolute',
                  left: lx,
                  top: ly,
                  transform: 'translate(-50%, -50%)',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  color: seg.color,
                  whiteSpace: 'nowrap',
                }}
              >
                {seg.pct}%
              </span>
            )
          })}
      </div>
    )
  }