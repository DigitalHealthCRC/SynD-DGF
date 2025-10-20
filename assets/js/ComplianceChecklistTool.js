// Compliance Checklist Tool - JavaScript functionality
// Manages compliance tracking, progress calculations, and reporting

class ComplianceChecklistTool {
    constructor() {
        this.requirements = {};
        this.completionStats = {
            mandatory: { completed: 0, total: 0 },
            conditional: { completed: 0, total: 0 },
            recommended: { completed: 0, total: 0 }
        };
        this.autoSaveTimer = null;
        this.AUTOSAVE_DELAY = 2000; // 2 seconds
        this.init();
    }

    init() {
        this.loadSavedProgress();
        this.bindEvents();
        this.bindEnhancedFeatures();
        this.updateDashboard();
        this.updateProgressBars();
        this.initializeEnhancedFeatures();
    }

    loadSavedProgress() {
        const savedProgress = localStorage.getItem('synd-compliance-progress');
        if (savedProgress) {
            try {
                this.requirements = JSON.parse(savedProgress);
                this.restoreCheckboxStates();
            } catch (e) {
                console.warn('Could not load saved progress:', e);
            }
        }
    }

    restoreCheckboxStates() {
        Object.keys(this.requirements).forEach(requirementId => {
            const checkbox = document.getElementById(requirementId);
            if (checkbox) {
                checkbox.checked = this.requirements[requirementId];
            }
        });
    }

