# SynD-DGF: Synthetic Data Governance Framework

A comprehensive web platform providing legal and technical guidance for synthetic health data governance, featuring interactive assessment tools, decision support systems, and AI-powered assistance.

## Project Overview

SynD-DGF is a standalone static website focused on navigating legal and technical data governance in synthetic health data. The platform provides:

- **Privacy Compliance**: Synthetic data generation alignment with privacy laws
- **Technical Standards**: Protocols for high-quality synthetic health data
- **Regulatory Insights**: Information on evolving regulations and policies
- **AI-Powered Guidance**: Integrated AI assistance for governance questions
- **Interactive Assessment Tools**: 8 tools for use case evaluation, risk assessment, and compliance checking
- **Decision Support**: 3 tools for complex scenarios, legal pathways, risk mitigation, and jurisdiction mapping
- **Comprehensive Resources**: Complete framework documentation with 12 appendices

## Repository Structure

```
Root/
├── index.html                          # Home page
├── framework.html                      # Framework overview
├── assessment-tools.html               # Assessment tools hub
├── decision-support.html               # Decision support hub
├── resources.html                      # Resources hub
│
├── about/                              # About section (5 pages)
│   ├── index.html
│   ├── framework.html
│   ├── methodology.html
│   ├── stakeholder-consultation.html
│   └── contact.html
│
├── tools/                              # Interactive tools (8 tools)
│   ├── compliance-checklist.html
│   ├── impact-assessment.html
│   ├── quality-metrics.html
│   ├── risk-evaluation.html
│   ├── use-case-assessment.html
│   ├── use-case-checklist.html
│   ├── assessment-outcomes.html
│   └── complex-scenarios.html
│
├── decision-support/                   # Decision support tools (3 tools)
│   ├── jurisdiction-mapper.html
│   ├── legal-pathways-wizard.html
│   └── risk-mitigation-planner.html
│
├── framework/                          # Framework steps (5 steps)
│   ├── step-1-use-case-assessment.html
│   ├── step-2-assess-source-data.html
│   ├── step-3-generate-synthetic-data.html
│   ├── step-4-assess-reidentification-risks.html
│   └── step-5-manage-residual-risks.html
│
├── resources/appendices/               # Framework appendices (12 appendices)
│   ├── about-synthetic-data.html
│   ├── glossary.html
│   ├── policy-legal-framework.html
│   └── ... (9 more)
│
├── assets/                             # All static assets
│   ├── css/                            # CSS files
│   ├── js/                             # JavaScript files
│   ├── images/                         # Images
│   └── chatbot/                        # Chatbot assets
│
├── cloudflare-worker/                  # Chatbot backend
└── _legacy/                            # Old structure (archived)
```

## Quick Start

### Local Development

Open any HTML file directly in your browser (double-click or use File > Open). The site uses relative paths and works without a server.

For testing with a local server (recommended for chatbot features):

```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### Deployment to GitHub Pages

1. **Push to GitHub:**
   ```bash
   git push origin master
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Source: **GitHub Actions**
   - Save

3. **Configure permissions:**
   - Settings > Actions > General
   - Workflow permissions: **Read and write permissions**
   - Allow GitHub Actions to create and approve pull requests
   - Save

4. **Access your site:**
   - `https://YOUR-USERNAME.github.io/SynD-DGF/`

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys on push to `master`.

## Chatbot Integration

The site includes an OpenAI ChatKit-powered AI assistant on the home page.

### Quick Setup (60 minutes)

**Prerequisites:**
- OpenAI account with API access
- Cloudflare account (free tier OK)
- Node.js 18+ installed

**Steps:**

