<!--
  Basic Usage Example
  Demonstrates the simplest way to use PaginationTable with local data fetching
-->
<script setup lang="ts">
import { ref } from 'vue'
import { PaginationTable } from '../src'

// Mock data for demonstration
const mockUsers = Array.from({ length: 105 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending'
}))

// Simulate API call
const dataLoader = async ({ page, page_size }: { page: number; page_size: number }) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const start = (page - 1) * page_size
  const end = start + page_size
  const data = mockUsers.slice(start, end)

  return {
    page,
    page_size,
    total: mockUsers.length,
    data
  }
}
</script>

<template>
  <div class="example-container">
    <h1>Basic Usage</h1>
    <p>Simple table with columns and pagination</p>

    <PaginationTable
      :columns="[
        { prop: 'id', label: 'ID', width: 80 },
        { prop: 'name', label: 'Name' },
        { prop: 'email', label: 'Email' },
        { prop: 'status', label: 'Status' }
      ]"
      :data-loader="dataLoader"
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
