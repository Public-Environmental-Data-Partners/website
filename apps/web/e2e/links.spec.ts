import {type APIRequestContext, expect, type Page, test} from '@playwright/test'

/** Fallback seeds when sitemap is empty or unavailable during local runs. */
const FALLBACK_SEED_PATHS = [
  '/',
  '/about',
  '/advocacy',
  '/data-preservation',
  '/donate',
  '/get-involved',
  '/how-we-work',
  '/news-and-updates',
  '/privacy-policy',
  '/tool-development',
]

/**
 * Statuses that mean "URL exists / reachable" for bot-hostile hosts.
 * LinkedIn and similar often return 999/403 to automated clients.
 */
const REACHABLE_STATUSES = new Set([
  200, 201, 202, 203, 204, 206, 301, 302, 303, 307, 308, 401, 403, 405, 429, 999,
])

const EXTERNAL_REQUEST_TIMEOUT_MS = 15_000

type LinkKind = 'internal' | 'external' | 'mailto' | 'tel' | 'skip'

type ClassifiedLink = {
  href: string
  kind: LinkKind
  /** Absolute URL used for HTTP checks. */
  checkUrl?: string
  /** Pathname+search for internal crawl seeds. */
  path?: string
  /** Site paths where this href was discovered. */
  foundOn: Set<string>
}

type CrawlResult = {
  visited: Set<string>
  classified: Map<string, ClassifiedLink>
}

/** Shared across the serial suite so we only crawl once. */
let crawl: CrawlResult | undefined

/** Local baseURL plus the configured public site origin (sitemap / absolute CMS links). */
function sameSiteOrigins(localOrigin: string): Set<string> {
  const origins = new Set([localOrigin])
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://pedp-website.vercel.app'
  try {
    origins.add(new URL(configured).origin)
  } catch {
    // Ignore invalid env.
  }
  return origins
}

function classifyHref(
  raw: string,
  localOrigin: string,
  siteOrigins: Set<string>,
): Omit<ClassifiedLink, 'foundOn'> | null {
  const href = raw.trim()
  if (!href || href.startsWith('javascript:') || href.startsWith('data:')) {
    return null
  }

  if (href.startsWith('mailto:')) {
    return {href, kind: 'mailto'}
  }
  if (href.startsWith('tel:')) {
    return {href, kind: 'tel'}
  }
  // In-page anchors only; no network target.
  if (href.startsWith('#')) {
    return {href, kind: 'skip'}
  }

  let url: URL
  try {
    url = new URL(href, localOrigin)
  } catch {
    return {href, kind: 'skip'}
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return {href, kind: 'skip'}
  }

  const path = `${url.pathname}${url.search}` || '/'

  if (siteOrigins.has(url.origin)) {
    // Always verify against the local server under test.
    return {href, kind: 'internal', checkUrl: `${localOrigin}${path}`, path}
  }

  url.hash = ''
  return {href, kind: 'external', checkUrl: url.toString()}
}

function formatFoundOn(foundOn: Set<string>): string {
  return [...foundOn].sort().join(', ')
}

function isValidMailto(href: string): boolean {
  const address = href.slice('mailto:'.length).split('?')[0]?.trim() ?? ''
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)
}

function isValidTel(href: string): boolean {
  const number = href.slice('tel:'.length).trim()
  return /^\+?[\d().\-\s]{3,}$/.test(number)
}

async function pathsFromSitemap(request: APIRequestContext): Promise<string[]> {
  const response = await request.get('/sitemap.xml')
  if (!response.ok()) {
    return []
  }
  const xml = await response.text()
  const paths: string[] = []
  for (const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    const loc = match[1]?.trim()
    if (!loc) {
      continue
    }
    try {
      const url = new URL(loc)
      paths.push(`${url.pathname}${url.search}` || '/')
    } catch {
      // Ignore malformed sitemap entries.
    }
  }
  return paths
}

async function collectAnchors(page: Page): Promise<string[]> {
  return page.locator('a[href]').evaluateAll((anchors) =>
    anchors
      .map((anchor) => (anchor as HTMLAnchorElement).getAttribute('href') ?? '')
      .filter(Boolean),
  )
}

