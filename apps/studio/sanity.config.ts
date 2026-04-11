import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import type {StructureResolver} from 'sanity/structure'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './schemaTypes'

/** Single home document for GROQ `*[_type == "page" && _id == "page.home"]`. */
const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home page')
        .id('home')
        .child(S.document().schemaType('page').documentId('page.home').title('Home page')),
    ])

export default defineConfig({
  name: 'default',
  title: 'PEDP Website',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
