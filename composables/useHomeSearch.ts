import { searchEngineI18n } from '~/locales/messages'
import { getFaviconCandidates } from '~/utils/favicon'

export interface SearchEngine {
  id: string
  name: string
  domain: string
  queryUrl: string
  placeholder: string
  accentClass?: string
}

const HOME_SEARCH_ENGINE_DEFS: Array<Omit<SearchEngine, 'name' | 'placeholder'> & { id: string }> = [
  {
    id: 'baidu',
    domain: 'www.baidu.com',
    queryUrl: 'https://www.baidu.com/s?wd=',
  },
  {
    id: 'google',
    domain: 'www.google.com',
    queryUrl: 'https://www.google.com/search?q=',
  },
  {
    id: 'bing',
    domain: 'www.bing.com',
    queryUrl: 'https://www.bing.com/search?q=',
  },
  {
    id: 'duckduckgo',
    domain: 'duckduckgo.com',
    queryUrl: 'https://duckduckgo.com/?q=',
  },
  {
    id: 'sogou',
    domain: 'www.sogou.com',
    queryUrl: 'https://www.sogou.com/web?query=',
  },
  {
    id: 'zhihu',
    domain: 'www.zhihu.com',
    queryUrl: 'https://www.zhihu.com/search?type=content&q=',
    accentClass: 'text-sky-600',
  },
  {
    id: 'bilibili',
    domain: 'www.bilibili.com',
    queryUrl: 'https://search.bilibili.com/all?keyword=',
    accentClass: 'text-pink-500',
  },
  {
    id: 'weibo',
    domain: 'weibo.com',
    queryUrl: 'https://s.weibo.com/weibo?q=',
    accentClass: 'text-orange-500',
  },
  {
    id: 'translate',
    domain: 'fanyi.baidu.com',
    queryUrl: 'https://fanyi.baidu.com/#auto/zh/',
    accentClass: 'text-blue-600',
  },
]

export function useHomeSearch() {
  const { locale } = useAppI18n()
  const activeId = useState<string>('home-search-engine', () => HOME_SEARCH_ENGINE_DEFS[0]!.id)
  const query = useState<string>('home-search-query', () => '')
  const iconIndexById = useState<Record<string, number>>('home-search-icon-index', () => ({}))
  const assetCdn = useAssetCdn()

  const engines = computed<SearchEngine[]>(() =>
    HOME_SEARCH_ENGINE_DEFS.map((def) => {
      const i18n = searchEngineI18n[def.id]?.[locale.value] ?? searchEngineI18n[def.id]?.zh
      return {
        ...def,
        name: i18n?.name ?? def.id,
        placeholder: i18n?.placeholder ?? '',
      }
    }),
  )
  const activeEngine = computed(
    () => engines.value.find(e => e.id === activeId.value) ?? engines.value[0]!,
  )

  function engineIconCandidates(engine: SearchEngine) {
    return getFaviconCandidates(
      `https://${engine.domain}`,
      32,
      undefined,
      engine.id,
      assetCdn.value,
    )
  }

  function engineIcon(engine: SearchEngine) {
    const candidates = engineIconCandidates(engine)
    const index = iconIndexById.value[engine.id] ?? 0
    return candidates[index] ?? ''
  }

  function onEngineIconError(engine: SearchEngine) {
    const candidates = engineIconCandidates(engine)
    const next = (iconIndexById.value[engine.id] ?? 0) + 1
    if (next < candidates.length) {
      iconIndexById.value = { ...iconIndexById.value, [engine.id]: next }
    }
  }

  function selectEngine(id: string) {
    activeId.value = id
  }

  function submitSearch() {
    const q = query.value.trim()
    if (!q || !import.meta.client) {
      return
    }
    window.open(`${activeEngine.value.queryUrl}${encodeURIComponent(q)}`, '_blank', 'noopener,noreferrer')
  }

  return {
    engines,
    activeId,
    query,
    activeEngine,
    engineIcon,
    onEngineIconError,
    selectEngine,
    submitSearch,
  }
}
