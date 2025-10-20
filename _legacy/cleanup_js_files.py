#!/usr/bin/env python3
"""
Clean up JavaScript files
"""

import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\Amir\OneDrive - Digital Health CRC Limited\Projects\SynD\framework\SynD-DGF\new-structure\assets\js")

def update_js_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Remove .en-US.webpage.copy from all paths
    content = re.sub(r'\.en-US\.webpage\.copy\.html', '.html', content)

    # Update specific paths
    replacements = {
        '../search/Search.html': '../search.html',
        '../framework-overview/FrameworkOverview.html': '../framework.html',
        '../assessment-tools/AssessmentTools.html': '../assessment-tools.html',
        '../step-1-use-case-assessment/Step1UseCaseAssessment.html': '../framework/step-1-use-case-assessment.html',
        '../step-2-assess-source-data/Step2AssessSourceData.html': '../framework/step-2-assess-source-data.html',
        '../step-3-generate-synthetic-data/Step3GenerateSyntheticData.html': '../framework/step-3-generate-synthetic-data.html',
        '../step-4-assess-reidentification-risks/Step4AssessReidentificationRisks.html': '../framework/step-4-assess-reidentification-risks.html',
        '../step-5-manage-residual-risks/Step5ManageResidualRisks.html': '../framework/step-5-manage-residual-risks.html',
        '../resources/Resources.html': '../resources.html',
        '../about/About.html': '../about/index.html',
        '../Home/Home.html': '../index.html',
        '../decision-support-overview/DecisionSupportOverview.html': '../decision-support.html',
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    js_files = list(BASE_DIR.glob('*.js'))
    updated = 0

    for js_file in js_files:
        if update_js_file(js_file):
            print(f"Updated: {js_file.name}")
            updated += 1

    print(f"\n[DONE] Updated {updated} JS files")

if __name__ == '__main__':
    main()
