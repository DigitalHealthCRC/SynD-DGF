// Step 2: Assess Source Data page custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
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

    // Interactive quality assessment
    const qualityItems = document.querySelectorAll('.quality-item');
    qualityItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

    // Expandable documentation sections
    const docItems = document.querySelectorAll('.doc-item h5');
    docItems.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
    });

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
        
        .assessment-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            margin-bottom: 2rem;
        }
        
        .control-checklist {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1rem 0;
        }
        
        .complex-scenarios-alert {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1.5rem 0;
            border-left: 4px solid #f39c12;
        }
        
        .complex-scenarios-alert h4 {
            color: #d68910;
            margin-bottom: 1rem;
        }
        
        .quality-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .quality-item {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .quality-item:hover {
            background: #e9ecef;
            border-color: #007bff;
        }
        
        .quality-item.expanded {
            background: #e3f2fd;
            border-color: #2196f3;
        }
        
        .quality-item h5 {
            margin-bottom: 0.75rem;
            color: #007bff;
        }
        
        .fitness-assessment {
            background: #e8f5e8;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1.5rem 0;
            border-left: 4px solid #4caf50;
        }
        
        .identifier-categories {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 1.5rem 0;
        }
        
        .identifier-category {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 6px;
        }
        
        .identifier-category h5 {
            color: #d32f2f;
            margin-bottom: 1rem;
        }
        
        .preparation-techniques {
            margin: 1.5rem 0;
        }
        
        .risk-warning {
            background: #ffebee;
            border: 1px solid #f44336;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1.5rem 0;
            border-left: 4px solid #f44336;
        }
        
        .risk-warning h4 {
            color: #d32f2f;
            margin-bottom: 1rem;
        }
        
        .documentation-requirements {
            margin: 1.5rem 0;
        }
        
        .doc-item {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 6px;
            margin-bottom: 1rem;
        }
        
        .doc-item h5 {
            color: #7b1fa2;
            margin-bottom: 0.75rem;
            cursor: pointer;
            position: relative;
        }
        
        .doc-item h5:after {
            content: "▼";
            position: absolute;
            right: 0;
            transition: transform 0.3s ease;
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
        
        .consideration-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 1.5rem 0;
        }
        
        .consideration-item {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 6px;
            border-left: 4px solid #17a2b8;
        }
        
        .consideration-item h3 {
            color: #17a2b8;
            margin-bottom: 1rem;
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
            
            .quality-grid {
                grid-template-columns: 1fr;
            }
            
            .identifier-categories {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .consideration-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
});