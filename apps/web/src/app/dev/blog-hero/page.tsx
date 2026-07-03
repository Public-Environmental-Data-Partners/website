import type {Metadata} from 'next'

import {BlogHeroSection} from '@/components/sections/blog-hero-section'

export const metadata: Metadata = {
  title: 'Blog hero dev',
  robots: {index: false, follow: false},
}

/** Static blog hero for layout QA. Article route uses Sanity via mapNewsPostToBlogHeroProps. */
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

export default function BlogHeroDevPage() {
  return <BlogHeroSection {...STATIC_HERO} />
}
