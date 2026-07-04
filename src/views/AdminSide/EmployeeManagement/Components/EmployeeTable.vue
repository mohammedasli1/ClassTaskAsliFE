<template>
  <div class="employees-container">
    <div class="recent-employees">

      <!-- Header: title + search + add button -->
      <div class="section-header">
        <h3>All Employees</h3>

        <!-- Search by Phone -->
        <div class="search-wrapper">
          <Icon icon="bx:phone" class="search-icon" />
          <v-text-field
            id="search-phone"
            v-model="searchPhone"
            placeholder="Search by phone…"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            class="search-vfield"
            @update:model-value="onSearch"
            @click:clear="clearSearch"
          />
        </div>

        <v-btn class="btn-primary" @click="addEmployee">
          <Icon icon="bx:plus" width="20" height="20" />
          Add Employee
        </v-btn>
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
                  <v-btn
                    class="btn-icon edit"
                    size="small"
                    icon
                    @click="editEmployee(emp.id)"
                    title="Edit"
                  >
                    <Icon icon="bx:edit-alt" width="17" height="17" />
                  </v-btn>
                  <v-btn
                    class="btn-icon delete"
                    size="small"
                    icon
                    @click="confirmDelete(emp.id)"
                    title="Delete"
                  >
                    <Icon icon="bx:trash" width="17" height="17" />
                  </v-btn>
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
      display: flex;
      align-items: center;

      .search-icon {
        position: absolute;
        left: 10px;
        color: #94a3b8;
        font-size: 18px;
        z-index: 2;
        pointer-events: none;
      }

      .search-vfield {
        width: 100%;

        :deep(.v-field) {
          border-radius: 8px !important;
          font-family: 'Inter', sans-serif;

          .v-field__input {
            padding-left: 34px !important;
            font-size: 13px !important;
            color: #334155 !important;
            min-height: 0 !important;
          }

          .v-field__outline__start,
          .v-field__outline__notch,
          .v-field__outline__end {
            border-color: #e2e8f0 !important;
          }

          &.v-field--focused {
            .v-field__outline__start,
            .v-field__outline__notch,
            .v-field__outline__end {
              border-color: #6d28d9 !important;
              border-width: 2px !important;
            }
            box-shadow: 0 0 0 3px rgba(109,40,217,0.1);
          }
        }

        :deep(input::placeholder) { color: #94a3b8 !important; font-size: 13px; }
      }
    }

    .btn-primary {
      background: #6d28d9 !important;
      color: white !important;
      border-radius: 6px !important;
      font-weight: 500 !important;
      font-family: 'Inter', sans-serif !important;
      text-transform: none !important;
      letter-spacing: 0 !important;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px !important;
      &:hover { background: #5b21b6 !important; }
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
        width: 30px !important;
        height: 30px !important;
        border-radius: 6px !important;
        border: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        transition: opacity 0.2s;
        min-width: 0 !important;
        &:hover { opacity: 0.8; }
        &.edit   { background: #6d28d9 !important; }
        &.delete { background: #ef4444 !important; }
      }
    }
  }
}
</style>
