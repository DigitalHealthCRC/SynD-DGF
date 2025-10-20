// Enhanced Search Functionality for SynD-DGF Framework
// Comprehensive search across all framework content with intelligent filtering

class SyndSearchEngine {
    constructor() {
        this.searchIndex = [];
        this.currentFilters = {
            contentType: 'all',
            frameworkStep: 'all-steps',
            organisationType: 'all-orgs',
            complexityLevel: 'all-complexity'
        };
        this.searchHistory = JSON.parse(localStorage.getItem('syndSearchHistory') || '[]');
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.bindEvents();
        this.loadSearchFromURL();
    }

    buildSearchIndex() {
        // Comprehensive search index covering all framework content
        this.searchIndex = [
            // Framework Overview and Steps
            {
                id: 'framework-overview',
                title: 'Framework Overview',
                type: 'framework',
                step: 'overview',
                content: 'SynD-DGF synthetic data governance framework 5-step process privacy compliance legal requirements health data Australia',
                url: '../framework-overview/FrameworkOverview.en-US.webpage.copy.html',
                snippet: 'Comprehensive 5-step framework for synthetic health data governance in Australia, covering legal compliance, privacy protection, and risk management.',
                orgType: ['healthcare-provider', 'research-institution', 'government', 'technology'],
                complexity: 'beginner'
            },
            {
                id: 'step1-use-case',
                title: 'Step 1: Use Case Assessment',
                type: 'framework',
                step: 'step1',
                content: 'use case assessment public benefit community consultation ethics impact vulnerable populations Indigenous data sovereignty',
                url: '../step-1-use-case-assessment/Step1UseCaseAssessment.en-US.webpage.copy.html',
                snippet: 'Assess your use case for public benefit, conduct community consultation, and evaluate ethical implications including vulnerable population considerations.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'beginner'
            },
            {
                id: 'step2-source-data',
                title: 'Step 2: Source Data Assessment',
                type: 'framework',
                step: 'step2',
                content: 'source data assessment governance security encryption access controls consent adequacy data sharing agreements',
                url: '../step-2-assess-source-data/Step2AssessSourceData.en-US.webpage.copy.html',
                snippet: 'Evaluate source data governance, implement security measures, review consent adequacy, and establish data sharing agreements.',
                orgType: ['healthcare-provider', 'research-institution', 'technology'],
                complexity: 'intermediate'
            },
            {
                id: 'step3-synthetic-generation',
                title: 'Step 3: Generate Synthetic Data',
                type: 'framework',
                step: 'step3',
                content: 'synthetic data generation methods quality metrics differential privacy k-anonymity utility preservation statistical validation',
                url: '../step-3-generate-synthetic-data/Step3GenerateSyntheticData.en-US.webpage.copy.html',
                snippet: 'Generate synthetic data using appropriate methods, validate quality metrics, and ensure privacy protection through technical safeguards.',
                orgType: ['research-institution', 'technology'],
                complexity: 'advanced'
            },
            {
                id: 'step4-risk-assessment',
                title: 'Step 4: Assess Re-identification Risks',
                type: 'framework',
                step: 'step4',
                content: 'risk assessment re-identification threats attack scenarios membership inference attribute inference linkage attacks threat modeling',
                url: '../step-4-assess-reidentification-risks/Step4AssessReidentificationRisks.en-US.webpage.copy.html',
                snippet: 'Systematically assess re-identification risks including membership inference, attribute inference, and linkage attack scenarios.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'advanced'
            },
            {
                id: 'step5-risk-management',
                title: 'Step 5: Manage Residual Risks',
                type: 'framework',
                step: 'step5',
                content: 'residual risk management mitigation strategies monitoring incident response governance ongoing compliance',
                url: '../step-5-manage-residual-risks/Step5ManageResidualRisks.en-US.webpage.copy.html',
                snippet: 'Implement risk mitigation strategies, establish ongoing monitoring, and maintain compliance through governance processes.',
                orgType: ['healthcare-provider', 'research-institution', 'government', 'technology'],
                complexity: 'intermediate'
            },

            // Assessment Tools
            {
                id: 'use-case-tool',
                title: 'Use Case Assessment Tool',
                type: 'tool',
                step: 'step1',
                content: 'interactive assessment tool use case evaluation public benefit community consultation checklist',
                url: '../assessment-tools/use-case-assessment-tool/UseCaseAssessmentTool.en-US.webpage.copy.html',
                snippet: 'Interactive tool for evaluating use cases, assessing public benefit, and managing community consultation requirements.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'beginner'
            },
            {
                id: 'risk-evaluation-tool',
                title: 'Risk Evaluation Tool',
                type: 'tool',
                step: 'step4',
                content: 'risk evaluation assessment re-identification threats vulnerability testing security analysis',
                url: '../assessment-tools/risk-evaluation-tool/RiskEvaluationTool.en-US.webpage.copy.html',
                snippet: 'Comprehensive risk evaluation tool for assessing re-identification threats and conducting vulnerability analysis.',
                orgType: ['healthcare-provider', 'research-institution', 'technology'],
                complexity: 'advanced'
            },
            {
                id: 'quality-metrics-tool',
                title: 'Quality Metrics Tool',
                type: 'tool',
                step: 'step3',
                content: 'quality metrics assessment statistical validation utility preservation fidelity measurement',
                url: '../assessment-tools/quality-metrics-tool/QualityMetricsTool.en-US.webpage.copy.html',
                snippet: 'Tool for evaluating synthetic data quality through statistical validation and utility preservation metrics.',
                orgType: ['research-institution', 'technology'],
                complexity: 'advanced'
            },
            {
                id: 'compliance-checklist-tool',
                title: 'Compliance Checklist Tool',
                type: 'tool',
                step: 'all-steps',
                content: 'compliance checklist legal requirements privacy obligations mandatory conditional recommended requirements',
                url: '../assessment-tools/compliance-checklist-tool/ComplianceChecklistTool.en-US.webpage.copy.html',
                snippet: 'Comprehensive compliance checklist covering legal requirements, privacy obligations, and governance processes across all framework steps.',
                orgType: ['healthcare-provider', 'research-institution', 'government', 'technology'],
                complexity: 'intermediate'
            },

            // Appendices
            {
                id: 'appendix-1-about-synthetic',
                title: 'Appendix 1: About Synthetic Data',
                type: 'appendix',
                step: 'overview',
                content: 'synthetic data definition types methods applications benefits limitations privacy protection',
                url: '../resources/appendices/about-synthetic-data/AboutSyntheticData.en-US.webpage.copy.html',
                snippet: 'Introduction to synthetic data including definitions, types, methods, applications, and privacy protection capabilities.',
                orgType: ['healthcare-provider', 'research-institution', 'government', 'technology'],
                complexity: 'beginner'
            },
            {
                id: 'appendix-2-glossary',
                title: 'Appendix 2: Glossary',
                type: 'appendix',
                step: 'overview',
                content: 'glossary definitions terminology synthetic data privacy governance legal compliance technical terms',
                url: '../resources/appendices/glossary/Glossary.en-US.webpage.copy.html',
                snippet: 'Comprehensive glossary of synthetic data, privacy, governance, and technical terminology used throughout the framework.',
                orgType: ['healthcare-provider', 'research-institution', 'government', 'technology'],
                complexity: 'beginner'
            },
            {
                id: 'appendix-3-policy-legal',
                title: 'Appendix 3: Policy & Legal Framework',
                type: 'appendix',
                step: 'overview',
                content: 'policy legal framework Privacy Act health data legislation state territory laws regulatory compliance',
                url: '../resources/appendices/policy-legal-framework/PolicyLegalFramework.en-US.webpage.copy.html',
                snippet: 'Overview of the policy and legal landscape governing synthetic health data in Australia including federal and state legislation.',
                orgType: ['healthcare-provider', 'government'],
                complexity: 'intermediate'
            },
            {
                id: 'appendix-4-use-case-assessment',
                title: 'Appendix 4: Use Case Assessment',
                type: 'appendix',
                step: 'step1',
                content: 'use case assessment detailed guidance public benefit evaluation community consultation ethics assessment',
                url: '../resources/appendices/use-case-assessment/UseCaseAssessment.en-US.webpage.copy.html',
                snippet: 'Detailed guidance on use case assessment including public benefit evaluation, community consultation, and ethics assessment.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'intermediate'
            },
            {
                id: 'appendix-5-impact-assessment',
                title: 'Appendix 5: Impact Assessment',
                type: 'appendix',
                step: 'step1',
                content: 'impact assessment privacy impact DPIA social impact vulnerable populations discrimination bias',
                url: '../resources/appendices/impact-assessment/ImpactAssessment.en-US.webpage.copy.html',
                snippet: 'Comprehensive impact assessment guidance including privacy impact assessment, social impact, and bias evaluation.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'intermediate'
            },
            {
                id: 'appendix-6-technical-assessment',
                title: 'Appendix 6: Technical Assessment',
                type: 'appendix',
                step: 'step3',
                content: 'technical assessment methods quality metrics statistical validation differential privacy k-anonymity',
                url: '../resources/appendices/technical-assessment/TechnicalAssessment.en-US.webpage.copy.html',
                snippet: 'Technical assessment methodologies, quality metrics, and privacy-preserving techniques for synthetic data generation.',
                orgType: ['research-institution', 'technology'],
                complexity: 'expert'
            },
            {
                id: 'appendix-7-deidentification',
                title: 'Appendix 7: De-identification Techniques',
                type: 'appendix',
                step: 'step2',
                content: 'deidentification techniques anonymisation pseudonymisation k-anonymity l-diversity t-closeness differential privacy',
                url: '../resources/appendices/deidentification-techniques/DeidentificationTechniques.en-US.webpage.copy.html',
                snippet: 'Comprehensive guide to de-identification techniques including k-anonymity, l-diversity, t-closeness, and differential privacy.',
                orgType: ['research-institution', 'technology'],
                complexity: 'expert'
            },
            {
                id: 'appendix-8-complex-scenarios',
                title: 'Appendix 8: Complex Scenarios',
                type: 'appendix',
                step: 'all-steps',
                content: 'complex scenarios multi-stakeholder projects high-risk data vulnerable populations Indigenous data sovereignty',
                url: '../resources/appendices/complex-scenarios/ComplexScenarios.en-US.webpage.copy.html',
                snippet: 'Guidance for complex scenarios including multi-stakeholder projects, high-risk data, and Indigenous data sovereignty.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'expert'
            },
            {
                id: 'appendix-9-lawful-pathways',
                title: 'Appendix 9: Lawful Pathways',
                type: 'appendix',
                step: 'overview',
                content: 'lawful pathways legal basis consent public interest research exception health promotion',
                url: '../resources/appendices/lawful-pathways/LawfulPathways.en-US.webpage.copy.html',
                snippet: 'Legal pathways for synthetic data projects including consent, public interest, research exceptions, and health promotion.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'advanced'
            },
            {
                id: 'appendix-10-safety-assessment',
                title: 'Appendix 10: Safety Assessment',
                type: 'appendix',
                step: 'step4',
                content: 'safety assessment threat modeling attack scenarios membership inference attribute inference linkage attacks',
                url: '../resources/appendices/safety-assessment/SafetyAssessment.en-US.webpage.copy.html',
                snippet: 'Safety assessment methodologies including threat modeling, attack scenario analysis, and vulnerability testing.',
                orgType: ['research-institution', 'technology'],
                complexity: 'expert'
            },
            {
                id: 'appendix-11-assessment-outcomes',
                title: 'Appendix 11: Assessment Outcomes',
                type: 'appendix',
                step: 'all-steps',
                content: 'assessment outcomes decision making interpretation guidance compliance readiness implementation decisions',
                url: '../resources/appendices/assessment-outcomes/AssessmentOutcomes.en-US.webpage.copy.html',
                snippet: 'Guidance on interpreting assessment outcomes, making implementation decisions, and determining compliance readiness.',
                orgType: ['healthcare-provider', 'research-institution', 'government', 'technology'],
                complexity: 'intermediate'
            },
            {
                id: 'appendix-12-privacy-obligations',
                title: 'Appendix 12: Privacy Obligations',
                type: 'appendix',
                step: 'overview',
                content: 'privacy obligations Privacy Act Australian Privacy Principles health records acts regulatory compliance',
                url: '../resources/appendices/privacy-obligations/PrivacyObligations.en-US.webpage.copy.html',
                snippet: 'Comprehensive overview of privacy obligations under Australian law including Privacy Act and health records legislation.',
                orgType: ['healthcare-provider', 'government'],
                complexity: 'advanced'
            },

            // Decision Support Tools
            {
                id: 'decision-support-overview',
                title: 'Decision Support Overview',
                type: 'guidance',
                step: 'overview',
                content: 'decision support tools interactive guidance complex scenarios legal pathways risk mitigation',
                url: '../decision-support-overview/DecisionSupportOverview.en-US.webpage.copy.html',
                snippet: 'Overview of interactive decision support tools for navigating complex scenarios and legal pathways.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'intermediate'
            },
            {
                id: 'complex-scenarios-navigator',
                title: 'Complex Scenarios Navigator',
                type: 'guidance',
                step: 'all-steps',
                content: 'complex scenarios navigator multi-stakeholder projects high-risk data vulnerable populations decision tree',
                url: '../Complex Scenarios Navigator/ComplexScenariosNavigator.en-US.webpage.copy.html',
                snippet: 'Interactive navigator for complex scenarios including multi-stakeholder projects and high-risk data situations.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'advanced'
            },
            {
                id: 'legal-pathways-wizard',
                title: 'Legal Pathways Wizard',
                type: 'guidance',
                step: 'overview',
                content: 'legal pathways wizard consent public interest research exception health promotion lawful basis',
                url: '../legal-pathways-wizard/LegalPathwaysWizard.en-US.webpage.copy.html',
                snippet: 'Interactive wizard to identify appropriate legal pathways for your synthetic data project.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'advanced'
            },
            {
                id: 'risk-mitigation-planner',
                title: 'Risk Mitigation Planner',
                type: 'guidance',
                step: 'step5',
                content: 'risk mitigation planner strategies monitoring incident response governance compliance management',
                url: '../risk-mitigation-planner/RiskMitigationPlanner.en-US.webpage.copy.html',
                snippet: 'Interactive planner for developing risk mitigation strategies and ongoing compliance management.',
                orgType: ['healthcare-provider', 'research-institution', 'government', 'technology'],
                complexity: 'advanced'
            },
            {
                id: 'jurisdiction-mapper',
                title: 'Jurisdiction Mapper',
                type: 'guidance',
                step: 'overview',
                content: 'jurisdiction mapper Australian states territories privacy laws health data legislation regulatory requirements',
                url: '../jurisdiction-mapper/JurisdictionMapper.en-US.webpage.copy.html',
                snippet: 'Interactive mapper showing privacy laws and health data legislation across Australian states and territories.',
                orgType: ['healthcare-provider', 'government'],
                complexity: 'intermediate'
            },

            // Resources and About Pages
            {
                id: 'resources-overview',
                title: 'Resources Overview',
                type: 'resource',
                step: 'overview',
                content: 'resources documentation appendices assessment tools technical guidance legal compliance',
                url: '../resources/Resources.en-US.webpage.copy.html',
                snippet: 'Comprehensive collection of framework documentation, appendices, assessment tools, and guidance resources.',
                orgType: ['healthcare-provider', 'research-institution', 'government', 'technology'],
                complexity: 'beginner'
            },
            {
                id: 'about-framework',
                title: 'About the Framework',
                type: 'resource',
                step: 'overview',
                content: 'about framework development methodology stakeholder consultation Digital Health CRC research',
                url: '../about/about-framework/AboutFramework.en-US.webpage.copy.html',
                snippet: 'Information about the framework development, methodology, and stakeholder consultation process.',
                orgType: ['healthcare-provider', 'research-institution', 'government', 'technology'],
                complexity: 'beginner'
            },
            {
                id: 'methodology',
                title: 'Methodology',
                type: 'resource',
                step: 'overview',
                content: 'methodology development process research design stakeholder engagement evidence synthesis',
                url: '../about/methodology/Methodology.en-US.webpage.copy.html',
                snippet: 'Detailed methodology used in developing the SynD-DGF framework including research design and stakeholder engagement.',
                orgType: ['research-institution'],
                complexity: 'advanced'
            },
            {
                id: 'stakeholder-consultation',
                title: 'Stakeholder Consultation',
                type: 'resource',
                step: 'overview',
                content: 'stakeholder consultation process engagement results feedback implementation community involvement',
                url: '../about/stakeholder-consultation/StakeholderConsultation.en-US.webpage.copy.html',
                snippet: 'Results and insights from stakeholder consultation process including community engagement and feedback.',
                orgType: ['healthcare-provider', 'research-institution', 'government'],
                complexity: 'intermediate'
            }
        ];
    }

