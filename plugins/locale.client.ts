/**
 * Keep <html lang> in sync after hydration / manual switch.
 */
export default defineNuxtPlugin(() => {
  const { htmlLang, syncFromCookie } = useAppI18n()
  syncFromCookie()
  watch(htmlLang, (lang) => {
    document.documentElement.lang = lang
  }, { immediate: true })
})
