<script setup lang="ts">
import type { IconName } from '~/components/common/AppIcon.vue'

export interface CategoryNavItem {
  id: string
  title: string
  icon: IconName
}

const props = defineProps<{
  items: CategoryNavItem[]
}>()

const { isOpen, close } = useCategoryDrawer()

const activeId = ref(props.items[0]?.id ?? '')

/** Ignore scroll-spy briefly after a nav click (smooth scroll in progress). */
let clickLockUntil = 0
let spyRaf = 0

/** Offset under sticky search / page chrome — section at this line is "active". */
function spyOffsetPx() {
  return 96
}

function updateActiveFromScroll() {
  if (performance.now() < clickLockUntil) {
    return
  }

  const offset = spyOffsetPx()
  let current = props.items[0]?.id ?? ''

  // Sections are in document order: last one whose top has crossed the spy
  // line is the category currently occupying the top of the content area.
  for (const item of props.items) {
    const el = document.getElementById(item.id)
    if (!el) {
      continue
    }
    if (el.getBoundingClientRect().top - offset <= 0) {
      current = item.id
    }
  }

  if (current && current !== activeId.value) {
    activeId.value = current
  }
}

function onScrollOrResize() {
  if (spyRaf) {
    return
  }
  spyRaf = window.requestAnimationFrame(() => {
    spyRaf = 0
    updateActiveFromScroll()
  })
}

function scrollToSection(id: string) {
  activeId.value = id
  const el = document.getElementById(id)
  if (!el) {
    return
  }
  clickLockUntil = performance.now() + 600
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onDrawerSelect(id: string) {
  close()
  // Let the drawer start closing before smooth-scroll so layout feels calmer.
  requestAnimationFrame(() => scrollToSection(id))
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    close()
  }
}

function onResize() {
  onScrollOrResize()
  // Desktop rail takes over — don't leave the drawer open after widening.
  if (isOpen.value && window.matchMedia('(min-width: 1024px)').matches) {
    close()
  }
}

watch(isOpen, (open) => {
  if (!import.meta.client) {
    return
  }
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  updateActiveFromScroll()
  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('scrollend', updateActiveFromScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('keydown', onKeydown)

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScrollOrResize)
    window.removeEventListener('scrollend', updateActiveFromScroll)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('keydown', onKeydown)
    if (spyRaf) {
      window.cancelAnimationFrame(spyRaf)
      spyRaf = 0
    }
    document.body.style.overflow = ''
  })
})
</script>

<template>
  <!--
    display:contents lets these children join the parent flex row,
    so the aside stretches with the content column and CSS sticky works smoothly.
  -->
  <div class="contents">
    <!-- Mobile left drawer -->
    <Teleport to="body">
      <div
        class="lg:hidden"
        :aria-hidden="!isOpen"
      >
        <Transition
          enter-active-class="transition-opacity duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <button
            v-if="isOpen"
            type="button"
            class="fixed inset-0 z-[60] bg-sky-950/50 backdrop-blur-[2px]"
            aria-label="关闭分类导航"
            @click="close"
          />
        </Transition>

        <Transition
          enter-active-class="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full"
        >
          <aside
            v-if="isOpen"
            id="category-drawer"
            class="fixed inset-y-0 left-0 z-[70] flex w-[min(18.5rem,86vw)] flex-col bg-white shadow-2xl shadow-sky-950/30"
            role="dialog"
            aria-modal="true"
            aria-label="分类导航"
          >
            <div class="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 px-4">
              <p class="text-sm font-semibold text-zinc-800">
                分类导航
              </p>
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
                aria-label="关闭"
                @click="close"
              >
                <AppIcon
                  name="close"
                  class="h-5 w-5"
                />
              </button>
            </div>

            <nav class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3">
              <ul class="space-y-0.5">
                <li
                  v-for="item in items"
                  :key="`drawer-${item.id}`"
                >
                  <button
                    type="button"
                    class="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm transition"
                    :class="activeId === item.id
                      ? 'bg-sky-100/90 font-semibold text-sky-700'
                      : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'"
                    @click="onDrawerSelect(item.id)"
                  >
                    <span
                      class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      :class="activeId === item.id ? 'bg-sky-200/70 text-sky-700' : 'bg-zinc-100 text-zinc-500'"
                    >
                      <AppIcon
                        :name="item.icon"
                        class="h-4 w-4"
                      />
                    </span>
                    <span class="min-w-0 flex-1 truncate">{{ item.title }}</span>
                    <span
                      v-if="activeId === item.id"
                      class="text-[10px] text-zinc-400"
                      aria-hidden="true"
                    >▸</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
        </Transition>
      </div>
    </Teleport>

    <!-- Desktop sticky rail: aside is the tall flex item; sticky panel is its child -->
    <aside class="relative hidden w-48 shrink-0 lg:block xl:w-52">
      <div
        class="sticky top-[4.75rem] z-30 max-h-[calc(100svh-5.75rem)] overflow-y-auto rounded-2xl bg-white/95 p-3 shadow-lg shadow-sky-900/10 ring-1 ring-white/80 backdrop-blur-xl"
      >
        <p class="border-b border-zinc-200/80 px-2 pb-2.5 text-sm font-semibold text-zinc-800">
          分类导航
        </p>
        <ul class="mt-2 space-y-0.5">
          <li
            v-for="item in items"
            :key="item.id"
          >
            <button
              type="button"
              class="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition"
              :class="activeId === item.id
                ? 'bg-sky-100/90 font-semibold text-sky-700'
                : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'"
              @click="scrollToSection(item.id)"
            >
              <span
                class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                :class="activeId === item.id ? 'bg-sky-200/70 text-sky-700' : 'bg-zinc-100 text-zinc-500'"
              >
                <AppIcon
                  :name="item.icon"
                  class="h-3.5 w-3.5"
                />
              </span>
              <span class="min-w-0 flex-1 truncate">{{ item.title }}</span>
              <span
                v-if="activeId === item.id"
                class="text-[10px] text-zinc-400"
                aria-hidden="true"
              >▸</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
