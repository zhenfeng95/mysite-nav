/**
 * Hydrate CN flag for client-side 51.la gating.
 */
export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  const isCn = Boolean(event?.context.isCn)
  useState<boolean>('la51-cn-only', () => false).value = isCn
})