    bindEvents() {
        // Main search functionality
        const searchInput = document.getElementById('mainSearchInput');
        const searchBtn = document.getElementById('mainSearchBtn');

        searchBtn.addEventListener('click', () => this.performSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Real-time search as user types (debounced)
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (searchInput.value.length > 2) {
                    this.performSearch();
                } else if (searchInput.value.length === 0) {
                    this.showSuggestions();
                }
            }, 300);
        });

        // Advanced search toggle
        const advancedToggle = document.getElementById('advancedToggle');
        const advancedFilters = document.getElementById('advancedFilters');

        advancedToggle.addEventListener('click', () => {
            advancedFilters.classList.toggle('show');
            advancedToggle.textContent = advancedFilters.classList.contains('show')
                ? 'Hide Advanced Options'
                : 'Advanced Search Options';
        });

        // Filter tags
        this.bindFilterEvents();

        // Quick search suggestions
        document.querySelectorAll('.quick-search-item, .suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const searchTerm = item.getAttribute('data-search');
                if (searchTerm) {
                    searchInput.value = searchTerm;
                    this.performSearch();
                }
            });
        });

        // URL handling for shareable searches
        window.addEventListener('popstate', () => {
            this.loadSearchFromURL();
        });
    }

    bindFilterEvents() {
        // Content type filters
        document.querySelectorAll('#contentTypeFilters .filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.setActiveFilter('#contentTypeFilters', tag);
                this.currentFilters.contentType = tag.getAttribute('data-filter');
                this.performSearch();
            });
        });

        // Framework step filters
        document.querySelectorAll('#stepFilters .filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.setActiveFilter('#stepFilters', tag);
                this.currentFilters.frameworkStep = tag.getAttribute('data-filter');
                this.performSearch();
            });
        });

        // Organisation type filters
        document.querySelectorAll('#orgTypeFilters .filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.setActiveFilter('#orgTypeFilters', tag);
                this.currentFilters.organisationType = tag.getAttribute('data-filter');
                this.performSearch();
            });
        });

        // Complexity level filters
        document.querySelectorAll('#complexityFilters .filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.setActiveFilter('#complexityFilters', tag);
                this.currentFilters.complexityLevel = tag.getAttribute('data-filter');
                this.performSearch();
            });
        });
    }

    setActiveFilter(containerSelector, activeTag) {
        document.querySelectorAll(`${containerSelector} .filter-tag`).forEach(tag => {
            tag.classList.remove('active');
        });
        activeTag.classList.add('active');
    }

    performSearch() {
        const searchTerm = document.getElementById('mainSearchInput').value.trim();

        if (!searchTerm) {
            this.showSuggestions();
            return;
        }

        // Add to search history
        this.addToSearchHistory(searchTerm);

        // Update URL for shareable searches
        this.updateURLWithSearch(searchTerm);

        // Show loading state
        this.showLoadingState();

        // Perform search with a small delay to show loading animation
        setTimeout(() => {
            const results = this.searchContent(searchTerm);
            this.displayResults(results, searchTerm);
        }, 500);
    }

    searchContent(searchTerm) {
        const terms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
        const results = [];

        this.searchIndex.forEach(item => {
            let score = 0;
            const titleWords = item.title.toLowerCase();
            const contentWords = item.content.toLowerCase();
            const snippetWords = item.snippet.toLowerCase();

            // Calculate relevance score
            terms.forEach(term => {
                // Title matches (highest weight)
                if (titleWords.includes(term)) {
                    score += 10;
                }

                // Exact phrase matches in title
                if (titleWords.includes(searchTerm.toLowerCase())) {
                    score += 20;
                }

                // Content matches (medium weight)
                if (contentWords.includes(term)) {
                    score += 5;
                }

                // Snippet matches (medium weight)
                if (snippetWords.includes(term)) {
                    score += 3;
                }

                // Partial word matches (lower weight)
                if (titleWords.includes(term.substring(0, Math.max(3, term.length - 2)))) {
                    score += 2;
                }
            });

            // Apply filters
            if (this.shouldIncludeResult(item, score)) {
                results.push({
                    ...item,
                    score,
                    highlightedTitle: this.highlightSearchTerms(item.title, terms),
                    highlightedSnippet: this.highlightSearchTerms(item.snippet, terms)
                });
            }
        });

        // Sort by relevance score
        return results.sort((a, b) => b.score - a.score);
    }

    shouldIncludeResult(item, score) {
        if (score === 0) return false;

        // Content type filter
        if (this.currentFilters.contentType !== 'all' && item.type !== this.currentFilters.contentType) {
            return false;
        }

        // Framework step filter
        if (this.currentFilters.frameworkStep !== 'all-steps') {
            if (item.step !== this.currentFilters.frameworkStep && item.step !== 'all-steps' && item.step !== 'overview') {
                return false;
            }
        }

        // Organisation type filter
        if (this.currentFilters.organisationType !== 'all-orgs') {
            if (!item.orgType.includes(this.currentFilters.organisationType)) {
                return false;
            }
        }

        // Complexity level filter
        if (this.currentFilters.complexityLevel !== 'all-complexity') {
            if (item.complexity !== this.currentFilters.complexityLevel) {
                return false;
            }
        }

        return true;
    }

    highlightSearchTerms(text, terms) {
        let highlighted = text;
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });
        return highlighted;
    }

    displayResults(results, searchTerm) {
        const resultsContainer = document.getElementById('resultsContainer');
        const resultsCount = document.getElementById('resultsCount');
        const searchResults = document.getElementById('searchResults');
        const searchSuggestions = document.getElementById('searchSuggestions');
        const noResults = document.getElementById('noResults');

        // Hide suggestions
        searchSuggestions.style.display = 'none';
        noResults.style.display = 'none';

        if (results.length === 0) {
            searchResults.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        // Show results
        searchResults.style.display = 'block';
        resultsCount.textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${searchTerm}"`;

        // Generate results HTML
        const resultsHTML = results.map(result => `
            <div class="result-item">
                <a href="${result.url}" class="result-title">${result.highlightedTitle}</a>
                <div class="result-meta">
                    <span class="result-type ${result.type}">${this.getTypeLabel(result.type)}</span>
                    ${result.step !== 'overview' ? `<span class="result-type">${this.getStepLabel(result.step)}</span>` : ''}
                    <span class="result-type">${this.getComplexityLabel(result.complexity)}</span>
                </div>
                <div class="result-snippet">${result.highlightedSnippet}</div>
                <div class="result-path">${result.url.replace('../', '').replace('.en-US.webpage.copy.html', '')}</div>
            </div>
        `).join('');

        resultsContainer.innerHTML = resultsHTML;

        // Track search analytics
        this.trackSearchAnalytics(searchTerm, results.length);
    }

    getTypeLabel(type) {
        const labels = {
            'framework': 'Framework Step',
            'tool': 'Assessment Tool',
            'appendix': 'Appendix',
            'resource': 'Resource',
            'guidance': 'Guidance'
        };
        return labels[type] || type;
    }

    getStepLabel(step) {
        const labels = {
            'step1': 'Step 1',
            'step2': 'Step 2',
            'step3': 'Step 3',
            'step4': 'Step 4',
            'step5': 'Step 5',
            'all-steps': 'All Steps'
        };
        return labels[step] || step;
    }

    getComplexityLabel(complexity) {
        const labels = {
            'beginner': 'Beginner',
            'intermediate': 'Intermediate',
            'advanced': 'Advanced',
            'expert': 'Expert'
        };
        return labels[complexity] || complexity;
    }

    showLoadingState() {
        const searchResults = document.getElementById('searchResults');
        const searchSuggestions = document.getElementById('searchSuggestions');
        const noResults = document.getElementById('noResults');
        const resultsContainer = document.getElementById('resultsContainer');

        searchSuggestions.style.display = 'none';
        noResults.style.display = 'none';
        searchResults.style.display = 'block';

        resultsContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Searching the SynD-DGF framework...</p>
            </div>
        `;
    }

    showSuggestions() {
        const searchResults = document.getElementById('searchResults');
        const searchSuggestions = document.getElementById('searchSuggestions');
        const noResults = document.getElementById('noResults');

        searchResults.style.display = 'none';
        noResults.style.display = 'none';
        searchSuggestions.style.display = 'block';
    }

    addToSearchHistory(searchTerm) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item.term !== searchTerm);

        // Add to beginning
        this.searchHistory.unshift({
            term: searchTerm,
            timestamp: new Date().toISOString(),
            filters: { ...this.currentFilters }
        });

        // Keep only last 50 searches
        this.searchHistory = this.searchHistory.slice(0, 50);

        // Save to localStorage
        localStorage.setItem('syndSearchHistory', JSON.stringify(this.searchHistory));
    }

    updateURLWithSearch(searchTerm) {
        const url = new URL(window.location);
        url.searchParams.set('q', searchTerm);

        // Add filters to URL
        Object.entries(this.currentFilters).forEach(([key, value]) => {
            if (value !== 'all' && value !== 'all-steps' && value !== 'all-orgs' && value !== 'all-complexity') {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });

        window.history.pushState({ searchTerm, filters: this.currentFilters }, '', url);
    }

    loadSearchFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('q');

        if (searchTerm) {
            document.getElementById('mainSearchInput').value = searchTerm;

            // Load filters from URL
            this.currentFilters.contentType = urlParams.get('contentType') || 'all';
            this.currentFilters.frameworkStep = urlParams.get('frameworkStep') || 'all-steps';
            this.currentFilters.organisationType = urlParams.get('organisationType') || 'all-orgs';
            this.currentFilters.complexityLevel = urlParams.get('complexityLevel') || 'all-complexity';

            // Update filter UI
            this.updateFilterUI();

            // Perform search
            this.performSearch();
        }
    }

    updateFilterUI() {
        // Update content type filter
        document.querySelectorAll('#contentTypeFilters .filter-tag').forEach(tag => {
            tag.classList.toggle('active', tag.getAttribute('data-filter') === this.currentFilters.contentType);
        });

        // Update step filter
        document.querySelectorAll('#stepFilters .filter-tag').forEach(tag => {
            tag.classList.toggle('active', tag.getAttribute('data-filter') === this.currentFilters.frameworkStep);
        });

        // Update org type filter
        document.querySelectorAll('#orgTypeFilters .filter-tag').forEach(tag => {
            tag.classList.toggle('active', tag.getAttribute('data-filter') === this.currentFilters.organisationType);
        });

        // Update complexity filter
        document.querySelectorAll('#complexityFilters .filter-tag').forEach(tag => {
            tag.classList.toggle('active', tag.getAttribute('data-filter') === this.currentFilters.complexityLevel);
        });
    }

    trackSearchAnalytics(searchTerm, resultCount) {
        // Track search analytics for insights and improvements
        const analytics = JSON.parse(localStorage.getItem('syndSearchAnalytics') || '{}');

        if (!analytics.searches) {
            analytics.searches = [];
        }

        analytics.searches.push({
            term: searchTerm,
            resultCount: resultCount,
            filters: { ...this.currentFilters },
            timestamp: new Date().toISOString()
        });

        // Keep only last 1000 searches for analytics
        analytics.searches = analytics.searches.slice(-1000);

        localStorage.setItem('syndSearchAnalytics', JSON.stringify(analytics));
    }

    // Public methods for external integration
    getSearchHistory() {
        return this.searchHistory;
    }

    getSearchAnalytics() {
        return JSON.parse(localStorage.getItem('syndSearchAnalytics') || '{}');
    }

    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('syndSearchHistory');
    }
}

// Initialize search engine when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.syndSearch = new SyndSearchEngine();
});