<template>
  <header class="header">
    <div class="header-left">
      <button class="menu-btn">
        <Icon icon="bx:menu" width="24" height="24" />
      </button>
      <h1 class="page-title">{{ route.name === 'EmployeeDashboard' ? 'Dashboard' : route.name === 'AddEmployee' ? 'Add Employee' : route.name === 'UpdateEmployee' ? 'Update Employee' : 'Employees' }}</h1>
    </div>
    <div class="header-right">
      <div class="notification">
        <Icon icon="bx:bell" width="24" height="24" color="#64748b" />
        <span class="badge">3</span>
      </div>
      <div class="profile">
        <img src="https://i.pravatar.cc/150?img=11" alt="Admin" class="avatar" />
        <span class="name">Admin</span>
        <Icon icon="bx:chevron-down" width="20" height="20" color="#64748b" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style lang="scss" scoped>
.header {
  height: 70px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;

    .menu-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;

    .notification {
      position: relative;
      cursor: pointer;

      .badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #6366f1;
        color: white;
        font-size: 10px;
        font-weight: 700;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      }
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
      }

      .name {
        font-size: 14px;
        font-weight: 500;
        color: #1e293b;
      }
    }
  }
}
</style>
