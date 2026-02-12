// Types
export type {
  PaginationData,
  SearchKind,
  SelectOption,
  Column,
  PaginationTableConfig,
  DataLoader,
  DeleteHandler
} from './types'

// Component
import PaginationTable from './PaginationTable.vue'
import type { PaginationTableProps } from './PaginationTable.vue'

// Re-export component as default (for library consumers)
export { PaginationTable as default }
export type { PaginationTableProps } from './PaginationTable.vue'

// Composable
export { usePaginationTable } from './usePaginationTable'
export type { UsePaginationTableOptions, UsePaginationTableReturn } from './usePaginationTable'

// Vue plugin for global registration
import type { App } from 'vue'

export const PaginationTablePlugin = {
  install(app: App) {
    app.component('EpxPaginationTable', PaginationTable)
  }
}

// Auto-install when used with script tag
if (typeof window !== 'undefined' && (window as any).Vue) {
  (window as any).Vue.use(PaginationTablePlugin)
}
