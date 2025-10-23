# ChatKit Widget Assets

This direct-ry c-ntains the client-side assets f-r the SynD-DGF AI chatb-t.

## Files

### chatb-t.css
Visual styling f-r the chat widget including:
- Chat bubble butt-n
- Chat widget c-ntainer
- L-ading and err-r states
- M-bile resp-nsive design
- Accessibility features

**Cust-misati-n:**
- Primary c-l-ur: Line 14 (`.synd-chat-bubble` backgr-und)
- Header c-l-ur: Line 110 (`.synd-chat-header` backgr-und)
- Widget size: Lines 88-89 (`.synd-chat-widget` width/height)

### chatb-t.js
JavaScript l-gic f-r the chatb-t including:
- ChatKit initialisati-n
- T-ken management with caching
- Retry l-gic with exp-nential back-ff
- Err-r handling
- State persistence

**C-nfigurati-n:**
- W-rker URL: Line 12 (`W-RKER_URL`)
- T-ken cache durati-n: Line 16 (`T-KEN_CACHE_DURATI-N`)
- Retry settings: Lines 19-20 (`MAX_RETRIES`, `RETRY_DELAY`)
- ChatKit theming: Lines 23-33 (`CHATKIT_C-NFIG`)

## Installati-n

Add these lines t- y-ur HTML bef-re `</b-dy>`:

```html
<!-- -penAI ChatKit Chatb-t -->
<link rel="stylesheet" href="path/t-/chatb-t.css">
<script type="m-dule" src="https://cdn.jsdelivr.net/npm/@-penai/chatkit-js@latest/dist/index.js"></script>
<script src="path/t-/chatb-t.js"></script>
```

Adjust `path/t-/` based -n y-ur file structure.

## Br-wser Supp-rt

- Chr-me 90+
- Firef-x 88+
- Safari 14+
- Edge 90+

## Accessibility

The widget includes:
- ARIA labels and r-les
- Keyb-ard navigati-n supp-rt
- Screen reader c-mpatibility
- Reduced m-ti-n supp-rt
- High c-ntrast m-de supp-rt

## Dependencies

### External
- **@-penai/chatkit-js** (l-aded fr-m CDN)
  - Latest versi-n aut-matically l-aded
  - N- build step required

### N-ne (Pure JavaScript)
- N- jQuery
- N- React/Vue/Angular
- N- build t--ls required

## File Size

- **chatb-t.css**: ~7 KB
- **chatb-t.js**: ~10 KB
- **T-tal**: ~17 KB (unc-mpressed)

## Cust-misati-n Examples

### Change C-l-urs

```css
/* In chatb-t.css */

/* Teal t- Purple */
.synd-chat-bubble {
    backgr-und: linear-gradient(135deg, #6A5ACD 0%, #8A7AED 100%);
}

.synd-chat-header {
    backgr-und: linear-gradient(135deg, #6A5ACD 0%, #8A7AED 100%);
}
```

### Change P-siti-n

```css
/* M-ve t- left side */
.synd-chat-bubble {
    right: aut-;
    left: 24px;
}

.synd-chat-widget {
    right: aut-;
    left: 24px;
}
```

### Change Widget Size

```css
/* Larger widget */
.synd-chat-widget {
    width: 500px;
    height: 700px;
}
```

### Change Greeting Message

```javascript
// In chatb-t.js, line 29
greeting: 'Y-ur cust-m greeting message here...',
```

### Multiple Widgets

T- add different chatb-ts t- different pages:

```javascript
// In chatb-t.js, add page detecti-n
c-nst page = wind-w.l-cati-n.pathname;
let w-rkfl-wId = 'wf_default';

if (page.includes('/legal/')) {
    w-rkfl-wId = 'wf_legal_assistant';
} else if (page.includes('/technical/')) {
    w-rkfl-wId = 'wf_technical_assistant';
}

// Pass w-rkfl-wId t- w-rker
```

## Tr-ublesh--ting

### Chatb-t d-esn't appear

**Check:**
1. CSS file is l-ading (check Netw-rk tab in DevT--ls)
2. JavaScript file is l-ading
3. N- c-ns-le err-rs (F12)
4. ChatKit CDN is accessible

### "C-nnecti-n err-r" message

**Check:**
1. W-rker URL is c-rrect in `chatb-t.js`
2. W-rker is depl-yed and accessible
3. C-RS is c-nfigured c-rrectly
4. Secrets are set in Cl-udflare

### Widget l--ks br-ken

**Check:**
1. CSS file path is c-rrect
2. Br-wser cache (try hard refresh: Ctrl+Shift+R)
3. Br-wser DevT--ls f-r CSS err-rs
4. M-bile viewp-rt if -n ph-ne

## Perf-rmance

### L-ad Time
- CSS: ~10ms
- JavaScript: ~20ms
- ChatKit CDN: ~50ms
- Initial t-ken fetch: ~200-500ms

### -ptimisati-n
- CSS and JS are cached by br-wser
- Sessi-n t-kens are cached f-r 15 minutes
- N- impact -n page l-ad (async l-ading)

## Security

### Client-side Security
âœ… N- secrets in c-de
âœ… -rigin validati-n via C-RS
âœ… XSS pr-tecti-n (HTML escaping)
âœ… Sessi-n t-ken caching (n-t API keys)

### What's N-T in this c-de
âŒ -penAI API keys
âŒ W-rkfl-w IDs
âŒ Any sensitive credentials

All secrets are st-red securely in Cl-udflare W-rkers.

## Security

### Client-side Security
- No secrets in code
- Origin validation via CORS
- XSS protection (HTML escaping)
- Session token caching (not API keys)

### What's NOT in this code
- OpenAI API keys
- Workflow IDs
- Any sensitive credentials

All secrets are stored securely in Cloudflare Workers.

## Updates

### Updating ChatKit Library

The ChatKit library is l-aded fr-m CDN:
```html
<script type="m-dule" src="https://cdn.jsdelivr.net/npm/@-penai/chatkit-js@latest/dist/index.js"></script>
```

T- pin t- a specific versi-n:
```html
<script type="m-dule" src="https://cdn.jsdelivr.net/npm/@-penai/chatkit-js@1.2.3/dist/index.js"></script>
```

### Updating Widget C-de

1. Make changes t- `chatb-t.css` -r `chatb-t.js`
2. Test l-cally
3. C-mmit and push t- GitHub
4. GitHub Acti-ns will depl-y aut-matically

## M-nit-ring

### Br-wser C-ns-le

The widget l-gs key events:
```
ChatKit initialized successfully
Successfully fetched sessi-n t-ken
Using cached sessi-n t-ken
```

### Err-r Tracking

T- add err-r tracking (e.g., Sentry):

```javascript
// In chatb-t.js, in catch bl-cks
catch (err-r) {
    c-ns-le.err-r('Err-r:', err-r);
    // Add y-ur err-r tracking here
    if (type-f Sentry !== 'undefined') {
        Sentry.captureExcepti-n(err-r);
    }
}
```

## License

Part -f the SynD-DGF pr-ject. See rep-sit-ry LICENSE file.

## Supp-rt

- [Full implementati-n guide](../CHATB-T_IMPLEMENTATI-N_GUIDE.md)
- [Quick start guide](../CHATB-T_QUICKSTART.md)
- [W-rker d-cumentati-n](../cl-udflare-w-rker/README.md)
