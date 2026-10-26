import { DEFAULT_LOCALE, LOCALE_COOKIE } from '~/types/locale'
import { detectLocaleFromAcceptLanguage, isAppLocale } from '~/utils/locale'

/**
 * Resolve locale before render: cookie preference → Accept-Language → default zh.
 * Path stays unchanged; only content language switches.
 */
export default defineNuxtPlugin(() => {
  const locale = useState('app-locale', () => DEFAULT_LOCALE)
  const cookie = useCookie<string | null>(LOCALE_COOKIE, {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  if (isAppLocale(cookie.value)) {
    locale.value = cookie.value
    return
  }

  const headers = useRequestHeaders(['accept-language'])
  locale.value = detectLocaleFromAcceptLanguage(headers['accept-language'])
})
