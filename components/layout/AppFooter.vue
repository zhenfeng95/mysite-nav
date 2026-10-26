<script setup lang="ts">
import { SITE_NAME_EN } from '~/utils/site'
import { getFooterCategoryLinks } from '~/utils/navigation'

const { t, locale } = useAppI18n()
const logoSrc = assetUrl('/logo.png')

const footerAboutLinks = computed(() => [
  { label: t('aboutUs'), to: '/about' },
  { label: t('footerApply'), to: '/apply' },
  { label: t('footerDisclaimer'), to: '/disclaimer' },
  { label: t('privacy'), to: '/privacy' },
  { label: t('contact'), to: '/contact' },
])

const footerCategoryLinks = computed(() => getFooterCategoryLinks(locale.value))
</script>

<template>
  <footer class="border-t border-zinc-200/80 bg-white/70 dark:border-white/[0.06] dark:bg-black/20">
    <AppContainer>
      <div class="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div class="sm:col-span-2 lg:col-span-2">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <img :src="logoSrc" alt="" width="28" class="h-7 w-7 shrink-0 rounded-sm object-cover">
            <span class="text-sm font-semibold tracking-tight">{{ t('siteName') }}</span>
          </NuxtLink>
          <p class="mt-4 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {{ t('siteTagline') }}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {{ t('siteName') }}
          </p>
          <ul class="mt-4 space-y-2.5">
            <li
              v-for="item in footerAboutLinks"
              :key="item.to"
            >
              <NuxtLink
                :to="item.to"
                class="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {{ t('navCategories') }}
          </p>
          <ul class="mt-4 space-y-2.5">
            <li
              v-for="item in footerCategoryLinks"
              :key="item.to"
            >
              <NuxtLink
                :to="item.to"
                class="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-zinc-200/80 py-6 dark:border-white/[0.06]">
        <p class="text-xs text-zinc-400">
          © 2026 {{ SITE_NAME_EN }}
        </p>
        <p class="mt-2 text-xs leading-5 text-zinc-400">
          {{ t('disclaimerLabel') }}：{{ t('siteDisclaimer') }}
        </p>
      </div>
    </AppContainer>
  </footer>
</template>
