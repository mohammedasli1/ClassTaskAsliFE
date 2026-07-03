<template>
  <div class="admin-layout">
    <AppSidebar />
    <div class="main-content">
      <HorizantalBar />
      <div class="page-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/common/AppSidebar.vue';
import HorizantalBar from '@/components/common/HorizantalBar.vue';
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f7f8fc;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
