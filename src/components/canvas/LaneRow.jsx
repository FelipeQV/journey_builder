function empty() {
  return <span style={{ color: '#ccc' }}>—</span>
}

function JourneyCell({ step }) {
  return <div className="j-cell">{step.journey_narrative || empty()}</div>
}

function TouchpointCell({ step }) {
  const tps = step.touchpoint || []
  return (
    <div className="j-cell">
      {tps.length ? tps.map((t, i) => <span key={i} className="tp-chip">{t}</span>) : empty()}
    </div>
  )
}

function DataCell({ step }) {
  return (
    <div className="j-cell" style={{ fontSize: 11, color: '#666' }}>
      {step.data || empty()}
    </div>
  )
}

function normalizeName(s) {
  return String(s || '').toLowerCase().replace(/_/g, ' ').trim()
}

function ActorCell({ step, actorName }) {
  const actor = (step.actors || []).find(
    (a) => normalizeName(a.name) === normalizeName(actorName)
  )
  if (!actor) return <div className="j-cell">{empty()}</div>
  return (
    <div className="j-cell" style={{ fontSize: 11 }}>
      <div className={`op-path${actor.is_exception ? ' op-exc' : ''}`}>
        <div className="op-lbl">{actor.is_exception ? '⚡ Exception' : '✓ Action'}</div>
        {actor.action}
      </div>
    </div>
  )
}

function TechnologyCell({ step }) {
  const tech = step.technology || []
  return (
    <div className="j-cell">
      {tech.length
        ? tech.map((t, i) => (
            <span key={i} className={`tech-chip${t.highlighted ? ' hl' : ''}`}>{t.name}</span>
          ))
        : empty()}
    </div>
  )
}

function OperationCell({ step }) {
  const hasContent = step.happy_path || step.exception
  if (!hasContent) return <div className="j-cell">{empty()}</div>
  return (
    <div className="j-cell" style={{ fontSize: 11 }}>
      {step.happy_path && (
        <div className="op-path">
          <div className="op-lbl">✓ Happy path</div>
          {step.happy_path}
        </div>
      )}
      {step.exception && (
        <div className="op-path op-exc">
          <div className="op-lbl">⚡ Exception</div>
          {step.exception}
        </div>
      )}
    </div>
  )
}

function CustomCell({ step, laneId }) {
  const value = step.custom_data?.[laneId]
  return (
    <div className="j-cell" style={{ fontSize: 11, color: '#555' }}>
      {value || empty()}
    </div>
  )
}

export default function LaneRow({ lane, steps }) {
  function renderCell(step) {
    if (lane.id === 'journey_narrative') return <JourneyCell key={step.id} step={step} />
    if (lane.id === 'touchpoint') return <TouchpointCell key={step.id} step={step} />
    if (lane.id === 'data') return <DataCell key={step.id} step={step} />
    if (lane.id === 'technology') return <TechnologyCell key={step.id} step={step} />
    if (lane.id === 'operation') return <OperationCell key={step.id} step={step} />
    if (lane.id.startsWith('actor__')) {
      return <ActorCell key={step.id} step={step} actorName={lane.matchName || lane.label} />
    }
    if (lane.id.startsWith('custom__')) return <CustomCell key={step.id} step={step} laneId={lane.id} />
    return <div key={step.id} className="j-cell">{empty()}</div>
  }

  return (
    <div className="j-row">
      <div className="j-label">{lane.label}</div>
      <div className="j-cells">
        <div className="cells-row">{steps.map(renderCell)}</div>
      </div>
    </div>
  )
}
