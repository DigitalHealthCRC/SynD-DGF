# SynD-DGF: Synthetic Data Governance Framework

A comprehensive [web platform](https://digitalhealthcrc.github.io/SynD-DGF/) providing legal and technical guidance for synthetic health data governance, featuring interactive assessment tools, decision support systems, and AI-powered assistance.

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


## Chatbot Integration

The site includes an OpenAI ChatKit-powered AI assistant on all pages.

### Quick Setup 

**Prerequisites:**
- OpenAI account with API access
- Cloudflare account (free tier)
- Node.js 18+ installed

**Steps:**

1. **Create OpenAI Agent Workflow** 
   - Visit [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
   - Create workflow: "SynD-DGF Assistant"
   - Add training data from website URL or docs
   - Publish and copy workflow ID

2. **Deploy Cloudflare Worker** 
   ```bash
   cd cloudflare-worker
   npm install
   npx wrangler login
   npx wrangler deploy

   # Set secrets
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler secret put CHATKIT_WORKFLOW_ID
   ```

3. **Configure Chatbot** 
   - Update `assets/chatbot/chatbot.js` with your worker URL

4. **Add domain to OpenAI allowlist**
   - Visit: https://platform.openai.com/settings/organization/security/domain-allowlist
   - Add your GitHub Pages URL and localhost

5. **Deploy** 
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


## License

Copyright © 2025 Digital Health CRC. All rights reserved.
