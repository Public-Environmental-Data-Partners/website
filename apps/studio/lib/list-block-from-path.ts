import type {Path} from 'sanity'

/** Resolve the parent `listBlock` object from a nested field path (e.g. row icon). */
export function listBlockFromPath(
  document: Record<string, unknown> | undefined,
  path: Path | undefined,
): {variant?: string} | null {
  if (!document || !path) {
    return null
  }

  const body = document.body
  if (!Array.isArray(body)) {
    return null
  }

  const bodyIndex = path.findIndex((segment) => segment === 'body')
  if (bodyIndex === -1) {
    return null
  }

  const segment = path[bodyIndex + 1]
  let block: unknown

  if (typeof segment === 'number') {
    block = body[segment]
  } else if (typeof segment === 'string') {
    block = body.find(
      (item) =>
        item &&
        typeof item === 'object' &&
        '_key' in item &&
        (item as {_key?: string})._key === segment,
    )
  } else if (
    segment &&
    typeof segment === 'object' &&
    '_key' in segment &&
    typeof (segment as {_key?: string})._key === 'string'
  ) {
    const key = (segment as {_key: string})._key
    block = body.find(
      (item) =>
        item &&
        typeof item === 'object' &&
        '_key' in item &&
        (item as {_key?: string})._key === key,
    )
  }

  if (block && typeof block === 'object' && (block as {_type?: string})._type === 'listBlock') {
    return block as {variant?: string}
  }

  return null
}

/** When path lookup fails, avoid hiding fields that depend on variant (show instead). */
export function listBlockVariantFromPath(
  document: Record<string, unknown> | undefined,
  path: Path | undefined,
): string | undefined {
  return listBlockFromPath(document, path)?.variant
}
