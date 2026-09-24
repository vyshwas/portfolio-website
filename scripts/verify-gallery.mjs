import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const root = path.resolve('dist')
const prefix = '/portfolio-website/'
const output = path.resolve('.verification')
await mkdir(output, { recursive: true })
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.ttf': 'font/ttf' }
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
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
const checks = [], errors = []
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const check = (name, value) => { assert.ok(value, name); checks.push(name); console.log('PASS ' + name) }
const titles = page => page.$$eval('.work-caption h3', elements => elements.map(element => element.textContent))
const open = async (width = 1440, height = 1000, reduced = false) => {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1, hasTouch: width < 768 })
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push(response.status() + ' ' + response.url())
  })
  await page.goto(base, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  return page
}
const gallery = async page => {
  await page.evaluate(() => {
    const target = document.querySelector('#experiments').getBoundingClientRect().top + scrollY - 88
    if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true })
    else window.scrollTo({ top: target, behavior: 'instant' })
  })
  await pause(1050)
}
const filter = async (page, index) => {
  await page.click('.work-filters button:nth-child(' + index + ')')
  await pause(850)
}
const close = async page => {
  await page.$eval('dialog', dialog => Promise.all(dialog.getAnimations().map(animation => animation.finished.catch(() => {}))))
  await page.click('.workspace-close')
  await page.waitForFunction(() => !document.querySelector('dialog'))
}

