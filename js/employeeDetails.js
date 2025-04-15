/* Employee details functionality */

// Global variables
let currentEmployee = null;
let employeeNotes = [];
let currentNoteId = null;

document.addEventListener("DOMContentLoaded", function () {
    // Get employee ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get("id");

    if (!employeeId) {
        showEmployeeNotFound();
        return;
    }

    // Load employee details
    loadEmployeeDetails(employeeId);

    // Initialize UI elements
    const editEmployeeBtn = document.getElementById("editEmployeeBtn");
    const deleteEmployeeBtn = document.getElementById("deleteEmployeeBtn");
    const addNoteBtn = document.getElementById("addNoteBtn");
    const noteForm = document.getElementById("noteForm");
    const cancelNoteBtn = document.getElementById("cancelNoteBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const confirmDeleteNoteBtn = document.getElementById(
        "confirmDeleteNoteBtn"
    );
    const cancelDeleteNoteBtn = document.getElementById("cancelDeleteNoteBtn");

    // Add event listeners
    if (editEmployeeBtn) {
        editEmployeeBtn.addEventListener("click", navigateToEditEmployee);
    }

    if (deleteEmployeeBtn) {
        deleteEmployeeBtn.addEventListener("click", openDeleteModal);
    }

    if (addNoteBtn) {
        addNoteBtn.addEventListener("click", openAddNoteModal);
    }

    if (noteForm) {
        noteForm.addEventListener("submit", saveNote);
    }

    if (cancelNoteBtn) {
        cancelNoteBtn.addEventListener("click", closeNoteModal);
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", deleteEmployee);
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    }

    if (confirmDeleteNoteBtn) {
        confirmDeleteNoteBtn.addEventListener("click", deleteNote);
    }

    if (cancelDeleteNoteBtn) {
        cancelDeleteNoteBtn.addEventListener("click", closeDeleteNoteModal);
    }
});

// Load employee details from localStorage
function loadEmployeeDetails(employeeId) {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    currentEmployee = employees.find((emp) => emp.id === employeeId);

    if (!currentEmployee) {
        showEmployeeNotFound();
        return;
    }

    // Load employee notes
    loadEmployeeNotes(employeeId);

    // Fill in employee details
    displayEmployeeDetails();
}

// Load notes for an employee
function loadEmployeeNotes(employeeId) {
    const allNotes = JSON.parse(localStorage.getItem("employeeNotes")) || {};
    employeeNotes = allNotes[employeeId] || [];

    renderNotes();
}

// Show employee not found message
function showEmployeeNotFound() {
    document.getElementById("employeeDetails").classList.add("hidden");
    document
        .getElementById("employeeNotFoundMessage")
        .classList.remove("hidden");
    document.querySelector(".card").classList.add("hidden");

    // Hide action buttons
    document.getElementById("editEmployeeBtn").classList.add("hidden");
    document.getElementById("deleteEmployeeBtn").classList.add("hidden");
}

// Display employee details on the page
function displayEmployeeDetails() {
    // Set page title and header
    document.title = `${currentEmployee.name} - Employee Management System`;

    // Set general details
    document.getElementById("employeeName").textContent = currentEmployee.name;
    document.getElementById("employeeNameCard").textContent =
        currentEmployee.name;
    document.getElementById("employeePosition").textContent =
        currentEmployee.position;
    document.getElementById("employeeDepartment").textContent =
        currentEmployee.department;
    document.getElementById("employeeEmail").textContent =
        currentEmployee.email;
    document.getElementById("employeePhone").textContent =
        currentEmployee.phone;
    document.getElementById("employeeId").textContent = currentEmployee.id;
    document.getElementById("employeeHireDate").textContent = formatDate(
        currentEmployee.hireDate
    );
    document.getElementById("employeeUpdated").textContent = formatDate(
        currentEmployee.updatedAt
    );

    // Calculate employment duration
    document.getElementById("employeeDuration").textContent =
        calculateEmploymentDuration(currentEmployee.hireDate);

    // Set employee initials for avatar
    const nameParts = currentEmployee.name.split(" ");
    let initials = "";
    if (nameParts.length >= 2) {
        initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
    } else if (nameParts.length === 1) {
        initials = nameParts[0].charAt(0);
    }
    document.getElementById("employeeInitials").textContent =
        initials.toUpperCase();
}

