# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: NOT A POWER PAGES PROJECT

**THIS PROJECT IS NO LONGER USING MICROSOFT POWER PAGES.**

- This is a **standalone static website** project
- HTML files are standalone and DO NOT use Power Pages template includes
- DO NOT reference Power Pages deployment, Power Pages templates, or Power Pages infrastructure
- DO NOT use absolute paths like `/chatbot-assets/` - always use relative paths like `../../chatbot-assets/`
- Pages are individual `.en-US.webpage.copy.html` files that can be opened directly in a browser
- The `web-templates/` and `content-snippets/` directories contain legacy structure but are NOT actively used for template includes

## Project overview

SynD-DGF (Synthetic Data Governance Framework) is a standalone static website focused on navigating legal and technical data governance in synthetic health data. The project provides guidance resources, AI-powered assistance, and educational content about privacy compliance, technical standards, and regulatory insights.

## Repository structure

The codebase follows a standalone static website architecture:

- **`web-pages/`** - **PRIMARY:** All standalone HTML page files (.en-US.webpage.copy.html) - these are complete, self-contained pages
- **`chatbot-assets/`** - ChatKit chatbot CSS and JavaScript files (currently only used on Home page)
- **`assets/`** - Static assets like images (sloth3.ico avatar, etc.)
- **`content-snippets/`** - **LEGACY:** Not actively used for template includes (kept for reference only)
- **`web-templates/`** - **LEGACY:** Not actively used for template includes (kept for reference only)
- **`web-files/`** - Static file assets directory

## Page architecture

