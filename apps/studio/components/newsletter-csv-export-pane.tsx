import {Button, Card, Stack, Text} from '@sanity/ui'
import {useCallback, useState} from 'react'
import {useClient} from 'sanity'

const QUERY = `*[_type == "newsletterSignup"] | order(submittedAt desc) {
  email,
  submittedAt
}`

type Row = {
  email?: string | null
  submittedAt?: string | null
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function rowsToCsv(rows: Row[]): string {
  const header = 'email,submittedAt'
  const lines = rows.map((row) => {
    const email = typeof row.email === 'string' ? row.email : ''
    const rawAt = row.submittedAt
    const submittedAt = typeof rawAt === 'string' ? rawAt : rawAt != null ? String(rawAt) : ''
    return [csvEscape(email), csvEscape(submittedAt)].join(',')
  })
  return `\uFEFF${[header, ...lines].join('\r\n')}`
}

/** Desk pane: download all newsletter signups as CSV (email + submittedAt). */
export function NewsletterCsvExportPane() {
  const client = useClient({apiVersion: '2024-01-01'})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const download = useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const rows = await client.fetch<Row[]>(QUERY)
      const csv = rowsToCsv(rows)
      const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'})
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `newsletter-signups-${new Date().toISOString().slice(0, 10)}.csv`
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed.')
    } finally {
      setBusy(false)
    }
  }, [client])

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        <Stack space={3}>
          <Text size={3} weight="semibold">
            Export newsletter signups
          </Text>
          <Text muted size={1}>
            Downloads a CSV with columns email and submittedAt (newest submissions first). The file
            is UTF-8 with a BOM so Excel recognizes encoding on Windows.
          </Text>
        </Stack>
        {error ? (
          <Text accent size={1} role="alert">
            {error}
          </Text>
        ) : null}
        <Button
          loading={busy}
          onClick={() => void download()}
          text="Download CSV"
          tone="primary"
          type="button"
        />
      </Stack>
    </Card>
  )
}
