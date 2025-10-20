# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: CLEAN STATIC WEBSITE

**This is a professional static website with clean structure** (restructured October 2025).

- **Standalone static website** - no build system, no templates
- HTML files use simple names: `index.html`, `framework.html`, etc.
- **Always use relative paths** for all assets (e.g., `assets/chatbot/chatbot.css`)
- DO NOT use absolute paths like `/assets/` - they won't work with file:// protocol
- Pages can be opened directly in browser or served by any web server
- All legacy Power Pages references archived in `_legacy/` folder

## Project overview

SynD-DGF (Synthetic Data Governance Framework) is a standalone static website focused on navigating legal and technical data governance in synthetic health data. The project provides guidance resources, AI-powered assistance, and educational content about privacy compliance, technical standards, and regulatory insights.

## Repository structure (October 2025 Restructure)

Clean, professional static website structure:

```
Root/
├── index.html                          # Home page
├── framework.html                      # Framework overview
├── assessment-tools.html               # Assessment tools hub
├── decision-support.html               # Decision support hub
├── resources.html                      # Resources hub
│
├── about/                              # About section (5 pages)
├── tools/                              # Interactive tools (8 tools)
├── decision-support/                   # Decision support tools (3 tools)
├── framework/                          # Framework steps (5 steps)
├── resources/appendices/               # Framework appendices (12 appendices)
│
├── assets/                             # All static assets consolidated
│   ├── css/                            # All CSS files
│   ├── js/                             # All JavaScript files
│   ├── images/                         # Images
│   └── chatbot/                        # Chatbot assets
│
├── cloudflare-worker/                  # Chatbot backend (serverless)
└── _legacy/                            # Old Power Pages structure (archived)
    ├── web-pages/
    ├── content-snippets/
    ├── web-templates/
    └── [redirect-only folders]
```

**Key Changes (October 2025):**
- Moved from `web-pages/` nested structure to clean root-level organization
- Renamed from `.en-US.webpage.copy.html` to simple `.html`
- Consolidated all assets into single `assets/` directory
- Removed all redirect-only folders
- Archived old structure in `_legacy/` for reference

## Page architecture

### Clean static pages
Each web page is a **complete, self-contained HTML file**:
- Simple `.html` extension (e.g., `index.html`, `framework.html`)
- Can be opened directly in a browser (file:// or via web server)
- Contains all CSS, HTML, and script references inline or via relative paths
- **Must use relative paths** for all assets (e.g., `assets/chatbot/chatbot.css`)
- Do NOT use absolute paths like `/assets/` - they won't work when opening files directly

### Path patterns
- **From root pages** to assets: `assets/css/Home.css`
- **From subdirectory pages** to assets: `../assets/css/About.css`
- **From nested pages** to assets: `../../assets/js/Glossary.js`
- **Between pages**: Use relative paths (e.g., `../about/index.html`)

## Development workflow

### File naming convention
- Simple HTML files: `index.html`, `framework.html`, `compliance-checklist.html`
- CSS files in assets: `assets/css/[PageName].css`
- JS files in assets: `assets/js/[PageName].js`

### Content updates
- Edit HTML files directly for content changes
- Modify CSS files in `assets/css/` for styling
- Update JS files in `assets/js/` for functionality
- Test locally by opening files or using local server

### No build system
This is a **static website** - no build tools, no compilation, no bundling:
- Changes are made directly to HTML, CSS, and JavaScript files
- Files can be opened directly in browser for testing
- Deploy by pushing to GitHub (auto-deploys via GitHub Actions)
- Works with any static hosting: GitHub Pages, Netlify, Vercel, etc.
- **Always use relative paths** for all assets

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

**Unified CSS Design System (October 2025):**
- **Single CSS file:** `assets/css/synd-design-system.css` - unified design system for entire website
- **Forest Canopy theme:** Natural, professional colour palette inspired by earth tones
- **Colour palette:**
  - Forest Green (#2d4a2b) - Primary navigation, buttons, headings
  - Sage (#7d8471) - Secondary elements, accents
  - Olive (#a4ac86) - Light accents, hover states
  - Ivory (#faf9f6) - Backgrounds, cards
- **No inline styles:** All styling through external CSS file
- **Component classes:**
  - `.btn-modern-primary`, `.btn-modern-secondary`, `.btn-modern-accent` - Button variants
  - `.step-card-modern`, `.tool-card-modern`, `.resource-card-modern` - Card components
  - `.hero-modern`, `.hero-framework` - Hero sections with Forest Green gradient
  - `.section-modern`, `.section-modern-alt` - Page sections
- **Responsive design:** Mobile-first with breakpoints at 480px, 768px, 1024px
- **Bootstrap 5.3:** Loaded via CDN for grid and utilities
- **Legacy CSS archived:** Old individual page CSS files moved to `_legacy/css/`

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

### CSS Unification & Forest Canopy Theme (October 2025)
**Major architectural improvement** - Complete CSS consolidation and theme standardisation:

**Before:**
- 49 HTML files with inline `<style>` blocks (100-700 lines each)
- 15 separate CSS files with massive duplication
- Mixed colour schemes (teal #069494, blue #0066CC, peach #F7C59F, etc.)
- Inconsistent navigation colours across pages
- Total ~19,600 lines of duplicated CSS

**After:**
- Single unified `synd-design-system.css` (1,800 lines)
- Forest Canopy theme throughout (Forest Green #2d4a2b, Sage #7d8471, Olive #a4ac86)
- All 42 HTML pages updated to use unified CSS
- Consistent Forest Green navigation across entire site
- Zero inline styles (except chatbot integration)

**Benefits:**
- Professional, cohesive appearance across all pages
- Single source of truth for all styling
- Change once, applies everywhere
- Better performance (browser caches one CSS file)
- Easy maintenance and updates
- Natural, earthy theme suits health/sustainability context

**Files affected:** 42 HTML pages across all sections (root, framework, tools, decision support, about, resources)

**Archives:** 15 old CSS files moved to `_legacy/css/`, HTML backups in `_legacy/html-backups/`

### User experience enhancements (October 2025):
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