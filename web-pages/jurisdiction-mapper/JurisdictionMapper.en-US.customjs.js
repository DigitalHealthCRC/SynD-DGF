// Jurisdiction Mapper JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jurisdictionForm');
    const generateButton = document.getElementById('generateMapping');
    const resetButton = document.getElementById('resetForm');
    const mappingResults = document.getElementById('mappingResults');
    const resultsContent = document.getElementById('resultsContent');
    const exportButton = document.getElementById('exportMapping');
    const saveButton = document.getElementById('saveMapping');
    const newMappingButton = document.getElementById('newMapping');
    
    // Form interaction handlers
    const primaryJurisdictionSelect = document.getElementById('primaryJurisdiction');
    const multipleJurisdictionsDiv = document.getElementById('multipleJurisdictions');
    
    primaryJurisdictionSelect.addEventListener('change', function() {
        if (this.value === 'multiple') {
            multipleJurisdictionsDiv.style.display = 'block';
        } else {
            multipleJurisdictionsDiv.style.display = 'none';
            // Clear multiple jurisdiction checkboxes
            const checkboxes = multipleJurisdictionsDiv.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
        }
    });

    // Generate mapping
    generateButton.addEventListener('click', function() {
        if (validateForm()) {
            generateButton.disabled = true;
            generateButton.textContent = 'Generating mapping...';
            
            setTimeout(() => {
                const mapping = generateJurisdictionMapping();
                displayMappingResults(mapping);
                generateButton.disabled = false;
                generateButton.textContent = 'Generate Jurisdiction Mapping';
            }, 2000);
        }
    });

    // Reset form
    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All entered information will be lost.')) {
            form.reset();
            multipleJurisdictionsDiv.style.display = 'none';
            mappingResults.style.display = 'none';
        }
    });

    // Export mapping
    exportButton.addEventListener('click', function() {
        exportMappingReport();
    });

    // Save mapping
    saveButton.addEventListener('click', function() {
        saveMappingToLocalStorage();
    });

    // New mapping
    newMappingButton.addEventListener('click', function() {
        form.reset();
        multipleJurisdictionsDiv.style.display = 'none';
        mappingResults.style.display = 'none';
        form.scrollIntoView({ behavior: 'smooth' });
    });

    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.style.borderColor = '#dc3545';
                field.addEventListener('change', function() {
                    this.style.borderColor = '';
                }, { once: true });
            }
        });
        
        if (!isValid) {
            alert('Please complete all required fields before generating your mapping.');
        }
        
        return isValid;
    }

    function generateJurisdictionMapping() {
        const formData = new FormData(form);
        const responses = {};
        
        // Collect form responses
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

        // Generate mapping based on responses
        const mapping = {
            primaryFrameworks: identifyPrimaryFrameworks(responses),
            jurisdictionalRequirements: identifyJurisdictionalRequirements(responses),
            specialConsiderations: identifySpecialConsiderations(responses),
            approvalProcesses: identifyApprovalProcesses(responses),
            complianceTimeline: generateComplianceTimeline(responses),
            keyContacts: identifyKeyContacts(responses),
            nextSteps: generateNextSteps(responses),
            riskLevel: assessComplianceRisk(responses)
        };

        return mapping;
    }

    function identifyPrimaryFrameworks(responses) {
        const frameworks = [];
        
        // Always applicable
        frameworks.push({
            name: "Privacy Act 1988 (Commonwealth)",
            applicability: "Primary",
            reason: "Applies to all Australian organisations handling personal information",
            keyRequirements: [
                "Australian Privacy Principles compliance",
                "Privacy policy requirements",
                "Data breach notification",
                "Individual rights and access"
            ]
        });

        // Organisation type specific
        if (responses.orgType === 'commonwealth-agency') {
            frameworks.push({
                name: "Privacy Act 1988 - Government Agencies",
                applicability: "Primary",
                reason: "Commonwealth agency handling personal information",
                keyRequirements: [
                    "Information Privacy Principles",
                    "Enhanced transparency obligations",
                    "OAIC oversight requirements",
                    "FOI Act considerations"
                ]
            });
        }

        // State-specific health legislation
        const jurisdiction = responses.primaryJurisdiction;
        if (jurisdiction && jurisdiction !== 'commonwealth') {
            const stateHealthLaws = {
                'nsw': 'Health Records and Information Privacy Act 2002 (NSW)',
                'vic': 'Health Records Act 2001 (Vic)',
                'qld': 'Hospital and Health Boards Act 2011 (Qld)',
                'wa': 'Health Services Act 2016 (WA)',
                'sa': 'Health Care Act 2008 (SA)',
                'tas': 'Health Act 1997 (Tas)',
                'act': 'Health Records (Privacy and Access) Act 1997 (ACT)',
                'nt': 'Health and Community Services Complaints Act 1998 (NT)'
            };

            if (stateHealthLaws[jurisdiction]) {
                frameworks.push({
                    name: stateHealthLaws[jurisdiction],
                    applicability: "Primary",
                    reason: `State/territory health data legislation for ${jurisdiction.toUpperCase()}`,
                    keyRequirements: [
                        "Health information handling requirements",
                        "Consent and disclosure provisions",
                        "Security and access controls",
                        "Complaints and enforcement mechanisms"
                    ]
                });
            }
        }

        // Research-specific frameworks
        if (responses.usePurposes && responses.usePurposes.includes('clinical-research')) {
            frameworks.push({
                name: "National Statement on Ethical Conduct in Human Research",
                applicability: "Primary",
                reason: "Clinical research involving human participants",
                keyRequirements: [
                    "Human Research Ethics Committee approval",
                    "Informed consent processes",
                    "Risk-benefit assessment",
                    "Data management and sharing protocols"
                ]
            });
        }

        return frameworks;
    }

    function identifyJurisdictionalRequirements(responses) {
        const requirements = [];
        
        const jurisdiction = responses.primaryJurisdiction;
        
        // Commonwealth requirements
        requirements.push({
            jurisdiction: "Commonwealth",
            requirements: [
                {
                    category: "Privacy Compliance",
                    items: [
                        "Australian Privacy Principles assessment",
                        "Privacy impact assessment (if high privacy risk)",
                        "Data breach response procedures",
                        "Privacy policy updates for synthetic data"
                    ]
                },
                {
                    category: "Research Governance",
                    items: [
                        "National Health and Medical Research Council guidelines",
                        "Australian Code for Responsible Conduct of Research",
                        "Institutional oversight arrangements"
                    ]
                }
            ]
        });

        // Jurisdiction-specific requirements
        if (jurisdiction && jurisdiction !== 'commonwealth') {
            const jurisdictionNames = {
                'nsw': 'New South Wales',
                'vic': 'Victoria', 
                'qld': 'Queensland',
                'wa': 'Western Australia',
                'sa': 'South Australia',
                'tas': 'Tasmania',
                'act': 'Australian Capital Territory',
                'nt': 'Northern Territory'
            };

            const jurisdictionRequirements = {
                'nsw': [
                    "Health Records and Information Privacy Act compliance",
                    "NSW Health policy alignment",
                    "Centre for Health Record Linkage processes (if applicable)"
                ],
                'vic': [
                    "Health Records Act compliance",
                    "Victorian Government data sharing policies",
                    "Department of Health approval processes"
                ],
                'qld': [
                    "Hospital and Health Boards Act requirements",
                    "Queensland Health information governance",
                    "Statistical Services Branch consultation (if applicable)"
                ]
                // Add other jurisdictions as needed
            };

            if (jurisdictionNames[jurisdiction]) {
                requirements.push({
                    jurisdiction: jurisdictionNames[jurisdiction],
                    requirements: [
                        {
                            category: "State Health Data Governance",
                            items: jurisdictionRequirements[jurisdiction] || [
                                `${jurisdictionNames[jurisdiction]} health data legislation compliance`,
                                "State health department consultation",
                                "Jurisdiction-specific approval processes"
                            ]
                        }
                    ]
                });
            }
        }

        return requirements;
    }

    function identifySpecialConsiderations(responses) {
        const considerations = [];

        // Indigenous data considerations
        if (responses.dataSources && responses.dataSources.includes('indigenous')) {
            considerations.push({
                type: "Indigenous Data Sovereignty",
                importance: "Critical",
                description: "Your project involves Indigenous health data, requiring special governance considerations.",
                requirements: [
                    "Consultation with relevant Aboriginal Community Controlled Health Organisations",
                    "Application of CARE Principles for Indigenous Data Governance",
                    "Compliance with Maiam nayri Wingara principles",
                    "Community consent and ongoing engagement processes",
                    "Cultural protocols and sensitivity measures"
                ],
                resources: [
                    "National Aboriginal Community Controlled Health Organisation (NACCHO)",
                    "Maiam nayri Wingara Indigenous Data Sovereignty Collective",
                    "Local Aboriginal Community Controlled Health Organisations"
                ]
            });
        }

        // Genetic data considerations
        if (responses.specialData && responses.specialData.includes('genetic')) {
            considerations.push({
                type: "Genetic Information",
                importance: "High",
                description: "Genetic data requires additional privacy protections and consent considerations.",
                requirements: [
                    "Enhanced consent processes for genetic information",
                    "Genetic privacy and non-discrimination protections",
                    "Family and intergenerational consent considerations",
                    "Specialized de-identification requirements",
                    "Genetic counselling access considerations"
                ],
                resources: [
                    "Human Genetics Society of Australasia",
                    "National Health and Medical Research Council genetic privacy guidelines"
                ]
            });
        }

        // Mental health data
        if (responses.specialData && responses.specialData.includes('mental-health')) {
            considerations.push({
                type: "Mental Health Information",
                importance: "High",
                description: "Mental health data requires enhanced privacy protections due to stigma and discrimination risks.",
                requirements: [
                    "Mental Health Act compliance (jurisdiction-specific)",
                    "Enhanced consent and capacity assessment",
                    "Stigma and discrimination risk mitigation",
                    "Specialized clinical governance oversight"
                ]
            });
        }

        // International sharing
        if (responses.dataSharing === 'international') {
            considerations.push({
                type: "International Data Transfer",
                importance: "High",
                description: "International data sharing requires additional privacy and security considerations.",
                requirements: [
                    "Cross-border data transfer assessment",
                    "Adequacy determination for recipient countries",
                    "International data sharing agreements",
                    "Ongoing monitoring of international privacy standards"
                ]
            });
        }

        return considerations;
    }

    function identifyApprovalProcesses(responses) {
        const processes = [];

        // Ethics review
        if (responses.usePurposes && (responses.usePurposes.includes('clinical-research') || 
            responses.usePurposes.includes('health-services'))) {
            processes.push({
                process: "Human Research Ethics Committee Review",
                timeline: "6-12 weeks",
                priority: "High",
                description: "Research involving human participants requires ethics committee approval.",
                steps: [
                    "Prepare comprehensive ethics application",
                    "Include synthetic data methodology and privacy protections",
                    "Submit to appropriate HREC",
                    "Respond to committee queries",
                    "Implement any required modifications"
                ]
            });
        }

        // Site governance
        if (responses.dataSources && (responses.dataSources.includes('hospital-records') || 
            responses.dataSources.includes('gp-records'))) {
            processes.push({
                process: "Site-Specific Governance Approval",
                timeline: "4-8 weeks per site",
                priority: "High",
                description: "Access to health service data requires governance approval from each participating site.",
                steps: [
                    "Identify all data source sites",
                    "Prepare site-specific governance applications",
                    "Engage with site research governance officers",
                    "Obtain required institutional agreements",
                    "Implement site-specific data handling requirements"
                ]
            });
        }

        // Data custodian approval
        if (responses.dataSources && (responses.dataSources.includes('administrative') || 
            responses.dataSources.includes('registry'))) {
            processes.push({
                process: "Data Custodian Approval",
                timeline: "8-16 weeks",
                priority: "High",
                description: "Access to administrative or registry data requires data custodian approval.",
                steps: [
                    "Identify relevant data custodians",
                    "Prepare detailed data access applications",
                    "Demonstrate public benefit and privacy protections",
                    "Negotiate data access agreements",
                    "Establish ongoing compliance monitoring"
                ]
            });
        }

        return processes;
    }

    function generateComplianceTimeline(responses) {
        const timeline = [];
        
        // Immediate actions (0-2 weeks)
        timeline.push({
            phase: "Immediate Actions",
            timeframe: "0-2 weeks",
            actions: [
                "Complete detailed project scoping and planning",
                "Engage legal and privacy expertise",
                "Begin stakeholder identification and engagement",
                "Start privacy impact assessment process"
            ]
        });

        // Short-term actions (2-8 weeks)
        timeline.push({
            phase: "Initial Compliance Setup",
            timeframe: "2-8 weeks",
            actions: [
                "Complete privacy impact assessment",
                "Prepare ethics and governance applications",
                "Establish data governance framework",
                "Begin regulatory consultation processes"
            ]
        });

        // Medium-term actions (2-6 months)
        timeline.push({
            phase: "Approval and Implementation",
            timeframe: "2-6 months",
            actions: [
                "Obtain required ethics approvals",
                "Secure data access permissions",
                "Implement technical and administrative safeguards",
                "Establish monitoring and review processes"
            ]
        });

        // Ongoing obligations
        timeline.push({
            phase: "Ongoing Compliance",
            timeframe: "Throughout project",
            actions: [
                "Regular compliance monitoring and reporting",
                "Stakeholder engagement and communication",
                "Privacy risk assessment and mitigation",
                "Regulatory change monitoring and adaptation"
            ]
        });

        return timeline;
    }

    function identifyKeyContacts(responses) {
        const contacts = [];

        // Always applicable
        contacts.push({
            organisation: "Office of the Australian Information Commissioner",
            role: "Privacy regulation and guidance",
            contact: "enquiries@oaic.gov.au | 1300 363 992",
            website: "https://www.oaic.gov.au"
        });

        // Jurisdiction-specific contacts
        const jurisdiction = responses.primaryJurisdiction;
        if (jurisdiction && jurisdiction !== 'commonwealth') {
            const jurisdictionContacts = {
                'nsw': {
                    organisation: "NSW Privacy Commissioner",
                    role: "NSW privacy compliance",
                    contact: "ipcinfo@ipc.nsw.gov.au",
                    website: "https://www.ipc.nsw.gov.au"
                },
                'vic': {
                    organisation: "Health Complaints Commissioner (Vic)",
                    role: "Victorian health privacy",
                    contact: "info@hcc.vic.gov.au",
                    website: "https://hcc.vic.gov.au"
                }
                // Add other jurisdictions as needed
            };

            if (jurisdictionContacts[jurisdiction]) {
                contacts.push(jurisdictionContacts[jurisdiction]);
            }
        }

        // Research-specific contacts
        if (responses.usePurposes && responses.usePurposes.includes('clinical-research')) {
            contacts.push({
                organisation: "National Health and Medical Research Council",
                role: "Research ethics and governance",
                contact: "research.ethics@nhmrc.gov.au",
                website: "https://www.nhmrc.gov.au"
            });
        }

        return contacts;
    }

    function generateNextSteps(responses) {
        const steps = [];
        
        // Priority 1 - Immediate
        steps.push({
            priority: 1,
            title: "Engage Legal and Privacy Expertise",
            description: "Consult with qualified legal and privacy professionals to validate this mapping and develop detailed compliance strategies.",
            timeframe: "Within 1 week"
        });

        steps.push({
            priority: 1,
            title: "Conduct Privacy Impact Assessment",
            description: "Complete a comprehensive privacy impact assessment for your synthetic data project.",
            timeframe: "Within 2 weeks"
        });

        // Priority 2 - Short term
        steps.push({
            priority: 2,
            title: "Develop Compliance Strategy",
            description: "Create detailed compliance plans for each identified legal framework and approval process.",
            timeframe: "Within 4 weeks"
        });

        steps.push({
            priority: 2,
            title: "Begin Stakeholder Engagement",
            description: "Initiate consultation with regulatory bodies, data custodians, and community representatives.",
            timeframe: "Within 4 weeks"
        });

        // Priority 3 - Medium term
        steps.push({
            priority: 3,
            title: "Submit Required Applications",
            description: "Prepare and submit ethics, governance, and data access applications as identified.",
            timeframe: "Within 8 weeks"
        });

        return steps;
    }

    function assessComplianceRisk(responses) {
        let riskScore = 0;
        
        // Base risk factors
        if (responses.specialData && responses.specialData.length > 1) riskScore += 2;
        if (responses.dataSources && responses.dataSources.includes('indigenous')) riskScore += 3;
        if (responses.dataSharing === 'international') riskScore += 2;
        if (responses.commercialUse === 'direct-commercial') riskScore += 2;
        if (responses.urgency === 'urgent') riskScore += 1;
        
        // Mitigation factors
        if (responses.existingApprovals && responses.existingApprovals.includes('hrec')) riskScore -= 1;
        if (responses.existingApprovals && responses.existingApprovals.includes('pia')) riskScore -= 1;
        if (responses.riskTolerance === 'conservative') riskScore -= 1;

        if (riskScore <= 2) return { level: "Low", description: "Standard compliance processes should be sufficient." };
        if (riskScore <= 5) return { level: "Moderate", description: "Additional safeguards and expert consultation recommended." };
        return { level: "High", description: "Comprehensive risk mitigation and specialized expertise essential." };
    }

    function displayMappingResults(mapping) {
        let html = `
            <div class="mapping-summary">
                <div class="risk-indicator risk-${mapping.riskLevel.level.toLowerCase()}">
                    <h3>Compliance Risk Level: ${mapping.riskLevel.level}</h3>
                    <p>${mapping.riskLevel.description}</p>
                </div>
            </div>

            <div class="mapping-section">
                <h3>Primary Legal Frameworks</h3>
                <div class="frameworks-list">
                    ${mapping.primaryFrameworks.map(framework => `
                        <div class="framework-card">
                            <h4>${framework.name}</h4>
                            <p><strong>Applicability:</strong> ${framework.applicability}</p>
                            <p><strong>Reason:</strong> ${framework.reason}</p>
                            <div class="key-requirements">
                                <strong>Key Requirements:</strong>
                                <ul>
                                    ${framework.keyRequirements.map(req => `<li>${req}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="mapping-section">
                <h3>Jurisdictional Requirements</h3>
                <div class="jurisdiction-requirements">
                    ${mapping.jurisdictionalRequirements.map(jur => `
                        <div class="jurisdiction-card">
                            <h4>${jur.jurisdiction}</h4>
                            ${jur.requirements.map(req => `
                                <div class="requirement-category">
                                    <h5>${req.category}</h5>
                                    <ul>
                                        ${req.items.map(item => `<li>${item}</li>`).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>

            ${mapping.specialConsiderations.length > 0 ? `
                <div class="mapping-section">
                    <h3>Special Considerations</h3>
                    <div class="special-considerations">
                        ${mapping.specialConsiderations.map(consideration => `
                            <div class="consideration-card importance-${consideration.importance.toLowerCase()}">
                                <h4>${consideration.type} <span class="importance-badge">${consideration.importance} Priority</span></h4>
                                <p>${consideration.description}</p>
                                <div class="consideration-requirements">
                                    <strong>Requirements:</strong>
                                    <ul>
                                        ${consideration.requirements.map(req => `<li>${req}</li>`).join('')}
                                    </ul>
                                </div>
                                ${consideration.resources ? `
                                    <div class="consideration-resources">
                                        <strong>Key Resources:</strong>
                                        <ul>
                                            ${consideration.resources.map(resource => `<li>${resource}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="mapping-section">
                <h3>Required Approval Processes</h3>
                <div class="approval-processes">
                    ${mapping.approvalProcesses.map(process => `
                        <div class="process-card">
                            <h4>${process.process} <span class="timeline-badge">${process.timeline}</span></h4>
                            <p>${process.description}</p>
                            <div class="process-steps">
                                <strong>Key Steps:</strong>
                                <ol>
                                    ${process.steps.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="mapping-section">
                <h3>Compliance Timeline</h3>
                <div class="compliance-timeline">
                    ${mapping.complianceTimeline.map(phase => `
                        <div class="timeline-phase">
                            <h4>${phase.phase} <span class="timeframe-badge">${phase.timeframe}</span></h4>
                            <ul>
                                ${phase.actions.map(action => `<li>${action}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="mapping-section">
                <h3>Next Steps (Priority Order)</h3>
                <div class="next-steps">
                    ${mapping.nextSteps.map(step => `
                        <div class="step-card priority-${step.priority}">
                            <div class="step-header">
                                <span class="priority-badge">Priority ${step.priority}</span>
                                <h4>${step.title}</h4>
                                <span class="timeframe-badge">${step.timeframe}</span>
                            </div>
                            <p>${step.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="mapping-section">
                <h3>Key Contacts and Resources</h3>
                <div class="key-contacts">
                    ${mapping.keyContacts.map(contact => `
                        <div class="contact-card">
                            <h4>${contact.organisation}</h4>
                            <p><strong>Role:</strong> ${contact.role}</p>
                            <p><strong>Contact:</strong> ${contact.contact}</p>
                            <p><strong>Website:</strong> <a href="${contact.website}" target="_blank">${contact.website}</a></p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        resultsContent.innerHTML = html;
        mappingResults.style.display = 'block';
        mappingResults.scrollIntoView({ behavior: 'smooth' });
    }

    function exportMappingReport() {
        const printWindow = window.open('', '_blank');
        const mappingContent = resultsContent.innerHTML;
        
        const reportHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Jurisdiction Mapping Report - SynD-DGF</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
                    .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
                    .mapping-section { margin-bottom: 25px; page-break-inside: avoid; }
                    .framework-card, .jurisdiction-card, .consideration-card, .process-card { 
                        border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; 
                    }
                    .risk-low { background: #e8f5e8; }
                    .risk-moderate { background: #fff3cd; }
                    .risk-high { background: #fce8e8; }
                    .importance-badge, .timeline-badge, .timeframe-badge, .priority-badge { 
                        background: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; 
                    }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SynD-DGF Jurisdiction Mapping Report</h1>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                ${mappingContent}
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

    function saveMappingToLocalStorage() {
        const formData = new FormData(form);
        const mappingData = {
            timestamp: new Date().toISOString(),
            formResponses: Object.fromEntries(formData.entries()),
            results: resultsContent.innerHTML
        };
        
        localStorage.setItem('jurisdictionMapping', JSON.stringify(mappingData));
        alert('Jurisdiction mapping saved successfully! You can return to this mapping later.');
    }

    // Load saved mapping on page load if available
    const savedMapping = localStorage.getItem('jurisdictionMapping');
    if (savedMapping) {
        try {
            const data = JSON.parse(savedMapping);
            const lastSaved = new Date(data.timestamp).toLocaleDateString();
            
            if (confirm(`Load your saved jurisdiction mapping from ${lastSaved}?`)) {
                // Restore form data
                for (const [key, value] of Object.entries(data.formResponses)) {
                    const field = form.elements[key];
                    if (field) field.value = value;
                }
                
                // Show results
                resultsContent.innerHTML = data.results;
                mappingResults.style.display = 'block';
            }
        } catch (e) {
            console.log('Could not load saved mapping');
        }
    }

    // Add CSS for the mapping results
    const mappingStyle = document.createElement('style');
    mappingStyle.textContent = `
        .tool-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .tool-interface {
            margin-bottom: 3rem;
        }

        .form-section {
            margin-bottom: 2.5rem;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
        }

        .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 1rem;
        }

        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 0.5rem;
            margin-top: 0.5rem;
        }

        .checkbox-group label {
            display: flex;
            align-items: center;
            font-weight: normal;
            margin-bottom: 0.25rem;
        }

        .checkbox-group input[type="checkbox"] {
            margin-right: 0.5rem;
            width: auto;
        }

        .form-actions {
            text-align: center;
            margin-top: 2rem;
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
            text-decoration: none;
            display: inline-block;
            margin-left: 1rem;
        }

        .button2:hover {
            background: #5a6268;
        }

        .mapping-results {
            margin-top: 3rem;
            padding: 2rem;
            border: 2px solid #007bff;
            border-radius: 8px;
            background: #f8f9fa;
        }

        .results-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #007bff;
        }

        .mapping-summary {
            margin-bottom: 2rem;
        }

        .risk-indicator {
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
        }

        .risk-low {
            background: #e8f5e8;
            border: 2px solid #28a745;
        }

        .risk-moderate {
            background: #fff3cd;
            border: 2px solid #ffc107;
        }

        .risk-high {
            background: #fce8e8;
            border: 2px solid #dc3545;
        }

        .mapping-section {
            margin-bottom: 2.5rem;
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .framework-card, .jurisdiction-card, .consideration-card, .process-card, .contact-card {
            border: 1px solid #dee2e6;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 6px;
            background: #f8f9fa;
        }

        .consideration-card.importance-critical {
            border-left: 4px solid #dc3545;
        }

        .consideration-card.importance-high {
            border-left: 4px solid #ffc107;
        }

        .timeline-phase {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-left: 4px solid #007bff;
            background: #f8f9fa;
        }

        .step-card {
            display: flex;
            align-items: center;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 6px;
        }

        .step-card.priority-1 {
            background: #fce8e8;
            border-left: 4px solid #dc3545;
        }

        .step-card.priority-2 {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
        }

        .step-card.priority-3 {
            background: #e8f5e8;
            border-left: 4px solid #28a745;
        }

        .step-header {
            flex: 1;
        }

        .importance-badge, .timeline-badge, .timeframe-badge, .priority-badge {
            background: #e9ecef;
            color: #495057;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-left: 0.5rem;
        }

        .results-actions {
            text-align: center;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 2px solid #e0e0e0;
        }

        .results-actions button {
            margin: 0 0.5rem;
        }

        @media (max-width: 768px) {
            .checkbox-group {
                grid-template-columns: 1fr;
            }
            
            .form-actions, .results-actions {
                text-align: center;
            }
            
            .form-actions button, .results-actions button {
                display: block;
                width: 100%;
                margin: 0.5rem 0;
            }
        }
    `;
    
    document.head.appendChild(mappingStyle);
});