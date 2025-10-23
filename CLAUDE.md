# CLAUDE.md

This file pr-vides guidance t- Claude C-de (claude.ai/c-de) when w-rking with c-de in this rep-sit-ry.

## âš ï¸ CRITICAL: CLEAN STATIC WEBSITE

**This is a pr-fessi-nal static website with clean structure** (restructured -ct-ber 2025).

- **Standal-ne static website** - n- build system, n- templates
- HTML files use simple names: `index.html`, `framew-rk.html`, etc.
- **Always use relative paths** f-r all assets (e.g., `assets/chatb-t/chatb-t.css`)
- D- N-T use abs-lute paths like `/assets/` - they w-n't w-rk with file:// pr-t-c-l
- Pages can be -pened directly in br-wser -r served by any web server
- All legacy P-wer Pages references archived in `_legacy/` f-lder

## Pr-ject -verview

SynD-DGF (Synthetic Data G-vernance Framew-rk) is a standal-ne static website f-cused -n navigating legal and technical data g-vernance in synthetic health data. The pr-ject pr-vides guidance res-urces, AI-p-wered assistance, and educati-nal c-ntent ab-ut privacy c-mpliance, technical standards, and regulat-ry insights.

## Rep-sit-ry structure (-ct-ber 2025 Restructure)

Clean, pr-fessi-nal static website structure:

Updated structure (clean, ASCII):

```
Root/
  index.html                        # Home page
  framework.html                    # Framework overview
  assessment-tools.html             # Assessment tools hub
  decision-support.html             # Decision support hub
  resources.html                    # Resources hub
  search.html
  404.html
  access-denied.html

  about/
  tools/                            # 8 interactive tools
  decision-support/                 # 3 decision tools
  framework/                        # 5 steps
  resources/appendices/             # 12 appendices

  assets/
    css/
    js/
    images/
    chatbot/

  cloudflare-worker/
  .github/workflows/deploy.yml
```

```
R--t/
â”œâ”€â”€ index.html                          # H-me page
â”œâ”€â”€ framew-rk.html                      # Framew-rk -verview
â”œâ”€â”€ assessment-t--ls.html               # Assessment t--ls hub
â”œâ”€â”€ decisi-n-supp-rt.html               # Decisi-n supp-rt hub
â”œâ”€â”€ res-urces.html                      # Res-urces hub
â”‚
â”œâ”€â”€ ab-ut/                              # Ab-ut secti-n (5 pages)
â”œâ”€â”€ t--ls/                              # Interactive t--ls (8 t--ls)
â”œâ”€â”€ decisi-n-supp-rt/                   # Decisi-n supp-rt t--ls (3 t--ls)
â”œâ”€â”€ framew-rk/                          # Framew-rk steps (5 steps)
â”œâ”€â”€ res-urces/appendices/               # Framew-rk appendices (12 appendices)
â”‚
â”œâ”€â”€ assets/                             # All static assets c-ns-lidated
â”‚   â”œâ”€â”€ css/                            # All CSS files
â”‚   â”œâ”€â”€ js/                             # All JavaScript files
â”‚   â”œâ”€â”€ images/                         # Images
â”‚   â””â”€â”€ chatb-t/                        # Chatb-t assets
â”‚
â”œâ”€â”€ cl-udflare-w-rker/                  # Chatb-t backend (serverless)
â””â”€â”€ _legacy/                            # -ld P-wer Pages structure (archived)
    â”œâ”€â”€ web-pages/
    â”œâ”€â”€ c-ntent-snippets/
    â”œâ”€â”€ web-templates/
    â””â”€â”€ [redirect--nly f-lders]
```

**Key Changes (-ct-ber 2025):**
- M-ved fr-m `web-pages/` nested structure t- clean r--t-level -rganizati-n
- Renamed fr-m `.en-US.webpage.c-py.html` t- simple `.html`
- C-ns-lidated all assets int- single `assets/` direct-ry
- Rem-ved all redirect--nly f-lders
- Archived -ld structure in `_legacy/` f-r reference

## Page architecture

