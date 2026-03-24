export default function DotRow({ steps }) {
  return (
    <div className="j-row">
      <div className="j-label dot-label-cell">·</div>
      <div className="j-cells dot-cells-wrap">
        <div className="cells-row">
          {steps.map((step) => (
            <div key={step.id} className="dot-cell">
              <div className="dot" />
              <div className="dot-step-label">{step.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
