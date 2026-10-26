<script setup lang="ts">
const { t } = useAppI18n()

usePageSeo({
  title: t('aboutSeoTitle'),
  description: t('aboutSeoDesc'),
  path: '/about',
})
</script>

<template>
  <AppContainer class="space-y-8 py-12 sm:py-16">
    <PageHero
      eyebrow="About"
      :title="t('aboutTitle')"
      :description="t('siteDescription')"
    />
  </AppContainer>
</template>
