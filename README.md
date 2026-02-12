# Element Plus X

Extension components for [Element Plus](https://element-plus.org/).

[![Live Demo](https://img.shields.io/badge/Demo-GitHub_Pages-3f51b5?logo=github)](https://your-username.github.io/element-plus-x/)

## Live Demo

**Online Demo:** [View on GitHub Pages](https://your-username.github.io/element-plus-x/)

Or run locally:

```bash
cd demo
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Installation

```bash
npm install element-plus-x
```

```bash
yarn add element-plus-x
```

```bash
pnpm add element-plus-x
```

## Components

### PaginationTable

A powerful table component with built-in pagination, search functionality, and action handling.

#### Features

- **Pagination**: Built-in pagination with customizable page sizes
- **Search Bar**: Auto-generated search form from column definitions
- **Search Types**: Input, date picker, and select dropdown support
- **Actions**: Built-in delete button with confirmation dialog
- **Custom Slots**: Full slot support for custom cell rendering
- **Responsive**: Adjusts page size based on window height

#### Quick Start

```vue
<script setup lang="ts">
import { PaginationTable } from 'element-plus-x'
import type { Column } from 'element-plus-x'

const columns: Column[] = [
  { prop: 'name', label: 'Name', searchable: true },
  { prop: 'email', label: 'Email', searchable: true },
  { prop: 'status', label: 'Status', searchable: true, searchKind: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  },
  { prop: 'createdAt', label: 'Created', searchable: true, searchKind: 'date' },
  { prop: 'actions', label: 'Actions', kind: 'slot' }
]

const dataLoader = async ({ page, page_size, ...searchParams }) => {
  const response = await fetch('/api/users?' + new URLSearchParams({
    page,
    page_size,
    ...searchParams
  }))
  return response.json()
}

const handleDelete = async (user) => {
  await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
}
</script>

<template>
  <PaginationTable
    :columns="columns"
    :data-loader="dataLoader"
    :delete-handler="handleDelete"
    delete-key="id"
  >
    <template #actions="{ row }">
      <el-button size="small" @click="editUser(row)">Edit</el-button>
      <el-button size="small" type="primary" @click="viewUser(row)">View</el-button>
    </template>
  </PaginationTable>
</template>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column[]` | **required** | Table column definitions |
| `dataLoader` | `DataLoader` | **required** | Function to fetch paginated data |
| `deleteHandler` | `DeleteHandler` | - | Function to handle delete action |
| `deleteKey` | `string` | - | Property name for delete key (shows delete button if set) |
| `pageSizes` | `number[]` | `[10, 20, 50, 100]` | Available page sizes |
| `paginationLayout` | `string` | `"total, sizes, prev, pager, next, jumper"` | Pagination layout |
| `searchColSpan` | `number` | `4` | Span for search field columns |
| `buttonColSpan` | `number` | `4` | Span for button column |
| `searchButtonText` | `string` | `"Search"` | Text for search button |
| `resetButtonText` | `string` | `"Reset"` | Text for reset button |
| `deleteButtonText` | `string` | `"Delete"` | Text for delete button |
| `actionLabel` | `string` | `"Actions"` | Label for actions column |
| `actionWidth` | `number` | `120` | Width for actions column |
| `actionFixed` | `boolean \| 'left' \| 'right'` | `false` | Whether actions column is fixed |
| `paginationMinTotal` | `number` | `0` | Minimum total to show pagination |
| `autoInit` | `boolean` | `true` | Auto-initialize on mount |

#### Slots

| Name | Props | Description |
|------|-------|-------------|
| `button-tail` | - | Additional buttons in search bar |
| `actions` | `{ row }` | Custom action buttons for each row |
| `[column.prop]` | `{ row }` | Custom cell content (requires `kind: 'slot'`) |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `data-loaded` | `data[]` | Emitted when data is loaded |
| `delete` | `item` | Emitted before delete action |

#### Exposed Methods

| Method | Description |
|--------|-------------|
| `loadData()` | Reload data with current params |
| `refresh()` | Alias for loadData() |

### Column Type

```typescript
interface Column {
  label: string                                    // Column header
  prop: string                                     // Property name
  width?: number                                   // Column width
  kind?: 'slot'                                    // Use slot for content
  searchable?: boolean                             // Show in search bar
  searchKey?: string                               // Key for search (defaults to prop)
  searchKind?: 'input' | 'date' | 'select'        // Search field type
  options?: SelectOption[]                         // Options for select
  formatter?: (row, column, cellValue) => string  // Custom formatter
}
```

### usePaginationTable Composable

Use the underlying composable for more control over your table logic.

```typescript
import { usePaginationTable } from 'element-plus-x'

const {
  paginationData,    // Ref<PaginationData>
  loading,           // Ref<boolean>
  searchForm,        // Reactive<Record<string, any>>
  loadData,          // () => Promise<void>
  handlePageChange,  // (page: number) => void
  handleSizeChange,  // (size: number) => void
  handleDelete,      // (item, handler) => Promise<void>
  handleReset        // () => void
} = usePaginationTable({
  dataLoader: async ({ page, page_size, ...params }) => {
    const res = await api.get('/users', { params: { page, page_size, ...params } })
    return res.data
  }
})
```

## Global Registration

```typescript
import { createApp } from 'vue'
import { PaginationTablePlugin } from 'element-plus-x'
import ElementPlus from 'element-plus'

const app = createApp(App)
app.use(ElementPlus)
app.use(PaginationTablePlugin)
```

Then use it as `<epx-pagination-table />` in your templates.

## Data Format

The component expects data in this format:

```typescript
interface PaginationData<T = any> {
  page: number          // Current page number
  page_size: number    // Items per page
  total: number        // Total items
  data: T[]            // Array of items
}
```

If your API returns a different format, wrap it in the `dataLoader` function:

```typescript
const dataLoader = async (params) => {
  const response = await myApi.getUsers(params)
  return {
    page: response.currentPage,
    page_size: response.pageSize,
    total: response.totalCount,
    data: response.items
  }
}
```

## TypeScript

This library is written in TypeScript and includes full type definitions.

```typescript
import type {
  Column,
  PaginationData,
  DataLoader,
  DeleteHandler,
  PaginationTableConfig
} from 'element-plus-x'
```

## License

MIT
