
/**
 * App modes
 * 聊天工作流、普通工作流、文本生成
 */
export const enum AppMode {
  chatflow= 'chatflow',
  workflow= 'workflow'
}
// export const AppModes = ['chatflow', 'workflow'] as const
// export type AppMode = typeof AppModes[number]

/**
 * App
 */
export type App = {
    /** App ID */
    id: string
    /** Name */
    name: string
    /** Description */
    description: string
  
    /**
     * Icon Type
     * @default 'emoji'
    */
    // icon_type: AppIconType | null
    /** Icon, stores file ID if icon_type is 'image' */
    icon: string
    /** Icon Background, only available when icon_type is null or 'emoji' */
    icon_background: string | null
    /** Icon URL, only available when icon_type is 'image' */
    icon_url: string | null
    /** Whether to use app icon as answer icon */
    use_icon_as_answer_icon: boolean
  
    /** Mode */
    mode: AppMode
    /** Enable web app */
    enable_site: boolean
    /** Enable web API */
    enable_api: boolean
    /** API requests per minute, default is 60 */
    api_rpm: number
    /** API requests per hour, default is 3600 */
    api_rph: number
    /** Whether it's a demo app */
    is_demo: boolean
    /** Model configuration */
    // model_config: ModelConfig
    // app_model_config: ModelConfig
    /** Timestamp of creation */
    created_at: number
    /** Web Application Configuration */
    // site: SiteConfig
    /** api site url */
    api_base_url: string
    // tags: Tag[]
  }