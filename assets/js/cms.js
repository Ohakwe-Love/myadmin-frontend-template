
// --- CMS table row editing (enableEdit / saveEdit / cancelEdit) ---
// Provides the same UX as admin-cms-dashboard.html: toggles .editing on rows,
// swaps between .view-mode and .edit-mode, and supports keyboard actions.

function enableEdit(button) {
    const row = button.closest('tr');
    if (!row) return;
    row.classList.add('editing');

    // Focus first editable control
    const firstInput = row.querySelector('.edit-input, .edit-textarea');
    if (firstInput) firstInput.focus();
}

function saveEdit(button) {
    const row = button.closest('tr');
    if (!row) return;

    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
        const input = cell.querySelector('.edit-input');
        const textarea = cell.querySelector('.edit-textarea');
        const viewMode = cell.querySelector('.view-mode');

        if (input && viewMode) viewMode.textContent = input.value;
        if (textarea && viewMode) viewMode.textContent = textarea.value;
    });

    row.classList.remove('editing');

    // TODO: wire an AJAX/save call here if required
    const rowId = row.getAttribute('data-id');
    // console.log('Saving data for row:', rowId);
    showNotification('Changes saved successfully!');
}

function cancelEdit(button) {
    const row = button.closest('tr');
    if (!row) return;

    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
        const input = cell.querySelector('.edit-input');
        const textarea = cell.querySelector('.edit-textarea');
        const viewMode = cell.querySelector('.view-mode');

        if (input && viewMode) input.value = viewMode.textContent;
        if (textarea && viewMode) textarea.value = viewMode.textContent;
    });

    row.classList.remove('editing');
}

function showNotification(message, timeout = 2000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #34d399;
        color: white;
        padding: 12px 18px;
        border-radius: 8px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        z-index: 1200;
        transition: transform 0.25s ease, opacity 0.25s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-8px)';
        setTimeout(() => notification.remove(), 300);
    }, timeout);
}

// Delegated click handlers so buttons without inline onclick work as well
document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
        e.preventDefault();
        enableEdit(editBtn);
        return;
    }

    const saveBtn = e.target.closest('.save-btn');
    if (saveBtn) {
        e.preventDefault();
        saveEdit(saveBtn);
        return;
    }

    const cancelBtn = e.target.closest('.cancel-btn');
    if (cancelBtn) {
        e.preventDefault();
        cancelEdit(cancelBtn);
        return;
    }
});

// Keyboard shortcuts for active editing row: Esc to cancel, Ctrl/Cmd+Enter to save
document.addEventListener('keydown', (e) => {
    const editingRow = document.querySelector('tr.editing');
    if (!editingRow) return;

    if (e.key === 'Escape') {
        const cancelBtn = editingRow.querySelector('.cancel-btn');
        if (cancelBtn) cancelEdit(cancelBtn);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const saveBtn = editingRow.querySelector('.save-btn');
        if (saveBtn) saveEdit(saveBtn);
    }
});

// toggle form 
const addSkillFormToggle = document.querySelector(".addSkillFormToggle");
const addSkillFormWrapper = document.querySelector(".addSkillFormWrapper");

function toggleForm() {
    if (!addSkillFormWrapper || !addSkillFormToggle) return;

    const isCollapsed = addSkillFormWrapper.classList.toggle("collapsed");

    if (isCollapsed) {
        // If the form is now collapsed
        addSkillFormToggle.classList.remove("cancel");
        addSkillFormToggle.textContent = "Add Skill +";
    } else {
        // If the form is expanded
        addSkillFormToggle.classList.add("cancel");
        addSkillFormToggle.textContent = "Cancel";
    }
}

addSkillFormToggle.addEventListener("click", toggleForm);

// // Select elements
// const addSkillForm = document.querySelector(".addSkillForm");
// const addSkillTitleInput = document.getElementById("skill-title");
// const addSkillDescInput = document.getElementById("skill-description");
// const addSkillIconInput = document.getElementById("skill-icon");
// const addSkillIconGroup = document.querySelector(".skill-icon-input-group");
// const submitSkillBtn = addSkillForm.querySelector(".submit-btn");

// // Utility: set error/success class
// function setValidationState(element, isValid) {
//     element.classList.remove("error", "success");
//     element.classList.add(isValid ? "success" : "error");
// }

// // Validation logic
// function validateForm() {
//     const titleValid = addSkillTitleInput.value.trim().length > 0;
//     const descLength = addSkillDescInput.value.trim().length;
//     const descValid = descLength >= 10 && descLength <= 200;
//     const iconValid = addSkillIconInput.files.length > 0; // true if file selected

//     // Set input states
//     setValidationState(addSkillTitleInput, titleValid);
//     setValidationState(addSkillDescInput, descValid);
//     setValidationState(addSkillIconGroup, iconValid);

//     // Enable/disable submit button
//     if (titleValid && descValid && iconValid) {
//         submitSkillBtn.classList.remove("disabled");
//         submitSkillBtn.disabled = false;
//     } else {
//         submitSkillBtn.classList.add("disabled");
//         submitSkillBtn.disabled = true;
//     }
// }

// // Real-time validation
// [addSkillTitleInput, addSkillDescInput, addSkillIconInput].forEach((input) => {
//     input.addEventListener("input", validateForm);
//     input.addEventListener("change", validateForm);
// });

// // Final check before submit
// addSkillForm.addEventListener("submit", (e) => {
//     validateForm();
//     if (submitSkillBtn.disabled) {
//         e.preventDefault();
//         alert("Please fill out all required fields correctly.");
//     }
// });


// importing form validation
import { setupFormValidation } from './formValidation.js';

setupFormValidation('.addSkillForm', {
    'skill-title': (input) => input.value.trim().length > 0,
    'skill-description': (input) => {
        const len = input.value.trim().length;
        return len >= 100 && len <= 200;
    },
    'skill-icon': (input) => input.files.length > 0
});