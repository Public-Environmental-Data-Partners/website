import type {Metadata} from 'next'

import {ArticleHeroSection} from '@/components/sections/article-hero-section'

export const metadata: Metadata = {
  title: 'Article hero dev',
  robots: {index: false, follow: false},
}

/** Static article hero for layout QA. Article route uses Sanity via mapNewsPostToArticleHeroProps. */
const STATIC_HERO = {
  seriesName: 'SERIES NAME',
  title: 'Lorem ipsum dolar sit amet consectetur adipiscing elit.',
  date: '01.21.26',
  photoCredit: "PHOTO CREDIT: PERSON'S NAME",
  image: {
    src: '/brand/logo.webp',
    alt: 'Placeholder hero image',
    width: 1900,
    height: 1267,
  },
} as const

export default function ArticleHeroDevPage() {
  return <ArticleHeroSection {...STATIC_HERO} />
}
