<template>
  <div class="view-container">
    <div class="view-header">
      <h2>With Actions</h2>
      <p>Custom action buttons using slots, plus built-in delete functionality with confirmation dialog.</p>
    </div>

    <el-card class="demo-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Task Management</span>
          <el-space>
            <el-tag type="success">{{ tasks.length }} tasks</el-tag>
            <el-button type="primary" size="small" @click="addNewTask">
              <el-icon><Plus /></el-icon>
              Add Task
            </el-button>
          </el-space>
        </div>
      </template>

      <PaginationTable
        ref="tableRef"
        :columns="columns"
        :data-loader="dataLoader"
        :delete-handler="handleDelete"
        delete-key="id"
        delete-button-text="删除"
        action-label="操作"
        :page-sizes="[5, 10, 20]"
        @delete="onTaskDelete"
      >
        <template #priority="{ row }">
          <el-tag
            :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'"
            size="small"
          >
            {{ row.priority }}
          </el-tag>
        </template>

        <template #status="{ row }">
          <el-tag
            :type="row.status === 'completed' ? 'success' : row.status === 'in_progress' ? 'warning' : 'info'"
            size="small"
          >
            {{ statusLabels[row.status] }}
          </el-tag>
        </template>

        <template #actions="{ row }">
          <el-button size="small" type="primary" @click="editTask(row)">
            <el-icon><Edit /></el-icon>
            Edit
          </el-button>
          <el-button
            size="small"
            :type="row.status === 'completed' ? 'warning' : 'success'"
            @click="toggleStatus(row)"
          >
            <el-icon><Select /></el-icon>
            {{ row.status === 'completed' ? 'Reopen' : 'Complete' }}
          </el-button>
        </template>
      </PaginationTable>
    </el-card>

    <el-card class="stats-card" shadow="hover">
      <template #header>
        <span>Activity Log</span>
      </template>
      <div class="activity-log">
        <div v-for="(log, index) in activityLog" :key="index" class="log-item">
          <el-icon class="log-icon" :class="log.type">
            <component :is="log.icon" />
          </el-icon>
          <span class="log-text">{{ log.message }}</span>
          <span class="log-time">{{ log.time }}</span>
        </div>
        <el-empty v-if="activityLog.length === 0" description="No activity yet" :image-size="60" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { PaginationTable } from 'element-plus-x'
import type { Column } from 'element-plus-x'

const tableRef = ref()
const tasks = ref(
  Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: `Task ${i + 1}`,
    description: `Description for task ${i + 1}`,
    priority: ['high', 'medium', 'low'][i % 3],
    status: ['pending', 'in_progress', 'completed'][i % 3],
    assignee: `User ${i + 1}`,
    dueDate: new Date(Date.now() + i * 86400000).toISOString().split('T')[0]
  }))
)

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed'
}

const activityLog = ref<Array<{ type: string; icon: string; message: string; time: string }>>([])

const addLog = (type: string, icon: string, message: string) => {
  activityLog.value.unshift({
    type,
    icon,
    message,
    time: new Date().toLocaleTimeString()
  })
  if (activityLog.value.length > 10) {
    activityLog.value.pop()
  }
}

const columns: Column[] = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: 'Title', searchable: true },
  {
    prop: 'priority',
    label: 'Priority',
    width: 100,
    kind: 'slot'
  },
  {
    prop: 'status',
    label: 'Status',
    width: 120,
    kind: 'slot'
  },
  { prop: 'assignee', label: 'Assignee' },
  {
    prop: 'dueDate',
    label: 'Due Date',
    width: 120
  },
  { prop: 'actions', label: 'Actions', kind: 'slot', width: 220 }
]

const dataLoader = async ({ page, page_size, title }: any) => {
  await new Promise(resolve => setTimeout(resolve, 300))

  let filtered = [...tasks.value]
  if (title) {
    filtered = filtered.filter(t => t.title.toLowerCase().includes(title.toLowerCase()))
  }

  const total = filtered.length
  const start = (page - 1) * page_size
  const data = filtered.slice(start, start + page_size)

  return { page, page_size, total, data }
}

const handleDelete = async (task: any) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index > -1) {
    tasks.value.splice(index, 1)
    ElMessage.success(`Task "${task.title}" deleted`)
    addLog('success', 'CircleCheck', `Deleted task: ${task.title}`)
  }
}

const onTaskDelete = (task: any) => {
  console.log('Delete event emitted for:', task)
}

const editTask = (task: any) => {
  ElMessage.info(`Editing task: ${task.title}`)
  addLog('info', 'Edit', `Opened edit for: ${task.title}`)
}

const toggleStatus = (task: any) => {
  const newStatus = task.status === 'completed' ? 'pending' : 'completed'
  task.status = newStatus
  ElMessage.success(`Task "${task.title}" marked as ${newStatus}`)
  addLog('success', 'CircleCheck', `Completed task: ${task.title}`)
}

const addNewTask = () => {
  const newId = Math.max(...tasks.value.map(t => t.id)) + 1
  tasks.value.unshift({
    id: newId,
    title: `New Task ${newId}`,
    description: 'New task description',
    priority: 'medium',
    status: 'pending',
    assignee: 'Unassigned',
    dueDate: new Date().toISOString().split('T')[0]
  })
  tableRef.value?.loadData()
  ElMessage.success('New task added')
  addLog('success', 'Plus', 'Created new task')
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

.stats-card {
  margin-bottom: 20px;
}

.activity-log {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.log-item:last-child {
  border-bottom: none;
}

.log-icon {
  font-size: 18px;
}

.log-icon.success {
  color: #67c23a;
}

.log-icon.info {
  color: #909399;
}

.log-icon.warning {
  color: #e6a23c;
}

.log-text {
  flex: 1;
  color: #606266;
}

.log-time {
  font-size: 12px;
  color: #909399;
}
</style>
