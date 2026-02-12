<!--
  With Search Example
  Demonstrates search functionality with different input types
-->
<script setup lang="ts">
import { PaginationTable } from '../src'
import type { Column } from '../src'

const columns: Column[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name', searchable: true },
  { prop: 'email', label: 'Email', searchable: true },
  {
    prop: 'status',
    label: 'Status',
    searchable: true,
    searchKind: 'select',
    options: [
      { label: 'All Status', value: '' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' }
    ]
  },
  {
    prop: 'createdAt',
    label: 'Created At',
    searchable: true,
    searchKind: 'date',
    width: 180
  }
]

const mockUsers = Array.from({ length: 105 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending',
  createdAt: new Date(Date.now() - i * 86400000).toISOString()
}))

const dataLoader = async ({ page, page_size, name, email, status, createdAt }: any) => {
  await new Promise(resolve => setTimeout(resolve, 300))

  let filtered = [...mockUsers]

  // Apply filters
  if (name) {
    filtered = filtered.filter(u => u.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (email) {
    filtered = filtered.filter(u => u.email.toLowerCase().includes(email.toLowerCase()))
  }
  if (status) {
    filtered = filtered.filter(u => u.status === status)
  }
  if (createdAt) {
    const targetDate = new Date(createdAt)
    filtered = filtered.filter(u => {
      const userDate = new Date(u.createdAt)
      return userDate.toDateString() === targetDate.toDateString()
    })
  }

  const total = filtered.length
  const start = (page - 1) * page_size
  const data = filtered.slice(start, start + page_size)

  return { page, page_size, total, data }
}
</script>

<template>
  <div class="example-container">
    <h1>With Search</h1>
    <p>Search bar with input, select dropdown, and date picker</p>

    <PaginationTable
      :columns="columns"
      :data-loader="dataLoader"
      search-button-text="Search"
      reset-button-text="Reset"
    />
  </div>
</template>

<style scoped>
.example-container {
  padding: 20px;
}
h1 {
  margin-bottom: 8px;
}
p {
  color: #666;
  margin-bottom: 20px;
}
</style>
