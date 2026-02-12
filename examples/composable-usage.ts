/**
 * Composable Usage Example
 * Demonstrates using usePaginationTable hook for custom table implementations
 */

import { usePaginationTable } from '../src'
import type { UsePaginationTableOptions } from '../src'

// Example 1: Basic usage with custom API call
export function basicComposableExample() {
  const options: UsePaginationTableOptions = {
    dataLoader: async ({ page, page_size, ...params }) => {
      const response = await fetch(`/api/users?page=${page}&page_size=${page_size}`)
      const data = await response.json()

      // Transform if your API returns different format
      return {
        page: data.currentPage,
        page_size: data.pageSize,
        total: data.totalCount,
        data: data.items
      }
    }
  }

  const {
    paginationData,    // Ref<PaginationData>
    loading,           // Ref<boolean>
    searchForm,        // Reactive<Record<string, any>>
    loadData,          // () => Promise<void>
    handlePageChange,  // (page: number) => void
    handleSizeChange,  // (size: number) => void
    handleDelete,      // (item, handler) => Promise<void>
    handleReset        // () => void
  } = usePaginationTable(options)

  return {
    paginationData,
    loading,
    searchForm,
    loadData,
    handlePageChange,
    handleSizeChange,
    handleDelete,
    handleReset
  }
}

// Example 2: With custom delete handler
export function withDeleteHandler() {
  const {
    paginationData,
    loading,
    loadData,
    handleDelete
  } = usePaginationTable({
    dataLoader: async ({ page, page_size }) => {
      const res = await fetch(`/api/users?page=${page}&page_size=${page_size}`)
      return res.json()
    }
  })

  // Custom delete handler
  const deleteItem = async (item: any) => {
    await fetch(`/api/users/${item.id}`, { method: 'DELETE' })
    console.log('Item deleted:', item)
  }

  const onDelete = (item: any) => {
    handleDelete(item, deleteItem)
  }

  return { paginationData, loading, loadData, onDelete }
}

// Example 3: With search form
export function withSearchForm() {
  const {
    paginationData,
    loading,
    searchForm,
    loadData,
    handleReset
  } = usePaginationTable({
    dataLoader: async ({ page, page_size, name, status }) => {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(page_size)
      })
      if (name) params.append('name', name)
      if (status) params.append('status', status)

      const res = await fetch(`/api/users?${params}`)
      return res.json()
    }
  })

  // Initialize search fields
  searchForm.name = ''
  searchForm.status = ''

  return { paginationData, loading, searchForm, loadData, handleReset }
}

// Example 4: Vue component with composable
/*
<template>
  <div class="custom-table">
    <div class="search-bar">
      <input v-model="searchForm.name" placeholder="Search by name" />
      <button @click="loadData">Search</button>
      <button @click="handleReset">Reset</button>
    </div>

    <table v-if="!loading">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginationData.data" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>Loading...</div>

    <div class="pagination">
      <button
        @click="handlePageChange(paginationData.page - 1)"
        :disabled="paginationData.page === 1"
      >
        Previous
      </button>
      <span>Page {{ paginationData.page }}</span>
      <button
        @click="handlePageChange(paginationData.page + 1)"
        :disabled="paginationData.page * paginationData.page_size >= paginationData.total"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePaginationTable } from 'element-plus-x'

const { paginationData, loading, searchForm, loadData, handleReset, handlePageChange } =
  usePaginationTable({
    dataLoader: async ({ page, page_size, name }) => {
      const res = await fetch(`/api/users?page=${page}&page_size=${page_size}&name=${name || ''}`)
      return res.json()
    }
  })
</script>
*/
