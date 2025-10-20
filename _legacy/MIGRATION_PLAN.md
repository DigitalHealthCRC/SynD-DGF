# SynD-DGF Website Restructuring Plan

## Migration Map

### Root Level Pages
| Old Path | New Path | Status |
|----------|----------|--------|
| `web-pages/Home/Home.en-US.webpage.copy.html` | `index.html` | Pending |
| `web-pages/about/About.en-US.webpage.copy.html` | `about/index.html` | Pending |
| `web-pages/framework-overview/FrameworkOverview.en-US.webpage.copy.html` | `framework.html` | Pending |
| `web-pages/assessment-tools/AssessmentTools.en-US.webpage.copy.html` | `assessment-tools.html` | Pending |
| `web-pages/decision-support-overview/DecisionSupportOverview.en-US.webpage.copy.html` | `decision-support.html` | Pending |
| `web-pages/resources/Resources.en-US.webpage.copy.html` | `resources.html` | Pending |
| `web-pages/Search/Search.en-US.webpage.copy.html` | `search.html` | Pending |
| `web-pages/Profile/Profile.en-US.webpage.copy.html` | `profile.html` | Pending |

### About Section
| Old Path | New Path |
|----------|----------|
| `web-pages/about/about-framework/AboutFramework.en-US.webpage.copy.html` | `about/framework.html` |
| `web-pages/about/contact/Contact.en-US.webpage.copy.html` | `about/contact.html` |
| `web-pages/about/methodology/Methodology.en-US.webpage.copy.html` | `about/methodology.html` |
| `web-pages/about/stakeholder-consultation/StakeholderConsultation.en-US.webpage.copy.html` | `about/stakeholder-consultation.html` |

### Interactive Tools
| Old Path | New Path |
|----------|----------|
| `web-pages/assessment-tools/compliance-checklist-tool/ComplianceChecklistTool.en-US.webpage.copy.html` | `tools/compliance-checklist.html` |
| `web-pages/assessment-tools/impact-assessment/ImpactAssessment.en-US.webpage.copy.html` | `tools/impact-assessment.html` |
| `web-pages/assessment-tools/quality-metrics-tool/QualityMetricsTool.en-US.webpage.copy.html` | `tools/quality-metrics.html` |
| `web-pages/assessment-tools/risk-evaluation-tool/RiskEvaluationTool.en-US.webpage.copy.html` | `tools/risk-evaluation.html` |
| `web-pages/assessment-tools/use-case-assessment-tool/UseCaseAssessmentTool.en-US.webpage.copy.html` | `tools/use-case-assessment.html` |
| `web-pages/assessment-tools/use-case-checklist/UseCaseChecklist.en-US.webpage.copy.html` | `tools/use-case-checklist.html` |
| `web-pages/assessment-tools/assessment-outcomes/AssessmentOutcomes.en-US.webpage.copy.html` | `tools/assessment-outcomes.html` |
| `Complex Scenarios Navigator/ComplexScenariosNavigator.en-US.webpage.copy.html` | `tools/complex-scenarios.html` |

### Decision Support Tools
| Old Path | New Path |
|----------|----------|
| `web-pages/jurisdiction-mapper/JurisdictionMapper.en-US.webpage.copy.html` | `decision-support/jurisdiction-mapper.html` |
| `web-pages/legal-pathways-wizard/LegalPathwaysWizard.en-US.webpage.copy.html` | `decision-support/legal-pathways-wizard.html` |
| `web-pages/risk-mitigation-planner/RiskMitigationPlanner.en-US.webpage.copy.html` | `decision-support/risk-mitigation-planner.html` |

