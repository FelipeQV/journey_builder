import { useState } from 'react'
import {
  DndContext, PointerSensor, useSensor, useSensors,
  DragOverlay, closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function DragHandle() {
  return (
    <span style={{ cursor: 'grab', color: '#ccc', fontSize: 14, padding: '0 4px', lineHeight: 1, userSelect: 'none' }}>⠿</span>
  )
}

function LaneItem({ lane, onToggle, onRename, dragHandleProps, isDragging }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(lane.label)

  function commitRename() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== lane.label) onRename(lane.id, trimmed)
    else setDraft(lane.label)
    setEditing(false)
  }

  return (
    <div className={`lane-item ${lane.enabled ? 'checked' : ''}`} style={{ opacity: isDragging ? 0.4 : 1 }}>
      <span {...dragHandleProps}><DragHandle /></span>

      <div className="lane-check" onClick={() => onToggle(lane.id)} style={{ cursor: 'pointer', flexShrink: 0 }}>
        {lane.enabled && <span className="lane-check-icon">✓</span>}
      </div>

      {editing ? (
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitRename()
            if (e.key === 'Escape') { setDraft(lane.label); setEditing(false) }
          }}
          onClick={(e) => e.stopPropagation()}
          style={{ flex: 1, fontSize: 13, fontWeight: 500, border: 'none', borderBottom: '1px solid #b8e04a', outline: 'none', background: 'transparent', fontFamily: 'inherit', padding: '1px 0' }}
        />
      ) : (
        <span className="lane-name" onClick={() => onToggle(lane.id)} style={{ flex: 1, cursor: 'pointer' }}>
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
        >✎</button>
      )}

      {lane.id.startsWith('actor__') && <span className="lane-tag">actor</span>}
      {lane.id.startsWith('custom__') && <span className="lane-tag">custom</span>}
    </div>
  )
}

function SortableLaneItem({ lane, activeId, onToggle, onRename }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lane.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
      <LaneItem
        lane={lane}
        isDragging={activeId === lane.id}
        onToggle={onToggle}
        onRename={onRename}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

export default function LaneSelectPhase({ proposedLanes, onConfirm, onBack }) {
  const [lanes, setLanes] = useState(
    proposedLanes.map((l) => ({ ...l, enabled: true, matchName: l.matchName || l.label }))
  )
  const [customName, setCustomName] = useState('')
  const [customGroup, setCustomGroup] = useState('backstage')
  const [activeId, setActiveId] = useState(null)

  function reset() {
    setLanes(proposedLanes.map((l) => ({ ...l, enabled: true, matchName: l.matchName || l.label })))
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const frontstage = lanes.filter((l) => l.group === 'frontstage')
  const backstage = lanes.filter((l) => l.group === 'backstage')

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

  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over || active.id === over.id) return

    setLanes((prev) => {
      const activeIdx = prev.findIndex((l) => l.id === active.id)
      const overIdx = prev.findIndex((l) => l.id === over.id)
      const activeLane = prev[activeIdx]
      const overLane = prev[overIdx]

      // If dropping into a different group, switch group then move
      if (activeLane.group !== overLane.group) {
        const updated = prev.map((l) => l.id === active.id ? { ...l, group: overLane.group } : l)
        return arrayMove(updated, activeIdx, overIdx)
      }

      return arrayMove(prev, activeIdx, overIdx)
    })
  }

  const activeLane = lanes.find((l) => l.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="panel-section" style={{ paddingBottom: 10 }}>
        <span className="p-label">Select lanes</span>
        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>
          Drag ⠿ to reorder or move between groups · ✎ to rename
        </p>
      </div>

      {frontstage.length > 0 && (
        <>
          <div style={{ padding: '8px 20px 4px', fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Frontstage
          </div>
          <SortableContext items={frontstage.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="lane-list" style={{ paddingTop: 0 }}>
              {frontstage.map((lane) => (
                <SortableLaneItem key={lane.id} lane={lane} activeId={activeId} onToggle={toggle} onRename={rename} />
              ))}
            </div>
          </SortableContext>
        </>
      )}

      {backstage.length > 0 && (
        <>
          <div style={{ padding: '8px 20px 4px', fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Backstage
          </div>
          <SortableContext items={backstage.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="lane-list" style={{ paddingTop: 0 }}>
              {backstage.map((lane) => (
                <SortableLaneItem key={lane.id} lane={lane} activeId={activeId} onToggle={toggle} onRename={rename} />
              ))}
            </div>
          </SortableContext>
        </>
      )}

      <DragOverlay>
        {activeLane && (
          <LaneItem lane={activeLane} onToggle={() => {}} onRename={() => {}} dragHandleProps={{}} />
        )}
      </DragOverlay>

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
        <button className="btn btn-ghost" onClick={reset} style={{ flex: 1 }}>Reset</button>
        <button
          className="btn btn-primary"
          onClick={() => onConfirm(lanes.filter((l) => l.enabled))}
          style={{ flex: 2 }}
          disabled={!lanes.some((l) => l.enabled)}
        >
          Confirm lanes →
        </button>
      </div>
    </DndContext>
  )
}
