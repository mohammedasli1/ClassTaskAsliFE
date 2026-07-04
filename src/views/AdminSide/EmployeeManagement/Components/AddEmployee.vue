<template>
  <div class="add-employee-container">
    <div class="form-card">
      <!-- Section Header -->
      <div class="form-header">
        <Icon icon="bx:user" class="header-icon" />
        <h2>Employee Information</h2>
      </div>

      <form @submit.prevent="saveEmployee" class="employee-form">
        <div class="form-grid">

          <!-- Full Name -->
          <div class="form-group">
            <label>Full Name <span class="required">*</span></label>
            <div class="input-wrapper">
              <span class="input-icon purple"><Icon icon="bx:user" /></span>
              <v-text-field
                id="emp-name"
                v-model="form.name"
                placeholder="Enter full name"
                :required="true"
                variant="outlined"
                density="compact"
                hide-details
                class="custom-vfield"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <div class="input-wrapper">
              <span class="input-icon purple"><Icon icon="bx:envelope" /></span>
              <v-text-field
                id="emp-email"
                type="email"
                v-model="form.email"
                placeholder="Enter email address"
                :required="true"
                variant="outlined"
                density="compact"
                hide-details
                class="custom-vfield"
              />
            </div>
          </div>

          <!-- Phone Number -->
          <div class="form-group">
            <label>Phone Number <span class="required">*</span></label>
            <div class="input-wrapper">
              <span class="input-icon purple"><Icon icon="bx:phone" /></span>
              <v-text-field
                id="emp-phone"
                v-model="form.phone"
                placeholder="Enter phone number"
                :required="true"
                variant="outlined"
                density="compact"
                hide-details
                class="custom-vfield"
              />
            </div>
          </div>

          <!-- Designation -->
          <div class="form-group">
            <label>Designation <span class="required">*</span></label>
            <div class="input-wrapper">
              <span class="input-icon purple"><Icon icon="bx:briefcase" /></span>
              <v-select
                id="emp-designation"
                v-model="form.designation"
                :items="designationOptions"
                placeholder="Select designation"
                :required="true"
                variant="outlined"
                density="compact"
                hide-details
                class="custom-vfield"
              />
            </div>
          </div>

          <!-- Monthly Salary Package -->
          <div class="form-group">
            <label>Monthly Salary Package <span class="required">*</span></label>
            <div class="input-wrapper">
              <span class="input-icon green"><Icon icon="bx:dollar" /></span>
              <v-text-field
                id="emp-salary"
                type="number"
                v-model.number="form.salary"
                placeholder="Enter monthly salary"
                :required="true"
                min="0"
                variant="outlined"
                density="compact"
                hide-details
                class="custom-vfield"
              />
            </div>
          </div>

          <!-- Monthly Tax Value (auto-computed) -->
          <div class="form-group">
            <label>Monthly Tax Value</label>
            <div class="input-wrapper">
              <span class="input-icon red"><Icon icon="bx:pie-chart-alt" /></span>
              <v-text-field
                type="number"
                :model-value="monthlyTax"
                readonly
                variant="outlined"
                density="compact"
                hide-details
                class="custom-vfield readonly-vfield"
              />
            </div>
            <small class="hint">≥150k → 5% | ≥100k → 3% | &lt;100k → 0</small>
          </div>

          <!-- Yearly Increasing Bonus (auto-computed) -->
          <div class="form-group">
            <label>Yearly Increasing Bonus</label>
            <div class="input-wrapper">
              <span class="input-icon yellow"><Icon icon="bx:gift" /></span>
              <v-text-field
                type="number"
                :model-value="yearlyBonus"
                readonly
                variant="outlined"
                density="compact"
                hide-details
                class="custom-vfield readonly-vfield"
              />
            </div>
            <small class="hint">Manager 5% | Senior 3% | Associate 1% | Intern 0</small>
          </div>

          <!-- Monthly Net Salary (auto-computed) -->
          <div class="form-group">
            <label>Monthly Net Salary</label>
            <div class="input-wrapper">
              <span class="input-icon blue"><Icon icon="bx:wallet" /></span>
              <v-text-field
                type="number"
                :model-value="monthlyNetSalary"
                readonly
                variant="outlined"
                density="compact"
                hide-details
                class="custom-vfield readonly-vfield"
              />
            </div>
          </div>

          <!-- Yearly Net Salary (auto-computed) -->
          <div class="form-group">
            <label>Yearly Net Salary</label>
            <div class="input-wrapper">
              <span class="input-icon blue"><Icon icon="bx:calendar-check" /></span>
              <v-text-field
                type="number"
                :model-value="yearlyNetSalary"
                readonly
                variant="outlined"
                density="compact"
                hide-details
                class="custom-vfield readonly-vfield"
              />
            </div>
            <small class="hint">(Monthly Net × 12) + Yearly Bonus</small>
          </div>

        </div>

        <!-- Error banner -->
        <v-alert
          v-if="errorMsg"
          type="error"
          variant="tonal"
          class="error-banner"
          :text="errorMsg"
        />

        <div class="form-actions">
          <v-btn
            type="submit"
            class="btn-primary"
            :disabled="saving"
            :loading="saving"
          >
            <Icon icon="bx:save" class="btn-icon" />
            {{ saving ? 'Saving…' : 'Save Employee' }}
          </v-btn>
          <v-btn
            type="button"
            class="btn-outline"
            variant="outlined"
            @click="resetForm"
          >
            <Icon icon="bx:reset" class="btn-icon" /> Reset
          </v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import EmployeeApi from '@/Api/Modules/employee';

