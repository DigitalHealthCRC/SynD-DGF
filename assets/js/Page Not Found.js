// Custom JavaScript for Page Not Found (404) page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize 404 page functionality
    initialize404Page();
    
    // Add search functionality
    initializeSearch();
    
    // Add click tracking for popular links
    trackPopularLinkClicks();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
});

function initialize404Page() {
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
    
    // Suggest similar pages based on URL
    suggestSimilarPages();
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
    
    // Animate popular links with stagger effect
    const popularLinks = document.querySelectorAll('.popular-link');
    popularLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            link.style.transition = 'all 0.5s ease-out';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 600 + (index * 100));
    });
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchInput && searchButton) {
        // Handle search submission
        const handleSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                // In a real implementation, this would search the site
                // For now, we'll redirect to a search page or show suggestions
                window.location.href = `../search.html?q=${encodeURIComponent(query)}`;
            }
        };
        
        searchButton.addEventListener('click', handleSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
        
        // Auto-suggest functionality
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            if (query.length > 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        });
    }
}

function showSearchSuggestions(query) {
    // Common search terms and their destinations
    const suggestions = [
        { term: 'framework', url: '../framework.html', title: 'Framework Overview' },
        { term: 'assessment', url: '../assessment-tools.html', title: 'Assessment Tools' },
        { term: 'step 1', url: '../framework/step-1-use-case-assessment.html', title: 'Step 1: Use Case Assessment' },
        { term: 'step 2', url: '../framework/step-2-assess-source-data.html', title: 'Step 2: Assess Source Data' },
        { term: 'step 3', url: '../framework/step-3-generate-synthetic-data.html', title: 'Step 3: Generate Synthetic Data' },
        { term: 'step 4', url: '../framework/step-4-assess-reidentification-risks.html', title: 'Step 4: Assess Reidentification Risks' },
        { term: 'step 5', url: '../framework/step-5-manage-residual-risks.html', title: 'Step 5: Manage Residual Risks' },
        { term: 'resources', url: '../resources.html', title: 'Resources' },
        { term: 'about', url: '../about/index.html', title: 'About' },
        { term: 'contact', url: '../about/contact/Contact.html', title: 'Contact Us' }
    ];
    
    const matchingSuggestions = suggestions.filter(s => 
        s.term.toLowerCase().includes(query) || 
        s.title.toLowerCase().includes(query)
    );
    
    if (matchingSuggestions.length > 0) {
        displaySuggestions(matchingSuggestions.slice(0, 5));
    }
}

function displaySuggestions(suggestions) {
    let suggestionsContainer = document.querySelector('.search-suggestions');
    
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #dee2e6;
            border-top: none;
            border-radius: 0 0 5px 5px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
        `;
        
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.style.position = 'relative';
            searchBox.appendChild(suggestionsContainer);
        }
    }
    
    suggestionsContainer.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item" style="padding: 10px; border-bottom: 1px solid #f8f9fa; cursor: pointer;" 
             onclick="window.location.href='${suggestion.url}'">
            <strong>${suggestion.title}</strong>
        </div>
    `).join('');
    
    // Add hover effects
    const suggestionItems = suggestionsContainer.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'white';
        });
    });
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.querySelector('.search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

function trackPopularLinkClicks() {
    // Track clicks on popular links and help links
    const popularLinks = document.querySelectorAll('.popular-link, .help-links a, .error-actions a');
    popularLinks.forEach(link => {
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
        // Focus search box (S key)
        if (e.key === 's' || e.key === 'S') {
            const searchInput = document.querySelector('.search-box input');
            if (searchInput && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        }
        
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

function suggestSimilarPages() {
    // Analyze current URL to suggest similar pages
    const currentPath = window.location.pathname.toLowerCase();
    const suggestions = [];
    
    // URL-based suggestions
    if (currentPath.includes('step')) {
        suggestions.push({
            title: 'Framework Overview',
            url: '../framework.html',
            description: 'Start with the framework overview'
        });
    }
    
    if (currentPath.includes('assessment')) {
        suggestions.push({
            title: 'Assessment Tools',
            url: '../assessment-tools.html',
            description: 'Browse all assessment tools'
        });
    }
    
    if (currentPath.includes('resource')) {
        suggestions.push({
            title: 'Resources',
            url: '../resources.html',
            description: 'Access all framework resources'
        });
    }
    
    // Add default suggestions if no specific matches
    if (suggestions.length === 0) {
        suggestions.push(
            {
                title: 'Framework Overview',
                url: '../framework.html',
                description: 'Learn about the 5-step framework'
            },
            {
                title: 'Assessment Tools',
                url: '../assessment-tools.html',
                description: 'Use our assessment tools'
            }
        );
    }
    
    // Display suggestions if we have any
    if (suggestions.length > 0) {
        displayPageSuggestions(suggestions);
    }
}

function displayPageSuggestions(suggestions) {
    const helpLinks = document.querySelector('.help-links');
    if (helpLinks && suggestions.length > 0) {
        const suggestionsSection = document.createElement('div');
        suggestionsSection.innerHTML = `
            <h4>You might be looking for:</h4>
            <div class="popular-links">
                ${suggestions.map(suggestion => `
                    <a href="${suggestion.url}" class="popular-link">
                        <h5>${suggestion.title}</h5>
                        <p>${suggestion.description}</p>
                    </a>
                `).join('')}
            </div>
        `;
        
        helpLinks.appendChild(suggestionsSection);
    }
}

// Hide search suggestions when clicking outside
document.addEventListener('click', function(e) {
    const searchBox = document.querySelector('.search-box');
    const suggestionsContainer = document.querySelector('.search-suggestions');
    
    if (suggestionsContainer && searchBox && !searchBox.contains(e.target)) {
        hideSearchSuggestions();
    }
});