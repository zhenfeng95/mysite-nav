<script setup lang="ts">
import type { MessageKey } from '~/locales/messages'
import { SITE_NAME_EN } from '~/utils/site'
import {
  getNavigationCategories,
  localizedCategoryName,
} from '~/utils/navigation'

definePageMeta({
  layout: false,
})

const { t, locale } = useAppI18n()
const toast = useToast()

usePageSeo({
  title: t('applyTitle'),
  description: t('applySeoDesc'),
  path: '/apply',
})

const navBgStyle = computed(() => ({
  backgroundImage: `url('${assetUrl('/images/nav-bg.jpg')}')`,
}))

const categories = computed(() =>
  getNavigationCategories().map(category => ({
    slug: category.slug,
    name: localizedCategoryName(category, locale.value),
  })),
)

const guidelines = computed(() => [
  t('applyGuideline1'),
  t('applyGuideline2'),
  t('applyGuideline3'),
  t('applyGuideline4'),
])

const form = reactive({
  url: '',
  category: '',
  name: '',
  iconUrl: '',
  captcha: '',
  website: '',
})

const submitting = ref(false)
const prefetching = ref(false)
const captchaKey = ref(0)
const iconFileInput = ref<HTMLInputElement | null>(null)
const iconFileName = ref('')

const ICON_MAX_BYTES = 1024 * 1024
const ICON_ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico'

/** Map known Chinese API messages to localized copy on the form. */
const apiMessageKeys: Record<string, MessageKey> = {
  '无法访问该地址，请检查链接后重试。': 'applyPrefetchFail',
  '请填写有效的网站地址。': 'applyNeedUrl',
  '仅支持 http 或 https 链接。': 'applyNeedUrl',
  '请填写网站名称。': 'applyNeedName',
  '请填写网站地址。': 'applyNeedUrl',
  '请选择有效的分组。': 'applyNeedCategory',
  '图标文件过大，请压缩后重试（不超过 1MB）。': 'applyIconSizeError',
  '提交成功，我们会尽快审核。': 'applySubmitOk',
  '提交失败，请稍后重试。': 'applySubmitFail',
}

function localizeApiMessage(message?: string, fallbackKey: MessageKey = 'applySubmitFail'): string {
  if (!message) {
    return t(fallbackKey)
  }
  if (locale.value === 'zh') {
    return message
  }
  const key = apiMessageKeys[message]
  if (key) {
    return t(key)
  }
  // e.g. 站点返回异常（404）…
  if (message.startsWith('站点返回异常')) {
    return t('applyPrefetchFail')
  }
  return t(fallbackKey)
}

function refreshCaptcha() {
  captchaKey.value += 1
  form.captcha = ''
}

function validateForm(): string | null {
  if (!form.url.trim()) {
    return t('applyNeedUrl')
  }
  if (!form.category) {
    return t('applyNeedCategory')
  }
  if (!form.name.trim()) {
    return t('applyNeedName')
  }
  if (!form.captcha.trim()) {
    return t('applyNeedCaptcha')
  }
  return null
}

async function onPrefetch() {
  if (!form.url.trim()) {
    toast.error(t('applyPrefetchNeedUrl'))
    return
  }

  prefetching.value = true
  try {
    const result = await $fetch<{ name: string, iconUrl: string, url: string }>(
      '/api/submissions/prefetch',
      {
        method: 'POST',
        body: { url: form.url },
      },
    )
    form.url = result.url || form.url
    if (result.name) {
      form.name = result.name
    }
    if (result.iconUrl) {
      form.iconUrl = result.iconUrl
      iconFileName.value = ''
    }
    toast.success(t('applyPrefetchOk'))
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }, message?: string }
    toast.error(localizeApiMessage(err?.data?.message || err?.message, 'applyPrefetchFail'))
  }
  finally {
    prefetching.value = false
  }
}

function onIconTextInput(event: Event) {
  iconFileName.value = ''
  form.iconUrl = (event.target as HTMLInputElement).value
}

function onPickIcon() {
  iconFileInput.value?.click()
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error(t('applyFileReadFail')))
    reader.readAsDataURL(file)
  })
}

async function onIconFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/') && !/\.ico$/i.test(file.name)) {
    toast.error(t('applyIconTypeError'))
    return
  }

  if (file.size > ICON_MAX_BYTES) {
    toast.error(t('applyIconSizeError'))
    return
  }

  try {
    const dataUrl = await readFileAsDataUrl(file)
    form.iconUrl = dataUrl
    iconFileName.value = file.name
    toast.success(t('applyIconPicked'))
  }
  catch {
    toast.error(t('applyIconReadFail'))
  }
}

