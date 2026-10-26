import { buildHomeJsonLd } from '~/utils/jsonld'
import { isPublicIndexablePath } from '~/utils/seo-index'

export function useJsonLd(key: string, data: unknown) {
  useHead({
    script: [
      {
        key,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data),
      },
    ],
  })
}

interface PageSeoInput {
  title: string
  description: string
  path?: string
  ogImage?: string
  noindex?: boolean
}

export function usePageSeo(input: PageSeoInput) {
  const config = useRuntimeConfig()
  const { t } = useAppI18n()
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  const image = input.ogImage ?? `${siteUrl}/og-image.png`
  const siteName = t('siteName')
  const title = input.title.includes(siteName) || input.title.includes('真途导航') || input.title.includes('Zhenvia')
    ? input.title
    : `${input.title}｜${siteName}`
  const description = input.description
  const indexable = Boolean(input.path && isPublicIndexablePath(input.path))

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    robots: input.noindex
      ? 'noindex, nofollow'
      : indexable
        ? 'index, follow'
        : 'noindex, follow',
  })

  useHead({
    link: input.noindex || !input.path
      ? []
      : [{ rel: 'canonical', href: `${siteUrl}${input.path}` }],
  })
}

export function useHomeSeo() {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  const { t } = useAppI18n()
  const image = `${siteUrl}/og-image.png`

  useSeoMeta({
    title: () => t('homeSeoTitle'),
    description: () => t('siteDescription'),
    ogTitle: () => t('homeSeoTitle'),
    ogDescription: () => t('siteDescription'),
    ogImage: image,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: () => t('homeSeoTitle'),
    twitterDescription: () => t('siteDescription'),
    twitterImage: image,
    robots: 'index, follow',
  })

  useHead({
    link: [{ rel: 'canonical', href: `${siteUrl}/` }],
  })

  useJsonLd('ld-json-home', buildHomeJsonLd(siteUrl))
}
