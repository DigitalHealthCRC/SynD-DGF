// Use Case Assessment Tool - JavaScript functionality
// Comprehensive assessment tool for synthetic data suitability evaluation

class UseCaseAssessmentTool {
    constructor() {
        this.currentSection = 1;
        this.maxSections = 5;
        this.formData = {};
        this.assessmentResults = {};
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedProgress();
        this.updateSectionVisibility();
        this.updateProgressIndicator();
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('next-section').addEventListener('click', () => this.nextSection());
        document.getElementById('prev-section').addEventListener('click', () => this.prevSection());
        document.getElementById('calculate-assessment').addEventListener('click', () => this.calculateAssessment());

        // Result buttons
        document.getElementById('save-assessment')?.addEventListener('click', () => this.saveAssessment());
        document.getElementById('export-assessment')?.addEventListener('click', () => this.exportAssessment());
        document.getElementById('start-framework')?.addEventListener('click', () => this.startFramework());
        document.getElementById('new-assessment')?.addEventListener('click', () => this.newAssessment());

        // Form change events
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateFormData();
                this.autoSaveProgress();
            });
        });
    }

    loadSavedProgress() {
        const savedData = localStorage.getItem('synd-use-case-assessment');
        if (savedData) {
            try {
                this.formData = JSON.parse(savedData);
                this.restoreFormState();
            } catch (e) {
                console.warn('Could not load saved progress:', e);
            }
        }
    }

    restoreFormState() {
        Object.keys(this.formData).forEach(fieldName => {
            const value = this.formData[fieldName];
            
            if (Array.isArray(value)) {
                // Handle checkbox groups
                value.forEach(val => {
                    const checkbox = document.querySelector(`input[name="${fieldName}"][value="${val}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            } else {
                // Handle radio buttons
                const radio = document.querySelector(`input[name="${fieldName}"][value="${value}"]`);
                if (radio) radio.checked = true;
            }
        });
    }

    updateFormData() {
        const form = document.getElementById('use-case-assessment-form');
        const formData = new FormData(form);
        
        this.formData = {};
        
        // Handle radio buttons and single checkboxes
        for (let [key, value] of formData.entries()) {
            if (this.formData[key]) {
                // Multiple values for same name (checkboxes)
                if (!Array.isArray(this.formData[key])) {
                    this.formData[key] = [this.formData[key]];
                }
                this.formData[key].push(value);
            } else {
                this.formData[key] = value;
            }
        }

        // Handle checkbox groups explicitly
        const checkboxGroups = ['data_types', 'privacy_regulations'];
        checkboxGroups.forEach(groupName => {
            const checkedBoxes = document.querySelectorAll(`input[name="${groupName}"]:checked`);
            if (checkedBoxes.length > 0) {
                this.formData[groupName] = Array.from(checkedBoxes).map(cb => cb.value);
            }
        });
    }

    autoSaveProgress() {
        localStorage.setItem('synd-use-case-assessment', JSON.stringify(this.formData));
        localStorage.setItem('synd-use-case-assessment-section', this.currentSection.toString());
    }

    nextSection() {
        if (this.validateCurrentSection()) {
            this.currentSection++;
            this.updateSectionVisibility();
            this.updateProgressIndicator();
            this.scrollToTop();
        }
    }

    prevSection() {
        if (this.currentSection > 1) {
            this.currentSection--;
            this.updateSectionVisibility();
            this.updateProgressIndicator();
            this.scrollToTop();
        }
    }

    validateCurrentSection() {
        const currentSectionElement = document.getElementById(`section-${this.currentSection}`);
        const requiredFields = currentSectionElement.querySelectorAll('input[type="radio"]');
        const radioGroups = new Set();
        
        requiredFields.forEach(radio => radioGroups.add(radio.name));
        
        for (let groupName of radioGroups) {
            const checkedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
            if (!checkedRadio) {
                this.showValidationError(`Please answer all questions in this section.`);
                return false;
            }
        }
        
        return true;
    }

    showValidationError(message) {
        // Remove existing alerts
        document.querySelectorAll('.validation-alert').forEach(alert => alert.remove());
        
        // Create and show alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning validation-alert';
        alertDiv.innerHTML = `<strong>Validation Error:</strong> ${message}`;
        
        const currentSectionElement = document.getElementById(`section-${this.currentSection}`);
        currentSectionElement.insertBefore(alertDiv, currentSectionElement.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }

    updateSectionVisibility() {
        // Hide all sections
        for (let i = 1; i <= this.maxSections; i++) {
            const section = document.getElementById(`section-${i}`);
            if (section) {
                section.style.display = 'none';
            }
        }
        
        // Show current section
        const currentSectionElement = document.getElementById(`section-${this.currentSection}`);
        if (currentSectionElement) {
            currentSectionElement.style.display = 'block';
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prev-section');
        const nextBtn = document.getElementById('next-section');
        const calculateBtn = document.getElementById('calculate-assessment');
        
        prevBtn.style.display = this.currentSection > 1 ? 'inline-block' : 'none';
        
        if (this.currentSection === this.maxSections) {
            nextBtn.style.display = 'none';
            calculateBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            calculateBtn.style.display = 'none';
        }
    }

    updateProgressIndicator() {
        for (let i = 1; i <= this.maxSections; i++) {
            const stepElement = document.getElementById(`step-indicator-${i}`);
            const stepNumber = stepElement.querySelector('.step-number');
            
            if (i < this.currentSection) {
                stepElement.className = 'progress-step completed';
                stepNumber.className = 'step-number completed';
                stepNumber.textContent = '✓';
            } else if (i === this.currentSection) {
                stepElement.className = 'progress-step active';
                stepNumber.className = 'step-number active';
                stepNumber.textContent = i.toString();
            } else {
                stepElement.className = 'progress-step';
                stepNumber.className = 'step-number';
                stepNumber.textContent = i.toString();
            }
        }
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    calculateAssessment() {
        if (!this.validateCurrentSection()) return;
        
        this.updateFormData();
        this.assessmentResults = this.performAssessment();
        this.displayResults();
        
        // Update progress indicator for results
        const resultsStep = document.getElementById('step-indicator-results');
        resultsStep.className = 'progress-step active';
        resultsStep.querySelector('.step-number').className = 'step-number active';
    }

    performAssessment() {
        const scores = {
            purposeAlignment: this.calculatePurposeScore(),
            dataCharacteristics: this.calculateDataScore(),
            technicalFeasibility: this.calculateTechnicalScore(),
            riskCompliance: this.calculateRiskScore(),
            resourceAvailability: this.calculateResourceScore()
        };
        
        const overallScore = this.calculateOverallScore(scores);
        const suitabilityRating = this.getSuitabilityRating(overallScore);
        const recommendations = this.generateRecommendations(scores, overallScore);
        const nextSteps = this.generateNextSteps(overallScore, scores);
        
        return {
            scores,
            overallScore,
            suitabilityRating,
            recommendations,
            nextSteps,
            timestamp: new Date().toISOString()
        };
    }

    calculatePurposeScore() {
        let score = 70; // Base score
        
        // Primary purpose scoring
        const purposeScores = {
            'research': 95,
            'ml_training': 90,
            'analytics': 85,
            'data_sharing': 80,
            'testing': 75
        };
        
        if (this.formData.primary_purpose) {
            score = purposeScores[this.formData.primary_purpose] || score;
        }
        
        // Organisation type adjustments
        const orgAdjustments = {
            'research': 10,
            'healthcare': 5,
            'government': 0,
            'industry': -5,
            'ngo': 0
        };
        
        if (this.formData.organisation_type) {
            score += orgAdjustments[this.formData.organisation_type] || 0;
        }
        
        // Sharing scope adjustments
        const sharingAdjustments = {
            'internal': 10,
            'partners': 5,
            'research_community': 0,
            'public': -10
        };
        
        if (this.formData.sharing_scope) {
            score += sharingAdjustments[this.formData.sharing_scope] || 0;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    calculateDataScore() {
        let score = 70; // Base score
        
        // Dataset size scoring (larger datasets generally better for synthetic data)
        const sizeScores = {
            'small': 40,
            'medium': 70,
            'large': 90,
            'very_large': 95
        };
        
        if (this.formData.dataset_size) {
            score = sizeScores[this.formData.dataset_size] || score;
        }
        
        // Data type complexity (some types more suitable than others)
        if (this.formData.data_types) {
            const complexTypes = ['genomics', 'imaging'];
            const standardTypes = ['clinical', 'laboratory', 'pharmaceutical', 'claims'];
            const simpleTypes = ['survey', 'wearable'];
            
            const hasComplex = this.formData.data_types.some(type => complexTypes.includes(type));
            const hasStandard = this.formData.data_types.some(type => standardTypes.includes(type));
            const hasSimple = this.formData.data_types.some(type => simpleTypes.includes(type));
            
            if (hasComplex) score -= 10;
            if (hasStandard) score += 5;
            if (hasSimple) score += 10;
        }
        
        // Sensitivity adjustments
        const sensitivityAdjustments = {
            'low': 15,
            'medium': 5,
            'high': -5,
            'very_high': -15
        };
        
        if (this.formData.data_sensitivity) {
            score += sensitivityAdjustments[this.formData.data_sensitivity] || 0;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    calculateTechnicalScore() {
        let score = 70; // Base score
        
        // Statistical fidelity requirements
        const fidelityScores = {
            'basic': 90,
            'moderate': 80,
            'high': 60,
            'exact': 40
        };
        
        if (this.formData.statistical_fidelity) {
            score = fidelityScores[this.formData.statistical_fidelity] || score;
        }
        
        // Technical expertise
        const expertiseScores = {
            'none': 30,
            'basic': 60,
            'advanced': 85,
            'expert': 95
        };
        
        if (this.formData.technical_expertise) {
            const expertiseScore = expertiseScores[this.formData.technical_expertise] || 60;
            score = (score + expertiseScore) / 2; // Average with base score
        }
        
        // Computational resources
        const resourceAdjustments = {
            'limited': -15,
            'moderate': 0,
            'high': 15
        };
        
        if (this.formData.computational_resources) {
            score += resourceAdjustments[this.formData.computational_resources] || 0;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    calculateRiskScore() {
        let score = 70; // Base score
        
        // Re-identification risk tolerance
        const riskScores = {
            'zero': 40,
            'very_low': 60,
            'low': 80,
            'moderate': 90
        };
        
        if (this.formData.reidentification_risk) {
            score = riskScores[this.formData.reidentification_risk] || score;
        }
        
        // Ethics approval
        const ethicsScores = {
            'yes': 95,
            'planned': 85,
            'not_required': 80,
            'unsure': 50
        };
        
        if (this.formData.ethics_approval) {
            const ethicsScore = ethicsScores[this.formData.ethics_approval] || 70;
            score = (score + ethicsScore) / 2;
        }
        
        // Privacy regulations complexity
        if (this.formData.privacy_regulations) {
            const regCount = this.formData.privacy_regulations.length;
            const hasUnsure = this.formData.privacy_regulations.includes('unsure');
            
            if (hasUnsure) score -= 20;
            if (regCount > 2 && !hasUnsure) score -= 10; // Multiple jurisdictions
        }
        
        return Math.max(0, Math.min(100, score));
    }

    calculateResourceScore() {
        let score = 70; // Base score
        
        // Timeline scoring
        const timelineScores = {
            'immediate': 40,
            'short': 60,
            'medium': 85,
            'long': 95
        };
        
        if (this.formData.project_timeline) {
            score = timelineScores[this.formData.project_timeline] || score;
        }
        
        // Budget availability
        const budgetScores = {
            'none': 50,
            'low': 70,
            'medium': 90,
            'high': 95
        };
        
        if (this.formData.budget) {
            const budgetScore = budgetScores[this.formData.budget] || 70;
            score = (score + budgetScore) / 2;
        }
        
        // Ongoing support needs
        const supportAdjustments = {
            'not_needed': 10,
            'periodic': 5,
            'regular': -5,
            'continuous': -15
        };
        
        if (this.formData.ongoing_support) {
            score += supportAdjustments[this.formData.ongoing_support] || 0;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    calculateOverallScore(scores) {
        // Weighted average of all scores
        const weights = {
            purposeAlignment: 0.25,
            dataCharacteristics: 0.20,
            technicalFeasibility: 0.20,
            riskCompliance: 0.20,
            resourceAvailability: 0.15
        };
        
        let weightedSum = 0;
        Object.keys(weights).forEach(key => {
            weightedSum += scores[key] * weights[key];
        });
        
        return Math.round(weightedSum);
    }

    getSuitabilityRating(score) {
        if (score >= 85) return 'Highly Suitable';
        if (score >= 70) return 'Suitable';
        if (score >= 55) return 'Moderately Suitable';
        if (score >= 40) return 'Limited Suitability';
        return 'Not Recommended';
    }

    generateRecommendations(scores, overallScore) {
        const recommendations = [];
        
        // Overall recommendation
        if (overallScore >= 85) {
            recommendations.push({
                type: 'primary',
                level: 'high',
                title: 'Proceed with Implementation',
                text: 'Synthetic data is highly suitable for your use case. You can proceed with confidence following the SynD-DGF framework.'
            });
        } else if (overallScore >= 70) {
            recommendations.push({
                type: 'primary',
                level: 'medium',
                title: 'Suitable with Considerations',
                text: 'Synthetic data is suitable for your use case. Address the specific considerations below to optimise implementation.'
            });
        } else if (overallScore >= 55) {
            recommendations.push({
                type: 'primary',
                level: 'low',
                title: 'Proceed with Caution',
                text: 'Synthetic data may be suitable but requires careful consideration of limitations and additional safeguards.'
            });
        } else {
            recommendations.push({
                type: 'primary',
                level: 'none',
                title: 'Consider Alternatives',
                text: 'Synthetic data may not be the best solution for your use case. Consider alternative approaches or address fundamental limitations first.'
            });
        }
        
        // Specific factor recommendations
        if (scores.purposeAlignment < 70) {
            recommendations.push({
                type: 'factor',
                factor: 'Purpose Alignment',
                text: 'Consider whether synthetic data truly meets your analytical needs, particularly for your intended sharing scope.'
            });
        }
        
        if (scores.dataCharacteristics < 70) {
            recommendations.push({
                type: 'factor',
                factor: 'Data Characteristics',
                text: 'Your data characteristics present challenges. Consider data preprocessing, larger sample sizes, or specialized generation techniques.'
            });
        }
        
        if (scores.technicalFeasibility < 70) {
            recommendations.push({
                type: 'factor',
                factor: 'Technical Feasibility',
                text: 'Build technical capabilities or consider partnering with organizations that have synthetic data expertise.'
            });
        }
        
        if (scores.riskCompliance < 70) {
            recommendations.push({
                type: 'factor',
                factor: 'Risk & Compliance',
                text: 'Address regulatory and ethical requirements before proceeding. Consider seeking legal or ethics guidance.'
            });
        }
        
        if (scores.resourceAvailability < 70) {
            recommendations.push({
                type: 'factor',
                factor: 'Resource Availability',
                text: 'Ensure adequate timeline and budget for quality synthetic data generation. Consider phased implementation.'
            });
        }
        
        return recommendations;
    }

    generateNextSteps(overallScore, scores) {
        const steps = [];
        
        if (overallScore >= 70) {
            steps.push('Begin with Step 1 of the SynD-DGF framework: Use Case Assessment');
            steps.push('Complete the detailed Use Case Checklist');
            steps.push('Proceed through the 5-step governance process');
        } else {
            steps.push('Address the key limitations identified in the assessment');
            if (scores.technicalFeasibility < 70) {
                steps.push('Build technical capabilities or identify expert partners');
            }
            if (scores.riskCompliance < 70) {
                steps.push('Obtain necessary approvals and clarify regulatory requirements');
            }
            if (scores.resourceAvailability < 70) {
                steps.push('Secure adequate resources and extend timeline if needed');
            }
            steps.push('Re-run this assessment once limitations are addressed');
        }
        
        // Always recommend these steps
        steps.push('Review the SynD-DGF resources and appendices');
        steps.push('Consider pilot testing with a small dataset subset');
        
        return steps;
    }

    displayResults() {
        // Hide form and show results
        document.getElementById('use-case-assessment-form').style.display = 'none';
        document.getElementById('assessment-results').classList.remove('hidden');
        
        // Update overall score and rating
        document.getElementById('overall-score').textContent = this.assessmentResults.overallScore;
        document.getElementById('overall-score').className = `suitability-score ${this.getScoreClass(this.assessmentResults.overallScore)}`;
        document.getElementById('suitability-rating').textContent = this.assessmentResults.suitabilityRating;
        
        // Update primary recommendation
        const primaryRec = this.assessmentResults.recommendations.find(r => r.type === 'primary');
        const recElement = document.getElementById('primary-recommendation');
        if (primaryRec) {
            recElement.textContent = primaryRec.text;
            recElement.className = `recommendation-${primaryRec.level} p-3 rounded`;
        }
        
        // Display factor analysis
        this.displayFactorAnalysis();
        
        // Display detailed recommendations
        this.displayDetailedRecommendations();
        
        // Display next steps
        this.displayNextSteps();
        
        this.scrollToTop();
    }

    getScoreClass(score) {
        if (score >= 85) return 'score-excellent';
        if (score >= 70) return 'score-good';
        if (score >= 55) return 'score-fair';
        return 'score-poor';
    }

    displayFactorAnalysis() {
        const factorContainer = document.getElementById('factor-analysis');
        factorContainer.innerHTML = '';
        
        const factors = [
            { key: 'purposeAlignment', title: 'Purpose Alignment', description: 'How well synthetic data fits your intended use' },
            { key: 'dataCharacteristics', title: 'Data Characteristics', description: 'Suitability of your data for synthetic generation' },
            { key: 'technicalFeasibility', title: 'Technical Feasibility', description: 'Available expertise and computational resources' },
            { key: 'riskCompliance', title: 'Risk & Compliance', description: 'Regulatory and privacy risk management' },
            { key: 'resourceAvailability', title: 'Resource Availability', description: 'Timeline, budget, and ongoing support needs' }
        ];
        
        factors.forEach(factor => {
            const score = this.assessmentResults.scores[factor.key];
            const factorCard = document.createElement('div');
            factorCard.className = 'factor-card';
            factorCard.innerHTML = `
                <div class="factor-title">${factor.title}</div>
                <div class="factor-score">
                    <span>${score}</span>
                    <div class="score-bar">
                        <div class="score-fill ${this.getScoreClass(score)}" style="width: ${score}%"></div>
                    </div>
                    <span>100</span>
                </div>
                <p class="text-muted small mb-0">${factor.description}</p>
            `;
            factorContainer.appendChild(factorCard);
        });
    }

    displayDetailedRecommendations() {
        const container = document.getElementById('detailed-recommendations');
        container.innerHTML = '';
        
        const factorRecs = this.assessmentResults.recommendations.filter(r => r.type === 'factor');
        
        if (factorRecs.length === 0) {
            container.innerHTML = '<p class="text-success">No specific issues identified. You can proceed with implementation.</p>';
        } else {
            factorRecs.forEach(rec => {
                const recDiv = document.createElement('div');
                recDiv.className = 'alert alert-info';
                recDiv.innerHTML = `
                    <strong>${rec.factor}:</strong> ${rec.text}
                `;
                container.appendChild(recDiv);
            });
        }
    }

    displayNextSteps() {
        const container = document.getElementById('next-steps-list');
        container.innerHTML = '';
        
        this.assessmentResults.nextSteps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            container.appendChild(li);
        });
    }

    saveAssessment() {
        const assessmentData = {
            formData: this.formData,
            results: this.assessmentResults,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('synd-use-case-assessment-complete', JSON.stringify(assessmentData));
        this.showSuccessMessage('Assessment saved successfully!');
    }

    exportAssessment() {
        const reportHtml = this.generateReportHtml();
        this.downloadReport(reportHtml, 'synd-use-case-assessment-report.html');
    }

    generateReportHtml() {
        const results = this.assessmentResults;
        const generatedDate = new Date().toLocaleDateString('en-AU');
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>SynD Use Case Assessment Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
                .header { border-bottom: 3px solid #004d9f; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { color: #004d9f; margin-bottom: 5px; }
                .score-section { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
                .overall-score { font-size: 4rem; font-weight: bold; color: #004d9f; margin-bottom: 10px; }
                .score-rating { font-size: 1.5rem; margin-bottom: 20px; }
                .factors-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
                .factor-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
                .factor-title { font-weight: bold; color: #004d9f; margin-bottom: 10px; }
                .factor-score { font-size: 1.5rem; font-weight: bold; margin-bottom: 5px; }
                .recommendations { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .recommendation { background: white; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #004d9f; }
                .next-steps { background: #f1f8e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .next-steps ol { margin: 10px 0; }
                .next-steps li { margin: 5px 0; }
                h2 { color: #004d9f; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SynD Use Case Assessment Report</h1>
                <p><strong>Generated:</strong> ${generatedDate}</p>
                <p><strong>Organisation Type:</strong> ${this.getReadableValue('organisation_type', this.formData.organisation_type)}</p>
                <p><strong>Primary Purpose:</strong> ${this.getReadableValue('primary_purpose', this.formData.primary_purpose)}</p>
            </div>
            
            <div class="score-section">
                <div class="overall-score">${results.overallScore}</div>
                <div class="score-rating">${results.suitabilityRating}</div>
                <p><em>${results.recommendations.find(r => r.type === 'primary')?.text || ''}</em></p>
            </div>
            
            <h2>Factor Analysis</h2>
            <div class="factors-grid">
                <div class="factor-card">
                    <div class="factor-title">Purpose Alignment</div>
                    <div class="factor-score">${results.scores.purposeAlignment}/100</div>
                    <p>How well synthetic data fits your intended use</p>
                </div>
                <div class="factor-card">
                    <div class="factor-title">Data Characteristics</div>
                    <div class="factor-score">${results.scores.dataCharacteristics}/100</div>
                    <p>Suitability of your data for synthetic generation</p>
                </div>
                <div class="factor-card">
                    <div class="factor-title">Technical Feasibility</div>
                    <div class="factor-score">${results.scores.technicalFeasibility}/100</div>
                    <p>Available expertise and computational resources</p>
                </div>
                <div class="factor-card">
                    <div class="factor-title">Risk & Compliance</div>
                    <div class="factor-score">${results.scores.riskCompliance}/100</div>
                    <p>Regulatory and privacy risk management</p>
                </div>
                <div class="factor-card">
                    <div class="factor-title">Resource Availability</div>
                    <div class="factor-score">${results.scores.resourceAvailability}/100</div>
                    <p>Timeline, budget, and ongoing support needs</p>
                </div>
            </div>
            
            <h2>Recommendations</h2>
            <div class="recommendations">
                ${results.recommendations.filter(r => r.type === 'factor').map(rec => `
                    <div class="recommendation">
                        <strong>${rec.factor}:</strong> ${rec.text}
                    </div>
                `).join('')}
            </div>
            
            <h2>Next Steps</h2>
            <div class="next-steps">
                <ol>
                    ${results.nextSteps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="header" style="border-top: 2px solid #004d9f; border-bottom: none; padding-top: 20px; margin-top: 40px;">
                <p><small>This report was generated by the SynD-DGF Use Case Assessment Tool. For more information, visit the SynD-DGF framework resources.</small></p>
            </div>
        </body>
        </html>
        `;
    }

    getReadableValue(fieldName, value) {
        const mappings = {
            organisation_type: {
                'healthcare': 'Healthcare Provider/Hospital',
                'research': 'Research Institution/University',
                'government': 'Government Agency',
                'industry': 'Industry/Commercial Entity',
                'ngo': 'Non-profit/NGO'
            },
            primary_purpose: {
                'research': 'Research and Development',
                'analytics': 'Business Analytics and Insights',
                'ml_training': 'Machine Learning Model Training',
                'testing': 'Software Testing and Development',
                'data_sharing': 'Data Sharing and Collaboration'
            }
        };
        
        return mappings[fieldName]?.[value] || value || 'Not specified';
    }

    downloadReport(htmlContent, filename) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('Assessment report downloaded successfully!');
    }

    startFramework() {
        // Redirect to Step 1 of the framework
        window.location.href = '../../framework/step-1-use-case-assessment.html';
    }

    newAssessment() {
        if (confirm('Are you sure you want to start a new assessment? Current progress will be lost.')) {
            // Clear saved data
            localStorage.removeItem('synd-use-case-assessment');
            localStorage.removeItem('synd-use-case-assessment-section');
            localStorage.removeItem('synd-use-case-assessment-complete');
            
            // Reload page
            window.location.reload();
        }
    }

    showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert at top of results section or current section
        const target = document.getElementById('assessment-results').classList.contains('hidden') 
            ? document.getElementById(`section-${this.currentSection}`)
            : document.getElementById('assessment-results');
            
        if (target) {
            target.insertBefore(alertDiv, target.firstChild);
            
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 5000);
        }
    }
}

// Initialize the assessment tool when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new UseCaseAssessmentTool();
});