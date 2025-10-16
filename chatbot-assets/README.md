# ChatKit Widget Assets

This directory contains the client-side assets for the SynD-DGF AI chatbot.

## Files

### chatbot.css
Visual styling for the chat widget including:
- Chat bubble button
- Chat widget container
- Loading and error states
- Mobile responsive design
- Accessibility features

**Customisation:**
- Primary colour: Line 14 (`.synd-chat-bubble` background)
- Header colour: Line 110 (`.synd-chat-header` background)
- Widget size: Lines 88-89 (`.synd-chat-widget` width/height)

### chatbot.js
JavaScript logic for the chatbot including:
- ChatKit initialisation
- Token management with caching
- Retry logic with exponential backoff
- Error handling
- State persistence

**Configuration:**
- Worker URL: Line 12 (`WORKER_URL`)
- Token cache duration: Line 16 (`TOKEN_CACHE_DURATION`)
- Retry settings: Lines 19-20 (`MAX_RETRIES`, `RETRY_DELAY`)
- ChatKit theming: Lines 23-33 (`CHATKIT_CONFIG`)

## Installation

Add these lines to your HTML before `</body>`:

```html
<!-- OpenAI ChatKit Chatbot -->
<link rel="stylesheet" href="path/to/chatbot.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@openai/chatkit-js@latest/dist/index.js"></script>
<script src="path/to/chatbot.js"></script>
```

Adjust `path/to/` based on your file structure.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

The widget includes:
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion support
- High contrast mode support

## Dependencies

### External
- **@openai/chatkit-js** (loaded from CDN)
  - Latest version automatically loaded
  - No build step required

### None (Pure JavaScript)
- No jQuery
- No React/Vue/Angular
- No build tools required

## File Size

- **chatbot.css**: ~7 KB
- **chatbot.js**: ~10 KB
- **Total**: ~17 KB (uncompressed)

## Customisation Examples

### Change Colours

```css
/* In chatbot.css */

/* Teal to Purple */
.synd-chat-bubble {
    background: linear-gradient(135deg, #6A5ACD 0%, #8A7AED 100%);
}

.synd-chat-header {
    background: linear-gradient(135deg, #6A5ACD 0%, #8A7AED 100%);
}
```

### Change Position

```css
/* Move to left side */
.synd-chat-bubble {
    right: auto;
    left: 24px;
}

.synd-chat-widget {
    right: auto;
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
// In chatbot.js, line 29
greeting: 'Your custom greeting message here...',
```

### Multiple Widgets

To add different chatbots to different pages:

```javascript
// In chatbot.js, add page detection
const page = window.location.pathname;
let workflowId = 'wf_default';

if (page.includes('/legal/')) {
    workflowId = 'wf_legal_assistant';
} else if (page.includes('/technical/')) {
    workflowId = 'wf_technical_assistant';
}

// Pass workflowId to worker
```

## Troubleshooting

### Chatbot doesn't appear

**Check:**
1. CSS file is loading (check Network tab in DevTools)
2. JavaScript file is loading
3. No console errors (F12)
4. ChatKit CDN is accessible

### "Connection error" message

**Check:**
1. Worker URL is correct in `chatbot.js`
2. Worker is deployed and accessible
3. CORS is configured correctly
4. Secrets are set in Cloudflare

### Widget looks broken

**Check:**
1. CSS file path is correct
2. Browser cache (try hard refresh: Ctrl+Shift+R)
3. Browser DevTools for CSS errors
4. Mobile viewport if on phone

## Performance

### Load Time
- CSS: ~10ms
- JavaScript: ~20ms
- ChatKit CDN: ~50ms
- Initial token fetch: ~200-500ms

### Optimisation
- CSS and JS are cached by browser
- Session tokens are cached for 15 minutes
- No impact on page load (async loading)

## Security

### Client-side Security
✅ No secrets in code
✅ Origin validation via CORS
✅ XSS protection (HTML escaping)
✅ Session token caching (not API keys)

### What's NOT in this code
❌ OpenAI API keys
❌ Workflow IDs
❌ Any sensitive credentials

All secrets are stored securely in Cloudflare Workers.

## Updates

### Updating ChatKit Library

The ChatKit library is loaded from CDN:
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@openai/chatkit-js@latest/dist/index.js"></script>
```

To pin to a specific version:
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@openai/chatkit-js@1.2.3/dist/index.js"></script>
```

### Updating Widget Code

1. Make changes to `chatbot.css` or `chatbot.js`
2. Test locally
3. Commit and push to GitHub
4. GitHub Actions will deploy automatically

## Monitoring

### Browser Console

The widget logs key events:
```
ChatKit initialized successfully
Successfully fetched session token
Using cached session token
```

### Error Tracking

To add error tracking (e.g., Sentry):

```javascript
// In chatbot.js, in catch blocks
catch (error) {
    console.error('Error:', error);
    // Add your error tracking here
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(error);
    }
}
```

## License

Part of the SynD-DGF project. See repository LICENSE file.

## Support

- [Full implementation guide](../CHATBOT_IMPLEMENTATION_GUIDE.md)
- [Quick start guide](../CHATBOT_QUICKSTART.md)
- [Worker documentation](../cloudflare-worker/README.md)
