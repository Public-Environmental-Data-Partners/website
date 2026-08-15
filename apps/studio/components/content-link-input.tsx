import {Badge, Box, Button, Card, Flex, Radio, Stack, Text, TextInput} from '@sanity/ui'
import {ChevronDown, ChevronRight, Link2} from 'lucide-react'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {type ObjectInputProps, set, unset, useClient} from 'sanity'

import {
  CONTENT_LINK_API_VERSION,
  type ContentLinkType,
  type ContentLinkValue,
  DATA_CATALOG_PATH,
  hrefForNewsPostSlug,
  hrefForSitePageSlug,
  isDataCatalogPath,
  isNewsHubPath,
  type NavGroupProjection,
  type NavLinkProjection,
  NEWS_HUB_PATH,
  normalizeInternalPath,
  PUBLISHED_NEWS_POSTS_QUERY,
  PUBLISHED_SITE_PAGES_QUERY,
  type PublishedPageProjection,
  type PublishedPostProjection,
  SITE_NAVIGATION_HIERARCHY_QUERY,
  type SiteNavigationProjection,
} from '../lib/content-link'

type ContentLinkInputProps = ObjectInputProps<ContentLinkValue>

type SelectedInternal =
  | {kind: 'reference'; ref: string; label: string; href: string}
  | {kind: 'path'; path: string; label: string}

function resolveNavLinkSelection(link: NavLinkProjection): SelectedInternal | null {
  const label = link.label?.trim() || link.sitePage?.title?.trim() || 'Untitled'
  const pageId = link.sitePage?._id
  const pageHref = hrefForSitePageSlug(link.sitePage?.slug)
  if (pageId && pageHref) {
    return {kind: 'reference', ref: pageId, label, href: pageHref}
  }
  const path = link.path?.trim() ? normalizeInternalPath(link.path) : ''
  if (path) {
    return {kind: 'path', path, label}
  }
  return null
}

function matchesQuery(label: string, href: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) {
    return true
  }
  return label.toLowerCase().includes(q) || href.toLowerCase().includes(q)
}

/**
 * Hierarchical Internal / External / Email link picker.
 * Patches follow Sanity Studio real-time patch guidance (`set` / `unset` with paths).
 * @see https://www.sanity.io/docs/studio/from-input-components-to-real-time-safe-patches
 */
