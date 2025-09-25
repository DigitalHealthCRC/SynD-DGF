// Step 1: Use Case Assessment page custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality for scenarios
    const scenarioHeaders = document.querySelectorAll('.scenario-header');
    
    scenarioHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const content = document.querySelector(target);
            const icon = this.querySelector('.toggle-icon');
            
            // Toggle collapse class
            content.classList.toggle('collapse');
            
            // Update icon
            if (content.classList.contains('collapse')) {
                icon.textContent = '+';
            } else {
                icon.textContent = '-';
            }
            
            // Close other scenarios
            scenarioHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherTarget = otherHeader.getAttribute('data-target');
                    const otherContent = document.querySelector(otherTarget);
                    const otherIcon = otherHeader.querySelector('.toggle-icon');
                    
                    otherContent.classList.add('collapse');
                    otherIcon.textContent = '+';
                }
            });
        });
    });

    // Interactive criteria checklist
    const criteriaItems = document.querySelectorAll('.criteria-item input[type="checkbox"]');
    criteriaItems.forEach(checkbox => {
        checkbox.removeAttribute('disabled');
        checkbox.addEventListener('change', updateProceedButton);
    });

    function updateProceedButton() {
        const allChecked = Array.from(criteriaItems).every(checkbox => checkbox.checked);
        const proceedSection = document.querySelector('.outcome-proceed');
        const stopSection = document.querySelector('.outcome-stop');
        
        if (allChecked) {
            proceedSection.style.display = 'block';
            stopSection.style.display = 'none';
        } else {
            proceedSection.style.display = 'none';
            stopSection.style.display = 'block';
        }
    }

    // Initial state
    updateProceedButton();

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
        
        .requirement-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            margin-bottom: 2rem;
        }
        
        .test-section, .impact-section {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .assessment-question {
            background: #e3f2fd;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
            border-left: 4px solid #2196f3;
        }
        
        .indigenous-guidance {
            background: #fff3e0;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
            border-left: 4px solid #ff9800;
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
        
        .outcome-proceed, .outcome-stop {
            flex: 1;
            padding: 1.5rem;
            border-radius: 8px;
        }
        
        .outcome-proceed {
            background: #e8f5e8;
            border: 1px solid #4caf50;
            display: none;
        }
        
        .outcome-stop {
            background: #ffebee;
            border: 1px solid #f44336;
        }
        
        .scenario-accordion {
            margin-top: 1rem;
        }
        
        .scenario-item {
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            margin-bottom: 1rem;
            overflow: hidden;
        }
        
        .scenario-header {
            width: 100%;
            background: #f5f5f5;
            border: none;
            padding: 1rem;
            text-align: left;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .scenario-header:hover {
            background: #eeeeee;
        }
        
        .scenario-header h3 {
            margin: 0;
        }
        
        .toggle-icon {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .scenario-content {
            padding: 1.5rem;
            background: white;
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .scenario-content.collapse {
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
        }
        
        .resource-card {
            background: white;
            padding: 1.5rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            height: 100%;
            transition: all 0.3s ease;
        }
        
        .resource-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
        }
    `;
    document.head.appendChild(style);
});