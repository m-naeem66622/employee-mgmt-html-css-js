/* Department management functionality */

// Global variables
let departments = [];
let currentDepartmentId = null;

document.addEventListener("DOMContentLoaded", function () {
    // Load departments from localStorage
    loadDepartments();

    // Initialize UI elements
    const addDepartmentBtn = document.getElementById("addDepartmentBtn");
    const cancelDepartmentBtn = document.getElementById("cancelDepartmentBtn");
    const departmentForm = document.getElementById("departmentForm");
    const confirmDeleteDepartmentBtn = document.getElementById(
        "confirmDeleteDepartmentBtn"
    );
    const cancelDeleteDepartmentBtn = document.getElementById(
        "cancelDeleteDepartmentBtn"
    );

    // Add event listeners
    if (addDepartmentBtn) {
        addDepartmentBtn.addEventListener("click", openAddDepartmentModal);
    }

    if (cancelDepartmentBtn) {
        cancelDepartmentBtn.addEventListener("click", closeDepartmentModal);
    }

    if (departmentForm) {
        departmentForm.addEventListener("submit", saveDepartment);
    }

    if (confirmDeleteDepartmentBtn) {
        confirmDeleteDepartmentBtn.addEventListener("click", deleteDepartment);
    }

    if (cancelDeleteDepartmentBtn) {
        cancelDeleteDepartmentBtn.addEventListener(
            "click",
            closeDeleteDepartmentModal
        );
    }
});

// Load departments from localStorage
function loadDepartments() {
    departments = JSON.parse(localStorage.getItem("departments")) || [];

    // If no departments exist, initialize with defaults
    if (departments.length === 0) {
        const defaultDepartments = [
            {
                id: "dept1",
                name: "IT",
                description: "Information Technology department",
                createdAt: new Date().toISOString(),
            },
            {
                id: "dept2",
                name: "HR",
                description: "Human Resources department",
                createdAt: new Date().toISOString(),
            },
            {
                id: "dept3",
                name: "Finance",
                description: "Finance and accounting department",
                createdAt: new Date().toISOString(),
            },
            {
                id: "dept4",
                name: "Marketing",
                description: "Marketing and sales department",
                createdAt: new Date().toISOString(),
            },
            {
                id: "dept5",
                name: "Operations",
                description: "Operations and logistics department",
                createdAt: new Date().toISOString(),
            },
        ];

        departments = defaultDepartments;
        localStorage.setItem("departments", JSON.stringify(departments));
    }

    renderDepartmentList();
    updateDepartmentStats();
}

// Get all employees to calculate department statistics
function getAllEmployees() {
    return JSON.parse(localStorage.getItem("employees")) || [];
}

// Update department statistics
function updateDepartmentStats() {
    const totalDepartmentsElement = document.getElementById("totalDepartments");
    const totalEmployeesElement = document.getElementById("totalEmployees");
    const largestDepartmentElement =
        document.getElementById("largestDepartment");
    const largestDepartmentCountElement = document.getElementById(
        "largestDepartmentCount"
    );

    const employees = getAllEmployees();

    if (totalDepartmentsElement) {
        totalDepartmentsElement.textContent = departments.length;
    }

    if (totalEmployeesElement) {
        totalEmployeesElement.textContent = employees.length;
    }

    // Calculate employees per department
    const departmentCounts = {};
    departments.forEach((dept) => {
        departmentCounts[dept.id] = 0;
    });

    employees.forEach((employee) => {
        // Find department by name
        const department = departments.find(
            (dept) => dept.name === employee.department
        );
        if (department) {
            departmentCounts[department.id] =
                (departmentCounts[department.id] || 0) + 1;
        }
    });

    // Find largest department
    let maxCount = 0;
    let largestDeptName = "-";

    departments.forEach((dept) => {
        const count = departmentCounts[dept.id] || 0;
        if (count > maxCount) {
            maxCount = count;
            largestDeptName = dept.name;
        }
    });

    if (largestDepartmentElement) {
        largestDepartmentElement.textContent = largestDeptName;
    }

    if (largestDepartmentCountElement) {
        largestDepartmentCountElement.textContent = `${maxCount} employees`;
    }
}

// Render the department list to the DOM
function renderDepartmentList() {
    const departmentList = document.getElementById("departmentList");
    const noDepartmentsMessage = document.getElementById(
        "noDepartmentsMessage"
    );

    if (!departmentList) return;

    // Clear the current list
    departmentList.innerHTML = "";

    // Show message if no departments
    if (departments.length === 0) {
        if (noDepartmentsMessage) {
            noDepartmentsMessage.classList.remove("hidden");
        }
        return;
    } else if (noDepartmentsMessage) {
        noDepartmentsMessage.classList.add("hidden");
    }

    // Get all employees to calculate counts
    const employees = getAllEmployees();

    // Render each department
    departments.forEach((department) => {
        // Count employees in this department
        const employeeCount = employees.filter(
            (emp) => emp.department === department.name
        ).length;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${department.id.slice(0, 8)}</td>
            <td>${department.name}</td>
            <td>${department.description || "No description"}</td>
            <td>${employeeCount}</td>
            <td>
                <div class="flex gap-2">
                    <button class="btn btn-sm btn-ghost hover:text-info" data-id="${
                        department.id
                    }" onclick="editDepartment('${department.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button class="btn btn-sm btn-ghost hover:text-error" data-id="${
                        department.id
                    }" onclick="openDeleteDepartmentModal('${department.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        `;
        departmentList.appendChild(row);
    });
}