export function ContentLinkInput(props: ContentLinkInputProps) {
  const {value, onChange, readOnly, schemaType} = props
  const client = useClient({apiVersion: CONTENT_LINK_API_VERSION})
  const objectTypeName = schemaType.name || 'contentLink'

  const [nav, setNav] = useState<SiteNavigationProjection | null>(null)
  const [pages, setPages] = useState<PublishedPageProjection[]>([])
  const [posts, setPosts] = useState<PublishedPostProjection[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [expandedGroupIds, setExpandedGroupIds] = useState<Record<string, boolean>>({})
  const [browseMode, setBrowseMode] = useState<'nav' | 'pages' | 'posts'>('nav')
  const [search, setSearch] = useState('')

  const linkType: ContentLinkType =
    value?.linkType === 'external' ? 'external' : value?.linkType === 'email' ? 'email' : 'internal'

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const publishedClient = client.withConfig({perspective: 'published'})
        const [navigation, sitePages, newsPosts] = await Promise.all([
          publishedClient.fetch<SiteNavigationProjection | null>(SITE_NAVIGATION_HIERARCHY_QUERY),
          publishedClient.fetch<PublishedPageProjection[]>(PUBLISHED_SITE_PAGES_QUERY),
          publishedClient.fetch<PublishedPostProjection[]>(PUBLISHED_NEWS_POSTS_QUERY),
        ])
        if (cancelled) {
          return
        }
        setNav(navigation)
        setPages(sitePages ?? [])
        setPosts(newsPosts ?? [])
        setLoadError(null)
      } catch (error) {
        if (cancelled) {
          return
        }
        setLoadError(error instanceof Error ? error.message : 'Failed to load link destinations')
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [client])

  const applyInternal = useCallback(
    (selection: SelectedInternal) => {
      if (readOnly) {
        return
      }
      if (selection.kind === 'reference') {
        onChange([
          set(objectTypeName, ['_type']),
          set('internal', ['linkType']),
          set({_type: 'reference', _ref: selection.ref}, ['internalReference']),
          unset(['internalPath']),
          unset(['externalUrl']),
          unset(['emailAddress']),
        ])
        return
      }
      onChange([
        set(objectTypeName, ['_type']),
        set('internal', ['linkType']),
        set(selection.path, ['internalPath']),
        unset(['internalReference']),
        unset(['externalUrl']),
        unset(['emailAddress']),
      ])
    },
    [objectTypeName, onChange, readOnly],
  )

  const applyLinkType = useCallback(
    (next: ContentLinkType) => {
      if (readOnly) {
        return
      }
      if (next === 'internal') {
        onChange([
          set(objectTypeName, ['_type']),
          set('internal', ['linkType']),
          unset(['externalUrl']),
          unset(['emailAddress']),
        ])
        return
      }
      if (next === 'external') {
        onChange([
          set(objectTypeName, ['_type']),
          set('external', ['linkType']),
          unset(['internalReference']),
          unset(['internalPath']),
          unset(['emailAddress']),
        ])
        return
      }
      onChange([
        set(objectTypeName, ['_type']),
        set('email', ['linkType']),
        unset(['internalReference']),
        unset(['internalPath']),
        unset(['externalUrl']),
      ])
    },
    [objectTypeName, onChange, readOnly],
  )

  const applyExternalUrl = useCallback(
    (nextUrl: string) => {
      if (readOnly) {
        return
      }
      const trimmed = nextUrl.trim()
      onChange([
        set(objectTypeName, ['_type']),
        set('external', ['linkType']),
        trimmed ? set(trimmed, ['externalUrl']) : unset(['externalUrl']),
        unset(['internalReference']),
        unset(['internalPath']),
        unset(['emailAddress']),
      ])
    },
    [objectTypeName, onChange, readOnly],
  )

  const applyEmailAddress = useCallback(
    (nextEmail: string) => {
      if (readOnly) {
        return
      }
      const trimmed = nextEmail.trim()
      onChange([
        set(objectTypeName, ['_type']),
        set('email', ['linkType']),
        trimmed ? set(trimmed, ['emailAddress']) : unset(['emailAddress']),
        unset(['internalReference']),
        unset(['internalPath']),
        unset(['externalUrl']),
      ])
    },
    [objectTypeName, onChange, readOnly],
  )

  const clearSelection = useCallback(() => {
    if (readOnly) {
      return
    }
    onChange([
      unset(['internalReference']),
      unset(['internalPath']),
      unset(['externalUrl']),
      unset(['emailAddress']),
    ])
  }, [onChange, readOnly])

  const selectedSummary = useMemo(() => {
    if (linkType === 'external') {
      const url = value?.externalUrl?.trim()
      return url ? {label: url, detail: 'External · opens in new tab'} : null
    }
    if (linkType === 'email') {
      const email = value?.emailAddress?.trim()
      return email ? {label: email, detail: 'Email · opens mail app'} : null
    }
    const path = value?.internalPath?.trim()
    if (path) {
      return {label: normalizeInternalPath(path), detail: 'Internal path · same tab'}
    }
    const ref = value?.internalReference?._ref
    if (!ref) {
      return null
    }
    const page = pages.find((entry) => entry._id === ref)
    if (page) {
      const href = hrefForSitePageSlug(page.slug) ?? ''
      return {
        label: page.title?.trim() || href || ref,
        detail: href ? `${href} · same tab` : 'Site page · same tab',
      }
    }
    const post = posts.find((entry) => entry._id === ref)
    if (post) {
      const href = hrefForNewsPostSlug(post.slug) ?? ''
      return {
        label: post.title?.trim() || href || ref,
        detail: href ? `${href} · same tab` : 'News post · same tab',
      }
    }
    return {label: ref, detail: 'Internal reference · same tab'}
  }, [
    linkType,
    pages,
    posts,
    value?.externalUrl,
    value?.emailAddress,
    value?.internalPath,
    value?.internalReference?._ref,
  ])

  const filteredPages = useMemo(
    () =>
      pages.filter((page) => {
        const href = hrefForSitePageSlug(page.slug) ?? ''
        return matchesQuery(page.title?.trim() || 'Untitled page', href, search)
      }),
    [pages, search],
  )

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const href = hrefForNewsPostSlug(post.slug) ?? ''
        return matchesQuery(post.title?.trim() || 'Untitled post', href, search)
      }),
    [posts, search],
  )

  const toggleGroup = useCallback((id: string) => {
    setExpandedGroupIds((current) => ({...current, [id]: !current[id]}))
  }, [])

  return (
    <Stack space={4}>
      <Stack space={3}>
        <Text size={1} weight="semibold">
          Link type
        </Text>
        <Flex gap={4}>
          <Flex as="label" align="center" gap={2}>
            <Radio
              checked={linkType === 'internal'}
              disabled={readOnly}
              onChange={() => applyLinkType('internal')}
            />
            <Text size={1}>Internal</Text>
          </Flex>
          <Flex as="label" align="center" gap={2}>
            <Radio
              checked={linkType === 'external'}
              disabled={readOnly}
              onChange={() => applyLinkType('external')}
            />
            <Text size={1}>External</Text>
          </Flex>
          <Flex as="label" align="center" gap={2}>
            <Radio
              checked={linkType === 'email'}
              disabled={readOnly}
              onChange={() => applyLinkType('email')}
            />
            <Text size={1}>Email</Text>
          </Flex>
        </Flex>
      </Stack>

      {selectedSummary ? (
        <Card padding={3} radius={2} shadow={1} tone="transparent" border>
          <Flex align="center" justify="space-between" gap={3}>
            <Flex align="center" gap={3}>
              <Link2 size={16} aria-hidden />
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  {selectedSummary.label}
                </Text>
                <Text size={1} muted>
                  {selectedSummary.detail}
                </Text>
              </Stack>
            </Flex>
            <Button
              mode="ghost"
              text="Clear"
              disabled={readOnly}
              onClick={clearSelection}
              fontSize={1}
              padding={2}
            />
          </Flex>
        </Card>
      ) : null}

      {linkType === 'external' ? (
        <Stack space={2}>
          <Text size={1} weight="semibold">
            External URL
          </Text>
          <TextInput
            value={value?.externalUrl ?? ''}
            disabled={readOnly}
            placeholder="https://example.com"
            onChange={(event) => applyExternalUrl(event.currentTarget.value)}
          />
          <Text size={1} muted>
            Opens in a new tab with an external-link icon on the site.
          </Text>
        </Stack>
      ) : linkType === 'email' ? (
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Email address
          </Text>
          <TextInput
            value={value?.emailAddress ?? ''}
            disabled={readOnly}
            placeholder="hello@example.com"
            onChange={(event) => applyEmailAddress(event.currentTarget.value)}
          />
          <Text size={1} muted>
            Opens the visitor’s default email app.
          </Text>
        </Stack>
      ) : (
        <Stack space={3}>
          <Flex gap={2} wrap="wrap">
            <Button
              mode={browseMode === 'nav' ? 'default' : 'ghost'}
              text="Navigation"
              onClick={() => setBrowseMode('nav')}
              fontSize={1}
              padding={2}
              disabled={readOnly}
            />
            <Button
              mode={browseMode === 'pages' ? 'default' : 'ghost'}
              text="All pages"
              onClick={() => setBrowseMode('pages')}
              fontSize={1}
              padding={2}
              disabled={readOnly}
            />
            <Button
              mode={browseMode === 'posts' ? 'default' : 'ghost'}
              text="All posts"
              onClick={() => setBrowseMode('posts')}
              fontSize={1}
              padding={2}
              disabled={readOnly}
            />
          </Flex>

          {browseMode !== 'nav' ? (
            <TextInput
              value={search}
              disabled={readOnly}
              placeholder={browseMode === 'pages' ? 'Search pages' : 'Search posts'}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
          ) : null}

          {loadError ? (
            <Card padding={3} radius={2} tone="critical">
              <Text size={1}>{loadError}</Text>
            </Card>
          ) : null}

          <Card padding={2} radius={2} shadow={1} border style={{maxHeight: 320, overflow: 'auto'}}>
            {browseMode === 'nav' ? (
              <NavHierarchy
                entries={nav?.entries ?? []}
                posts={posts}
                expandedGroupIds={expandedGroupIds}
                selectedRef={value?.internalReference?._ref}
                selectedPath={value?.internalPath}
                readOnly={readOnly}
                onToggleGroup={toggleGroup}
                onSelect={applyInternal}
              />
            ) : null}

            {browseMode === 'pages' ? (
              <Stack space={1}>
                {matchesQuery('Data Catalog', DATA_CATALOG_PATH, search) ? (
                  <DestinationRow
                    label="Data Catalog"
                    href={DATA_CATALOG_PATH}
                    selected={isDataCatalogPath(value?.internalPath)}
                    disabled={readOnly}
                    badge="Catalog"
                    onSelect={() =>
                      applyInternal({
                        kind: 'path',
                        path: DATA_CATALOG_PATH,
                        label: 'Data Catalog',
                      })
                    }
                  />
                ) : null}
                {filteredPages.length === 0 &&
                !matchesQuery('Data Catalog', DATA_CATALOG_PATH, search) ? (
                  <Box padding={3}>
                    <Text size={1} muted>
                      No published pages match.
                    </Text>
                  </Box>
                ) : (
                  filteredPages.map((page) => {
                    const href = hrefForSitePageSlug(page.slug)
                    if (!href) {
                      return null
                    }
                    return (
                      <DestinationRow
                        key={page._id}
                        label={page.title?.trim() || 'Untitled page'}
                        href={href}
                        selected={value?.internalReference?._ref === page._id}
                        disabled={readOnly}
                        onSelect={() =>
                          applyInternal({
                            kind: 'reference',
                            ref: page._id,
                            label: page.title?.trim() || href,
                            href,
                          })
                        }
                      />
                    )
                  })
                )}
              </Stack>
            ) : null}

            {browseMode === 'posts' ? (
              <Stack space={1}>
                {filteredPosts.length === 0 ? (
                  <Box padding={3}>
                    <Text size={1} muted>
                      No published posts match.
                    </Text>
                  </Box>
                ) : (
                  filteredPosts.map((post) => {
                    const href = hrefForNewsPostSlug(post.slug)
                    if (!href) {
                      return null
                    }
                    return (
                      <DestinationRow
                        key={post._id}
                        label={post.title?.trim() || 'Untitled post'}
                        href={href}
                        selected={value?.internalReference?._ref === post._id}
                        disabled={readOnly}
                        onSelect={() =>
                          applyInternal({
                            kind: 'reference',
                            ref: post._id,
                            label: post.title?.trim() || href,
                            href,
                          })
                        }
                      />
                    )
                  })
                )}
              </Stack>
            ) : null}
          </Card>
        </Stack>
      )}
    </Stack>
  )
}

