// Function to show notifications
function showNotification(message, type = "info") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    if (toast && toastMessage) {
        // Remove any existing classes
        toast.classList.remove("success", "error", "show");

        // Set the message
        toastMessage.textContent = message;

        // Add appropriate class based on type
        if (type === "success" || type === "error") {
            toast.classList.add(type);
        }

        // Show the toast
        toast.classList.add("show");

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalEmployeesElement = document.getElementById("totalEmployees");
    const totalDepartmentsElement = document.getElementById("totalDepartments");
    const recentAdditionsElement = document.getElementById("recentAdditions");

    if (totalEmployeesElement) {
        totalEmployeesElement.textContent = employees.length;
    }

    if (totalDepartmentsElement) {
        // Get unique departments
        const departments = [
            ...new Set(employees.map((emp) => emp.department)),
        ];
        totalDepartmentsElement.textContent = departments.length;
    }

    if (recentAdditionsElement) {
        // Calculate employees added in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentEmployees = employees.filter((emp) => {
            const createdDate = new Date(emp.createdAt);
            return createdDate >= thirtyDaysAgo;
        });

        recentAdditionsElement.textContent = recentEmployees.length;
    }
}
