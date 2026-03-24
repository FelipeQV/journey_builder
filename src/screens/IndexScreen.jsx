import { useState, useRef } from 'react'
import JourneyCard from './JourneyCard'
import { loadIndex } from '../lib/storage'

export default function IndexScreen({ onNew, onOpen }) {
  const [entries, setEntries] = useState(() => loadIndex())
  const [importError, setImportError] = useState(null)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const fileRef = useRef()

  function refresh() {
    setEntries(loadIndex())
  }

  function handleImportText() {
    try {
      const journey = JSON.parse(importText.trim())
      onNew({ journey, prefill: true })
    } catch {
      setImportError('Invalid JSON — check the format and try again.')
    }
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const journey = JSON.parse(ev.target.result)
        onNew({ journey, prefill: true })
      } catch {
        setImportError('Could not parse file — make sure it is a valid journey JSON.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="index-screen">
      <div className="index-header">
        <div>
          <div className="index-title">Journey <span>Index</span></div>
          <div className="index-subtitle">Your saved journey maps</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => setShowImport((v) => !v)}>
            Import JSON
          </button>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => onNew({})}>
            + New journey
          </button>
        </div>
      </div>

      {showImport && (
        <div className="import-panel">
          <span className="p-label">Paste journey JSON</span>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{ "title": "...", "steps": [...] }'
            rows={5}
            style={{ marginTop: 6 }}
          />
          {importError && <div className="error-msg" style={{ margin: '6px 0 0' }}>{importError}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleImportText} disabled={!importText.trim()}>
              Load JSON
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => fileRef.current.click()}>
              From file
            </button>
            <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportFile} />
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="index-empty">
          <div className="empty-icon">⬡</div>
          <p>No journeys saved yet. Create your first one.</p>
        </div>
      ) : (
        <div className="index-grid">
          {entries.map((entry) => (
            <JourneyCard
              key={entry.id}
              entry={entry}
              onOpen={() => onOpen(entry)}
              onDelete={refresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}
