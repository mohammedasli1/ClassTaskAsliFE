<template>
  <div class="dashboard-container">
    <div class="stats-grid">
      <!-- Total Employees -->
      <div class="stat-card">
        <div class="stat-icon purple-icon">
          <Icon icon="bx:group" width="28" height="28" />
        </div>
        <div class="stat-info">
          <span class="stat-title">Total Employees</span>
          <h3 class="stat-value">{{ latestEmployees.length }}</h3>
          <span class="stat-sub purple-sub">Active Employees</span>
        </div>
      </div>

      <!-- Total Monthly Salary -->
      <div class="stat-card">
        <div class="stat-icon green-icon">
          <Icon icon="bx:dollar-circle" width="28" height="28" />
        </div>
        <div class="stat-info">
          <span class="stat-title">Total Monthly Salary</span>
          <h3 class="stat-value">PKR {{ totalMonthlySalary.toLocaleString() }}</h3>
          <span class="stat-sub green-sub">This Month</span>
        </div>
      </div>

      <!-- Departments -->
      <div class="stat-card">
        <div class="stat-icon blue-icon">
          <Icon icon="bx:briefcase" width="28" height="28" />
        </div>
        <div class="stat-info">
          <span class="stat-title">Departments</span>
          <h3 class="stat-value">{{ uniqueDepartments }}</h3>
          <span class="stat-sub blue-sub">Total</span>
        </div>
      </div>

      <!-- New Employees -->
      <div class="stat-card">
        <div class="stat-icon orange-icon">
          <Icon icon="bx:user-plus" width="28" height="28" />
        </div>
        <div class="stat-info">
          <span class="stat-title">New Employees</span>
          <h3 class="stat-value">{{ latestEmployees.length }}</h3>
          <span class="stat-sub orange-sub">This Month</span>
        </div>
      </div>
    </div>

    <div class="recent-employees">
      <div class="section-header">
        <h3>Recent Employees</h3>
        <button class="btn-primary" @click="addEmployee">
          <Icon icon="bx:plus" width="20" height="20" />
          Add Employee
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Monthly Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in latestEmployees" :key="emp.id">
              <td>{{ emp.id }}</td>
              <td>{{ emp.name }}</td>
              <td>{{ emp.phone }}</td>
              <td>{{ emp.designation }}</td>
              <td>{{ emp.salary }}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon view" @click="viewEmployee(emp.id)">
                    <Icon icon="bx:show" width="18" height="18" />
                  </button>
                  <button class="btn-icon edit" @click="editEmployee(emp.id)">
                    <Icon icon="bx:edit-alt" width="18" height="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import EmployeeApi from '@/Api/Modules/employee';

const router = useRouter();

const latestEmployees = ref([]);

onMounted(async () => {
  try {
    const response = await EmployeeApi.getAll();
    if(response.data && response.data.data) {
      latestEmployees.value = response.data.data;
    }
  } catch (error) {
    console.error("Error loading employees:", error);
  }
});

const totalMonthlySalary = computed(() => {
  return latestEmployees.value.reduce((total, emp) => total + Number(emp.salary), 0);
});

const uniqueDepartments = computed(() => {
  const departments = new Set(latestEmployees.value.map(emp => emp.designation));
  return departments.size;
});

const addEmployee = () => {
  router.push({ name: 'AddEmployee' });
};

const editEmployee = (id) => {
  router.push({ name: 'UpdateEmployee', params: { id } });
};

const viewEmployee = (id) => {
  // same view for now
  router.push({ name: 'UpdateEmployee', params: { id } });
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    border: 1px solid #f1f5f9;

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .purple-icon {
      background: #f3e8ff;
      color: #6d28d9;
    }
    .green-icon {
      background: #dcfce7;
      color: #15803d;
    }
    .blue-icon {
      background: #e0f2fe;
      color: #0369a1;
    }
    .orange-icon {
      background: #ffedd5;
      color: #c2410c;
    }

    .stat-info {
      display: flex;
      flex-direction: column;

      .stat-title {
        font-size: 13px;
        color: #475569;
        font-weight: 500;
        margin-bottom: 4px;
      }
      .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 4px 0;
      }
      .stat-sub {
        font-size: 12px;
        font-weight: 600;
      }

      .purple-sub { color: #6d28d9; }
      .green-sub { color: #15803d; }
      .blue-sub { color: #0369a1; }
      .orange-sub { color: #c2410c; }
    }
  }
}

.recent-employees {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      color: #1e293b;
      font-weight: 700;
    }

    .btn-primary {
      background: #6d28d9;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover {
        background: #5b21b6;
      }
    }
  }
}

.table-container {
  overflow-x: auto;

  .data-table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: #6d28d9;
      
      th {
        color: white;
        text-align: left;
        padding: 14px 16px;
        font-weight: 500;
        font-size: 14px;
        
        &:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        &:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid #f1f5f9;
        transition: background 0.2s;

        &:hover {
          background: #f8fafc;
        }

        &:last-child {
          border-bottom: none;
        }

        td {
          padding: 16px;
          color: #334155;
          font-size: 14px;
        }
      }
    }

    .actions {
      display: flex;
      gap: 10px;

      .btn-icon {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.8;
        }

        &.view {
          background: #6d28d9;
        }

        &.edit {
          background: #22c55e;
        }
      }
    }
  }
}
</style>
