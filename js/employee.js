/* Employee management functionality */

// Global variables
let employees = [];
let currentEmployeeId = null;

document.addEventListener("DOMContentLoaded", function () {
    // Load employees from localStorage
    loadEmployees();

    // Initialize UI elements
    const addEmployeeBtn = document.getElementById("addEmployeeBtn");
    const cancelEmployeeBtn = document.getElementById("cancelEmployeeBtn");
    const employeeForm = document.getElementById("employeeForm");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const searchInput = document.getElementById("searchInput");
    const departmentFilter = document.getElementById("departmentFilter");

    // Add event listeners
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener("click", openAddEmployeeModal);
    }

    if (cancelEmployeeBtn) {
        cancelEmployeeBtn.addEventListener("click", closeEmployeeModal);
    }

    if (employeeForm) {
        employeeForm.addEventListener("submit", saveEmployee);
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", deleteEmployee);
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    }

    // Search and filter functionality
    if (searchInput) {
        searchInput.addEventListener("input", filterEmployees);
    }

    if (departmentFilter) {
        departmentFilter.addEventListener("change", filterEmployees);
    }
});

// Load employees from localStorage
function loadEmployees() {
    employees = JSON.parse(localStorage.getItem("employees")) || [];
    renderEmployeeList();

    // Update dashboard statistics
    updateDashboardStats();
}

// Render the employee list to the DOM
function renderEmployeeList() {
    const employeeList = document.getElementById("employeeList");
    const noEmployeesMessage = document.getElementById("noEmployeesMessage");

    if (!employeeList) return;

    // Clear the current list
    employeeList.innerHTML = "";

    // Show message if no employees
    if (employees.length === 0) {
        if (noEmployeesMessage) {
            noEmployeesMessage.classList.remove("hidden");
        }
        return;
    } else if (noEmployeesMessage) {
        noEmployeesMessage.classList.add("hidden");
    }

    // Get filter values
    const searchTerm =
        document.getElementById("searchInput")?.value.toLowerCase() || "";
    const departmentFilter =
        document.getElementById("departmentFilter")?.value || "";

    // Filter employees based on search and department
    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch =
            employee.name.toLowerCase().includes(searchTerm) ||
            employee.position.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm);

        const matchesDepartment =
            !departmentFilter || employee.department === departmentFilter;

        return matchesSearch && matchesDepartment;
    });

    // Show message if no filtered results
    if (filteredEmployees.length === 0) {
        employeeList.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">No employees found matching your criteria</td>
            </tr>
        `;
        return;
    }

    // Render each employee
    filteredEmployees.forEach((employee) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.id.slice(0, 8)}</td>
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td>${employee.email}</td>
            <td>
                <div class="flex gap-2 flex-wrap">
                    <button class="btn btn-sm btn-primary" data-id="${
                        employee.id
                    }" onclick="viewEmployeeDetails('${employee.id}')">
                        View
                    </button>
                    <button class="btn btn-sm btn-info" data-id="${
                        employee.id
                    }" onclick="editEmployee('${employee.id}')">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-error" data-id="${
                        employee.id
                    }" onclick="openDeleteModal('${employee.id}')">
                        Delete
                    </button>
                </div>
            </td>
        `;
        employeeList.appendChild(row);
    });
}

// Filter employees based on search and department
function filterEmployees() {
    renderEmployeeList();
}

// Open modal to add a new employee
function openAddEmployeeModal() {
    const modal = document.getElementById("employeeModal");
    const modalTitle = document.getElementById("modalTitle");

    // Reset form
    document.getElementById("employeeForm").reset();
    document.getElementById("employeeId").value = "";
    currentEmployeeId = null;

    // Set title
    if (modalTitle) {
        modalTitle.textContent = "Add Employee";
    }

    // Set today's date as default for hire date
    const hireDateInput = document.getElementById("employeeHireDate");
    if (hireDateInput) {
        const today = new Date().toISOString().split("T")[0];
        hireDateInput.value = today;
    }

    // Open modal
    if (modal) {
        modal.showModal();
    }
}

