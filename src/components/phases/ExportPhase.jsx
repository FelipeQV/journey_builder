import { exportHTML } from '../../lib/export'

export default function ExportPhase({ journey, metadata, onBack, onReset }) {
  return (
    <>
      <div className="panel-section" style={{ paddingBottom: 10 }}>
        <span className="p-label">Export</span>
        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>Download your journey as a self-contained HTML file.</p>
      </div>

      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          className="btn btn-primary"
          onClick={() => exportHTML(journey, metadata)}
        >
          ↓ Download HTML file
        </button>
        <p style={{ fontSize: 11, color: '#aaa', lineHeight: 1.5, textAlign: 'center' }}>
          Opens in any browser · scrolls horizontally · no dependencies
        </p>
      </div>

      <div className="actions-row">
        <button className="btn btn-secondary" onClick={onBack} style={{ flex: 1 }}>← Back</button>
        <button className="btn btn-ghost" onClick={onReset} style={{ flex: 1 }}>Start over</button>
      </div>
    </>
  )
}
