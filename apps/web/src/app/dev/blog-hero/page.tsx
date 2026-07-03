import type {Metadata} from 'next'

import {BlogHeroSection} from '@/components/sections/blog-hero-section'

export const metadata: Metadata = {
  title: 'Blog hero dev',
  robots: {index: false, follow: false},
}

/** Step 2 — static blog hero. Remove or merge when article route ships. */
const STATIC_HERO = {
  seriesName: 'SERIES NAME',
  title: 'Lorem ipsum dolar sit amet consectetur adipiscing elit.',
  date: '01.21.26',
  photoCredit: "PHOTO CREDIT: PERSON'S NAME",
} as const

export default function BlogHeroDevPage() {
  return <BlogHeroSection {...STATIC_HERO} />
}