const router  = useRouter();
const saving  = ref(false);
const errorMsg = ref('');

const designationOptions = ['Intern', 'Associate', 'Senior', 'Senior Developer', 'Manager'];

// ── Form state ──────────────────────────────────────────────────────
const form = ref({
  name: '',
  email: '',
  phone: '',
  designation: '',
  salary: null,
});

// ── Business-logic helpers (mirrors backend rules) ───────────────────

/**
 * Monthly tax:
 *   salary >= 150,000 → 5%
 *   salary >= 100,000 → 3%
 *   salary <  100,000 → 0
 */
const monthlyTax = computed(() => {
  const s = Number(form.value.salary) || 0;
  if (s >= 150000) return +(s * 0.05).toFixed(2);
  if (s >= 100000) return +(s * 0.03).toFixed(2);
  return 0;
});

/**
 * Yearly increasing bonus (based on designation):
 *   Manager → 5% | Senior / Senior Developer → 3% | Associate → 1% | Intern → 0
 */
const yearlyBonus = computed(() => {
  const s   = Number(form.value.salary) || 0;
  const des = (form.value.designation || '').toLowerCase();
  if (des === 'manager')                              return +(s * 0.05).toFixed(2);
  if (des === 'senior' || des === 'senior developer') return +(s * 0.03).toFixed(2);
  if (des === 'associate')                            return +(s * 0.01).toFixed(2);
  return 0; // Intern
});

/** Monthly net salary = salary - monthly_tax_value */
const monthlyNetSalary = computed(() => {
  const s = Number(form.value.salary) || 0;
  return +(s - monthlyTax.value).toFixed(2);
});

/** Yearly net salary = (monthly_net_salary × 12) + yearly_increasing_bonus */
const yearlyNetSalary = computed(() => {
  return +((monthlyNetSalary.value * 12) + yearlyBonus.value).toFixed(2);
});

// ── Actions ──────────────────────────────────────────────────────────

