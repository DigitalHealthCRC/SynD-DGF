// Step 5: Manage Residual Privacy Risks page custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Interactive Five Safes Framework
    const safeCards = document.querySelectorAll('.safe-card');
    let activeSafe = null;

    safeCards.forEach(card => {
        const header = card.querySelector('.safe-header');
        header.addEventListener('click', function() {
            // Toggle expanded state
            if (activeSafe === card) {
                card.classList.remove('expanded');
                activeSafe = null;
            } else {
                // Close previously active card
                if (activeSafe) {
                    activeSafe.classList.remove('expanded');
                }
                // Open clicked card
                card.classList.add('expanded');
                activeSafe = card;
            }
        });
    });

    // Control level selector
    const controlLevels = document.querySelectorAll('.control-level');
    controlLevels.forEach(level => {
        level.addEventListener('click', function() {
            // Toggle selection
            this.classList.toggle('selected');
            
            // Update the safe assessment
            updateSafeAssessment();
        });
    });

    function updateSafeAssessment() {
        const selectedControls = document.querySelectorAll('.control-level.selected');
        const totalSafes = safeCards.length;
        const assessedSafes = Math.floor(selectedControls.length / 2); // 2 control levels per safe
        
        // Update progress indicator
        updateFrameworkProgress(assessedSafes, totalSafes);
    }

    function updateFrameworkProgress(assessed, total) {
        let progressIndicator = document.querySelector('.framework-progress');
        if (!progressIndicator) {
            progressIndicator = document.createElement('div');
            progressIndicator.className = 'framework-progress';
            document.querySelector('.five-safes-framework h2').after(progressIndicator);
        }
        
        const percentage = (assessed / total) * 100;
        progressIndicator.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <p>Framework assessment progress: ${assessed}/${total} safes configured</p>
        `;
    }

    // Agreement type tabs
    const agreementCards = document.querySelectorAll('.agreement-card');
    agreementCards.forEach(card => {
        const header = card.querySelector('h3');
        header.addEventListener('click', function() {
            card.classList.toggle('expanded');
        });
    });

    // Assurance activity planner
    const activityCategories = document.querySelectorAll('.activity-category');
    activityCategories.forEach(category => {
        const header = category.querySelector('h3');
        header.addEventListener('click', function() {
            category.classList.toggle('selected');
            updateAssurancePlan();
        });
    });

    function updateAssurancePlan() {
        const selectedCategories = document.querySelectorAll('.activity-category.selected');
        let planSummary = document.querySelector('.assurance-plan-summary');
        
        if (!planSummary) {
            planSummary = document.createElement('div');
            planSummary.className = 'assurance-plan-summary';
            document.querySelector('.assurance-monitoring').appendChild(planSummary);
        }
        
        planSummary.innerHTML = `
            <h4>Selected assurance activities: ${selectedCategories.length}/3</h4>
            <p>Click categories above to build your assurance monitoring plan.</p>
        `;
    }

    // Interactive criteria checklist with dynamic approval
    const criteriaItems = document.querySelectorAll('.criteria-item input[type="checkbox"]');
    criteriaItems.forEach(checkbox => {
        checkbox.addEventListener('change', updateApprovalDecision);
    });

    function updateApprovalDecision() {
        const checkedItems = Array.from(criteriaItems).filter(cb => cb.checked);
        const totalItems = criteriaItems.length;
        const completionRate = checkedItems.length / totalItems;
        
        const approveSection = document.querySelector('.outcome-approve');
        const conditionalSection = document.querySelector('.outcome-conditional');
        const denySection = document.querySelector('.outcome-deny');
        
        // Hide all outcomes first
        [approveSection, conditionalSection, denySection].forEach(section => {
            section.style.display = 'none';
        });
        
        // Show appropriate outcome based on completion
        if (completionRate >= 0.9) {
            approveSection.style.display = 'block';
        } else if (completionRate >= 0.7) {
            conditionalSection.style.display = 'block';
        } else {
            denySection.style.display = 'block';
        }
        
        // Update progress indicator
        updateDecisionProgress(checkedItems.length, totalItems);
    }

    function updateDecisionProgress(completed, total) {
        let progressIndicator = document.querySelector('.decision-progress');
        if (!progressIndicator) {
            progressIndicator = document.createElement('div');
            progressIndicator.className = 'decision-progress';
            document.querySelector('.decision-framework h3').after(progressIndicator);
        }
        
        const percentage = (completed / total) * 100;
        let status = 'insufficient';
        if (percentage >= 90) status = 'approved';
        else if (percentage >= 70) status = 'conditional';
        
        progressIndicator.innerHTML = `
            <div class="progress-bar ${status}">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <p>Decision criteria completion: ${completed}/${total} (${Math.round(percentage)}%)</p>
        `;
    }

    // Risk balancing visualisation
    function createRiskBalancingTool() {
        const balancingTool = document.createElement('div');
        balancingTool.className = 'risk-balancing-tool';
        balancingTool.innerHTML = `
            <h4>Interactive risk balancing</h4>
            <p>Adjust the controls for each safe to see how they balance overall risk:</p>
            <div class="balancing-controls">
                <div class="safe-control">
                    <label>Safe Data</label>
                    <input type="range" id="safe-data" min="1" max="5" value="3">
                    <span class="control-value">3</span>
                </div>
                <div class="safe-control">
                    <label>Safe Projects</label>
                    <input type="range" id="safe-projects" min="1" max="5" value="3">
                    <span class="control-value">3</span>
                </div>
                <div class="safe-control">
                    <label>Safe Settings</label>
                    <input type="range" id="safe-settings" min="1" max="5" value="3">
                    <span class="control-value">3</span>
                </div>
                <div class="safe-control">
                    <label>Safe People</label>
                    <input type="range" id="safe-people" min="1" max="5" value="3">
                    <span class="control-value">3</span>
                </div>
                <div class="safe-control">
                    <label>Safe Outputs</label>
                    <input type="range" id="safe-outputs" min="1" max="5" value="3">
                    <span class="control-value">3</span>
                </div>
            </div>
            <div class="overall-risk-indicator">
                <div class="risk-level-display">Overall Risk Level: <span id="risk-level">Moderate</span></div>
            </div>
        `;
        
        document.querySelector('.framework-principle').appendChild(balancingTool);
        
        // Add event listeners for the balancing tool
        const sliders = balancingTool.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('input', function() {
                this.nextElementSibling.textContent = this.value;
                updateOverallRisk();
            });
        });
        
        function updateOverallRisk() {
            const values = Array.from(sliders).map(s => parseInt(s.value));
            const average = values.reduce((a, b) => a + b) / values.length;
            const riskLevelSpan = document.getElementById('risk-level');
            
            let riskLevel = 'Low';
            let riskClass = 'low';
            
            if (average >= 4) {
                riskLevel = 'Very Low';
                riskClass = 'very-low';
            } else if (average >= 3.5) {
                riskLevel = 'Low';
                riskClass = 'low';
            } else if (average >= 2.5) {
                riskLevel = 'Moderate';
                riskClass = 'moderate';
            } else {
                riskLevel = 'High';
                riskClass = 'high';
            }
            
            riskLevelSpan.textContent = riskLevel;
            riskLevelSpan.className = riskClass;
        }
    }

    // Initialize tools
    createRiskBalancingTool();
    updateApprovalDecision();

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
        
        .framework-intro {
            background: #e3f2fd;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 2rem 0;
            border-left: 4px solid #2196f3;
        }
        
        .framework-principle h3 {
            color: #1976d2;
            margin-bottom: 1rem;
        }
        
        .balancing-example {
            background: white;
            padding: 1rem;
            border-radius: 6px;
            margin-top: 1rem;
            border-left: 4px solid #ff9800;
        }
        
        .safes-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .safe-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .safe-card:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .safe-card.expanded {
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            transform: translateY(-5px);
        }
        
        .safe-header {
            background: #f8f9fa;
            padding: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .safe-header:hover {
            background: #e9ecef;
        }
        
        .safe-icon {
            font-size: 2rem;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border-radius: 50%;
            border: 2px solid #ddd;
        }
        
        .safe-header h3 {
            margin: 0;
            flex: 1;
        }
        
        .safe-content {
            padding: 2rem;
            display: none;
        }
        
        .safe-card.expanded .safe-content {
            display: block;
        }
        
        .assessment-criteria {
            margin: 1.5rem 0;
        }
        
        .risk-factors, .concern-indicators {
            background: #fff3e0;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
            border-left: 4px solid #ff9800;
        }
        
        .required-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin: 1rem 0;
        }
        
        .control-category {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 6px;
        }
        
        .control-category h5 {
            color: #007bff;
            margin-bottom: 0.75rem;
        }
        
        .storage-requirements {
            background: #e8f5e8;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1rem 0;
            border-left: 4px solid #4caf50;
        }
        
        .jurisdiction-note {
            background: #fff3cd;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
            border-left: 4px solid #ffc107;
        }
        
        .people-risks {
            background: #ffebee;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
            border-left: 4px solid #f44336;
        }
        
        .output-requirements {
            background: #f3e5f5;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
            border-left: 4px solid #9c27b0;
        }
        
        .controls-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .control-level {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .control-level:hover {
            background: #e9ecef;
            border-color: #007bff;
        }
        
        .control-level.selected {
            background: #e3f2fd;
            border-color: #2196f3;
        }
        
        .control-level h5 {
            margin-bottom: 0.75rem;
            color: #007bff;
        }
        
        .framework-progress, .decision-progress {
            margin: 1rem 0;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            background: #007bff;
            transition: width 0.3s ease;
        }
        
        .progress-bar.approved .progress-fill {
            background: #4caf50;
        }
        
        .progress-bar.conditional .progress-fill {
            background: #ff9800;
        }
        
        .agreement-types {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .agreement-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .agreement-card h3 {
            background: #f8f9fa;
            padding: 1rem 1.5rem;
            margin: 0;
            cursor: pointer;
        }
        
        .agreement-card h3:hover {
            background: #e9ecef;
        }
        
        .agreement-content {
            padding: 1.5rem;
            display: none;
        }
        
        .agreement-card.expanded .agreement-content {
            display: block;
        }
        
        .synthetic-clauses, .privacy-clauses, .output-controls {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
        }
        
        .assurance-activities {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .activity-category {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .activity-category:hover {
            background: #f8f9fa;
            transform: translateY(-2px);
        }
        
        .activity-category.selected {
            background: #e3f2fd;
            border-color: #2196f3;
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .activity-category h3 {
            color: #007bff;
            margin-bottom: 1rem;
        }
        
        .assurance-plan-summary {
            background: #e8f5e8;
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 2rem;
            border-left: 4px solid #4caf50;
        }
        
        .risk-balancing-tool {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 1.5rem;
            border: 1px solid #ddd;
        }
        
        .balancing-controls {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .safe-control {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .safe-control label {
            min-width: 120px;
            font-weight: bold;
        }
        
        .safe-control input[type="range"] {
            flex: 1;
        }
        
        .control-value {
            min-width: 30px;
            text-align: center;
            font-weight: bold;
        }
        
        .overall-risk-indicator {
            text-align: center;
            margin-top: 1.5rem;
        }
        
        .risk-level-display {
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        #risk-level.very-low { color: #4caf50; }
        #risk-level.low { color: #8bc34a; }
        #risk-level.moderate { color: #ff9800; }
        #risk-level.high { color: #f44336; }
        
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
            margin-top: 1.5rem;
        }
        
        .outcome-approve, .outcome-conditional, .outcome-deny {
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: none;
        }
        
        .outcome-approve {
            background: #e8f5e8;
            border: 1px solid #4caf50;
        }
        
        .outcome-conditional {
            background: #fff3e0;
            border: 1px solid #ff9800;
        }
        
        .outcome-deny {
            background: #ffebee;
            border: 1px solid #f44336;
        }
        
        .approval-requirements {
            background: white;
            padding: 1rem;
            border-radius: 6px;
            margin-top: 1rem;
        }
        
        .completion-summary {
            background: #e8f5e8;
            padding: 2rem;
            border-radius: 8px;
            margin: 2rem 0;
            border-left: 4px solid #4caf50;
            text-align: center;
        }
        
        .completion-summary h3 {
            color: #2e7d32;
            margin-bottom: 1rem;
        }
        
        .next-steps, .support-resources {
            background: white;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1rem 0;
            text-align: left;
        }
        
        .resource-links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
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
            align-items: center;
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
        
        .nav-overview {
            background: #28a745;
        }
        
        .nav-overview:hover {
            background: #218838;
        }
        
        @media (max-width: 768px) {
            .safes-grid {
                grid-template-columns: 1fr;
            }
            
            .controls-grid {
                grid-template-columns: 1fr;
            }
            
            .required-controls {
                grid-template-columns: 1fr;
            }
            
            .agreement-types {
                grid-template-columns: 1fr;
            }
            
            .assurance-activities {
                grid-template-columns: 1fr;
            }
            
            .nav-buttons {
                flex-direction: column;
                gap: 1rem;
            }
            
            .resource-links {
                flex-direction: column;
                align-items: center;
            }
        }
    `;
    document.head.appendChild(style);
});