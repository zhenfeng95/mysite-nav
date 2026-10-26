<script setup lang="ts">
import { SITE_CONTACT_EMAIL } from '~/utils/site'

const { t } = useAppI18n()

usePageSeo({
  title: t('contactTitle'),
  description: t('contactSeoDesc'),
  path: '/contact',
})
</script>

<template>
  <AppContainer class="space-y-8 py-12 sm:py-16">
    <PageHero
      eyebrow="Contact"
      :title="t('contactTitle')"
      :description="t('contactIntro')"
    />
    <p class="text-sm text-zinc-600 dark:text-zinc-300">
      {{ t('emailLabel') }}
      <a
        :href="`mailto:${SITE_CONTACT_EMAIL}`"
        class="font-medium text-accent underline decoration-accent/30 underline-offset-2"
      >
        {{ SITE_CONTACT_EMAIL }}
      </a>
    </p>
    <p class="text-sm text-zinc-600 dark:text-zinc-300">
      <NuxtLink
        to="/apply"
        class="font-medium text-accent underline decoration-accent/30 underline-offset-2"
      >
        {{ t('footerApply') }}
      </NuxtLink>
    </p>
  </AppContainer>
</template>
