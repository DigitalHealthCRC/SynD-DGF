// Legal Pathways Wizard page custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    let wizardData = {};
    
    // Initialize wizard functionality
    initializeWizard();
    
    function initializeWizard() {
        // Pathway card interactions
        const pathwayCards = document.querySelectorAll('.pathway-card');
        pathwayCards.forEach(card => {
            card.addEventListener('click', function() {
                const pathway = this.getAttribute('data-pathway');
                showPathwayDetails(pathway);
            });
        });
        
        // Accordion functionality
        const pathwaySections = document.querySelectorAll('.pathway-section');
        pathwaySections.forEach(section => {
            const header = section.querySelector('.pathway-header');
            header.addEventListener('click', function() {
                section.classList.toggle('expanded');
                
                // Update toggle icon
                const icon = section.querySelector('.toggle-icon');
                icon.textContent = section.classList.contains('expanded') ? '▲' : '▼';
            });
        });
        
        // Form validation and step management
        setupFormValidation();
    }
    
    function nextStep() {
        if (validateCurrentStep()) {
            collectStepData();
            currentStep++;
            showStep(currentStep);
        }
    }
    
    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }
    
    function showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const targetStep = document.getElementById(`step-${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
        
        // Update progress indicator
        updateProgressIndicator();
    }
    
    function validateCurrentStep() {
        const currentStepElement = document.querySelector('.wizard-step.active');
        const requiredInputs = currentStepElement.querySelectorAll('input[type="radio"]');
        const groups = {};
        
        // Group radio buttons by name
        requiredInputs.forEach(input => {
            if (!groups[input.name]) {
                groups[input.name] = [];
            }
            groups[input.name].push(input);
        });
        
        // Check each group has a selection
        for (let groupName in groups) {
            const hasSelection = groups[groupName].some(input => input.checked);
            if (!hasSelection) {
                showValidationError(`Please select an option for ${groupName.replace('-', ' ')}`);
                return false;
            }
        }
        
        return true;
    }
    
    function collectStepData() {
        const currentStepElement = document.querySelector('.wizard-step.active');
        const inputs = currentStepElement.querySelectorAll('input');
        
        inputs.forEach(input => {
            if (input.type === 'radio' && input.checked) {
                wizardData[input.name] = input.value;
            } else if (input.type === 'checkbox' && input.checked) {
                if (!wizardData[input.name]) {
                    wizardData[input.name] = [];
                }
                wizardData[input.name].push(input.value);
            }
        });
    }
    
    function generateResults() {
        if (validateCurrentStep()) {
            collectStepData();
            
            // Analyze responses and determine recommended pathway
            const recommendation = analyzeResponses();
            
            // Display results
            displayResults(recommendation);
            
            // Show results step
            currentStep = 'results';
            showStep('results');
        }
    }
    
    function analyzeResponses() {
        let pathwayScores = {
            'directly-related': 0,
            'consent': 0,
            'hrec': 0,
            'deidentification': 0
        };
        
        // Score based on organisation type and purpose
        if (wizardData['org-type'] === 'public-health' || wizardData['org-type'] === 'private-health') {
            pathwayScores['directly-related'] += 3;
        }
        
        if (wizardData['primary-purpose'] === 'service-delivery' || wizardData['primary-purpose'] === 'system-management') {
            pathwayScores['directly-related'] += 4;
        } else if (wizardData['primary-purpose'] === 'research') {
            pathwayScores['hrec'] += 3;
            pathwayScores['consent'] += 2;
        } else if (wizardData['primary-purpose'] === 'commercial') {
            pathwayScores['consent'] += 3;
            pathwayScores['deidentification'] += 2;
        }
        
        // Score based on consent status
        if (wizardData['consent-status'] === 'broad-consent') {
            pathwayScores['consent'] += 4;
        } else if (wizardData['consent-status'] === 'no-consent') {
            pathwayScores['directly-related'] += 2;
            pathwayScores['hrec'] += 2;
            pathwayScores['deidentification'] += 3;
        }
        
        // Score based on data sensitivity and risk
        if (wizardData['reidentification-risk'] === 'very-low') {
            pathwayScores['deidentification'] += 4;
        } else if (wizardData['reidentification-risk'] === 'high') {
            pathwayScores['hrec'] += 3;
            pathwayScores['consent'] += 2;
        }
        
        // Special populations considerations
        if (wizardData['population'] && wizardData['population'].includes('indigenous')) {
            pathwayScores['hrec'] += 3;
            pathwayScores['consent'] += 2;
        }
        
        if (wizardData['population'] && wizardData['population'].includes('children')) {
            pathwayScores['hrec'] += 2;
        }
        
        // Data sharing considerations
        if (wizardData['data-sharing'] === 'internal-only') {
            pathwayScores['directly-related'] += 2;
        } else if (wizardData['data-sharing'] === 'public-release') {
            pathwayScores['deidentification'] += 3;
            pathwayScores['hrec'] += 2;
        }
        
        if (wizardData['geographic-scope'] === 'international') {
            pathwayScores['deidentification'] += 2;
            pathwayScores['hrec'] += 1;
        }
        
        // Timeline considerations
        if (wizardData['timeline'] === 'immediate') {
            pathwayScores['directly-related'] += 2;
            pathwayScores['deidentification'] += 1;
        }
        
        // Find highest scoring pathway
        let recommendedPathway = Object.keys(pathwayScores).reduce((a, b) => 
            pathwayScores[a] > pathwayScores[b] ? a : b
        );
        
        return {
            primary: recommendedPathway,
            scores: pathwayScores,
            alternatives: getAlternativePathways(pathwayScores, recommendedPathway)
        };
    }
    
    function getAlternativePathways(scores, primary) {
        const alternatives = [];
        const sortedPathways = Object.entries(scores)
            .filter(([pathway]) => pathway !== primary)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2);
            
        return sortedPathways.map(([pathway]) => pathway);
    }
    
    function displayResults(recommendation) {
        const resultsContainer = document.getElementById('pathway-results');
        const nextStepsContainer = document.getElementById('next-steps');
        
        const pathwayNames = {
            'directly-related': 'Directly related uses',
            'consent': 'Consent-based approach',
            'hrec': 'HREC approval',
            'deidentification': 'De-identification standards'
        };
        
        const pathwayDescriptions = {
            'directly-related': 'Your synthetic data use appears to be directly related to the original purpose of health data collection.',
            'consent': 'Your project would benefit from obtaining specific consent for synthetic data generation and use.',
            'hrec': 'Your project requires Human Research Ethics Committee review and approval.',
            'deidentification': 'Your project can proceed using de-identification standards under privacy law.'
        };
        
        // Display primary recommendation
        resultsContainer.innerHTML = `
            <div class="primary-recommendation">
                <h4>🎯 Primary recommended pathway</h4>
                <div class="pathway-result primary">
                    <h5>${pathwayNames[recommendation.primary]}</h5>
                    <p>${pathwayDescriptions[recommendation.primary]}</p>
                    <div class="confidence-score">
                        <strong>Confidence level:</strong> ${getConfidenceLevel(recommendation.scores[recommendation.primary])}
                    </div>
                </div>
            </div>
            
            <div class="alternative-recommendations">
                <h4>Alternative pathways to consider</h4>
                ${recommendation.alternatives.map(pathway => `
                    <div class="pathway-result alternative">
                        <h6>${pathwayNames[pathway]}</h6>
                        <p>${pathwayDescriptions[pathway]}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="recommendation-basis">
                <h4>Recommendation based on</h4>
                <div class="basis-factors">
                    ${generateBasisFactors()}
                </div>
            </div>
        `;
        
        // Display next steps
        nextStepsContainer.innerHTML = generateNextSteps(recommendation.primary);
    }
    
    function getConfidenceLevel(score) {
        if (score >= 8) return 'High';
        if (score >= 5) return 'Medium';
        return 'Low - consider multiple pathways';
    }
    
    function generateBasisFactors() {
        const factors = [];
        
        if (wizardData['org-type']) {
            factors.push(`Organisation type: ${wizardData['org-type'].replace('-', ' ')}`);
        }
        if (wizardData['primary-purpose']) {
            factors.push(`Primary purpose: ${wizardData['primary-purpose'].replace('-', ' ')}`);
        }
        if (wizardData['consent-status']) {
            factors.push(`Consent status: ${wizardData['consent-status'].replace('-', ' ')}`);
        }
        if (wizardData['reidentification-risk']) {
            factors.push(`Re-identification risk: ${wizardData['reidentification-risk'].replace('-', ' ')}`);
        }
        if (wizardData['data-sharing']) {
            factors.push(`Data sharing: ${wizardData['data-sharing'].replace('-', ' ')}`);
        }
        
        return factors.map(factor => `<div class="basis-factor">${factor}</div>`).join('');
    }
    
    function generateNextSteps(pathway) {
        const nextSteps = {
            'directly-related': `
                <ol>
                    <li><strong>Document relationship:</strong> Clearly document how synthetic data use relates to original collection purpose</li>
                    <li><strong>Internal governance:</strong> Obtain approval from appropriate internal governance bodies</li>
                    <li><strong>Privacy assessment:</strong> Complete privacy impact assessment if required by organisation</li>
                    <li><strong>Technical implementation:</strong> Implement appropriate de-identification and security measures</li>
                    <li><strong>Documentation:</strong> Maintain records of decision-making and approval process</li>
                </ol>
                <div class="estimated-timeline">
                    <strong>Estimated timeline:</strong> 2-6 weeks for internal processes
                </div>
            `,
            'consent': `
                <ol>
                    <li><strong>Consent framework:</strong> Develop appropriate consent processes and information materials</li>
                    <li><strong>Ethics review:</strong> Submit to Human Research Ethics Committee if required</li>
                    <li><strong>Consent collection:</strong> Implement consent collection processes</li>
                    <li><strong>Consent management:</strong> Establish systems to track and honour consent decisions</li>
                    <li><strong>Proceed with consented data:</strong> Generate synthetic data only from consented records</li>
                </ol>
                <div class="estimated-timeline">
                    <strong>Estimated timeline:</strong> 3-9 months for consent framework and implementation
                </div>
            `,
            'hrec': `
                <ol>
                    <li><strong>Research protocol:</strong> Develop detailed research protocol and methodology</li>
                    <li><strong>HREC application:</strong> Submit comprehensive ethics application</li>
                    <li><strong>Address feedback:</strong> Respond to HREC questions and revision requests</li>
                    <li><strong>Implement conditions:</strong> Establish any specific HREC-required safeguards</li>
                    <li><strong>Ongoing compliance:</strong> Maintain compliance with HREC conditions and reporting</li>
                </ol>
                <div class="estimated-timeline">
                    <strong>Estimated timeline:</strong> 2-6 months for HREC approval process
                </div>
            `,
            'deidentification': `
                <ol>
                    <li><strong>Risk assessment:</strong> Conduct formal re-identification risk assessment</li>
                    <li><strong>Technique selection:</strong> Choose appropriate de-identification methods</li>
                    <li><strong>Technical implementation:</strong> Apply de-identification to synthetic data generation</li>
                    <li><strong>Validation testing:</strong> Test and validate privacy protections</li>
                    <li><strong>Documentation:</strong> Document de-identification process and outcomes</li>
                </ol>
                <div class="estimated-timeline">
                    <strong>Estimated timeline:</strong> 1-4 months for technical implementation
                </div>
            `
        };
        
        return nextSteps[pathway] || '';
    }
    
    function showValidationError(message) {
        // Remove existing error messages
        const existingErrors = document.querySelectorAll('.validation-error');
        existingErrors.forEach(error => error.remove());
        
        // Create new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.textContent = message;
        
        // Insert before current step navigation
        const currentStep = document.querySelector('.wizard-step.active');
        const navigation = currentStep.querySelector('.step-navigation');
        navigation.parentNode.insertBefore(errorDiv, navigation);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    function updateProgressIndicator() {
        // Could add a progress bar or step indicator here
    }
    
    function showPathwayDetails(pathway) {
        const section = document.querySelector(`[data-pathway="${pathway}"]`);
        if (section) {
            section.classList.add('expanded');
            const icon = section.querySelector('.toggle-icon');
            if (icon) {
                icon.textContent = '▲';
            }
            
            // Scroll to section
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    function restartWizard() {
        currentStep = 1;
        wizardData = {};
        
        // Clear all form inputs
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });
        
        // Show first step
        showStep(1);
    }
    
    function exportResults() {
        const resultsText = generateResultsText();
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'legal-pathway-recommendation.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function generateResultsText() {
        const results = document.getElementById('pathway-results').textContent;
        const nextSteps = document.getElementById('next-steps').textContent;
        
        return `
LEGAL PATHWAY RECOMMENDATION
Generated: ${new Date().toLocaleString()}

${results}

NEXT STEPS:
${nextSteps}

WIZARD RESPONSES:
${Object.entries(wizardData).map(([key, value]) => 
    `${key.replace('-', ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`
).join('\n')}

This recommendation is generated based on the SynD-DGF Legal Pathways Wizard.
Please consult with legal and privacy experts for specific implementation guidance.
        `.trim();
    }
    
    function setupFormValidation() {
        // Add change listeners to form inputs for real-time validation feedback
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', function() {
                // Remove validation errors when user makes selections
                const errors = document.querySelectorAll('.validation-error');
                errors.forEach(error => error.remove());
            });
        });
    }
    
    // Make functions available globally for button onclick handlers
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    window.generateResults = generateResults;
    window.restartWizard = restartWizard;
    window.exportResults = exportResults;
    
    // Add CSS for wizard functionality
    const style = document.createElement('style');
    style.textContent = `
        .wizard-intro {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        
        .pathways-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .pathway-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .pathway-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .pathway-card h3 {
            color: #007bff;
            margin-bottom: 1rem;
        }
        
        .pathway-indicator {
            position: absolute;
            top: 0;
            right: 0;
            width: 4px;
            height: 100%;
        }
        
        .pathway-indicator.directly-related {
            background: #28a745;
        }
        
        .pathway-indicator.consent {
            background: #007bff;
        }
        
        .pathway-indicator.hrec {
            background: #ffc107;
        }
        
        .pathway-indicator.deidentification {
            background: #6f42c1;
        }
        
        .wizard-container {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin: 2rem 0;
            min-height: 400px;
        }
        
        .wizard-step {
            display: none;
            padding: 2rem;
        }
        
        .wizard-step.active {
            display: block;
        }
        
        .step-content h3 {
            color: #007bff;
            margin-bottom: 1rem;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 0.5rem;
        }
        
        .question-group {
            margin: 2rem 0;
        }
        
        .question-group h4 {
            color: #495057;
            margin-bottom: 1rem;
        }
        
        .option-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .option-label {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .option-label:hover {
            background: #f8f9fa;
            border-color: #007bff;
        }
        
        .option-label input[type="radio"]:checked + .option-text,
        .option-label input[type="checkbox"]:checked + .checkbox-text {
            color: #007bff;
            font-weight: bold;
        }
        
        .option-text, .checkbox-text {
            font-weight: 500;
            margin-bottom: 0.25rem;
        }
        
        .option-description {
            color: #6c757d;
            font-size: 0.9rem;
            margin-top: 0.25rem;
        }
        
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .checkbox-label:hover {
            background: #f8f9fa;
        }
        
        .step-navigation {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .nav-button {
            background: #007bff;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .nav-button:hover {
            background: #0056b3;
            color: white;
            text-decoration: none;
        }
        
        .prev-button {
            background: #6c757d;
        }
        
        .prev-button:hover {
            background: #545b62;
        }
        
        .generate-results {
            background: #28a745;
        }
        
        .generate-results:hover {
            background: #1e7e34;
        }
        
        .pathway-results {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin: 1rem 0;
        }
        
        .primary-recommendation {
            margin-bottom: 2rem;
        }
        
        .pathway-result {
            background: white;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1rem 0;
            border-left: 4px solid #007bff;
        }
        
        .pathway-result.primary {
            border-left-color: #28a745;
            background: #f8fff9;
        }
        
        .pathway-result h5 {
            color: #28a745;
            margin-bottom: 0.5rem;
        }
        
        .pathway-result h6 {
            color: #007bff;
            margin-bottom: 0.5rem;
        }
        
        .confidence-score {
            background: #e8f5e8;
            padding: 0.75rem;
            border-radius: 4px;
            margin-top: 1rem;
        }
        
        .basis-factors {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
        }
        
        .basis-factor {
            background: white;
            padding: 0.75rem;
            border-radius: 4px;
            border-left: 3px solid #007bff;
        }
        
        .next-steps {
            background: white;
            padding: 1.5rem;
            border-radius: 6px;
            border-left: 4px solid #ffc107;
        }
        
        .estimated-timeline {
            background: #fff3cd;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
            border-left: 4px solid #ffc107;
        }
        
        .validation-error {
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
            border-left: 4px solid #dc3545;
        }
        
        .pathway-accordion {
            margin: 2rem 0;
        }
        
        .pathway-section {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 1rem;
            overflow: hidden;
        }
        
        .pathway-header {
            background: #f8f9fa;
            padding: 1rem 1.5rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background 0.3s ease;
        }
        
        .pathway-header:hover {
            background: #e9ecef;
        }
        
        .pathway-header h3 {
            margin: 0;
            color: #007bff;
        }
        
        .toggle-icon {
            font-size: 1rem;
            color: #6c757d;
            transition: transform 0.3s ease;
        }
        
        .pathway-content {
            display: none;
            padding: 2rem;
        }
        
        .pathway-section.expanded .pathway-content {
            display: block;
        }
        
        .pathway-overview, .pathway-process {
            margin-bottom: 2rem;
        }
        
        .pathway-overview h4, .pathway-process h4 {
            color: #495057;
            margin-bottom: 1rem;
        }
        
        .pathway-timeline {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 6px;
            border-left: 4px solid #007bff;
        }
        
        .resource-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .resource-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .resource-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .resource-card h3 {
            color: #007bff;
            margin-bottom: 1rem;
        }
        
        .navigation-links {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e0e0e0;
        }
        
        .nav-buttons {
            display: flex;
            justify-content: space-between;
        }
        
        @media (max-width: 768px) {
            .pathways-grid {
                grid-template-columns: 1fr;
            }
            
            .resource-links {
                grid-template-columns: 1fr;
            }
            
            .basis-factors {
                grid-template-columns: 1fr;
            }
            
            .nav-buttons {
                flex-direction: column;
                gap: 1rem;
            }
            
            .step-navigation {
                flex-direction: column;
                gap: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
});