// Open modal to add a new department
function openAddDepartmentModal() {
    const modal = document.getElementById("departmentModal");
    const modalTitle = document.getElementById("modalTitle");

    // Reset form
    document.getElementById("departmentForm").reset();
    document.getElementById("departmentId").value = "";
    currentDepartmentId = null;

    // Set title
    if (modalTitle) {
        modalTitle.textContent = "Add Department";
    }

    // Open modal
    if (modal) {
        modal.showModal();
    }
}

// Close the department modal
function closeDepartmentModal() {
    const modal = document.getElementById("departmentModal");
    if (modal) {
        modal.close();
    }
}

// Save department (create or update)
function saveDepartment(e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loader mr-2"></span> Saving...';
    submitBtn.disabled = true;

    const id = document.getElementById("departmentId").value || generateId();
    const name = document.getElementById("departmentName").value;
    const description = document.getElementById("departmentDescription").value;

    const department = {
        id,
        name,
        description,
        updatedAt: new Date().toISOString(),
    };

    // Simulate a slight delay for demo purposes
    setTimeout(() => {
        // Check if we're updating or creating
        if (currentDepartmentId) {
            // Update existing department
            const index = departments.findIndex(
                (dept) => dept.id === currentDepartmentId
            );
            if (index !== -1) {
                departments[index] = { ...departments[index], ...department };
                showNotification(
                    `${name} department was successfully updated.`,
                    "success"
                );
            }
        } else {
            // Add created date for new departments
            department.createdAt = new Date().toISOString();
            departments.push(department);
            showNotification(
                `${name} department was successfully added.`,
                "success"
            );
        }

        // Save to localStorage
        localStorage.setItem("departments", JSON.stringify(departments));

        // Close modal and refresh list
        closeDepartmentModal();
        renderDepartmentList();

        // Update department stats
        updateDepartmentStats();

        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }, 600); // Slight delay for UX
}

// Edit a department
function editDepartment(id) {
    const department = departments.find((dept) => dept.id === id);
    if (!department) return;

    currentDepartmentId = id;

    // Fill form with department data
    document.getElementById("departmentId").value = department.id;
    document.getElementById("departmentName").value = department.name;
    document.getElementById("departmentDescription").value =
        department.description || "";

    // Change modal title
    const modalTitle = document.getElementById("modalTitle");
    if (modalTitle) {
        modalTitle.textContent = "Edit Department";
    }

    // Open modal
    const modal = document.getElementById("departmentModal");
    if (modal) {
        modal.showModal();
    }
}

// Open delete confirmation modal
function openDeleteDepartmentModal(id) {
    currentDepartmentId = id;

    const department = departments.find((dept) => dept.id === id);
    if (!department) return;

    // Check if employees use this department
    const employees = getAllEmployees();
    const employeesInDepartment = employees.filter(
        (emp) => emp.department === department.name
    );
    const employeeCount = employeesInDepartment.length;

    // Show warning if employees exist in this department
    const warningElement = document.getElementById("departmentDeleteWarning");
    const countElement = document.getElementById("employeeCount");

    if (warningElement && employeeCount > 0) {
        countElement.textContent = employeeCount;
        warningElement.classList.remove("hidden");
    } else if (warningElement) {
        warningElement.classList.add("hidden");
    }

    const modal = document.getElementById("deleteDepartmentModal");
    if (modal) {
        modal.showModal();
    }
}

// Close delete confirmation modal
function closeDeleteDepartmentModal() {
    const modal = document.getElementById("deleteDepartmentModal");
    if (modal) {
        modal.close();
    }
}

// Delete a department
function deleteDepartment() {
    if (!currentDepartmentId) return;

    // Find the department name before deletion
    const departmentToDelete = departments.find(
        (dept) => dept.id === currentDepartmentId
    );
    const departmentName = departmentToDelete
        ? departmentToDelete.name
        : "Department";

    // Filter out the department with the given id
    departments = departments.filter((dept) => dept.id !== currentDepartmentId);

    // Save to localStorage
    localStorage.setItem("departments", JSON.stringify(departments));

    // Close modal and refresh list
    closeDeleteDepartmentModal();
    renderDepartmentList();

    // Show notification
    showNotification(
        `${departmentName} department was successfully deleted.`,
        "success"
    );

    // Update department stats
    updateDepartmentStats();

    currentDepartmentId = null;
}

// Generate a unique ID
function generateId() {
    return (
        "dept_" + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
}

// Make functions available globally
window.editDepartment = editDepartment;
window.openDeleteDepartmentModal = openDeleteDepartmentModal;