function NavHierarchy(props: {
  entries: (NavLinkProjection | NavGroupProjection | null)[]
  posts: PublishedPostProjection[]
  expandedGroupIds: Record<string, boolean>
  selectedRef?: string | null
  selectedPath?: string | null
  readOnly?: boolean
  onToggleGroup: (id: string) => void
  onSelect: (selection: SelectedInternal) => void
}) {
  const {
    entries,
    posts,
    expandedGroupIds,
    selectedRef,
    selectedPath,
    readOnly,
    onToggleGroup,
    onSelect,
  } = props

  if (entries.length === 0) {
    return (
      <Box padding={3}>
        <Text size={1} muted>
          No primary navigation entries yet. Use All pages / All posts, or add navigation in Studio.
        </Text>
      </Box>
    )
  }

  return (
    <Stack space={1}>
      {entries.map((entry) => {
        if (!entry) {
          return null
        }
        if (entry._type === 'siteNavLink') {
          return (
            <NavLinkRows
              key={entry._id}
              link={entry}
              posts={posts}
              expanded={!!expandedGroupIds[entry._id]}
              selectedRef={selectedRef}
              selectedPath={selectedPath}
              readOnly={readOnly}
              onToggle={() => onToggleGroup(entry._id)}
              onSelect={onSelect}
            />
          )
        }
        if (entry._type === 'siteNavGroup') {
          const expanded = !!expandedGroupIds[entry._id]
          return (
            <Stack key={entry._id} space={1}>
              <Button
                mode="bleed"
                padding={2}
                disabled={readOnly}
                onClick={() => onToggleGroup(entry._id)}
                style={{width: '100%', justifyContent: 'flex-start'}}
              >
                <Flex align="center" gap={2}>
                  {expanded ? (
                    <ChevronDown size={16} aria-hidden />
                  ) : (
                    <ChevronRight size={16} aria-hidden />
                  )}
                  <Text size={1} weight="semibold">
                    {entry.label?.trim() || 'Untitled group'}
                  </Text>
                  <Badge tone="primary" fontSize={0}>
                    {(entry.items ?? []).length}
                  </Badge>
                </Flex>
              </Button>
              {expanded ? (
                <Box paddingLeft={3}>
                  <Stack space={1}>
                    {(entry.items ?? []).map((item) => (
                      <NavLinkRows
                        key={item._id}
                        link={item}
                        posts={posts}
                        expanded={!!expandedGroupIds[item._id]}
                        selectedRef={selectedRef}
                        selectedPath={selectedPath}
                        readOnly={readOnly}
                        nested
                        onToggle={() => onToggleGroup(item._id)}
                        onSelect={onSelect}
                      />
                    ))}
                  </Stack>
                </Box>
              ) : null}
            </Stack>
          )
        }
        return null
      })}
    </Stack>
  )
}