### Standalone pages
Each web page is a **complete, self-contained HTML file**:
- `.en-US.webpage.copy.html` - Complete HTML page (NOT a template fragment)
- Can be opened directly in a browser (file:// or via web server)
- Contains all CSS, HTML, and script references inline
- **Must use relative paths** for all assets (e.g., `../../chatbot-assets/chatbot.css`)
- Do NOT use absolute paths like `/chatbot-assets/` - they won't work when opening files directly

### Legacy template references
**IGNORE THESE** - they are not actively used:
- Template includes like `{% include 'Page Copy' %}` are legacy syntax
- `data-component-theme` attributes are legacy theming
- The site does NOT use a template/include system

## Development workflow

### File naming convention
- Use `.en-US.` prefix for localized content
- Webpage files: `PageName.en-US.webpage.copy.html`
- JavaScript files: `PageName.en-US.customjs.js`
- Content snippets: `ComponentName.en-US.html`

### Content updates
- Edit HTML files directly for content changes
- Modify content snippets for global elements
- Update individual page files for page-specific content

### No build system
This is a **static website** - no build tools, no Power Pages deployment, no template processing:
- Changes are made directly to HTML and JavaScript files
- Files can be opened directly in browser for testing
- No deployment pipeline required - just upload files to any web server or hosting service
- **Always use relative paths** for all assets (../../chatbot-assets/, ../assets/, etc.)
- Never use absolute paths like /chatbot-assets/ - they only work on deployed servers with specific routing

## Key pages and functionality

- **Home page** - Features hero section with background image, three-column feature layout highlighting privacy compliance, technical standards, and regulatory insights
- **Framework pages** - 5-step synthetic data governance process with comprehensive guidance
- **Assessment tools** - 6 interactive tools for use case evaluation, risk assessment, and compliance checking
- **Decision support** - 4 tools for complex scenarios, legal pathways, risk mitigation, and jurisdiction mapping
- **Resources section** - Complete framework documentation with 12 comprehensive appendices
- **Profile page** - User information collection with privacy notices
- **Search page** - Search functionality (implementation in custom JS)
- **Access Denied / Page Not Found** - Error handling pages

## Styling and theming

- Uses Bootstrap-like CSS classes (`row`, `col-md-*`, `container`)
- Custom button styling with `.button1` class
- Component theming system with `portalThemeColor*` themes
- Responsive design with flexbox layouts
- Uses CDN-hosted images from hubblecontent.osi.office.net

## Content focus areas

The platform provides guidance on:
1. **Privacy compliance** - Synthetic data generation alignment with privacy laws
2. **Technical standards** - Protocols for high-quality synthetic health data
3. **Regulatory insights** - Information on evolving regulations and policies
4. **AI-powered guidance** - Integrated AI assistance for governance questions
5. **Comprehensive assessment** - Detailed evaluation frameworks across legal, technical, ethical, and safety domains
6. **Implementation support** - Standardised forms, documentation templates, and audit trail requirements

## Writing and language guidelines

When working with content in this repository, follow these strict requirements:

### Language conventions
- Use Australian English spelling (colour, realise, centre, analyse, programme)
- Write all headings in sentence case only (never title case)
- Use standard hyphens (-) instead of em-dashes (—)
- Default to conversational, authentic tone unless academic/formal writing is requested
- Be direct and decisive rather than constantly qualifying statements

### Language patterns to avoid
Use less of these unless specifically requested:
- Meta-references: "this analysis", "our discussion", "this response"
- Excessive hedging: "potentially", "arguably", "it seems that", "one might say"
- Overused transitions: "furthermore", "moreover", "consequently", "in conclusion"
- Academic buzzwords: "comprehensive", "robust", "systematic", "holistic"
- Grandiose language: "vital role", "significant importance", "watershed moment"
- Promotional tone: "cutting-edge", "state-of-the-art", "revolutionary"
- Weasel words: "studies suggest", "experts believe", "it is widely accepted"
- Formulaic openings: "It is important to note that", "One must consider"
- Rule-of-three patterns (avoid listing three examples/adjectives repeatedly)
- Chatbot artefacts: "Certainly!", "I hope this helps", "Let me know if"

### Natural writing elements to use
- Mix short, direct sentences with longer explanatory ones (5-35 words)
- Use contractions naturally (it's, don't, won't)
- Include specific examples from health/medical contexts
- Apply relevant statistical or clinical terminology accurately
- Start some sentences with "And" or "But" for flow
- Add occasional parenthetical thoughts where helpful
- Use active voice predominantly
- Include domain-specific jargon when discussing data science or health topics

## Framework appendices

The platform includes 12 comprehensive appendices providing detailed guidance:

### Available appendices (12 of 12 complete):
1. **Appendix 1:** About synthetic data - Overview and foundational concepts
2. **Appendix 2:** Glossary - Complete terminology reference
3. **Appendix 3:** Policy and legal framework - Comprehensive legal guidance and Australian privacy law framework
4. **Appendix 4:** Use case assessment - Detailed criteria and scoring methodology for evaluating synthetic data use cases
5. **Appendix 5:** Impact assessment - Privacy, ethical, social, technical, and legal impact evaluation framework
6. **Appendix 6:** Technical assessment - Technical evaluation criteria, quality frameworks, and validation methodologies
7. **Appendix 7:** De-identification techniques - Traditional and modern privacy-preserving methods guide
8. **Appendix 9:** Lawful pathways explained - Detailed legal pathway guidance for Australian privacy compliance
9. **Appendix 10:** Safety assessment - Safety protocols, risk assessment, and incident response procedures
10. **Appendix 11:** Assessment outcomes - Standardised documentation forms and audit trail requirements
11. **Appendix 12:** Privacy obligations - Jurisdiction matrix and detailed privacy obligations

### All appendices complete:
- **Appendix 8:** Decision tree for complex scenarios ✅ (Complete - interactive decision tree and complex scenario guidance)

### Content characteristics:
- All appendices follow Australian English conventions
- Content is comprehensive yet accessible
- Interactive elements enhance traditional PDF-based guidance
- Appendices integrate with assessment tools for practical implementation
- Each appendix includes downloadable resources and documentation templates

## Recent major updates

### Phase 1 Implementation Complete (September 2025)
- Added 6 critical missing appendices to achieve 100% framework coverage
- Resolved all major content gaps identified in comprehensive analysis
- Enhanced legal, technical, and assessment guidance significantly
- Maintained interactive tool advantages while adding comprehensive detail
- All content follows established language and styling conventions

### Phase 2.3 Complex Scenarios Complete (September 2025)
- Implemented final appendix (Appendix 8) achieving complete framework coverage
- Added interactive decision tree for complex scenarios with 5 scenario types
- Created comprehensive complex scenario examples and case studies
- Established clear escalation pathways for complex implementations

### Phase 2.1 Resources Restructuring Complete (September 2025)
- Implemented multi-tiered resource organisation replacing flat structure
- Created 5 distinct resource categories for improved content discoverability
- Enhanced navigation with section anchors and dropdown categorisation
- Added direct PDF access for all 15 framework documentation parts
- Improved visual hierarchy with color-coded categories and status indicators

### Complete Framework Implementation Status (September 2025)
- **Framework Coverage:** 100% of all framework content implemented
- **Appendices Complete:** All 12 appendices fully operational with interactive features
- **Assessment Tools:** All 6 tools enhanced with framework integration and export functionality
- **Navigation System:** Complete cross-reference system and content tagging implemented
- **Decision Support:** Interactive decision trees for complex scenarios operational

## Resource organisation structure

The resources section now follows a hierarchical structure:

### Resource Categories:
1. **Framework Documentation** - Complete PDF downloads and implementation guides
2. **Assessment Resources** - Interactive tools, forms, and detailed criteria
3. **Legal and Compliance** - Australian privacy law matrix and guidance
4. **Technical Guidance** - De-identification techniques and quality standards
5. **Framework Appendices** - Complete collection with clear status indicators

### Navigation enhancements:
- Section anchors for direct category access
- Updated dropdown menus with proper categorisation
- Visual status indicators showing content availability
- Enhanced mobile and desktop navigation experience

## Recent UX improvements (October 2025)

### User experience enhancements implemented:
1. **Navigation consistency** - Fixed Complex Scenarios Navigator availability messaging across Home and Decision Support pages
2. **Link corrections** - Resolved broken links in Framework Overview to Complex Scenarios Navigator
3. **Typography optimization** - Reduced hero heading sizes from 3rem to 2.5rem for better visual balance
4. **Navigation aids** - Added floating back-to-top buttons on all long-form pages (Steps 1-5, Resources)
5. **Button hierarchy** - Implemented visual distinction between primary and secondary CTAs on Assessment Tools page
6. **Responsive design** - Enhanced mobile and tablet layouts for step card grids with proper breakpoints

### Technical implementation details:
- Back-to-top buttons appear after 200px scroll with smooth animation
- Secondary buttons (`.button2`) use outlined style vs solid primary buttons
- Mobile breakpoints: <768px (single column), 769-1024px (two columns)
- All changes maintain Australian English conventions and existing design language