export interface StoreConfig {
  id: string
  dollar_ratio: number
  notification: string
}

export type StoreConfigUpdate = Partial<Omit<StoreConfig, "id">>
