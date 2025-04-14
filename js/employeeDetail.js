// Function to view employee details
function viewEmployeeDetails(id) {
    if (!id) return;

    // Navigate to employee detail page with the employee ID as a query parameter
    window.location.href = `./pages/employeeDetail.html?id=${id}`;
}

// Make this function globally available
window.viewEmployeeDetails = viewEmployeeDetails;