const saveEmployee = async () => {
  saving.value  = true;
  errorMsg.value = '';

  try {
    await EmployeeApi.create({
      name:        form.value.name,
      email:       form.value.email,
      phone:       form.value.phone,
      designation: form.value.designation,
      salary:      form.value.salary,
    });

    router.push({ name: 'EmployeeDashboard' });
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (errors) {
      errorMsg.value = Object.values(errors).flat().join(' | ');
    } else {
      errorMsg.value = 'Failed to save employee. Please try again.';
    }
    console.error('Error saving employee:', error);
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  form.value = { name: '', email: '', phone: '', designation: '', salary: null };
  errorMsg.value = '';
};
</script>

<style lang="scss" scoped>
.add-employee-container {
  max-width: 1000px;
  margin: 0 auto;
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

  .hint {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
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
      z-index: 2;

      &.purple { color: #6d28d9; }
      &.green  { color: #16a34a; background: #dcfce7; font-size: 16px; border-radius: 50%; }
      &.red    { color: #ef4444; background: #fee2e2; font-size: 16px; border-radius: 50%; }
      &.yellow { color: #d97706; background: #fef3c7; font-size: 16px; border-radius: 4px; }
      &.blue   { color: #2563eb; background: #dbeafe; font-size: 16px; border-radius: 4px; }
    }

    // Vuetify v-text-field / v-select overrides
    .custom-vfield {
      width: 100%;

      :deep(.v-field) {
        border-radius: 8px !important;
        font-family: 'Inter', sans-serif;
        font-size: 14px;

        .v-field__input {
          padding-left: 48px !important;
          color: #334155 !important;
          font-size: 14px !important;
          min-height: 0 !important;
        }

        .v-field__outline__start,
        .v-field__outline__notch,
        .v-field__outline__end {
          border-color: #e2e8f0 !important;
        }

        &:hover .v-field__outline__start,
        &:hover .v-field__outline__notch,
        &:hover .v-field__outline__end {
          border-color: #6d28d9 !important;
        }

        &.v-field--focused {
          .v-field__outline__start,
          .v-field__outline__notch,
          .v-field__outline__end {
            border-color: #6d28d9 !important;
            border-width: 2px !important;
          }
          box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
        }
      }

      // Placeholder colour
      :deep(input::placeholder),
      :deep(.v-field__input::placeholder) {
        color: #94a3b8 !important;
      }
    }

    // Read-only computed fields
    .readonly-vfield {
      :deep(.v-field) {
        background: #f8fafc !important;
        .v-field__input { color: #475569 !important; cursor: not-allowed; }
      }
    }
  }
}

.error-banner {
  margin-bottom: 20px;
  border-radius: 8px !important;
}

.form-actions {
  display: flex;
  gap: 16px;

  .btn-primary {
    background: #6d28d9 !important;
    color: white !important;
    font-family: 'Inter', sans-serif;
    font-size: 15px !important;
    font-weight: 500 !important;
    padding: 12px 24px !important;
    border-radius: 8px !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
    display: flex;
    align-items: center;
    gap: 8px;
    .btn-icon { font-size: 20px; }
    &:hover { background: #5b21b6 !important; }
  }

  .btn-outline {
    color: #6d28d9 !important;
    border-color: #6d28d9 !important;
    font-family: 'Inter', sans-serif;
    font-size: 15px !important;
    font-weight: 500 !important;
    padding: 12px 24px !important;
    border-radius: 8px !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
    display: flex;
    align-items: center;
    gap: 8px;
    .btn-icon { font-size: 20px; }
    &:hover { background: #f3e8ff !important; }
  }
}

/* ── Tablet (≤1024px) ─────────────────────────────────────── */
@media (max-width: 1024px) {
  .add-employee-container {
    max-width: 100%;
    padding: 0 8px;
  }

  .form-card {
    padding: 24px;
  }

  .form-grid {
    gap: 16px;
  }
}

/* ── Small Tablet / Large Mobile (≤768px) ──────────────────── */
@media (max-width: 768px) {
  .form-card {
    padding: 20px 16px;
    border-radius: 10px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 20px;
  }

  .form-actions {
    flex-direction: column;
    gap: 12px;

    .btn-primary,
    .btn-outline {
      width: 100%;
      justify-content: center;
    }
  }
}

/* ── Mobile (≤480px) ───────────────────────────────────────── */
@media (max-width: 480px) {
  .form-card {
    padding: 16px 12px;

    .form-header {
      gap: 8px;
      margin-bottom: 20px;

      h2 { font-size: 17px; }
      .header-icon { font-size: 18px; padding: 4px; }
    }
  }

  .form-group {
    label { font-size: 13px; }
    .hint { font-size: 10px; }
  }
}
</style>
