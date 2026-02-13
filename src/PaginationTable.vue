<template>
  <div class="epx-pagination-table">
    <!-- Search Bar -->
    <div v-if="hasSearchBar" class="epx-search-bar">
      <el-row :gutter="10">
        <el-col
          v-for="field in searchFields"
          :key="field.prop"
          :span="computedColSpan"
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
            style="width: 100%"
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
        <el-col :span="buttonColSpan ?? computedColSpan" class="epx-button-col">
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
import { computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type {
  Column,
  DataLoader,
  DeleteHandler
} from './types'
import { usePaginationTable } from './usePaginationTable'

export interface PaginationTableProps {
  columns: Column[]
  dataLoader: DataLoader
  deleteHandler?: DeleteHandler
  deleteKey?: string
  pageSizes?: number[]
  paginationLayout?: string
  paginationProps?: Record<string, any>
  searchColSpan?: number
  buttonColSpan?: number
  searchButtonText?: string
  resetButtonText?: string
  deleteButtonText?: string
  actionLabel?: string
  actionWidth?: number
  actionFixed?: boolean | 'left' | 'right'
  paginationMinTotal?: number
  autoInit?: boolean
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

const computedColSpan = computed(() => {
  const fieldCount = searchFields.value.length
  if (fieldCount <= 3) return 6
  if (fieldCount <= 6) return 4
  return 3
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

// Define options for component name
defineOptions({
  name: 'EpxPaginationTable'
})
</script>

<style scoped>
.epx-pagination-table {
  width: 100%;
}

.epx-search-bar {
  margin-bottom: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.epx-button-col {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}

.epx-button-col :deep(.el-button) {
  margin-bottom: 8px;
}

.epx-pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
