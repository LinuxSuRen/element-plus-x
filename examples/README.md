# Examples

This directory contains usage examples for the `element-plus-x` library.

## Examples List

### 1. Basic Usage (`basic-usage.vue`)
Demonstrates the simplest way to use PaginationTable with local data fetching.

**Features shown:**
- Basic column definition
- Pagination with configurable page sizes
- Loading state

### 2. With Search (`with-search.vue`)
Shows how to add search functionality with different input types.

**Features shown:**
- Text input search
- Select dropdown for predefined options
- Date picker for date range filtering
- Reset button functionality

### 3. With Actions (`with-actions.vue`)
Demonstrates custom action buttons and built-in delete functionality.

**Features shown:**
- Custom action buttons using slots
- Built-in delete button with confirmation
- Custom action column

### 4. Composable Usage (`composable-usage.ts`)
Examples of using the `usePaginationTable` hook directly for custom implementations.

**Features shown:**
- Direct hook usage
- Custom delete handler
- Search form management
- Full custom table implementation example

### 5. Real World API (`real-world-api.vue`)
Shows integration with a real REST API using axios.

**Features shown:**
- Axios integration with auth headers
- API response transformation
- Custom cell rendering with el-tag
- Multiple action buttons
- Export button in search bar
- Event handling

## Running the Examples

### Option 1: Create a demo project

```bash
# Create a new Vue project
npm create vite@latest my-demo -- --template vue-ts

cd my-demo
npm install

# Install dependencies
npm install element-plus element-plus-x

# Copy example files to src/
# Then update your main.ts and App.vue accordingly
```

### Option 2: Use in existing project

1. Ensure you have Element Plus installed:
```bash
npm install element-plus
```

2. Install the library (after building):
```bash
cd E:\ws\element-plus-x
npm install
npm run build

# In your project
npm install ../element-plus-x
```

3. Import and use in your component:
```vue
<script setup lang="ts">
import { PaginationTable } from 'element-plus-x'
import 'element-plus/dist/index.css'
</script>

<template>
  <PaginationTable
    :columns="columns"
    :data-loader="dataLoader"
  />
</template>
```

## Quick Template

Here's a quick template for creating your own example:

```vue
<script setup lang="ts">
import { PaginationTable } from '../src'
import type { Column } from '../src'

const columns: Column[] = [
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: 'Name', searchable: true }
]

const dataLoader = async ({ page, page_size }) => {
  const res = await fetch(`/api/data?page=${page}&page_size=${page_size}`)
  return res.json()
}
</script>

<template>
  <PaginationTable :columns="columns" :data-loader="dataLoader" />
</template>
```
