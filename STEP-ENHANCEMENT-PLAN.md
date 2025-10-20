# Step Pages Enhancement Plan (Option B)

## Goal
Make Steps 2-5 visually appealing and feature-rich like Step 1 by adding all interactive components and enhanced UI elements.

---

## Current State Analysis

### Step 1 (Visually Appealing - Reference Template)
**Has all these components:**
- ✅ Enhanced Breadcrumbs with Framework Context (~60 lines HTML)
- ✅ Page Actions (print/share/bookmark buttons)
- ✅ Common Scenarios accordion section (~55 lines)
- ✅ Content Tagging System (~85 lines)
- ✅ Cross-Reference Navigation (~50 lines)
- ✅ Related Resources Section (~75 lines)
- ✅ Complete JavaScript (~390 lines) for all interactivity
- ✅ `synd-additional-components.css` linked

**Total:** ~900 lines of rich, interactive HTML

### Steps 2-5 (Basic - Need Enhancement)
**Currently only have:**
- ❌ Plain Bootstrap breadcrumbs (no framework context)
- ❌ NO page actions
- ❌ NO common scenarios section
- ❌ NO content tagging system
- ❌ NO cross-reference navigation
- ❌ NO related resources section
- ❌ Minimal JavaScript (only back-to-top button)
- ✅ `synd-additional-components.css` linked (JUST ADDED!)

**Total:** ~440 lines of basic HTML

---

## Implementation Plan for Each Step Page

### Phase 1: Replace Breadcrumbs (10 minutes per page)

**Current (Step 2-5):**
```html
<!-- Breadcrumb -->
<div class="container mt-4">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
            <li class="breadcrumb-item"><a href="../framework.html">Framework</a></li>
            <li class="breadcrumb-item active">Step X: Title</li>
        </ol>
    </nav>
</div>
```

**Replace with (from Step 1, lines 26-88):**
```html
<!-- Enhanced Breadcrumbs with Framework Context -->
<nav class="enhanced-breadcrumbs" aria-label="Breadcrumb navigation">
  <div class="breadcrumb-container">
    <!-- Framework Step Context -->
    <div class="framework-context" id="framework-context" style="display: none;">
      <div class="context-header">
        <span class="context-icon"><i data-lucide="clipboard-check"></i></span>
        <span class="context-title">Framework Step</span>
      </div>
      <div class="step-progress">
        <!-- 5 step indicators here -->
      </div>
    </div>

    <!-- Standard Breadcrumbs -->
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <a href="/" class="breadcrumb-link">
          <span class="breadcrumb-icon"><i data-lucide="home"></i></span>
          <span class="breadcrumb-text">Home</span>
        </a>
      </li>
      <li class="breadcrumb-item current" id="current-page">
        <span class="breadcrumb-text">Step X: Title</span>
      </li>
    </ol>

    <!-- Page Actions -->
    <div class="page-actions">
      <button class="action-button" onclick="printPage()">
        <span class="action-icon"><i data-lucide="printer"></i></span>
      </button>
      <button class="action-button" onclick="sharePage()">
        <span class="action-icon"><i data-lucide="share-2"></i></span>
      </button>
      <button class="action-button" onclick="bookmarkPage()">
        <span class="action-icon"><i data-lucide="bookmark"></i></span>
      </button>
    </div>
  </div>
</nav>
```

**Customization per step:**
- Update `step` value in breadcrumb JavaScript (lines 91-215 from Step 1)
- Change step number from `step: 1` to `step: 2/3/4/5`

---

### Phase 2: Add Common Scenarios Section (20 minutes per page)

**Insert before step navigation (from Step 1, lines 380-457):**

