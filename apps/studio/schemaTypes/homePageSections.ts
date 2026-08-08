import {defineField, defineType} from 'sanity'

import {contentLinkAnnotation} from './contentLink'
import {IMAGE_SHELF_BRAND_COLORS} from './imageShelf'

const heroPortableText = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [{title: 'Strong', value: 'strong'}],
    annotations: [contentLinkAnnotation],
  },
} as const

/** Homepage-only hero; maps to HomeHeroSection. */
export const homeHero = defineType({
  name: 'homeHero',
  title: 'Home Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required().max(160).warning('Consider ≤ 160 chars.'),
    }),
    defineField({
      name: 'heroParagraph1',
      title: 'Paragraph 1',
      type: 'array',
      of: [heroPortableText],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroParagraph2',
      title: 'Paragraph 2',
      type: 'array',
      of: [heroPortableText],
      description: 'Optional. On mobile, appears below the image.',
    }),
    defineField({
      name: 'heroParagraph3',
      title: 'Paragraph 3',
      type: 'array',
      of: [heroPortableText],
      description: 'Optional. On mobile, appears after paragraph 2.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      description:
        'Preferred format: JPG (WebP also OK); use PNG only when transparency is required. Crop freely with the hotspot tool.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) =>
            Rule.required()
              .max(160)
              .warning('Keep alt text concise and descriptive (≤ 160 chars).'),
        }),
      ],
    }),
    defineField({
      name: 'imageShelf',
      title: 'Image shelf',
      type: 'imageShelfSettings',
      description:
        'Indented strip under the image. Defaults: off white, 25% indent, and 50px height.',
      initialValue: {
        color: 'offWhite',
        mobile: {indentPercent: 25, heightPx: 50},
        tablet: {indentPercent: 25, heightPx: 50},
        desktop: {indentPercent: 25, heightPx: 50},
      },
    }),
  ],
  preview: {
    select: {
      title: 'heroHeading',
      media: 'heroImage',
    },
    prepare({title, media}) {
      return {
        title: 'Home Hero Section',
        subtitle: typeof title === 'string' ? title.trim() || undefined : undefined,
        media,
      }
    },
  },
})

const partnerObject = defineField({
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
})

export const partnerLogosSection = defineType({
  name: 'partnerLogosSection',
  title: 'Partner logos',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'Our partners',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'partners',
      title: 'Partner logos',
      type: 'array',
      description:
        'Add partner logos and links. Drag to reorder items in the desired display order.',
      of: [partnerObject],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'useMarquee',
      title: 'Marquee animation',
      type: 'boolean',
      description:
        'On: infinite marquee when motion is allowed; visitors who prefer reduced motion get a horizontal scroll strip instead. Off: logos wrap in a centered static grid.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
    },
    prepare({sectionHeading}) {
      return {
        title: 'Partner logos',
        subtitle: sectionHeading?.trim() || undefined,
      }
    },
  },
})

export const byTheNumbersStat = defineType({
  name: 'byTheNumbersStat',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Datasets', value: 'dataDb'},
          {title: 'Members', value: 'members'},
          {title: 'Projects', value: 'projects'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Number',
      type: 'string',
      description: 'e.g. 350+, 100s, 20+',
      validation: (Rule) => Rule.required().max(24),
    }),
    defineField({
      name: 'label',
      title: 'Short label',
      type: 'string',
      description: 'e.g. archived datasets',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'array',
      of: [heroPortableText],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      validation: (Rule) => Rule.max(40),
      description: 'Optional. Button is hidden when the link below is empty.',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      description:
        'Optional. Choose Internal (same tab) or External (new tab + icon). Button is hidden if left empty.',
    }),
  ],
  preview: {
    select: {
      value: 'value',
      label: 'label',
      icon: 'icon',
    },
    prepare({value, label, icon}) {
      return {
        title: value || 'Stat',
        subtitle: [label, icon].filter(Boolean).join(' · ') || undefined,
      }
    },
  },
})

