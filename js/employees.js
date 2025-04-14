/* Enhanced employee listing functionality */

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

    // Sorting functionality
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

    // Pagination
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

    // Export CSV
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
            // IT Department
            {
                id: generateId(),
                name: "Saad Qadeer",
                position: "Software Engineer",
                department: "IT",
                email: "saad.qadeer@company.com",
                phone: "555-123-4567",
                hireDate: "2023-05-15",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateId(),
                name: "Aysha Shakeel",
                position: "Senior Developer",
                department: "IT",
                email: "aysha.shakeel@company.com",
                phone: "555-222-3333",
                hireDate: "2022-08-10",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateId(),
                name: "Hussnain Raees",
                position: "System Administrator",
                department: "IT",
                email: "hussnain.raees@company.com",
                phone: "555-444-5555",
                hireDate: "2023-01-20",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },

            // HR Department
            {
                id: generateId(),
                name: "Zoha Azam",
                position: "HR Manager",
                department: "HR",
                email: "zoha.azam@company.com",
                phone: "555-234-5678",
                hireDate: "2022-11-03",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateId(),
                name: "Omar Malik",
                position: "Recruitment Specialist",
                department: "HR",
                email: "omar.malik@company.com",
                phone: "555-666-7777",
                hireDate: "2023-09-15",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },

            // Finance Department
            {
                id: generateId(),
                name: "Rafay Hassan",
                position: "Financial Analyst",
                department: "Finance",
                email: "rafay.hassan@company.com",
                phone: "555-345-6789",
                hireDate: "2023-02-28",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateId(),
                name: "Sarab Sohail",
                position: "Accounting Manager",
                department: "Finance",
                email: "sarab.sohail@company.com",
                phone: "555-888-9999",
                hireDate: "2022-07-12",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateId(),
                name: "Hamza Abdullah",
                position: "Budget Analyst",
                department: "Finance",
                email: "hamza.abdullah@company.com",
                phone: "555-111-2222",
                hireDate: "2023-11-05",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },

            // Marketing Department
            {
                id: generateId(),
                name: "Laiba Fayyaz",
                position: "Marketing Specialist",
                department: "Marketing",
                email: "laiba.fayyaz@company.com",
                phone: "555-456-7890",
                hireDate: "2023-08-17",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateId(),
                name: "Tariq Rahman",
                position: "Digital Marketing Manager",
                department: "Marketing",
                email: "tariq.rahman@company.com",
                phone: "555-333-4444",
                hireDate: "2022-10-22",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateId(),
                name: "Layla Hassan",
                position: "Content Creator",
                department: "Marketing",
                email: "layla.hassan@company.com",
                phone: "555-777-8888",
                hireDate: "2023-04-10",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },

            // Operations Department
            {
                id: generateId(),
                name: "Yusuf Mahmood",
                position: "Operations Manager",
                department: "Operations",
                email: "yusuf.mahmood@company.com",
                phone: "555-567-8901",
                hireDate: "2022-06-22",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateId(),
                name: "Noor Fatima",
                position: "Supply Chain Specialist",
                department: "Operations",
                email: "noor.fatima@company.com",
                phone: "555-999-0000",
                hireDate: "2023-07-15",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateId(),
                name: "Ibrahim Ahmad",
                position: "Quality Assurance Analyst",
                department: "Operations",
                email: "ibrahim.ahmad@company.com",
                phone: "555-555-1234",
                hireDate: "2022-12-08",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
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

    // Show message if no employees
    if (filteredEmployees.length === 0) {
        if (noEmployeesMessage) {
            noEmployeesMessage.classList.remove("hidden");
        }

        if (pageInfo) {
            pageInfo.textContent = "Page 0 of 0";
        }

        return;
    } else if (noEmployeesMessage) {
        noEmployeesMessage.classList.add("hidden");
    }

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
    const paginatedEmployees = getPaginatedEmployees(sortedEmployees);

    // Disable/enable pagination buttons
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");

    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage <= 1;
    }

    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    // Render each employee
    paginatedEmployees.forEach((employee) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.id.slice(0, 8)}</td>
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td>${employee.email}</td>
            <td>${formatDate(employee.hireDate)}</td>
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

// Filter employees based on search and department
function filterEmployees() {
    currentPage = 1; // Reset to first page when filtering
    renderEmployeeList();
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

// The rest of the functions (openAddEmployeeModal, closeEmployeeModal, saveEmployee, etc.)
// are the same as in employee.js, so I'm omitting them here for brevity.
// In a real implementation, you might want to refactor these into a shared module.

// For compatibility with the original employee.js
// Function to view employee details
function viewEmployeeDetails(id) {
    if (!id) return;

    // Navigate to employee detail page with the employee ID as a query parameter
    window.location.href = `./employeeDetail.html?id=${id}`;
}

// Make functions available globally
window.viewEmployeeDetails = viewEmployeeDetails;
window.editEmployee = editEmployee;
window.openDeleteModal = openDeleteModal;

// These functions would be implemented the same as in employee.js
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

function closeEmployeeModal() {
    const modal = document.getElementById("employeeModal");
    if (modal) {
        modal.close();
    }
}

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

        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }, 600); // Slight delay for UX
}

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

function openDeleteModal(id) {
    currentEmployeeId = id;

    const modal = document.getElementById("deleteModal");
    if (modal) {
        modal.showModal();
    }
}

function closeDeleteModal() {
    const modal = document.getElementById("deleteModal");
    if (modal) {
        modal.close();
    }
}

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

    currentEmployeeId = null;
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
