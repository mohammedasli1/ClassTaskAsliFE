<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <Icon icon="bx:group" width="24" height="24" />
        </div>
        <div class="logo-text">
          <h2>EMS</h2>
          <p>Employee Management<br>System</p>
        </div>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link :to="{ name: 'EmployeeDashboard' }" class="nav-item">
            <Icon icon="bx:home-alt" class="nav-icon" />
            <span>Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'EmployeeList' }" class="nav-item">
            <Icon icon="bx:group" class="nav-icon" />
            <span>Employees</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'AddEmployee' }" class="nav-item">
            <Icon icon="bx:plus-circle" class="nav-icon" />
            <span>Add Employee</span>
          </router-link>
        </li>
        <li>
          <a href="#" class="nav-item">
            <Icon icon="bx:bar-chart-alt-2" class="nav-icon" />
            <span>Reports</span>
          </a>
        </li>
        <li>
          <a href="#" class="nav-item">
            <Icon icon="bx:cog" class="nav-icon" />
            <span>Settings</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <a href="#" class="nav-item logout">
        <Icon icon="bx:log-out" class="nav-icon" />
        <span>Logout</span>
      </a>
    </div>
    
    <!-- Abstract wave background -->
    <div class="sidebar-bg"></div>
  </aside>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>

<style lang="scss" scoped>
.sidebar {
  width: 250px;
  background-color: #551bf9;
  background: linear-gradient(180deg, #5c20d2 0%, #4010a3 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .sidebar-header {
    padding: 24px 20px;
    z-index: 2;

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .logo-icon {
        background: white;
        color: #5c20d2;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .logo-text {
        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          line-height: 1;
        }
        p {
          margin: 4px 0 0 0;
          font-size: 10px;
          opacity: 0.8;
          line-height: 1.2;
        }
      }
    }
  }

  .sidebar-nav {
    flex: 1;
    padding: 20px 0;
    z-index: 2;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 8px;
      }
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 24px;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      margin-right: 20px;
      border-radius: 0 30px 30px 0;

      .nav-icon {
        font-size: 20px;
        margin-right: 12px;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
      }

      &.router-link-active {
        background-color: #8c53fa; // match the highlight color
        color: white;
      }
    }
  }

  .sidebar-footer {
    padding: 24px 20px;
    z-index: 2;

    .logout {
      display: flex;
      align-items: center;
      color: white;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      opacity: 0.8;
      transition: opacity 0.3s ease;

      .nav-icon {
        font-size: 20px;
        margin-right: 12px;
      }

      &:hover {
        opacity: 1;
      }
    }
  }

  .sidebar-bg {
    position: absolute;
    bottom: -50px;
    left: -50px;
    right: -50px;
    height: 300px;
    background: radial-gradient(circle at top right, rgba(255,255,255,0.05) 0%, transparent 60%);
    border-radius: 50%;
    z-index: 1;
    pointer-events: none;
  }
}
</style>