function NavLinkRows(props: {
  link: NavLinkProjection
  posts: PublishedPostProjection[]
  expanded: boolean
  selectedRef?: string | null
  selectedPath?: string | null
  readOnly?: boolean
  nested?: boolean
  onToggle: () => void
  onSelect: (selection: SelectedInternal) => void
}) {
  const {link, posts, expanded, selectedRef, selectedPath, readOnly, nested, onToggle, onSelect} =
    props
  const selection = resolveNavLinkSelection(link)
  if (!selection) {
    return (
      <Box padding={2} paddingLeft={nested ? 2 : 2}>
        <Text size={1} muted>
          {link.label?.trim() || 'Untitled link'} (missing destination)
        </Text>
      </Box>
    )
  }

  const href = selection.kind === 'path' ? selection.path : selection.href
  const isNewsHub = isNewsHubPath(href)
  const selected =
    selection.kind === 'reference'
      ? selectedRef === selection.ref
      : normalizeInternalPath(selectedPath ?? '') === selection.path

  return (
    <Stack space={1}>
      <Flex align="center" gap={1}>
        {isNewsHub ? (
          <Button
            mode="bleed"
            padding={2}
            disabled={readOnly}
            onClick={onToggle}
            style={{flexShrink: 0}}
          >
            {expanded ? (
              <ChevronDown size={16} aria-hidden />
            ) : (
              <ChevronRight size={16} aria-hidden />
            )}
          </Button>
        ) : (
          <Box style={{width: 28}} />
        )}
        <Box flex={1}>
          <DestinationRow
            label={selection.label}
            href={href}
            selected={selected}
            disabled={readOnly}
            badge={isNewsHub ? 'News hub' : undefined}
            onSelect={() => onSelect(selection)}
          />
        </Box>
      </Flex>
      {isNewsHub && expanded ? (
        <Box paddingLeft={4}>
          <Stack space={1}>
            <DestinationRow
              label="News & Updates (hub)"
              href={NEWS_HUB_PATH}
              selected={normalizeInternalPath(selectedPath ?? '') === NEWS_HUB_PATH}
              disabled={readOnly}
              onSelect={() =>
                onSelect({kind: 'path', path: NEWS_HUB_PATH, label: 'News & Updates'})
              }
            />
            {posts.length === 0 ? (
              <Box padding={2}>
                <Text size={1} muted>
                  No published posts.
                </Text>
              </Box>
            ) : (
              posts.map((post) => {
                const postHref = hrefForNewsPostSlug(post.slug)
                if (!postHref) {
                  return null
                }
                return (
                  <DestinationRow
                    key={post._id}
                    label={post.title?.trim() || 'Untitled post'}
                    href={postHref}
                    selected={selectedRef === post._id}
                    disabled={readOnly}
                    onSelect={() =>
                      onSelect({
                        kind: 'reference',
                        ref: post._id,
                        label: post.title?.trim() || postHref,
                        href: postHref,
                      })
                    }
                  />
                )
              })
            )}
          </Stack>
        </Box>
      ) : null}
    </Stack>
  )
}

function DestinationRow(props: {
  label: string
  href: string
  selected?: boolean
  disabled?: boolean
  badge?: string
  onSelect: () => void
}) {
  const {label, href, selected, disabled, badge, onSelect} = props
  return (
    <Button
      mode={selected ? 'default' : 'bleed'}
      tone={selected ? 'primary' : 'default'}
      padding={2}
      disabled={disabled}
      onClick={onSelect}
      style={{width: '100%', justifyContent: 'flex-start'}}
    >
      <Flex align="center" justify="space-between" gap={3} style={{width: '100%'}}>
        <Stack space={2} style={{textAlign: 'left'}}>
          <Text size={1} weight={selected ? 'semibold' : 'regular'}>
            {label}
          </Text>
          <Text size={1} muted>
            {href}
          </Text>
        </Stack>
        {badge ? (
          <Badge fontSize={0} mode="outline">
            {badge}
          </Badge>
        ) : null}
      </Flex>
    </Button>
  )
}
