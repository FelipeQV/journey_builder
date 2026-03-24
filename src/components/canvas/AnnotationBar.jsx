const SECTION_LABELS = {
  customer_journey: 'Customer journey',
  operation: 'Operations',
  technology: 'Technology enablers',
}

export default function AnnotationBar({ annotations = [] }) {
  if (!annotations.length) return null
  return (
    <div className="ann-bar">
      <div className="ann-bar-row">
        <div className="ann-bar-spacer" />
        <div className="ann-bar-cells">
          <div className="ann-bar-inner">
            {annotations.map((a, i) => (
              <div key={i} className="ann-block">
                <div className="ann-tag">{SECTION_LABELS[a.section] || a.section}</div>
                <div className="ann-title">{a.title}</div>
                <div className="ann-desc">{a.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
