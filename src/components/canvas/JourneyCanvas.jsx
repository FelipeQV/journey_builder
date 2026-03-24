import DotRow from './DotRow'
import LaneRow from './LaneRow'
import AnnotationBar from './AnnotationBar'

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function Divider({ label }) {
  return (
    <div className="j-row divider-row">
      <div className="j-label">{label}</div>
      <div className="j-cells"><div className="cells-row" /></div>
    </div>
  )
}

export default function JourneyCanvas({ journey, selectedLanes, metadata }) {
  const { steps = [], annotations = [], title, persona } = journey

  const frontstageLanes = selectedLanes.filter((l) => l.group === 'frontstage')
  const backstageLanes = selectedLanes.filter((l) => l.group === 'backstage')

  const metaTags = [
    metadata?.project && { label: metadata.project },
    metadata?.client && { label: metadata.client },
    metadata?.version && { label: `v${metadata.version}` },
    metadata?.date && { label: metadata.date },
  ].filter(Boolean)

  return (
    <div className="journey-canvas" id="journey-output">
      <div className="journey-inner">
        <div className="journey-header">
          <span className="journey-title">{metadata?.name || title}</span>
          <span className="journey-meta">{persona}</span>
          {metaTags.length > 0 && (
            <div className="journey-meta-tags">
              {metaTags.map((t, i) => (
                <span key={i} className="meta-tag">{t.label}</span>
              ))}
            </div>
          )}
        </div>

        <div className="journey-table">
          {/* Dot row */}
          <DotRow steps={steps} />

          {/* Frontstage */}
          {frontstageLanes.length > 0 && (
            <>
              <Divider label="Frontstage" />
              {frontstageLanes.map((lane) => (
                <LaneRow key={lane.id} lane={lane} steps={steps} />
              ))}
            </>
          )}

          {/* Backstage */}
          {backstageLanes.length > 0 && (
            <>
              <Divider label="Backstage" />
              {backstageLanes.map((lane) => (
                <LaneRow key={lane.id} lane={lane} steps={steps} />
              ))}
            </>
          )}
        </div>

        <AnnotationBar annotations={annotations} />
      </div>
    </div>
  )
}
