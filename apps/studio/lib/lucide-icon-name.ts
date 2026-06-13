import {icons} from 'lucide-react'

const LUCIDE_ICONS_URL = 'https://lucide.dev/icons'

function kebabToPascal(kebab: string): string {
  return kebab
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/** True when `name` is kebab-case and matches a Lucide export. */
export function isValidLucideIconName(name: string): boolean {
  const trimmed = name.trim()
  if (!trimmed || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return false
  }
  return kebabToPascal(trimmed) in icons
}

export function lucideIconFieldDescription(): string {
  return `Lucide icon name in kebab-case (e.g. messages-square). Browse icons at ${LUCIDE_ICONS_URL}`
}
