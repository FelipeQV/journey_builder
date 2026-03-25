import { useState } from 'react'

function ActorEditor({ actors = [], actorLanes = [], onChange }) {
  function resolveLabel(actor) {
    const lane = actorLanes.find((l) => l.id === actor.lane_id)
    return lane ? lane.label : actor.lane_id || '?'
  }

  function updateActor(i, field, value) {
    onChange(actors.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
  }

  function addActor(laneId) {
    if (!laneId) return
    if (actors.find((a) => a.lane_id === laneId)) return
    onChange([...actors, { lane_id: laneId, action: '', is_exception: false }])
  }

  function removeActor(i) {
    onChange(actors.filter((_, idx) => idx !== i))
  }

  const availableToAdd = actorLanes.filter(
    (l) => !actors.find((a) => a.lane_id === l.id)
  )

  return (
    <div className="step-field">
      <label>Actors</label>
      {actors.map((actor, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8, padding: '8px 10px', background: '#fafaf8', borderRadius: 6, border: '1px solid #f0eeea' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#1a1a18', padding: '5px 0' }}>
              {resolveLabel(actor)}
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#c0392b', whiteSpace: 'nowrap', cursor: 'pointer', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
              <input
                type="checkbox"
                checked={!!actor.is_exception}
                onChange={(e) => updateActor(i, 'is_exception', e.target.checked)}
                style={{ width: 'auto', margin: 0 }}
              />
              Exception
            </label>
            <button onClick={() => removeActor(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 14, lineHeight: 1, padding: '0 2px' }} title="Remove actor">×</button>
          </div>
          <input
            type="text"
            value={actor.action}
            onChange={(e) => updateActor(i, 'action', e.target.value)}
            placeholder="What this actor does at this step"
            style={{ fontSize: 12, padding: '5px 8px' }}
          />
        </div>
      ))}
      {availableToAdd.length > 0 && (
        <select
          defaultValue=""
          onChange={(e) => { addActor(e.target.value); e.target.value = '' }}
          style={{ width: '100%', border: '1px dashed #ccc', borderRadius: 6, padding: '5px 10px', fontSize: 11, color: '#aaa', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent' }}
        >
          <option value="" disabled>+ Add actor</option>
          {availableToAdd.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      )}
    </div>
  )
}

function AutomationEditor({ automation = [], onChange }) {
  function update(i, field, value) {
    onChange(automation.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
  }
  function add() { onChange([...automation, { trigger: '', output: '' }]) }
  function remove(i) { onChange(automation.filter((_, idx) => idx !== i)) }

  return (
    <div className="step-field">
      <label>Automation</label>
      {automation.map((a, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6, padding: '7px 10px', background: '#fafaf8', borderRadius: 6, border: '1px solid #f0eeea' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="text" value={a.trigger} onChange={(e) => update(i, 'trigger', e.target.value)} placeholder="Trigger" style={{ flex: 1, fontSize: 12, padding: '4px 8px' }} />
            <span style={{ color: '#aaa', fontSize: 12 }}>→</span>
            <input type="text" value={a.output} onChange={(e) => update(i, 'output', e.target.value)} placeholder="Automated output" style={{ flex: 2, fontSize: 12, padding: '4px 8px' }} />
            <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 14, lineHeight: 1, padding: '0 2px' }}>×</button>
          </div>
        </div>
      ))}
      <button onClick={add} style={{ background: 'none', border: '1px dashed #ccc', borderRadius: 6, padding: '5px 10px', fontSize: 11, color: '#aaa', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
        + Add automation
      </button>
    </div>
  )
}

function TechEditor({ tech = [], onChange }) {
  function updateTech(i, field, value) {
    onChange(tech.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
  }
  function addTech() {
    onChange([...tech, { name: '', highlighted: false }])
  }
  function removeTech(i) {
    onChange(tech.filter((_, idx) => idx !== i))
  }
  return (
    <div className="step-field">
      <label>Technology enablers</label>
      {tech.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
          <input
            type="text"
            value={t.name}
            onChange={(e) => updateTech(i, 'name', e.target.value)}
            placeholder="System name"
            style={{ flex: 1, fontSize: 12, padding: '5px 8px' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#b8e04a', whiteSpace: 'nowrap', cursor: 'pointer', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
            <input
              type="checkbox"
              checked={!!t.highlighted}
              onChange={(e) => updateTech(i, 'highlighted', e.target.checked)}
              style={{ width: 'auto', margin: 0 }}
            />
            Key
          </label>
          <button onClick={() => removeTech(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 14, lineHeight: 1, padding: '0 2px' }}>×</button>
        </div>
      ))}
      <button
        onClick={addTech}
        style={{ background: 'none', border: '1px dashed #ccc', borderRadius: 6, padding: '5px 10px', fontSize: 11, color: '#aaa', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
      >
        + Add technology
      </button>
    </div>
  )
}

function StepItem({ step, index, onUpdate, onDelete, customLanes, actorLanes }) {
  const [open, setOpen] = useState(index === 0)

  function update(field, value) {
    onUpdate({ ...step, [field]: value })
  }

  return (
    <div className="step-item">
      <div className="step-header" onClick={() => setOpen((o) => !o)}>
        <span className="step-num">{index + 1}</span>
        <span className="step-title">{step.label || 'Untitled step'}</span>
        <span className={`step-chevron ${open ? 'open' : ''}`}>▼</span>
      </div>

      {open && (
        <div className="step-body">
          <div className="step-field">
            <label>Label</label>
            <input type="text" value={step.label || ''} onChange={(e) => update('label', e.target.value)} />
          </div>
          <div className="step-field">
            <label>Journey narrative</label>
            <textarea value={step.journey_narrative || ''} onChange={(e) => update('journey_narrative', e.target.value)} rows={2} />
          </div>
          <div className="step-field">
            <label>Touchpoints (comma-separated)</label>
            <input
              type="text"
              value={(step.touchpoint || []).join(', ')}
              onChange={(e) => update('touchpoint', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
          </div>
          <div className="step-field">
            <label>Data captured</label>
            <input type="text" value={step.data || ''} onChange={(e) => update('data', e.target.value)} />
          </div>
          <ActorEditor actors={step.actors || []} actorLanes={actorLanes} onChange={(actors) => update('actors', actors)} />
          <div className="step-field">
            <label>Happy path</label>
            <input type="text" value={step.happy_path || ''} onChange={(e) => update('happy_path', e.target.value)} placeholder="Ideal flow (max 12 words)" />
          </div>
          <div className="step-field">
            <label>Exception</label>
            <input type="text" value={step.exception || ''} onChange={(e) => update('exception', e.target.value)} placeholder="Failure or edge case (max 12 words)" />
          </div>
          <AutomationEditor automation={step.automation || []} onChange={(automation) => update('automation', automation)} />
          <TechEditor tech={step.technology || []} onChange={(technology) => update('technology', technology)} />
          {customLanes.map((lane) => (
            <div key={lane.id} className="step-field">
              <label>{lane.label}</label>
              <textarea
                value={step.custom_data?.[lane.id] || ''}
                onChange={(e) => update('custom_data', { ...step.custom_data, [lane.id]: e.target.value })}
                rows={2}
                placeholder={`Content for ${lane.label}`}
              />
            </div>
          ))}
          <button className="step-delete" onClick={() => onDelete(step.id)}>Remove step</button>
        </div>
      )}
    </div>
  )
}

export default function StepReviewPhase({ steps: initialSteps, selectedLanes = [], onStepsChange, onApplyInstruction, onConfirm, onBack, loading, loadingMsg, error }) {
  const [steps, setSteps] = useState(initialSteps)
  const [instruction, setInstruction] = useState('')
  const customLanes = selectedLanes.filter((l) => l.id.startsWith('custom__'))
  const actorLanes = selectedLanes.filter((l) => l.id.startsWith('actor__'))

  function applySteps(next) {
    setSteps(next)
    onStepsChange?.(next)
  }

  function updateStep(updated) {
    applySteps(steps.map((s) => s.id === updated.id ? updated : s))
  }

  function deleteStep(id) {
    applySteps(steps.filter((s) => s.id !== id))
  }

  function addStep() {
    const newId = `step_${Date.now()}`
    applySteps([...steps, { id: newId, label: 'New step', journey_narrative: '', touchpoint: [], data: '', actors: [], technology: [] }])
  }

  return (
    <>
      <div className="panel-section" style={{ paddingBottom: 10 }}>
        <span className="p-label">Review steps</span>
        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>Edit the steps below, then rebuild or confirm.</p>
      </div>

      <div className="step-list">
        {steps.map((step, i) => (
          <StepItem key={step.id} step={step} index={i} onUpdate={updateStep} onDelete={deleteStep} customLanes={customLanes} actorLanes={actorLanes} />
        ))}
      </div>

      <button className="add-step-btn" onClick={addStep}>+ Add step</button>

      {error && (
        <div className="error-msg" style={{ margin: '0 20px 8px' }}>{error}</div>
      )}

      <div style={{ padding: '12px 20px', borderTop: '1px solid #e8e6e0' }}>
        <span className="p-label" style={{ marginBottom: 6 }}>Ask Claude to change something</span>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder={'e.g. "Add a step about payment confirmation between steps 2 and 3" or "Fill in all empty automation fields"'}
          rows={3}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && instruction.trim() && !loading) { onApplyInstruction(instruction); setInstruction('') } }}
        />
        {error && <div className="error-msg" style={{ margin: '6px 0 0' }}>{error}</div>}
        {loading ? (
          <div className="loading-state active" style={{ padding: '8px 0 0' }}>
            <div className="spinner" /><span>{loadingMsg}</span>
          </div>
        ) : (
          <button
            className="btn btn-secondary"
            style={{ marginTop: 8 }}
            disabled={!instruction.trim()}
            onClick={() => { onApplyInstruction(instruction); setInstruction('') }}
          >
            ↗ Apply
          </button>
        )}
      </div>

      <div className="actions-row">
        <button className="btn btn-secondary" onClick={onBack} style={{ flex: 1 }}>← Back</button>
        <button className="btn btn-primary" onClick={() => onConfirm()} style={{ flex: 2 }}>Confirm →</button>
      </div>
    </>
  )
}
