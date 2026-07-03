<template>
  <div class="add-employee-container">
    <div class="form-card">
      <!-- Section Header -->
      <div class="form-header">
        <Icon icon="bx:user" class="header-icon" />
        <h2>Employee Information</h2>
      </div>

      <div v-if="loading" class="loading-state">Loading employee data…</div>

      <form v-else @submit.prevent="updateEmployee" class="employee-form">
        <div class="form-grid">

          <!-- Full Name (read-only) -->
          <div class="form-group">
            <label>Full Name</label>
            <div class="input-wrapper">
              <span class="input-icon purple"><Icon icon="bx:user" /></span>
              <input type="text" :value="form.name" readonly class="readonly-input" />
            </div>
          </div>

          <!-- Email (read-only) -->
          <div class="form-group">
            <label>Email</label>
            <div class="input-wrapper">
              <span class="input-icon purple"><Icon icon="bx:envelope" /></span>
              <input type="email" :value="form.email" readonly class="readonly-input" />
            </div>
          </div>

          <!-- Phone Number (EDITABLE) -->
          <div class="form-group">
            <label>Phone Number <span class="required">*</span></label>
            <div class="input-wrapper">
              <span class="input-icon purple"><Icon icon="bx:phone" /></span>
              <input id="edit-phone" type="text" v-model="form.phone"
                     placeholder="Enter phone number" required />
            </div>
          </div>

          <!-- Designation (read-only) -->
          <div class="form-group">
            <label>Designation</label>
            <div class="input-wrapper">
              <span class="input-icon purple"><Icon icon="bx:briefcase" /></span>
              <input type="text" :value="form.designation" readonly class="readonly-input" />
            </div>
          </div>

          <!-- Monthly Salary Package (EDITABLE) -->
          <div class="form-group">
            <label>Monthly Salary Package <span class="required">*</span></label>
            <div class="input-wrapper">
              <span class="input-icon green"><Icon icon="bx:dollar" /></span>
              <input id="edit-salary" type="number" v-model.number="form.salary"
                     placeholder="Enter monthly salary" required min="0" />
            </div>
          </div>

          <!-- Monthly Tax (live preview) -->
          <div class="form-group">
            <label>Monthly Tax Value</label>
            <div class="input-wrapper">
              <span class="input-icon red"><Icon icon="bx:pie-chart-alt" /></span>
              <input type="number" :value="monthlyTax" readonly class="readonly-input" />
            </div>
          </div>

          <!-- Yearly Increasing Bonus (live preview) -->
          <div class="form-group">
            <label>Yearly Increasing Bonus</label>
            <div class="input-wrapper">
              <span class="input-icon yellow"><Icon icon="bx:gift" /></span>
              <input type="number" :value="yearlyBonus" readonly class="readonly-input" />
            </div>
          </div>

          <!-- Monthly Net Salary (live preview) -->
          <div class="form-group">
            <label>Monthly Net Salary</label>
            <div class="input-wrapper">
              <span class="input-icon blue"><Icon icon="bx:wallet" /></span>
              <input type="number" :value="monthlyNetSalary" readonly class="readonly-input" />
            </div>
          </div>

          <!-- Yearly Net Salary (live preview) -->
          <div class="form-group">
            <label>Yearly Net Salary</label>
            <div class="input-wrapper">
              <span class="input-icon blue"><Icon icon="bx:calendar-check" /></span>
              <input type="number" :value="yearlyNetSalary" readonly class="readonly-input" />
            </div>
          </div>

        </div>

        <!-- Error banner -->
        <div v-if="errorMsg" class="error-banner">{{ errorMsg }}</div>

        <div class="form-actions space-between">
          <div class="left-actions">
            <button type="submit" class="btn-primary" :disabled="saving">
              <Icon icon="bx:save" class="btn-icon" />
              {{ saving ? 'Updating…' : 'Update Employee' }}
            </button>
            <button type="button" class="btn-outline" @click="loadEmployee">
              <Icon icon="bx:reset" class="btn-icon" /> Reset
            </button>
          </div>
          <div class="right-actions">
            <button type="button" class="btn-danger" @click="deleteEmployee" :disabled="saving">
              <Icon icon="bx:trash" class="btn-icon" /> Delete Employee
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import EmployeeApi from '@/Api/Modules/employee';

const router   = useRouter();
const route    = useRoute();
const loading  = ref(true);
const saving   = ref(false);
const errorMsg = ref('');

// ── Form state ──────────────────────────────────────────────────────
const form = ref({
  name: '',
  email: '',
  phone: '',
  designation: '',
  salary: 0,
});

