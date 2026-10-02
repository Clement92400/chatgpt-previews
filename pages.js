// Usage : BASE_URL=https://<user>.github.io/<repo> node pages.js leads.csv out
// Génère out/p/<id>/index.html avec og:image -> aperçu image dans les DM LinkedIn
const fs = require('fs'), path = require('path')
const [csv = 'leads.csv', out = 'out'] = process.argv.slice(2)
const BASE = process.env.BASE_URL || 'https://EXAMPLE.github.io/repo'
const [h, ...rows] = fs.readFileSync(csv, 'utf8').trim().split(/\r?\n/).map(l => l.split(','))
for (const r of rows) {
  const l = Object.fromEntries(h.map((k, i) => [k, r[i] || '']))
  const img = `${BASE}/${l.id}_${l.prenom}.png`
  const html = `<!doctype html><html><head><meta charset="utf-8">
<meta property="og:title" content="${l.question}">
<meta property="og:description" content="Réponse ChatGPT">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="628">
<meta name="twitter:card" content="summary_large_image">
<title>${l.question}</title></head><body style="margin:0;background:#212121">
<img src="${img}" style="max-width:100%"></body></html>`
  fs.mkdirSync(path.join(out, 'p', l.id), { recursive: true })
  fs.writeFileSync(path.join(out, 'p', l.id, 'index.html'), html)
  console.log(`[OK] ${BASE}/p/${l.id}/`)
}
