import { exportHTML } from '../../lib/export'

export default function CanvasViewPhase({ journey, metadata, onEdit, onBackToIndex }) {
  const title = metadata?.name || journey?.title || 'Untitled'
  const stepCount = journey?.steps?.length || 0

  return (
    <>
      <div className="panel-section" style={{ paddingTop: 20, paddingBottom: 10 }}>
        <span className="p-label">Journey</span>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a18', marginBottom: 4 }}>{title}</div>
        {journey?.persona && <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{journey.persona}</div>}
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>{stepCount} steps</div>
      </div>

      {(metadata?.project || metadata?.client || metadata?.version) && (
        <div style={{ padding: '0 20px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {metadata.project && <span className="meta-tag">{metadata.project}</span>}
          {metadata.client && <span className="meta-tag">{metadata.client}</span>}
          {metadata.version && <span className="meta-tag">v{metadata.version}</span>}
        </div>
      )}

      <div className="divider" />

      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button className="btn btn-primary" onClick={onEdit}>Edit journey</button>
        <button className="btn btn-secondary" onClick={() => exportHTML(journey, metadata)}>
          ↓ Export HTML
        </button>
      </div>

      <div style={{ marginTop: 'auto', padding: '14px 20px', borderTop: '1px solid #e8e6e0' }}>
        <button className="btn btn-ghost" onClick={onBackToIndex} style={{ width: '100%' }}>
          ← Back to index
        </button>
      </div>
    </>
  )
}