try {
  const page = await open()
  await page.click('.desktop-nav a[href="#experiments"]')
  await page.waitForFunction(() => Math.abs(document.querySelector('#experiments').getBoundingClientRect().top - 88) < 4)
  await pause(1050)
  check('Work navigation reaches the new gallery beneath the Pages base path', true)
  check('All six existing projects retain their order', JSON.stringify(await titles(page)) === JSON.stringify(['Awara', 'Nocturne', 'Munim', 'Tuck', 'The Whole Fruit', 'Gamut']))
  check('Case-study actions are native, independently operable buttons', await page.$$eval('.work-piece', elements => elements.every(element => element.tagName === 'ARTICLE' && !element.hasAttribute('tabindex') && element.querySelector('.work-art').tagName === 'BUTTON' && !element.querySelector('.work-art button'))))
  await page.screenshot({ path: path.join(output, 'work-desktop.png') })
  await filter(page, 2)
  check('Product design filter shows all four product projects', JSON.stringify(await titles(page)) === JSON.stringify(['Awara', 'Nocturne', 'Munim', 'Tuck']))
  check('Selected filter is announced and keeps focus', await page.$eval('.work-filters button:nth-child(2)', button => button.getAttribute('aria-pressed') === 'true' && document.activeElement === button))
  await filter(page, 3)
  check('Brand and tools filter contains the two relevant projects', JSON.stringify(await titles(page)) === JSON.stringify(['The Whole Fruit', 'Gamut']))
  check('Result count updates accessibly', await page.$eval('.work-count', count => count.textContent === '2 projects' && count.getAttribute('aria-live') === 'polite'))
  await page.click('[data-project="whole-fruit"] .work-study')
  await page.waitForSelector('dialog[open]')
  check('Packaging case study opens with its original content', await page.$eval('.case-reader', reader => reader.textContent.includes('dissertation')))
  check('External brand-system destination is preserved', await page.$eval('.case-actions a', link => link.href === 'https://www.behance.net/vishwashmehta'))
  await page.keyboard.press('Tab')
  check('Focus stays inside the project dialog', await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)))
  await page.click('.next-project')
  await page.waitForFunction(() => document.querySelector('#project-title').textContent === 'Gamut')
  check('Next project follows the current gallery filter', true)
  check('Design-tool launch destination is preserved', await page.$eval('.case-actions a', link => link.href === 'https://vyshwas.github.io/gamut/'))
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => !document.querySelector('dialog'))
  check('Escape restores focus to the gallery trigger', await page.evaluate(() => document.activeElement.matches('[data-project="whole-fruit"] .work-study')))
  await gallery(page)
  await filter(page, 1)
  for (const index of [2, 3, 1, 3, 1]) await page.click('.work-filters button:nth-child(' + index + ')')
  await pause(900)
  check('Rapid filter changes settle on six unique projects', await page.$$eval('.work-piece', elements => elements.length === 6 && new Set(elements.map(element => element.dataset.project)).size === 6))

  for (const name of ['awara', 'nocturne', 'munim']) {
    await page.$eval('[data-project="' + name + '"]', element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await pause(1100)
    await page.focus('[data-project="' + name + '"] .work-demo')
    await page.keyboard.press('Enter')
    const iframe = await page.waitForSelector('iframe')
    const frame = await iframe.contentFrame()
    await frame.waitForFunction(() => document.readyState === 'complete')
    await page.$eval('dialog', dialog => Promise.all(dialog.getAnimations().map(animation => animation.finished.catch(() => {}))))
    check(name + ' prototype opens directly through the keyboard', await page.$eval('.workspace-modes button:nth-child(2)', button => button.getAttribute('aria-pressed') === 'true'))
    if (name === 'awara') {
      await frame.waitForSelector('button[data-go="home"]')
      await frame.click('button[data-go="home"]')
      await frame.waitForSelector('#s-home.active')
      check('Awara prototype moves from welcome to its home screen', true)
      await frame.focus('button[data-go="create"]')
      await page.keyboard.press('Escape')
      await page.waitForFunction(() => !document.querySelector('dialog'))
      check('Escape inside the prototype closes the workspace', true)
    } else if (name === 'nocturne') {
      await frame.waitForSelector('#simOk')
      await frame.click('#simOk')
      check('Nocturne simulation responds to input', await frame.$eval('#simOk', button => button.getAttribute('aria-pressed') === 'true'))
      await close(page)
    } else {
      await frame.waitForSelector('[data-act="ask"]')
      await frame.click('[data-act="ask"]')
      await frame.waitForSelector('[data-act="pin-jio"]')
      check('Munim opens a supervised payment request', true)
      await close(page)
    }
  }
  for (const name of ['tuck', 'gamut']) {
    await page.$eval('[data-project="' + name + '"]', element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await pause(1000)
    await page.click('[data-project="' + name + '"] .work-study')
    await page.waitForSelector('dialog[open]')
    check(name + ' case study remains available', await page.$eval('.case-reader', reader => reader.textContent.includes('The design decision')))
    if (name === 'tuck') check('Tuck does not advertise an unavailable external destination', await page.$$eval('.case-actions a', links => links.length === 0))
    await close(page)
  }
  await page.waitForFunction(() => [...document.querySelectorAll('.work-image img')].every(image => image.complete && image.naturalWidth > 0))
  check('Every project preview loads when browsed', true)
  await gallery(page)
  await filter(page, 3)
  await page.click('.desktop-nav a[href="#contact"]')
  await page.waitForFunction(() => {
    const box = document.querySelector('#contact').getBoundingClientRect()
    return box.top < 200 && box.bottom > 200
  })
  check('Navigation below the gallery remains correct after filtering', true)
  await page.close()

  for (const width of [320, 390, 768, 1366]) {
    const mobile = await open(width, 900, true)
    await gallery(mobile)
    check(width + 'px: gallery and filters fit without horizontal scrolling', await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth && [...document.querySelectorAll('.work-filters button')].every(button => button.getBoundingClientRect().right <= innerWidth)))
    await mobile.$eval('[data-project="awara"] .work-study', button => button.scrollIntoView({ block: 'center', behavior: 'instant' }))
    check(width + 'px: actions and descriptions are available without hover', await mobile.$eval('[data-project="awara"]', piece => getComputedStyle(piece.querySelector('.work-caption')).opacity === '1' && getComputedStyle(piece.querySelector('.work-study')).visibility === 'visible'))
    check(width + 'px: reduced-motion gallery is static', await mobile.$eval('.work-image', image => getComputedStyle(image).transform === 'none' && getComputedStyle(image).transitionDuration.split(',').every(duration => parseFloat(duration) < .001)))
    if (width === 390) {
      await gallery(mobile)
      await mobile.screenshot({ path: path.join(output, 'work-mobile.png') })
      await mobile.click('[data-project="awara"] .work-art')
      await mobile.waitForSelector('dialog[open]')
      check('Mobile artwork opens its case study', await mobile.$eval('#project-title', title => title.textContent === 'Awara'))
      check('Mobile case-study controls fit the viewport', await mobile.$eval('.workspace-header', header => header.scrollWidth <= innerWidth))
      await mobile.screenshot({ path: path.join(output, 'work-mobile-case-study.png') })
      await close(mobile)
      check('Mobile close restores the gallery without a scroll lock', await mobile.evaluate(() => document.documentElement.style.overflow === '' && document.activeElement.matches('[data-project="awara"] .work-art')))
      await gallery(mobile)
      await filter(mobile, 3)
      check('Mobile category filter works without animation', (await titles(mobile)).length === 2)
    }
    await mobile.close()
  }
  const capture = await open(1440, 1050, true)
  for (const name of ['awara', 'munim', 'whole-fruit', 'gamut']) {
    await capture.$eval('[data-project="' + name + '"]', element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await pause(180)
  }
  await capture.waitForFunction(() => [...document.querySelectorAll('.work-image img')].every(image => image.complete && image.naturalWidth > 0))
  await gallery(capture)
  await (await capture.$('#experiments')).screenshot({ path: path.join(output, 'work-gallery.png') })
  await capture.close()
  check('Gallery interactions produce no page exceptions or missing project assets', errors.length === 0)
  await writeFile(path.join(output, 'gallery-report.json'), JSON.stringify({ checks, errors }, null, 2))
  console.log(checks.length + ' checks passed')
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
