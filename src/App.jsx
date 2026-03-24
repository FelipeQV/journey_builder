import { useState } from 'react'
import LeftPanel from './components/LeftPanel'
import JourneyCanvas from './components/canvas/JourneyCanvas'
import { extractJourney, rebuildJourney } from './lib/api'

const LOADING_MSGS = ['Reading input...', 'Identifying steps...', 'Structuring lanes...', 'Building annotations...']

export default function App() {
  const [phase, setPhase] = useState(1)
  const [journey, setJourney] = useState(null)
  const [selectedLanes, setSelectedLanes] = useState([])
  const [metadata, setMetadata] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [error, setError] = useState(null)
  const [msgTimer, setMsgTimer] = useState(null)

  function startLoading() {
    setLoading(true)
    setError(null)
    setLoadingMsgIdx(0)
    const t = setInterval(() => setLoadingMsgIdx((i) => (i + 1) % LOADING_MSGS.length), 1400)
    setMsgTimer(t)
  }

  function stopLoading() {
    setLoading(false)
    clearInterval(msgTimer)
  }

  // Phase 1 → 2
  async function handleExtract(key, rawInput) {
    if (!key) return setError('Set your API key first.')
    startLoading()
    try {
      const data = await extractJourney(key, rawInput)
      setJourney(data)
      setPhase(2)
    } catch (err) {
      setError('Extraction failed: ' + err.message)
    } finally {
      stopLoading()
    }
  }

  // Phase 2 → 3
  function handleLanesConfirmed(lanes) {
    setSelectedLanes(lanes)
    setPhase(3)
  }

  // Phase 3: live step edits from editor → keep journey in sync
  function handleStepsChange(steps) {
    setJourney((j) => ({ ...j, steps }))
  }

  // Phase 3: rebuild
  async function handleRebuild(editedSteps) {
    const key = sessionStorage.getItem('uj_key') || ''
    if (!key) return setError('API key missing.')
    startLoading()
    try {
      const rebuilt = await rebuildJourney(key, journey, editedSteps, selectedLanes)
      setJourney(rebuilt)
    } catch (err) {
      setError('Rebuild failed: ' + err.message)
    } finally {
      stopLoading()
    }
  }

  // Phase 3 → 4
  function handleStepsConfirmed() {
    setPhase(4)
  }

  // Phase 4 → 5
  function handleMetadataSave(meta) {
    setMetadata(meta)
    setPhase(5)
  }

  function reset() {
    setPhase(1)
    setJourney(null)
    setSelectedLanes([])
    setMetadata({})
    setError(null)
  }

  const showCanvas = phase >= 3 && journey

  return (
    <div className="app">
      <header>
        <span className="logo">Journey <span>Builder</span></span>
        <span className="badge">Chaos Thinkers</span>
      </header>
      <main>
        <LeftPanel
          phase={phase}
          journey={journey}
          selectedLanes={selectedLanes}
          metadata={metadata}
          loading={loading}
          loadingMsg={LOADING_MSGS[loadingMsgIdx]}
          error={error}
          onExtract={handleExtract}
          onLanesConfirmed={handleLanesConfirmed}
          onLanesBack={() => setPhase(1)}
          onStepsChange={handleStepsChange}
          onRebuild={handleRebuild}
          onStepsConfirmed={handleStepsConfirmed}
          onStepsBack={() => setPhase(2)}
          onMetadataSave={handleMetadataSave}
          onMetadataBack={() => setPhase(3)}
          onExportBack={() => setPhase(4)}
          onReset={reset}
        />

        <div className="panel-right">
          {showCanvas ? (
            <div id="journey-output-wrap">
              <JourneyCanvas
                journey={journey}
                selectedLanes={selectedLanes}
                metadata={metadata}
              />
              {phase === 5 && (
                <div className="export-row">
                  <span style={{ fontSize: 12, color: '#aaa' }}>Use the export panel on the left to download</span>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">⬡</div>
              <p>
                {phase === 1 && 'Set your API key and paste input to extract a journey.'}
                {phase === 2 && 'Select the lanes you want to include.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
