// Custom JavaScript for Access Denied page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize error page functionality
    initializeErrorPage();
    
    // Add click tracking for help links
    trackHelpLinkClicks();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
});

function initializeErrorPage() {
    // Add smooth scrolling for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation to error elements
    animateErrorElements();
}

function animateErrorElements() {
    // Animate error code with bounce effect
    const errorCode = document.querySelector('.error-code');
    if (errorCode) {
        errorCode.style.opacity = '0';
        errorCode.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            errorCode.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            errorCode.style.opacity = '1';
            errorCode.style.transform = 'scale(1)';
        }, 200);
    }
}

function trackHelpLinkClicks() {
    // Track clicks on help and navigation links
    const helpLinks = document.querySelectorAll('.help-links a, .error-actions a');
    helpLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Home page shortcut (H key)
        if (e.key === 'h' || e.key === 'H') {
            const homeLink = document.querySelector('a[href*="home"], a[href*="Home"]');
            if (homeLink && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                homeLink.click();
            }
        }
        
        // Framework overview shortcut (F key)
        if (e.key === 'f' || e.key === 'F') {
            const frameworkLink = document.querySelector('a[href*="framework"], a[href*="Framework"]');
            if (frameworkLink && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                frameworkLink.click();
            }
        }
    });
}