async function onSubmit() {
  const validationError = validateForm()
  if (validationError) {
    toast.error(validationError)
    return
  }

  submitting.value = true
  try {
    await $fetch<{ ok: boolean, message: string }>('/api/submissions', {
      method: 'POST',
      body: { ...form },
    })
    toast.success(t('applySubmitOk'))
    form.url = ''
    form.category = ''
    form.name = ''
    form.iconUrl = ''
    iconFileName.value = ''
    form.captcha = ''
    form.website = ''
    refreshCaptcha()
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }, message?: string }
    toast.error(localizeApiMessage(err?.data?.message || err?.message, 'applySubmitFail'))
    refreshCaptcha()
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
    <div
      class="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
      :style="navBgStyle"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none fixed inset-0 -z-10 bg-sky-900/25 backdrop-blur-[2px]"
      aria-hidden="true"
    />

    <div class="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
      <LocaleToggle glass />
    </div>

    <div class="mx-auto w-full max-w-2xl">
      <div class="rounded-2xl bg-white/95 px-6 py-8 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:px-10 sm:py-10">
        <h1 class="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {{ t('applyTitle') }}
        </h1>

        <section class="mt-6">
          <h2 class="text-sm font-semibold text-zinc-900">
            {{ t('applyGuidelinesTitle') }}
          </h2>
          <ol class="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-zinc-600">
            <li
              v-for="item in guidelines"
              :key="item"
            >
              {{ item }}
            </li>
          </ol>
        </section>

        <form
          class="relative mt-7 space-y-5"
          novalidate
          @submit.prevent="onSubmit"
        >
          <div>
            <label
              for="url"
              class="block text-sm font-semibold text-zinc-800"
            >
              <span class="text-rose-500">*</span>{{ t('applyUrlLabel') }}
            </label>
            <div class="mt-2 flex overflow-hidden rounded-lg border border-zinc-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200">
              <input
                id="url"
                v-model="form.url"
                type="text"
                maxlength="500"
                class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
                :placeholder="t('applyUrlPlaceholder')"
              >
              <button
                type="button"
                class="shrink-0 border-l border-zinc-200 bg-zinc-50 px-3 text-sm text-sky-700 transition hover:bg-sky-50 disabled:opacity-60"
                :disabled="prefetching"
                @click="onPrefetch"
              >
                {{ prefetching ? t('applyPrefetching') : t('applyPrefetch') }}
              </button>
            </div>
          </div>

          <div>
            <label
              for="category"
              class="block text-sm font-semibold text-zinc-800"
            >
              <span class="text-rose-500">*</span>{{ t('applyCategoryLabel') }}
            </label>
            <select
              id="category"
              v-model="form.category"
              class="apply-select mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            >
              <option
                disabled
                value=""
              >
                {{ t('applyCategoryPlaceholder') }}
              </option>
              <option
                v-for="item in categories"
                :key="item.slug"
                :value="item.slug"
              >
                {{ item.name }}
              </option>
            </select>
          </div>

          <div>
            <label
              for="name"
              class="block text-sm font-semibold text-zinc-800"
            >
              <span class="text-rose-500">*</span>{{ t('applyNameLabel') }}
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              maxlength="80"
              class="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              :placeholder="t('applyNamePlaceholder')"
            >
            <p class="mt-1.5 text-xs text-zinc-400">
              {{ t('applyNameHint') }}
            </p>
          </div>

          <div>
            <label
              for="iconUrl"
              class="block text-sm font-semibold text-zinc-800"
            >
              {{ t('applyIconLabel') }}
            </label>
            <div class="mt-2 flex overflow-hidden rounded-lg border border-zinc-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200">
              <input
                id="iconUrl"
                type="text"
                :value="iconFileName || form.iconUrl"
                class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
                :placeholder="t('applyIconPlaceholder')"
                @input="onIconTextInput"
              >
              <input
                ref="iconFileInput"
                type="file"
                class="hidden"
                :accept="ICON_ACCEPT"
                @change="onIconFileChange"
              >
              <button
                type="button"
                class="shrink-0 border-l border-zinc-200 bg-zinc-50 px-4 text-sm text-sky-700 transition hover:bg-sky-50"
                @click="onPickIcon"
              >
                {{ t('applyIconPick') }}
              </button>
            </div>
            <p class="mt-1.5 text-xs text-zinc-500">
              {{ t('applyIconHint') }}
            </p>
            <p class="mt-1 text-xs text-zinc-400">
              {{ t('applyIconHintManual') }}
            </p>
            <div
              v-if="form.iconUrl"
              class="mt-2 flex items-center gap-2"
            >
              <img
                :src="form.iconUrl"
                alt=""
                width="24"
                height="24"
                class="h-6 w-6 rounded object-contain"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              >
              <span class="text-xs text-zinc-400">{{ t('applyIconPreview') }}</span>
            </div>
          </div>

          <div>
            <label
              for="captcha"
              class="block text-sm font-semibold text-zinc-800"
            >
              <span class="text-rose-500">*</span>{{ t('applyCaptchaLabel') }}
            </label>
            <div class="mt-2 flex items-center gap-3">
              <input
                id="captcha"
                v-model="form.captcha"
                type="text"
                inputmode="numeric"
                maxlength="8"
                class="w-36 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                :placeholder="t('applyCaptchaPlaceholder')"
                autocomplete="off"
              >
              <button
                type="button"
                class="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
                :title="t('applyCaptchaRefresh')"
                @click="refreshCaptcha"
              >
                <img
                  :key="captchaKey"
                  :src="`/api/captcha?t=${captchaKey}`"
                  :alt="t('applyCaptchaAlt')"
                  width="120"
                  height="40"
                  class="h-10 w-[7.5rem]"
                >
              </button>
            </div>
          </div>

          <div
            class="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            aria-hidden="true"
          >
            <label for="website">{{ t('applyHoneypot') }}</label>
            <input
              id="website"
              v-model="form.website"
              type="text"
              tabindex="-1"
              autocomplete="off"
            >
          </div>

          <button
            type="submit"
            class="w-full rounded-lg bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="submitting"
          >
            {{ submitting ? t('applySubmitting') : t('applySubmit') }}
          </button>

          <div class="pt-2 text-center">
            <NuxtLink
              to="/"
              class="text-sm text-zinc-400 transition hover:text-zinc-600"
            >
              {{ t('applyBackHome') }}
            </NuxtLink>
            <p class="mt-3 text-xs text-zinc-400">
              Copyright © 2026 {{ t('siteName') }}（{{ SITE_NAME_EN }}）. All Rights Reserved.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.apply-select {
  appearance: none;
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1rem;
}
</style>
