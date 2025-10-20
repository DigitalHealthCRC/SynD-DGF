// Step 3: Generate Synthetic Data page custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Interactive model comparison
    const modelCards = document.querySelectorAll('.model-card');
    modelCards.forEach(card => {
        const header = card.querySelector('.model-header');
        header.addEventListener('click', function() {
            // Toggle expanded state
            card.classList.toggle('expanded');
            
            // Update other cards
            modelCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                }
            });
        });
    });

    // Interactive process steps
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            // Mark this step and all previous as completed
            processSteps.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('completed');
                } else {
                    s.classList.remove('completed');
                }
            });
        });
    });

    // Configuration section toggles
    const configSections = document.querySelectorAll('.config-section h3');
    configSections.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.classList.toggle('collapsed');
            
            // Update chevron
            const chevron = this.querySelector('.chevron') || document.createElement('span');
            if (!this.querySelector('.chevron')) {
                chevron.className = 'chevron';
                chevron.textContent = '▼';
                this.appendChild(chevron);
            }
            
            if (content.classList.contains('collapsed')) {
                chevron.textContent = '▶';
            } else {
                chevron.textContent = '▼';
            }
        });
    });

    // Interactive criteria checklist
    const criteriaItems = document.querySelectorAll('.criteria-item input[type="checkbox"]');
    criteriaItems.forEach(checkbox => {
        checkbox.addEventListener('change', updateProceedButton);
    });

    function updateProceedButton() {
        const allChecked = Array.from(criteriaItems).every(checkbox => checkbox.checked);
        const proceedSection = document.querySelector('.outcome-proceed');
        const reviewSection = document.querySelector('.outcome-review');
        
        if (allChecked) {
            proceedSection.style.display = 'block';
            reviewSection.style.display = 'none';
        } else {
            proceedSection.style.display = 'none';
            reviewSection.style.display = 'block';
        }
    }

    // Initial state
    updateProceedButton();

    // Model complexity indicator interactions
    const complexityIndicators = document.querySelectorAll('.complexity-level');
    complexityIndicators.forEach(indicator => {
        indicator.addEventListener('mouseenter', function() {
            showComplexityTooltip(this);
        });
        
        indicator.addEventListener('mouseleave', function() {
            hideComplexityTooltip();
        });
    });

    function showComplexityTooltip(element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'complexity-tooltip';
        
        const level = element.textContent.trim();
        let description = '';
        
        switch(level) {
            case 'Low complexity':
                description = 'Suitable for teams with basic technical skills. Quick to implement and understand.';
                break;
            case 'Medium complexity':
                description = 'Requires statistical knowledge. Good balance of sophistication and implementability.';
                break;
            case 'High complexity':
                description = 'Requires advanced technical expertise and significant computational resources.';
                break;
        }
        
        tooltip.textContent = description;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = (rect.bottom + 5) + 'px';
        tooltip.style.left = rect.left + 'px';
    }

    function hideComplexityTooltip() {
        const tooltip = document.querySelector('.complexity-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Add CSS for interactive elements
    const style = document.createElement('style');
    style.textContent = `
        .step-intro {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        
        .step-objectives {
            margin-top: 1.5rem;
            padding: 1rem;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #007bff;
        }
        
        .model-types {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .model-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .model-card:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        
        .model-card.expanded {
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .model-header {
            padding: 1.5rem;
            background: #f8f9fa;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .model-header h3 {
            margin: 0;
        }
        
        .complexity-indicator {
            display: flex;
            align-items: center;
        }
        
        .complexity-level {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: bold;
            cursor: help;
        }
        
        .complexity-level.low {
            background: #d4edda;
            color: #155724;
        }
        
        .complexity-level.medium {
            background: #fff3cd;
            color: #856404;
        }
        
        .complexity-level.high {
            background: #f8d7da;
            color: #721c24;
        }
        
        .complexity-tooltip {
            background: #333;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            max-width: 250px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .model-content {
            padding: 1.5rem;
        }
        
        .model-details {
            margin-top: 1rem;
        }
        
        .model-details h4 {
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: #007bff;
        }
        
        .model-card:not(.expanded) .model-details {
            display: none;
        }
        
        .configuration-sections {
            margin: 2rem 0;
        }
        
        .config-section {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 1rem;
            overflow: hidden;
        }
        
        .config-section h3 {
            margin: 0;
            padding: 1rem 1.5rem;
            background: #f8f9fa;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .config-section h3:hover {
            background: #e9ecef;
        }
        
        .config-content {
            padding: 1.5rem;
            transition: all 0.3s ease;
        }
        
        .config-content.collapsed {
            display: none;
        }
        
        .chevron {
            transition: transform 0.3s ease;
        }
        
        .process-steps {
            margin: 2rem 0;
        }
        
        .process-step {
            display: flex;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .process-step:hover {
            background: #f8f9fa;
        }
        
        .process-step.completed {
            background: #e8f5e8;
            border-color: #4caf50;
        }
        
        .process-step.completed .step-number {
            background: #4caf50;
            color: white;
        }
        
        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e0e0e0;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 1.5rem;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }
        
        .step-content {
            flex: 1;
        }
        
        .step-content h3 {
            margin-top: 0;
            margin-bottom: 0.75rem;
        }
        
        .doc-requirements {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .doc-category {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #17a2b8;
        }
        
        .doc-category h3 {
            color: #17a2b8;
            margin-bottom: 1rem;
        }
        
        .security-alert {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 2rem;
            border-radius: 8px;
            margin: 2rem 0;
            border-left: 4px solid #f39c12;
        }
        
        .security-alert h3 {
            color: #d68910;
            margin-bottom: 1rem;
        }
        
        .security-requirements {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .security-item {
            background: white;
            padding: 1.5rem;
            border-radius: 6px;
            border: 1px solid #ddd;
        }
        
        .security-item h4 {
            color: #d68910;
            margin-bottom: 0.75rem;
        }
        
        .criteria-checklist {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }
        
        .criteria-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
            padding: 0.5rem;
            background: white;
            border-radius: 4px;
        }
        
        .criteria-item input[type="checkbox"] {
            margin-right: 0.75rem;
            transform: scale(1.2);
        }
        
        .criteria-item label {
            margin: 0;
            cursor: pointer;
        }
        
        .decision-outcome {
            display: flex;
            gap: 2rem;
            margin-top: 1.5rem;
        }
        
        .outcome-proceed, .outcome-review {
            flex: 1;
            padding: 1.5rem;
            border-radius: 8px;
        }
        
        .outcome-proceed {
            background: #e8f5e8;
            border: 1px solid #4caf50;
            display: none;
        }
        
        .outcome-review {
            background: #fff3e0;
            border: 1px solid #ff9800;
        }
        
        .breadcrumb {
            padding: 0.75rem 0;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }
        
        .breadcrumb a {
            color: #007bff;
            text-decoration: none;
        }
        
        .breadcrumb a:hover {
            text-decoration: underline;
        }
        
        .step-navigation {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e0e0e0;
        }
        
        .nav-buttons {
            display: flex;
            justify-content: space-between;
        }
        
        .nav-button {
            padding: 0.75rem 1.5rem;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s ease;
        }
        
        .nav-button:hover {
            background: #0056b3;
            text-decoration: none;
            color: white;
        }
        
        @media (max-width: 768px) {
            .decision-outcome {
                flex-direction: column;
                gap: 1rem;
            }
            
            .nav-buttons {
                flex-direction: column;
                gap: 1rem;
            }
            
            .doc-requirements {
                grid-template-columns: 1fr;
            }
            
            .security-requirements {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
});