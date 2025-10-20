// Quality Metrics Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('qualityMetricsForm');
    const calculateButton = document.getElementById('calculateQuality');
    const resetButton = document.getElementById('resetQualityForm');
    const qualityResults = document.getElementById('qualityResults');
    const resultsContent = document.getElementById('qualityResultsContent');
    const exportButton = document.getElementById('exportQualityReport');
    const saveButton = document.getElementById('saveQualityAssessment');
    const newAssessmentButton = document.getElementById('newQualityAssessment');

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

    // Calculate quality assessment
    calculateButton.addEventListener('click', function() {
        if (validateForm()) {
            calculateButton.disabled = true;
            calculateButton.textContent = 'Calculating quality metrics...';
            
            setTimeout(() => {
                const qualityAssessment = calculateQualityMetrics();
                displayQualityResults(qualityAssessment);
                calculateButton.disabled = false;
                calculateButton.textContent = 'Calculate Quality Assessment';
            }, 1500);
        }
    });

    // Reset form
    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all quality assessment data?')) {
            form.reset();
            qualityResults.style.display = 'none';
        }
    });

    // Export report
    exportButton.addEventListener('click', function() {
        exportQualityReport();
    });

    // Save assessment
    saveButton.addEventListener('click', function() {
        saveQualityAssessmentData();
    });

    // New assessment
    newAssessmentButton.addEventListener('click', function() {
        form.reset();
        qualityResults.style.display = 'none';
        form.scrollIntoView({ behavior: 'smooth' });
    });

    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        const missingFields = [];

        requiredFields.forEach(field => {
            if (!field.value || field.value === '') {
                isValid = false;
                field.style.borderColor = '#dc3545';
                missingFields.push(field.name || field.id);
                
                // Remove error styling when user starts typing
                field.addEventListener('change', function() {
                    this.style.borderColor = '';
                }, { once: true });
            }
        });

        if (!isValid) {
            alert('Please complete all required fields before calculating quality assessment.');
        }

        return isValid;
    }

    function calculateQualityMetrics() {
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
            scores: calculateDimensionScores(responses),
            overallScore: calculateOverallScore(responses),
            recommendations: generateQualityRecommendations(responses),
            strengths: identifyStrengths(responses),
            weaknesses: identifyWeaknesses(responses),
            nextSteps: generateNextSteps(responses)
        };
    }

    function calculateDimensionScores(responses) {
        const dimensions = {
            statisticalFidelity: calculateStatisticalFidelityScore(responses),
            utilityPreservation: calculateUtilityScore(responses),
            privacyProtection: calculatePrivacyScore(responses)
        };

        return dimensions;
    }

    function calculateStatisticalFidelityScore(responses) {
        const metrics = [
            'meanPreservation',
            'variancePreservation', 
            'distributionShape',
            'outlierPreservation',
            'rangePreservation',
            'correlationAccuracy',
            'covarianceMatrix',
            'conditionalDistributions',
            'interactions'
        ];

        let totalScore = 0;
        let assessedMetrics = 0;

        metrics.forEach(metric => {
            const value = responses[metric];
            if (value && value !== 'not-assessed') {
                assessedMetrics++;
                totalScore += getMetricScore(value);
            }
        });

        return {
            score: assessedMetrics > 0 ? Math.round(totalScore / assessedMetrics) : 0,
            assessedCount: assessedMetrics,
            totalMetrics: metrics.length
        };
    }

    function calculateUtilityScore(responses) {
        const metrics = [
            'analysisAccuracy',
            'modelPerformance',
            'featureImportance',
            'clinicalPatterns',
            'epidemiologicalMeasures',
            'temporalPatterns'
        ];

        let totalScore = 0;
        let assessedMetrics = 0;

        metrics.forEach(metric => {
            const value = responses[metric];
            if (value && value !== 'not-assessed' && value !== 'not-applicable') {
                assessedMetrics++;
                totalScore += getMetricScore(value);
            }
        });

        return {
            score: assessedMetrics > 0 ? Math.round(totalScore / assessedMetrics) : 0,
            assessedCount: assessedMetrics,
            totalMetrics: metrics.length
        };
    }

    function calculatePrivacyScore(responses) {
        const metrics = [
            'membershipInference',
            'recordSimilarity',
            'attributeInference',
            'sensitiveCorrelations',
            'differentialPrivacy',
            'privacyBudget'
        ];

        let totalScore = 0;
        let assessedMetrics = 0;

        metrics.forEach(metric => {
            const value = responses[metric];
            if (value && value !== 'not-assessed' && value !== 'not-applicable' && value !== 'not-implemented') {
                assessedMetrics++;
                totalScore += getMetricScore(value);
            }
        });

        return {
            score: assessedMetrics > 0 ? Math.round(totalScore / assessedMetrics) : 0,
            assessedCount: assessedMetrics,
            totalMetrics: metrics.length
        };
    }

    function getMetricScore(value) {
        const scoreMap = {
            'excellent': 100,
            'good': 80,
            'acceptable': 60,
            'poor': 30
        };
        return scoreMap[value] || 0;
    }

    function calculateOverallScore(responses) {
        const dimensions = calculateDimensionScores(responses);
        const overallRatings = {
            fidelity: responses.overallFidelity,
            utility: responses.overallUtility,
            privacy: responses.overallPrivacy
        };

        // Weight the scores
        let weightedScore = 0;
        let totalWeight = 0;

        if (dimensions.statisticalFidelity.assessedCount > 0) {
            weightedScore += dimensions.statisticalFidelity.score * 0.35;
            totalWeight += 0.35;
        }
        
        if (dimensions.utilityPreservation.assessedCount > 0) {
            weightedScore += dimensions.utilityPreservation.score * 0.40;
            totalWeight += 0.40;
        }
        
        if (dimensions.privacyProtection.assessedCount > 0) {
            weightedScore += dimensions.privacyProtection.score * 0.25;
            totalWeight += 0.25;
        }

        // Incorporate overall ratings
        let overallRatingScore = 0;
        let ratingCount = 0;
        
        Object.values(overallRatings).forEach(rating => {
            if (rating) {
                overallRatingScore += getMetricScore(rating);
                ratingCount++;
            }
        });

        if (ratingCount > 0) {
            overallRatingScore = overallRatingScore / ratingCount;
        }

        // Combine technical metrics with overall ratings
        const finalScore = totalWeight > 0 ? 
            Math.round((weightedScore / totalWeight * 0.7) + (overallRatingScore * 0.3)) : 
            overallRatingScore;

        let level, description, color;
        if (finalScore >= 90) {
            level = 'Excellent';
            description = 'Outstanding synthetic data quality across all dimensions';
            color = 'green';
        } else if (finalScore >= 75) {
            level = 'Good';
            description = 'High quality synthetic data with minor areas for improvement';
            color = 'blue';
        } else if (finalScore >= 60) {
            level = 'Acceptable';
            description = 'Adequate quality but benefits from enhancement';
            color = 'yellow';
        } else {
            level = 'Poor';
            description = 'Quality issues require significant attention';
            color = 'red';
        }

        return {
            score: finalScore,
            level: level,
            description: description,
            color: color
        };
    }

    function generateQualityRecommendations(responses) {
        const recommendations = [];
        const dimensions = calculateDimensionScores(responses);

        // Statistical fidelity recommendations
        if (dimensions.statisticalFidelity.score < 70) {
            recommendations.push({
                category: 'Statistical Fidelity',
                priority: 'High',
                issue: 'Statistical properties not well preserved',
                action: 'Review and tune synthetic data generation parameters',
                details: 'Focus on distribution matching and correlation preservation techniques'
            });
        }

        // Utility recommendations
        if (dimensions.utilityPreservation.score < 70) {
            recommendations.push({
                category: 'Utility Preservation',
                priority: 'High',
                issue: 'Synthetic data utility is limited for intended analyses',
                action: 'Optimize generation method for specific use case requirements',
                details: 'Consider task-specific generation approaches or post-processing'
            });
        }

        // Privacy recommendations
        if (dimensions.privacyProtection.score < 70) {
            recommendations.push({
                category: 'Privacy Protection',
                priority: 'Critical',
                issue: 'Privacy protection measures are inadequate',
                action: 'Implement stronger privacy guarantees',
                details: 'Consider differential privacy or enhanced data protection mechanisms'
            });
        }

        // Specific metric recommendations
        const poorMetrics = [];
        ['meanPreservation', 'variancePreservation', 'distributionShape', 'correlationAccuracy'].forEach(metric => {
            if (responses[metric] === 'poor') {
                poorMetrics.push(metric);
            }
        });

        if (poorMetrics.length > 0) {
            recommendations.push({
                category: 'Statistical Accuracy',
                priority: 'Medium',
                issue: `Poor performance on: ${poorMetrics.join(', ')}`,
                action: 'Implement targeted improvements for failing metrics',
                details: 'Focus on specific statistical properties that are poorly preserved'
            });
        }

        return recommendations;
    }

    function identifyStrengths(responses) {
        const strengths = [];
        const dimensions = calculateDimensionScores(responses);

        if (dimensions.statisticalFidelity.score >= 80) {
            strengths.push('Excellent statistical fidelity - synthetic data closely matches source data properties');
        }

        if (dimensions.utilityPreservation.score >= 80) {
            strengths.push('High utility preservation - synthetic data strongly supports intended analyses');
        }

        if (dimensions.privacyProtection.score >= 80) {
            strengths.push('Strong privacy protection - good safeguards against re-identification attacks');
        }

        // Check for excellent individual metrics
        const excellentMetrics = [];
        Object.entries(responses).forEach(([key, value]) => {
            if (value === 'excellent' && key !== 'overallFidelity' && key !== 'overallUtility' && key !== 'overallPrivacy') {
                excellentMetrics.push(key);
            }
        });

        if (excellentMetrics.length > 3) {
            strengths.push(`Multiple metrics achieving excellent performance (${excellentMetrics.length} metrics)`);
        }

        return strengths;
    }

    function identifyWeaknesses(responses) {
        const weaknesses = [];
        const dimensions = calculateDimensionScores(responses);

        if (dimensions.statisticalFidelity.score < 60) {
            weaknesses.push('Statistical fidelity concerns - significant discrepancies from source data');
        }

        if (dimensions.utilityPreservation.score < 60) {
            weaknesses.push('Limited utility for intended analyses - may not support research goals');
        }

        if (dimensions.privacyProtection.score < 60) {
            weaknesses.push('Privacy protection weaknesses - increased re-identification risk');
        }

        // Check for poor individual metrics
        const poorMetrics = [];
        Object.entries(responses).forEach(([key, value]) => {
            if (value === 'poor') {
                poorMetrics.push(formatMetricName(key));
            }
        });

        if (poorMetrics.length > 0) {
            weaknesses.push(`Poor performance on: ${poorMetrics.slice(0, 3).join(', ')}${poorMetrics.length > 3 ? ' and others' : ''}`);
        }

        return weaknesses;
    }

    function formatMetricName(metric) {
        const names = {
            'meanPreservation': 'Mean Preservation',
            'variancePreservation': 'Variance Preservation',
            'distributionShape': 'Distribution Shape',
            'correlationAccuracy': 'Correlation Accuracy',
            'analysisAccuracy': 'Analysis Accuracy',
            'modelPerformance': 'Model Performance',
            'membershipInference': 'Membership Inference Protection',
            'attributeInference': 'Attribute Inference Protection'
        };
        return names[metric] || metric;
    }

    function generateNextSteps(responses) {
        const steps = [];
        const overallScore = calculateOverallScore(responses);

        if (overallScore.level === 'Poor') {
            steps.push({
                priority: 'Immediate',
                timeframe: '1-2 weeks',
                action: 'Comprehensive review of synthetic data generation approach',
                description: 'Fundamental changes needed to generation method or parameters'
            });
        }

        if (overallScore.level === 'Acceptable' || overallScore.level === 'Poor') {
            steps.push({
                priority: 'High',
                timeframe: '2-4 weeks', 
                action: 'Implement targeted quality improvements',
                description: 'Focus on specific metrics showing poor performance'
            });
        }

        steps.push({
            priority: 'Medium',
            timeframe: 'Ongoing',
            action: 'Establish quality monitoring process',
            description: 'Regular assessment of quality metrics throughout project lifecycle'
        });

        if (responses.qualityIssues && responses.qualityIssues.trim()) {
            steps.push({
                priority: 'High',
                timeframe: '1-3 weeks',
                action: 'Address identified quality issues',
                description: responses.qualityIssues.trim()
            });
        }

        return steps;
    }

    function displayQualityResults(assessment) {
        const html = `
            <div class="quality-scorecard">
                <div class="overall-score score-${assessment.overallScore.color}">
                    <h3>Overall Quality Score: ${assessment.overallScore.score}/100</h3>
                    <div class="quality-level">${assessment.overallScore.level}</div>
                    <p>${assessment.overallScore.description}</p>
                </div>
                
                <div class="dimension-scores">
                    <div class="dimension-score">
                        <h4>Statistical Fidelity</h4>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${assessment.scores.statisticalFidelity.score}%"></div>
                        </div>
                        <span class="score-value">${assessment.scores.statisticalFidelity.score}/100</span>
                        <span class="score-meta">(${assessment.scores.statisticalFidelity.assessedCount}/${assessment.scores.statisticalFidelity.totalMetrics} metrics assessed)</span>
                    </div>
                    
                    <div class="dimension-score">
                        <h4>Utility Preservation</h4>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${assessment.scores.utilityPreservation.score}%"></div>
                        </div>
                        <span class="score-value">${assessment.scores.utilityPreservation.score}/100</span>
                        <span class="score-meta">(${assessment.scores.utilityPreservation.assessedCount}/${assessment.scores.utilityPreservation.totalMetrics} metrics assessed)</span>
                    </div>
                    
                    <div class="dimension-score">
                        <h4>Privacy Protection</h4>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${assessment.scores.privacyProtection.score}%"></div>
                        </div>
                        <span class="score-value">${assessment.scores.privacyProtection.score}/100</span>
                        <span class="score-meta">(${assessment.scores.privacyProtection.assessedCount}/${assessment.scores.privacyProtection.totalMetrics} metrics assessed)</span>
                    </div>
                </div>
            </div>

            <div class="results-section">
                <h3>Key Strengths</h3>
                <div class="strengths-list">
                    ${assessment.strengths.length > 0 ? 
                        assessment.strengths.map(strength => `<div class="strength-item">✅ ${strength}</div>`).join('') :
                        '<div class="no-items">Complete quality assessment to identify strengths</div>'
                    }
                </div>
            </div>

            <div class="results-section">
                <h3>Areas for Improvement</h3>
                <div class="weaknesses-list">
                    ${assessment.weaknesses.length > 0 ? 
                        assessment.weaknesses.map(weakness => `<div class="weakness-item">⚠️ ${weakness}</div>`).join('') :
                        '<div class="no-items">No significant weaknesses identified</div>'
                    }
                </div>
            </div>

            <div class="results-section">
                <h3>Quality Improvement Recommendations</h3>
                <div class="recommendations-list">
                    ${assessment.recommendations.map(rec => `
                        <div class="recommendation-item priority-${rec.priority.toLowerCase()}">
                            <div class="rec-header">
                                <span class="priority-badge">${rec.priority}</span>
                                <strong>${rec.category}: ${rec.issue}</strong>
                            </div>
                            <div class="rec-action">
                                <strong>Recommended Action:</strong> ${rec.action}
                            </div>
                            <div class="rec-details">${rec.details}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="results-section">
                <h3>Next Steps Timeline</h3>
                <div class="next-steps-timeline">
                    ${assessment.nextSteps.map(step => `
                        <div class="timeline-step priority-${step.priority.toLowerCase()}">
                            <div class="step-header">
                                <span class="priority-badge">${step.priority}</span>
                                <strong>${step.action}</strong>
                                <span class="timeframe-badge">${step.timeframe}</span>
                            </div>
                            <p>${step.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        resultsContent.innerHTML = html;
        qualityResults.style.display = 'block';
        qualityResults.scrollIntoView({ behavior: 'smooth' });
    }

    function exportQualityReport() {
        const printWindow = window.open('', '_blank');
        const reportContent = resultsContent.innerHTML;
        
        const reportHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Quality Metrics Report - SynD-DGF</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
                    .quality-scorecard { border: 2px solid #007bff; padding: 1.5rem; margin-bottom: 2rem; }
                    .dimension-score { margin: 1rem 0; }
                    .score-bar { width: 200px; height: 20px; background: #e0e0e0; margin: 0.5rem 0; }
                    .score-fill { height: 100%; background: #007bff; }
                    .recommendation-item { border: 1px solid #ddd; padding: 1rem; margin: 0.5rem 0; }
                    .priority-critical { border-left: 4px solid #dc3545; }
                    .priority-high { border-left: 4px solid #fd7e14; }
                    .priority-medium { border-left: 4px solid #ffc107; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SynD-DGF Quality Metrics Report</h1>
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

    function saveQualityAssessmentData() {
        const formData = new FormData(form);
        const assessmentData = {
            id: `quality-metrics-${Date.now()}`,
            timestamp: new Date().toISOString(),
            title: `Quality Assessment - ${new Date().toLocaleDateString()}`,
            responses: Object.fromEntries(formData.entries()),
            results: resultsContent.innerHTML,
            progress: calculateProgress()
        };

        // Save to history
        let assessmentHistory = JSON.parse(localStorage.getItem('qualityMetricsHistory') || '[]');
        const existingIndex = assessmentHistory.findIndex(item => item.id === assessmentData.id);

        if (existingIndex >= 0) {
            assessmentHistory[existingIndex] = assessmentData;
        } else {
            assessmentHistory.unshift(assessmentData);
            // Keep only last 20 assessments
            assessmentHistory = assessmentHistory.slice(0, 20);
        }

        localStorage.setItem('qualityMetricsHistory', JSON.stringify(assessmentHistory));
        localStorage.setItem('qualityMetricsAssessment', JSON.stringify(assessmentData));

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

        localStorage.setItem('qualityMetricsDraft', JSON.stringify(assessmentData));
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
            'meanPreservation', 'variancePreservation', 'distributionShape', 'outlierPreservation', 'rangePreservation',
            'correlationAccuracy', 'covarianceMatrix', 'conditionalDistributions', 'interactions',
            'analysisAccuracy', 'modelPerformance', 'featureImportance',
            'membershipInference', 'recordSimilarity', 'attributeInference',
            'overallFidelity', 'overallUtility', 'overallPrivacy'
        ];

        const completedFields = requiredFields.filter(field => responses[field] && responses[field] !== '').length;
        return Math.round((completedFields / requiredFields.length) * 100);
    }

    function updateProgress() {
        const progress = calculateProgress();
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}% Complete`;

        // Enable generate report button if progress > 70%
        if (progress > 70) {
            generateReportBtn.disabled = false;
            generateReportBtn.textContent = 'Generate Scorecard';
        } else {
            generateReportBtn.disabled = true;
            generateReportBtn.textContent = 'Complete Assessment First';
        }
    }

    function loadPreviousAssessment() {
        const savedDraft = localStorage.getItem('qualityMetricsDraft');
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
            if (calculateProgress() > 70) {
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
        const history = JSON.parse(localStorage.getItem('qualityMetricsHistory') || '[]');

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
                                    <button class="btn-load" onclick="loadQualityAssessment('${assessment.id}')">Load</button>
                                    <button class="btn-delete" onclick="deleteQualityAssessment('${assessment.id}')">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-clear-all" onclick="clearQualityHistory()">Clear All History</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Global functions for modal actions
    window.loadQualityAssessment = function(assessmentId) {
        const history = JSON.parse(localStorage.getItem('qualityMetricsHistory') || '[]');
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
                qualityResults.style.display = 'block';
            }

            updateProgress();
            updateSaveStatus('ready', 'Assessment loaded successfully');

            // Close modal
            document.querySelector('.assessment-modal').remove();

            // Scroll to top
            form.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.deleteQualityAssessment = function(assessmentId) {
        if (confirm('Are you sure you want to delete this assessment?')) {
            let history = JSON.parse(localStorage.getItem('qualityMetricsHistory') || '[]');
            history = history.filter(item => item.id !== assessmentId);
            localStorage.setItem('qualityMetricsHistory', JSON.stringify(history));

            // Refresh modal content
            document.querySelector('.assessment-modal').remove();
            showAssessmentHistory();
        }
    };

    window.clearQualityHistory = function() {
        if (confirm('Are you sure you want to clear all assessment history? This cannot be undone.')) {
            localStorage.removeItem('qualityMetricsHistory');
            localStorage.removeItem('qualityMetricsDraft');
            document.querySelector('.assessment-modal').remove();
            updateSaveStatus('ready', 'History cleared');
        }
    };

    // Add CSS styles
    const qualityStyle = document.createElement('style');
    qualityStyle.textContent = `
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

        .metrics-section {
            margin-bottom: 2rem;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        .metrics-category {
            margin-bottom: 2rem;
        }

        .metric-group {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 6px;
        }

        .metric-evaluation {
            margin-bottom: 1rem;
        }

        .question-group {
            margin-bottom: 1.5rem;
        }

        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 0.5rem;
            margin-top: 0.5rem;
        }

        .overall-evaluation {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
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

        .quality-results {
            margin-top: 2rem;
            padding: 2rem;
            border: 2px solid #007bff;
            border-radius: 8px;
            background: #f8f9fa;
        }

        .quality-scorecard {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .overall-score {
            text-align: center;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }

        .score-green { background: #e8f5e8; border: 2px solid #28a745; }
        .score-blue { background: #e7f3ff; border: 2px solid #007bff; }
        .score-yellow { background: #fff3cd; border: 2px solid #ffc107; }
        .score-red { background: #fce8e8; border: 2px solid #dc3545; }

        .quality-level {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0.5rem 0;
        }

        .dimension-scores {
            display: grid;
            gap: 1rem;
        }

        .dimension-score {
            display: grid;
            grid-template-columns: 150px 1fr auto auto;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            background: #f8f9fa;
            border-radius: 4px;
        }

        .score-bar {
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
        }

        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%);
            transition: width 0.5s ease;
        }

        .score-value {
            font-weight: bold;
            color: #333;
        }

        .score-meta {
            font-size: 0.8rem;
            color: #6c757d;
        }

        .results-section {
            margin-bottom: 2rem;
            background: white;
            padding: 1.5rem;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .strength-item, .weakness-item {
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            border-radius: 4px;
        }

        .strength-item {
            background: #e8f5e8;
            border-left: 4px solid #28a745;
        }

        .weakness-item {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
        }

        .no-items {
            padding: 1rem;
            color: #6c757d;
            font-style: italic;
            text-align: center;
        }

        .recommendation-item {
            border: 1px solid #dee2e6;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }

        .priority-critical { border-left: 4px solid #dc3545; }
        .priority-high { border-left: 4px solid #fd7e14; }
        .priority-medium { border-left: 4px solid #ffc107; }

        .rec-header {
            margin-bottom: 0.5rem;
        }

        .rec-action {
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .rec-details {
            color: #6c757d;
            font-size: 0.9rem;
        }

        .priority-badge {
            background: #007bff;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-right: 0.5rem;
        }

        .timeline-step {
            border: 1px solid #dee2e6;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }

        .step-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
        }

        .timeframe-badge {
            background: #e9ecef;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-left: auto;
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

    document.head.appendChild(qualityStyle);
});