    bindEvents() {
        // Bind all checkbox change events
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleRequirementChange(e.target);
            });
        });

        // Bind export button
        const exportBtn = document.getElementById('export-report');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReport());
        }

        // Bind clear progress button
        const clearBtn = document.getElementById('clear-progress');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearProgress());
        }

        // Bind step navigation
        document.querySelectorAll('[data-step-nav]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stepId = e.target.getAttribute('data-step-nav');
                this.navigateToStep(stepId);
            });
        });

        // Bind main action buttons
        const calculateButton = document.getElementById('calculateCompliance');
        const saveButton = document.getElementById('saveChecklist');
        const resetButton = document.getElementById('resetChecklist');

        if (calculateButton) {
            calculateButton.addEventListener('click', () => this.generateComplianceReport());
        }

        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveToHistory());
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetChecklist());
        }
    }

    bindEnhancedFeatures() {
        // Enhanced features elements
        const generateReportBtn = document.getElementById('generateReportBtn');
        const viewHistoryBtn = document.getElementById('viewHistoryBtn');

        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => {
                if (this.calculateProgress() > 20) {
                    this.generateComplianceReport();
                }
            });
        }

        if (viewHistoryBtn) {
            viewHistoryBtn.addEventListener('click', () => {
                this.showComplianceHistory();
            });
        }
    }

    handleRequirementChange(checkbox) {
        const requirementId = checkbox.id;
        const isChecked = checkbox.checked;

        // Update requirements object
        this.requirements[requirementId] = isChecked;

        // Auto-save with debouncing
        this.debouncedAutoSave();

        // Update dashboard and progress bars
        this.updateDashboard();
        this.updateProgressBars();
        this.updateEnhancedProgress();

        // Add visual feedback
        this.addVisualFeedback(checkbox, isChecked);
    }

    debouncedAutoSave() {
        clearTimeout(this.autoSaveTimer);
        this.updateSaveStatus('saving', 'Saving changes...');

        this.autoSaveTimer = setTimeout(() => {
            this.autoSaveProgress();
        }, this.AUTOSAVE_DELAY);
    }

    autoSaveProgress() {
        const assessmentData = {
            timestamp: new Date().toISOString(),
            requirements: this.requirements,
            progress: this.calculateProgress()
        };

        localStorage.setItem('complianceChecklistDraft', JSON.stringify(assessmentData));
        this.updateSaveStatus('saved', 'Changes saved automatically');

        // Reset status after 3 seconds
        setTimeout(() => {
            this.updateSaveStatus('ready', 'Ready to continue');
        }, 3000);
    }

    updateSaveStatus(status, message) {
        const saveStatus = document.getElementById('saveStatus');
        if (saveStatus) {
            const indicator = saveStatus.querySelector('.status-indicator');
            const text = saveStatus.querySelector('.status-text');

            if (indicator && text) {
                // Remove all status classes
                indicator.classList.remove('saving', 'saved', 'error');

                // Add new status class
                if (status !== 'ready') {
                    indicator.classList.add(status);
                }

                text.textContent = message;
            }
        }
    }

    calculateProgress() {
        const totalCompleted = this.completionStats.mandatory.completed +
                              this.completionStats.conditional.completed +
                              this.completionStats.recommended.completed;

        const totalRequirements = this.completionStats.mandatory.total +
                                 this.completionStats.conditional.total +
                                 this.completionStats.recommended.total;

        return totalRequirements > 0
            ? Math.round((totalCompleted / totalRequirements) * 100)
            : 0;
    }

    updateEnhancedProgress() {
        const progress = this.calculateProgress();
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const generateReportBtn = document.getElementById('generateReportBtn');

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        if (progressText) {
            progressText.textContent = `${progress}% Complete`;
        }

        // Enable generate report button if progress > 20%
        if (generateReportBtn) {
            if (progress > 20) {
                generateReportBtn.disabled = false;
                generateReportBtn.textContent = 'Generate Report';
            } else {
                generateReportBtn.disabled = true;
                generateReportBtn.textContent = 'Complete More Items First';
            }
        }
    }

    initializeEnhancedFeatures() {
        // Load previous draft if available
        this.loadPreviousDraft();

        // Update enhanced progress initially
        this.updateEnhancedProgress();

        // Initialize save status
        this.updateSaveStatus('ready', 'Ready to start');
    }

    loadPreviousDraft() {
        const savedDraft = localStorage.getItem('complianceChecklistDraft');
        if (savedDraft) {
            try {
                const draftData = JSON.parse(savedDraft);

                // Restore requirements
                this.requirements = draftData.requirements || {};
                this.restoreCheckboxStates();

                this.updateSaveStatus('ready', 'Previous work restored');
            } catch (error) {
                console.error('Error loading previous draft:', error);
            }
        }
    }

    addVisualFeedback(checkbox, isChecked) {
        const requirementItem = checkbox.closest('.requirement-item');
        if (requirementItem) {
            if (isChecked) {
                requirementItem.classList.add('completed');
                requirementItem.classList.remove('pending');
            } else {
                requirementItem.classList.remove('completed');
                requirementItem.classList.add('pending');
            }
        }
    }

    saveProgress() {
        localStorage.setItem('synd-compliance-progress', JSON.stringify(this.requirements));
        localStorage.setItem('synd-compliance-last-updated', new Date().toISOString());
    }

    updateDashboard() {
        // Reset stats
        this.completionStats = {
            mandatory: { completed: 0, total: 0 },
            conditional: { completed: 0, total: 0 },
            recommended: { completed: 0, total: 0 }
        };

        // Count requirements by type
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const requirementType = this.getRequirementType(checkbox);
            
            this.completionStats[requirementType].total++;
            
            if (checkbox.checked) {
                this.completionStats[requirementType].completed++;
            }
        });

        // Update dashboard numbers
        this.updateDashboardNumbers();
        this.updateOverallProgress();
    }

    getRequirementType(checkbox) {
        const requirementItem = checkbox.closest('.requirement-item');
        if (requirementItem) {
            if (requirementItem.classList.contains('mandatory')) return 'mandatory';
            if (requirementItem.classList.contains('conditional')) return 'conditional';
            if (requirementItem.classList.contains('recommended')) return 'recommended';
        }
        return 'recommended'; // default
    }

    updateDashboardNumbers() {
        // Update mandatory requirements
        const mandatoryCompleted = document.getElementById('mandatory-completed');
        const mandatoryTotal = document.getElementById('mandatory-total');
        const mandatoryProgress = document.getElementById('mandatory-progress');
        
        if (mandatoryCompleted && mandatoryTotal && mandatoryProgress) {
            mandatoryCompleted.textContent = this.completionStats.mandatory.completed;
            mandatoryTotal.textContent = this.completionStats.mandatory.total;
            const mandatoryPercentage = this.completionStats.mandatory.total > 0 
                ? Math.round((this.completionStats.mandatory.completed / this.completionStats.mandatory.total) * 100) 
                : 0;
            mandatoryProgress.textContent = `${mandatoryPercentage}%`;
        }

        // Update conditional requirements
        const conditionalCompleted = document.getElementById('conditional-completed');
        const conditionalTotal = document.getElementById('conditional-total');
        const conditionalProgress = document.getElementById('conditional-progress');
        
        if (conditionalCompleted && conditionalTotal && conditionalProgress) {
            conditionalCompleted.textContent = this.completionStats.conditional.completed;
            conditionalTotal.textContent = this.completionStats.conditional.total;
            const conditionalPercentage = this.completionStats.conditional.total > 0 
                ? Math.round((this.completionStats.conditional.completed / this.completionStats.conditional.total) * 100) 
                : 0;
            conditionalProgress.textContent = `${conditionalPercentage}%`;
        }

        // Update recommended requirements
        const recommendedCompleted = document.getElementById('recommended-completed');
        const recommendedTotal = document.getElementById('recommended-total');
        const recommendedProgress = document.getElementById('recommended-progress');
        
        if (recommendedCompleted && recommendedTotal && recommendedProgress) {
            recommendedCompleted.textContent = this.completionStats.recommended.completed;
            recommendedTotal.textContent = this.completionStats.recommended.total;
            const recommendedPercentage = this.completionStats.recommended.total > 0 
                ? Math.round((this.completionStats.recommended.completed / this.completionStats.recommended.total) * 100) 
                : 0;
            recommendedProgress.textContent = `${recommendedPercentage}%`;
        }
    }

    updateOverallProgress() {
        const totalCompleted = this.completionStats.mandatory.completed + 
                              this.completionStats.conditional.completed + 
                              this.completionStats.recommended.completed;
        
        const totalRequirements = this.completionStats.mandatory.total + 
                                 this.completionStats.conditional.total + 
                                 this.completionStats.recommended.total;

        const overallPercentage = totalRequirements > 0 
            ? Math.round((totalCompleted / totalRequirements) * 100) 
            : 0;

        const overallProgressElement = document.getElementById('overall-progress');
        const overallStatusElement = document.getElementById('overall-status');
        
        if (overallProgressElement) {
            overallProgressElement.textContent = `${overallPercentage}%`;
        }

        if (overallStatusElement) {
            let status = 'In Progress';
            let statusClass = 'status-in-progress';
            
            if (overallPercentage === 100) {
                status = 'Complete';
                statusClass = 'status-complete';
            } else if (overallPercentage === 0) {
                status = 'Not Started';
                statusClass = 'status-not-started';
            }
            
            overallStatusElement.textContent = status;
            overallStatusElement.className = `compliance-status ${statusClass}`;
        }

        // Update compliance readiness
        this.updateComplianceReadiness();
    }

    updateComplianceReadiness() {
        const mandatoryComplete = this.completionStats.mandatory.completed === this.completionStats.mandatory.total;
        const readinessElement = document.getElementById('compliance-readiness');
        
        if (readinessElement) {
            if (mandatoryComplete && this.completionStats.mandatory.total > 0) {
                readinessElement.innerHTML = '<span class="text-success">✓ Ready for Implementation</span>';
            } else {
                const remaining = this.completionStats.mandatory.total - this.completionStats.mandatory.completed;
                readinessElement.innerHTML = `<span class="text-warning">⚠ ${remaining} mandatory requirements remaining</span>`;
            }
        }
    }

    updateProgressBars() {
        // Update mandatory progress bar
        this.updateProgressBar('mandatory-bar', this.completionStats.mandatory);
        
        // Update conditional progress bar
        this.updateProgressBar('conditional-bar', this.completionStats.conditional);
        
        // Update recommended progress bar
        this.updateProgressBar('recommended-bar', this.completionStats.recommended);
        
        // Update overall progress bar
        const totalCompleted = this.completionStats.mandatory.completed + 
                              this.completionStats.conditional.completed + 
                              this.completionStats.recommended.completed;
        
        const totalRequirements = this.completionStats.mandatory.total + 
                                 this.completionStats.conditional.total + 
                                 this.completionStats.recommended.total;
        
        this.updateProgressBar('overall-bar', { 
            completed: totalCompleted, 
            total: totalRequirements 
        });
    }

    updateProgressBar(barId, stats) {
        const progressBar = document.getElementById(barId);
        if (progressBar && stats.total > 0) {
            const percentage = Math.round((stats.completed / stats.total) * 100);
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
            
            // Update color based on completion
            progressBar.className = `progress-bar ${this.getProgressBarClass(percentage)}`;
        }
    }

    getProgressBarClass(percentage) {
        if (percentage === 100) return 'bg-success';
        if (percentage >= 75) return 'bg-info';
        if (percentage >= 50) return 'bg-warning';
        return 'bg-danger';
    }

    navigateToStep(stepId) {
        const stepSection = document.getElementById(stepId);
        if (stepSection) {
            stepSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Highlight the section briefly
            stepSection.classList.add('highlight-section');
            setTimeout(() => {
                stepSection.classList.remove('highlight-section');
            }, 2000);
        }
    }

    exportReport() {
        const reportData = this.generateReportData();
        const reportHtml = this.generateReportHtml(reportData);
        
        // Create and download PDF
        this.downloadAsPDF(reportHtml, 'synd-compliance-checklist-report.pdf');
    }

    generateReportData() {
        const reportData = {
            generatedDate: new Date().toLocaleDateString('en-AU'),
            overallProgress: this.calculateOverallProgress(),
            completionStats: this.completionStats,
            requirements: {},
            recommendations: this.generateRecommendations()
        };

        // Group requirements by step
        const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'cross-cutting'];
        steps.forEach(stepId => {
            const stepSection = document.getElementById(stepId);
            if (stepSection) {
                const stepTitle = stepSection.querySelector('h3')?.textContent || stepId;
                reportData.requirements[stepId] = {
                    title: stepTitle,
                    requirements: []
                };

                stepSection.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    const label = checkbox.nextElementSibling?.textContent || '';
                    const requirementType = this.getRequirementType(checkbox);
                    
                    reportData.requirements[stepId].requirements.push({
                        id: checkbox.id,
                        label: label.trim(),
                        type: requirementType,
                        completed: checkbox.checked
                    });
                });
            }
        });

        return reportData;
    }

    calculateOverallProgress() {
        const totalCompleted = this.completionStats.mandatory.completed + 
                              this.completionStats.conditional.completed + 
                              this.completionStats.recommended.completed;
        
        const totalRequirements = this.completionStats.mandatory.total + 
                                 this.completionStats.conditional.total + 
                                 this.completionStats.recommended.total;

        return totalRequirements > 0 
            ? Math.round((totalCompleted / totalRequirements) * 100) 
            : 0;
    }

    generateRecommendations() {
        const recommendations = [];
        
        // Check mandatory completion
        if (this.completionStats.mandatory.completed < this.completionStats.mandatory.total) {
            recommendations.push({
                priority: 'High',
                category: 'Mandatory Requirements',
                text: `Complete ${this.completionStats.mandatory.total - this.completionStats.mandatory.completed} remaining mandatory requirements before implementation.`
            });
        }

        // Check conditional completion
        if (this.completionStats.conditional.completed < this.completionStats.conditional.total) {
            recommendations.push({
                priority: 'Medium',
                category: 'Conditional Requirements',
                text: `Review ${this.completionStats.conditional.total - this.completionStats.conditional.completed} conditional requirements for applicability to your use case.`
            });
        }

        // Check recommended completion
        if (this.completionStats.recommended.completed < this.completionStats.recommended.total) {
            recommendations.push({
                priority: 'Low',
                category: 'Recommended Requirements',
                text: `Consider implementing ${this.completionStats.recommended.total - this.completionStats.recommended.completed} recommended requirements for enhanced compliance.`
            });
        }

        // Overall completion recommendation
        const overallProgress = this.calculateOverallProgress();
        if (overallProgress === 100) {
            recommendations.push({
                priority: 'Info',
                category: 'Implementation Ready',
                text: 'All requirements completed. Your organisation is ready to proceed with synthetic data implementation.'
            });
        } else if (overallProgress >= 75) {
            recommendations.push({
                priority: 'Medium',
                category: 'Near Completion',
                text: 'Strong progress made. Focus on completing remaining requirements for full compliance.'
            });
        }

        return recommendations;
    }

    generateReportHtml(reportData) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>SynD Compliance Checklist Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                .header { border-bottom: 2px solid #004d9f; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { color: #004d9f; margin-bottom: 5px; }
                .summary { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
                .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
                .summary-item { text-align: center; }
                .summary-number { font-size: 2em; font-weight: bold; color: #004d9f; }
                .step-section { margin-bottom: 30px; }
                .step-section h3 { color: #004d9f; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                .requirement-list { margin-left: 20px; }
                .requirement-item { margin-bottom: 8px; display: flex; align-items: center; }
                .requirement-status { width: 20px; height: 20px; display: inline-block; margin-right: 10px; border-radius: 3px; }
                .completed { background-color: #28a745; }
                .incomplete { background-color: #dc3545; }
                .requirement-type { 
                    display: inline-block; 
                    padding: 2px 8px; 
                    border-radius: 12px; 
                    font-size: 0.8em; 
                    margin-left: 10px; 
                    color: white; 
                }
                .mandatory { background-color: #dc3545; }
                .conditional { background-color: #fd7e14; }
                .recommended { background-color: #6c757d; }
                .recommendations { background: #e3f2fd; padding: 20px; border-radius: 5px; margin-top: 30px; }
                .recommendation { margin-bottom: 15px; padding: 10px; border-left: 4px solid #004d9f; background: white; }
                .priority-high { border-left-color: #dc3545; }
                .priority-medium { border-left-color: #fd7e14; }
                .priority-low { border-left-color: #28a745; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SynD Compliance Checklist Report</h1>
                <p>Generated on ${reportData.generatedDate}</p>
            </div>
            
            <div class="summary">
                <h2>Compliance Summary</h2>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-number">${reportData.overallProgress}%</div>
                        <div>Overall Progress</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${reportData.completionStats.mandatory.completed}/${reportData.completionStats.mandatory.total}</div>
                        <div>Mandatory</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${reportData.completionStats.conditional.completed}/${reportData.completionStats.conditional.total}</div>
                        <div>Conditional</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${reportData.completionStats.recommended.completed}/${reportData.completionStats.recommended.total}</div>
                        <div>Recommended</div>
                    </div>
                </div>
            </div>
            
            ${Object.keys(reportData.requirements).map(stepId => {
                const step = reportData.requirements[stepId];
                return `
                <div class="step-section">
                    <h3>${step.title}</h3>
                    <div class="requirement-list">
                        ${step.requirements.map(req => `
                            <div class="requirement-item">
                                <span class="requirement-status ${req.completed ? 'completed' : 'incomplete'}"></span>
                                <span>${req.label}</span>
                                <span class="requirement-type ${req.type}">${req.type}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                `;
            }).join('')}
            
            <div class="recommendations">
                <h2>Recommendations</h2>
                ${reportData.recommendations.map(rec => `
                    <div class="recommendation priority-${rec.priority.toLowerCase()}">
                        <strong>${rec.priority} Priority - ${rec.category}:</strong>
                        <p>${rec.text}</p>
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
        `;
    }

    downloadAsPDF(htmlContent, filename) {
        // Create a blob with the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.replace('.pdf', '.html'); // Download as HTML since we can't generate PDF client-side
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        // Show success message
        this.showSuccessMessage('Report downloaded successfully! Open the HTML file in your browser and use Print to PDF for a PDF version.');
    }

    clearProgress() {
        if (confirm('Are you sure you want to clear all progress? This action cannot be undone.')) {
            // Clear stored data
            localStorage.removeItem('synd-compliance-progress');
            localStorage.removeItem('synd-compliance-last-updated');
            localStorage.removeItem('complianceChecklistDraft');

            // Reset requirements object
            this.requirements = {};

            // Uncheck all checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
                this.addVisualFeedback(checkbox, false);
            });

            // Update dashboard
            this.updateDashboard();
            this.updateProgressBars();
            this.updateEnhancedProgress();

            this.showSuccessMessage('Progress cleared successfully.');
        }
    }

    resetChecklist() {
        this.clearProgress();
    }

    saveToHistory() {
        const assessmentData = {
            id: `compliance-${Date.now()}`,
            timestamp: new Date().toISOString(),
            title: `Compliance Assessment - ${new Date().toLocaleDateString()}`,
            requirements: this.requirements,
            completionStats: this.completionStats,
            progress: this.calculateProgress()
        };

        // Save to history
        let assessmentHistory = JSON.parse(localStorage.getItem('complianceChecklistHistory') || '[]');
        const existingIndex = assessmentHistory.findIndex(item => item.id === assessmentData.id);

        if (existingIndex >= 0) {
            assessmentHistory[existingIndex] = assessmentData;
        } else {
            assessmentHistory.unshift(assessmentData);
            // Keep only last 20 assessments
            assessmentHistory = assessmentHistory.slice(0, 20);
        }

        localStorage.setItem('complianceChecklistHistory', JSON.stringify(assessmentHistory));
        localStorage.setItem('synd-compliance-progress', JSON.stringify(this.requirements));

        this.updateSaveStatus('saved', 'Assessment saved to history');
        setTimeout(() => this.updateSaveStatus('ready', 'Ready to continue'), 3000);
    }

    generateComplianceReport() {
        const reportData = this.generateReportData();

        // Display results
        const resultsContent = document.getElementById('complianceResultsContent');
        const complianceResults = document.getElementById('complianceResults');

        if (resultsContent && complianceResults) {
            resultsContent.innerHTML = this.generateReportResultsHtml(reportData);
            complianceResults.style.display = 'block';
            complianceResults.scrollIntoView({ behavior: 'smooth' });
        }
    }

    generateReportResultsHtml(reportData) {
        return `
            <div class="compliance-summary-card">
                <div class="overall-compliance">
                    <h3>Overall Compliance Status: ${reportData.overallProgress}%</h3>
                    <div class="progress-visualization">
                        <div class="progress-bar-large">
                            <div class="progress-fill-large" style="width: ${reportData.overallProgress}%"></div>
                        </div>
                    </div>
                </div>

                <div class="compliance-breakdown">
                    <div class="breakdown-item">
                        <h4>Mandatory Requirements</h4>
                        <div class="breakdown-stats">
                            <span class="stats-number">${reportData.completionStats.mandatory.completed}/${reportData.completionStats.mandatory.total}</span>
                            <span class="stats-percentage">${Math.round((reportData.completionStats.mandatory.completed / reportData.completionStats.mandatory.total) * 100) || 0}%</span>
                        </div>
                    </div>

                    <div class="breakdown-item">
                        <h4>Conditional Requirements</h4>
                        <div class="breakdown-stats">
                            <span class="stats-number">${reportData.completionStats.conditional.completed}/${reportData.completionStats.conditional.total}</span>
                            <span class="stats-percentage">${Math.round((reportData.completionStats.conditional.completed / reportData.completionStats.conditional.total) * 100) || 0}%</span>
                        </div>
                    </div>

                    <div class="breakdown-item">
                        <h4>Recommended Requirements</h4>
                        <div class="breakdown-stats">
                            <span class="stats-number">${reportData.completionStats.recommended.completed}/${reportData.completionStats.recommended.total}</span>
                            <span class="stats-percentage">${Math.round((reportData.completionStats.recommended.completed / reportData.completionStats.recommended.total) * 100) || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="recommendations-section">
                <h3>Priority Recommendations</h3>
                <div class="recommendations-list">
                    ${reportData.recommendations.map(rec => `
                        <div class="recommendation-item priority-${rec.priority.toLowerCase()}">
                            <div class="rec-header">
                                <span class="priority-badge">${rec.priority}</span>
                                <strong>${rec.category}</strong>
                            </div>
                            <p>${rec.text}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="next-steps-section">
                <h3>Next Steps</h3>
                <div class="next-steps-list">
                    ${this.generateNextSteps(reportData).map(step => `
                        <div class="next-step-item">
                            <div class="step-priority">${step.priority}</div>
                            <div class="step-content">
                                <h4>${step.action}</h4>
                                <p>${step.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateNextSteps(reportData) {
        const steps = [];

        if (reportData.completionStats.mandatory.completed < reportData.completionStats.mandatory.total) {
            steps.push({
                priority: 'Immediate',
                action: 'Complete mandatory requirements',
                description: `${reportData.completionStats.mandatory.total - reportData.completionStats.mandatory.completed} mandatory requirements must be completed before implementation.`
            });
        }

        if (reportData.overallProgress >= 80) {
            steps.push({
                priority: 'High',
                action: 'Prepare for implementation',
                description: 'Strong compliance foundation established. Begin final implementation preparations.'
            });
        }

        steps.push({
            priority: 'Medium',
            action: 'Schedule regular compliance reviews',
            description: 'Establish ongoing compliance monitoring and review processes.'
        });

        return steps;
    }

    showComplianceHistory() {
        const history = JSON.parse(localStorage.getItem('complianceChecklistHistory') || '[]');

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
                    <h3>Compliance Assessment History</h3>
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
                                    <button class="btn-load" onclick="complianceTool.loadComplianceAssessment('${assessment.id}')">Load</button>
                                    <button class="btn-delete" onclick="complianceTool.deleteComplianceAssessment('${assessment.id}')">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-clear-all" onclick="complianceTool.clearComplianceHistory()">Clear All History</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    loadComplianceAssessment(assessmentId) {
        const history = JSON.parse(localStorage.getItem('complianceChecklistHistory') || '[]');
        const assessment = history.find(item => item.id === assessmentId);

        if (assessment) {
            // Clear current state
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
                this.addVisualFeedback(checkbox, false);
            });

            // Load assessment data
            this.requirements = assessment.requirements || {};
            this.restoreCheckboxStates();

            // Update displays
            this.updateDashboard();
            this.updateProgressBars();
            this.updateEnhancedProgress();

            this.updateSaveStatus('ready', 'Assessment loaded successfully');

            // Close modal
            document.querySelector('.assessment-modal').remove();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    deleteComplianceAssessment(assessmentId) {
        if (confirm('Are you sure you want to delete this assessment?')) {
            let history = JSON.parse(localStorage.getItem('complianceChecklistHistory') || '[]');
            history = history.filter(item => item.id !== assessmentId);
            localStorage.setItem('complianceChecklistHistory', JSON.stringify(history));

            // Refresh modal content
            document.querySelector('.assessment-modal').remove();
            this.showComplianceHistory();
        }
    }

    clearComplianceHistory() {
        if (confirm('Are you sure you want to clear all assessment history? This cannot be undone.')) {
            localStorage.removeItem('complianceChecklistHistory');
            localStorage.removeItem('complianceChecklistDraft');
            document.querySelector('.assessment-modal').remove();
            this.updateSaveStatus('ready', 'History cleared');
        }
    }

    showSuccessMessage(message) {
        // Create and show success message
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(alertDiv, mainContent.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 5000);
        }
    }
}

// Initialize the tool when DOM is loaded
let complianceTool;
document.addEventListener('DOMContentLoaded', function() {
    complianceTool = new ComplianceChecklistTool();
    // Expose globally for modal functions
    window.complianceTool = complianceTool;
});

// Add CSS for visual feedback
const style = document.createElement('style');
style.textContent = `
    .requirement-item.completed {
        background-color: #d4edda;
        border-left: 4px solid #28a745;
        padding-left: 15px;
        transition: all 0.3s ease;
    }
    
    .requirement-item.pending {
        background-color: #f8f9fa;
        border-left: 4px solid #dee2e6;
        padding-left: 15px;
        transition: all 0.3s ease;
    }
    
    .highlight-section {
        background-color: #fff3cd;
        border: 2px solid #ffeaa7;
        border-radius: 5px;
        transition: all 0.3s ease;
    }
    
    .progress-bar {
        transition: width 0.5s ease;
    }
    
    .compliance-status {
        padding: 4px 12px;
        border-radius: 15px;
        font-weight: bold;
        font-size: 0.9em;
    }
    
    .status-complete {
        background-color: #d4edda;
        color: #155724;
    }
    
    .status-in-progress {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .status-not-started {
        background-color: #f8d7da;
        color: #721c24;
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

    /* Compliance Report Results Styles */
    .compliance-summary-card {
        background: white;
        border-radius: 10px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .overall-compliance h3 {
        text-align: center;
        color: #004d9f;
        margin-bottom: 20px;
    }

    .progress-bar-large {
        width: 100%;
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
        margin: 20px 0;
    }

    .progress-fill-large {
        height: 100%;
        background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%);
        transition: width 0.5s ease;
    }

    .compliance-breakdown {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 25px;
    }

    .breakdown-item {
        text-align: center;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .breakdown-item h4 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 1rem;
    }

    .breakdown-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .stats-number {
        font-size: 1.2rem;
        font-weight: bold;
        color: #004d9f;
    }

    .stats-percentage {
        font-size: 1rem;
        color: #666;
    }

    .recommendations-section, .next-steps-section {
        background: white;
        border-radius: 10px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .recommendation-item {
        border: 1px solid #dee2e6;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
    }

    .priority-immediate { border-left: 4px solid #dc3545; }
    .priority-high { border-left: 4px solid #fd7e14; }
    .priority-medium { border-left: 4px solid #ffc107; }
    .priority-low { border-left: 4px solid #28a745; }

    .rec-header {
        margin-bottom: 10px;
    }

    .priority-badge {
        background: #007bff;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        margin-right: 10px;
    }

    .next-step-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        padding: 15px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        margin-bottom: 15px;
    }

    .step-priority {
        background: #004d9f;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: bold;
        white-space: nowrap;
    }

    .step-content h4 {
        margin: 0 0 8px 0;
        color: #333;
    }

    .step-content p {
        margin: 0;
        color: #666;
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

        .compliance-breakdown {
            grid-template-columns: 1fr;
        }

        .next-step-item {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);