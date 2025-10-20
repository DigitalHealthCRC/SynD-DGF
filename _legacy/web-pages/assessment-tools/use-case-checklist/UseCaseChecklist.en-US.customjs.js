// Enhanced Use Case Assessment Checklist JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('useCaseAssessment');
    const calculateButton = document.getElementById('calculate-result');
    const saveButton = document.getElementById('save-assessment');
    const exportButton = document.getElementById('export-assessment');
    const generateReportButton = document.getElementById('generate-report');
    const viewHistoryButton = document.getElementById('view-history');
    const resultDiv = document.getElementById('assessment-result');
    const nextStepsDiv = document.getElementById('next-steps');
    const stepsContent = document.getElementById('steps-content');
    const saveStatus = document.getElementById('saveStatus');

    // Auto-save functionality
    let saveTimeout;
    let assessmentData = loadAssessmentData();

    // Load saved data on page load
    if (assessmentData && Object.keys(assessmentData).length > 0) {
        loadSavedData();
        updateSaveStatus('loaded', 'Progress loaded');
    }

    // Calculate assessment result
    calculateButton.addEventListener('click', function() {
        const test1Result = document.querySelector('input[name="test1-result"]:checked');
        const test2Result = document.querySelector('input[name="test2-result"]:checked');
        const test3Result = document.querySelector('input[name="test3-result"]:checked');

        if (!test1Result || !test2Result || !test3Result) {
            alert('Please complete all three test assessments before calculating the result.');
            return;
        }

        const test1Pass = test1Result.value === 'pass';
        const test2Pass = test2Result.value === 'pass';
        const test3Pass = test3Result.value === 'pass';
        const overallPass = test1Pass && test2Pass && test3Pass;

        // Display result
        displayAssessmentResult(overallPass, test1Pass, test2Pass, test3Pass);
        
        // Show action buttons and next steps
        saveButton.style.display = 'inline-block';
        exportButton.style.display = 'inline-block';
        generateReportButton.disabled = false;
        nextStepsDiv.style.display = 'block';

        // Save results to localStorage
        saveAssessmentResults(overallPass, test1Pass, test2Pass, test3Pass);

        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Auto-save form data
    form.addEventListener('change', function(e) {
        if (e.target.type === 'radio' || e.target.type === 'checkbox' || e.target.type === 'text' || e.target.tagName === 'TEXTAREA') {
            clearTimeout(saveTimeout);
            updateSaveStatus('saving', 'Saving...');

            saveTimeout = setTimeout(() => {
                autoSaveData();
                updateSaveStatus('saved', 'Changes saved');

                setTimeout(() => {
                    updateSaveStatus('ready', 'Ready');
                }, 2000);
            }, 1000);
        }
    });

    // Enhanced PDF report generation
    generateReportButton.addEventListener('click', function() {
        generatePDFReport();
    });

    // Assessment history functionality
    viewHistoryButton.addEventListener('click', function() {
        showAssessmentHistory();
    });

    function displayAssessmentResult(overallPass, test1Pass, test2Pass, test3Pass) {
        let resultHTML = '<div class="result-summary">';
        
        if (overallPass) {
            resultHTML += `
                <div class="result-pass">
                    <h3>✓ Assessment PASSED</h3>
                    <p>Your use case meets all requirements and can proceed to Step 2: Assess Source Data.</p>
                </div>
            `;
            
            stepsContent.innerHTML = `
                <div class="next-step-proceed">
                    <h3>Ready to proceed</h3>
                    <p>Your use case has successfully passed all three mandatory tests. You can now move to Step 2 to assess and prepare your source data.</p>
                    <div class="action-items">
                        <h4>Before proceeding:</h4>
                        <ul>
                            <li>Save or export this assessment for your records</li>
                            <li>Ensure you have documented evidence of community notification</li>
                            <li>Review the Impact Assessment if you haven't completed it</li>
                            <li>Prepare your source data documentation for Step 2</li>
                        </ul>
                    </div>
                    <a href="../../step-2-assess-source-data/Step2AssessSourceData.en-US.webpage.copy.html" class="button1">Continue to Step 2</a>
                </div>
            `;
        } else {
            resultHTML += `
                <div class="result-fail">
                    <h3>✗ Assessment FAILED</h3>
                    <p>Your use case does not meet all requirements. Review the failed tests below and consider revising your approach.</p>
                </div>
            `;
            
            let failureReasons = [];
            if (!test1Pass) failureReasons.push('Public benefit purpose requirements not met');
            if (!test2Pass) failureReasons.push('Community notification requirements not satisfied');
            if (!test3Pass) failureReasons.push('Synthetic data not suitable for intended use');
            
            stepsContent.innerHTML = `
                <div class="next-step-revise">
                    <h3>Revision required</h3>
                    <p>The following issues must be addressed before your project can proceed:</p>
                    <ul>
                        ${failureReasons.map(reason => `<li>${reason}</li>`).join('')}
                    </ul>
                    <div class="revision-options">
                        <h4>Consider these options:</h4>
                        <ul>
                            <li><strong>Revise your use case:</strong> Modify the project scope to better align with public benefit requirements</li>
                            <li><strong>Enhance engagement:</strong> Develop comprehensive community notification and consultation processes</li>
                            <li><strong>Explore alternatives:</strong> Consider aggregated statistics, traditional de-identification, or federated learning</li>
                            <li><strong>Seek expert advice:</strong> Consult with privacy experts, ethics committees, or legal advisors</li>
                        </ul>
                    </div>
                    <a href="/resources/guidance" class="button1">Get Additional Guidance</a>
                </div>
            `;
        }
        
        // Individual test results
        resultHTML += `
            <div class="test-results-breakdown">
                <h4>Test Results:</h4>
                <div class="test-result-item ${test1Pass ? 'pass' : 'fail'}">
                    <span class="test-icon">${test1Pass ? '✓' : '✗'}</span>
                    <span>Test 1: Public Benefit Purpose</span>
                </div>
                <div class="test-result-item ${test2Pass ? 'pass' : 'fail'}">
                    <span class="test-icon">${test2Pass ? '✓' : '✗'}</span>
                    <span>Test 2: Community Notification</span>
                </div>
                <div class="test-result-item ${test3Pass ? 'pass' : 'fail'}">
                    <span class="test-icon">${test3Pass ? '✓' : '✗'}</span>
                    <span>Test 3: Synthetic Data Suitability</span>
                </div>
            </div>
        `;
        
        resultHTML += '</div>';
        resultDiv.innerHTML = resultHTML;
    }

    // Save assessment
    saveButton.addEventListener('click', function() {
        const formData = new FormData(form);
        const assessmentData = {
            timestamp: new Date().toISOString(),
            responses: {}
        };
        
        // Collect all form responses
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
        
        // Save to localStorage
        localStorage.setItem('useCaseAssessment', JSON.stringify(assessmentData));
        alert('Assessment saved successfully!');
    });

    // Export assessment
    exportButton.addEventListener('click', function() {
        generatePDFReport();
    });

    function generatePDFReport() {
        // Create printable version
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
                <title>Use Case Assessment Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
                    .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
                    .section { margin-bottom: 25px; }
                    .question { font-weight: bold; margin-bottom: 5px; }
                    .response { margin-bottom: 15px; padding-left: 15px; }
                    .test-result { background: #f0f0f0; padding: 10px; margin: 10px 0; }
                    .pass { background: #e8f5e8; }
                    .fail { background: #fce8e8; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SynD-DGF Use Case Assessment Report</h1>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="section">
                    <h2>Test 1: Public Benefit Purpose</h2>
                    <div class="question">Primary purpose:</div>
                    <div class="response">${Array.isArray(responses.purpose) ? responses.purpose.join(', ') : responses.purpose || 'Not specified'}</div>
                    
                    <div class="question">Public benefit description:</div>
                    <div class="response">${responses['public-benefit'] || 'Not provided'}</div>
                    
                    <div class="question">Target beneficiaries:</div>
                    <div class="response">${Array.isArray(responses.beneficiaries) ? responses.beneficiaries.join(', ') : responses.beneficiaries || 'Not specified'}</div>
                    
                    <div class="test-result ${responses['test1-result'] === 'pass' ? 'pass' : 'fail'}">
                        <strong>Test 1 Result: ${responses['test1-result'] === 'pass' ? 'PASS' : 'FAIL'}</strong>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Test 2: Community Notification</h2>
                    <div class="question">Public communication status:</div>
                    <div class="response">${responses['public-communication'] || 'Not specified'}</div>
                    
                    <div class="question">Communication methods:</div>
                    <div class="response">${Array.isArray(responses['communication-methods']) ? responses['communication-methods'].join(', ') : responses['communication-methods'] || 'Not specified'}</div>
                    
                    <div class="test-result ${responses['test2-result'] === 'pass' ? 'pass' : 'fail'}">
                        <strong>Test 2 Result: ${responses['test2-result'] === 'pass' ? 'PASS' : 'FAIL'}</strong>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Test 3: Synthetic Data Suitability</h2>
                    <div class="question">Analysis type:</div>
                    <div class="response">${Array.isArray(responses['analysis-type']) ? responses['analysis-type'].join(', ') : responses['analysis-type'] || 'Not specified'}</div>
                    
                    <div class="question">Re-identification risk level:</div>
                    <div class="response">${responses['reidentification-risk'] || 'Not assessed'}</div>
                    
                    <div class="test-result ${responses['test3-result'] === 'pass' ? 'pass' : 'fail'}">
                        <strong>Test 3 Result: ${responses['test3-result'] === 'pass' ? 'PASS' : 'FAIL'}</strong>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Overall Assessment</h2>
                    <div class="test-result ${responses['test1-result'] === 'pass' && responses['test2-result'] === 'pass' && responses['test3-result'] === 'pass' ? 'pass' : 'fail'}">
                        <strong>Overall Result: ${responses['test1-result'] === 'pass' && responses['test2-result'] === 'pass' && responses['test3-result'] === 'pass' ? 'APPROVED TO PROCEED' : 'REQUIRES REVISION'}</strong>
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

    // Enhanced auto-save with status updates
    form.addEventListener('change', function(e) {
        if (e.target.type === 'radio' || e.target.type === 'checkbox' || e.target.type === 'text' || e.target.tagName === 'TEXTAREA') {
            clearTimeout(saveTimeout);
            updateSaveStatus('saving', 'Saving...');

            saveTimeout = setTimeout(() => {
                autoSaveData();
                updateSaveStatus('saved', 'Changes saved');

                setTimeout(() => {
                    updateSaveStatus('ready', 'Ready');
                }, 2000);
            }, 1000);
        }
    });

    // Enhanced functionality functions
    function autoSaveData() {
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        const textInputs = form.querySelectorAll('input[type="text"], textarea');
        textInputs.forEach(input => {
            if (input.value) {
                data[input.name || input.id] = input.value;
            }
        });

        data.lastSaved = new Date().toISOString();
        localStorage.setItem('useCaseAssessmentDraft', JSON.stringify(data));
    }

    function updateSaveStatus(status, message) {
        const indicator = saveStatus.querySelector('.status-indicator');
        const text = saveStatus.querySelector('.status-text');

        indicator.className = 'status-indicator';
        if (status !== 'ready') {
            indicator.classList.add(status);
        }
        text.textContent = message;
    }

    // Enhanced PDF report generation
    generateReportButton.addEventListener('click', function() {
        generateEnhancedPDFReport();
    });

    function generateEnhancedPDFReport() {
        const reportContent = generateDetailedReportContent();
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>SynD-DGF Use Case Assessment Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                    .header { border-bottom: 2px solid #004d9f; padding-bottom: 20px; margin-bottom: 30px; }
                    .result-pass { color: #28a745; font-weight: bold; }
                    .result-fail { color: #dc3545; font-weight: bold; }
                    .test-section { margin: 20px 0; padding: 15px; border: 1px solid #dee2e6; }
                    .test-pass { background: #d4edda; }
                    .test-fail { background: #f8d7da; }
                    @media print { body { margin: 20px; } }
                </style>
            </head>
            <body>
                ${reportContent}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    function generateDetailedReportContent() {
        const timestamp = new Date().toLocaleString('en-AU');
        const formData = new FormData(form);
        const responses = {};

        for (let [key, value] of formData.entries()) {
            responses[key] = value;
        }

        return `
            <div class="header">
                <h1>SynD-DGF Use Case Assessment Report</h1>
                <p>Generated: ${timestamp}</p>
                <p>Assessment Type: Mandatory 3-Test Use Case Checklist</p>
                <p>Framework Version: 2.0</p>
            </div>

            <div class="summary">
                <h2>Assessment Summary</h2>
                <p class="${responses['test1-result'] === 'pass' && responses['test2-result'] === 'pass' && responses['test3-result'] === 'pass' ? 'result-pass' : 'result-fail'}">
                    Overall Result: ${responses['test1-result'] === 'pass' && responses['test2-result'] === 'pass' && responses['test3-result'] === 'pass' ? '✓ PASSED - Proceed to Step 2' : '✗ FAILED - Alternative pathway required'}
                </p>
            </div>

            <div class="test-results">
                <h2>Detailed Test Results</h2>

                <div class="test-section ${responses['test1-result'] === 'pass' ? 'test-pass' : 'test-fail'}">
                    <h3>Test 1: Public Benefit Purpose</h3>
                    <p><strong>Result: ${responses['test1-result'] === 'pass' ? 'PASS' : 'FAIL'}</strong></p>
                    <p><strong>Requirement:</strong> Clear 'public benefit' purpose related to providing health services.</p>
                    <p><strong>Responses:</strong></p>
                    <ul>
                        <li>Primary purpose: ${responses['purpose'] || 'Not specified'}</li>
                        <li>Public benefit description: ${responses['public-benefit'] || 'Not provided'}</li>
                        <li>Target beneficiaries: ${responses['beneficiaries'] || 'Not specified'}</li>
                    </ul>
                </div>

                <div class="test-section ${responses['test2-result'] === 'pass' ? 'test-pass' : 'test-fail'}">
                    <h3>Test 2: Community Notification</h3>
                    <p><strong>Result: ${responses['test2-result'] === 'pass' ? 'PASS' : 'FAIL'}</strong></p>
                    <p><strong>Requirement:</strong> Appropriate community notification and engagement processes.</p>
                    <p><strong>Communication status:</strong> ${responses['public-communication'] || 'Not specified'}</p>
                </div>

                <div class="test-section ${responses['test3-result'] === 'pass' ? 'test-pass' : 'test-fail'}">
                    <h3>Test 3: Synthetic Data Appropriateness</h3>
                    <p><strong>Result: ${responses['test3-result'] === 'pass' ? 'PASS' : 'FAIL'}</strong></p>
                    <p><strong>Requirement:</strong> Synthetic data is appropriate for the proposed use case.</p>
                    <p><strong>Analysis type:</strong> ${responses['analysis-type'] || 'Not specified'}</p>
                </div>
            </div>

            <div class="recommendations">
                <h2>Next Steps and Recommendations</h2>
                ${responses['test1-result'] === 'pass' && responses['test2-result'] === 'pass' && responses['test3-result'] === 'pass' ?
                    `<div class="next-steps">
                        <p>Your use case has successfully passed all mandatory requirements.</p>
                        <h3>Proceed to:</h3>
                        <ul>
                            <li><strong>Step 2:</strong> Assess Source Data - Evaluate your source data quality and characteristics</li>
                            <li><strong>Impact Assessment:</strong> Complete the comprehensive impact assessment if not already done</li>
                            <li><strong>Documentation:</strong> Ensure all assessment records are properly maintained</li>
                        </ul>
                    </div>` :
                    `<div class="revision-required">
                        <p>Your use case requires revision before proceeding.</p>
                        <h3>Consider these approaches:</h3>
                        <ul>
                            <li>Revise your use case to better align with public benefit requirements</li>
                            <li>Enhance community engagement and notification processes</li>
                            <li>Explore alternative privacy-preserving approaches</li>
                            <li>Seek expert guidance from privacy specialists or ethics committees</li>
                        </ul>
                    </div>`
                }
            </div>

            <div class="footer">
                <p><small>This report was generated by the SynD-DGF Use Case Assessment Checklist tool (Version 2.0).
                For comprehensive guidance, refer to the complete SynD-DGF framework documentation and appendices.</small></p>
            </div>
        `;
    }

    // Assessment history functionality
    viewHistoryButton.addEventListener('click', function() {
        showAssessmentHistory();
    });

    function showAssessmentHistory() {
        const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');

        if (history.length === 0) {
            alert('No assessment history found. Complete an assessment to start building your history.');
            return;
        }

        let historyHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 10px; padding: 30px; max-width: 80%; max-height: 80%; overflow-y: auto;">
                    <h3>Assessment History</h3>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 12px; border: 1px solid #dee2e6;">Date</th>
                                <th style="padding: 12px; border: 1px solid #dee2e6;">Result</th>
                                <th style="padding: 12px; border: 1px solid #dee2e6;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        history.forEach((assessment, index) => {
            const date = new Date(assessment.timestamp).toLocaleDateString('en-AU');
            const resultText = assessment.overallResult ? 'PASS' : 'FAIL';
            const resultColor = assessment.overallResult ? '#28a745' : '#dc3545';

            historyHTML += `
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${date}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; color: ${resultColor}; font-weight: bold;">${resultText}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">
                        <button onclick="loadHistoryItem(${index})" style="margin-right: 10px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px;">Load</button>
                        <button onclick="deleteHistoryItem(${index})" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px;">Delete</button>
                    </td>
                </tr>
            `;
        });

        historyHTML += `
                        </tbody>
                    </table>
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="closeHistoryModal()" style="margin-right: 10px; padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px;">Close</button>
                        <button onclick="clearAllHistory()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 5px;">Clear All</button>
                    </div>
                </div>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.id = 'historyModal';
        modalDiv.innerHTML = historyHTML;
        document.body.appendChild(modalDiv);
    }

    // Global functions for modal interactions
    window.closeHistoryModal = function() {
        const modal = document.getElementById('historyModal');
        if (modal) modal.remove();
    };

    window.loadHistoryItem = function(index) {
        const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
        if (history[index]) {
            location.reload(); // Simple approach - reload and load data
        }
    };

    window.deleteHistoryItem = function(index) {
        if (confirm('Delete this assessment record?')) {
            let history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
            history.splice(index, 1);
            localStorage.setItem('assessmentHistory', JSON.stringify(history));
            closeHistoryModal();
            showAssessmentHistory();
        }
    };

    window.clearAllHistory = function() {
        if (confirm('Clear all assessment history? This cannot be undone.')) {
            localStorage.removeItem('assessmentHistory');
            closeHistoryModal();
        }
    };

    // Load saved draft on page load
    const savedDraft = localStorage.getItem('useCaseAssessmentDraft');
    if (savedDraft) {
        try {
            const draftData = JSON.parse(savedDraft);
            
            for (let [key, value] of Object.entries(draftData)) {
                const elements = form.elements[key];
                if (elements) {
                    if (elements.type === 'radio') {
                        const radioButton = form.querySelector(`input[name="${key}"][value="${value}"]`);
                        if (radioButton) radioButton.checked = true;
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