### Framework Steps
| Old Path | New Path |
|----------|----------|
| `web-pages/step-1-use-case-assessment/Step1UseCaseAssessment.en-US.webpage.copy.html` | `framework/step-1-use-case-assessment.html` |
| `web-pages/step-2-assess-source-data/Step2AssessSourceData.en-US.webpage.copy.html` | `framework/step-2-assess-source-data.html` |
| `web-pages/step-3-generate-synthetic-data/Step3GenerateSyntheticData.en-US.webpage.copy.html` | `framework/step-3-generate-synthetic-data.html` |
| `web-pages/step-4-assess-reidentification-risks/Step4AssessReidentificationRisks.en-US.webpage.copy.html` | `framework/step-4-assess-reidentification-risks.html` |
| `web-pages/step-5-manage-residual-risks/Step5ManageResidualRisks.en-US.webpage.copy.html` | `framework/step-5-manage-residual-risks.html` |

### Resources & Appendices
| Old Path | New Path |
|----------|----------|
| `web-pages/resources/appendices/about-synthetic-data/AboutSyntheticData.en-US.webpage.copy.html` | `resources/appendices/about-synthetic-data.html` |
| `web-pages/resources/appendices/assessment-outcomes/AssessmentOutcomes.en-US.webpage.copy.html` | `resources/appendices/assessment-outcomes.html` |
| `web-pages/resources/appendices/complex-scenarios/ComplexScenarios.en-US.webpage.copy.html` | `resources/appendices/complex-scenarios.html` |
| `web-pages/resources/appendices/deidentification-techniques/DeidentificationTechniques.en-US.webpage.copy.html` | `resources/appendices/deidentification-techniques.html` |
| `web-pages/resources/appendices/glossary/Glossary.en-US.webpage.copy.html` | `resources/appendices/glossary.html` |
| `web-pages/resources/appendices/impact-assessment/ImpactAssessment.en-US.webpage.copy.html` | `resources/appendices/impact-assessment.html` |
| `web-pages/resources/appendices/lawful-pathways/LawfulPathways.en-US.webpage.copy.html` | `resources/appendices/lawful-pathways.html` |
| `web-pages/resources/appendices/policy-legal-framework/PolicyLegalFramework.en-US.webpage.copy.html` | `resources/appendices/policy-legal-framework.html` |
| `web-pages/resources/appendices/privacy-obligations/PrivacyObligations.en-US.webpage.copy.html` | `resources/appendices/privacy-obligations.html` |
| `web-pages/resources/appendices/safety-assessment/SafetyAssessment.en-US.webpage.copy.html` | `resources/appendices/safety-assessment.html` |
| `web-pages/resources/appendices/technical-assessment/TechnicalAssessment.en-US.webpage.copy.html` | `resources/appendices/technical-assessment.html` |
| `web-pages/resources/appendices/use-case-assessment/UseCaseAssessment.en-US.webpage.copy.html` | `resources/appendices/use-case-assessment.html` |

### Error Pages
| Old Path | New Path |
|----------|----------|
| `web-pages/Access Denied/Access Denied.en-US.webpage.copy.html` | `access-denied.html` |
| `web-pages/Page Not Found/Page Not Found.en-US.webpage.copy.html` | `404.html` |

## Asset Consolidation

### CSS Files
- All `*.en-US.customcss.css` → `assets/css/[page-name].css`

### JavaScript Files
- All `*.en-US.customjs.js` → `assets/js/[page-name].js`

### Chatbot Assets
- `chatbot-assets/*` → `assets/chatbot/*`

### Images
- `assets/sloth3.ico` → `assets/images/sloth3.ico`

## Directories to Archive
- `web-pages/` → `_legacy/web-pages/`
- `content-snippets/` → `_legacy/content-snippets/`
- `web-templates/` → `_legacy/web-templates/`

## Directories to Delete (redirect-only folders)
- `home/`
- `about/` (redirect only)
- `framework/` (redirect only)
- `decision-support/`
- `tools/` (redirect only)
- `steps/`
- `resources-hub/`
- `search/` (redirect only)
- `assessment-tools/` (redirect only)
- `Complex Scenarios Navigator/` (after moving content)

## Migration Steps
1. Create new directory structure
2. Copy and rename HTML files to new locations
3. Copy and rename CSS/JS files to assets directories
4. Update all internal links in HTML files
5. Update all asset references (CSS, JS, images)
6. Move old structure to _legacy/
7. Delete redirect folders
8. Test all pages
