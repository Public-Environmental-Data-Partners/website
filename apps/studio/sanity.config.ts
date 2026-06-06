import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import type {StructureResolver} from 'sanity/structure'
import {structureTool} from 'sanity/structure'

import {NewsletterCsvExportPane} from './components/newsletter-csv-export-pane'
import {schemaTypes} from './schemaTypes'

/** Content structure: home singleton + list of generic site pages. */
const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home page')
        .id('home')
        .child(S.document().schemaType('page').documentId('page.home').title('Home page')),
      S.listItem()
        .title('Primary navigation')
        .id('primary-navigation')
        .child(
          S.list()
            .title('Primary navigation')
            .items([
              S.listItem()
                .title('Primary navigation order')
                .id('primary-navigation-order')
                .child(
                  S.document()
                    .schemaType('siteNavigation')
                    .documentId('siteNavigation')
                    .title('Primary navigation'),
                ),
              S.listItem()
                .title('Navigation groups')
                .id('navigation-groups')
                .child(S.documentTypeList('siteNavGroup').title('Navigation groups')),
              S.listItem()
                .title('Navigation links')
                .id('navigation-links')
                .child(S.documentTypeList('siteNavLink').title('Navigation links')),
            ]),
        ),
      S.listItem()
        .title('Footer')
        .id('footer')
        .child(S.document().schemaType('siteFooter').documentId('siteFooter').title('Site footer')),
      S.listItem()
        .title('Newsletter')
        .id('newsletter')
        .child(
          S.list()
            .title('Newsletter')
            .items([
              S.listItem()
                .title('Newsletter signups')
                .id('newsletter-signups')
                .child(
                  S.documentTypeList('newsletterSignup')
                    .title('Newsletter signups')
                    .defaultOrdering([{field: 'submittedAt', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Export newsletter CSV')
                .id('newsletter-export-csv')
                .child(S.component(NewsletterCsvExportPane).title('Newsletter CSV export')),
            ]),
        ),
      S.listItem()
        .title('News & updates')
        .id('news-and-updates')
        .child(
          S.list()
            .title('News & updates')
            .items([
              S.listItem()
                .title('Hub page')
                .id('news-hub-page')
                .child(
                  S.document()
                    .schemaType('newsHubPage')
                    .documentId('page.newsHub')
                    .title('News & updates — Hub'),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(
          S.documentTypeList('sitePage')
            .title('Pages')
            .defaultOrdering([{field: 'title', direction: 'asc'}]),
        ),
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