```html
<div class="common-scenarios">
    <h2>Common scenarios and guidance</h2>

    <div class="scenario-accordion" id="scenarios-accordion">
        <!-- Scenario 1 -->
        <div class="scenario-item">
            <div class="scenario-header" data-scenario="1">
                <div class="scenario-icon">📋</div>
                <h3>Scenario Title</h3>
                <div class="scenario-toggle">
                    <i data-lucide="chevron-down"></i>
                </div>
            </div>
            <div class="scenario-content" id="scenario-1">
                <div class="scenario-description">
                    <p><strong>Situation:</strong> Description</p>
                    <p><strong>Guidance:</strong> Guidance text</p>
                </div>
                <div class="scenario-actions">
                    <a href="#" class="btn-modern-primary">Related Tool</a>
                </div>
            </div>
        </div>
        <!-- Add 3-5 scenarios per step -->
    </div>
</div>
```

**Step-specific scenarios to create:**
- **Step 2:** Data availability issues, third-party data processors, cross-organisational data, data quality problems
- **Step 3:** Model selection uncertainty, computational constraints, privacy-utility trade-offs, high-dimensional data
- **Step 4:** High uniqueness rates, membership inference detected, differential privacy configuration, rare populations
- **Step 5:** Multiple data requestors, public data releases, international data sharing, ongoing monitoring

---

### Phase 3: Add Content Tagging System (15 minutes per page)

**Insert before common scenarios (from Step 1, lines 224-309):**

```html
<!-- Content Tagging System -->
<div class="content-tagging-system">
  <div class="tags-header">
    <h3>Content tags</h3>
    <p>Filter content by category</p>
  </div>

  <div class="tag-categories">
    <div class="tag-category">
      <h4>Framework elements</h4>
      <div class="tags">
        <button class="tag-button" data-tag="assessment">Assessment</button>
        <button class="tag-button" data-tag="decision-criteria">Decision Criteria</button>
        <button class="tag-button" data-tag="documentation">Documentation</button>
      </div>
    </div>

    <div class="tag-category">
      <h4>Content type</h4>
      <div class="tags">
        <button class="tag-button" data-tag="guidance">Guidance</button>
        <button class="tag-button" data-tag="technical">Technical</button>
        <button class="tag-button" data-tag="legal">Legal</button>
      </div>
    </div>
  </div>
</div>
```

**Step-specific tags:**
- **Step 2:** data-quality, technical-assessment, preparation, documentation, metadata
- **Step 3:** model-selection, configuration, generation, security, reproducibility
- **Step 4:** risk-assessment, de-identification, privacy, testing, mitigation
- **Step 5:** safeguards, agreements, monitoring, approval, compliance

---

### Phase 4: Add Cross-Reference Navigation (15 minutes per page)

**Insert before related resources (from Step 1, lines 312-361):**

```html
<!-- Cross-Reference Navigation -->
<div class="cross-reference-nav">
  <div class="cross-ref-header">
    <h3>Related framework resources</h3>
    <p>Explore connected appendices, tools, and guidance</p>
  </div>

  <div class="cross-ref-container">
    <!-- Appendices -->
    <div class="cross-ref-section">
      <h4><i data-lucide="book-open"></i> Related appendices</h4>
      <div class="cross-ref-list">
        <a href="../resources/appendices/appendix-X.html" class="cross-ref-link">
          <span class="ref-icon">📄</span>
          <span class="ref-title">Appendix X: Title</span>
        </a>
      </div>
    </div>

    <!-- Tools -->
    <div class="cross-ref-section">
      <h4><i data-lucide="wrench"></i> Related tools</h4>
      <div class="cross-ref-list">
        <a href="../tools/tool-name.html" class="cross-ref-link">
          <span class="ref-icon">🔧</span>
          <span class="ref-title">Tool Name</span>
        </a>
      </div>
    </div>

    <!-- Next Steps -->
    <div class="cross-ref-section">
      <h4><i data-lucide="arrow-right-circle"></i> Next steps</h4>
      <div class="cross-ref-list">
        <a href="step-X.html" class="cross-ref-link">
          <span class="ref-icon">➡️</span>
          <span class="ref-title">Proceed to Step X</span>
        </a>
      </div>
    </div>
  </div>
</div>
```

