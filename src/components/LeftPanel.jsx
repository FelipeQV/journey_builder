import InputPhase from './phases/InputPhase'
import LaneSelectPhase from './phases/LaneSelectPhase'
import StepReviewPhase from './phases/StepReviewPhase'
import MetadataPhase from './phases/MetadataPhase'
import ExportPhase from './phases/ExportPhase'

const PHASE_LABELS = ['Input', 'Lanes', 'Steps', 'Metadata', 'Export']

export default function LeftPanel({
  phase,
  journey,
  selectedLanes,
  metadata,
  loading,
  loadingMsg,
  error,
  onExtract,
  onLanesConfirmed,
  onLanesBack,
  onStepsChange,
  onRebuild,
  onStepsConfirmed,
  onStepsBack,
  onMetadataSave,
  onMetadataBack,
  onExportBack,
  onReset,
}) {
  return (
    <div className="panel-left">
      {/* Phase indicator */}
      <div className="phase-indicator">
        {PHASE_LABELS.map((label, i) => {
          const phaseIndex = i + 1
          let state = ''
          if (phaseIndex < phase) state = 'done'
          else if (phaseIndex === phase) state = 'active'
          return <div key={i} className={`phase-dot ${state}`} title={label} />
        })}
        <span className="phase-label">
          <strong>{PHASE_LABELS[phase - 1]}</strong>
        </span>
      </div>

      {phase === 1 && (
        <InputPhase
          onExtract={onExtract}
          loading={loading}
          loadingMsg={loadingMsg}
          error={error}
        />
      )}

      {phase === 2 && journey && (
        <LaneSelectPhase
          proposedLanes={journey.proposed_lanes || []}
          onConfirm={onLanesConfirmed}
          onBack={onLanesBack}
        />
      )}

      {phase === 3 && journey && (
        <StepReviewPhase
          key={journey.steps?.map(s => s.id).join(',')}
          steps={journey.steps || []}
          selectedLanes={selectedLanes}
          onStepsChange={onStepsChange}
          onRebuild={onRebuild}
          onConfirm={onStepsConfirmed}
          onBack={onStepsBack}
          loading={loading}
          loadingMsg={loadingMsg}
          error={error}
        />
      )}

      {phase === 4 && (
        <MetadataPhase
          initialMetadata={metadata}
          onSave={onMetadataSave}
          onBack={onMetadataBack}
        />
      )}

      {phase === 5 && journey && (
        <ExportPhase
          journey={journey}
          metadata={metadata}
          onBack={onExportBack}
          onReset={onReset}
        />
      )}
    </div>
  )
}
