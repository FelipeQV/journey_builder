import { useState } from 'react'
import LeftPanel from './components/LeftPanel'
import JourneyCanvas from './components/canvas/JourneyCanvas'
import IndexScreen from './screens/IndexScreen'
import { extractJourney, applyInstruction } from './lib/api'
import { saveEntry } from './lib/storage'

const LOADING_MSGS = ['Reading input...', 'Identifying steps...', 'Structuring lanes...', 'Building annotations...']

export default function App() {
  const [screen, setScreen] = useState('index') // 'index' | 'builder'
  const [phase, setPhase] = useState(1)
  const [journey, setJourney] = useState(null)
  const [selectedLanes, setSelectedLanes] = useState([])
  const [metadata, setMetadata] = useState({})
  const [entryId, setEntryId] = useState(null) // id of currently open saved entry
  const [loading, setLoading] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [error, setError] = useState(null)
  const [saveFlash, setSaveFlash] = useState(false)
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

  // ── Index actions ────────────────────────────────────────────────────────
  function handleNew({ journey: prefillJourney, prefill } = {}) {
    setEntryId(null)
    setJourney(prefillJourney || null)
    setSelectedLanes(prefillJourney?.proposed_lanes?.filter((l) => l.enabled !== false) || [])
    setMetadata({})
    setPhase(prefill && prefillJourney ? 3 : 1)
    setScreen('builder')
  }

  function handleOpenEntry(entry) {
    setEntryId(entry.id)
    setJourney(entry.journey)
    setSelectedLanes(entry.selectedLanes || [])
    setMetadata(entry.metadata || {})
    setPhase(0)
    setScreen('builder')
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  function handleSave() {
    const id = entryId || Date.now()
    saveEntry({ id, savedAt: new Date().toISOString(), journey, selectedLanes, metadata })
    setEntryId(id)
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 2000)
  }

  // ── Phase 1 → 2 ──────────────────────────────────────────────────────────
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

  // ── Phase 2 → 3 ──────────────────────────────────────────────────────────
  function handleLanesConfirmed(lanes) {
    setSelectedLanes(lanes)
    setPhase(3)
  }

  // ── Phase 3: live edits ───────────────────────────────────────────────────
  function handleStepsChange(steps) {
    setJourney((j) => ({ ...j, steps }))
  }

  // ── Phase 3: apply targeted instruction ──────────────────────────────────
  async function handleApplyInstruction(instruction) {
    const key = sessionStorage.getItem('uj_key') || ''
    if (!key) return setError('API key missing.')
    startLoading()
    try {
      const updated = await applyInstruction(key, journey, instruction)
      setJourney(updated)
    } catch (err) {
      setError('Failed: ' + err.message)
    } finally {
      stopLoading()
    }
  }

  // ── Phase 3 → 4 ──────────────────────────────────────────────────────────
  function handleStepsConfirmed() { setPhase(4) }

  // ── Phase 4 → 5 ──────────────────────────────────────────────────────────
  function handleMetadataSave(meta) {
    setMetadata(meta)
    setPhase(5)
  }

  // ── Phase 0: edit from view ───────────────────────────────────────────────
  function handleEditFromView() { setPhase(3) }

  // ── Full reset (Start over) ───────────────────────────────────────────────
  function reset() {
    setPhase(1)
    setJourney(null)
    setSelectedLanes([])
    setMetadata({})
    setEntryId(null)
    setError(null)
  }

  const showCanvas = (phase === 0 || phase >= 3) && journey

  if (screen === 'index') {
    return (
      <div className="app">
        <header>
          <span className="logo">Journey <span>Builder</span></span>
          <span className="badge">Chaos Thinkers</span>
        </header>
        <IndexScreen onNew={handleNew} onOpen={handleOpenEntry} />
      </div>
    )
  }

  return (
    <div className="app">
      <header>
        <span className="logo">Journey <span>Builder</span></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {(phase === 0 || phase >= 3) && (
            <button
              onClick={handleSave}
              style={{
                fontSize: 12, padding: '5px 14px', borderRadius: 6,
                border: '1px solid rgba(255,255,255,.15)', background: saveFlash ? '#b8e04a' : 'transparent',
                color: saveFlash ? '#1a1a18' : '#fff', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all .2s'
              }}
            >
              {saveFlash ? '✓ Saved' : 'Save'}
            </button>
          )}
          <button
            onClick={() => setScreen('index')}
            style={{ fontSize: 12, padding: '5px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,.15)', background: 'transparent', color: '#aaa', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ← Index
          </button>
          <span className="badge">Chaos Thinkers</span>
        </div>
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
          onApplyInstruction={handleApplyInstruction}
          onStepsConfirmed={handleStepsConfirmed}
          onStepsBack={() => setPhase(2)}
          onMetadataSave={handleMetadataSave}
          onMetadataBack={() => setPhase(3)}
          onExportBack={() => setPhase(4)}
          onEditFromView={handleEditFromView}
          onReset={reset}
          onBackToIndex={() => {
            if (phase >= 3 && !window.confirm('You have unsaved changes. Leave anyway?')) return
            setScreen('index')
          }}
        />

        <div className="panel-right">
          {showCanvas ? (
            <div id="journey-output-wrap">
              <JourneyCanvas journey={journey} selectedLanes={selectedLanes} metadata={metadata} />
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
