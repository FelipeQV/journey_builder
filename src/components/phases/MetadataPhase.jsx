import { useState } from 'react'

export default function MetadataPhase({ onSave, onBack, initialMetadata = {} }) {
  const [meta, setMeta] = useState({
    name: initialMetadata.name || '',
    date: initialMetadata.date || new Date().toISOString().slice(0, 10),
    project: initialMetadata.project || '',
    version: initialMetadata.version || '1.0',
    client: initialMetadata.client || '',
  })

  function update(field, value) {
    setMeta((m) => ({ ...m, [field]: value }))
  }

  return (
    <>
      <div className="panel-section" style={{ paddingBottom: 10 }}>
        <span className="p-label">Metadata</span>
        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>These fields appear in the journey header.</p>
      </div>

      <div className="metadata-form">
        {[
          { field: 'name', label: 'Journey name', placeholder: 'e.g. Onboarding v2' },
          { field: 'project', label: 'Project', placeholder: 'e.g. Mobile app redesign' },
          { field: 'client', label: 'Client', placeholder: 'e.g. Acme Corp' },
          { field: 'version', label: 'Version', placeholder: '1.0' },
          { field: 'date', label: 'Date', placeholder: '' },
        ].map(({ field, label, placeholder }) => (
          <div key={field} className="meta-field">
            <label>{label}</label>
            <input
              type="text"
              value={meta[field]}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>

      <div className="actions-row">
        <button className="btn btn-secondary" onClick={onBack} style={{ flex: 1 }}>← Back</button>
        <button className="btn btn-primary" onClick={() => onSave(meta)} style={{ flex: 2 }}>
          Apply metadata →
        </button>
      </div>
    </>
  )
}
