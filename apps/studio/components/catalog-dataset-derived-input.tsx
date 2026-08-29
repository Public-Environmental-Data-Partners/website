import {useEffect, useRef} from 'react'
import {type ObjectInputProps, set, unset} from 'sanity'

import {catalogImportKey, normalizeDoi, parseBackupHost} from '../lib/catalog-dataset-key'

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/**
 * Fills importKey from DOI or backup URL, and backup host / file flag from the
 * backup URL, so editors can create catalog datasets in Studio without typing
 * import-only fields.
 */
export function CatalogDatasetDerivedInput(props: ObjectInputProps) {
  const {onChange} = props
  const doc = (props.value ?? {}) as Record<string, unknown>
  const depositId = asString(doc.depositId)
  const backupUrl = asString(doc.backupUrl)
  const currentKey = asString(doc.importKey)
  const currentHost = asString(doc.backupHost)
  const currentIsFile = doc.backupIsFile
  const prevBackupUrl = useRef(backupUrl)

  useEffect(() => {
    const patches = [] as Array<ReturnType<typeof set> | ReturnType<typeof unset>>
    const normalizedDeposit = normalizeDoi(depositId)
    if (normalizedDeposit && depositId.trim() !== normalizedDeposit) {
      patches.push(set(normalizedDeposit, ['depositId']))
    }

    const nextKey = catalogImportKey(depositId, backupUrl)
    if (nextKey) {
      if (nextKey !== currentKey) patches.push(set(nextKey, ['importKey']))
    } else if (currentKey) {
      patches.push(unset(['importKey']))
    }

    const urlChanged = backupUrl !== prevBackupUrl.current
    prevBackupUrl.current = backupUrl
    if (backupUrl) {
      const {host, isFile} = parseBackupHost(backupUrl)
      if (urlChanged || !currentHost) {
        if (host !== currentHost) patches.push(set(host, ['backupHost']))
      }
      if (urlChanged || currentIsFile === undefined || currentIsFile === null) {
        if (isFile !== Boolean(currentIsFile)) patches.push(set(isFile, ['backupIsFile']))
      }
    }

    if (patches.length === 0) return
    onChange(patches)
  }, [backupUrl, currentHost, currentIsFile, currentKey, depositId, onChange])

  return props.renderDefault(props)
}