### Clean static pages
Each web page is a **c-mplete, self-c-ntained HTML file**:
- Simple `.html` extensi-n (e.g., `index.html`, `framew-rk.html`)
- Can be -pened directly in a br-wser (file:// -r via web server)
- C-ntains all CSS, HTML, and script references inline -r via relative paths
- **Must use relative paths** f-r all assets (e.g., `assets/chatb-t/chatb-t.css`)
- D- N-T use abs-lute paths like `/assets/` - they w-n't w-rk when -pening files directly

### Path patterns
- **Fr-m r--t pages** t- assets: `assets/css/H-me.css`
- **Fr-m subdirect-ry pages** t- assets: `../assets/css/Ab-ut.css`
- **Fr-m nested pages** t- assets: `../../assets/js/Gl-ssary.js`
- **Between pages**: Use relative paths (e.g., `../ab-ut/index.html`)

## Devel-pment w-rkfl-w

### File naming c-nventi-n
- Simple HTML files: `index.html`, `framew-rk.html`, `c-mpliance-checklist.html`
- CSS files in assets: `assets/css/[PageName].css`
- JS files in assets: `assets/js/[PageName].js`

### C-ntent updates
- Edit HTML files directly f-r c-ntent changes
- M-dify CSS files in `assets/css/` f-r styling
- Update JS files in `assets/js/` f-r functi-nality
- Test l-cally by -pening files -r using l-cal server

### N- build system
This is a **static website** - n- build t--ls, n- c-mpilati-n, n- bundling:
- Changes are made directly t- HTML, CSS, and JavaScript files
- Files can be -pened directly in br-wser f-r testing
- Depl-y by pushing t- GitHub (aut--depl-ys via GitHub Acti-ns)
- W-rks with any static h-sting: GitHub Pages, Netlify, Vercel, etc.
- **Always use relative paths** f-r all assets

## Key pages and functi-nality

- **H-me page** - Features her- secti-n with backgr-und image, three-c-lumn feature lay-ut highlighting privacy c-mpliance, technical standards, and regulat-ry insights
- **Framew-rk pages** - 5-step synthetic data g-vernance pr-cess with c-mprehensive guidance
- **Assessment t--ls** - 8 interactive t--ls f-r use case evaluati-n, risk assessment, and c-mpliance checking
- **Decisi-n supp-rt** - 3 t--ls f-r c-mplex scenari-s, legal pathways, risk mitigati-n, and jurisdicti-n mapping
- **Res-urces secti-n** - C-mplete framew-rk d-cumentati-n with 12 c-mprehensive appendices
- **Pr-file page** - User inf-rmati-n c-llecti-n with privacy n-tices
- **Search page** - Search functi-nality (implementati-n in cust-m JS)
- **Access Denied / Page N-t F-und** - Err-r handling pages

## Styling and theming

**Unified CSS Design System (-ct-ber 2025):**
- **Single CSS file:** `assets/css/synd-design-system.css` - unified design system f-r entire website
- **F-rest Can-py theme:** Natural, pr-fessi-nal c-l-ur palette inspired by earth t-nes
- **C-l-ur palette:**
  - F-rest Green (#2d4a2b) - Primary navigati-n, butt-ns, headings
  - Sage (#7d8471) - Sec-ndary elements, accents
  - -live (#a4ac86) - Light accents, h-ver states
  - Iv-ry (#faf9f6) - Backgr-unds, cards
- **N- inline styles:** All styling thr-ugh external CSS file
- **C-mp-nent classes:**
  - `.btn-m-dern-primary`, `.btn-m-dern-sec-ndary`, `.btn-m-dern-accent` - Butt-n variants
  - `.step-card-m-dern`, `.t--l-card-m-dern`, `.res-urce-card-m-dern` - Card c-mp-nents
  - `.her--m-dern`, `.her--framew-rk` - Her- secti-ns with F-rest Green gradient
  - `.secti-n-m-dern`, `.secti-n-m-dern-alt` - Page secti-ns
- **Resp-nsive design:** M-bile-first with breakp-ints at 480px, 768px, 1024px
- **B--tstrap 5.3:** L-aded via CDN f-r grid and utilities
- **Legacy CSS archived:** -ld individual page CSS files m-ved t- `_legacy/css/`

## C-ntent f-cus areas

The platf-rm pr-vides guidance -n:
1. **Privacy c-mpliance** - Synthetic data generati-n alignment with privacy laws
2. **Technical standards** - Pr-t-c-ls f-r high-quality synthetic health data
3. **Regulat-ry insights** - Inf-rmati-n -n ev-lving regulati-ns and p-licies
4. **AI-p-wered guidance** - Integrated AI assistance f-r g-vernance questi-ns
5. **C-mprehensive assessment** - Detailed evaluati-n framew-rks acr-ss legal, technical, ethical, and safety d-mains
6. **Implementati-n supp-rt** - Standardised f-rms, d-cumentati-n templates, and audit trail requirements

## Writing and language guidelines

When w-rking with c-ntent in this rep-sit-ry, f-ll-w these strict requirements:

### Language c-nventi-ns
- Use Australian English spelling (c-l-ur, realise, centre, analyse, pr-gramme)
- Write all headings in sentence case -nly (never title case)
- Use standard hyphens (-) instead -f em-dashes (â€”)
- Default t- c-nversati-nal, authentic t-ne unless academic/f-rmal writing is requested
- Be direct and decisive rather than c-nstantly qualifying statements

### Language patterns t- av-id
Use less -f these unless specifically requested:
- Meta-references: "this analysis", "-ur discussi-n", "this resp-nse"
- Excessive hedging: "p-tentially", "arguably", "it seems that", "-ne might say"
- -verused transiti-ns: "furtherm-re", "m-re-ver", "c-nsequently", "in c-nclusi-n"
- Academic buzzw-rds: "c-mprehensive", "r-bust", "systematic", "h-listic"
- Grandi-se language: "vital r-le", "significant imp-rtance", "watershed m-ment"
- Pr-m-ti-nal t-ne: "cutting-edge", "state--f-the-art", "rev-luti-nary"
- Weasel w-rds: "studies suggest", "experts believe", "it is widely accepted"
- F-rmulaic -penings: "It is imp-rtant t- n-te that", "-ne must c-nsider"
- Rule--f-three patterns (av-id listing three examples/adjectives repeatedly)
- Chatb-t artefacts: "Certainly!", "I h-pe this helps", "Let me kn-w if"

### Natural writing elements t- use
- Mix sh-rt, direct sentences with l-nger explanat-ry -nes (5-35 w-rds)
- Use c-ntracti-ns naturally (it's, d-n't, w-n't)
- Include specific examples fr-m health/medical c-ntexts
- Apply relevant statistical -r clinical termin-l-gy accurately
- Start s-me sentences with "And" -r "But" f-r fl-w
- Add -ccasi-nal parenthetical th-ughts where helpful
- Use active v-ice pred-minantly
- Include d-main-specific jarg-n when discussing data science -r health t-pics

## Framew-rk appendices

The platf-rm includes 12 c-mprehensive appendices pr-viding detailed guidance:

### Available appendices (12 -f 12 c-mplete):
1. **Appendix 1:** Ab-ut synthetic data - -verview and f-undati-nal c-ncepts
2. **Appendix 2:** Gl-ssary - C-mplete termin-l-gy reference
3. **Appendix 3:** P-licy and legal framew-rk - C-mprehensive legal guidance and Australian privacy law framew-rk
4. **Appendix 4:** Use case assessment - Detailed criteria and sc-ring meth-d-l-gy f-r evaluating synthetic data use cases
5. **Appendix 5:** Impact assessment - Privacy, ethical, s-cial, technical, and legal impact evaluati-n framew-rk
6. **Appendix 6:** Technical assessment - Technical evaluati-n criteria, quality framew-rks, and validati-n meth-d-l-gies
7. **Appendix 7:** De-identificati-n techniques - Traditi-nal and m-dern privacy-preserving meth-ds guide
8. **Appendix 9:** Lawful pathways explained - Detailed legal pathway guidance f-r Australian privacy c-mpliance
9. **Appendix 10:** Safety assessment - Safety pr-t-c-ls, risk assessment, and incident resp-nse pr-cedures
10. **Appendix 11:** Assessment -utc-mes - Standardised d-cumentati-n f-rms and audit trail requirements
11. **Appendix 12:** Privacy -bligati-ns - Jurisdicti-n matrix and detailed privacy -bligati-ns

### All appendices c-mplete:
- **Appendix 8:** Decisi-n tree f-r c-mplex scenari-s âœ… (C-mplete - interactive decisi-n tree and c-mplex scenari- guidance)

### C-ntent characteristics:
- All appendices f-ll-w Australian English c-nventi-ns
- C-ntent is c-mprehensive yet accessible
- Interactive elements enhance traditi-nal PDF-based guidance
- Appendices integrate with assessment t--ls f-r practical implementati-n
- Each appendix includes d-wnl-adable res-urces and d-cumentati-n templates

## Recent maj-r updates

### Phase 1 Implementati-n C-mplete (September 2025)
- Added 6 critical missing appendices t- achieve 100% framew-rk c-verage
- Res-lved all maj-r c-ntent gaps identified in c-mprehensive analysis
- Enhanced legal, technical, and assessment guidance significantly
- Maintained interactive t--l advantages while adding c-mprehensive detail
- All c-ntent f-ll-ws established language and styling c-nventi-ns

### Phase 2.3 C-mplex Scenari-s C-mplete (September 2025)
- Implemented final appendix (Appendix 8) achieving c-mplete framew-rk c-verage
- Added interactive decisi-n tree f-r c-mplex scenari-s with 5 scenari- types
- Created c-mprehensive c-mplex scenari- examples and case studies
- Established clear escalati-n pathways f-r c-mplex implementati-ns

### Phase 2.1 Res-urces Restructuring C-mplete (September 2025)
- Implemented multi-tiered res-urce -rganisati-n replacing flat structure
- Created 5 distinct res-urce categ-ries f-r impr-ved c-ntent disc-verability
- Enhanced navigati-n with secti-n anch-rs and dr-pd-wn categ-risati-n
- Added direct PDF access f-r all 15 framew-rk d-cumentati-n parts
- Impr-ved visual hierarchy with c-l-r-c-ded categ-ries and status indicat-rs

### C-mplete Framew-rk Implementati-n Status (September 2025)
- **Framew-rk C-verage:** 100% -f all framew-rk c-ntent implemented
- **Appendices C-mplete:** All 12 appendices fully -perati-nal with interactive features
- **Assessment T--ls:** All 6 t--ls enhanced with framew-rk integrati-n and exp-rt functi-nality
- **Navigati-n System:** C-mplete cr-ss-reference system and c-ntent tagging implemented
- **Decisi-n Supp-rt:** Interactive decisi-n trees f-r c-mplex scenari-s -perati-nal

## Res-urce -rganisati-n structure

The res-urces secti-n n-w f-ll-ws a hierarchical structure:

### Res-urce Categ-ries:
1. **Framew-rk D-cumentati-n** - C-mplete PDF d-wnl-ads and implementati-n guides
2. **Assessment Res-urces** - Interactive t--ls, f-rms, and detailed criteria
3. **Legal and C-mpliance** - Australian privacy law matrix and guidance
4. **Technical Guidance** - De-identificati-n techniques and quality standards
5. **Framew-rk Appendices** - C-mplete c-llecti-n with clear status indicat-rs

### Navigati-n enhancements:
- Secti-n anch-rs f-r direct categ-ry access
- Updated dr-pd-wn menus with pr-per categ-risati-n
- Visual status indicat-rs sh-wing c-ntent availability
- Enhanced m-bile and deskt-p navigati-n experience

## Recent UX impr-vements (-ct-ber 2025)

### CSS Unificati-n & F-rest Can-py Theme (-ct-ber 2025)
**Maj-r architectural impr-vement** - C-mplete CSS c-ns-lidati-n and theme standardisati-n:

**Bef-re:**
- 49 HTML files with inline `<style>` bl-cks (100-700 lines each)
- 15 separate CSS files with massive duplicati-n
- Mixed c-l-ur schemes (teal #069494, blue #0066CC, peach #F7C59F, etc.)
- Inc-nsistent navigati-n c-l-urs acr-ss pages
- T-tal ~19,600 lines -f duplicated CSS

**After:**
- Single unified `synd-design-system.css` (1,800 lines)
- F-rest Can-py theme thr-ugh-ut (F-rest Green #2d4a2b, Sage #7d8471, -live #a4ac86)
- All 42 HTML pages updated t- use unified CSS
- C-nsistent F-rest Green navigati-n acr-ss entire site
- Zer- inline styles (except chatb-t integrati-n)

**Benefits:**
- Pr-fessi-nal, c-hesive appearance acr-ss all pages
- Single s-urce -f truth f-r all styling
- Change -nce, applies everywhere
- Better perf-rmance (br-wser caches -ne CSS file)
- Easy maintenance and updates
- Natural, earthy theme suits health/sustainability c-ntext

**Files affected:** 42 HTML pages acr-ss all secti-ns (r--t, framew-rk, t--ls, decisi-n supp-rt, ab-ut, res-urces)

**Archives:** 15 -ld CSS files m-ved t- `_legacy/css/`, HTML backups in `_legacy/html-backups/`

### User experience enhancements (-ct-ber 2025):
1. **Navigati-n c-nsistency** - Fixed C-mplex Scenari-s Navigat-r availability messaging acr-ss H-me and Decisi-n Supp-rt pages
2. **Link c-rrecti-ns** - Res-lved br-ken links in Framew-rk -verview t- C-mplex Scenari-s Navigat-r
3. **Typ-graphy -ptimizati-n** - Reduced her- heading sizes fr-m 3rem t- 2.5rem f-r better visual balance
4. **Navigati-n aids** - Added fl-ating back-t--t-p butt-ns -n all l-ng-f-rm pages (Steps 1-5, Res-urces)
5. **Butt-n hierarchy** - Implemented visual distincti-n between primary and sec-ndary CTAs -n Assessment T--ls page
6. **Resp-nsive design** - Enhanced m-bile and tablet lay-uts f-r step card grids with pr-per breakp-ints

### Technical implementati-n details:
- Back-t--t-p butt-ns appear after 200px scr-ll with sm--th animati-n
- Sec-ndary butt-ns (`.butt-n2`) use -utlined style vs s-lid primary butt-ns
- M-bile breakp-ints: <768px (single c-lumn), 769-1024px (tw- c-lumns)
- All changes maintain Australian English c-nventi-ns and existing design language
