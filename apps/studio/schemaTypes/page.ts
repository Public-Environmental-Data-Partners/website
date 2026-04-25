import {defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroKicker',
      title: 'Hero kicker',
      type: 'string',
      validation: (Rule) => Rule.required().max(40).warning('Keep this short (≤ 40 chars).'),
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero heading',
      type: 'string',
      validation: (Rule) => Rule.required().max(160).warning('Consider ≤ 160 chars.'),
    }),
    defineField({
      name: 'heroParagraph1',
      title: 'Hero paragraph 1',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                fields: [defineField({name: 'href', type: 'url'})],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroParagraph2',
      title: 'Hero paragraph 2',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                fields: [defineField({name: 'href', type: 'url'})],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image (desktop/default)',
      type: 'image',
      description:
        'Preferred format: JPG (WebP also OK); use PNG only when transparency is required.\nUse images roughly 2000-2800px wide for desktop hero; avoid files under 1600px or over 5000px wide.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) =>
            Rule.max(160).warning('Keep alt text concise and descriptive (≤ 160 chars).'),
        }),
      ],
    }),
    defineField({
      name: 'heroImageMobile',
      title: 'Hero image (mobile override)',
      type: 'image',
      description:
        'Preferred format: JPG (WebP also OK); use PNG only when transparency is required.\nUse images roughly 1080-1600px wide for mobile hero; avoid files under 900px or over 3000px wide.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text (mobile override)',
          type: 'string',
          validation: (Rule) =>
            Rule.max(160).warning('Keep alt text concise and descriptive (≤ 160 chars).'),
        }),
      ],
    }),
    defineField({
      name: 'hideHeroImageOnMobile',
      title: 'Hide hero image on mobile',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'coalitionHeading',
      title: 'Coalition heading',
      type: 'string',
      initialValue: 'Our coalition',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'coalitionPartners',
      title: 'Coalition partners',
      type: 'array',
      description:
        'Add partner logos and links. Drag to reorder items in the desired display order.',
      of: [
        defineField({
          name: 'partner',
          title: 'Partner',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Partner name',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'url',
              title: 'Partner website URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'ariaLabel',
              title: 'Accessible label (optional)',
              type: 'string',
              description: 'Optional. Defaults to partner name when left blank.',
              validation: (Rule) => Rule.max(160),
            }),
            defineField({
              name: 'logo',
              title: 'Partner logo',
              type: 'image',
              description:
                'Preferred format: SVG (JPG also OK); use PNG only when transparency is required.\nAim for logos at least 400px wide to avoid blur on larger screens.',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Logo alternative text (optional)',
                  type: 'string',
                  description: 'Optional. Defaults to partner name when left blank.',
                  validation: (Rule) => Rule.max(160),
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
              subtitle: 'url',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