export const byTheNumbersSection = defineType({
  name: 'byTheNumbersSection',
  title: 'By the numbers',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'PEDP BY THE NUMBERS',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{type: 'byTheNumbersStat'}],
      validation: (Rule) =>
        Rule.required()
          .length(3)
          .error('Add exactly three stats (e.g. datasets, members, projects).'),
    }),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
      stats: 'stats',
    },
    prepare({sectionHeading, stats}) {
      const n = Array.isArray(stats) ? stats.length : 0
      return {
        title: 'By the numbers',
        subtitle: sectionHeading?.trim() ? `${sectionHeading.trim()} · ${n}/3` : `${n}/3 stats`,
      }
    },
  },
})

export const highlightBannerSection = defineType({
  name: 'highlightBannerSection',
  title: 'Highlight banner',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Banner image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
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
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'HIGHLIGHT BANNER',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Required. Shown on mobile and tablet; hidden on desktop.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [heroPortableText],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Explore',
      validation: (Rule) => Rule.max(80),
      description: 'Optional. Button is hidden when the link below is empty.',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      description:
        'Optional. Choose Internal (same tab) or External (new tab + icon). Button is hidden if left empty.',
    }),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
    },
    prepare({sectionHeading}) {
      return {
        title: 'Highlight banner',
        subtitle: sectionHeading?.trim() || undefined,
      }
    },
  },
})

/** Story card object; stored `_type` is `storyCard`. */
export const storyCard = defineType({
  name: 'storyCard',
  title: 'Story card',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text (optional)',
          type: 'string',
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
    defineField({
      name: 'eyebrow',
      title: 'Card eyebrow',
      type: 'string',
      description: 'Optional short label under the image (e.g. CONTEXT, TIME, or a photo credit).',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'link',
      title: 'Button link',
      type: 'contentLink',
      description:
        'Destination for the View Post button. Internal = same tab; External = new tab + icon.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eyebrow: 'eyebrow',
      media: 'image',
    },
    prepare({title, eyebrow}) {
      return {
        title: title || 'Story card',
        subtitle: eyebrow?.trim() || undefined,
      }
    },
  },
})

/**
 * Tool card for Tools Development category sections.
 * Stored `_type` is `toolCard`.
 */
export const toolCard = defineType({
  name: 'toolCard',
  title: 'Tool card',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required().max(160),
        }),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Tool name (e.g. CEJST, EJSCREEN).',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(480),
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'Optional. e.g. Version 2.2',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'pill',
      title: 'Pill / tag',
      type: 'string',
      description: 'Optional status label (e.g. NEW FEATURES).',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Open',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'link',
      title: 'Button link',
      type: 'contentLink',
      description: 'Internal = same tab; External = new tab + icon.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      version: 'version',
      pill: 'pill',
      media: 'image',
    },
    prepare({title, version, pill, media}) {
      const parts = [version?.trim(), pill?.trim()].filter(Boolean)
      return {
        title: title || 'Tool card',
        subtitle: parts.length > 0 ? parts.join(' · ') : undefined,
        media,
      }
    },
  },
})

export const cardCarouselSection = defineType({
  name: 'cardCarouselSection',
  title: 'Card carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'LATEST NEWS',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      description:
        'Story cards only. Order is preserved; the site shows navigation when there are more than three.',
      of: [{type: 'storyCard'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
    },
    prepare({sectionHeading}) {
      return {
        title: 'Card carousel',
        subtitle: sectionHeading?.trim() || undefined,
      }
    },
  },
})

export const newsletterSection = defineType({
  name: 'newsletterSection',
  title: 'Newsletter',
  type: 'object',
  fields: [
    defineField({
      name: 'presentation',
      title: 'Presentation',
      type: 'string',
      initialValue: 'homepage',
      options: {
        list: [
          {title: 'Homepage (forest band)', value: 'homepage'},
          {title: 'Contact page (off-white card)', value: 'contact'},
        ],
        layout: 'radio',
      },
      description: 'Existing sections without a value continue to use the Homepage presentation.',
    }),
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'STAY IN TOUCH',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'prompt',
      title: 'Prompt',
      type: 'string',
      initialValue: 'Sign-up for our newsletter:',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'emailPlaceholder',
      title: 'Email field placeholder',
      type: 'string',
      initialValue: 'YourEmail@example.com',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      type: 'string',
      initialValue: 'Subscribe',
      validation: (Rule) => Rule.required().max(40),
    }),
  ],
  preview: {
    select: {
      presentation: 'presentation',
      sectionHeading: 'sectionHeading',
      prompt: 'prompt',
    },
    prepare({presentation, sectionHeading, prompt}) {
      return {
        title: 'Newsletter',
        subtitle:
          [presentation === 'contact' ? 'Contact page' : 'Homepage', sectionHeading, prompt]
            .filter(Boolean)
            .join(' · ') || undefined,
      }
    },
  },
})

