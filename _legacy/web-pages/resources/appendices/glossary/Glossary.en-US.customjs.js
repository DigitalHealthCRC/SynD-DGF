// Glossary JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('glossary-search');
    const clearButton = document.getElementById('clear-search');
    const searchResults = document.getElementById('search-results');
    const glossaryTerms = document.getElementById('glossary-terms');
    const letterLinks = document.querySelectorAll('.letter-link');

    let searchTimeout;

    // Search functionality
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performGlossarySearch();
        }, 300);
    });

    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        clearSearch();
    });

    // Letter navigation
    letterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Clear any search
                clearSearch();
                
                // Smooth scroll to letter section
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // Highlight the letter section briefly
                targetElement.style.backgroundColor = '#f8f9fa';
                setTimeout(() => {
                    targetElement.style.backgroundColor = '';
                }, 1000);
            }
        });
    });

    function performGlossarySearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            clearSearch();
            return;
        }

        // Get all term entries
        const termEntries = document.querySelectorAll('.term-entry');
        const matchingTerms = [];

        termEntries.forEach(entry => {
            const term = entry.querySelector('.term').textContent.toLowerCase();
            const definition = entry.querySelector('.definition').textContent.toLowerCase();
            const context = entry.querySelector('.term-context')?.textContent.toLowerCase() || '';
            
            if (term.includes(query) || definition.includes(query) || context.includes(query)) {
                matchingTerms.push({
                    element: entry.cloneNode(true),
                    term: entry.querySelector('.term').textContent,
                    relevance: calculateRelevance(query, term, definition, context)
                });
            }
        });

        // Sort by relevance
        matchingTerms.sort((a, b) => b.relevance - a.relevance);

        displaySearchResults(matchingTerms, query);
    }

    function calculateRelevance(query, term, definition, context) {
        let relevance = 0;
        
        // Exact term match gets highest score
        if (term.toLowerCase() === query) relevance += 100;
        else if (term.toLowerCase().includes(query)) relevance += 50;
        
        // Definition matches
        const definitionWords = definition.split(' ');
        const queryWords = query.split(' ');
        
        queryWords.forEach(qWord => {
            definitionWords.forEach(dWord => {
                if (dWord.includes(qWord)) relevance += 5;
            });
        });
        
        // Context matches
        if (context.includes(query)) relevance += 10;
        
        return relevance;
    }

    function displaySearchResults(matchingTerms, query) {
        if (matchingTerms.length === 0) {
            searchResults.innerHTML = `
                <div class="no-search-results">
                    <h3>No terms found</h3>
                    <p>No glossary terms match "${query}". Try a different search term or browse by letter.</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = `
                <div class="search-results-header">
                    <h3>Search results for "${query}" (${matchingTerms.length} found)</h3>
                    <button type="button" id="back-to-glossary" class="back-button">← Back to full glossary</button>
                </div>
                <div class="search-results-list">
                    ${matchingTerms.map(item => highlightSearchTerm(item.element.outerHTML, query)).join('')}
                </div>
            `;
            
            // Add back button functionality
            document.getElementById('back-to-glossary').addEventListener('click', clearSearch);
        }

        // Show search results, hide main glossary
        searchResults.style.display = 'block';
        glossaryTerms.style.display = 'none';
    }

    function highlightSearchTerm(html, query) {
        const queryWords = query.split(' ');
        let highlightedHtml = html;
        
        queryWords.forEach(word => {
            if (word.length > 2) { // Only highlight meaningful words
                const regex = new RegExp(`(${escapeRegex(word)})`, 'gi');
                highlightedHtml = highlightedHtml.replace(regex, '<mark>$1</mark>');
            }
        });
        
        return highlightedHtml;
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function clearSearch() {
        searchResults.style.display = 'none';
        glossaryTerms.style.display = 'block';
        searchInput.value = '';
    }

    // Add print functionality
    function addPrintButton() {
        const printButton = document.createElement('button');
        printButton.className = 'button1 print-button';
        printButton.textContent = 'Print Glossary';
        printButton.style.marginTop = '2rem';
        
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        document.querySelector('.appendix-navigation').insertBefore(printButton, document.querySelector('.nav-buttons'));
    }

    addPrintButton();

    // Add CSS for search functionality
    const glossaryStyle = document.createElement('style');
    glossaryStyle.textContent = `
        .appendix-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid #e0e0e0;
        }

        .appendix-number {
            display: inline-block;
            width: 60px;
            height: 60px;
            background: #007bff;
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            border-radius: 50%;
            line-height: 60px;
            text-align: center;
            margin-bottom: 1rem;
        }

        .glossary-navigation {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }

        .alphabet-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            align-items: center;
            margin-bottom: 1rem;
        }

        .nav-label {
            font-weight: 600;
            margin-right: 0.5rem;
            color: #495057;
        }

        .letter-link {
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: white;
            color: #007bff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            transition: all 0.3s ease;
            border: 1px solid #dee2e6;
        }

        .letter-link:hover {
            background: #007bff;
            color: white;
            text-decoration: none;
        }

        .search-box {
            display: flex;
            gap: 0.5rem;
            max-width: 500px;
        }

        .search-box .form-control {
            flex: 1;
        }

        .clear-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.375rem 1rem;
            border-radius: 4px;
            cursor: pointer;
        }

        .clear-btn:hover {
            background: #5a6268;
        }

        .letter-section {
            margin-bottom: 3rem;
        }

        .letter-heading {
            font-size: 2rem;
            color: #007bff;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #007bff;
            display: inline-block;
            min-width: 60px;
        }

        .term-entry {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #e0e0e0;
        }

        .term-entry:last-child {
            border-bottom: none;
        }

        .term {
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }

        .definition {
            color: #495057;
            line-height: 1.6;
            margin-bottom: 0.75rem;
        }

        .term-context {
            background: #e3f2fd;
            padding: 0.75rem;
            border-radius: 4px;
            color: #1565c0;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            border-left: 4px solid #2196f3;
        }

        .term-related {
            color: #6c757d;
            font-size: 0.9rem;
            font-style: italic;
        }

        .term-related a {
            color: #007bff;
            text-decoration: none;
        }

        .term-related a:hover {
            text-decoration: underline;
        }

        .search-results {
            margin-bottom: 2rem;
        }

        .search-results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #007bff;
        }

        .back-button {
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
        }

        .back-button:hover {
            background: #5a6268;
        }

        .search-results-list {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
        }

        .no-search-results {
            text-align: center;
            padding: 3rem 1rem;
            color: #6c757d;
        }

        .no-search-results h3 {
            color: #495057;
            margin-bottom: 1rem;
        }

        mark {
            background: #fff3cd;
            padding: 0.1em 0.2em;
            border-radius: 2px;
            font-weight: 500;
        }

        .print-button {
            margin-right: 1rem;
        }

        @media print {
            .glossary-navigation,
            .search-results,
            .print-button {
                display: none !important;
            }
            
            .term-entry {
                break-inside: avoid;
            }
            
            .letter-section {
                break-inside: avoid;
            }
        }

        @media (max-width: 768px) {
            .alphabet-nav {
                justify-content: center;
            }
            
            .search-box {
                flex-direction: column;
                max-width: none;
            }
            
            .search-results-header {
                flex-direction: column;
                gap: 1rem;
                align-items: flex-start;
            }
        }
    `;
    
    document.head.appendChild(glossaryStyle);
});