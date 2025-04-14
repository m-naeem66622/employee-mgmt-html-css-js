/* Main JavaScript file for the application */

// Check if user is logged in on pages that require authentication
function checkAuth() {
    // Skip auth check for login and register pages
    if (
        window.location.pathname.includes("login.html") ||
        window.location.pathname.includes("register.html") ||
        window.location.pathname === "/" ||
        window.location.pathname === "/index.html"
    ) {
        return;
    }

    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        // Check if we're already in the pages directory
        if (window.location.pathname.includes("/pages/")) {
            window.location.href = "./login.html"; // Same directory path
        } else {
            window.location.href = "./pages/login.html"; // From root directory
        }
    }
}

// Handle theme switching
function setupThemeToggle() {
    const toggleThemeBtn = document.getElementById("toggleTheme");
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener("click", () => {
            const html = document.querySelector("html");
            const currentTheme = html.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            html.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}

// Load saved theme preference
function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.querySelector("html").setAttribute("data-theme", savedTheme);
    }
}

// Initialize the application
function init() {
    checkAuth();
    loadTheme();
    setupThemeToggle();
}

// Run initialization when DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
