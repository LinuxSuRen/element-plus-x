<template>
  <div class="view-container">
    <div class="view-header">
      <h2>Basic Usage</h2>
      <p>Simple table with columns and pagination. No search, no actions - just data display.</p>
    </div>

    <el-card class="demo-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>User List</span>
          <el-tag type="info">105 total records</el-tag>
        </div>
      </template>

      <PaginationTable
        :columns="columns"
        :data-loader="dataLoader"
      />
    </el-card>

    <el-card class="code-card" shadow="hover">
      <template #header>
        <span>Source Code</span>
      </template>
      <pre class="code-block"><code>&lt;PaginationTable
  :columns="[
    { prop: 'id', label: 'ID', width: 80 },
    { prop: 'name', label: 'Name' },
    { prop: 'email', label: 'Email' },
    { prop: 'status', label: 'Status' }
  ]
  :data-loader="dataLoader"
/&gt;</code></pre>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PaginationTable } from 'element-plus-x'/PaginationTable.vue'
import type { Column } from 'element-plus-x'/PaginationTable.vue'

const columns: Column[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name' },
  { prop: 'email', label: 'Email' },
  { prop: 'status', label: 'Status' }
]

const mockUsers = Array.from({ length: 105 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Inactive' : 'Pending'
}))

const dataLoader = async ({ page, page_size }: { page: number; page_size: number }) => {
  await new Promise(resolve => setTimeout(resolve, 300))

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

<style scoped>
.view-container {
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 8px;
}

.view-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
}

.view-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.demo-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-card {
  margin-bottom: 20px;
}

.code-block {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
}

.code-block code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #476582;
}
</style>
