import { messages, type MessageKey } from '~/locales/messages'
import type { AppLocale } from '~/types/locale'
import { DEFAULT_LOCALE, LOCALE_COOKIE } from '~/types/locale'
import { isAppLocale } from '~/utils/locale'

export function useAppI18n() {
  const locale = useState<AppLocale>('app-locale', () => DEFAULT_LOCALE)
  const cookie = useCookie<string | null>(LOCALE_COOKIE, {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    watch: true,
  })

  const isEn = computed(() => locale.value === 'en')
  const htmlLang = computed(() => (locale.value === 'en' ? 'en' : 'zh-CN'))

  function t(key: MessageKey): string {
    return messages[locale.value][key] ?? messages.zh[key] ?? key
  }

  function setLocale(next: AppLocale) {
    locale.value = next
    cookie.value = next
    if (import.meta.client) {
      document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN'
    }
  }

  function toggleLocale() {
    setLocale(locale.value === 'zh' ? 'en' : 'zh')
  }

  /** Sync state from cookie when client hydrates (server plugin already set locale). */
  function syncFromCookie() {
    if (isAppLocale(cookie.value)) {
      locale.value = cookie.value
    }
  }

  return {
    locale,
    isEn,
    htmlLang,
    cookie,
    t,
    setLocale,
    toggleLocale,
    syncFromCookie,
  }
}
