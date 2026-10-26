<script setup lang="ts">
import {
  getNavigationCategory,
  localizedCategoryDescription,
  localizedCategoryFullName,
} from '~/utils/navigation'

const { t, locale } = useAppI18n()
const route = useRoute()
const slug = String(route.params.category)
const category = getNavigationCategory(slug)

if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: t('categoryMissing'),
  })
}

const displayTitle = computed(() => localizedCategoryFullName(category, locale.value))
const displayDescription = computed(() => localizedCategoryDescription(category, locale.value))
const resourceCountLabel = computed(() =>
  t('resourceCount').replace('{n}', String(category.items.length)),
)

usePageSeo({
  title: displayTitle.value,
  description: displayDescription.value,
  path: `/nav/${category.slug}`,
})
</script>

<template>
  <AppContainer
    v-if="category"
    class="space-y-12 py-12 sm:py-16"
  >
    <div>
      <PageHero
        eyebrow="Category"
        :title="displayTitle"
        :description="displayDescription"
      />
      <p class="mt-3 text-sm text-zinc-400">
        {{ resourceCountLabel }}
      </p>
    </div>

    <section class="space-y-6">
      <SectionTitle
        :title="t('resourceEntries')"
        :description="t('resourceEntriesDesc')"
      />
      <NavigationList :items="category.items" />
    </section>
  </AppContainer>
</template>
