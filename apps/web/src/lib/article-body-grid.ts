/** Shared 12-col span classes for article body blocks — see docs/article-body-images-implementation-plan.md */
export const ARTICLE_BODY_BLOCK_CLASS = 'col-span-12 min-w-0'

/** Prose / rich text: 6 cols centered @ desktop, full width @ tablet/mobile */
export const ARTICLE_COL_PROSE_CLASS = 'col-span-12 lg:col-span-6 lg:col-start-4'

/** Single image, embed: 10 cols centered @ desktop, full width @ tablet/mobile */
export const ARTICLE_COL_10_CENTERED_CLASS = 'col-span-12 lg:col-span-10 lg:col-start-2'

/** Article audio intro: 7 cols centered @ desktop (col 4–10), full width @ tablet/mobile */
export const ARTICLE_COL_7_CENTERED_CLASS = 'col-span-12 lg:col-span-7 lg:col-start-4'

/** Two-image row: 6+6 @ md+, full width stack @ mobile */
export const ARTICLE_COL_6_PAIR_CLASS = 'col-span-12 md:col-span-6'

/** Single image block caption: 4 cols centered @ desktop, full width @ tablet/mobile */
export const ARTICLE_COL_4_CENTERED_CLASS = 'col-span-12 lg:col-span-4 lg:col-start-5'

export type ArticleBodyBlockColumnKind = 'default' | 'prose' | 'embed'

const COLUMN_CLASS_BY_KIND: Record<ArticleBodyBlockColumnKind, string> = {
  default: ARTICLE_BODY_BLOCK_CLASS,
  prose: ARTICLE_COL_PROSE_CLASS,
  embed: ARTICLE_COL_10_CENTERED_CLASS,
}

export function getArticleBodyBlockColumnClass(kind: ArticleBodyBlockColumnKind): string {
  return COLUMN_CLASS_BY_KIND[kind]
}
