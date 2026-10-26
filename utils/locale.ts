import type { AppLocale } from '~/types/locale'
import { DEFAULT_LOCALE } from '~/types/locale'

/** Pick locale from Accept-Language (highest q that is zh* or en*). */
export function detectLocaleFromAcceptLanguage(header?: string | null): AppLocale {
  if (!header) {
    return DEFAULT_LOCALE
  }

  const parts = header
    .split(',')
    .map((raw) => {
      const [tagPart, ...params] = raw.trim().split(';')
      const tag = (tagPart || '').trim().toLowerCase()
      const qParam = params.find(p => p.trim().startsWith('q='))
      const quality = qParam ? Number.parseFloat(qParam.split('=')[1] || '1') : 1
      return { tag, quality: Number.isFinite(quality) ? quality : 0 }
    })
    .filter(p => p.tag)
    .sort((a, b) => b.quality - a.quality)

  for (const { tag } of parts) {
    if (tag.startsWith('zh')) {
      return 'zh'
    }
    if (tag.startsWith('en')) {
      return 'en'
    }
  }

  return DEFAULT_LOCALE
}

export function isAppLocale(value: unknown): value is AppLocale {
  return value === 'zh' || value === 'en'
}
