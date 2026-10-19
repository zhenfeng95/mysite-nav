/**
 * Vercel x-vercel-ip-country:
 * used only to gate 51.la analytics for mainland China visitors.
 * Domestic static mirror is not enabled for this deploy.
 */
export default defineEventHandler((event) => {
  const country = (getRequestHeader(event, 'x-vercel-ip-country') || '').trim().toUpperCase()
  event.context.isCn = country === 'CN'
})
