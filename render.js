// Usage : node render.js leads.csv out/
const fs = require('fs'), path = require('path'), { chromium } = require('playwright')
const [csv = 'leads.csv', out = 'out'] = process.argv.slice(2)
const CHROME = path.join(process.env.LOCALAPPDATA, 'ms-playwright/chromium-1234/chrome-win64/chrome.exe')
function parseCsv(t) { // CSV simple, pas de virgule dans les champs
  const [h, ...rows] = t.trim().split(/\r?\n/).map(l => l.split(','))
  return rows.map(r => Object.fromEntries(h.map((k, i) => [k, r[i] || ''])))
}
;(async () => {
  fs.mkdirSync(out, { recursive: true })
  const leads = parseCsv(fs.readFileSync(csv, 'utf8'))
  const browser = await chromium.launch({ executablePath: CHROME })
  const page = await browser.newPage({ viewport: { width: 1200, height: 628 } })
  await page.goto('file://' + path.resolve('template.html'))
  for (const l of leads) {
    const t0 = Date.now()
    await page.evaluate(l => {
      document.getElementById('q').textContent = l.question
      document.getElementById('intro').textContent = l.intro
      const noms = l.reponses.split('|'), doms = l.domaines.split('|')
      document.getElementById('list').innerHTML = noms.map((n, i) =>
        `<li>${n}<a>${doms[i] || ''}</a></li>`).join('')
    }, l)
    const file = path.join(out, `${l.id}_${l.prenom}.png`)
    await page.screenshot({ path: file })
    console.log(`[OK] ${file} (${Date.now() - t0} ms)`)
  }
  await browser.close()
})()
