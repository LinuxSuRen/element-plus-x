<template>
  <div class="epx-pagination-table">
    <!-- Search Bar -->
    <div v-if="hasSearchBar" class="epx-search-bar">
      <el-row :gutter="10">
        <el-col
          v-for="field in searchFields"
          :key="field.prop"
          :span="searchColSpan ?? 4"
        >
          <!-- Date picker -->
          <el-date-picker
            v-if="field.searchKind === 'date'"
            v-model="searchForm[field.searchKey ?? field.prop]"
            type="datetime"
            :placeholder="field.label"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"
            @change="loadData"
            clearable
          />
          <!-- Select -->
          <el-select
            v-else-if="field.searchKind === 'select' && field.options"
            v-model="searchForm[field.searchKey ?? field.prop]"
            :placeholder="field.label"
            @change="loadData"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in field.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- Input -->
          <el-input
            v-else
            v-model="searchForm[field.searchKey ?? field.prop]"
            :placeholder="field.label"
            @keyup.enter="loadData"
            clearable
          />
        </el-col>
        <el-col :span="buttonColSpan ?? 4">
          <el-button type="primary" @click="loadData">
            {{ searchButtonText }}
          </el-button>
          <el-button @click="handleReset">
            {{ resetButtonText }}
          </el-button>
          <slot name="button-tail" />
        </el-col>
      </el-row>
    </div>

    <!-- Table -->
    <el-table
      :data="paginationData?.data ?? []"
      v-loading="loading"
      v-bind="$attrs"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :formatter="column.formatter"
      >
        <template #default="{ row }" v-if="column.kind === 'slot'">
          <slot :name="column.prop" :row="row" />
        </template>
      </el-table-column>

      <!-- Actions column -->
      <el-table-column
        v-if="showActions"
        :label="actionLabel"
        :width="actionWidth"
        :fixed="actionFixed"
      >
        <template #default="{ row }">
          <slot name="actions" :row="row">
            <el-button
              v-if="deleteKey"
              type="danger"
              @click="handleDeleteClick(row)"
            >
              {{ deleteButtonText }}
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div
      v-if="showPagination"
      class="epx-pagination-container"
    >
      <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="paginationData?.page ?? 1"
        :page-sizes="pageSizes"
        :page-size="paginationData?.page_size ?? 10"
        :total="paginationData?.total ?? 0"
        :layout="paginationLayout"
        background
        v-bind="paginationProps"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type {
  Column,
  DataLoader,
  DeleteHandler
} from './types'
import { usePaginationTable } from './usePaginationTable'

export interface PaginationTableProps {
  /** Table columns definition */
  columns: Column[]
  /** Function to load paginated data */
  dataLoader: DataLoader
  /** Optional custom delete handler */
  deleteHandler?: DeleteHandler
  /** Property name for delete key (shows delete button if set) */
  deleteKey?: string
  /** Page size options */
  pageSizes?: number[]
  /** Pagination layout */
  paginationLayout?: string
  /** Additional props for el-pagination */
  paginationProps?: Record<string, any>
  /** Span for search field columns */
  searchColSpan?: number
  /** Span for button column */
  buttonColSpan?: number
  /** Text for search button */
  searchButtonText?: string
  /** Text for reset button */
  resetButtonText?: string
  /** Text for delete button */
  deleteButtonText?: string
  /** Label for actions column */
  actionLabel?: string
  /** Width for actions column */
  actionWidth?: number
  /** Whether actions column is fixed */
  actionFixed?: boolean | 'left' | 'right'
  /** Minimum total to show pagination (0 = always show) */
  paginationMinTotal?: number
  /** Auto-initialize on mount */
  autoInit?: boolean
  /** Delete confirmation message */
  deleteConfirmMessage?: string
}

const props = withDefaults(defineProps<PaginationTableProps>(), {
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  searchButtonText: 'Search',
  resetButtonText: 'Reset',
  deleteButtonText: 'Delete',
  actionLabel: 'Actions',
  actionWidth: 120,
  actionFixed: false,
  paginationMinTotal: 0,
  autoInit: true,
  deleteConfirmMessage: 'Are you sure you want to delete this record?'
})

const emit = defineEmits<{
  (e: 'data-loaded', data: any[]): void
  (e: 'delete', item: any): void
}>()

// Use composable
const {
  paginationData,
  loading,
  searchForm,
  loadData,
  handlePageChange,
  handleSizeChange,
  handleDelete,
  handleReset,
  init
} = usePaginationTable({
  dataLoader: props.dataLoader
})

// Expose methods
defineExpose({
  loadData,
  refresh: loadData
})

// Computed properties
const searchFields = computed(() => {
  return props.columns.filter(col => col.searchable)
})

const hasSearchBar = computed(() => {
  return searchFields.value.length > 0
})

const showActions = computed(() => {
  return props.deleteKey || !!slots.actions
})

const showPagination = computed(() => {
  if (props.paginationMinTotal === 0) {
    return (paginationData.value?.total ?? 0) > (paginationData.value?.page_size ?? 0)
  }
  return (paginationData.value?.total ?? 0) >= props.paginationMinTotal
})

const slots = defineSlots<{
  [key: string]: any
}>()

// Handle delete button click
const handleDeleteClick = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      props.deleteConfirmMessage,
      'Confirm Delete',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    emit('delete', row)
    if (props.deleteHandler) {
      await handleDelete(row, props.deleteHandler)
    }
  } catch (err: any) {
    if (err !== 'cancel') {
      console.error('Failed to delete record:', err)
      ElMessage.error(err?.message ?? 'Delete failed')
    }
  }
}

// Auto-init if enabled
if (props.autoInit) {
  init()
}
</script>

<style scoped>
.epx-pagination-table {
  width: 100%;
}

.epx-search-bar {
  margin-bottom: 12px;
}

.epx-pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
