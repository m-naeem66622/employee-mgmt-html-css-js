/* Unified Employee Management Functionality
   This file combines both employee.js and employees.js to eliminate redundancy
   while preserving all features from both files.
*/

// Global variables
let employees = [];
let currentEmployeeId = null;
let currentPage = 1;
let itemsPerPage = 10;
let sortField = "name";
let sortDirection = "asc";

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
    const exportCSVBtn = document.getElementById("exportCSVBtn");
    const sortFieldSelect = document.getElementById("sortField");
    const sortDirectionSelect = document.getElementById("sortDirection");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");

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

    // Sorting functionality (from employees.js)
    if (sortFieldSelect) {
        sortFieldSelect.addEventListener("change", function () {
            sortField = this.value;
            currentPage = 1; // Reset to first page
            renderEmployeeList();
        });
    }

    if (sortDirectionSelect) {
        sortDirectionSelect.addEventListener("change", function () {
            sortDirection = this.value;
            renderEmployeeList();
        });
    }

    // Pagination (from employees.js)
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                renderEmployeeList();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", function () {
            const totalPages = Math.ceil(
                getFilteredEmployees().length / itemsPerPage
            );
            if (currentPage < totalPages) {
                currentPage++;
                renderEmployeeList();
            }
        });
    }

    // Export CSV (from employees.js)
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener("click", exportEmployeesToCSV);
    }

    // Check for URL parameters (for editing)
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("edit");

    if (editId) {
        editEmployee(editId);
    }
});

// Load employees from localStorage
function loadEmployees() {
    employees = JSON.parse(localStorage.getItem("employees")) || [];

    // Add initial employee data set if no employees exist
    if (employees.length === 0) {
        const initialEmployees = [
            {
                id: "m9hnd2s75mklim1dvl",
                name: "Saad Qadeer",
                position: "Software Engineer",
                department: "IT",
                email: "saad.qadeer@company.com",
                phone: "555-123-4567",
                hireDate: "2023-05-15",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s786am9urj51",
                name: "Aysha Shakeel",
                position: "Senior Developer",
                department: "IT",
                email: "aysha.shakeel@company.com",
                phone: "555-222-3333",
                hireDate: "2022-08-10",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s7245nq2vdtrz",
                name: "Hussnain Raees",
                position: "System Administrator",
                department: "IT",
                email: "hussnain.raees@company.com",
                phone: "555-444-5555",
                hireDate: "2023-01-20",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s78p1ltmhmg1n",
                name: "Zoha Azam",
                position: "HR Manager",
                department: "HR",
                email: "zoha.azam@company.com",
                phone: "555-234-5678",
                hireDate: "2022-11-03",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s76v875ipnac9",
                name: "Omar Malik",
                position: "Recruitment Specialist",
                department: "HR",
                email: "omar.malik@company.com",
                phone: "555-666-7777",
                hireDate: "2023-09-15",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s7nkclsw59b1",
                name: "Rafay Hassan",
                position: "Financial Analyst",
                department: "Finance",
                email: "rafay.hassan@company.com",
                phone: "555-345-6789",
                hireDate: "2023-02-28",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s7usw0xdjvyb",
                name: "Sarab Sohail",
                position: "Accounting Manager",
                department: "Finance",
                email: "sarab.sohail@company.com",
                phone: "555-888-9999",
                hireDate: "2022-07-12",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s7x9fk8z3stni",
                name: "Hamza Abdullah",
                position: "Budget Analyst",
                department: "Finance",
                email: "hamza.abdullah@company.com",
                phone: "555-111-2222",
                hireDate: "2023-11-05",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s78b9j9l0hz4p",
                name: "Laiba Fayyaz",
                position: "Marketing Specialist",
                department: "Marketing",
                email: "laiba.fayyaz@company.com",
                phone: "555-456-7890",
                hireDate: "2023-08-17",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s7yzsfsxabhx",
                name: "Tariq Rahman",
                position: "Digital Marketing Manager",
                department: "Marketing",
                email: "tariq.rahman@company.com",
                phone: "555-333-4444",
                hireDate: "2022-10-22",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s7vq1vy619df",
                name: "Layla Hassan",
                position: "Content Creator",
                department: "Marketing",
                email: "layla.hassan@company.com",
                phone: "555-777-8888",
                hireDate: "2023-04-10",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s7pjgjf3e5b9o",
                name: "Yusuf Mahmood",
                position: "Operations Manager",
                department: "Operations",
                email: "yusuf.mahmood@company.com",
                phone: "555-567-8901",
                hireDate: "2022-06-22",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s7zho3o5xlwjc",
                name: "Noor Fatima",
                position: "Supply Chain Specialist",
                department: "Operations",
                email: "noor.fatima@company.com",
                phone: "555-999-0000",
                hireDate: "2023-07-15",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
            {
                id: "m9hnd2s7700wsc9x4m2",
                name: "Ibrahim Ahmad",
                position: "Quality Assurance Analyst",
                department: "Operations",
                email: "ibrahim.ahmad@company.com",
                phone: "555-555-1234",
                hireDate: "2022-12-08",
                createdAt: "2025-04-14T22:30:17.431Z",
                updatedAt: "2025-04-14T22:30:17.431Z",
            },
        ];

        // Save initial employees to localStorage
        employees = initialEmployees;
        localStorage.setItem("employees", JSON.stringify(employees));

        // Show success notification
        showNotification(
            "Initial employee data loaded successfully",
            "success"
        );
    }

    renderEmployeeList();

    // Update dashboard statistics if on dashboard page
    updateDashboardStats();
}

// Get filtered list of employees based on search and department
function getFilteredEmployees() {
    const searchTerm =
        document.getElementById("searchInput")?.value.toLowerCase() || "";
    const departmentFilter =
        document.getElementById("departmentFilter")?.value || "";

    // Filter employees based on search and department
    return employees.filter((employee) => {
        const matchesSearch =
            employee.name.toLowerCase().includes(searchTerm) ||
            employee.position.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm);

        const matchesDepartment =
            !departmentFilter || employee.department === departmentFilter;

        return matchesSearch && matchesDepartment;
    });
}