async function checkReachable(
  request: APIRequestContext,
  checkUrl: string,
  kind: 'internal' | 'external',
): Promise<string | null> {
  try {
    const response = await request.get(checkUrl, {
      maxRedirects: 10,
      timeout: kind === 'external' ? EXTERNAL_REQUEST_TIMEOUT_MS : 30_000,
      failOnStatusCode: false,
      headers: {
        'user-agent':
          'Mozilla/5.0 (compatible; PEDP-link-check/1.0; +https://github.com/Public-Environmental-Data-Partners/website)',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })
    const status = response.status()
    if (kind === 'internal') {
      return status < 400 ? null : `returned ${status}`
    }
    return REACHABLE_STATUSES.has(status) ? null : `returned ${status}`
  } catch (error) {
    const message = error instanceof Error ? error.message.split('\n')[0] : String(error)
    return message
  }
}

async function crawlSite(
  page: Page,
  request: APIRequestContext,
  baseURL: string | undefined,
): Promise<CrawlResult> {
  const localOrigin = new URL(baseURL ?? 'http://localhost:3000').origin
  const siteOrigins = sameSiteOrigins(localOrigin)
  const sitemapPaths = await pathsFromSitemap(request)
  const seedPaths = [...new Set([...sitemapPaths, ...FALLBACK_SEED_PATHS])]

  console.log(`[links] crawl start: ${seedPaths.length} seed path(s)`)

  const toVisit = [...seedPaths]
  const visited = new Set<string>()
  const classified = new Map<string, ClassifiedLink>()

  while (toVisit.length > 0) {
    const path = toVisit.shift()!
    if (visited.has(path)) {
      continue
    }
    visited.add(path)

    const navigation = await page.goto(path, {waitUntil: 'domcontentloaded'})
    expect(navigation, `navigate ${path}`).not.toBeNull()
    expect(navigation!.status(), `seed/crawl page ${path}`).toBeLessThan(400)

    const hrefs = await collectAnchors(page)
    for (const raw of hrefs) {
      const link = classifyHref(raw, localOrigin, siteOrigins)
      if (!link || link.kind === 'skip') {
        continue
      }
      const key = link.checkUrl ?? link.href
      const existing = classified.get(key)
      if (existing) {
        existing.foundOn.add(path)
      } else {
        classified.set(key, {...link, foundOn: new Set([path])})
      }
      if (link.kind === 'internal' && link.path && !visited.has(link.path)) {
        toVisit.push(link.path)
      }
    }
  }

  console.log(`[links] crawled ${visited.size} page(s); discovered ${classified.size} unique href(s)`)
  return {visited, classified}
}

test.describe('link crawl', () => {
  test.describe.configure({mode: 'serial'})

  test.beforeAll(async ({browser, request, baseURL}) => {
    test.setTimeout(300_000)
    const page = await browser.newPage()
    try {
      crawl = await crawlSite(page, request, baseURL)
    } finally {
      await page.close()
    }
  })

  test('internal links are reachable', async ({request}) => {
    test.setTimeout(120_000)
    expect(crawl, 'crawl completed in beforeAll').toBeTruthy()

    const {visited, classified} = crawl!
    const failures: string[] = []

    for (const link of classified.values()) {
      if (link.kind === 'mailto' && !isValidMailto(link.href)) {
        failures.push(`invalid mailto: ${link.href} (on ${formatFoundOn(link.foundOn)})`)
      }
      if (link.kind === 'tel' && !isValidTel(link.href)) {
        failures.push(`invalid tel: ${link.href} (on ${formatFoundOn(link.foundOn)})`)
      }
    }

    const toCheck = [...classified.values()].filter((link) => {
      if (link.kind !== 'internal' || !link.checkUrl) {
        return false
      }
      // Pages already loaded successfully during the crawl do not need a second GET.
      if (link.path && visited.has(link.path)) {
        return false
      }
      return true
    })

    console.log(`[links] checking ${toCheck.length} remaining internal URL(s)`)

    for (const [index, link] of toCheck.entries()) {
      console.log(`[links] internal ${index + 1}/${toCheck.length}: ${link.checkUrl}`)
      const error = await checkReachable(request, link.checkUrl!, 'internal')
      if (error) {
        failures.push(`${link.checkUrl} (on ${formatFoundOn(link.foundOn)}): ${error}`)
      }
    }

    expect(failures, `Broken internal links (${failures.length}):\n${failures.join('\n')}`).toEqual(
      [],
    )
  })

  test('external links (warn-only)', async ({request}) => {
    test.setTimeout(300_000)
    expect(crawl, 'crawl completed in beforeAll').toBeTruthy()

    const externals = [...crawl!.classified.values()].filter(
      (link) => link.kind === 'external' && link.checkUrl,
    )

    console.log(
      `[links] checking ${externals.length} external URL(s) (warnings only; does not fail CI)`,
    )

    const warnings: string[] = []

    for (const [index, link] of externals.entries()) {
      console.log(`[links] external ${index + 1}/${externals.length}: ${link.checkUrl}`)
      const error = await checkReachable(request, link.checkUrl!, 'external')
      if (error) {
        const line = `${link.checkUrl} (on ${formatFoundOn(link.foundOn)}): ${error}`
        warnings.push(line)
        console.warn(`[links:warn] ${line}`)
      }
    }

    if (warnings.length > 0) {
      const summary = `${warnings.length} external link warning(s):\n${warnings.join('\n')}`
      console.warn(`[links:warn] ${summary}`)
      test.info().annotations.push({
        type: 'external-link-warnings',
        description: summary,
      })
    } else {
      console.log('[links] all external links looked reachable')
    }
  })
})
