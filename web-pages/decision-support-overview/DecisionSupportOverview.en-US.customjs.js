// Decision Support Overview page custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Interactive tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('elevated');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('elevated');
        });
        
        // Click to expand functionality
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.button1')) {
                this.classList.toggle('expanded');
            }
        });
    });

    // Scenario category toggles
    const scenarioCategories = document.querySelectorAll('.scenario-category');
    scenarioCategories.forEach(category => {
        const header = category.querySelector('h3');
        header.addEventListener('click', function() {
            category.classList.toggle('expanded');
            
            // Close other categories
            scenarioCategories.forEach(otherCategory => {
                if (otherCategory !== category) {
                    otherCategory.classList.remove('expanded');
                }
            });
        });
    });

    // Interactive navigation cards
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Start options interaction
    const startOptions = document.querySelectorAll('.start-option');
    startOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Expert area toggles
    const expertAreas = document.querySelectorAll('.expert-area');
    expertAreas.forEach(area => {
        const header = area.querySelector('h3');
        header.addEventListener('click', function() {
            area.classList.toggle('expanded');
        });
    });

    // Add CSS for interactive elements
    const style = document.createElement('style');
    style.textContent = `
        .intro-section {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        
        .support-overview {
            margin-top: 1.5rem;
            padding: 1rem;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #007bff;
        }
        
        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .tool-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .tool-card:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .tool-card.elevated {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .tool-card.expanded {
            transform: scale(1.02);
            z-index: 10;
        }
        
        .tool-header {
            background: #f8f9fa;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .tool-icon {
            font-size: 2.5rem;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border-radius: 50%;
            border: 2px solid #ddd;
        }
        
        .tool-header h3 {
            margin: 0;
            flex: 1;
        }
        
        .tool-content {
            padding: 1.5rem;
        }
        
        .tool-features {
            margin: 1rem 0;
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 6px;
        }
        
        .tool-features h4 {
            margin-bottom: 0.75rem;
            color: #007bff;
        }
        
        .tool-action {
            margin-top: 1.5rem;
            text-align: center;
        }
        
        .scenario-categories {
            margin: 2rem 0;
        }
        
        .scenario-category {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        
        .scenario-category h3 {
            background: #f8f9fa;
            padding: 1rem 1.5rem;
            margin: 0;
            cursor: pointer;
            position: relative;
        }
        
        .scenario-category h3:hover {
            background: #e9ecef;
        }
        
        .scenario-category h3:after {
            content: "▼";
            position: absolute;
            right: 1.5rem;
            transition: transform 0.3s ease;
        }
        
        .scenario-category.expanded h3:after {
            transform: rotate(180deg);
        }
        
        .scenario-examples-list {
            padding: 1.5rem;
            display: none;
        }
        
        .scenario-category.expanded .scenario-examples-list {
            display: block;
        }
        
        .scenario-example {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 6px;
            margin-bottom: 1rem;
        }
        
        .scenario-example h4 {
            color: #007bff;
            margin-bottom: 0.75rem;
        }
        
        .complexity-factors {
            background: white;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
            border-left: 4px solid #ff9800;
        }
        
        .start-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .start-option {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .start-option:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .start-option h3 {
            margin-bottom: 1rem;
            color: #007bff;
        }
        
        .expert-areas {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .expert-area {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .expert-area:hover {
            background: #e9ecef;
        }
        
        .expert-area.expanded {
            background: #e3f2fd;
            border: 1px solid #2196f3;
        }
        
        .expert-area h3 {
            color: #007bff;
            margin-bottom: 1rem;
            position: relative;
        }
        
        .expert-area h3:after {
            content: "▼";
            position: absolute;
            right: 0;
            font-size: 0.8rem;
            transition: transform 0.3s ease;
        }
        
        .expert-area.expanded h3:after {
            transform: rotate(180deg);
        }
        
        .expert-area ul {
            display: none;
        }
        
        .expert-area.expanded ul {
            display: block;
        }
        
        .consultation-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 2rem;
            border-left: 4px solid #f39c12;
        }
        
        .nav-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .nav-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            display: block;
        }
        
        .nav-card:hover {
            text-decoration: none;
            color: inherit;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .nav-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .nav-card h3 {
            margin: 0.5rem 0;
            color: #007bff;
        }
        
        .nav-card p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .tools-grid {
                grid-template-columns: 1fr;
            }
            
            .start-options {
                grid-template-columns: 1fr;
            }
            
            .expert-areas {
                grid-template-columns: 1fr;
            }
            
            .nav-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
        }
    `;
    document.head.appendChild(style);
});