// Generates a fully self-contained HTML file from the rendered canvas DOM node
export function exportHTML(journeyData, metadata) {
  const canvasEl = document.getElementById('journey-output')
  if (!canvasEl) return

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules).map((r) => r.cssText).join('\n')
      } catch {
        return ''
      }
    })
    .join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(journeyData.title || 'Journey')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', system-ui, sans-serif; background: #f5f4f0; padding: 24px; }
${styles}
</style>
</head>
<body>
<div id="journey-output-wrap">
${canvasEl.outerHTML}
</div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const filename = (journeyData.title || 'journey').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  a.href = url
  a.download = `${filename}.html`
  a.click()
  URL.revokeObjectURL(url)
}

function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