1. **Create OpenAI Agent Workflow** (15 min)
   - Visit [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
   - Create workflow: "SynD-DGF Assistant"
   - Add training data from website URL or docs
   - Publish and copy workflow ID

2. **Deploy Cloudflare Worker** (15 min)
   ```bash
   cd cloudflare-worker
   npm install
   npx wrangler login
   npx wrangler deploy

   # Set secrets
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler secret put CHATKIT_WORKFLOW_ID
   ```

3. **Configure Chatbot** (5 min)
   - Update `assets/chatbot/chatbot.js` with your worker URL

4. **Add domain to OpenAI allowlist**
   - Visit: https://platform.openai.com/settings/organization/security/domain-allowlist
   - Add your GitHub Pages URL and localhost

5. **Deploy** (15 min)
   ```bash
   git add .
   git commit -m "Configure chatbot"
   git push origin master
   ```

### Troubleshooting Chatbot

**Worker returns error:**
- Check logs: `npx wrangler tail`
- Verify secrets: `npx wrangler secret list`

**Widget shows connection error:**
- Test worker endpoint with curl
- Verify worker URL in chatbot.js

**Widget is blank:**
- Add domain to OpenAI allowlist
- Wait 2-3 minutes
- Hard refresh (Ctrl+Shift+R)

## Key Features

### Assessment Tools
- **Compliance Checklist Tool**: Australian Privacy Act compliance verification
- **Impact Assessment Tool**: Privacy, ethical, social, technical, and legal impact evaluation
- **Quality Metrics Tool**: Technical quality evaluation for synthetic datasets
- **Risk Evaluation Tool**: Reidentification risk assessment
- **Use Case Assessment Tool**: Detailed use case evaluation and scoring
- **Use Case Checklist**: Quick preliminary assessment
- **Assessment Outcomes**: Standardised documentation forms
- **Complex Scenarios Navigator**: Interactive decision tree for complex situations

### Decision Support Tools
- **Jurisdiction Mapper**: Privacy obligations by jurisdiction
- **Legal Pathways Wizard**: Step-by-step legal pathway determination
- **Risk Mitigation Planner**: Risk management strategies

### Framework Steps
1. Use Case Assessment
2. Assess Source Data
3. Generate Synthetic Data
4. Assess Reidentification Risks
5. Manage Residual Risks

### Resources
- 12 comprehensive appendices covering all aspects of synthetic data governance
- Downloadable PDF documentation
- Interactive tools and templates

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (no build system)
- **Styling**: Bootstrap 5.3 + custom CSS
- **Chatbot**: OpenAI ChatKit
- **Backend**: Cloudflare Workers (serverless)
- **Hosting**: GitHub Pages (or any static host)
- **CDN**: jsDelivr for external libraries

## Content Characteristics

- **Language**: Australian English
- **Tone**: Conversational yet professional
- **Focus**: Practical guidance with interactive tools
- **Coverage**: Legal, technical, ethical, and safety domains
- **Status**: 100% framework coverage (all 12 appendices complete)

## Making Changes

### Update Content
1. Edit HTML files directly
2. Test locally
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update content"
   git push origin master
   ```

### Add New Pages
1. Create HTML file in appropriate directory
2. Follow existing page structure
3. Use relative paths for all assets
4. Update navigation in other pages
5. Test and deploy

### Modify Styles
- Page-specific CSS: `assets/css/[PageName].css`
- Global styles: Inline in individual pages
- Chatbot styles: `assets/chatbot/chatbot.css`

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 12+, Chrome Mobile

## License

Copyright © 2025 Digital Health CRC. All rights reserved.

## Support

For questions or issues:
- Review documentation in CLAUDE.md
- Check chatbot troubleshooting above
- Review deployment guide above
- Contact: [See about/contact page]

## Project Status

**Current Version**: October 2025
- ✅ Complete website restructure (clean static site)
- ✅ All 12 appendices implemented
- ✅ All 8 assessment tools operational
- ✅ All 3 decision support tools operational
- ✅ ChatKit AI assistant integrated
- ✅ GitHub Pages deployment configured
- ✅ Mobile responsive design
- ✅ Comprehensive documentation