/** Vertical rhythm between page slices; height plus optional brand fill color. */
export const sectionSpacer = defineType({
  name: 'sectionSpacer',
  title: 'Section spacer',
  type: 'object',
  fields: [
    defineField({
      name: 'heightPx',
      title: 'Height (px)',
      type: 'number',
      description: 'Vertical space between sections.',
      initialValue: 40,
      validation: (Rule) => Rule.required().integer().min(0).max(600),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      description: 'Optional brand fill. Leave as None for transparent spacing.',
      options: {
        list: [
          {title: 'None', value: 'none'},
          ...IMAGE_SHELF_BRAND_COLORS.map(({title, value, hex}) => ({
            title: `${title} (${hex})`,
            value,
          })),
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: {
      heightPx: 'heightPx',
      background: 'background',
    },
    prepare({heightPx, background}) {
      const h = typeof heightPx === 'number' ? heightPx : 0
      const entry = IMAGE_SHELF_BRAND_COLORS.find((item) => item.value === background)
      const fill = entry ? entry.title.toLowerCase() : 'transparent'
      return {
        title: 'Section spacer',
        subtitle: `${h}px · ${fill}`,
      }
    },
  },
})

const whatWeDoIconList = [
  {title: 'Data Preservation', value: 'dataPreservation'},
  {title: 'Tools Development', value: 'toolsDevelopment'},
  {title: 'Advocacy', value: 'advocacy'},
] as const

export const whatWeDoItem = defineType({
  name: 'whatWeDoItem',
  title: 'What we do item',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {list: [...whatWeDoIconList], layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [heroPortableText],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Learn More',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      description:
        'Optional. Choose Internal (same tab) or External (new tab + icon). Button is hidden if left empty.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon',
    },
    prepare({title, icon}) {
      const iconLabel =
        whatWeDoIconList.find((entry) => entry.value === icon)?.title ?? 'Choose icon'
      return {
        title: typeof title === 'string' && title.trim() ? title.trim() : 'What we do item',
        subtitle: iconLabel,
      }
    },
  },
})

/** Homepage “What we do” — three fixed pillars with icons and CTAs. */
export const whatWeDoSection = defineType({
  name: 'whatWeDoSection',
  title: 'What We Do',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'WHAT WE DO',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'whatWeDoItem'}],
      validation: (Rule) =>
        Rule.required()
          .length(3)
          .error('Add exactly three items (e.g. Data Preservation, Tools Development, Advocacy).'),
    }),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
      items: 'items',
    },
    prepare({sectionHeading, items}) {
      const n = Array.isArray(items) ? items.length : 0
      return {
        title: 'What We Do',
        subtitle: sectionHeading?.trim()
          ? `${sectionHeading.trim()} · ${n}/3 items`
          : `${n}/3 items`,
      }
    },
  },
})

/** Member testimonial band — reusable (homepage now; other pages later). */
export const testimonialSection = defineType({
  name: 'testimonialSection',
  title: 'Testimonial',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'MEMBER TESTIMONIAL',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'array',
      of: [heroPortableText],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'surface',
      title: 'Band color',
      type: 'string',
      description: 'Dark blue band with light text, or light blue band with dark text.',
      options: {
        list: [
          {title: 'Dark blue', value: 'dark'},
          {title: 'Light blue', value: 'light'},
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution (name)',
      type: 'string',
      description: 'Optional. Displayed below the quote when set.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Get Involved',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      description:
        'Optional. Choose Internal (same tab) or External (new tab + icon). Button is hidden if left empty.',
    }),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
      attribution: 'attribution',
    },
    prepare({sectionHeading, attribution}) {
      const label =
        typeof sectionHeading === 'string' && sectionHeading.trim()
          ? sectionHeading.trim()
          : 'Testimonial'
      const name =
        typeof attribution === 'string' && attribution.trim() ? attribution.trim() : undefined
      return {
        title: 'Testimonial',
        subtitle: name ? `${label} · ${name}` : label,
      }
    },
  },
})
