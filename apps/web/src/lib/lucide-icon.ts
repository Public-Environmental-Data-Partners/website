import {icons, type LucideIcon} from 'lucide-react'

function kebabToPascal(kebab: string): string {
  return kebab
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/** Resolve a Lucide kebab-case icon name to a component, or null when unknown. */
export function resolveLucideIcon(name: string): LucideIcon | null {
  const trimmed = name.trim()
  if (!trimmed || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return null
  }
  const pascal = kebabToPascal(trimmed)
  if (!(pascal in icons)) {
    return null
  }
  return icons[pascal as keyof typeof icons]
}
