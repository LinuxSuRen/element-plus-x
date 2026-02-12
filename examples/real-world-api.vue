<!--
  Real World API Example
  Demonstrates integration with a real REST API using axios
-->
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { PaginationTable } from '../src'
import type { Column, PaginationData } from '../src'

// Types for your API response
interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  created_at: string
}

interface ApiResponse {
  data: User[]
  current_page: number
  per_page: number
  total: number
}

// API instance (configure with your base URL)
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000
})

// Add auth token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const columns: Column[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name', searchable: true },
  { prop: 'email', label: 'Email', searchable: true },
  {
    prop: 'role',
    label: 'Role',
    searchable: true,
    searchKind: 'select',
    options: [
      { label: 'All Roles', value: '' },
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' }
    ]
  },
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
    prop: 'created_at',
    label: 'Created At',
    searchable: true,
    searchKind: 'date',
    formatter: (_row, _column, cellValue) => {
      return new Date(cellValue).toLocaleDateString()
    }
  },
  { prop: 'actions', label: 'Actions', kind: 'slot', width: 200 }
]

// Data loader that transforms API response to PaginationData format
const dataLoader = async ({ page, page_size, name, email, role, status, created_at }: any) => {
  try {
    const params: Record<string, any> = {
      page,
      per_page: page_size
    }

    if (name) params.name = name
    if (email) params.email = email
    if (role) params.role = role
    if (status) params.status = status
    if (created_at) params.created_at = created_at

    const { data } = await api.get<ApiResponse>('/users', { params })

    // Transform API response to PaginationData format
    return {
      page: data.current_page,
      page_size: data.per_page,
      total: data.total,
      data: data.data
    }
  } catch (error) {
    console.error('Failed to load users:', error)
    // Return empty data on error
    return {
      page,
      page_size,
      total: 0,
      data: []
    }
  }
}

// Delete handler
const handleDelete = async (user: User) => {
  await api.delete(`/users/${user.id}`)
  // Table will automatically reload after successful delete
}

// Custom action handlers
const editUser = (user: User) => {
  console.log('Edit user:', user)
  // Navigate to edit page or open modal
}

const viewUser = (user: User) => {
  console.log('View user:', user)
  // Navigate to detail page or open modal
}

const changeStatus = async (user: User) => {
  await api.patch(`/users/${user.id}/status`, {
    status: user.status === 'active' ? 'inactive' : 'active'
  })
}

// Expose refresh method
const tableRef = ref()

const refreshTable = () => {
  tableRef.value?.loadData()
}
</script>

<template>
  <div class="example-container">
    <div class="header">
      <h1>User Management</h1>
      <el-button type="primary" @click="$router.push('/users/new')">
        Add User
      </el-button>
      <el-button @click="refreshTable">Refresh</el-button>
    </div>

    <PaginationTable
      ref="tableRef"
      :columns="columns"
      :data-loader="dataLoader"
      :delete-handler="handleDelete"
      delete-key="id"
      action-width="250"
      @data-loaded="(data) => console.log('Loaded', data.length, 'items')"
      @delete="(user) => console.log('Deleting', user)"
    >
      <!-- Additional buttons in search bar -->
      <template #button-tail>
        <el-button type="success" @click="exportUsers">Export</el-button>
      </template>

      <!-- Custom actions for each row -->
      <template #actions="{ row }">
        <el-button size="small" type="primary" @click="editUser(row)">
          Edit
        </el-button>
        <el-button size="small" @click="viewUser(row)">
          View
        </el-button>
        <el-button
          size="small"
          :type="row.status === 'active' ? 'warning' : 'success'"
          @click="changeStatus(row)"
        >
          {{ row.status === 'active' ? 'Disable' : 'Enable' }}
        </el-button>
      </template>

      <!-- Custom cell rendering with badge -->
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : row.status === 'pending' ? 'warning' : 'info'">
          {{ row.status }}
        </el-tag>
      </template>
    </PaginationTable>
  </div>
</template>

<style scoped>
.example-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
}
</style>
