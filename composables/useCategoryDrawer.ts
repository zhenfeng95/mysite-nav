/** Shared open state for the mobile category drawer (home layout ↔ CategorySideNav). */
export function useCategoryDrawer() {
  const isOpen = useState('category-drawer-open', () => false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}
