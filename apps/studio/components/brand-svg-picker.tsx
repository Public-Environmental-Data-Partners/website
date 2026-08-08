import {Box, Button, Card, Flex, Grid, Stack, Text} from '@sanity/ui'
import {useCallback, useMemo, useState} from 'react'
import {set, type StringInputProps, unset} from 'sanity'

import {BRAND_SVGS, type BrandSvgPath, brandSvgPreviewUrl, brandSvgTitle} from '../lib/brand-svgs'

/**
 * Visual picker for brand SVGs under `apps/web/public/brand`.
 * Stores the public path string (e.g. `/brand/coalition/data-db.svg`).
 * Previews load from `SANITY_STUDIO_WEB_ORIGIN` (default `http://localhost:3000`).
 */
export function BrandSvgPicker(props: StringInputProps) {
  const {value, onChange, readOnly, elementProps} = props
  const [broken, setBroken] = useState<Record<string, boolean>>({})

  const selectedTitle = useMemo(() => brandSvgTitle(value), [value])

  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const next = event.currentTarget.value as BrandSvgPath
      if (value === next) {
        onChange(unset())
        return
      }
      onChange(set(next))
    },
    [onChange, value],
  )

  const handleClear = useCallback(() => {
    onChange(unset())
  }, [onChange])

  return (
    <Stack space={3} {...elementProps}>
      <Flex align="center" gap={3} wrap="wrap">
        <Text size={1} muted>
          {selectedTitle ? `Selected: ${selectedTitle}` : 'Choose a brand SVG'}
        </Text>
        {value && !readOnly ? (
          <Button mode="ghost" text="Clear" tone="critical" onClick={handleClear} fontSize={1} />
        ) : null}
      </Flex>
      <Grid columns={[2, 3, 4]} gap={2}>
        {BRAND_SVGS.map((entry) => {
          const selected = value === entry.value
          const previewFailed = broken[entry.value]
          return (
            <Button
              key={entry.value}
              value={entry.value}
              mode={selected ? 'default' : 'ghost'}
              tone={selected ? 'primary' : 'default'}
              padding={2}
              disabled={readOnly}
              onClick={handleSelect}
              style={{height: '100%', justifyContent: 'stretch'}}
            >
              <Stack space={2} style={{width: '100%'}}>
                <Card
                  padding={3}
                  radius={2}
                  tone="transparent"
                  style={{
                    background: 'var(--card-muted-bg-color)',
                    minHeight: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {previewFailed ? (
                    <Text size={1} muted align="center">
                      {entry.group}
                    </Text>
                  ) : (
                    <Box style={{width: 48, height: 48}}>
                      <img
                        src={brandSvgPreviewUrl(entry.value)}
                        alt=""
                        width={48}
                        height={48}
                        style={{width: '100%', height: '100%', objectFit: 'contain'}}
                        onError={() =>
                          setBroken((prev) =>
                            prev[entry.value] ? prev : {...prev, [entry.value]: true},
                          )
                        }
                      />
                    </Box>
                  )}
                </Card>
                <Text size={1} weight="medium" align="center">
                  {entry.title.replace(/^[^—]+—\s*/, '')}
                </Text>
                <Text size={0} muted align="center">
                  {entry.group}
                </Text>
              </Stack>
            </Button>
          )
        })}
      </Grid>
    </Stack>
  )
}
