<!--
  With Actions Example
  Demonstrates custom action buttons and delete functionality
-->
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { PaginationTable } from '../src'
import type { Column } from '../src'

const columns: Column[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name', searchable: true },
  { prop: 'email', label: 'Email' },
  { prop: 'role', label: 'Role' },
  { prop: 'actions', label: 'Actions', kind: 'slot', width: 200 }
]

let idCounter = 10
const mockUsers = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 2 === 0 ? 'Admin' : 'User'
  }))
)

const dataLoader = async ({ page, page_size, name }: any) => {
  await new Promise(resolve => setTimeout(resolve, 300))

  let filtered = [...mockUsers.value]

  if (name) {
    filtered = filtered.filter(u => u.name.toLowerCase().includes(name.toLowerCase()))
  }

  const total = filtered.length
  const start = (page - 1) * page_size
  const data = filtered.slice(start, start + page_size)

  return { page, page_size, total, data }
}

const handleDelete = async (user: any) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const index = mockUsers.value.findIndex(u => u.id === user.id)
  if (index > -1) {
    mockUsers.value.splice(index, 1)
    ElMessage.success(`Deleted user: ${user.name}`)
  }
}

const editUser = (user: any) => {
  ElMessage.info(`Editing user: ${user.name}`)
}

const viewUser = (user: any) => {
  ElMessage.info(`Viewing user: ${user.name}`)
}
</script>

<template>
  <div class="example-container">
    <h1>With Actions</h1>
    <p>Custom action buttons with slot and built-in delete functionality</p>

    <PaginationTable
      :columns="columns"
      :data-loader="dataLoader"
      :delete-handler="handleDelete"
      delete-key="id"
      delete-button-text="Delete"
      action-label="Actions"
    >
      <template #actions="{ row }">
        <el-button size="small" type="primary" @click="editUser(row)">Edit</el-button>
        <el-button size="small" @click="viewUser(row)">View</el-button>
      </template>
    </PaginationTable>
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
