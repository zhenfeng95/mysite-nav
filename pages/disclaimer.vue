<script setup lang="ts">
const { t } = useAppI18n()

usePageSeo({
  title: t('disclaimerTitle'),
  description: t('disclaimerSeoDesc'),
  path: '/disclaimer',
})
</script>

<template>
  <AppContainer class="space-y-8 py-12 sm:py-16">
    <PageHero
      eyebrow="Disclaimer"
      :title="t('disclaimerTitle')"
      :description="t('siteDisclaimer')"
    />
  </AppContainer>
</template>