// Sort employees based on selected field and direction
function getSortedEmployees(filteredEmployees) {
    return filteredEmployees.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        // Handle dates
        if (
            sortField === "hireDate" ||
            sortField === "createdAt" ||
            sortField === "updatedAt"
        ) {
            valA = new Date(valA);
            valB = new Date(valB);
        }

        // Handle strings
        if (typeof valA === "string") {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) {
            return sortDirection === "asc" ? -1 : 1;
        }
        if (valA > valB) {
            return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
    });
}

// Get paginated employees
function getPaginatedEmployees(sortedEmployees) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedEmployees.slice(startIndex, endIndex);
}

// Render the employee list to the DOM
function renderEmployeeList() {
    const employeeList = document.getElementById("employeeList");
    const noEmployeesMessage = document.getElementById("noEmployeesMessage");
    const pageInfo = document.getElementById("pageInfo");

    if (!employeeList) return;

    // Clear the current list
    employeeList.innerHTML = "";

    // Get filtered employees
    const filteredEmployees = getFilteredEmployees();

    // Check if we're on the employees.html page (has pagination and sorting)
    const isEmployeesPage = document.getElementById("sortField") !== null;

    // Show message if no employees
    if (filteredEmployees.length === 0) {
        if (noEmployeesMessage) {
            noEmployeesMessage.classList.remove("hidden");
        }

        if (pageInfo) {
            pageInfo.textContent = "Page 0 of 0";
        }

        employeeList.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">No employees found matching your criteria</td>
            </tr>
        `;
        return;
    } else if (noEmployeesMessage) {
        noEmployeesMessage.classList.add("hidden");
    }

    let employeesToRender = filteredEmployees;

    // Apply sorting and pagination if on employees.html page
    if (isEmployeesPage) {
        // Sort employees
        const sortedEmployees = getSortedEmployees(filteredEmployees);

        // Calculate pagination
        const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

        // Update page info
        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }

        // Ensure current page is valid
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        // Get paginated employees
        employeesToRender = getPaginatedEmployees(sortedEmployees);

        // Disable/enable pagination buttons
        const prevPageBtn = document.getElementById("prevPageBtn");
        const nextPageBtn = document.getElementById("nextPageBtn");

        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage <= 1;
        }

        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage >= totalPages;
        }
    }

    // Render each employee
    employeesToRender.forEach((employee) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.id.slice(0, 8)}</td>
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td>${employee.email}</td>
            ${
                isEmployeesPage
                    ? `<td>${formatDate(employee.hireDate)}</td>`
                    : ""
            }
            <td>
                <div class="flex gap-2 flex-wrap">
                    <button class="btn btn-square btn-sm btn-ghost hover:text-primary" data-id="${
                        employee.id
                    }" onclick="viewEmployeeDetails('${employee.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button class="btn btn-square btn-sm btn-ghost hover:text-info" data-id="${
                        employee.id
                    }" onclick="editEmployee('${employee.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button class="btn btn-square btn-sm btn-ghost hover:text-error" data-id="${
                        employee.id
                    }" onclick="openDeleteModal('${employee.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        `;
        employeeList.appendChild(row);
    });
}

