import {defineField, defineType} from 'sanity'

const heroPortableText = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [{title: 'Strong', value: 'strong'}],
    annotations: [
      {
        name: 'link',
        type: 'object',
        fields: [defineField({name: 'href', type: 'url'})],
      },
    ],
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
      name: 'heading',
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
      heading: 'heading',
    },
    prepare({heading}) {
      return {
        title: 'Partner logos',
        subtitle: heading?.trim() || undefined,
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
      name: 'value',
      title: 'Number',
      type: 'string',
      description: 'e.g. 350+, 173, 20+',
      validation: (Rule) => Rule.required().max(24),
    }),
    defineField({
      name: 'label',
      title: 'Phrase',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
  ],
  preview: {
    select: {
      value: 'value',
      label: 'label',
    },
    prepare({value, label}) {
      return {
        title: value || 'Stat',
        subtitle: label,
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
      name: 'kicker',
      title: 'Eyebrow / kicker',
      type: 'string',
      initialValue: 'BY THE NUMBERS',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'stats',
      title: 'Number cards',
      type: 'array',
      of: [{type: 'byTheNumbersStat'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      kicker: 'kicker',
      stats: 'stats',
    },
    prepare({kicker, stats}) {
      const n = Array.isArray(stats) ? stats.length : 0
      return {
        title: kicker || 'By the numbers',
        subtitle: n ? `${n} card${n === 1 ? '' : 's'}` : 'Add stats',
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
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      initialValue: 'HIGHLIGHT BANNER',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'titleLine',
      title: 'Title line',
      type: 'string',
      description: 'Short supporting line above the main heading (optional).',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
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
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'homepageLinkTarget',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      kicker: 'kicker',
    },
    prepare({kicker}) {
      return {
        title: 'Highlight banner',
        subtitle: kicker?.trim() || undefined,
      }
    },
  },
})

const storyCardChipList = [
  {title: 'Story', value: 'Story'},
  {title: 'News', value: 'News'},
  {title: 'Blog', value: 'Blog'},
  {title: 'Project', value: 'Project'},
] as const

const toolCardChipList = [
  {title: 'Tool', value: 'Tool'},
  {title: 'Resource', value: 'Resource'},
  {title: 'Guide', value: 'Guide'},
  {title: 'Dataset', value: 'Dataset'},
] as const

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
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'authors',
      title: 'Authors / byline',
      type: 'string',
      description: 'e.g. by Alex Smith and Jordan Lee',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'chip',
      title: 'Tag / pill',
      type: 'string',
      options: {list: [...storyCardChipList], layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Card link',
      type: 'homepageLinkTarget',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      chip: 'chip',
      media: 'image',
    },
    prepare({title, chip}) {
      return {
        title: title || 'Story card',
        subtitle: chip,
      }
    },
  },
})

/** Tool card object; stored `_type` is `toolCard`. */
export const toolCard = defineType({
  name: 'toolCard',
  title: 'Tool card',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Card image (optional)',
      type: 'image',
      options: {hotspot: true},
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
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'chip',
      title: 'Tag / pill',
      type: 'string',
      options: {list: [...toolCardChipList], layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Card link',
      type: 'homepageLinkTarget',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      chip: 'chip',
    },
    prepare({title, chip}) {
      return {
        title: title || 'Tool card',
        subtitle: chip,
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
      initialValue: 'Latest news',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      description:
        'Mix story and tool cards. Order is preserved; the site shows navigation when there are more than three.',
      of: [{type: 'storyCard'}, {type: 'toolCard'}],
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
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Sign up for our newsletter',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'body',
      title: 'Supporting text (optional)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'emailPlaceholder',
      title: 'Email field placeholder',
      type: 'string',
      initialValue: 'Email address…',
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
      heading: 'heading',
    },
    prepare({heading}) {
      return {
        title: 'Newsletter',
        subtitle: heading?.trim() || undefined,
      }
    },
  },
})

/** Vertical rhythm between homepage slices; height only (pixels). */
export const sectionSpacer = defineType({
  name: 'sectionSpacer',
  title: 'Section spacer',
  type: 'object',
  fields: [
    defineField({
      name: 'heightPx',
      title: 'Height (px)',
      type: 'number',
      description: 'Empty vertical space between sections.',
      initialValue: 40,
      validation: (Rule) => Rule.required().integer().min(0).max(600),
    }),
  ],
  preview: {
    select: {
      heightPx: 'heightPx',
    },
    prepare({heightPx}) {
      const h = typeof heightPx === 'number' ? heightPx : 0
      return {
        title: 'Section spacer',
        subtitle: `${h}px`,
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
      name: 'ctaPage',
      title: 'Button link (site page)',
      type: 'reference',
      to: [{type: 'sitePage'}],
      description: 'Internal page opened by the button. Button is hidden if left empty.',
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
      name: 'heading',
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
      heading: 'heading',
      items: 'items',
    },
    prepare({heading, items}) {
      const n = Array.isArray(items) ? items.length : 0
      return {
        title: 'What We Do',
        subtitle: heading?.trim()
          ? `${heading.trim()} · ${n}/3 items`
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
      name: 'kicker',
      title: 'Kicker',
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
      name: 'ctaPage',
      title: 'Button link (site page)',
      type: 'reference',
      to: [{type: 'sitePage'}],
      description: 'Internal page opened by the button. Button is hidden if left empty.',
    }),
  ],
  preview: {
    select: {
      kicker: 'kicker',
      attribution: 'attribution',
    },
    prepare({kicker, attribution}) {
      const kick = typeof kicker === 'string' && kicker.trim() ? kicker.trim() : 'Testimonial'
      const name =
        typeof attribution === 'string' && attribution.trim() ? attribution.trim() : undefined
      return {
        title: 'Testimonial',
        subtitle: name ? `${kick} · ${name}` : kick,
      }
    },
  },
})
