<script setup lang="ts">
const { t } = useAppI18n()

usePageSeo({
  title: t('privacyTitle'),
  description: t('privacySeoDesc'),
  path: '/privacy',
})
</script>

<template>
  <AppContainer class="space-y-8 py-12 sm:py-16">
    <PageHero
      eyebrow="Privacy"
      :title="t('privacyTitle')"
      :description="t('privacyIntro')"
    />
    <p class="max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
      {{ t('privacyBody') }}
    </p>
  </AppContainer>
</template>