// Close the employee modal
function closeEmployeeModal() {
    const modal = document.getElementById("employeeModal");
    if (modal) {
        modal.close();
    }
}

// Save employee (create or update)
function saveEmployee(e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loader mr-2"></span> Saving...';
    submitBtn.disabled = true;

    const id = document.getElementById("employeeId").value || generateId();
    const name = document.getElementById("employeeName").value;
    const position = document.getElementById("employeePosition").value;
    const department = document.getElementById("employeeDepartment").value;
    const email = document.getElementById("employeeEmail").value;
    const phone = document.getElementById("employeePhone").value;
    const hireDate = document.getElementById("employeeHireDate").value;

    const employee = {
        id,
        name,
        position,
        department,
        email,
        phone,
        hireDate,
        updatedAt: new Date().toISOString(),
    };

    // Simulate a slight delay for demo purposes
    setTimeout(() => {
        // Check if we're updating or creating
        if (currentEmployeeId) {
            // Update existing employee
            const index = employees.findIndex(
                (emp) => emp.id === currentEmployeeId
            );
            if (index !== -1) {
                employees[index] = { ...employees[index], ...employee };
                showNotification(
                    `${name} was successfully updated.`,
                    "success"
                );
            }
        } else {
            // Add created date for new employees
            employee.createdAt = new Date().toISOString();
            employees.push(employee);
            showNotification(`${name} was successfully added.`, "success");
        }

        // Save to localStorage
        localStorage.setItem("employees", JSON.stringify(employees));

        // Close modal and refresh list
        closeEmployeeModal();
        renderEmployeeList();

        // Update dashboard stats
        updateDashboardStats();

        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }, 600); // Slight delay for UX
}

// Edit an employee
function editEmployee(id) {
    const employee = employees.find((emp) => emp.id === id);
    if (!employee) return;

    currentEmployeeId = id;

    // Fill form with employee data
    document.getElementById("employeeId").value = employee.id;
    document.getElementById("employeeName").value = employee.name;
    document.getElementById("employeePosition").value = employee.position;
    document.getElementById("employeeDepartment").value = employee.department;
    document.getElementById("employeeEmail").value = employee.email;
    document.getElementById("employeePhone").value = employee.phone;
    document.getElementById("employeeHireDate").value = employee.hireDate;

    // Change modal title
    const modalTitle = document.getElementById("modalTitle");
    if (modalTitle) {
        modalTitle.textContent = "Edit Employee";
    }

    // Open modal
    const modal = document.getElementById("employeeModal");
    if (modal) {
        modal.showModal();
    }
}

// Open delete confirmation modal
function openDeleteModal(id) {
    currentEmployeeId = id;

    const modal = document.getElementById("deleteModal");
    if (modal) {
        modal.showModal();
    }
}

// Close delete confirmation modal
function closeDeleteModal() {
    const modal = document.getElementById("deleteModal");
    if (modal) {
        modal.close();
    }
}

// Delete an employee
function deleteEmployee() {
    if (!currentEmployeeId) return;

    // Find the employee name before deletion
    const employeeToDelete = employees.find(
        (emp) => emp.id === currentEmployeeId
    );
    const employeeName = employeeToDelete ? employeeToDelete.name : "Employee";

    // Filter out the employee with the given id
    employees = employees.filter((emp) => emp.id !== currentEmployeeId);

    // Save to localStorage
    localStorage.setItem("employees", JSON.stringify(employees));

    // Close modal and refresh list
    closeDeleteModal();
    renderEmployeeList();

    // Show notification
    showNotification(`${employeeName} was successfully deleted.`, "success");

    // Update dashboard stats
    updateDashboardStats();

    currentEmployeeId = null;
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Navigate to employee details page
function viewEmployeeDetails(id) {
    if (!id) return;

    // Navigate to employee detail page with the employee ID as a query parameter
    window.location.href = `./pages/employeeDetail.html?id=${id}`;
}

// Make functions available globally
window.editEmployee = editEmployee;
window.openDeleteModal = openDeleteModal;
window.viewEmployeeDetails = viewEmployeeDetails;
