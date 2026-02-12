/**
 * Represents pagination data returned from API
 */
export interface PaginationData<T = any> {
  page: number
  page_size: number
  total: number
  data: T[]
}

/**
 * Search field types
 */
export type SearchKind = 'input' | 'date' | 'select'

/**
 * Option for select search fields
 */
export interface SelectOption {
  label: string
  value: string | number
}

/**
 * Column definition for the table
 */
export interface Column {
  /** Column header label */
  label: string
  /** Property name in data object */
  prop: string
  /** Column width */
  width?: number
  /** Column type - 'slot' for custom content rendering */
  kind?: 'slot'
  /** Whether this column is searchable */
  searchable?: boolean
  /** Key to use for search (defaults to prop) */
  searchKey?: string
  /** Type of search field */
  searchKind?: SearchKind
  /** Options for select search fields */
  options?: SelectOption[]
  /** Custom formatter for cell value */
  formatter?: (row: any, column: any, cellValue: any) => string
}

/**
 * Configuration for the table
 */
export interface PaginationTableConfig {
  /** URL to fetch data from (optional if using custom data loader) */
  dataUrl?: string
  /** Initial page number */
  page?: number
  /** Initial page size */
  pageSize?: number
  /** Page size options */
  pageSizes?: number[]
  /** Property name for delete key */
  deleteKey?: string
}

/**
 * Custom data loader function
 */
export interface DataLoader {
  (params: { page: number; page_size: number; [key: string]: any }): Promise<PaginationData>
}

/**
 * Custom delete handler
 */
export interface DeleteHandler {
  (item: any): Promise<void>
}
