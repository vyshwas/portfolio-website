import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const root = path.resolve('dist')
const prefix = '/portfolio-website/'
const out = path.resolve('.verification')
await mkdir(out, { recursive: true })
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.pdf': 'application/pdf' }
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    if (!pathname.startsWith(prefix)) return response.writeHead(404).end()
    const file = path.resolve(root, pathname.slice(prefix.length) || 'index.html')
    if (!file.startsWith(root + path.sep)) return response.writeHead(403).end()
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
    response.end(await readFile(file))
  } catch { response.writeHead(404).end() }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = 'http://127.0.0.1:' + server.address().port + prefix
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true, args: ['--no-sandbox'],
})
const checks = []
const errors = []
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const check = (name, value) => { assert.ok(value, name); checks.push(name); console.log('PASS ' + name) }
const open = async (width = 1440, height = 900, options = {}) => {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  if (options.reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  if (options.dark) await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  if (options.noWebGL) await page.evaluateOnNewDocument(() => {
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return type.includes('webgl') ? null : getContext.call(this, type, ...args)
    }
  })
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push(response.status() + ' ' + response.url())
  })
  await page.goto(base, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await wait(options.reduced ? 150 : 2100)
  return page
}

try {
  const page = await open()
  check('Production hero works beneath the GitHub Pages subdirectory', await page.$eval('.paint-still', image => image.complete && image.naturalWidth > 1000))
  check('One named page heading', await page.$$eval('h1', headings => headings.length === 1 && headings[0].getAttribute('aria-label') === 'Vishwas Mehta'))
  check('Painting is animated with WebGL', await page.$eval('.paint-canvas', canvas => canvas.dataset.active === 'true' && canvas.dataset.running === 'true'))
  check('Three.js remains deferred until the lab', await page.evaluate(() => !performance.getEntriesByType('resource').some(resource => /three-.*\.js/.test(resource.name))))
  check('The hero has no scroll pin', await page.$eval('#hero', hero => !hero.parentElement.classList.contains('pin-spacer')))
  const canvas = await page.$('.paint-canvas')
  const firstFrame = Buffer.from(await canvas.screenshot())
  await page.mouse.move(1150, 400, { steps: 12 })
  await wait(900)
  const secondFrame = Buffer.from(await canvas.screenshot())
  check('The painted pixels actually change over time', !firstFrame.equals(secondFrame))
  await page.screenshot({ path: path.join(out, 'painting-desktop.png') })
  await page.click('.motion-toggle')
  check('Motion control switches to a complete static composition', await page.$eval('#hero', hero => hero.classList.contains('is-calm') && !hero.querySelector('.paint-canvas').dataset.running))
  check('Foreground motion stops with the same control', await page.$eval('.paint-flora', element => getComputedStyle(element).animationName === 'none'))
  await page.click('.motion-toggle')
  await page.waitForFunction(() => document.querySelector('.paint-canvas').dataset.running === 'true')
  check('Full motion can be re-enabled without a reload', true)
  await wait(1900)
  await page.click('.paint-primary')
  await page.waitForFunction(() => Math.abs(document.querySelector('#experiments').getBoundingClientRect().top - 88) < 4)
  check('Explore the work reaches selected projects', true)
  check('Painting rendering stops offscreen', await page.$eval('.paint-canvas', canvas => canvas.dataset.running === 'false'))
  check('Work navigation announces the active section', await page.$eval('.desktop-nav a[href="#experiments"]', link => link.getAttribute('aria-current') === 'location'))
  await page.click('.wordmark')
  await page.waitForFunction(() => scrollY < 2)
  await page.waitForFunction(() => document.querySelector('.paint-canvas').dataset.running === 'true')
  check('Back-to-top restores the moving painting', true)
  const resume = await page.$eval('.paint-secondary', a => a.href)
  check('Résumé still resolves to a PDF', (await fetch(resume)).status === 200)
  await page.focus('.paint-secondary')
  await page.keyboard.down('Shift')
  await page.keyboard.press('Tab')
  await page.keyboard.up('Shift')
  check('Keyboard focus remains visible on the primary action', await page.$eval('.paint-primary', button => document.activeElement === button && getComputedStyle(button).outlineStyle !== 'none'))
  await page.$eval('.paint-canvas', canvas => canvas.getContext('webgl').getExtension('WEBGL_lose_context').loseContext())
  await wait(1200)
  check('Lost graphics context falls back to the original painting', await page.$eval('.paint-canvas', canvas => !canvas.dataset.active && canvas.dataset.running === 'false' && getComputedStyle(canvas).opacity === '0'))
  await page.close()

  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1366, 768], [1920, 1080]]) {
    const device = await open(width, height, { reduced: true })
    const metrics = await device.evaluate(() => {
      const hero = document.querySelector('#hero').getBoundingClientRect()
      const titleFits = [...document.querySelectorAll('.paint-name')].every(name => {
        const text = document.createRange()
        text.selectNodeContents(name)
        const bounds = text.getBoundingClientRect()
        return bounds.right <= hero.right - 12 && bounds.left >= hero.left
      })
      const button = document.querySelector('.paint-primary').getBoundingClientRect()
      return { fits: document.documentElement.scrollWidth <= innerWidth, titleFits, actionVisible: button.bottom < innerHeight, still: !document.querySelector('.paint-canvas').dataset.active }
    })
    check(width + 'px: no overflow, readable heading and visible primary action', metrics.fits && metrics.titleFits && metrics.actionVisible)
    check(width + 'px: system reduced motion leaves an intact still painting', metrics.still)
    if (width === 390) {
      await device.screenshot({ path: path.join(out, 'painting-mobile.png') })
      await device.click('.mobile-toggle')
      await device.waitForSelector('dialog[open]')
      await device.keyboard.press('Tab')
      check('Mobile menu retains keyboard focus', await device.evaluate(() => document.querySelector('dialog').contains(document.activeElement)))
      await device.keyboard.press('Escape')
      await device.waitForFunction(() => !document.querySelector('dialog'))
      check('Escape closes mobile navigation and restores its trigger', await device.$eval('.mobile-toggle', button => document.activeElement === button))
      await device.click('.mobile-toggle')
      await device.click('dialog a[href="#experiments"]')
      await device.waitForFunction(() => !document.querySelector('dialog'))
      await device.waitForFunction(() => Math.abs(document.querySelector('#experiments').getBoundingClientRect().top - 88) < 4)
      check('Mobile Work navigation reaches the gallery', await device.$eval('#experiments', element => Math.abs(element.getBoundingClientRect().top - 88) < 4))
    }
    await device.close()
  }
  const fallback = await open(1440, 900, { noWebGL: true })
  check('Unavailable WebGL preserves the artwork and controls', await fallback.evaluate(() => document.querySelector('.paint-still').naturalWidth > 0 && !document.querySelector('.paint-canvas').dataset.active && document.querySelector('.paint-primary').getBoundingClientRect().bottom < innerHeight))
  await fallback.close()
  const dark = await open(1440, 900, { dark: true })
  await dark.screenshot({ path: path.join(out, 'painting-dark-system.png') })
  check('Dark system preference preserves the intended artwork palette', await dark.$eval('.paint-title', title => getComputedStyle(title).color === 'rgb(24, 60, 52)'))
  await dark.close()
  check('No page exceptions or missing production assets', errors.length === 0)
  await writeFile(path.join(out, 'painting-report.json'), JSON.stringify({ checks, errors }, null, 2))
  console.log(checks.length + ' checks passed')
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
