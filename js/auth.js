/* Authentication related functionality */

document.addEventListener("DOMContentLoaded", function () {
    // Login Form Handler
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    // Register Form Handler
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    // Logout Button Handlers
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }

    const sidebarLogout = document.getElementById("sidebarLogout");
    if (sidebarLogout) {
        sidebarLogout.addEventListener("click", handleLogout);
    }

    // Update user profile name if available
    updateUserProfile();
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorEl = document.getElementById("loginError");

    // Basic validation
    if (!email || !password) {
        showError(errorEl, "Please enter both email and password");
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching credentials
    const user = users.find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        showError(errorEl, "Invalid email or password");
        return;
    }

    // Store current user in localStorage (without password)
    const currentUser = {
        id: user.id,
        name: user.fullName,
        email: user.email,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Redirect to dashboard
    window.location.href = "./dashboard.html";
}

// Handle register form submission
function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorEl = document.getElementById("registerError");

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
        showError(errorEl, "Please fill in all fields");
        return;
    }

    if (password !== confirmPassword) {
        showError(errorEl, "Passwords do not match");
        return;
    }

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    if (users.some((user) => user.email === email)) {
        showError(errorEl, "User with this email already exists");
        return;
    }

    // Create new user
    const newUser = {
        id: generateId(),
        fullName,
        email,
        password, // In a real app, we would hash this password
        createdAt: new Date().toISOString(),
    };

    // Add to users array and save to localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Create current user (without password)
    const currentUser = {
        id: newUser.id,
        name: newUser.fullName,
        email: newUser.email,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Redirect to dashboard
    window.location.href = "./dashboard.html";
}

// Handle logout
function handleLogout() {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
}

// Show error message
function showError(element, message) {
    element.textContent = message;
    element.classList.remove("hidden");

    // Hide after 3 seconds
    setTimeout(() => {
        element.classList.add("hidden");
    }, 3000);
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Update user profile information
function updateUserProfile() {
    const userProfileElement = document.getElementById("userProfileName");

    if (userProfileElement) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (currentUser) {
            userProfileElement.textContent = currentUser.name;
        }
    }
}
