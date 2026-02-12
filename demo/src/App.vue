<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <h1>
          <el-icon><Grid /></el-icon>
          Element Plus X
        </h1>
        <p>PaginationTable Component Demo</p>
      </div>
      <el-tag type="success">v0.1.0</el-tag>
    </el-header>

    <el-container>
      <el-aside width="200px" class="app-aside">
        <el-menu
          :default-active="activeRoute"
          router
          class="demo-menu"
        >
          <el-menu-item index="/basic">
            <el-icon><Document /></el-icon>
            <span>Basic Usage</span>
          </el-menu-item>
          <el-menu-item index="/search">
            <el-icon><Search /></el-icon>
            <span>With Search</span>
          </el-menu-item>
          <el-menu-item index="/actions">
            <el-icon><Operation /></el-icon>
            <span>With Actions</span>
          </el-menu-item>
          <el-menu-item index="/api">
            <el-icon><Connection /></el-icon>
            <span>Real World API</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeRoute = computed(() => route.path)
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-content p {
  margin: 5px 0 0 0;
  opacity: 0.9;
  font-size: 14px;
}

.app-aside {
  background: white;
  border-right: 1px solid #e4e7ed;
}

.demo-menu {
  border-right: none;
  height: calc(100vh - 80px);
}

.app-main {
  padding: 30px;
  background: #f5f7fa;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>
