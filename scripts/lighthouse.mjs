import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { extractMetrics, summarizeRuns } from './lighthouse-summary.mjs'

const PORT = 4173
const BASE_URL = `http://127.0.0.1:${PORT}`
const outputDirectory = resolve('lighthouse-results')
const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean)

function wait(milliseconds) { return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds)) }

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { if ((await fetch(`${BASE_URL}/before`)).ok) return } catch { /* preview chưa sẵn sàng */ }
    await wait(250)
  }
  throw new Error('Vite preview không khởi động sau 15 giây')
}

async function measurePage(chromePort, pageName) {
  const runs = []
  for (let run = 1; run <= 3; run += 1) {
    process.stdout.write(`Đo /${pageName} lần ${run}/3... `)
    const result = await lighthouse(`${BASE_URL}/${pageName}`, {
      port: chromePort,
      logLevel: 'error',
      output: ['json', 'html'],
      onlyCategories: ['performance'],
      formFactor: 'mobile',
      disableStorageReset: false,
    })
    if (!result) throw new Error(`Lighthouse không trả kết quả cho /${pageName}`)
    const reports = Array.isArray(result.report) ? result.report : [result.report]
    await writeFile(resolve(outputDirectory, `${pageName}-run-${run}.json`), JSON.stringify(result.lhr, null, 2))
    await writeFile(resolve(outputDirectory, `${pageName}-run-${run}.html`), reports[1] ?? reports[0])
    const metrics = extractMetrics(result.lhr)
    runs.push(metrics)
    process.stdout.write(`Performance ${metrics.performance}\n`)
  }
  return { runs, median: summarizeRuns(runs) }
}

async function main() {
  await mkdir(outputDirectory, { recursive: true })
  const chromePath = chromeCandidates.find((candidate) => existsSync(candidate))
  if (!chromePath) throw new Error('Không tìm thấy Google Chrome. Hãy đặt biến CHROME_PATH.')

  const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
  let chrome
  try {
    await waitForServer()
    chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'] })
    const before = await measurePage(chrome.port, 'before')
    const after = await measurePage(chrome.port, 'after')
    const summary = { measuredAt: new Date().toISOString(), runsPerPage: 3, mode: 'mobile', before, after }
    await writeFile(resolve(outputDirectory, 'summary.json'), JSON.stringify(summary, null, 2))
    console.log('Đã lưu kết quả tại lighthouse-results/summary.json')
  } finally {
    if (chrome) await chrome.kill()
    preview.kill()
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
