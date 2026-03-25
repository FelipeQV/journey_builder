import { useState } from 'react'
import { deleteEntry, exportEntryJSON } from '../lib/storage'

function JSONModal({ json, onClose }) {
  const text = JSON.stringify(json, null, 2)
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 900, height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #e8e6e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Journey JSON</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#aaa', lineHeight: 1 }}>×</button>
        </div>
        <textarea
          readOnly
          value={text}
          onFocus={(e) => e.target.select()}
          style={{ flex: 1, resize: 'none', border: 'none', padding: '14px 18px', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, color: '#333', outline: 'none', background: '#fafaf8' }}
        />
        <div style={{ padding: '10px 18px', borderTop: '1px solid #e8e6e0', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => { navigator.clipboard?.writeText(text) }}
            style={{ fontSize: 12, padding: '7px 16px', borderRadius: 6, border: '1px solid #e8e6e0', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Copy to clipboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default function JourneyCard({ entry, onOpen, onDelete }) {
  const { journey, metadata, savedAt } = entry
  const title = metadata?.name || journey?.title || 'Untitled'
  const subtitle = journey?.persona || ''
  const stepCount = journey?.steps?.length || 0
  const date = savedAt ? new Date(savedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const [showJSON, setShowJSON] = useState(false)

  function handleDelete(e) {
    e.stopPropagation()
    if (!window.confirm(`Delete "${title}"?`)) return
    deleteEntry(entry.id)
    onDelete()
  }

  function handleExport(e) {
    e.stopPropagation()
    exportEntryJSON(entry)
  }

  return (
    <>
      {showJSON && <JSONModal json={journey} onClose={() => setShowJSON(false)} />}
      <div className="journey-card" onClick={onOpen}>
        <div className="journey-card-body">
          <div className="journey-card-title">{title}</div>
          {subtitle && <div className="journey-card-subtitle">{subtitle}</div>}
          <div className="journey-card-meta">
            <span>{stepCount} step{stepCount !== 1 ? 's' : ''}</span>
            {metadata?.project && <span>{metadata.project}</span>}
            {metadata?.client && <span>{metadata.client}</span>}
            <span>{date}</span>
          </div>
        </div>
        <div className="journey-card-actions" onClick={(e) => e.stopPropagation()}>
          <button className="card-btn" onClick={onOpen}>Open</button>
          <button className="card-btn" onClick={(e) => { e.stopPropagation(); setShowJSON(true) }}>JSON</button>
          <button className="card-btn" onClick={handleExport}>↓ file</button>
          <button className="card-btn card-btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </>
  )
}
