// Utility for menu/modal open/close, similar to handlePreviewToggle

function handleMenuToggle(openBtn, menu, closeSelector = '.close-btn', activeClass = 'active', overlay = null) {
    const closeBtn = menu.querySelector(closeSelector);

    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllMenus(activeClass);
        menu.classList.add(activeClass);
        if (overlay) overlay.classList.add('active');
        document.body.classList.add('modal-available');
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            menu.classList.remove(activeClass);
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('modal-available');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            menu.classList.remove(activeClass);
            overlay.classList.remove('active');
            document.body.classList.remove('modal-available');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            menu.classList.remove(activeClass);
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('modal-available');
        }
    });
}

function hideAllMenus(activeClass = 'active') {
    document.querySelectorAll('.search-modal, .sidebar').forEach(menu => {
        menu.classList.remove(activeClass);
    });
    document.body.classList.remove('modal-available');
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
}

// Wire up search modal using the utility

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const searchModal = document.querySelector('.search-modal');
    const searchToggle = document.querySelector('.search-toggle');
    if (searchModal && searchToggle) {
        handleMenuToggle(searchToggle, searchModal, 'button[aria-label="Close"]', 'active', overlay);
    }
    // To wire up sidebar, uncomment and adjust:
    // const sidebar = document.querySelector('.sidebar');
    // const sidenavToggle = document.querySelector('.sidenav-toggle-button');
    // if (sidebar && sidenavToggle) {
    //     handleMenuToggle(sidenavToggle, sidebar, '.close-btn', 'open', overlay);
    // }
});

// --- Theme manager (light/dark) ---
const ThemeManager = (() => {
    const KEY = 'theme'; // stored values: 'light'|'dark'
    function get() {
        return localStorage.getItem(KEY) || null;
    }
    function apply(theme) {
        if (!theme) return;
        // apply to root as used by CSS: data-bs-theme
        document.documentElement.setAttribute('data-bs-theme', theme);
        // swap icons inside .mode-btn (expects two svgs inside)
        const modeBtn = document.querySelector('.mode-btn');
        if (modeBtn) {
            modeBtn.querySelectorAll('svg').forEach(svg => svg.style.display = 'none');
            if (theme === 'dark') {
                const darkIcon = modeBtn.querySelector('.dark-mode-icon');
                if (darkIcon) darkIcon.style.display = '';
            } else {
                const lightIcon = modeBtn.querySelector('.light-mode-icon');
                if (lightIcon) lightIcon.style.display = '';
            }
        }
    }
    function set(theme) {
        localStorage.setItem(KEY, theme);
        apply(theme);
    }
    function toggle() {
        const current = document.documentElement.getAttribute('data-bs-theme') || get() || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        set(next);
    }
    function init() {
        const stored = get();
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = stored || (prefersDark ? 'dark' : 'light');
        apply(theme);
        // wire button
        const modeBtn = document.querySelector('.mode-btn');
        if (modeBtn) {
            modeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggle();
            });
        }
    }
    return { init, set, get, toggle };
})();

// initialize theme on load
document.addEventListener('DOMContentLoaded', () => ThemeManager.init());

// Handle dropdowns with outside click detection and single active dropdown
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    // Close all dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.classList.remove("active");
        });
    }

    // Handle outside clicks
    document.addEventListener("click", (e) => {
        const isDropdownClick = e.target.closest('.dropdown');
        if (!isDropdownClick) {
            closeAllDropdowns();
        }
    });

    // Setup each dropdown
    dropdownToggles.forEach(toggle => {
        const dropdownMenu = toggle.nextElementSibling;

        toggle.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent document click from immediately closing

            const isActive = dropdownMenu.classList.contains("active");

            // Close all dropdowns first
            closeAllDropdowns();

            // Toggle this dropdown if it wasn't active
            if (!isActive) {
                dropdownMenu.classList.add("active");
            }
        });
    });

    // Add Escape key support
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllDropdowns();
        }
    });
}

// Initialize dropdowns when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initializeDropdowns();

    // Language menu selection logic
    const languageMenu = document.querySelector('.language-menu');
    const languageItems = languageMenu ? languageMenu.querySelectorAll('.language-item') : [];
    const selectedLanguageImg = document.querySelector('.selected-language img');

    languageItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            // Remove active from all
            languageItems.forEach(i => i.classList.remove('active'));
            // Add active to clicked
            item.classList.add('active');
            // Update trigger image
            if (selectedLanguageImg) {
                const img = item.querySelector('img');
                if (img) {
                    selectedLanguageImg.src = img.src;
                    selectedLanguageImg.alt = img.alt;
                }
            }
            // Close dropdown
            const menu = item.closest('.dropdown-menu');
            if (menu) menu.classList.remove('active');
        });
    });
});