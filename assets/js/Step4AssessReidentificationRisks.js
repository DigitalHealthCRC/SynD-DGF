// Step 4: Assess Re-identification Risks page custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Interactive risk type cards
    const riskCards = document.querySelectorAll('.risk-card');
    riskCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            // Close other cards
            riskCards.forEach(otherCard => {
                if (otherCard !== this) {
                    otherCard.classList.remove('expanded');
                }
            });
        });
    });

    // Expandable technique cards
    const techniqueCards = document.querySelectorAll('.technique-card');
    techniqueCards.forEach(card => {
        const header = card.querySelector('h3');
        header.addEventListener('click', function() {
            const content = card.querySelector('.technique-details');
            content.classList.toggle('collapsed');
            
            // Update header indicator
            const indicator = header.querySelector('.expand-indicator') || document.createElement('span');
            if (!header.querySelector('.expand-indicator')) {
                indicator.className = 'expand-indicator';
                indicator.textContent = '▼';
                header.appendChild(indicator);
            }
            
            if (content.classList.contains('collapsed')) {
                indicator.textContent = '▶';
            } else {
                indicator.textContent = '▼';
            }
        });
    });

    // Interactive methodology steps
    const methodologySteps = document.querySelectorAll('.methodology-step');
    methodologySteps.forEach((step, index) => {
        const header = step.querySelector('h3');
        header.addEventListener('click', function() {
            step.classList.toggle('active');
            
            // Mark steps as completed when clicked
            methodologySteps.forEach((s, i) => {
                if (i <= index && step.classList.contains('active')) {
                    s.classList.add('completed');
                } else if (i > index) {
                    s.classList.remove('completed');
                }
            });
        });
    });

    // Risk level selector
    const riskLevels = document.querySelectorAll('.risk-level');
    riskLevels.forEach(level => {
        level.addEventListener('click', function() {
            // Remove active class from all levels
            riskLevels.forEach(l => l.classList.remove('selected'));
            
            // Add active class to clicked level
            this.classList.add('selected');
            
            // Update decision outcome based on selection
            updateDecisionOutcome(this.classList.contains('very-low'));
        });
    });

    // Interactive criteria checklist
    const criteriaItems = document.querySelectorAll('.criteria-item input[type="checkbox"]');
    criteriaItems.forEach(checkbox => {
        checkbox.addEventListener('change', updateProceedButton);
    });

    function updateProceedButton() {
        const allChecked = Array.from(criteriaItems).every(checkbox => checkbox.checked);
        updateDecisionOutcome(allChecked);
    }

    function updateDecisionOutcome(canProceed) {
        const proceedSection = document.querySelector('.outcome-proceed');
        const complexSection = document.querySelector('.outcome-complex');
        
        if (canProceed) {
            proceedSection.style.display = 'block';
            complexSection.style.display = 'none';
        } else {
            proceedSection.style.display = 'none';
            complexSection.style.display = 'block';
        }
    }

    // Initial state
    updateProceedButton();

    // Risk calculator functionality
    const riskCalculator = document.createElement('div');
    riskCalculator.className = 'risk-calculator';
    riskCalculator.innerHTML = `
        <h4>Interactive Risk Calculator</h4>
        <div class="calculator-inputs">
            <div class="input-group">
                <label for="uniqueness">Uniqueness percentage:</label>
                <input type="range" id="uniqueness" min="0" max="30" value="5" step="1">
                <span class="value-display">5%</span>
            </div>
            <div class="input-group">
                <label for="membership">Membership inference accuracy:</label>
                <input type="range" id="membership" min="50" max="90" value="55" step="1">
                <span class="value-display">55%</span>
            </div>
            <div class="risk-result">
                <div class="risk-indicator very-low">Very Low Risk</div>
            </div>
        </div>
    `;

    // Add calculator to uniqueness section
    const uniquenessSection = document.querySelector('.uniqueness-calculator');
    if (uniquenessSection) {
        uniquenessSection.appendChild(riskCalculator);
    }

    // Calculator functionality
    const uniquenessSlider = document.getElementById('uniqueness');
    const membershipSlider = document.getElementById('membership');
    
    if (uniquenessSlider && membershipSlider) {
        function updateRiskCalculator() {
            const uniqueness = parseInt(uniquenessSlider.value);
            const membership = parseInt(membershipSlider.value);
            
            // Update display values
            uniquenessSlider.nextElementSibling.textContent = uniqueness + '%';
            membershipSlider.nextElementSibling.textContent = membership + '%';
            
            // Calculate overall risk
            const riskIndicator = document.querySelector('.risk-result .risk-indicator');
            let riskLevel = 'very-low';
            let riskText = 'Very Low Risk';
            
            if (uniqueness > 20 || membership > 75) {
                riskLevel = 'high';
                riskText = 'High Risk';
            } else if (uniqueness > 10 || membership > 65) {
                riskLevel = 'medium';
                riskText = 'Medium Risk';
            } else if (uniqueness > 5 || membership > 55) {
                riskLevel = 'low';
                riskText = 'Low Risk';
            }
            
            riskIndicator.className = `risk-indicator ${riskLevel}`;
            riskIndicator.textContent = riskText;
        }
        
        uniquenessSlider.addEventListener('input', updateRiskCalculator);
        membershipSlider.addEventListener('input', updateRiskCalculator);
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
        
        .risk-types {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .risk-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .risk-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .risk-card.expanded {
            transform: scale(1.02);
            z-index: 10;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .risk-card h3 {
            margin-bottom: 1rem;
        }
        
        .technique-sections {
            margin: 2rem 0;
        }
        
        .technique-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        
        .technique-card h3 {
            background: #f8f9fa;
            padding: 1rem 1.5rem;
            margin: 0;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .technique-card h3:hover {
            background: #e9ecef;
        }
        
        .technique-content {
            padding: 1.5rem;
        }
        
        .technique-details {
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .technique-details.collapsed {
            display: none;
        }
        
        .expand-indicator {
            transition: transform 0.3s ease;
        }
        
        .methodology-steps {
            margin: 2rem 0;
        }
        
        .methodology-step {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        
        .methodology-step h3 {
            background: #f8f9fa;
            padding: 1rem 1.5rem;
            margin: 0;
            cursor: pointer;
            position: relative;
        }
        
        .methodology-step h3:hover {
            background: #e9ecef;
        }
        
        .methodology-step.active h3 {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .methodology-step.completed h3 {
            background: #e8f5e8;
            color: #2e7d32;
        }
        
        .methodology-step.completed h3:before {
            content: "✓";
            position: absolute;
            right: 1.5rem;
            color: #4caf50;
        }
        
        .step-content {
            padding: 1.5rem;
        }
        
        .assessment-tool {
            margin-top: 1rem;
            padding: 1rem;
            background: #e3f2fd;
            border-radius: 6px;
        }
        
        .uniqueness-calculator {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1.5rem 0;
        }
        
        .risk-calculator {
            background: white;
            padding: 1.5rem;
            border-radius: 6px;
            margin-top: 1rem;
            border: 1px solid #ddd;
        }
        
        .calculator-inputs {
            margin-top: 1rem;
        }
        
        .input-group {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            gap: 1rem;
        }
        
        .input-group label {
            min-width: 200px;
        }
        
        .input-group input[type="range"] {
            flex: 1;
        }
        
        .value-display {
            min-width: 50px;
            text-align: right;
            font-weight: bold;
        }
        
        .risk-result {
            margin-top: 1.5rem;
            text-align: center;
        }
        
        .risk-indicator {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.9rem;
        }
        
        .risk-indicator.very-low {
            background: #d4edda;
            color: #155724;
        }
        
        .risk-indicator.low {
            background: #fff3cd;
            color: #856404;
        }
        
        .risk-indicator.medium {
            background: #ffeaa7;
            color: #d68910;
        }
        
        .risk-indicator.high {
            background: #f8d7da;
            color: #721c24;
        }
        
        .inference-testing {
            background: #e8f5e8;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1rem 0;
        }
        
        .risk-matrix {
            margin: 1.5rem 0;
        }
        
        .risk-levels {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .risk-level {
            padding: 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .risk-level.very-low {
            background: #e8f5e8;
            border-color: #4caf50;
        }
        
        .risk-level.low {
            background: #fff3e0;
            border-color: #ff9800;
        }
        
        .risk-level.medium-high {
            background: #ffebee;
            border-color: #f44336;
        }
        
        .risk-level:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .risk-level.selected {
            border-width: 3px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        
        .risk-level h5 {
            margin-bottom: 0.75rem;
        }
        
        .mitigation-strategies {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .strategy-category {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #17a2b8;
        }
        
        .strategy-category h3 {
            color: #17a2b8;
            margin-bottom: 1rem;
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
        
        .outcome-proceed, .outcome-complex {
            flex: 1;
            padding: 1.5rem;
            border-radius: 8px;
        }
        
        .outcome-proceed {
            background: #e8f5e8;
            border: 1px solid #4caf50;
            display: none;
        }
        
        .outcome-complex {
            background: #fff3cd;
            border: 1px solid #ffc107;
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
            
            .risk-types {
                grid-template-columns: 1fr;
            }
            
            .mitigation-strategies {
                grid-template-columns: 1fr;
            }
            
            .input-group {
                flex-direction: column;
                align-items: stretch;
                gap: 0.5rem;
            }
            
            .input-group label {
                min-width: auto;
            }
        }
    `;
    document.head.appendChild(style);
});