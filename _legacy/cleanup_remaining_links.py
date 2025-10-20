#!/usr/bin/env python3
"""
Second pass to clean up all remaining .en-US.webpage.copy.html references
"""

import os
import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\Amir\OneDrive - Digital Health CRC Limited\Projects\SynD\framework\SynD-DGF\new-structure")

def update_file(file_path):
    """Remove all .en-US.webpage.copy.html from paths and update to new structure"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Pattern 1: Remove .en-US.webpage.copy from all paths and replace with just .html
    content = re.sub(r'\.en-US\.webpage\.copy\.html', '.html', content)

    # Pattern 2: Update specific old path patterns to new structure
    replacements = {
        # Within about section
        '../About.html': 'index.html',
        'about-framework/AboutFramework.html': 'framework.html',
        '../about-framework/AboutFramework.html': 'framework.html',
        'methodology/Methodology.html': 'methodology.html',
        '../methodology/Methodology.html': 'methodology.html',
        'stakeholder-consultation/StakeholderConsultation.html': 'stakeholder-consultation.html',
        '../stakeholder-consultation/StakeholderConsultation.html': 'stakeholder-consultation.html',
        'contact/Contact.html': 'contact.html',
        '../contact/Contact.html': 'contact.html',

        # Resources
        '../../Resources.html': '../resources.html',
        '../Resources.html': '../resources.html',
        '../../resources/Resources.html': '../resources.html',

        # Assessment tools
        '../../assessment-tools/AssessmentTools.html': '../assessment-tools.html',

        # Steps
        '../../step-1-use-case-assessment/Step1UseCaseAssessment.html': '../framework/step-1-use-case-assessment.html',
        '../../step-2-assess-source-data/Step2AssessSourceData.html': '../framework/step-2-assess-source-data.html',
        '../../step-3-generate-synthetic-data/Step3GenerateSyntheticData.html': '../framework/step-3-generate-synthetic-data.html',
        '../../step-4-assess-reidentification-risks/Step4AssessReidentificationRisks.html': '../framework/step-4-assess-reidentification-risks.html',
        '../../step-5-manage-residual-risks/Step5ManageResidualRisks.html': '../framework/step-5-manage-residual-risks.html',

        # Decision support
        '../../decision-support-overview/DecisionSupportOverview.html': '../decision-support.html',
        '../../jurisdiction-mapper/JurisdictionMapper.html': '../decision-support/jurisdiction-mapper.html',
        '../../legal-pathways-wizard/LegalPathwaysWizard.html': '../decision-support/legal-pathways-wizard.html',
        '../../risk-mitigation-planner/RiskMitigationPlanner.html': '../decision-support/risk-mitigation-planner.html',

        # Framework overview
        '../../framework-overview/FrameworkOverview.html': '../framework.html',

        # Home
        '../../Home/Home.html': '../index.html',
        '../Home/Home.html': 'index.html',
        '../../home/Home.html': '../index.html',

        # Tools (from root)
        '../../assessment-tools/compliance-checklist-tool/ComplianceChecklistTool.html': '../tools/compliance-checklist.html',
        '../../assessment-tools/impact-assessment/ImpactAssessment.html': '../tools/impact-assessment.html',
        '../../assessment-tools/quality-metrics-tool/QualityMetricsTool.html': '../tools/quality-metrics.html',
        '../../assessment-tools/risk-evaluation-tool/RiskEvaluationTool.html': '../tools/risk-evaluation.html',
        '../../assessment-tools/use-case-assessment-tool/UseCaseAssessmentTool.html': '../tools/use-case-assessment.html',
        '../../assessment-tools/use-case-checklist/UseCaseChecklist.html': '../tools/use-case-checklist.html',
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    html_files = list(BASE_DIR.rglob('*.html'))
    updated = 0

    for file_path in html_files:
        if update_file(file_path):
            print(f"Updated: {file_path.relative_to(BASE_DIR)}")
            updated += 1

    print(f"\n[DONE] Updated {updated} out of {len(html_files)} files")

if __name__ == '__main__':
    main()
