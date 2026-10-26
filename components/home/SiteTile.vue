<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'
import { getFaviconCandidates } from '~/utils/favicon'
import { localizedItemDescription, localizedItemName } from '~/utils/navigation'

const props = defineProps<{
  item: NavigationItem
}>()

const { locale } = useAppI18n()
const assetCdn = useAssetCdn()
const candidates = computed(() =>
  getFaviconCandidates(props.item.url, 64, props.item.iconUrl, props.item.id, assetCdn.value),
)
const candidateIndex = ref(0)

const favicon = computed(() => candidates.value[candidateIndex.value] ?? '')
const showImage = computed(() => Boolean(favicon.value) && candidateIndex.value < candidates.value.length)
const displayName = computed(() => localizedItemName(props.item, locale.value))
const displaySlogan = computed(() => localizedItemDescription(props.item, locale.value))

function onImgError() {
  if (candidateIndex.value < candidates.value.length - 1) {
    candidateIndex.value += 1
    return
  }
  candidateIndex.value = candidates.value.length
}

/** Handle cached images whose load event may fire before the Vue listener is attached. */
function bindImg(el: Element | null) {
  if (!(el instanceof HTMLImageElement)) {
    return
  }
  if (el.complete && el.naturalWidth === 0) {
    onImgError()
  }
}
</script>

<template>
  <a
    :href="item.url"
    target="_blank"
    rel="noreferrer noopener"
    class="group flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white px-3 py-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md sm:gap-3.5 sm:px-3.5 sm:py-3"
  >
    <span
      class="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-50 ring-1 ring-zinc-200/70 sm:h-12 sm:w-12"
    >
      <span
        class="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-600 text-base font-semibold text-white"
        aria-hidden="true"
      >
        {{ displayName.slice(0, 1) }}
      </span>
      <img
        v-if="showImage"
        :key="favicon"
        :ref="bindImg"
        :src="favicon"
        :alt="displayName"
        width="48"
        height="48"
        class="absolute inset-0 h-full w-full bg-white object-contain p-1.5"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        @error="onImgError"
      >
    </span>

    <span class="min-w-0 flex-1 text-left">
      <span class="block truncate text-sm font-semibold tracking-tight text-zinc-900 sm:text-[15px]">
        {{ displayName }}
      </span>
      <span class="mt-0.5 block line-clamp-1 text-xs leading-5 text-zinc-500 sm:text-[13px]">
        {{ displaySlogan }}
      </span>
    </span>
  </a>
</template>
