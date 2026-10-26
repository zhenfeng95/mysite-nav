import navigationData from '~/data/navigation.json'
import type { AppLocale } from '~/types/locale'
import type { NavigationCategory, NavigationItem } from '~/types/navigation'

const categories = navigationData.categories as NavigationCategory[]

export interface NavigationGroup {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  slugs: string[]
}

export const navigationGroups: NavigationGroup[] = [
  {
    id: 'work',
    title: '工作与开发',
    titleEn: 'Work & Dev',
    description: 'AI、开发与效率相关入口。',
    descriptionEn: 'AI, development, and productivity entry points.',
    slugs: ['ai', 'dev', 'productivity'],
  },
  {
    id: 'finance',
    title: '投资',
    titleEn: 'Invest',
    description: '港美股与跨境投资相关入口。',
    descriptionEn: 'HK/US stocks and cross-border investing.',
    slugs: ['invest'],
  },
  {
    id: 'create',
    title: '设计与创作',
    titleEn: 'Design & Create',
    description: '设计工具与素材相关入口。',
    descriptionEn: 'Design tools and creative assets.',
    slugs: ['design'],
  },
  {
    id: 'media',
    title: '影视与音乐',
    titleEn: 'Video & Music',
    description: '视频、直播与在线音乐入口。',
    descriptionEn: 'Video, live streaming, and music.',
    slugs: ['video', 'music'],
  },
  {
    id: 'life',
    title: '社交与工具',
    titleEn: 'Social & Tools',
    description: '社交平台与实用在线工具。',
    descriptionEn: 'Social platforms and everyday tools.',
    slugs: ['social', 'tools', 'storage', 'analytics', 'webmaster'],
  },
]

const shortDescriptions: Record<string, { zh: string, en: string }> = {
  ai: { zh: '对话、写作与开发相关 AI 入口', en: 'AI chat, writing, and developer tools' },
  dev: { zh: '代码托管、包管理与部署入口', en: 'Code hosting, packages, and deploy' },
  productivity: { zh: '笔记、任务与协作入口', en: 'Notes, tasks, and collaboration' },
  invest: { zh: '港美股与跨境投资入口', en: 'HK/US stocks & cross-border investing' },
  design: { zh: '界面设计与图标资源入口', en: 'UI design and icon resources' },
  social: { zh: '社交、问答与邮箱入口', en: 'Social, Q&A, and email' },
  tools: { zh: '翻译、查询与格式化工具', en: 'Translate, lookup, and format tools' },
  storage: { zh: '百度、阿里、夸克、天翼等网盘入口', en: 'Cloud drives and file storage' },
  video: { zh: '影视、短视频与直播平台入口', en: 'Video, short video, and live' },
  music: { zh: '网易云、QQ 音乐与酷狗入口', en: 'Online music platforms' },
  analytics: { zh: '网站 PV / UV 与流量分析入口', en: 'Site PV/UV and traffic analytics' },
  webmaster: { zh: '搜索引擎站长与收录平台入口', en: 'Search webmaster & indexing tools' },
}

export function localizedItemName(item: Pick<NavigationItem, 'name' | 'nameEn'>, locale: AppLocale): string {
  return locale === 'en' ? (item.nameEn || item.name) : item.name
}

export function localizedItemDescription(
  item: Pick<NavigationItem, 'description' | 'descriptionEn'>,
  locale: AppLocale,
): string {
  return locale === 'en' ? (item.descriptionEn || item.description) : item.description
}

export function localizedCategoryName(
  category: Pick<NavigationCategory, 'name' | 'nameEn'>,
  locale: AppLocale,
): string {
  return locale === 'en' ? (category.nameEn || category.name) : category.name
}

export function localizedCategoryFullName(
  category: Pick<NavigationCategory, 'name' | 'nameEn' | 'fullName' | 'fullNameEn'>,
  locale: AppLocale,
): string {
  if (locale === 'en') {
    return category.fullNameEn || category.nameEn || category.fullName || category.name
  }
  return category.fullName || category.name
}

export function localizedCategoryDescription(
  category: Pick<NavigationCategory, 'description' | 'descriptionEn'>,
  locale: AppLocale,
): string {
  return locale === 'en' ? (category.descriptionEn || category.description) : category.description
}

export function localizedGroupTitle(group: NavigationGroup, locale: AppLocale): string {
  return locale === 'en' ? group.titleEn : group.title
}

export function localizedGroupDescription(group: NavigationGroup, locale: AppLocale): string {
  return locale === 'en' ? group.descriptionEn : group.description
}

export function getNavigationCategories(): NavigationCategory[] {
  return categories.map(category => ({
    ...category,
    items: [...category.items],
  }))
}

export function getNavigationCategory(slug: string): NavigationCategory | undefined {
  const category = categories.find(item => item.slug === slug)
  if (!category) {
    return undefined
  }

  return {
    ...category,
    items: [...category.items],
  }
}

export function getNavigationShortDescription(slug: string, locale: AppLocale = 'zh'): string {
  const entry = shortDescriptions[slug]
  if (entry) {
    return locale === 'en' ? entry.en : entry.zh
  }
  const category = getNavigationCategory(slug)
  return category ? localizedCategoryDescription(category, locale) : ''
}

export function getGroupedNavigationCategories(): Array<
  NavigationGroup & { categories: NavigationCategory[] }
> {
  const bySlug = new Map(getNavigationCategories().map(item => [item.slug, item]))

  return navigationGroups.map(group => ({
    ...group,
    categories: group.slugs
      .map(slug => bySlug.get(slug))
      .filter((item): item is NavigationCategory => Boolean(item)),
  }))
}

export function getFeaturedNavigationItems(
  limit = 6,
  locale: AppLocale = 'zh',
): Array<NavigationItem & { categoryName: string, categorySlug: string }> {
  return categories
    .flatMap(category => category.items
      .filter(item => item.featured)
      .map(item => ({
        ...item,
        categoryName: localizedCategoryName(category, locale),
        categorySlug: category.slug,
      })))
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, limit)
}

export function getNavigationPath(slug?: string): string {
  if (!slug) {
    return '/nav'
  }
  return `/nav/${slug}`
}

export function sortNavigationItems(items: NavigationItem[]): NavigationItem[] {
  return [...items].sort((a, b) => {
    const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featuredDiff !== 0) {
      return featuredDiff
    }
    return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')
  })
}

export function getFooterCategoryLinks(locale: AppLocale = 'zh') {
  return getNavigationCategories().map(category => ({
    label: localizedCategoryName(category, locale),
    to: getNavigationPath(category.slug),
  }))
}