**Step-specific cross-references:**
- **Step 2:** Link to Appendix 6 (Technical Assessment), Appendix 7 (De-identification), Technical Assessment Tool
- **Step 3:** Link to Appendix 6 (Technical Assessment), Model Selection Guide, Security Documentation Tool
- **Step 4:** Link to Appendix 7 (De-identification), Appendix 4 (Impact Assessment), Risk Assessment Tool
- **Step 5:** Link to Appendix 9 (Lawful Pathways), Appendix 12 (Privacy Obligations), Five Safes Guide

---

### Phase 5: Add Related Resources Section (15 minutes per page)

**Insert before step navigation (from Step 1, lines 363-439):**

```html
<!-- Related Resources Section -->
<div class="related-resources-section">
  <div class="resources-header">
    <h3>Related resources</h3>
    <p>Additional materials to support this step</p>
  </div>

  <div class="resource-categories">
    <!-- Category 1 -->
    <div class="resource-category">
      <h4>Assessment tools</h4>
      <div class="resource-grid">
        <div class="resource-card-modern">
          <div class="resource-icon">📋</div>
          <h5>Tool Name</h5>
          <p>Brief description</p>
          <a href="../tools/tool.html" class="btn-modern-accent">Access Tool</a>
        </div>
      </div>
    </div>

    <!-- Category 2 -->
    <div class="resource-category">
      <h4>Framework guidance</h4>
      <div class="resource-grid">
        <div class="resource-card-modern">
          <div class="resource-icon">📖</div>
          <h5>Guidance Document</h5>
          <p>Brief description</p>
          <a href="../resources/guide.html" class="btn-modern-accent">View Guide</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Step-specific resources:**
- **Step 2:** Data Availability Checklist, Data Quality Assessment Tool, Metadata Template, Data Specification Guide
- **Step 3:** Model Selection Matrix, Configuration Guide, Generation Workflow, Security Checklist
- **Step 4:** Risk Assessment Methodology, De-identification Techniques Guide, Privacy Testing Tools, Mitigation Strategies
- **Step 5:** Five Safes Implementation Guide, DSA Template, DUA Template, Monitoring Checklist

---

### Phase 6: Add Complete JavaScript (30 minutes per page)

**Insert before closing `</body>` tag (from Step 1, lines 455-844):**

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
    // 1. Breadcrumb building and framework context (lines 92-180)
    const currentPath = window.location.pathname;
    const frameworkSteps = {
        '/step-2-assess-source-data': { step: 2, title: 'Step 2: Assess Source Data' },
        // ... update for each step
    };

    // Build breadcrumbs with correct step number
    function buildBreadcrumbs() { /* ... */ }

    // Show framework context with current step highlighted
    function showFrameworkContext(currentStep) { /* ... */ }

    // 2. Page action functions (lines 183-215)
    function printPage() { window.print(); }
    function sharePage() { /* navigator.share logic */ }
    function bookmarkPage() { /* localStorage logic */ }

    // 3. Scenario accordion functionality (lines 459-530)
    const scenarioHeaders = document.querySelectorAll('.scenario-header');
    scenarioHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle accordion logic
        });
    });

    // 4. Content tagging system (lines 533-618)
    const tagButtons = document.querySelectorAll('.tag-button');
    let activeFilters = new Set();

    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Tag filtering logic
        });
    });

    // 5. Cross-reference navigation highlighting (lines 621-680)
    function highlightCurrentSection() { /* ... */ }

    // 6. Related resources interactions (lines 683-750)
    const resourceCards = document.querySelectorAll('.resource-card-modern');
    resourceCards.forEach(card => {
        // Add hover effects and tracking
    });

    // Initialize all components
    buildBreadcrumbs();
    lucide.createIcons();
});
</script>
```

---

## Implementation Priority Order

### Critical (Do First)
1. **Step 2** - Most important after Step 1, foundational step
2. **Step 4** - High complexity, benefits most from enhanced UI
3. **Step 5** - Final step, needs comprehensive resources

### Standard (Do Next)
4. **Step 3** - Mid-process, good candidate for enhancement

---

## Time Estimates per Page

