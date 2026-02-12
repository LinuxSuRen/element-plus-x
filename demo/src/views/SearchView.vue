<template>
  <div class="view-container">
    <div class="view-header">
      <h2>With Search</h2>
      <p>Auto-generated search bar with different input types: text input, select dropdown, and date picker.</p>
    </div>

    <el-card class="demo-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Product List</span>
          <el-tag type="info">Search enabled columns</el-tag>
        </div>
      </template>

      <PaginationTable
        :columns="columns"
        :data-loader="dataLoader"
        search-button-text="搜索"
        reset-button-text="重置"
      />
    </el-card>

    <el-card class="info-card" shadow="hover">
      <template #header>
        <el-icon><InfoFilled /></el-icon>
        <span style="margin-left: 8px">Features</span>
      </template>
      <ul class="feature-list">
        <li><el-tag size="small" type="primary">Input</el-tag> Text search for Name and SKU</li>
        <li><el-tag size="small" type="success">Select</el-tag> Dropdown filter for Category and Status</li>
        <li><el-tag size="small" type="warning">Date</el-tag> Date picker for Created At</li>
        <li>Press Enter in text fields to trigger search</li>
        <li>Clear button on each field</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { PaginationTable } from 'element-plus-x'/PaginationTable.vue'/'
import type { Column } from 'element-plus-x'/PaginationTable.vue'/'

const columns: Column[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name', searchable: true },
  { prop: 'sku', label: 'SKU', searchable: true },
  {
    prop: 'category',
    label: 'Category',
    searchable: true,
    searchKind: 'select',
    options: [
      { label: 'All Categories', value: '' },
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Food', value: 'food' },
      { label: 'Books', value: 'books' }
    ]
  },
  {
    prop: 'status',
    label: 'Status',
    searchable: true,
    searchKind: 'select',
    options: [
      { label: 'All Status', value: '' },
      { label: 'In Stock', value: 'in_stock' },
      { label: 'Low Stock', value: 'low_stock' },
      { label: 'Out of Stock', value: 'out_of_stock' }
    ]
  },
  {
    prop: 'price',
    label: 'Price',
    formatter: (_row, _column, cellValue) => `$${Number(cellValue).toFixed(2)}`
  },
  {
    prop: 'createdAt',
    label: 'Created At',
    searchable: true,
    searchKind: 'date',
    formatter: (_row, _column, cellValue) => new Date(cellValue).toLocaleDateString()
  }
]

const mockProducts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  sku: `SKU-${String(i + 1).padStart(4, '0')}`,
  category: ['electronics', 'clothing', 'food', 'books'][i % 4],
  status: ['in_stock', 'low_stock', 'out_of_stock'][i % 3],
  price: Math.random() * 100 + 10,
  createdAt: new Date(Date.now() - i * 86400000).toISOString()
}))

const dataLoader = async ({ page, page_size, name, sku, category, status, createdAt }: any) => {
  await new Promise(resolve => setTimeout(resolve, 300))

  let filtered = [...mockProducts]

  if (name) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (sku) {
    filtered = filtered.filter(p => p.sku.toLowerCase().includes(sku.toLowerCase()))
  }
  if (category) {
    filtered = filtered.filter(p => p.category === category)
  }
  if (status) {
    filtered = filtered.filter(p => p.status === status)
  }
  if (createdAt) {
    const targetDate = new Date(createdAt)
    filtered = filtered.filter(p => {
      const pDate = new Date(p.createdAt)
      return pDate.toDateString() === targetDate.toDateString()
    })
  }

  const total = filtered.length
  const start = (page - 1) * page_size
  const data = filtered.slice(start, start + page_size)

  return { page, page_size, total, data }
}
</script>

<style scoped>
.view-container {
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 20px;
}

.view-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
}

.view-header p {
  margin: 0;
  color: #909399;
}

.demo-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-card {
  margin-bottom: 20px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #606266;
}

.feature-list li:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}
</style>
