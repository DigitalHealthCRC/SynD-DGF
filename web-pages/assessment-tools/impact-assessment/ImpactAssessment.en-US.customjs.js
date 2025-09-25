// Impact Assessment JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('impactAssessment');
    const validateButton = document.getElementById('validate-assessment');
    const saveButton = document.getElementById('save-impact-assessment');
    const exportButton = document.getElementById('export-impact-assessment');
    const nextStepsDiv = document.getElementById('impact-next-steps');
    const stepsContent = document.getElementById('impact-steps-content');
    
    // Show/hide Indigenous data considerations based on selection
    const indigenousDataInputs = document.querySelectorAll('input[name="indigenous-data"]');
    const indigenousConsiderations = document.getElementById('indigenous-considerations');
    
    indigenousDataInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'yes' || this.value === 'potential') {
                indigenousConsiderations.style.display = 'block';
                // Make Indigenous fields required
                const requiredFields = indigenousConsiderations.querySelectorAll('textarea[name="indigenous-engagement"], textarea[name="cultural-considerations"]');
                requiredFields.forEach(field => field.required = true);
            } else if (this.value === 'no') {
                indigenousConsiderations.style.display = 'none';
                // Remove required attribute
                const requiredFields = indigenousConsiderations.querySelectorAll('textarea');
                requiredFields.forEach(field => field.required = false);
            } else if (this.value === 'unknown') {
                indigenousConsiderations.style.display = 'block';
                // Make only investigation plan required
                const requiredFields = indigenousConsiderations.querySelectorAll('textarea');
                requiredFields.forEach(field => field.required = false);
            }
        });
    });

    // Validate assessment
    validateButton.addEventListener('click', function() {
        // Check all required fields are completed
        const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let allCompleted = true;
        const missingFields = [];

        requiredInputs.forEach(input => {
            if (input.type === 'radio') {
                const radioGroup = form.querySelectorAll(`input[name="${input.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    allCompleted = false;
                    if (!missingFields.includes(input.name)) {
                        missingFields.push(input.name);
                    }
                }
            } else if (input.type === 'checkbox') {
                // Checkbox groups don't need individual validation in this form
            } else if (!input.value.trim()) {
                allCompleted = false;
                missingFields.push(input.name || input.id);
            }
        });

        if (!allCompleted) {
            alert('Please complete all required fields before validating the assessment:\n' + 
                  missingFields.join(', '));
            return;
        }

        // Validate assessment logic
        const assessmentResult = validateImpactAssessment();
        displayValidationResult(assessmentResult);
        
        // Show action buttons and next steps
        saveButton.style.display = 'inline-block';
        exportButton.style.display = 'inline-block';
        nextStepsDiv.style.display = 'block';
        
        // Scroll to result
        nextStepsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    function validateImpactAssessment() {
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

        // Assessment logic
        const result = {
            overall: 'pending',
            issues: [],
            recommendations: [],
            canProceed: false
        };

        // Check ethical considerations
        if (responses['proportionality-conclusion'] === 'disproportionate') {
            result.issues.push('Privacy implications appear disproportionate to benefits');
        } else if (responses['proportionality-conclusion'] === 'questionable') {
            result.recommendations.push('Additional privacy safeguards required due to proportionality concerns');
        }

        // Check Indigenous data sovereignty
        const indigenousData = responses['indigenous-data'];
        const indigenousAssessment = responses['indigenous-assessment'];
        
        if ((indigenousData === 'yes' || indigenousData === 'potential') && 
            (indigenousAssessment === 'non-compliant' || !indigenousAssessment)) {
            result.issues.push('Indigenous data sovereignty requirements not adequately addressed');
        } else if ((indigenousData === 'yes' || indigenousData === 'potential') && 
                  indigenousAssessment === 'partial') {
            result.recommendations.push('Additional work required to fully address Indigenous data sovereignty');
        }

        // Check risk-benefit balance
        if (responses['risk-benefit-balance'] === 'negative') {
            result.issues.push('Societal risks may outweigh benefits');
        } else if (responses['risk-benefit-balance'] === 'neutral') {
            result.recommendations.push('Additional risk mitigation measures recommended');
        }

        // Check overall conclusion
        const impactConclusion = responses['impact-conclusion'];
        if (impactConclusion === 'rejected') {
            result.issues.push('Unacceptable risks or impacts identified');
        } else if (impactConclusion === 'revision') {
            result.issues.push('Significant concerns require project revision');
        } else if (impactConclusion === 'conditional') {
            result.recommendations.push('Project requires additional safeguards and monitoring');
        }

        // Determine overall result
        if (result.issues.length > 0) {
            result.overall = 'failed';
            result.canProceed = false;
        } else if (result.recommendations.length > 0) {
            result.overall = 'conditional';
            result.canProceed = true;
        } else {
            result.overall = 'passed';
            result.canProceed = true;
        }

        return result;
    }

    function displayValidationResult(result) {
        let resultHTML = '<div class="validation-result">';
        
        if (result.overall === 'passed') {
            resultHTML += `
                <div class="result-pass">
                    <h3>✓ Impact Assessment COMPLETED</h3>
                    <p>All ethical, social, and cultural considerations have been adequately addressed. Your project can proceed to the next step.</p>
                </div>
            `;
            
            stepsContent.innerHTML = `
                <div class="next-step-proceed">
                    <h3>Assessment completed successfully</h3>
                    <p>Your impact assessment is complete and satisfactory. Combined with your use case assessment, you can now proceed to Step 2.</p>
                    <div class="action-items">
                        <h4>Before proceeding:</h4>
                        <ul>
                            <li>Save or export this assessment for your records</li>
                            <li>Implement any risk mitigation measures identified</li>
                            <li>Establish ongoing monitoring and engagement processes</li>
                            <li>Ensure all stakeholder commitments can be met</li>
                        </ul>
                    </div>
                    <a href="../../step-2-assess-source-data/Step2AssessSourceData.en-US.webpage.copy.html" class="button1">Continue to Step 2</a>
                </div>
            `;
        } else if (result.overall === 'conditional') {
            resultHTML += `
                <div class="result-conditional">
                    <h3>⚠ Impact Assessment COMPLETED WITH CONDITIONS</h3>
                    <p>Your impact assessment is complete but additional safeguards and monitoring are required.</p>
                </div>
            `;
            
            stepsContent.innerHTML = `
                <div class="next-step-conditional">
                    <h3>Additional requirements identified</h3>
                    <p>Your project can proceed but must address the following recommendations:</p>
                    <ul>
                        ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                    <div class="conditional-actions">
                        <h4>Required actions:</h4>
                        <ul>
                            <li>Develop detailed implementation plans for all recommendations</li>
                            <li>Establish enhanced monitoring and review processes</li>
                            <li>Document additional safeguards in your governance framework</li>
                            <li>Schedule regular assessment reviews</li>
                        </ul>
                    </div>
                    <a href="../../step-2-assess-source-data/Step2AssessSourceData.en-US.webpage.copy.html" class="button1">Continue to Step 2 (with conditions)</a>
                </div>
            `;
        } else {
            resultHTML += `
                <div class="result-fail">
                    <h3>✗ Impact Assessment REQUIRES REVISION</h3>
                    <p>Significant issues have been identified that must be addressed before proceeding.</p>
                </div>
            `;
            
            stepsContent.innerHTML = `
                <div class="next-step-revise">
                    <h3>Major issues identified</h3>
                    <p>The following critical issues must be resolved:</p>
                    <ul>
                        ${result.issues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                    <div class="revision-options">
                        <h4>Consider these approaches:</h4>
                        <ul>
                            <li><strong>Project redesign:</strong> Fundamentally revise the project approach</li>
                            <li><strong>Enhanced safeguards:</strong> Implement comprehensive additional protections</li>
                            <li><strong>Alternative methods:</strong> Consider non-synthetic approaches</li>
                            <li><strong>Expert consultation:</strong> Engage ethics committees, Indigenous advisors, or privacy experts</li>
                            <li><strong>Extended consultation:</strong> Conduct additional community engagement</li>
                        </ul>
                    </div>
                    <a href="/resources/expert-consultation" class="button1">Get Expert Guidance</a>
                </div>
            `;
        }
        
        resultHTML += '</div>';
        stepsContent.innerHTML = resultHTML + stepsContent.innerHTML;
    }

    // Save assessment
    saveButton.addEventListener('click', function() {
        const formData = new FormData(form);
        const assessmentData = {
            timestamp: new Date().toISOString(),
            responses: {}
        };
        
        for (let [key, value] of formData.entries()) {
            if (assessmentData.responses[key]) {
                if (Array.isArray(assessmentData.responses[key])) {
                    assessmentData.responses[key].push(value);
                } else {
                    assessmentData.responses[key] = [assessmentData.responses[key], value];
                }
            } else {
                assessmentData.responses[key] = value;
            }
        }
        
        localStorage.setItem('impactAssessment', JSON.stringify(assessmentData));
        alert('Impact assessment saved successfully!');
    });

    // Export assessment
    exportButton.addEventListener('click', function() {
        generateImpactPDFReport();
    });

    function generateImpactPDFReport() {
        const printWindow = window.open('', '_blank');
        const formData = new FormData(form);
        const responses = {};
        
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
        
        const reportHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>SynD-DGF Impact Assessment Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
                    .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
                    .section { margin-bottom: 25px; page-break-inside: avoid; }
                    .subsection { margin-bottom: 15px; }
                    .question { font-weight: bold; margin-bottom: 5px; color: #333; }
                    .response { margin-bottom: 10px; padding-left: 15px; }
                    .assessment-result { background: #f0f0f0; padding: 15px; margin: 15px 0; }
                    .pass { background: #e8f5e8; }
                    .fail { background: #fce8e8; }
                    .conditional { background: #fff3cd; }
                    @media print { .no-print { display: none; } }
                    ul { margin: 5px 0; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SynD-DGF Impact Assessment Report</h1>
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="section">
                    <h2>Data Ethics Considerations</h2>
                    
                    <div class="subsection">
                        <div class="question">Source data bias assessment:</div>
                        <div class="response">${responses['source-bias'] || 'Not assessed'}</div>
                        ${responses['bias-description'] ? `<div class="response"><strong>Description:</strong> ${responses['bias-description']}</div>` : ''}
                    </div>
                    
                    <div class="subsection">
                        <div class="question">Fairness measures:</div>
                        <div class="response">${Array.isArray(responses['fairness-measures']) ? responses['fairness-measures'].join(', ') : responses['fairness-measures'] || 'None specified'}</div>
                    </div>
                    
                    <div class="subsection">
                        <div class="question">Proportionality assessment:</div>
                        <div class="response">${responses['proportionality-assessment'] || 'Not provided'}</div>
                        <div class="response"><strong>Conclusion:</strong> ${responses['proportionality-conclusion'] || 'Not assessed'}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Indigenous Data Sovereignty</h2>
                    
                    <div class="subsection">
                        <div class="question">Indigenous data inclusion:</div>
                        <div class="response">${responses['indigenous-data'] || 'Not specified'}</div>
                    </div>
                    
                    ${responses['indigenous-engagement'] ? `
                    <div class="subsection">
                        <div class="question">Community engagement:</div>
                        <div class="response">${responses['indigenous-engagement']}</div>
                        <div class="response"><strong>Status:</strong> ${responses['engagement-status'] || 'Not specified'}</div>
                    </div>
                    ` : ''}
                    
                    <div class="subsection">
                        <div class="question">Assessment conclusion:</div>
                        <div class="response">${responses['indigenous-assessment'] || 'Not assessed'}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Community and Stakeholder Impacts</h2>
                    
                    <div class="subsection">
                        <div class="question">Community monitoring approach:</div>
                        <div class="response">${responses['community-monitoring'] || 'Not specified'}</div>
                    </div>
                    
                    <div class="subsection">
                        <div class="question">Vulnerable population protections:</div>
                        <div class="response">${responses['vulnerability-protection'] || 'Not specified'}</div>
                    </div>
                    
                    <div class="subsection">
                        <div class="question">Risk-benefit balance:</div>
                        <div class="response">${responses['risk-benefit-balance'] || 'Not assessed'}</div>
                    </div>
                    
                    <div class="subsection">
                        <div class="question">Stakeholder engagement approach:</div>
                        <div class="response">${responses['engagement-approach'] || 'Not specified'}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Overall Assessment</h2>
                    
                    <div class="subsection">
                        <div class="question">Impact summary:</div>
                        <div class="response">${responses['impact-summary'] || 'Not provided'}</div>
                    </div>
                    
                    <div class="subsection">
                        <div class="question">Risk mitigation plan:</div>
                        <div class="response">${responses['mitigation-plan'] || 'Not provided'}</div>
                    </div>
                    
                    <div class="assessment-result ${getResultClass(responses['impact-conclusion'])}">
                        <strong>Final Conclusion: ${formatConclusion(responses['impact-conclusion'])}</strong>
                    </div>
                </div>
                
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

    function getResultClass(conclusion) {
        switch(conclusion) {
            case 'approved': return 'pass';
            case 'conditional': return 'conditional';
            case 'revision': case 'rejected': return 'fail';
            default: return '';
        }
    }

    function formatConclusion(conclusion) {
        switch(conclusion) {
            case 'approved': return 'APPROVED - Project can proceed';
            case 'conditional': return 'CONDITIONAL APPROVAL - Additional safeguards required';
            case 'revision': return 'REQUIRES REVISION - Significant concerns identified';
            case 'rejected': return 'REJECTED - Unacceptable risks identified';
            default: return 'Not assessed';
        }
    }

    // Auto-save draft
    form.addEventListener('change', function() {
        const formData = new FormData(form);
        const draftData = {};
        
        for (let [key, value] of formData.entries()) {
            if (draftData[key]) {
                if (Array.isArray(draftData[key])) {
                    draftData[key].push(value);
                } else {
                    draftData[key] = [draftData[key], value];
                }
            } else {
                draftData[key] = value;
            }
        }
        
        localStorage.setItem('impactAssessmentDraft', JSON.stringify(draftData));
    });

    // Load saved draft
    const savedDraft = localStorage.getItem('impactAssessmentDraft');
    if (savedDraft) {
        try {
            const draftData = JSON.parse(savedDraft);
            
            for (let [key, value] of Object.entries(draftData)) {
                const elements = form.elements[key];
                if (elements) {
                    if (elements.type === 'radio') {
                        const radioButton = form.querySelector(`input[name="${key}"][value="${value}"]`);
                        if (radioButton) {
                            radioButton.checked = true;
                            if (key === 'indigenous-data') {
                                radioButton.dispatchEvent(new Event('change'));
                            }
                        }
                    } else if (elements.type === 'checkbox') {
                        if (Array.isArray(value)) {
                            value.forEach(val => {
                                const checkbox = form.querySelector(`input[name="${key}"][value="${val}"]`);
                                if (checkbox) checkbox.checked = true;
                            });
                        } else {
                            const checkbox = form.querySelector(`input[name="${key}"][value="${value}"]`);
                            if (checkbox) checkbox.checked = true;
                        }
                    } else if (elements.tagName === 'TEXTAREA') {
                        elements.value = value;
                    }
                }
            }
        } catch (e) {
            console.log('Could not load draft data');
        }
    }
});