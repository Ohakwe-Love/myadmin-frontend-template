
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