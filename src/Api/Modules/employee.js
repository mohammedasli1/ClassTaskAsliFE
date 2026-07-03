import api from '@/services/api';

/**
 * Employee API module.
 * All calls map to Laravel's EmployeeManagementController.
 */
export default {

  /** Get all employees. Optionally filter by phone (partial match). */
  getAll(phone = '') {
    const params = phone ? { phone } : {};
    return api.get('/employees', { params });
  },

  /** Get a single employee by ID. */
  getById(id) {
    return api.get(`/employees/${id}`);
  },

  /** Create a new employee (backend computes tax, bonus, net salaries). */
  create(data) {
    return api.post('/employees', data);
  },

  /**
   * Update an employee — only phone and salary are sent.
   * Backend recomputes all derived fields automatically.
   */
  update(id, data) {
    return api.put(`/employees/${id}`, data);
  },

  /** Delete an employee by ID. */
  delete(id) {
    return api.delete(`/employees/${id}`);
  },
};
