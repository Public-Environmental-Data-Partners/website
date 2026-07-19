import {Button, Flex, Grid, Stack, Text} from '@sanity/ui'
import {useCallback} from 'react'
import {set, type StringInputProps} from 'sanity'

import {IMAGE_SHELF_BRAND_COLORS} from '../schemaTypes/imageShelf'

/**
 * Visual brand-palette selector for image shelf color.
 * Built-in string `options.list` only supports `{title, value}` — no swatches.
 * Custom input follows Sanity’s “Create a visual string selector field input” guide.
 */
export function ImageShelfColorInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextValue = event.currentTarget.value
      onChange(set(nextValue))
    },
    [onChange],
  )

  return (
    <Grid columns={[1, 2]} gap={2}>
      {IMAGE_SHELF_BRAND_COLORS.map((entry) => {
        const selected = value === entry.value
        return (
          <Button
            key={entry.value}
            value={entry.value}
            mode={selected ? 'default' : 'ghost'}
            tone={selected ? 'primary' : 'default'}
            padding={2}
            disabled={readOnly}
            onClick={handleClick}
            style={{justifyContent: 'flex-start'}}
          >
            <Flex align="center" gap={3}>
              <span
                aria-hidden
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 3,
                  backgroundColor: entry.hex,
                  border: '1px solid var(--card-border-color)',
                  flexShrink: 0,
                }}
              />
              <Stack space={2}>
                <Text size={1} weight="medium">
                  {entry.title}
                </Text>
                <Text size={1} muted>
                  {entry.hex}
                </Text>
              </Stack>
            </Flex>
          </Button>
        )
      })}
    </Grid>
  )
}
