export default [
  {
    path: 'employee',
    name: 'EmployeeManagement',
    component: () => import('@/views/AdminSide/EmployeeManagement/index.vue'),
    redirect: { name: 'EmployeeDashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'EmployeeDashboard',
        component: () => import('@/views/AdminSide/EmployeeManagement/Dashboard.vue')
      },
      {
        path: 'list',
        name: 'EmployeeList',
        component: () => import('@/views/AdminSide/EmployeeManagement/Components/EmployeeTable.vue')
      },
      {
        path: 'add',
        name: 'AddEmployee',
        component: () => import('@/views/AdminSide/EmployeeManagement/Components/AddEmployee.vue')
      },
      {
        path: 'update/:id',
        name: 'UpdateEmployee',
        component: () => import('@/views/AdminSide/EmployeeManagement/Components/UpdateEmployee.vue')
      }
    ]
  }
];
