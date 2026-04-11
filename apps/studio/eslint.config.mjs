import studio from '@sanity/eslint-config-studio'
import {defineConfig, globalIgnores} from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default defineConfig([
  ...studio,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  globalIgnores(['**/node_modules/**', 'dist/**', '.sanity/**']),
])
