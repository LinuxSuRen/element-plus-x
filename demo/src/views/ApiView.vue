<template>
  <div class="view-container">
    <div class="view-header">
      <h2>Real World API Example</h2>
      <p>Demonstrates integration with JSONPlaceholder - a free fake REST API. Features loading states, error handling, and custom cell rendering.</p>
    </div>

    <el-alert
      type="info"
      title="Using JSONPlaceholder API"
      description="This example fetches real data from jsonplaceholder.typicode.com. The API is free and requires no authentication."
      :closable="false"
      style="margin-bottom: 20px"
    />

    <el-card class="demo-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Users from API</span>
          <el-space>
            <el-tag type="success" v-if="!loading && totalUsers > 0">
              {{ totalUsers }} users loaded
            </el-tag>
            <el-button type="primary" size="small" @click="refreshData" :loading="loading">
              <el-icon><Refresh /></el-icon>
              Refresh
            </el-button>
          </el-space>
        </div>
      </template>

      <PaginationTable
        ref="tableRef"
        :columns="columns"
        :data-loader="dataLoader"
        :page-sizes="[5, 10, 15]"
        pagination-min-total="5"
        search-button-text="Search"
        reset-button-text="Reset"
        @data-loaded="onDataLoaded"
      >
        <template #button-tail>
          <el-button type="success" @click="exportData">
            <el-icon><Download /></el-icon>
            Export
          </el-button>
        </template>

        <template #website="{ row }">
          <el-link :href="row.website" target="_blank" type="primary">
            {{ row.website }}
          </el-link>
        </template>

        <template #company="{ row }">
          <div>
            <div>{{ row.company.name }}</div>
            <el-text size="small" type="info">{{ row.company.catchPhrase }}</el-text>
          </div>
        </template>
      </PaginationTable>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <el-icon><InfoFilled /></el-icon>
            <span style="margin-left: 8px">API Details</span>
          </template>
          <div class="api-details">
            <div class="detail-item">
              <span class="detail-label">Endpoint:</span>
              <el-text size="small" tag="code">/users</el-text>
            </div>
            <div class="detail-item">
              <span class="detail-label">Method:</span>
              <el-tag size="small" type="success">GET</el-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">Base URL:</span>
              <el-text size="small">jsonplaceholder.typicode.com</el-text>
            </div>
            <div class="detail-item">
              <span class="detail-label">Response Format:</span>
              <el-text size="small">Array of user objects</el-text>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <el-icon><Star /></el-icon>
            <span style="margin-left: 8px">Features</span>
          </template>
          <ul class="feature-list">
            <li>Real API integration with fetch</li>
            <li>Loading state during API calls</li>
            <li>Client-side pagination filtering</li>
            <li>Custom cell rendering (website link)</li>
            <li>Nested data display (company info)</li>
            <li>Custom button in toolbar (Export)</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { PaginationTable } from 'element-plus-x'
import type { Column, PaginationData } from 'element-plus-x'

interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
  address: {
    city: string
    street: string
  }
}

const tableRef = ref()
const loading = ref(false)
const totalUsers = ref(0)
const allUsers = ref<User[]>([])

const columns: Column[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: 'Name', searchable: true },
  { prop: 'username', label: 'Username', searchable: true },
  { prop: 'email', label: 'Email', searchable: true },
  { prop: 'phone', label: 'Phone' },
  { prop: 'website', label: 'Website', kind: 'slot' },
  { prop: 'company', label: 'Company', kind: 'slot' }
]

// Fetch all users from API
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) throw new Error('Failed to fetch users')
    const data = await response.json()
    allUsers.value = data
    totalUsers.value = data.length
    return data
  } catch (error) {
    console.error('Error fetching users:', error)
    ElMessage.error('Failed to load users from API')
    return []
  } finally {
    loading.value = false
  }
}

// Data loader for the table
const dataLoader = async ({ page, page_size, name, username, email }: any) => {
  // Fetch users if not already loaded
  if (allUsers.value.length === 0) {
    await fetchUsers()
  }

  let filtered = [...allUsers.value]

  // Apply filters
  if (name) {
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(name.toLowerCase())
    )
  }
  if (username) {
    filtered = filtered.filter(u =>
      u.username.toLowerCase().includes(username.toLowerCase())
    )
  }
  if (email) {
    filtered = filtered.filter(u =>
      u.email.toLowerCase().includes(email.toLowerCase())
    )
  }

  const total = filtered.length
  const start = (page - 1) * page_size
  const data = filtered.slice(start, start + page_size)

  return { page, page_size, total, data }
}

const onDataLoaded = (data: User[]) => {
  console.log('Data loaded:', data.length, 'items')
}

const refreshData = async () => {
  allUsers.value = []
  await tableRef.value?.loadData()
  ElMessage.success('Data refreshed')
}

const exportData = () => {
  const dataStr = JSON.stringify(allUsers.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'users.json'
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('Data exported')
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
  line-height: 1.6;
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
  height: 100%;
}

.api-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-label {
  min-width: 100px;
  font-weight: 500;
  color: #606266;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 6px 0;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-list li::before {
  content: '✓';
  color: #67c23a;
  font-weight: bold;
}
</style>
