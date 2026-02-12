import { ref, reactive, onMounted, type Ref } from 'vue'
import type { PaginationData, DataLoader, DeleteHandler, PaginationTableConfig } from './types'

export interface UsePaginationTableOptions {
  /** Function to load paginated data */
  dataLoader: DataLoader
  /** Initial configuration */
  config?: PaginationTableConfig
}

export interface UsePaginationTableReturn {
  /** Current pagination data */
  paginationData: Ref<PaginationData>
  /** Loading state */
  loading: Ref<boolean>
  /** Search form data */
  searchForm: Record<string, any>
  /** Load data with current params */
  loadData: () => Promise<void>
  /** Handle page change */
  handlePageChange: (page: number) => void
  /** Handle page size change */
  handleSizeChange: (size: number) => void
  /** Handle deletion */
  handleDelete: (item: any, deleteHandler?: DeleteHandler) => Promise<void>
  /** Reset search form and reload */
  handleReset: () => void
  /** Initialize the table (auto-called on mount) */
  init: () => void
}

/**
 * Composable for managing paginated table with search functionality
 */
export function usePaginationTable(
  options: UsePaginationTableOptions
): UsePaginationTableReturn {
  const { dataLoader, config = {} } = options

  const loading = ref(false)
  const searchForm = reactive<Record<string, any>>({})

  const paginationData = ref<PaginationData>({
    page: config.page ?? 1,
    page_size: config.pageSize ?? 10,
    total: 0,
    data: []
  })

  const loadData = async () => {
    try {
      loading.value = true
      const params = {
        ...searchForm,
        page: paginationData.value.page,
        page_size: paginationData.value.page_size
      }
      const result = await dataLoader(params)
      paginationData.value = result
    } catch (err) {
      console.error('Failed to load data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = (page: number) => {
    paginationData.value.page = page
    loadData()
  }

  const handleSizeChange = (size: number) => {
    paginationData.value.page_size = size
    paginationData.value.page = 1
    loadData()
  }

  const handleReset = () => {
    Object.keys(searchForm).forEach(key => {
      searchForm[key] = ''
    })
    loadData()
  }

  const handleDelete = async (item: any, deleteHandler?: DeleteHandler) => {
    if (!deleteHandler) {
      console.warn('No delete handler provided')
      return
    }
    await deleteHandler(item)
    loadData()
  }

  const init = () => {
    // Adjust page size based on window height
    const height = window.innerHeight
    if (height <= 770) {
      paginationData.value.page_size = 10
    } else if (height >= 1180) {
      paginationData.value.page_size = 20
    }

    loadData()
  }

  onMounted(() => {
    init()
  })

  return {
    paginationData,
    loading,
    searchForm,
    loadData,
    handlePageChange,
    handleSizeChange,
    handleDelete,
    handleReset,
    init
  }
}
