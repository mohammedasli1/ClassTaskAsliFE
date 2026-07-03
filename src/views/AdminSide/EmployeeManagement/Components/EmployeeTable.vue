<template>
  <div class="employees-container">
    <div class="recent-employees">

      <!-- Header: title + search + add button -->
      <div class="section-header">
        <h3>All Employees</h3>

        <!-- Search by Phone -->
        <div class="search-wrapper">
          <Icon icon="bx:phone" class="search-icon" />
          <input
            id="search-phone"
            v-model="searchPhone"
            type="text"
            placeholder="Search by phone…"
            @input="onSearch"
          />
          <button v-if="searchPhone" class="clear-search" @click="clearSearch">
            <Icon icon="bx:x" />
          </button>
        </div>

        <button class="btn-primary" @click="addEmployee">
          <Icon icon="bx:plus" width="20" height="20" />
          Add Employee
        </button>
      </div>

      <!-- Loading / empty states -->
      <div v-if="loading" class="state-msg">Loading employees…</div>
      <div v-else-if="employees.length === 0" class="state-msg">No employees found.</div>

      <!-- Employees table -->
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Salary Pkg</th>
              <th>Monthly Tax</th>
              <th>Yearly Bonus</th>
              <th>Monthly Net</th>
              <th>Yearly Net</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(emp, index) in employees" :key="emp.id">
              <td>{{ index + 1 }}</td>
              <td>{{ emp.name }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.phone }}</td>
              <td>{{ emp.designation }}</td>
              <td>{{ formatPKR(emp.salary) }}</td>
              <td>{{ formatPKR(emp.monthly_tax_value) }}</td>
              <td>{{ formatPKR(emp.yearly_increasing_bonus) }}</td>
              <td>{{ formatPKR(emp.monthly_net_salary) }}</td>
              <td>{{ formatPKR(emp.yearly_net_salary) }}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon edit" @click="editEmployee(emp.id)" title="Edit">
                    <Icon icon="bx:edit-alt" width="17" height="17" />
                  </button>
                  <button class="btn-icon delete" @click="confirmDelete(emp.id)" title="Delete">
                    <Icon icon="bx:trash" width="17" height="17" />
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import EmployeeApi from '@/Api/Modules/employee';

const router      = useRouter();
const employees   = ref([]);
const loading     = ref(true);
const searchPhone = ref('');
let   searchTimer = null;

// ── Helpers ──────────────────────────────────────────────────────────

/** Format a number as PKR e.g. PKR 250,000 */
const formatPKR = (value) =>
  'PKR ' + Number(value || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 });

// ── Data fetching ────────────────────────────────────────────────────

const loadEmployees = async (phone = '') => {
  loading.value = true;
  try {
    const response = await EmployeeApi.getAll(phone);
    employees.value = response.data?.data ?? [];
  } catch (error) {
    console.error('Error loading employees:', error);
    employees.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadEmployees());

// ── Search by phone (debounced) ──────────────────────────────────────

const onSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadEmployees(searchPhone.value), 400);
};

const clearSearch = () => {
  searchPhone.value = '';
  loadEmployees();
};

// ── Navigation / actions ─────────────────────────────────────────────

const addEmployee  = () => router.push({ name: 'AddEmployee' });
const editEmployee = (id) => router.push({ name: 'UpdateEmployee', params: { id } });

const confirmDelete = async (id) => {
  if (!confirm('Delete this employee? This cannot be undone.')) return;
  try {
    await EmployeeApi.delete(id);
    await loadEmployees(searchPhone.value); // refresh list
  } catch (error) {
    alert('Failed to delete employee.');
    console.error('Error deleting employee:', error);
  }
};
</script>

<style lang="scss" scoped>
.employees-container { display: flex; flex-direction: column; }

.recent-employees {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  border: 1px solid #f1f5f9;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      color: #1e293b;
      font-weight: 700;
      white-space: nowrap;
    }

    /* Search */
    .search-wrapper {
      position: relative;
      flex: 1;
      max-width: 280px;

      .search-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 18px;
      }

      input {
        width: 100%;
        padding: 9px 36px 9px 34px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 13px;
        font-family: 'Inter', sans-serif;
        color: #334155;

        &:focus {
          outline: none;
          border-color: #6d28d9;
          box-shadow: 0 0 0 3px rgba(109,40,217,0.1);
        }
        &::placeholder { color: #94a3b8; }
      }

      .clear-search {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: #94a3b8;
        font-size: 18px;
        display: flex;
        align-items: center;
        &:hover { color: #ef4444; }
      }
    }

    .btn-primary {
      background: #6d28d9;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 16px;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
      &:hover { background: #5b21b6; }
    }
  }
}

.state-msg {
  text-align: center;
  padding: 32px;
  color: #94a3b8;
  font-size: 14px;
}

.table-container {
  overflow-x: auto;

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    thead {
      background: #6d28d9;
      th {
        color: white;
        text-align: left;
        padding: 12px 14px;
        font-weight: 500;
        white-space: nowrap;
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid #f1f5f9;
        transition: background 0.15s;
        &:hover { background: #f8fafc; }
        &:last-child { border-bottom: none; }
        td {
          padding: 13px 14px;
          color: #334155;
          white-space: nowrap;
        }
      }
    }

    .actions {
      display: flex;
      gap: 8px;

      .btn-icon {
        width: 30px;
        height: 30px;
        border-radius: 6px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        transition: opacity 0.2s;
        &:hover { opacity: 0.8; }
        &.edit   { background: #6d28d9; }
        &.delete { background: #ef4444; }
      }
    }
  }
}
</style>
