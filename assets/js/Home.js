// Home page interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Add hover effects to framework step cards
    const stepCards = document.querySelectorAll('.framework-step-card');
    stepCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
    });
    
    // Add hover effects to decision tool cards
    const toolCards = document.querySelectorAll('.decision-tool-card');
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe framework step cards for animation
    stepCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe decision tool cards for animation
    toolCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add interactive elements for better UX
    const buttons = document.querySelectorAll('.button1');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Progressive enhancement for modern browsers
    if ('IntersectionObserver' in window) {
        // Lazy load background images if needed
        const backgroundImages = document.querySelectorAll('[style*="background-image"]');
        backgroundImages.forEach(element => {
            const style = element.getAttribute('style');
            if (style && style.includes('background-image')) {
                element.style.backgroundAttachment = 'fixed';
            }
        });
    }
    
    // Analytics tracking for key interactions
    function trackInteraction(action, section) {
        // This would integrate with your analytics platform
        console.log(`User interaction: ${action} in ${section}`);
    }
    
    // Track framework step interactions
    stepCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            trackInteraction('framework_step_click', `step_${index + 1}`);
        });
    });
    
    // Track decision tool interactions
    toolCards.forEach((card, index) => {
        const toolNames = ['complex_scenarios', 'legal_pathways', 'risk_mitigation'];
        card.addEventListener('click', function() {
            trackInteraction('decision_tool_click', toolNames[index]);
        });
    });
    
    // Add responsive navigation helper
    function updateLayoutForScreenSize() {
        const screenWidth = window.innerWidth;
        const stepCards = document.querySelectorAll('.framework-step-card');
        
        if (screenWidth < 768) {
            // Mobile optimizations
            stepCards.forEach(card => {
                card.style.marginBottom = '1.5rem';
            });
        }
    }
    
    // Initial layout check
    updateLayoutForScreenSize();
    
    // Update on resize
    window.addEventListener('resize', updateLayoutForScreenSize);
    
    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '3px solid #007bff';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Performance optimization: debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Handle scroll-based interactions here if needed
        }, 10);
    });
    
    console.log('SynD-DGF Home page interactive functionality loaded');
});