// Risk Evaluation Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('riskEvaluationForm');
    const calculateButton = document.getElementById('calculateRisk');
    const resetButton = document.getElementById('resetForm');
    const riskResults = document.getElementById('riskResults');
    const resultsContent = document.getElementById('resultsContent');
    const exportButton = document.getElementById('exportRiskReport');
    const saveButton = document.getElementById('saveRiskAssessment');
    const newAssessmentButton = document.getElementById('newRiskAssessment');

    // Enhanced features elements
    const saveStatus = document.getElementById('saveStatus');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Auto-save functionality
    let autoSaveTimer;
    const AUTOSAVE_DELAY = 2000; // 2 seconds

    // Initialize enhanced features
    initializeEnhancedFeatures();

    // Risk calculation
    calculateButton.addEventListener('click', function() {
        if (validateForm()) {
            calculateButton.disabled = true;
            calculateButton.textContent = 'Calculating risk assessment...';
            
            setTimeout(() => {
                const riskAssessment = calculateRiskAssessment();
                displayRiskResults(riskAssessment);
                calculateButton.disabled = false;
                calculateButton.textContent = 'Calculate Risk Assessment';
            }, 1500);
        }
    });

    // Reset form
    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all risk evaluation data?')) {
            form.reset();
            riskResults.style.display = 'none';
        }
    });

    // Export report
    exportButton.addEventListener('click', function() {
        exportRiskReport();
    });

    // Save assessment
    saveButton.addEventListener('click', function() {
        saveAssessmentData();
    });

    // New assessment
    newAssessmentButton.addEventListener('click', function() {
        form.reset();
        riskResults.style.display = 'none';
        form.scrollIntoView({ behavior: 'smooth' });
    });

    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        const radioGroups = ['linkage-risk', 'membership-risk', 'attribute-risk', 'inversion-risk', 
                            'privacy-impact', 'discrimination-impact', 'social-impact'];
        
        let isValid = true;
        const missingFields = [];

        // Check required dropdowns
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.style.borderColor = '#dc3545';
                missingFields.push(field.name || field.id);
            }
        });

        // Check required radio groups
        radioGroups.forEach(groupName => {
            const checked = form.querySelector(`input[name="${groupName}"]:checked`);
            if (!checked) {
                isValid = false;
                missingFields.push(groupName);
            }
        });

        if (!isValid) {
            alert('Please complete all required fields and risk ratings before calculating assessment.');
        }

        return isValid;
    }

    function calculateRiskAssessment() {
        const formData = new FormData(form);
        const responses = {};
        
        // Collect responses
        for (let [key, value] of formData.entries()) {
            if (responses[key]) {
                if (Array.isArray(responses[key])) {
                    responses[key].push(value);
                } else {
                    responses[key] = [responses[key], value];
                }
            } else {
                responses[key] = value;
            }
        }

        return {
            overallRisk: calculateOverallRisk(responses),
            riskFactors: assessRiskFactors(responses),
            threatAnalysis: analyzeThreatScenarios(responses),
            impactAssessment: assessImpact(responses),
            recommendations: generateRecommendations(responses),
            priorities: prioritizeActions(responses)
        };
    }

    function calculateOverallRisk(responses) {
        let riskScore = 0;
        let maxScore = 0;

        // Data sensitivity factors (0-30 points)
        const sensitiveDataCount = Array.isArray(responses.sensitiveData) ? responses.sensitiveData.length : 1;
        riskScore += Math.min(sensitiveDataCount * 3, 30);
        maxScore += 30;

        // Dataset size risk (0-20 points)
        const sizeRisks = {
            'very-small': 15, 'small': 10, 'medium': 5, 'large': 2, 'very-large': 1
        };
        riskScore += sizeRisks[responses.datasetSize] || 10;
        maxScore += 20;

        // Population rarity (0-25 points)
        const rarityRisks = {
            'common': 2, 'somewhat-rare': 8, 'rare': 15, 'very-rare': 20, 'extremely-rare': 25
        };
        riskScore += rarityRisks[responses.populationRarity] || 10;
        maxScore += 25;

        // Privacy mechanisms (subtract points for protection)
        const privacyMechanisms = Array.isArray(responses.privacyMechanisms) ? responses.privacyMechanisms : [];
        if (privacyMechanisms.includes('differential-privacy')) riskScore -= 15;
        if (privacyMechanisms.includes('k-anonymity')) riskScore -= 8;
        if (privacyMechanisms.includes('noise-addition')) riskScore -= 10;
        if (privacyMechanisms.includes('none')) riskScore += 20;

        // Attack scenario risks (0-40 points)
        const attackRisks = {
            'low': 2, 'medium': 6, 'high': 12, 'very-high': 20
        };
        riskScore += (attackRisks[responses['linkage-risk']] || 0);
        riskScore += (attackRisks[responses['membership-risk']] || 0);
        riskScore += (attackRisks[responses['attribute-risk']] || 0);
        riskScore += (attackRisks[responses['inversion-risk']] || 0);
        maxScore += 40;

        // Access control (0-20 points)
        const accessRisks = {
            'public': 20, 'registered': 15, 'approved': 10, 'secure-environment': 5, 'internal-only': 2
        };
        riskScore += accessRisks[responses.accessControl] || 10;
        maxScore += 20;

        const riskPercentage = Math.min(100, (riskScore / maxScore) * 100);
        
        let level, description, color;
        if (riskPercentage < 25) {
            level = 'Low';
            description = 'Acceptable risk level with standard safeguards';
            color = 'green';
        } else if (riskPercentage < 50) {
            level = 'Medium';
            description = 'Moderate risk requiring additional controls';
            color = 'yellow';
        } else if (riskPercentage < 75) {
            level = 'High';
            description = 'Significant risk requiring comprehensive mitigation';
            color = 'orange';
        } else {
            level = 'Critical';
            description = 'Unacceptable risk - project may not be suitable';
            color = 'red';
        }

        return {
            score: riskScore,
            percentage: riskPercentage,
            level: level,
            description: description,
            color: color
        };
    }

    function assessRiskFactors(responses) {
        const factors = [];

        // High-risk data types
        const sensitiveData = Array.isArray(responses.sensitiveData) ? responses.sensitiveData : [];
        if (sensitiveData.includes('genetic')) {
            factors.push({
                factor: 'Genetic Data Present',
                severity: 'High',
                description: 'Genetic information poses unique re-identification risks due to family linkages and distinctiveness'
            });
        }
        if (sensitiveData.includes('rare-conditions')) {
            factors.push({
                factor: 'Rare Conditions',
                severity: 'High',
                description: 'Rare conditions create unique identifying signatures that increase re-identification risk'
            });
        }
        if (sensitiveData.includes('longitudinal')) {
            factors.push({
                factor: 'Temporal Patterns',
                severity: 'Medium',
                description: 'Longitudinal data provides additional identifying information through temporal patterns'
            });
        }

        // Technical risks
        const privacyMechanisms = Array.isArray(responses.privacyMechanisms) ? responses.privacyMechanisms : [];
        if (privacyMechanisms.includes('none')) {
            factors.push({
                factor: 'No Privacy Protection',
                severity: 'Critical',
                description: 'Absence of privacy protection mechanisms creates significant re-identification vulnerability'
            });
        }

        // Environmental risks
        if (responses.accessControl === 'public') {
            factors.push({
                factor: 'Public Data Release',
                severity: 'High',
                description: 'Public availability allows unlimited attacker access and analysis time'
            });
        }

        const auxiliaryData = Array.isArray(responses.auxiliaryData) ? responses.auxiliaryData : [];
        if (auxiliaryData.length > 3) {
            factors.push({
                factor: 'Extensive Auxiliary Data',
                severity: 'Medium',
                description: 'Multiple auxiliary data sources enable sophisticated linkage attacks'
            });
        }

        return factors;
    }

    function analyzeThreatScenarios(responses) {
        const scenarios = [];

        const attackRisks = {
            'linkage-risk': 'Linkage Attacks',
            'membership-risk': 'Membership Inference',
            'attribute-risk': 'Attribute Inference',
            'inversion-risk': 'Model Inversion'
        };

        Object.entries(attackRisks).forEach(([key, name]) => {
            const risk = responses[key];
            if (risk === 'high' || risk === 'very-high') {
                scenarios.push({
                    attack: name,
                    likelihood: risk === 'very-high' ? 'Very High' : 'High',
                    description: getAttackDescription(key),
                    mitigation: getAttackMitigation(key)
                });
            }
        });

        return scenarios;
    }

    function getAttackDescription(attackType) {
        const descriptions = {
            'linkage-risk': 'Attackers could link synthetic records to external datasets using quasi-identifiers',
            'membership-risk': 'Attackers could determine if specific individuals were in the source dataset',
            'attribute-risk': 'Attackers could infer sensitive attributes about individuals from data patterns',
            'inversion-risk': 'Attackers could reconstruct source data through model interrogation'
        };
        return descriptions[attackType] || 'Significant privacy risk identified';
    }

    function getAttackMitigation(attackType) {
        const mitigations = {
            'linkage-risk': 'Implement stronger quasi-identifier protection, limit identifying variable combinations',
            'membership-risk': 'Apply differential privacy mechanisms, increase synthetic dataset size',
            'attribute-risk': 'Use attribute suppression, implement correlation breaking techniques',
            'inversion-risk': 'Limit model queries, add noise to model outputs, implement query budgets'
        };
        return mitigations[attackType] || 'Implement comprehensive privacy protections';
    }

    function assessImpact(responses) {
        const impacts = {
            privacy: responses['privacy-impact'] || 'moderate',
            discrimination: responses['discrimination-impact'] || 'moderate',
            social: responses['social-impact'] || 'moderate'
        };

        const orgImpacts = Array.isArray(responses.orgImpact) ? responses.orgImpact : [];

        return {
            individual: impacts,
            organisational: orgImpacts,
            severity: Math.max(
                getSeverityScore(impacts.privacy),
                getSeverityScore(impacts.discrimination),
                getSeverityScore(impacts.social)
            )
        };
    }

    function getSeverityScore(level) {
        const scores = { 'minimal': 1, 'moderate': 2, 'significant': 3, 'severe': 4 };
        return scores[level] || 2;
    }

    function generateRecommendations(responses) {
        const recommendations = [];
        const overallRisk = calculateOverallRisk(responses);

        if (overallRisk.level === 'Critical') {
            recommendations.push({
                priority: 'Immediate',
                category: 'Project Viability',
                action: 'Consider alternative approaches to synthetic data generation',
                justification: 'Critical risk level suggests synthetic data may not be appropriate for this use case'
            });
        }

        if (overallRisk.level === 'High' || overallRisk.level === 'Critical') {
            recommendations.push({
                priority: 'High',
                category: 'Privacy Protection',
                action: 'Implement differential privacy with strong epsilon parameters',
                justification: 'High-risk scenarios require formal privacy guarantees'
            });
        }

        const privacyMechanisms = Array.isArray(responses.privacyMechanisms) ? responses.privacyMechanisms : [];
        if (privacyMechanisms.includes('none') || privacyMechanisms.length < 2) {
            recommendations.push({
                priority: 'High',
                category: 'Technical Controls',
                action: 'Implement multiple privacy protection mechanisms',
                justification: 'Layered privacy protections provide defense in depth'
            });
        }

        if (responses.accessControl === 'public') {
            recommendations.push({
                priority: 'Medium',
                category: 'Access Control',
                action: 'Implement controlled access with user authentication',
                justification: 'Public access increases attack opportunities significantly'
            });
        }

        const securityMeasures = Array.isArray(responses.securityMeasures) ? responses.securityMeasures : [];
        if (securityMeasures.length < 4) {
            recommendations.push({
                priority: 'Medium',
                category: 'Infrastructure Security',
                action: 'Strengthen technical security controls',
                justification: 'Comprehensive security infrastructure reduces attack success probability'
            });
        }

        return recommendations;
    }

    function prioritizeActions(responses) {
        const actions = [];
        const overallRisk = calculateOverallRisk(responses);

        // Immediate actions for high/critical risk
        if (overallRisk.level === 'High' || overallRisk.level === 'Critical') {
            actions.push({
                timeframe: 'Immediate (0-2 weeks)',
                priority: 'Critical',
                actions: [
                    'Implement formal privacy protection mechanisms',
                    'Conduct technical review with privacy experts',
                    'Establish comprehensive monitoring procedures'
                ]
            });
        }

        // Short-term actions
        actions.push({
            timeframe: 'Short-term (2-8 weeks)',
            priority: 'High',
            actions: [
                'Deploy additional technical safeguards',
                'Enhance access control mechanisms',
                'Develop incident response procedures',
                'Conduct staff security training'
            ]
        });

        // Ongoing actions
        actions.push({
            timeframe: 'Ongoing',
            priority: 'Medium',
            actions: [
                'Regular risk assessment reviews',
                'Continuous monitoring of attack patterns',
                'Periodic security audits and assessments',
                'Stay current with privacy attack research'
            ]
        });

        return actions;
    }

    function displayRiskResults(assessment) {
        const html = `
            <div class="risk-summary">
                <div class="overall-risk risk-${assessment.overallRisk.color}">
                    <h3>Overall Risk Level: ${assessment.overallRisk.level}</h3>
                    <div class="risk-score">Risk Score: ${assessment.overallRisk.score} (${Math.round(assessment.overallRisk.percentage)}%)</div>
                    <p>${assessment.overallRisk.description}</p>
                </div>
            </div>

            <div class="results-section">
                <h3>Key Risk Factors</h3>
                <div class="risk-factors">
                    ${assessment.riskFactors.length > 0 ? 
                        assessment.riskFactors.map(factor => `
                            <div class="risk-factor severity-${factor.severity.toLowerCase()}">
                                <h4>${factor.factor} <span class="severity-badge">${factor.severity}</span></h4>
                                <p>${factor.description}</p>
                            </div>
                        `).join('') :
                        '<p>No significant additional risk factors identified.</p>'
                    }
                </div>
            </div>

            <div class="results-section">
                <h3>Threat Scenario Analysis</h3>
                <div class="threat-scenarios">
                    ${assessment.threatAnalysis.length > 0 ?
                        assessment.threatAnalysis.map(scenario => `
                            <div class="threat-scenario">
                                <h4>${scenario.attack} <span class="likelihood-badge">${scenario.likelihood} Likelihood</span></h4>
                                <p><strong>Description:</strong> ${scenario.description}</p>
                                <p><strong>Mitigation:</strong> ${scenario.mitigation}</p>
                            </div>
                        `).join('') :
                        '<p>No high-priority threat scenarios identified.</p>'
                    }
                </div>
            </div>

            <div class="results-section">
                <h3>Impact Assessment</h3>
                <div class="impact-analysis">
                    <h4>Individual Impact Levels</h4>
                    <div class="impact-scores">
                        <div class="impact-item">Privacy Violation: <span class="impact-level">${assessment.impactAssessment.individual.privacy}</span></div>
                        <div class="impact-item">Discrimination Risk: <span class="impact-level">${assessment.impactAssessment.individual.discrimination}</span></div>
                        <div class="impact-item">Social/Psychological: <span class="impact-level">${assessment.impactAssessment.individual.social}</span></div>
                    </div>
                    
                    <h4>Organisational Impact Areas</h4>
                    <div class="org-impacts">
                        ${assessment.impactAssessment.organisational.length > 0 ?
                            assessment.impactAssessment.organisational.map(impact => `<span class="impact-tag">${formatImpactLabel(impact)}</span>`).join('') :
                            '<span class="impact-tag">No specific organisational impacts identified</span>'
                        }
                    </div>
                </div>
            </div>

            <div class="results-section">
                <h3>Priority Recommendations</h3>
                <div class="recommendations">
                    ${assessment.recommendations.map(rec => `
                        <div class="recommendation priority-${rec.priority.toLowerCase()}">
                            <div class="rec-header">
                                <span class="priority-badge">${rec.priority} Priority</span>
                                <strong>${rec.category}: ${rec.action}</strong>
                            </div>
                            <p>${rec.justification}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="results-section">
                <h3>Action Timeline</h3>
                <div class="action-timeline">
                    ${assessment.priorities.map(phase => `
                        <div class="timeline-phase">
                            <h4>${phase.timeframe} <span class="priority-badge">${phase.priority}</span></h4>
                            <ul>
                                ${phase.actions.map(action => `<li>${action}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        resultsContent.innerHTML = html;
        riskResults.style.display = 'block';
        riskResults.scrollIntoView({ behavior: 'smooth' });
    }

    function formatImpactLabel(impact) {
        const labels = {
            'reputation': 'Reputational Damage',
            'legal': 'Legal Liability',
            'financial': 'Financial Impact',
            'operational': 'Operational Disruption',
            'research': 'Research Impact',
            'partnerships': 'Partnership Effects',
            'trust': 'Trust Loss'
        };
        return labels[impact] || impact;
    }

    function exportRiskReport() {
        // Export functionality similar to other tools
        const printWindow = window.open('', '_blank');
        const reportContent = resultsContent.innerHTML;
        
        const reportHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Risk Evaluation Report - SynD-DGF</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
                    .risk-low { background: #e8f5e8; }
                    .risk-medium { background: #fff3cd; }
                    .risk-high { background: #fce8e8; }
                    .risk-critical { background: #f8d7da; }
                    .risk-factor, .threat-scenario, .recommendation { 
                        border: 1px solid #ddd; padding: 1rem; margin: 0.5rem 0; 
                    }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SynD-DGF Risk Evaluation Report</h1>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                ${reportContent}
                <div class="no-print">
                    <button onclick="window.print()">Print Report</button>
                    <button onclick="window.close()">Close</button>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(reportHTML);
        printWindow.document.close();
    }

    function saveAssessmentData() {
        const formData = new FormData(form);
        const assessmentData = {
            id: `risk-eval-${Date.now()}`,
            timestamp: new Date().toISOString(),
            title: `Risk Evaluation - ${new Date().toLocaleDateString()}`,
            responses: Object.fromEntries(formData.entries()),
            results: resultsContent.innerHTML,
            progress: calculateProgress()
        };

        // Save to history
        let assessmentHistory = JSON.parse(localStorage.getItem('riskEvaluationHistory') || '[]');
        const existingIndex = assessmentHistory.findIndex(item => item.id === assessmentData.id);

        if (existingIndex >= 0) {
            assessmentHistory[existingIndex] = assessmentData;
        } else {
            assessmentHistory.unshift(assessmentData);
            // Keep only last 20 assessments
            assessmentHistory = assessmentHistory.slice(0, 20);
        }

        localStorage.setItem('riskEvaluationHistory', JSON.stringify(assessmentHistory));
        localStorage.setItem('riskEvaluationAssessment', JSON.stringify(assessmentData));

        updateSaveStatus('saved', 'Assessment saved successfully');
        setTimeout(() => updateSaveStatus('ready', 'Ready to start'), 3000);
    }

    function initializeEnhancedFeatures() {
        // Load previous assessment if available
        loadPreviousAssessment();

        // Set up auto-save
        setupAutoSave();

        // Set up enhanced button handlers
        setupEnhancedButtons();

        // Update progress initially
        updateProgress();
    }

    function setupAutoSave() {
        // Auto-save on form changes
        form.addEventListener('change', function() {
            clearTimeout(autoSaveTimer);
            updateSaveStatus('saving', 'Saving changes...');

            autoSaveTimer = setTimeout(() => {
                autoSaveAssessment();
            }, AUTOSAVE_DELAY);

            updateProgress();
        });

        form.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            updateSaveStatus('saving', 'Saving changes...');

            autoSaveTimer = setTimeout(() => {
                autoSaveAssessment();
            }, AUTOSAVE_DELAY);

            updateProgress();
        });
    }

    function autoSaveAssessment() {
        const formData = new FormData(form);
        const assessmentData = {
            timestamp: new Date().toISOString(),
            responses: Object.fromEntries(formData.entries()),
            progress: calculateProgress()
        };

        localStorage.setItem('riskEvaluationDraft', JSON.stringify(assessmentData));
        updateSaveStatus('saved', 'Changes saved automatically');

        // Reset status after 3 seconds
        setTimeout(() => {
            updateSaveStatus('ready', 'Ready to continue');
        }, 3000);
    }

    function updateSaveStatus(status, message) {
        const indicator = saveStatus.querySelector('.status-indicator');
        const text = saveStatus.querySelector('.status-text');

        // Remove all status classes
        indicator.classList.remove('saving', 'saved', 'error');

        // Add new status class
        if (status !== 'ready') {
            indicator.classList.add(status);
        }

        text.textContent = message;
    }

    function calculateProgress() {
        const formData = new FormData(form);
        const responses = Object.fromEntries(formData.entries());

        // Required fields for progress calculation
        const requiredFields = [
            'datasetSize', 'populationRarity', 'syntheticMethod', 'accessControl', 'attackerCapability',
            'linkage-risk', 'membership-risk', 'attribute-risk', 'inversion-risk',
            'privacy-impact', 'discrimination-impact', 'social-impact'
        ];

        const completedFields = requiredFields.filter(field => responses[field]).length;
        return Math.round((completedFields / requiredFields.length) * 100);
    }

    function updateProgress() {
        const progress = calculateProgress();
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}% Complete`;

        // Enable generate report button if progress > 80%
        if (progress > 80) {
            generateReportBtn.disabled = false;
            generateReportBtn.textContent = 'Generate Report';
        } else {
            generateReportBtn.disabled = true;
            generateReportBtn.textContent = 'Complete Assessment First';
        }
    }

    function loadPreviousAssessment() {
        const savedDraft = localStorage.getItem('riskEvaluationDraft');
        if (savedDraft) {
            try {
                const draftData = JSON.parse(savedDraft);

                // Restore form values
                Object.entries(draftData.responses).forEach(([key, value]) => {
                    const element = form.querySelector(`[name="${key}"]`);
                    if (element) {
                        if (element.type === 'checkbox' || element.type === 'radio') {
                            const specificElement = form.querySelector(`[name="${key}"][value="${value}"]`);
                            if (specificElement) {
                                specificElement.checked = true;
                            }
                        } else {
                            element.value = value;
                        }
                    }
                });

                updateSaveStatus('ready', 'Previous work restored');
                updateProgress();
            } catch (error) {
                console.error('Error loading previous assessment:', error);
            }
        }
    }

    function setupEnhancedButtons() {
        // Generate Report button
        generateReportBtn.addEventListener('click', function() {
            if (calculateProgress() > 80) {
                if (validateForm()) {
                    calculateButton.click();
                }
            }
        });

        // View History button
        viewHistoryBtn.addEventListener('click', function() {
            showAssessmentHistory();
        });
    }

    function showAssessmentHistory() {
        const history = JSON.parse(localStorage.getItem('riskEvaluationHistory') || '[]');

        if (history.length === 0) {
            alert('No previous assessments found.');
            return;
        }

        // Create modal for history
        const modal = document.createElement('div');
        modal.className = 'assessment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Assessment History</h3>
                    <button class="modal-close" onclick="this.closest('.assessment-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="history-list">
                        ${history.map(assessment => `
                            <div class="history-item" data-id="${assessment.id}">
                                <div class="history-info">
                                    <strong>${assessment.title}</strong>
                                    <div class="history-meta">
                                        <span class="history-date">${new Date(assessment.timestamp).toLocaleString()}</span>
                                        <span class="history-progress">${assessment.progress}% complete</span>
                                    </div>
                                </div>
                                <div class="history-actions">
                                    <button class="btn-load" onclick="loadAssessment('${assessment.id}')">Load</button>
                                    <button class="btn-delete" onclick="deleteAssessment('${assessment.id}')">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-clear-all" onclick="clearAllHistory()">Clear All History</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Global functions for modal actions
    window.loadAssessment = function(assessmentId) {
        const history = JSON.parse(localStorage.getItem('riskEvaluationHistory') || '[]');
        const assessment = history.find(item => item.id === assessmentId);

        if (assessment) {
            // Clear current form
            form.reset();

            // Load assessment data
            Object.entries(assessment.responses).forEach(([key, value]) => {
                const element = form.querySelector(`[name="${key}"]`);
                if (element) {
                    if (element.type === 'checkbox' || element.type === 'radio') {
                        const specificElement = form.querySelector(`[name="${key}"][value="${value}"]`);
                        if (specificElement) {
                            specificElement.checked = true;
                        }
                    } else {
                        element.value = value;
                    }
                }
            });

            // Load results if available
            if (assessment.results) {
                resultsContent.innerHTML = assessment.results;
                riskResults.style.display = 'block';
            }

            updateProgress();
            updateSaveStatus('ready', 'Assessment loaded successfully');

            // Close modal
            document.querySelector('.assessment-modal').remove();

            // Scroll to top
            form.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.deleteAssessment = function(assessmentId) {
        if (confirm('Are you sure you want to delete this assessment?')) {
            let history = JSON.parse(localStorage.getItem('riskEvaluationHistory') || '[]');
            history = history.filter(item => item.id !== assessmentId);
            localStorage.setItem('riskEvaluationHistory', JSON.stringify(history));

            // Refresh modal content
            document.querySelector('.assessment-modal').remove();
            showAssessmentHistory();
        }
    };

    window.clearAllHistory = function() {
        if (confirm('Are you sure you want to clear all assessment history? This cannot be undone.')) {
            localStorage.removeItem('riskEvaluationHistory');
            localStorage.removeItem('riskEvaluationDraft');
            document.querySelector('.assessment-modal').remove();
            updateSaveStatus('ready', 'History cleared');
        }
    };

    // Add CSS styles
    const riskStyle = document.createElement('style');
    riskStyle.textContent = `
        .tool-header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .tool-icon-large {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .evaluation-section {
            margin-bottom: 2rem;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        .risk-category {
            margin-bottom: 2rem;
        }

        .question-group {
            margin-bottom: 1.5rem;
        }

        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 0.5rem;
            margin-top: 0.5rem;
        }

        .attack-scenarios .scenario-item {
            border: 1px solid #dee2e6;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 6px;
            background: #f8f9fa;
        }

        .risk-rating {
            margin-top: 0.5rem;
        }

        .radio-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .impact-scenarios .impact-item {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-left: 4px solid #007bff;
            background: #f8f9fa;
        }

        .form-actions {
            text-align: center;
            margin: 2rem 0;
            padding-top: 2rem;
            border-top: 2px solid #e0e0e0;
        }

        .button2 {
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 1rem;
        }

        .risk-results {
            margin-top: 2rem;
            padding: 2rem;
            border: 2px solid #007bff;
            border-radius: 8px;
            background: #f8f9fa;
        }

        .risk-summary {
            text-align: center;
            margin-bottom: 2rem;
        }

        .overall-risk {
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }

        .risk-green { background: #e8f5e8; border: 2px solid #28a745; }
        .risk-yellow { background: #fff3cd; border: 2px solid #ffc107; }
        .risk-orange { background: #ffe8d1; border: 2px solid #fd7e14; }
        .risk-red { background: #fce8e8; border: 2px solid #dc3545; }

        .risk-score {
            font-size: 1.2rem;
            font-weight: bold;
            margin: 0.5rem 0;
        }

        .results-section {
            margin-bottom: 2rem;
            background: white;
            padding: 1.5rem;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .risk-factor {
            border: 1px solid #dee2e6;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }

        .severity-high { border-left: 4px solid #dc3545; }
        .severity-medium { border-left: 4px solid #ffc107; }
        .severity-critical { border-left: 4px solid #6f42c1; }

        .severity-badge {
            background: #e9ecef;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-left: 0.5rem;
        }

        .threat-scenario {
            border: 1px solid #dee2e6;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }

        .likelihood-badge {
            background: #ffc107;
            color: #333;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-left: 0.5rem;
        }

        .impact-scores {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }

        .impact-item {
            padding: 0.5rem;
            background: #f8f9fa;
            border-radius: 4px;
        }

        .impact-level {
            font-weight: bold;
            text-transform: capitalize;
        }

        .org-impacts {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .impact-tag {
            background: #e9ecef;
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.9rem;
        }

        .recommendation {
            border: 1px solid #dee2e6;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }

        .priority-immediate { border-left: 4px solid #dc3545; }
        .priority-high { border-left: 4px solid #fd7e14; }
        .priority-medium { border-left: 4px solid #ffc107; }

        .rec-header {
            margin-bottom: 0.5rem;
        }

        .priority-badge {
            background: #007bff;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-right: 0.5rem;
        }

        .timeline-phase {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-left: 4px solid #007bff;
            background: #f8f9fa;
        }

        .results-actions {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 2px solid #e0e0e0;
        }

        .results-actions button {
            margin: 0 0.5rem;
        }

        /* Enhanced Features Modal Styles */
        .assessment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            background: #f8f9fa;
        }

        .modal-header h3 {
            margin: 0;
            color: #333;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-close:hover {
            color: #333;
        }

        .modal-body {
            padding: 20px;
            max-height: 50vh;
            overflow-y: auto;
        }

        .modal-footer {
            padding: 15px 20px;
            border-top: 1px solid #e0e0e0;
            background: #f8f9fa;
            text-align: center;
        }

        .history-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #f8f9fa;
            transition: background 0.3s ease;
        }

        .history-item:hover {
            background: #e9ecef;
        }

        .history-info {
            flex: 1;
        }

        .history-info strong {
            display: block;
            color: #333;
            margin-bottom: 5px;
        }

        .history-meta {
            display: flex;
            gap: 15px;
            font-size: 0.9rem;
            color: #666;
        }

        .history-actions {
            display: flex;
            gap: 10px;
        }

        .history-actions button {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.3s ease;
        }

        .btn-load {
            background: #007bff;
            color: white;
        }

        .btn-load:hover {
            background: #0056b3;
        }

        .btn-delete {
            background: #dc3545;
            color: white;
        }

        .btn-delete:hover {
            background: #c82333;
        }

        .btn-clear-all {
            background: #6c757d;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-clear-all:hover {
            background: #5a6268;
        }

        /* Responsive design for modal */
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                margin: 10px;
            }

            .history-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .history-actions {
                width: 100%;
                justify-content: flex-end;
            }

            .history-meta {
                flex-direction: column;
                gap: 5px;
            }
        }
    `;

    document.head.appendChild(riskStyle);
});