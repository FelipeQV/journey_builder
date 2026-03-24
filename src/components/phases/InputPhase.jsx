import { useState } from 'react'

export default function InputPhase({ onExtract, loading, loadingMsg, error }) {
  const [key, setKey] = useState(() => sessionStorage.getItem('uj_key') || '')
  const [keySaved, setKeySaved] = useState(!!sessionStorage.getItem('uj_key'))
  const [input, setInput] = useState('')

  function saveKey() {
    if (!key.trim()) return
    sessionStorage.setItem('uj_key', key.trim())
    setKeySaved(true)
  }

  function handleExtract() {
    if (!input.trim()) return
    const k = key.trim() || sessionStorage.getItem('uj_key') || ''
    onExtract(k, input)
  }

  return (
    <>
      <div className="apikey-section">
        <span className="p-label">API Key</span>
        <div className="apikey-row">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-ant-..."
          />
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '9px 14px', fontSize: 12 }} onClick={saveKey}>
            Save
          </button>
        </div>
        <div className={`key-status ${keySaved ? 'ok' : 'missing'}`}>
          {keySaved ? 'Key saved for this session' : 'No key — required for extraction'}
        </div>
      </div>

      <div className="panel-section">
        <span className="p-label" style={{ marginTop: 4 }}>Raw input</span>
      </div>
      <div className="input-grow">
        <textarea
          id="raw-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste transcript, brief, process description, or notes..."
          rows={10}
          style={{ flex: 1, height: '100%' }}
        />
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        {loading ? (
          <div className="loading-state active">
            <div className="spinner" />
            <span>{loadingMsg}</span>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={handleExtract} disabled={!input.trim()}>
            ↗ Extract journey
          </button>
        )}
        {error && <div className="error-msg" style={{ marginTop: 8, marginLeft: 0, marginRight: 0 }}>{error}</div>}
      </div>
    </>
  )
}
