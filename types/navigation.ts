export type NavigationIcon =
  | 'ai'
  | 'dev'
  | 'design'
  | 'productivity'
  | 'news'
  | 'infra'
  | 'analytics'
  | 'webmaster'
  | 'cloud'
  | 'video'
  | 'music'
  | 'invest'

export interface NavigationItem {
  id: string
  name: string
  /** English display name; falls back to name when omitted. */
  nameEn?: string
  description: string
  /** English slogan; falls back to description when omitted. */
  descriptionEn?: string
  url: string
  /** Optional bundled icon path (e.g. /icons/sites/…). */
  iconUrl?: string
  tags: string[]
  officialUrlConfirmed: boolean
  featured?: boolean
  updatedAt?: string
}

export interface NavigationCategory {
  id: string
  slug: string
  name: string
  nameEn?: string
  /** 详情页标题；未设置时与 name 相同 */
  fullName?: string
  fullNameEn?: string
  description: string
  descriptionEn?: string
  icon: NavigationIcon
  items: NavigationItem[]
}
