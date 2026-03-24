import { useState } from 'react'

function LaneItem({ lane, onToggle, onRename }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(lane.label)

  function commitRename() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== lane.label) onRename(lane.id, trimmed)
    else setDraft(lane.label)
    setEditing(false)
  }

  return (
    <div className={`lane-item ${lane.enabled ? 'checked' : ''}`}>
      <div
        className="lane-check"
        onClick={() => onToggle(lane.id)}
        style={{ cursor: 'pointer', flexShrink: 0 }}
      >
        {lane.enabled && <span className="lane-check-icon">✓</span>}
      </div>

      {editing ? (
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setDraft(lane.label); setEditing(false) } }}
          onClick={(e) => e.stopPropagation()}
          style={{ flex: 1, fontSize: 13, fontWeight: 500, border: 'none', borderBottom: '1px solid #b8e04a', outline: 'none', background: 'transparent', fontFamily: 'inherit', padding: '1px 0' }}
        />
      ) : (
        <span
          className="lane-name"
          onClick={() => onToggle(lane.id)}
          style={{ flex: 1, cursor: 'pointer' }}
        >
          {lane.label}
          {lane.matchName && lane.matchName !== lane.label && (
            <span style={{ fontSize: 10, color: '#bbb', marginLeft: 5 }}>({lane.matchName})</span>
          )}
        </span>
      )}

      {(lane.id.startsWith('actor__') || lane.id.startsWith('custom__')) && !editing && (
        <button
          onClick={(e) => { e.stopPropagation(); setEditing(true) }}
          title="Rename"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 11, padding: '0 2px', lineHeight: 1 }}
        >
          ✎
        </button>
      )}

      {lane.id.startsWith('actor__') && <span className="lane-tag">actor</span>}
      {lane.id.startsWith('custom__') && <span className="lane-tag">custom</span>}
    </div>
  )
}

export default function LaneSelectPhase({ proposedLanes, onConfirm, onBack }) {
  const [lanes, setLanes] = useState(
    proposedLanes.map((l) => ({ ...l, enabled: true, matchName: l.matchName || l.label }))
  )
  const [customName, setCustomName] = useState('')
  const [customGroup, setCustomGroup] = useState('backstage')

  function toggle(id) {
    setLanes((prev) => prev.map((l) => l.id === id ? { ...l, enabled: !l.enabled } : l))
  }

  function rename(id, newLabel) {
    setLanes((prev) => prev.map((l) => l.id === id ? { ...l, label: newLabel } : l))
  }

  function addCustom() {
    const name = customName.trim()
    if (!name) return
    const id = `custom__${name.toLowerCase().replace(/\s+/g, '_')}`
    if (lanes.find((l) => l.id === id)) return
    setLanes((prev) => [...prev, { id, label: name, matchName: name, group: customGroup, enabled: true }])
    setCustomName('')
  }

  const frontstage = lanes.filter((l) => l.group === 'frontstage')
  const backstage = lanes.filter((l) => l.group === 'backstage')

  function renderGroup(group) {
    return group.map((lane) => (
      <LaneItem key={lane.id} lane={lane} onToggle={toggle} onRename={rename} />
    ))
  }

  return (
    <>
      <div className="panel-section" style={{ paddingBottom: 10 }}>
        <span className="p-label">Select lanes</span>
        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>Check which lanes to include. Click ✎ to rename.</p>
      </div>

      {frontstage.length > 0 && (
        <>
          <div style={{ padding: '8px 20px 4px', fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Frontstage
          </div>
          <div className="lane-list" style={{ paddingTop: 0 }}>
            {renderGroup(frontstage)}
          </div>
        </>
      )}

      {backstage.length > 0 && (
        <>
          <div style={{ padding: '8px 20px 4px', fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Backstage
          </div>
          <div className="lane-list" style={{ paddingTop: 0 }}>
            {renderGroup(backstage)}
          </div>
        </>
      )}

      <div className="add-lane-row">
        <span className="p-label" style={{ fontSize: 10 }}>Add custom lane</span>
        <div className="add-lane-input">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Lane name"
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
          />
          <select
            value={customGroup}
            onChange={(e) => setCustomGroup(e.target.value)}
            style={{ border: '1px solid #e8e6e0', borderRadius: 8, padding: '9px 8px', fontSize: 12, fontFamily: 'inherit', background: '#fafaf8', color: '#1a1a18' }}
          >
            <option value="frontstage">Front</option>
            <option value="backstage">Back</option>
          </select>
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '9px 12px', fontSize: 12 }} onClick={addCustom}>+</button>
        </div>
      </div>

      <div className="actions-row">
        <button className="btn btn-secondary" onClick={onBack} style={{ flex: 1 }}>← Back</button>
        <button
          className="btn btn-primary"
          onClick={() => onConfirm(lanes.filter((l) => l.enabled))}
          style={{ flex: 2 }}
          disabled={!lanes.some((l) => l.enabled)}
        >
          Confirm lanes →
        </button>
      </div>
    </>
  )
}
