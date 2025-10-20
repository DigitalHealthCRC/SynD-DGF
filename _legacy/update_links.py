#!/usr/bin/env python3
"""
Script to update all internal links and asset references in the restructured SynD-DGF website.
Converts old Power Pages-style paths to new clean structure paths.
"""

import os
import re
from pathlib import Path

# Define the base directory
BASE_DIR = Path(r"c:\Users\Amir\OneDrive - Digital Health CRC Limited\Projects\SynD\framework\SynD-DGF\new-structure")

# Path mapping from old to new structure
PATH_MAPPINGS = {
    # Main pages
    '../Home/Home.en-US.webpage.copy.html': 'index.html',
    '../framework-overview/FrameworkOverview.en-US.webpage.copy.html': 'framework.html',
    '../assessment-tools/AssessmentTools.en-US.webpage.copy.html': 'assessment-tools.html',
    '../decision-support-overview/DecisionSupportOverview.en-US.webpage.copy.html': 'decision-support.html',
    '../resources/Resources.en-US.webpage.copy.html': 'resources.html',
    '../Search/Search.en-US.webpage.copy.html': 'search.html',
    '../Profile/Profile.en-US.webpage.copy.html': 'profile.html',

    # About section
    '../about/About.en-US.webpage.copy.html': 'about/index.html',
    '../about/about-framework/AboutFramework.en-US.webpage.copy.html': 'about/framework.html',
    '../about/contact/Contact.en-US.webpage.copy.html': 'about/contact.html',
    '../about/methodology/Methodology.en-US.webpage.copy.html': 'about/methodology.html',
    '../about/stakeholder-consultation/StakeholderConsultation.en-US.webpage.copy.html': 'about/stakeholder-consultation.html',

    # Tools
    '../assessment-tools/compliance-checklist-tool/ComplianceChecklistTool.en-US.webpage.copy.html': 'tools/compliance-checklist.html',
    '../assessment-tools/impact-assessment/ImpactAssessment.en-US.webpage.copy.html': 'tools/impact-assessment.html',
    '../assessment-tools/quality-metrics-tool/QualityMetricsTool.en-US.webpage.copy.html': 'tools/quality-metrics.html',
    '../assessment-tools/risk-evaluation-tool/RiskEvaluationTool.en-US.webpage.copy.html': 'tools/risk-evaluation.html',
    '../assessment-tools/use-case-assessment-tool/UseCaseAssessmentTool.en-US.webpage.copy.html': 'tools/use-case-assessment.html',
    '../assessment-tools/use-case-checklist/UseCaseChecklist.en-US.webpage.copy.html': 'tools/use-case-checklist.html',
    '../assessment-tools/assessment-outcomes/AssessmentOutcomes.en-US.webpage.copy.html': 'tools/assessment-outcomes.html',
    '../Complex Scenarios Navigator/ComplexScenariosNavigator.en-US.webpage.copy.html': 'tools/complex-scenarios.html',

    # Decision support
    '../jurisdiction-mapper/JurisdictionMapper.en-US.webpage.copy.html': 'decision-support/jurisdiction-mapper.html',
    '../legal-pathways-wizard/LegalPathwaysWizard.en-US.webpage.copy.html': 'decision-support/legal-pathways-wizard.html',
    '../risk-mitigation-planner/RiskMitigationPlanner.en-US.webpage.copy.html': 'decision-support/risk-mitigation-planner.html',

    # Framework steps
    '../step-1-use-case-assessment/Step1UseCaseAssessment.en-US.webpage.copy.html': 'framework/step-1-use-case-assessment.html',
    '../step-2-assess-source-data/Step2AssessSourceData.en-US.webpage.copy.html': 'framework/step-2-assess-source-data.html',
    '../step-3-generate-synthetic-data/Step3GenerateSyntheticData.en-US.webpage.copy.html': 'framework/step-3-generate-synthetic-data.html',
    '../step-4-assess-reidentification-risks/Step4AssessReidentificationRisks.en-US.webpage.copy.html': 'framework/step-4-assess-reidentification-risks.html',
    '../step-5-manage-residual-risks/Step5ManageResidualRisks.en-US.webpage.copy.html': 'framework/step-5-manage-residual-risks.html',

    # Resources appendices
    '../resources/appendices/about-synthetic-data/AboutSyntheticData.en-US.webpage.copy.html': 'resources/appendices/about-synthetic-data.html',
    '../resources/appendices/assessment-outcomes/AssessmentOutcomes.en-US.webpage.copy.html': 'resources/appendices/assessment-outcomes.html',
    '../resources/appendices/complex-scenarios/ComplexScenarios.en-US.webpage.copy.html': 'resources/appendices/complex-scenarios.html',
    '../resources/appendices/deidentification-techniques/DeidentificationTechniques.en-US.webpage.copy.html': 'resources/appendices/deidentification-techniques.html',
    '../resources/appendices/glossary/Glossary.en-US.webpage.copy.html': 'resources/appendices/glossary.html',
    '../resources/appendices/impact-assessment/ImpactAssessment.en-US.webpage.copy.html': 'resources/appendices/impact-assessment.html',
    '../resources/appendices/lawful-pathways/LawfulPathways.en-US.webpage.copy.html': 'resources/appendices/lawful-pathways.html',
    '../resources/appendices/policy-legal-framework/PolicyLegalFramework.en-US.webpage.copy.html': 'resources/appendices/policy-legal-framework.html',
    '../resources/appendices/privacy-obligations/PrivacyObligations.en-US.webpage.copy.html': 'resources/appendices/privacy-obligations.html',
    '../resources/appendices/safety-assessment/SafetyAssessment.en-US.webpage.copy.html': 'resources/appendices/safety-assessment.html',
    '../resources/appendices/technical-assessment/TechnicalAssessment.en-US.webpage.copy.html': 'resources/appendices/technical-assessment.html',
    '../resources/appendices/use-case-assessment/UseCaseAssessment.en-US.webpage.copy.html': 'resources/appendices/use-case-assessment.html',
}

