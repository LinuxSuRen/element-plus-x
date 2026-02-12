// Component
import PaginationTable from './PaginationTable.vue'
import type { PaginationTableProps } from './PaginationTable.vue'

// Composable
export { usePaginationTable } from './usePaginationTable'
export type { UsePaginationTableOptions, UsePaginationTableReturn } from './usePaginationTable'

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

// Export component
export { PaginationTable }
export default PaginationTable

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