// Format date in a readable format
function formatDate(dateString) {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Calculate employment duration
function calculateEmploymentDuration(hireDateString) {
    if (!hireDateString) return "Unknown";

    const hireDate = new Date(hireDateString);
    if (isNaN(hireDate.getTime())) return "Unknown"; // Invalid date

    const today = new Date();
    const diffTime = Math.abs(today - hireDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years === 0 && months === 0) {
        return "Less than a month";
    } else if (years === 0) {
        return `${months} month${months !== 1 ? "s" : ""}`;
    } else if (months === 0) {
        return `${years} year${years !== 1 ? "s" : ""}`;
    } else {
        return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
            months !== 1 ? "s" : ""
        }`;
    }
}

// Navigate to edit employee page
function navigateToEditEmployee() {
    if (!currentEmployee) return;

    // Open the employee form modal from dashboard with employee ID
    window.location.href = `./dashboard.html?edit=${currentEmployee.id}`;
}

// Open the delete confirmation modal
function openDeleteModal() {
    const modal = document.getElementById("deleteModal");
    if (modal) {
        modal.showModal();
    }
}

// Close the delete confirmation modal
function closeDeleteModal() {
    const modal = document.getElementById("deleteModal");
    if (modal) {
        modal.close();
    }
}

// Delete the current employee
function deleteEmployee() {
    if (!currentEmployee) return;

    // Get all employees
    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    // Filter out the current employee
    employees = employees.filter((emp) => emp.id !== currentEmployee.id);

    // Save to localStorage
    localStorage.setItem("employees", JSON.stringify(employees));

    // Delete employee notes
    deleteEmployeeNotes(currentEmployee.id);

    // Show notification
    showNotification(
        `${currentEmployee.name} was successfully deleted.`,
        "success"
    );

    // Redirect to dashboard
    window.location.href = "./dashboard.html";
}

// Delete all notes for an employee
function deleteEmployeeNotes(employeeId) {
    const allNotes = JSON.parse(localStorage.getItem("employeeNotes")) || {};

    // Remove notes for this employee
    delete allNotes[employeeId];

    // Save back to localStorage
    localStorage.setItem("employeeNotes", JSON.stringify(allNotes));
}

// Render notes for the current employee
function renderNotes() {
    const notesContainer = document.getElementById("notesContainer");
    const noNotesMessage = document.getElementById("noNotesMessage");

    if (!notesContainer) return;

    // Clear previous notes except the no notes message
    Array.from(notesContainer.children).forEach((child) => {
        if (child.id !== "noNotesMessage") {
            notesContainer.removeChild(child);
        }
    });

    // Show/hide no notes message
    if (employeeNotes.length === 0) {
        noNotesMessage.classList.remove("hidden");
        return;
    } else {
        noNotesMessage.classList.add("hidden");
    }

    // Sort notes by date (newest first)
    employeeNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Add each note to the container
    employeeNotes.forEach((note) => {
        const noteElement = document.createElement("div");
        noteElement.className = "card bg-base-200 shadow-sm";

        const formattedDate = formatDate(note.createdAt);
        const shortTime = new Date(note.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });

        noteElement.innerHTML = `
            <div class="card-body p-4">
                <div class="flex justify-between items-start">
                    <div class="whitespace-pre-wrap">${note.content}</div>
                    <div class="flex gap-2 ml-4">
                        <button class="btn btn-sm btn-ghost" onclick="editNote('${note.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-ghost text-error" onclick="openDeleteNoteModal('${note.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="text-sm opacity-70 mt-2">${formattedDate} at ${shortTime}</div>
            </div>
        `;

        notesContainer.appendChild(noteElement);
    });
}

// Open modal to add a new note
function openAddNoteModal() {
    const modal = document.getElementById("noteModal");
    const modalTitle = document.getElementById("noteModalTitle");

    // Reset form
    document.getElementById("noteForm").reset();
    document.getElementById("noteId").value = "";
    currentNoteId = null;

    // Set title
    if (modalTitle) {
        modalTitle.textContent = "Add Note";
    }

    // Open modal
    if (modal) {
        modal.showModal();
    }
}

// Close the note modal
function closeNoteModal() {
    const modal = document.getElementById("noteModal");
    if (modal) {
        modal.close();
    }
}

// Save a note (create or update)
function saveNote(e) {
    e.preventDefault();

    if (!currentEmployee) return;

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loader mr-2"></span> Saving...';
    submitBtn.disabled = true;

    const id = document.getElementById("noteId").value || generateId();
    const content = document.getElementById("noteContent").value;

    const note = {
        id,
        content,
        employeeId: currentEmployee.id,
        updatedAt: new Date().toISOString(),
    };

    // Simulate a slight delay for demo purposes
    setTimeout(() => {
        // Get all notes from localStorage
        const allNotes =
            JSON.parse(localStorage.getItem("employeeNotes")) || {};

        // Initialize employee notes array if it doesn't exist
        if (!allNotes[currentEmployee.id]) {
            allNotes[currentEmployee.id] = [];
        }

        // Check if we're updating or creating
        if (currentNoteId) {
            // Update existing note
            const index = employeeNotes.findIndex(
                (note) => note.id === currentNoteId
            );
            if (index !== -1) {
                employeeNotes[index] = { ...employeeNotes[index], ...note };
                allNotes[currentEmployee.id] = employeeNotes;
                showNotification("Note was successfully updated.", "success");
            }
        } else {
            // Add created date for new notes
            note.createdAt = new Date().toISOString();
            employeeNotes.push(note);
            allNotes[currentEmployee.id] = employeeNotes;
            showNotification("Note was successfully added.", "success");
        }

        // Save to localStorage
        localStorage.setItem("employeeNotes", JSON.stringify(allNotes));

        // Close modal and refresh list
        closeNoteModal();
        renderNotes();

        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }, 600); // Slight delay for UX
}

// Edit a note
function editNote(id) {
    const note = employeeNotes.find((note) => note.id === id);
    if (!note) return;

    currentNoteId = id;

    // Fill form with note data
    document.getElementById("noteId").value = note.id;
    document.getElementById("noteContent").value = note.content;

    // Change modal title
    const modalTitle = document.getElementById("noteModalTitle");
    if (modalTitle) {
        modalTitle.textContent = "Edit Note";
    }

    // Open modal
    const modal = document.getElementById("noteModal");
    if (modal) {
        modal.showModal();
    }
}

// Open delete note confirmation modal
function openDeleteNoteModal(id) {
    currentNoteId = id;

    const modal = document.getElementById("deleteNoteModal");
    if (modal) {
        modal.showModal();
    }
}

// Close delete note confirmation modal
function closeDeleteNoteModal() {
    const modal = document.getElementById("deleteNoteModal");
    if (modal) {
        modal.close();
    }
}

// Delete a note
function deleteNote() {
    if (!currentNoteId || !currentEmployee) return;

    // Get all notes
    const allNotes = JSON.parse(localStorage.getItem("employeeNotes")) || {};

    // Filter out the note with the given id
    employeeNotes = employeeNotes.filter((note) => note.id !== currentNoteId);

    // Update employee notes
    allNotes[currentEmployee.id] = employeeNotes;

    // Save to localStorage
    localStorage.setItem("employeeNotes", JSON.stringify(allNotes));

    // Close modal and refresh list
    closeDeleteNoteModal();
    renderNotes();

    // Show notification
    showNotification("Note was successfully deleted.", "success");

    currentNoteId = null;
}

// Generate a unique ID
function generateId() {
    return (
        "note_" + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
}

// Make functions available globally
window.editNote = editNote;
window.openDeleteNoteModal = openDeleteNoteModal;