# Asset path mappings
ASSET_MAPPINGS = {
    '../../chatbot-assets/chatbot.css': 'assets/chatbot/chatbot.css',
    '../../chatbot-assets/chatbot.js': 'assets/chatbot/chatbot.js',
    '../../chatbot-assets/sloth-avatar.js': 'assets/chatbot/sloth-avatar.js',
}

def calculate_relative_path(from_file, to_file):
    """Calculate relative path from one file to another."""
    from_path = Path(from_file).parent
    to_path = Path(to_file)

    try:
        rel_path = os.path.relpath(to_path, from_path)
        return rel_path.replace('\\', '/')
    except ValueError:
        # If paths are on different drives, return absolute path
        return str(to_path).replace('\\', '/')

def update_html_file(file_path):
    """Update all links and asset references in an HTML file."""
    print(f"Processing: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Update page links - need to calculate relative paths based on current file location
    for old_path, new_path in PATH_MAPPINGS.items():
        # Find all variations of the old path
        patterns = [
            old_path,
            old_path.replace('../', '../../'),
            old_path.replace('../', '../../../'),
            old_path.replace('../', ''),
        ]

        for pattern in patterns:
            if pattern in content:
                # Calculate relative path from current file to new target
                new_rel_path = calculate_relative_path(file_path, BASE_DIR / new_path)
                content = content.replace(pattern, new_rel_path)

    # Update asset references
    for old_asset, new_asset in ASSET_MAPPINGS.items():
        if old_asset in content:
            new_rel_path = calculate_relative_path(file_path, BASE_DIR / new_asset)
            content = content.replace(old_asset, new_rel_path)

    # Update references to custom CSS and JS files (if any inline references exist)
    # Pattern: anything.en-US.customcss.css -> assets/css/anything.css
    content = re.sub(
        r'(["\'])[^"\']*?/([^/]+?)\.en-US\.customcss\.css(["\'])',
        lambda m: f'{m.group(1)}{calculate_relative_path(file_path, BASE_DIR / f"assets/css/{m.group(2)}.css")}{m.group(3)}',
        content
    )

    # Pattern: anything.en-US.customjs.js -> assets/js/anything.js
    content = re.sub(
        r'(["\'])[^"\']*?/([^/]+?)\.en-US\.customjs\.js(["\'])',
        lambda m: f'{m.group(1)}{calculate_relative_path(file_path, BASE_DIR / f"assets/js/{m.group(2)}.js")}{m.group(3)}',
        content
    )

    # Update web-files references (if any)
    content = content.replace('../../web-files/', 'assets/')
    content = content.replace('../web-files/', 'assets/')
    content = content.replace('web-files/', 'assets/')

    # Only write if content changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [UPDATED]")
        return True
    else:
        print(f"  - No changes needed")
        return False

def main():
    """Main function to process all HTML files."""
    print("Starting link and asset reference updates...")
    print(f"Base directory: {BASE_DIR}\n")

    html_files = list(BASE_DIR.rglob('*.html'))
    updated_count = 0

    for html_file in html_files:
        if update_html_file(html_file):
            updated_count += 1

    print(f"\n[DONE] Processed {len(html_files)} files")
    print(f"[DONE] Updated {updated_count} files")
    print("\nDone!")

if __name__ == '__main__':
    main()
