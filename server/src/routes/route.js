import express from "express";
// import * as departmentController from "../controllers/departmentController"
// import * as employeeController from "../controllers/employeeController"
// import * as authController from "../controllers/authController"
// import * as salaryController from "../controllers/salaryController"
// import * as msalaryController from "../controllers/msalaryController"

const router = express.Router()

// auth route
// router.get('/account', authController.getAllAccountController)
// router.post('/auth/token', authController.checkTokenExpiredController)
// router.post('/auth/login', authController.loginController)
// router.post('/auth/register', authController.registerController)
// router.post('/auth/update', authController.updateAccountController)
// router.post('/auth/delete', authController.deleteAccountController)

// // salary route
// router.post('/salary', salaryController.getAllSalarieController)
// router.post('/salary/employee', salaryController.getSalaryByEmployeeController)
// router.post('/salary/add', salaryController.addSalaryController)
// router.post('/salary/update', salaryController.updateSalaryController)
// router.post('/salary/delete', salaryController.deleteSalaryController)

// // month salary route
// router.post('/msalary', msalaryController.getMonthSalariesByEmployeeIdController)
// router.post('/msalary/add', msalaryController.addMonthSalaryController)
// router.post('/msalary/delete', msalaryController.deleteMonthSalaryController)


// // department route
// router.get('/department', departmentController.getAllDepartmentController)
// router.post('/department/add', departmentController.addDepartmentController)
// router.post('/department/update', departmentController.updateDepartmentController)
// router.post('/department/delete', departmentController.deleteDepartmentController)

// // employee route
// router.post('/employee', employeeController.getAllEmployeeController)
// router.get('/employee/noac', employeeController.getAllEmployeeWithoutAccountController)
// router.get('/employee/nosl', employeeController.getEmployeesWithoutSalaryController)
// router.post('/employee/id', employeeController.getEmployeeByIdController)
// router.post('/employee/add', employeeController.addEmployeeController)
// router.post('/employee/update', employeeController.updateEmployeeController)
// router.post('/employee/delete', employeeController.deleteEmployeeController)

export default router