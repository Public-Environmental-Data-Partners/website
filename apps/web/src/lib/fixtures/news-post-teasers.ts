import type {NewsPostTeaserProps} from '@/components/news/news-post-teaser'

/**
 * Fixture teasers for hub layout QA (PR A).
 * Replace with CMS-driven `newsPost` data in PR B.
 */
export const NEWS_POST_TEASER_FIXTURES: NewsPostTeaserProps[] = [
  {
    href: '/news-and-updates/example-story-title',
    eyebrow: 'Story header',
    title: 'This is an example story title.',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: {
      src: '/brand/logo.webp',
      alt: 'Wind turbines in an open field',
      width: 500,
      height: 400,
    },
    tags: ['News', 'Policy', 'Local'],
    publishedAt: '2026-01-01',
    titleId: 'news-teaser-fixture-1',
  },
  {
    href: '/news-and-updates/second-post-teaser',
    eyebrow: 'Story header',
    title: 'Second post teaser row',
    excerpt: 'Short excerpt for the second listing item in the hub stack.',
    image: {
      src: '/brand/logo.webp',
      alt: 'Placeholder image for second post',
      width: 500,
      height: 400,
    },
    tags: ['Update'],
    publishedAt: '2025-12-15',
    titleId: 'news-teaser-fixture-2',
  },
  {
    href: '/news-and-updates/third-post-on-page-one',
    eyebrow: 'Story header',
    title: 'Third post on page one',
    excerpt: 'Third teaser — spacing between rows uses the list gap token.',
    image: {
      src: '/brand/logo.webp',
      alt: 'Placeholder image for third post',
      width: 500,
      height: 400,
    },
    tags: ['Story', 'Community'],
    publishedAt: '2025-11-02',
    titleId: 'news-teaser-fixture-3',
  },
]
