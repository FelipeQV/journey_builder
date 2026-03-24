const KEY = 'journey_index'

export function loadIndex() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

export function saveEntry(entry) {
  const index = loadIndex()
  const i = index.findIndex((e) => e.id === entry.id)
  if (i >= 0) index[i] = entry
  else index.unshift(entry)
  localStorage.setItem(KEY, JSON.stringify(index))
}

export function deleteEntry(id) {
  localStorage.setItem(KEY, JSON.stringify(loadIndex().filter((e) => e.id !== id)))
}

export function exportEntryJSON(entry) {
  const blob = new Blob([JSON.stringify(entry.journey, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(entry.metadata?.name || entry.journey?.title || 'journey').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.json`
  a.click()
  URL.revokeObjectURL(url)
}
