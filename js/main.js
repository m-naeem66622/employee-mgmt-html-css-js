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

// List of available themes
const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
];

// Apply the selected theme
function applyTheme(theme) {
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

// Handle theme switching
function setupThemeToggle() {
    const toggleThemeBtn = document.getElementById("toggleTheme");
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener("click", () => {
            const themeModal = document.getElementById("themeModal");
            if (themeModal) {
                themeModal.classList.remove("hidden");
                if (!themeModal.hasAttribute("data-initialized")) {
                    generateThemeButtons();
                    themeModal.setAttribute("data-initialized", "true");
                }
            }
        });
    }

    // Close modal when clicking outside or on close button
    document.addEventListener("click", (e) => {
        const themeModal = document.getElementById("themeModal");
        if (
            themeModal &&
            (e.target === themeModal ||
                e.target.classList.contains("close-modal"))
        ) {
            themeModal.classList.add("hidden");
        }
    });
}

// Generate theme buttons dynamically
function generateThemeButtons() {
    const container = document.querySelector("#themeModal .theme-grid");
    if (!container) return;

    // Clear existing content
    container.innerHTML = "";

    // Generate a button for each theme
    themes.forEach((theme) => {
        const currentTheme = document
            .querySelector("html")
            .getAttribute("data-theme");
        const isActive = theme === currentTheme;

        const btn = document.createElement("div");
        btn.className = `theme-btn cursor-pointer rounded-lg border hover:shadow-lg transition-all ${
            isActive ? "ring-2 ring-primary" : ""
        }`;
        btn.setAttribute("data-theme", theme);

        // Set the button's inner HTML to show theme preview
        btn.innerHTML = `
            <div class="bg-base-100 text-base-content rounded-t-lg px-4 py-3">
                <div class="font-bold">${
                    theme.charAt(0).toUpperCase() + theme.slice(1)
                }</div>
            </div>
            <div class="flex gap-1 p-2">
                <div class="bg-primary w-5 h-5 rounded"></div>
                <div class="bg-secondary w-5 h-5 rounded"></div>
                <div class="bg-accent w-5 h-5 rounded"></div>
                <div class="bg-neutral w-5 h-5 rounded"></div>
            </div>
        `;

        // Add event listener to apply the theme
        btn.addEventListener("click", () => {
            applyTheme(theme);
            document.getElementById("themeModal").classList.add("hidden");
            // Highlight the selected theme
            document.querySelectorAll(".theme-btn").forEach((b) => {
                b.classList.remove("ring-2", "ring-primary");
            });
            btn.classList.add("ring-2", "ring-primary");
        });

        container.appendChild(btn);
    });
}

// Create theme modal dynamically if it doesn't exist
function createThemeModal() {
    if (document.getElementById("themeModal")) return;

    const modal = document.createElement("div");
    modal.id = "themeModal";
    modal.className =
        "fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 hidden flex items-center justify-center p-4";
    modal.innerHTML = `
        <div class="bg-base-100 rounded-lg shadow-xl p-6 max-w-5xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Select Theme</h3>
                <button class="btn btn-sm btn-circle close-modal">✕</button>
            </div>
            <div class="mb-4">
                <input type="text" id="themeSearch" placeholder="Search themes..." 
                       class="input input-bordered w-full max-w-xs" />
            </div>
            <div class="flex mb-4 gap-2 flex-wrap theme-category-tabs">
                <button class="btn btn-sm btn-active theme-category-btn" data-category="all">All</button>
                <button class="btn btn-sm theme-category-btn" data-category="light">Light</button>
                <button class="btn btn-sm theme-category-btn" data-category="dark">Dark</button>
                <button class="btn btn-sm theme-category-btn" data-category="colorful">Colorful</button>
                <button class="btn btn-sm theme-category-btn" data-category="corporate">Corporate</button>
                <button class="btn btn-sm theme-category-btn" data-category="retro">Retro</button>
            </div>
            <div class="theme-grid grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"></div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add search functionality
    const searchInput = document.getElementById("themeSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            filterThemes();
        });
    }

    // Add category filtering
    const categoryBtns = document.querySelectorAll(".theme-category-btn");
    categoryBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            categoryBtns.forEach((b) => b.classList.remove("btn-active"));
            this.classList.add("btn-active");
            filterThemes();
        });
    });
}

// Load saved theme preference
function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.querySelector("html").setAttribute("data-theme", savedTheme);
    } else {
        // Default theme if none is saved
        document.querySelector("html").setAttribute("data-theme", "abyss");
    }
}

// Initialize the application
function init() {
    checkAuth();
    loadTheme();
    createThemeModal();
    setupThemeToggle();
}

// Filter themes based on search input and selected category
function filterThemes() {
    const searchTerm =
        document.getElementById("themeSearch")?.value.toLowerCase() || "";
    const selectedCategory =
        document
            .querySelector(".theme-category-btn.btn-active")
            ?.getAttribute("data-category") || "all";

    // Theme categorization
    const themeCategories = {
        light: [
            "light",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "cmyk",
            "autumn",
            "business",
            "acid",
            "lemonade",
            "winter",
        ],
        dark: [
            "dark",
            "synthwave",
            "halloween",
            "forest",
            "black",
            "luxury",
            "dracula",
            "night",
            "coffee",
            "dim",
            "nord",
            "sunset",
        ],
        colorful: [
            "cupcake",
            "bumblebee",
            "emerald",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "aqua",
            "pastel",
            "fantasy",
            "cmyk",
            "autumn",
            "acid",
            "lemonade",
            "sunset",
        ],
        corporate: ["light", "corporate", "business", "winter", "dim", "nord"],
        retro: ["retro", "cyberpunk", "valentine", "lofi", "dracula", "coffee"],
    };

    document.querySelectorAll(".theme-btn").forEach((btn) => {
        const themeName = btn.getAttribute("data-theme");
        const matchesSearch = themeName.toLowerCase().includes(searchTerm);
        const matchesCategory =
            selectedCategory === "all" ||
            themeCategories[selectedCategory]?.includes(themeName);

        if (matchesSearch && matchesCategory) {
            btn.classList.remove("hidden");
        } else {
            btn.classList.add("hidden");
        }
    });
}

// Run initialization when DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
