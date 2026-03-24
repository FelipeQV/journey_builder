import { deleteEntry, exportEntryJSON } from '../lib/storage'

export default function JourneyCard({ entry, onOpen, onDelete }) {
  const { journey, metadata, savedAt } = entry
  const title = metadata?.name || journey?.title || 'Untitled'
  const subtitle = journey?.persona || ''
  const stepCount = journey?.steps?.length || 0
  const date = savedAt ? new Date(savedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''

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
        <button className="card-btn" onClick={handleExport}>JSON</button>
        <button className="card-btn card-btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
}