| Phase | Task | Time |
|-------|------|------|
| 1 | Replace breadcrumbs + add JavaScript | 10 min |
| 2 | Create common scenarios (3-5 scenarios) | 20 min |
| 3 | Add content tagging system | 15 min |
| 4 | Add cross-reference navigation | 15 min |
| 5 | Add related resources section | 15 min |
| 6 | Add complete JavaScript integration | 30 min |
| **Total** | **Per page** | **~105 min** |

**For all 4 pages (Steps 2-5):** ~7 hours of focused work

---

## Key Customization Points

### For Each Step, Customize:

1. **Breadcrumb JavaScript:**
   - Change `step: 1` to correct step number
   - Update page title in `frameworkSteps` mapping

2. **Common Scenarios:**
   - Create 3-5 step-specific scenarios
   - Link to relevant tools and appendices
   - Use appropriate icons for each scenario type

3. **Content Tags:**
   - Define 8-12 relevant tags per step
   - Map tags to content sections on the page
   - Update tag categories for step context

4. **Cross-References:**
   - Link to 2-3 most relevant appendices
   - Link to 2-3 most relevant assessment tools
   - Update "Next Steps" to point to following step

5. **Related Resources:**
   - Create 6-10 resource cards per step
   - Organize into 2-3 logical categories
   - Ensure all links are valid and functional

---

## Code Snippets to Copy from Step 1

### Enhanced Breadcrumbs
- **Lines:** 26-88 (HTML)
- **Lines:** 91-215 (JavaScript)
- **File:** `framework/step-1-use-case-assessment.html`

### Common Scenarios
- **Lines:** 380-457 (HTML)
- **Lines:** 459-530 (JavaScript for accordion)
- **File:** `framework/step-1-use-case-assessment.html`

### Content Tagging System
- **Lines:** 224-309 (HTML)
- **Lines:** 533-618 (JavaScript for filtering)
- **File:** `framework/step-1-use-case-assessment.html`

### Cross-Reference Navigation
- **Lines:** 312-361 (HTML)
- **Lines:** 621-680 (JavaScript for highlighting)
- **File:** `framework/step-1-use-case-assessment.html`

### Related Resources
- **Lines:** 363-439 (HTML)
- **Lines:** 683-750 (JavaScript for interactions)
- **File:** `framework/step-1-use-case-assessment.html`

---

## Testing Checklist per Page

After implementing each page, verify:

- [ ] Enhanced breadcrumbs display correctly
- [ ] Framework context shows current step highlighted
- [ ] Print, share, bookmark buttons all functional
- [ ] Scenario accordions expand/collapse smoothly
- [ ] Content tag filtering works correctly
- [ ] Cross-reference links navigate properly
- [ ] Related resources cards display well
- [ ] All JavaScript executes without errors
- [ ] Page is responsive on mobile (480px, 768px, 1024px)
- [ ] Forest Canopy styling applies throughout
- [ ] Lucide icons render correctly

---

## Quick Start Template for Next Session

When ready to implement, use this workflow:

```bash
# 1. Open Step 1 as reference
# framework/step-1-use-case-assessment.html

# 2. Open target step (e.g., Step 2)
# framework/step-2-assess-source-data.html

# 3. Copy sections in this order:
#    a) Enhanced Breadcrumbs (replace simple breadcrumb)
#    b) Common Scenarios (insert before step-navigation)
#    c) Content Tagging (insert before common-scenarios)
#    d) Cross-Reference Nav (insert before related-resources)
#    e) Related Resources (insert before step-navigation)
#    f) Complete JavaScript (insert before </body>)

# 4. Customize content for the specific step
# 5. Test all functionality
# 6. Move to next step
```

---

## Expected Outcome

After completing Option B for all steps, **Steps 2-5 will have:**

✅ Same rich breadcrumb navigation as Step 1
✅ Interactive page actions (print/share/bookmark)
✅ Step-specific common scenarios with accordion
✅ Content tagging and filtering system
✅ Cross-reference cards to appendices/tools
✅ Related resources organized by category
✅ Full Forest Canopy styling from additional components CSS
✅ Professional, cohesive appearance matching Step 1

**Visual consistency across all 5 framework step pages!**