// Filter employees based on search and department
function filterEmployees() {
    // Reset to first page when filtering (for employees.html)
    currentPage = 1;
    renderEmployeeList();
}

// Format date in a readable format
function formatDate(dateString) {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// Export employees to CSV
function exportEmployeesToCSV() {
    // Get filtered employees
    const filteredEmployees = getFilteredEmployees();

    if (filteredEmployees.length === 0) {
        showNotification("No employees to export", "error");
        return;
    }

    // Define CSV headers
    const headers = [
        "ID",
        "Name",
        "Position",
        "Department",
        "Email",
        "Phone",
        "Hire Date",
    ];

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    // Add each employee as a row
    filteredEmployees.forEach((employee) => {
        const row = [
            employee.id,
            `"${employee.name}"`, // Wrap in quotes to handle names with commas
            `"${employee.position}"`,
            employee.department,
            employee.email,
            employee.phone,
            employee.hireDate,
        ];

        csvContent += row.join(",") + "\n";
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Set up the link
    link.setAttribute("href", url);
    link.setAttribute(
        "download",
        `employees_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    // Add to document, click to download, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("Employees exported to CSV successfully", "success");
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

// Update dashboard statistics
function updateDashboardStats() {
    const totalEmployeesEl = document.getElementById("totalEmployees");
    const totalDepartmentsEl = document.getElementById("totalDepartments");
    const recentAdditionsEl = document.getElementById("recentAdditions");

    if (!totalEmployeesEl && !totalDepartmentsEl && !recentAdditionsEl) {
        // Not on dashboard page
        return;
    }

    // Update total employees count
    if (totalEmployeesEl) {
        totalEmployeesEl.textContent = employees.length;
    }

    // Calculate unique departments
    if (totalDepartmentsEl) {
        const departments = new Set(employees.map((emp) => emp.department));
        totalDepartmentsEl.textContent = departments.size;
    }

    // Calculate recent additions (last 30 days)
    if (recentAdditionsEl) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentCount = employees.filter((emp) => {
            const createdDate = new Date(emp.createdAt);
            return createdDate >= thirtyDaysAgo;
        }).length;

        recentAdditionsEl.textContent = recentCount;
    }
}

// Navigate to employee details page
function viewEmployeeDetails(id) {
    if (!id) return;

    // Check which page we're on (dashboard or employees)
    const isDashboardPage = window.location.pathname.includes("dashboard.html");

    // Navigate to employee detail page with the employee ID as a query parameter
    window.location.href = `./employeeDetail.html?id=${id}`;
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Generate UUID for initial employee data
function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

// Make functions available globally
window.editEmployee = editEmployee;
window.openDeleteModal = openDeleteModal;
window.viewEmployeeDetails = viewEmployeeDetails;