// ── Business-logic helpers (mirrors backend) ─────────────────────────

const monthlyTax = computed(() => {
  const s = Number(form.value.salary) || 0;
  if (s >= 150000) return +(s * 0.05).toFixed(2);
  if (s >= 100000) return +(s * 0.03).toFixed(2);
  return 0;
});

const yearlyBonus = computed(() => {
  const s   = Number(form.value.salary) || 0;
  const des = (form.value.designation || '').toLowerCase();
  if (des === 'manager')                              return +(s * 0.05).toFixed(2);
  if (des === 'senior' || des === 'senior developer') return +(s * 0.03).toFixed(2);
  if (des === 'associate')                            return +(s * 0.01).toFixed(2);
  return 0;
});

const monthlyNetSalary = computed(() => +(Number(form.value.salary) - monthlyTax.value).toFixed(2));
const yearlyNetSalary  = computed(() => +((monthlyNetSalary.value * 12) + yearlyBonus.value).toFixed(2));

// ── Load employee ────────────────────────────────────────────────────

const loadEmployee = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const response = await EmployeeApi.getById(route.params.id);
    if (response.data?.data) {
      form.value = response.data.data;
    }
  } catch (error) {
    errorMsg.value = 'Failed to load employee data.';
    console.error('Error loading employee:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadEmployee);

// ── Actions ──────────────────────────────────────────────────────────

const updateEmployee = async () => {
  saving.value   = true;
  errorMsg.value = '';
  try {
    await EmployeeApi.update(route.params.id, {
      phone:  form.value.phone,
      salary: form.value.salary,
    });
    router.push({ name: 'EmployeeDashboard' });
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (errors) {
      errorMsg.value = Object.values(errors).flat().join(' | ');
    } else {
      errorMsg.value = 'Failed to update employee. Please try again.';
    }
    console.error('Error updating employee:', error);
  } finally {
    saving.value = false;
  }
};

const deleteEmployee = async () => {
  if (!confirm('Are you sure you want to delete this employee? This cannot be undone.')) return;

  saving.value = true;
  try {
    await EmployeeApi.delete(route.params.id);
    router.push({ name: 'EmployeeDashboard' });
  } catch (error) {
    errorMsg.value = 'Failed to delete employee.';
    console.error('Error deleting employee:', error);
  } finally {
    saving.value = false;
  }
};
</script>

<style lang="scss" scoped>
.add-employee-container {
  max-width: 1000px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #6d28d9;
  font-size: 15px;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;

  .form-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 2px solid #e2e8f0;
    margin-bottom: 30px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 200px;
      height: 2px;
      background: #6d28d9;
    }

    .header-icon {
      font-size: 24px;
      color: #6d28d9;
      background: #f3e8ff;
      border-radius: 50%;
      padding: 6px;
    }

    h2 {
      margin: 0;
      color: #6d28d9;
      font-size: 20px;
      font-weight: 600;
    }
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    .required { color: #ef4444; }
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    .input-icon {
      position: absolute;
      left: 12px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 4px;

      &.purple { color: #6d28d9; }
      &.green  { color: #16a34a; background: #dcfce7; font-size: 16px; border-radius: 50%; }
      &.red    { color: #ef4444; background: #fee2e2; font-size: 16px; border-radius: 50%; }
      &.yellow { color: #d97706; background: #fef3c7; font-size: 16px; border-radius: 4px; }
      &.blue   { color: #2563eb; background: #dbeafe; font-size: 16px; border-radius: 4px; }
    }

    input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      color: #334155;
      font-family: 'Inter', sans-serif;
      transition: all 0.2s;
      background: white;

      &:focus {
        outline: none;
        border-color: #6d28d9;
        box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
      }

      &::placeholder { color: #94a3b8; }

      &.readonly-input {
        background: #f8fafc;
        cursor: not-allowed;
        color: #475569;
      }
    }
  }
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: space-between;

  .left-actions { display: flex; gap: 16px; }

  button {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 500;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    .btn-icon { font-size: 20px; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  .btn-primary {
    background: #6d28d9;
    color: white;
    border: none;
    &:hover:not(:disabled) { background: #5b21b6; }
  }

  .btn-outline {
    background: white;
    color: #6d28d9;
    border: 1px solid #6d28d9;
    &:hover { background: #f3e8ff; }
  }

  .btn-danger {
    background: #ef4444;
    color: white;
    border: none;
    &:hover:not(:disabled) { background: #dc2626; }
  }
}

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; gap: 16px; }
}
</style>
