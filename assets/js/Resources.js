// Resources Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Download functionality
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resourceType = this.dataset.resource;
            handleResourceDownload(resourceType, this);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('resource-search');
    const typeFilter = document.getElementById('resource-type');
    const audienceFilter = document.getElementById('resource-audience');
    const searchResults = document.getElementById('search-results');

    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 300);
    });

    typeFilter.addEventListener('change', performSearch);
    audienceFilter.addEventListener('change', performSearch);

    // Resource database for search
    const resources = [
        // Framework Appendices
        { title: "Appendix 1: Glossary", url: "/resources/appendices/glossary", type: "appendix", audience: ["technical", "legal", "executive"], description: "Comprehensive definitions of key terms and concepts used throughout the framework." },
        { title: "Appendix 2: Legal Analysis", url: "/resources/appendices/legal-analysis", type: "appendix", audience: ["legal", "executive"], description: "Detailed analysis of legal frameworks and privacy laws relevant to synthetic data use in health." },
        { title: "Appendix 3: International Approaches", url: "/resources/appendices/international-approaches", type: "appendix", audience: ["executive", "legal", "research"], description: "Review of international approaches to synthetic health data governance and regulation." },
        { title: "Appendix 4: Use Case Criteria", url: "/resources/appendices/use-case-criteria", type: "appendix", audience: ["technical", "research"], description: "Detailed criteria and examples for evaluating appropriate use cases for synthetic data." },
        { title: "Appendix 5: Data Characteristics", url: "/resources/appendices/data-characteristics", type: "appendix", audience: ["technical"], description: "Guidelines for assessing and documenting characteristics of source health data." },
        { title: "Appendix 6: Technical Assessment", url: "/resources/appendices/technical-assessment", type: "appendix", audience: ["technical"], description: "Framework for evaluating technical aspects of synthetic data generation methods." },
        { title: "Appendix 7: De-identification", url: "/resources/appendices/deidentification", type: "appendix", audience: ["technical", "legal"], description: "Comprehensive guidance on de-identification techniques and their relationship to synthetic data." },
        { title: "Appendix 8: Complex Scenarios", url: "/resources/appendices/complex-scenarios", type: "appendix", audience: ["technical", "research"], description: "Worked examples and guidance for handling complex synthetic data scenarios." },
        { title: "Appendix 9: Legal Pathways", url: "/resources/appendices/legal-pathways", type: "appendix", audience: ["legal"], description: "Detailed pathways for ensuring legal compliance across different jurisdictions." },
        { title: "Appendix 10: Five Safes Framework", url: "/resources/appendices/five-safes", type: "appendix", audience: ["technical", "executive"], description: "Application of the Five Safes framework to synthetic health data governance." },
        { title: "Appendix 11: Risk Assessment", url: "/resources/appendices/risk-assessment", type: "appendix", audience: ["technical", "executive"], description: "Comprehensive risk assessment methodologies for synthetic data projects." },
        { title: "Appendix 12: Stakeholder Engagement", url: "/resources/appendices/stakeholder-engagement", type: "appendix", audience: ["community", "executive"], description: "Best practices for engaging with stakeholders and communities about synthetic data use." },

        // Implementation Guides
        { title: "Getting Started Guide", url: "/resources/implementation/getting-started", type: "guide", audience: ["executive", "technical"], description: "Step-by-step guidance for beginning your synthetic data governance journey." },
        { title: "Step-by-Step Implementation", url: "/resources/implementation/step-by-step", type: "guide", audience: ["technical", "executive"], description: "Detailed implementation guidance for each framework step." },
        { title: "Common Challenges and Solutions", url: "/resources/implementation/common-challenges", type: "guide", audience: ["technical", "executive"], description: "Practical solutions to frequently encountered implementation challenges." },
        { title: "Best Practices and Lessons Learned", url: "/resources/implementation/best-practices", type: "guide", audience: ["executive", "technical"], description: "Insights from successful framework implementations." },

        // Templates
        { title: "Data Governance Policy Template", url: "/resources/templates/governance-policy", type: "template", audience: ["legal", "executive"], description: "Ready-to-use policy template for data governance frameworks." },
        { title: "Privacy Impact Assessment Template", url: "/resources/templates/privacy-policy", type: "template", audience: ["legal", "technical"], description: "Comprehensive PIA template for synthetic data projects." },
        { title: "Consent Form Templates", url: "/resources/templates/consent-forms", type: "template", audience: ["legal", "community"], description: "Template consent forms for health data use and synthetic data generation." },
        { title: "Data Sharing Agreement Templates", url: "/resources/templates/data-sharing", type: "template", audience: ["legal", "executive"], description: "Legal templates for data sharing agreements involving synthetic data." },

        // Training Materials
        { title: "Executive Briefing Materials", url: "/resources/training/executive-briefing", type: "training", audience: ["executive"], description: "Presentation materials for briefing senior leadership on synthetic data governance." },
        { title: "Technical Implementation Training", url: "/resources/training/technical-training", type: "training", audience: ["technical"], description: "Technical training materials for IT and data science teams." },
        { title: "Legal Compliance Training", url: "/resources/training/legal-compliance", type: "training", audience: ["legal"], description: "Training materials covering legal compliance requirements." },
        { title: "Stakeholder Engagement Toolkit", url: "/resources/training/stakeholder-engagement", type: "training", audience: ["community", "executive"], description: "Tools and materials for engaging with stakeholders about synthetic data." },

        // Technical Resources
        { title: "Synthetic Data Methods Overview", url: "/resources/technical/methods-overview", type: "technical", audience: ["technical", "research"], description: "Overview of different synthetic data generation methods and their applications." },
        { title: "Data Quality Assessment Metrics", url: "/resources/technical/quality-metrics", type: "technical", audience: ["technical"], description: "Metrics and methods for assessing synthetic data quality." },
        { title: "Privacy Protection Metrics", url: "/resources/technical/privacy-metrics", type: "technical", audience: ["technical", "legal"], description: "Technical metrics for evaluating privacy protection in synthetic data." },
        { title: "Validation and Testing Approaches", url: "/resources/technical/validation-approaches", type: "technical", audience: ["technical"], description: "Approaches for validating and testing synthetic data implementations." }
    ];

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const typeFilter_value = typeFilter.value;
        const audienceFilter_value = audienceFilter.value;

        if (!query && !typeFilter_value && !audienceFilter_value) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }

        let filteredResources = resources.filter(resource => {
            const matchesQuery = !query || 
                resource.title.toLowerCase().includes(query) || 
                resource.description.toLowerCase().includes(query);
            
            const matchesType = !typeFilter_value || resource.type === typeFilter_value;
            
            const matchesAudience = !audienceFilter_value || resource.audience.includes(audienceFilter_value);

            return matchesQuery && matchesType && matchesAudience;
        });

        displaySearchResults(filteredResources, query);
    }

    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>No resources found matching your criteria.</p>
                    <p>Try adjusting your search terms or filters.</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = `
                <div class="results-header">
                    <h3>Search results (${results.length} found)</h3>
                </div>
                <div class="results-list">
                    ${results.map(resource => `
                        <div class="result-item">
                            <h4><a href="${resource.url}">${highlightQuery(resource.title, query)}</a></h4>
                            <p class="result-description">${highlightQuery(resource.description, query)}</p>
                            <div class="result-meta">
                                <span class="resource-type">${formatType(resource.type)}</span>
                                <span class="resource-audience">${resource.audience.map(formatAudience).join(', ')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        searchResults.style.display = 'block';
    }

    function highlightQuery(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function formatType(type) {
        const typeMap = {
            'appendix': 'Framework Appendix',
            'guide': 'Implementation Guide',
            'template': 'Template',
            'training': 'Training Material',
            'technical': 'Technical Resource'
        };
        return typeMap[type] || type;
    }

    function formatAudience(audience) {
        const audienceMap = {
            'executive': 'Executive',
            'legal': 'Legal/Compliance',
            'technical': 'Technical/IT',
            'research': 'Research/Academic',
            'community': 'Community/Stakeholder'
        };
        return audienceMap[audience] || audience;
    }

    function handleResourceDownload(resourceType, buttonElement) {
        // Disable button temporarily
        const originalText = buttonElement.textContent;
        buttonElement.disabled = true;
        buttonElement.textContent = 'Preparing download...';

        // Simulate download preparation
        setTimeout(() => {
            // In a real implementation, this would trigger actual file download
            // For now, we'll just show a message
            
            const downloads = {
                'complete-framework': {
                    filename: 'SynD-DGF_Complete_Framework.zip',
                    size: '25MB',
                    description: 'Complete framework documentation and resources'
                },
                'assessment-tools': {
                    filename: 'SynD-DGF_Assessment_Tools.zip',
                    size: '5MB',
                    description: 'All assessment forms and checklists'
                },
                'templates': {
                    filename: 'SynD-DGF_Templates.zip',
                    size: '8MB',
                    description: 'Policy templates and governance documents'
                }
            };

            const download = downloads[resourceType];
            
            if (download) {
                // Show download dialog
                showDownloadDialog(download);
                
                // Re-enable button
                buttonElement.disabled = false;
                buttonElement.textContent = originalText;
            } else {
                buttonElement.textContent = 'Download unavailable';
                setTimeout(() => {
                    buttonElement.disabled = false;
                    buttonElement.textContent = originalText;
                }, 2000);
            }
        }, 1500);
    }

    function showDownloadDialog(download) {
        const dialogHTML = `
            <div class="download-dialog-overlay">
                <div class="download-dialog">
                    <h3>Download Resource Package</h3>
                    <div class="download-info">
                        <p><strong>File:</strong> ${download.filename}</p>
                        <p><strong>Size:</strong> ${download.size}</p>
                        <p><strong>Content:</strong> ${download.description}</p>
                    </div>
                    <div class="download-note">
                        <p><strong>Note:</strong> This resource package is provided for offline use and distribution within your organisation. Please respect the terms of use and attribution requirements.</p>
                    </div>
                    <div class="download-actions">
                        <button class="button1 download-confirm">Download Now</button>
                        <button class="button2 download-cancel">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        
        const overlay = document.querySelector('.download-dialog-overlay');
        const confirmBtn = overlay.querySelector('.download-confirm');
        const cancelBtn = overlay.querySelector('.download-cancel');

        confirmBtn.addEventListener('click', () => {
            // In a real implementation, trigger the actual download here
            alert(`Download would start for: ${download.filename}\n\nNote: This is a demonstration. In the live version, the actual file would be downloaded.`);
            overlay.remove();
        });

        cancelBtn.addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // Add search results styling
    const searchStyle = document.createElement('style');
    searchStyle.textContent = `
        .search-results {
            display: none;
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }

        .results-header h3 {
            margin-bottom: 1rem;
            color: #495057;
            font-size: 1.1rem;
        }

        .result-item {
            padding: 1rem;
            margin-bottom: 1rem;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #007bff;
        }

        .result-item:last-child {
            margin-bottom: 0;
        }

        .result-item h4 {
            margin-bottom: 0.5rem;
        }

        .result-item h4 a {
            color: #007bff;
            text-decoration: none;
        }

        .result-item h4 a:hover {
            text-decoration: underline;
        }

        .result-description {
            margin-bottom: 0.75rem;
            color: #6c757d;
            line-height: 1.4;
        }

        .result-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.9rem;
        }

        .resource-type {
            background: #e9ecef;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            color: #495057;
            font-weight: 500;
        }

        .resource-audience {
            color: #6c757d;
        }

        .no-results {
            text-align: center;
            padding: 2rem;
            color: #6c757d;
        }

        .search-interface {
            margin-bottom: 2rem;
        }

        .search-filters {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .search-filters .form-control {
            flex: 1;
        }

        mark {
            background: #fff3cd;
            padding: 0.1em 0.2em;
            border-radius: 2px;
        }

        .download-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .download-dialog {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .download-dialog h3 {
            margin-bottom: 1rem;
            color: #333;
        }

        .download-info p {
            margin-bottom: 0.5rem;
        }

        .download-note {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
            border-left: 4px solid #007bff;
        }

        .download-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
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
            transition: background 0.3s ease;
        }

        .button2:hover {
            background: #5a6268;
        }
    `;
    
    document.head.appendChild(searchStyle);
});