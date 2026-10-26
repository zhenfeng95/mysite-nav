<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** Glass style for the home (dark) header */
  glass?: boolean
}>(), {
  glass: false,
})

const { locale, setLocale, t } = useAppI18n()

const btnBase = computed(() => {
  if (props.glass) {
    return 'rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 focus-visible:ring-white/60'
  }
  return 'rounded-full border border-zinc-200/80 bg-white/80 text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 focus-visible:ring-sky-400/40'
})
</script>

<template>
  <div
    class="inline-flex items-center gap-0.5 p-0.5"
    :class="btnBase"
    role="group"
    :aria-label="t('language')"
  >
    <button
      type="button"
      class="rounded-full px-2.5 py-1 text-xs font-semibold transition focus-visible:outline-none"
      :class="locale === 'zh'
        ? (glass ? 'bg-white text-sky-800 shadow-sm' : 'bg-sky-600 text-white shadow-sm')
        : (glass ? 'text-white/80 hover:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100')"
      :aria-pressed="locale === 'zh'"
      @click="setLocale('zh')"
    >
      {{ t('switchToZh') }}
    </button>
    <button
      type="button"
      class="rounded-full px-2.5 py-1 text-xs font-semibold transition focus-visible:outline-none"
      :class="locale === 'en'
        ? (glass ? 'bg-white text-sky-800 shadow-sm' : 'bg-sky-600 text-white shadow-sm')
        : (glass ? 'text-white/80 hover:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100')"
      :aria-pressed="locale === 'en'"
      @click="setLocale('en')"
    >
      {{ t('switchToEn') }}
    </button>
  </div>
</template>
