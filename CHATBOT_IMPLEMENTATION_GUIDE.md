# OpenAI ChatKit Implementation Guide for SynD-DGF

Complete guide for implementing the AI chatbot on your GitHub Pages website using **OpenAI's ChatKit JavaScript SDK**.

> **Note**: This guide uses the official ChatKit JavaScript SDK (`@openai/chatkit-js`), which is production-ready and fully supported. The Cloudflare Worker uses the ChatKit Sessions API (`openai.beta.chatkit.sessions.create()`) to securely generate session tokens.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Maintenance](#maintenance)
8. [Cost Estimation](#cost-estimation)
9. [Security Considerations](#security-considerations)

## Overview

This implementation adds an AI-powered chatbot to your SynD-DGF website using **OpenAI's ChatKit JavaScript SDK**. The chatbot can answer questions about synthetic data governance, privacy compliance, and technical standards.

### What You'll Build

- **Chat bubble**: Fixed button in bottom-right corner
- **Chat widget**: Collapsible panel with ChatKit interface
- **Cloudflare Worker**: Secure session token generation endpoint
- **OpenAI Agent Workflow**: AI trained on your framework documentation

### Technology Stack

- **Frontend**: ChatKit JavaScript SDK (`@openai/chatkit-js`)
- **Backend**: Cloudflare Workers (JavaScript/Node.js)
- **AI**: OpenAI Agent Builder workflow
- **Hosting**: GitHub Pages (static site)

### Key Features

- ✅ Secure (no API keys exposed)
- ✅ Mobile responsive
- ✅ Accessible (WCAG 2.1 compliant)
- ✅ Persistent state (remembers open/closed)
- ✅ Error handling with retry logic
- ✅ Rate limiting to prevent abuse
- ✅ Zero-config for end users

## Architecture

```
┌─────────────────────────────────────────────────────┐
│          GitHub Pages (Static Website)              │
│  ┌───────────────────────────────────────────────┐  │
│  │  HTML + CSS + JavaScript                      │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  ChatKit Widget (chatbot.js + .css)     │  │  │
│  │  └────────────┬────────────────────────────┘  │  │
│  └───────────────┼────────────────────────────────┘  │
└──────────────────┼───────────────────────────────────┘
                   │ HTTPS POST (token request)
                   ▼
┌──────────────────────────────────────────────────────┐
│       Cloudflare Worker (Serverless Function)        │
│  ┌────────────────────────────────────────────────┐  │
│  │  • Generates session tokens                    │  │
│  │  • Validates origins (CORS)                    │  │
│  │  • Implements rate limiting                    │  │
│  │  • Handles errors gracefully                   │  │
│  └────────────┬───────────────────────────────────┘  │
└───────────────┼──────────────────────────────────────┘
                │ OpenAI API call
                ▼
┌──────────────────────────────────────────────────────┐
│          OpenAI Agent Builder (Cloud)                │
│  ┌────────────────────────────────────────────────┐  │
│  │  • Hosts AI agent/workflow                     │  │
│  │  • Manages conversations                        │  │
│  │  • Stores chat history                          │  │
│  │  • Trained on your content                     │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Why This Architecture?

1. **GitHub Pages Limitation**: Can only serve static files (no server-side code)
2. **Security Requirement**: API keys must never be in client-side JavaScript
3. **Solution**: Cloudflare Worker acts as secure proxy between browser and OpenAI

## Prerequisites

### Required Accounts

- [x] **GitHub Account** (you already have this)
- [ ] **OpenAI Account** with API access → [Sign up](https://platform.openai.com/signup)
- [ ] **Cloudflare Account** (free tier is sufficient) → [Sign up](https://dash.cloudflare.com/sign-up)

### Required Software

- [ ] **Node.js** version 18 or higher → [Download](https://nodejs.org/)
- [ ] **Git** (already installed based on your setup)
- [ ] **Code editor** (VS Code recommended)

### Skills Required

- Basic HTML/JavaScript knowledge
- Comfortable using command line
- Basic understanding of environment variables

## Step-by-Step Implementation

### Phase 1: Create OpenAI Agent (30 minutes)

#### 1.1 Create OpenAI Agent Workflow

1. Go to [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
2. Click **"Create new workflow"**
3. Name it: `SynD-DGF Assistant`
4. Description: `AI assistant for synthetic data governance framework`

#### 1.2 Train the Agent

**Option A: Provide Website URL** (Easiest)

```
Training data URL: https://digitalhealthcrc.github.io/SynD-DGF/
```

**Option B: Upload Documentation** (More control)

Upload these key files:
- `web-pages/framework-overview/FrameworkOverview.en-US.webpage.copy.html`
- `web-pages/resources/Resources.en-US.webpage.copy.html`
- All files in `web-pages/resources/appendices/`

#### 1.3 Configure Agent Behaviour

**System Instructions:**

```
You are a helpful assistant for the SynD-DGF (Synthetic Data Governance Framework).
Your role is to help users understand and navigate the framework for synthetic health
data governance in Australia.

Key areas you help with:
- Privacy compliance and legal requirements
- Technical standards and quality metrics
- The 5-step framework process
- Use case assessment
- Risk evaluation and mitigation
- De-identification techniques

Communication style:
- Use Australian English
- Be professional but conversational
- Provide specific page references when relevant
- Break down complex topics into clear steps
- Always cite relevant framework sections

When users ask questions:
1. Provide a concise answer first
2. Offer to explain in more detail if needed
3. Direct them to relevant framework pages
4. Suggest related topics they might find useful
```

#### 1.4 Test and Publish

1. Test the agent in the playground
2. Try these test questions:
   - "What is the SynD-DGF framework?"
   - "How do I assess re-identification risks?"
   - "What are the legal requirements for synthetic data in Australia?"
3. If responses are good, click **"Publish"**
4. **Copy the Workflow ID** (format: `wf_xxxxxxxxxxxxx`)

### Phase 2: Deploy Cloudflare Worker (20 minutes)

#### 2.1 Navigate to Worker Directory

```bash
cd cloudflare-worker
```

#### 2.2 Install Dependencies

```bash
npm install
```

This installs:
- `wrangler` (Cloudflare CLI)
- `openai` (OpenAI SDK)

#### 2.3 Authenticate with Cloudflare

```bash
npx wrangler login
```

A browser window will open. Log in to Cloudflare and authorise Wrangler.

#### 2.4 Configure Secrets

**CRITICAL: Never commit these to git!**

```bash
# Set OpenAI API key
npx wrangler secret put OPENAI_API_KEY
# Paste your key from: https://platform.openai.com/api-keys

# Set ChatKit workflow ID
npx wrangler secret put CHATKIT_WORKFLOW_ID
# Paste the workflow ID from Phase 1.4
```

#### 2.5 Deploy the Worker

**Option A: Automated Deployment** (Recommended)

```bash
bash deploy.sh
```

The script will:
- Check all prerequisites
- Validate configuration
- Deploy to Cloudflare
- Test the endpoint
- Show you the worker URL

**Option B: Manual Deployment**

```bash
npm run deploy
```

#### 2.6 Note Your Worker URL

After deployment, you'll see:

```
Published synd-dgf-chatkit-token
  https://synd-dgf-chatkit-token.YOUR-SUBDOMAIN.workers.dev
```

**Copy this URL!** You'll need it in the next phase.

### Phase 3: Add Chatbot to Website (15 minutes)

#### 3.1 Update Chatbot Configuration

Open `chatbot-assets/chatbot.js` and update line 12:

```javascript
// BEFORE:
WORKER_URL: 'https://synd-dgf-chatkit-token.YOUR-SUBDOMAIN.workers.dev',

// AFTER (use your actual URL):
WORKER_URL: 'https://synd-dgf-chatkit-token.abc123.workers.dev',
```

#### 3.2 Add Chatbot to Your Homepage

Open `web-pages/Home/Home.en-US.webpage.copy.html` and add these lines before the closing `</body>` tag:

```html
<!-- OpenAI ChatKit Chatbot -->
<link rel="stylesheet" href="../../chatbot-assets/chatbot.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@openai/chatkit-js@latest/dist/index.js"></script>
<script src="../../chatbot-assets/chatbot.js"></script>
```

#### 3.3 (Optional) Add to All Pages

To add the chatbot site-wide, you have two options:

**Option A: Add to Template**

Edit `web-templates/Default studio template.html` and add the same code as above before `</body>`.

**Option B: Add to Individual Pages**

Add the same code to each page file you want the chatbot on.

#### 3.4 Test Locally

```bash
# Start a local server
python -m http.server 8000

# Or use Node.js
npx serve . -p 8000
```

Open [http://localhost:8000](http://localhost:8000) and test the chatbot.

### Phase 4: Configure OpenAI Domain Allowlist (5 minutes)

**CRITICAL STEP:** OpenAI requires you to allowlist domains that can use your agent.

1. Go to [OpenAI Security Settings](https://platform.openai.com/settings/organization/security/domain-allowlist)
2. Click **"Add domain"**
3. Add these domains:
   ```
   https://digitalhealthcrc.github.io
   http://localhost:8000
   ```
4. Click **"Save"**
5. Wait 2-3 minutes for changes to propagate

### Phase 5: Deploy to GitHub Pages (5 minutes)

#### 5.1 Commit Changes

```bash
git add chatbot-assets/ cloudflare-worker/
git add "web-pages/Home/Home.en-US.webpage.copy.html"
git commit -m "Add OpenAI ChatKit chatbot with Cloudflare Worker"
```

#### 5.2 Push to GitHub

```bash
git push origin master
```

#### 5.3 Verify Deployment

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Wait for "Deploy to GitHub Pages" workflow to complete
4. Visit your site: `https://digitalhealthcrc.github.io/SynD-DGF/`
5. Test the chatbot!

## Testing

### Test Checklist

- [ ] Chat bubble appears in bottom-right corner
- [ ] Click bubble opens chat widget
- [ ] Chat widget loads (shows "Initialising assistant...")
- [ ] After a few seconds, chat interface appears
- [ ] Can type a message and receive a response
- [ ] Responses are relevant to SynD-DGF
- [ ] Close button works
- [ ] Widget remembers open/closed state after page refresh
- [ ] Mobile responsive (test on phone)
- [ ] No console errors in browser DevTools

### Test Questions

Try these questions to verify the agent is working correctly:

```
✅ "What is the SynD-DGF framework?"
✅ "How many steps are in the framework?"
✅ "What legal pathways exist for synthetic data in Australia?"
✅ "How do I assess re-identification risks?"
✅ "What is the Five Safes Framework?"
✅ "Can you explain de-identification techniques?"
```

### Browser DevTools

Open browser console (F12) and check for:

```
✅ "ChatKit initialized successfully"
✅ "Successfully fetched session token"
✅ No CORS errors
✅ No 401/403/404 errors
```

## Troubleshooting

### Problem: Chat widget doesn't open

**Symptoms:**
- Click bubble, nothing happens
- No console errors

**Solution:**
1. Check browser console for JavaScript errors
2. Verify `chatbot.js` is loading (Network tab)
3. Check that `WORKER_URL` is set correctly in `chatbot.js`

---

### Problem: "Connection error" message

**Symptoms:**
- Widget opens but shows error
- Console shows `Failed to get session token`

**Possible causes:**

#### Cause 1: Worker URL is incorrect

**Check:**
```javascript
// In chatbot.js
WORKER_URL: 'https://...'  // Is this URL correct?
```

**Test worker directly:**
```bash
curl -X POST https://your-worker-url \
  -H "Origin: https://digitalhealthcrc.github.io"
```

#### Cause 2: CORS error

**Symptoms:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solution:**
1. Check `worker.js` line 23-25 has your domain
2. Redeploy worker: `npm run deploy`

#### Cause 3: Secrets not set

**Check secrets are configured:**
```bash
cd cloudflare-worker
npx wrangler secret list
```

Should show:
```
OPENAI_API_KEY
CHATKIT_WORKFLOW_ID
```

If missing, set them:
```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put CHATKIT_WORKFLOW_ID
```

---

### Problem: "Workflow not found"

**Symptoms:**
- Worker returns 500 error
- Cloudflare logs show "Workflow not found"

**Solution:**
1. Verify workflow ID is correct: [Agent Builder](https://platform.openai.com/agent-builder)
2. Ensure workflow is **published** (not just saved as draft)
3. Update secret:
   ```bash
   npx wrangler secret put CHATKIT_WORKFLOW_ID
   ```

---

### Problem: Chatbot responds but answers are irrelevant

**Symptoms:**
- Chatbot works but gives generic answers
- Doesn't reference SynD-DGF content

**Solution:**
1. Re-train agent with better instructions
2. Provide more specific training data
3. Add example Q&A pairs to agent configuration
4. Test in Agent Builder playground first

---

### Problem: "Rate limit exceeded"

**Symptoms:**
- Error message after many requests
- HTTP 429 status code

**Solution:**

**Temporary fix:**
Wait 1 hour for rate limit to reset

**Permanent fix:**
Enable KV-based rate limiting:
```bash
cd cloudflare-worker
npx wrangler kv:namespace create "RATE_LIMIT_KV"
# Follow instructions to update wrangler.toml
npm run deploy
```

---

### Problem: Widget looks broken on mobile

**Symptoms:**
- Overlapping elements
- Can't scroll chat
- Bubble off-screen

**Solution:**
1. Check that `chatbot.css` is loading
2. Clear browser cache
3. Test in mobile DevTools (Chrome/Firefox)
4. Verify viewport meta tag exists:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

---

### Problem: Domain not allowlisted

**Symptoms:**
- ChatKit widget appears empty
- No error messages
- Console shows domain error

**Solution:**
1. Go to [OpenAI Domain Allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist)
2. Add your domain
3. Wait 2-3 minutes
4. Hard refresh browser (Ctrl+Shift+R)

## Maintenance

### Updating Agent Training

When framework content changes:

1. Go to [Agent Builder](https://platform.openai.com/agent-builder)
2. Select your workflow
3. Update training data
4. Test in playground
5. Republish
6. No code changes needed!

### Monitoring Usage

#### View Cloudflare Worker Logs

```bash
cd cloudflare-worker
npm run tail
```

#### Check OpenAI Usage

1. Go to [OpenAI Usage Dashboard](https://platform.openai.com/usage)
2. Filter by date range
3. Monitor costs and request volume

#### Cloudflare Analytics

1. Visit [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages**
3. Click your worker name
4. View metrics:
   - Requests per day
   - Error rate
   - CPU time
   - Success rate

### Updating Dependencies

Every 2-3 months:

```bash
cd cloudflare-worker
npm update
npm run deploy
```

### Adjusting Rate Limits

Edit `cloudflare-worker/worker.js`:

```javascript
// Line 15-16
const RATE_LIMIT_REQUESTS = 100;  // Increase this number
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;  // 1 hour
```

Then redeploy:
```bash
npm run deploy
```

## Cost Estimation

### Cloudflare Workers

**Free Tier:**
- 100,000 requests/day
- 10ms CPU time per request

**Paid Plan ($5/month):**
- 10 million requests/month
- 50ms CPU time per request

**Your expected usage:**
- Small site (<1000 visitors/day): **FREE**
- Medium site (1000-10000 visitors/day): **$0-5/month**
- Large site (>10000 visitors/day): **$5-20/month**

### OpenAI API

**ChatKit Pricing (as of 2025):**
- GPT-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens
- GPT-4o: $2.50 per 1M input tokens, $10.00 per 1M output tokens

**Estimated costs:**

| Monthly Conversations | Estimated Cost (GPT-4o-mini) | Estimated Cost (GPT-4o) |
|-----------------------|------------------------------|-------------------------|
| 100                   | $1-3                         | $10-25                  |
| 1,000                 | $10-30                       | $100-250                |
| 10,000                | $100-300                     | $1,000-2,500            |

**Recommendation:** Start with GPT-4o-mini, upgrade to GPT-4o if responses need improvement.

### Total Monthly Cost Estimate

**Small deployment:**
- Cloudflare: $0 (free tier)
- OpenAI (100 conversations): $1-3
- **Total: $1-3/month**

**Medium deployment:**
- Cloudflare: $5
- OpenAI (1000 conversations): $10-30
- **Total: $15-35/month**

## Security Considerations

### What This Implementation Protects Against

✅ **API Key Exposure**: Keys never touch client-side code
✅ **Unauthorised Domains**: CORS prevents other sites using your worker
✅ **Rate Limiting**: Prevents API abuse and cost attacks
✅ **Request Validation**: Only accepts POST requests with valid origins
✅ **Error Handling**: No sensitive information leaked in error messages

### Security Best Practices

1. **Never commit secrets to Git**
   - Always use `wrangler secret put`
   - Add `.env` to `.gitignore`
   - Rotate keys if accidentally exposed

2. **Monitor usage regularly**
   - Check Cloudflare analytics weekly
   - Set up OpenAI usage alerts
   - Monitor for suspicious patterns

3. **Keep dependencies updated**
   - Run `npm audit` monthly
   - Update packages when security patches released
   - Test thoroughly after updates

4. **Restrict allowed domains**
   - Only add domains you control
   - Don't use wildcards (`*.example.com`)
   - Remove test domains from production

5. **Enable rate limiting**
   - Start conservative (100 req/hour)
   - Monitor and adjust as needed
   - Consider KV-based limiting for production

### What This Doesn't Protect Against

⚠️ **Malicious prompts**: Users can still try to confuse or trick the AI
⚠️ **Content accuracy**: AI may occasionally provide incorrect information
⚠️ **Cost attacks**: Determined attacker could max out rate limits repeatedly

**Mitigation strategies:**
- Configure agent with clear boundaries
- Add human review for critical guidance
- Set up budget alerts in OpenAI dashboard
- Monitor for abuse patterns

## Advanced Configuration

### Custom Domain for Worker

To use `chat.yourdomain.com` instead of `*.workers.dev`:

1. Add domain to Cloudflare
2. Update `wrangler.toml`:
   ```toml
   routes = [
     { pattern = "chat.yourdomain.com/*", zone_name = "yourdomain.com" }
   ]
   ```
3. Deploy: `npm run deploy`

### Custom ChatKit Styling

Edit `chatbot-assets/chatbot.css` to match your brand:

```css
/* Change primary colour */
.synd-chat-bubble {
    background: linear-gradient(135deg, #YOUR-COLOR-1, #YOUR-COLOR-2);
}

/* Change header colour */
.synd-chat-header {
    background: linear-gradient(135deg, #YOUR-COLOR-1, #YOUR-COLOR-2);
}
```

### Multiple Agents

To create different agents for different pages:

1. Create multiple workflows in Agent Builder
2. Update `chatbot.js` to select workflow based on page
3. Deploy with multiple workflow IDs

### Analytics Integration

Add Google Analytics tracking:

```javascript
// In chatbot.js, after successful initialization
gtag('event', 'chatbot_opened', {
  'event_category': 'engagement',
  'event_label': 'chatbot'
});
```

## Support Resources

### Official Documentation

- [OpenAI ChatKit Docs](https://platform.openai.com/docs/chatkit)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

### Community Support

- [OpenAI Community Forum](https://community.openai.com/)
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [GitHub Discussions](https://github.com/DigitalHealthCRC/SynD-DGF/discussions)

### Getting Help

If you encounter issues:

1. Check this troubleshooting guide first
2. Search community forums
3. Check Cloudflare/OpenAI status pages
4. Open an issue in the repository

---

## Quick Reference

### File Structure

```
SynD-DGF/
├── chatbot-assets/
│   ├── chatbot.css          # Widget styles
│   └── chatbot.js           # Widget logic
├── cloudflare-worker/
│   ├── worker.js            # Token generation
│   ├── wrangler.toml        # Worker config
│   ├── package.json         # Dependencies
│   ├── deploy.sh            # Deployment script
│   └── README.md            # Worker docs
└── CHATBOT_IMPLEMENTATION_GUIDE.md  # This file
```

### Essential Commands

```bash
# Deploy worker
cd cloudflare-worker && npm run deploy

# View worker logs
npm run tail

# Test worker locally
npm run dev

# Update secrets
npx wrangler secret put SECRET_NAME

# List deployments
npx wrangler deployments list
```

### Key URLs

- Worker Dashboard: `https://dash.cloudflare.com`
- OpenAI Platform: `https://platform.openai.com`
- Agent Builder: `https://platform.openai.com/agent-builder`
- Usage Dashboard: `https://platform.openai.com/usage`
- Domain Allowlist: `https://platform.openai.com/settings/organization/security/domain-allowlist`

---

**Implementation complete!** Your SynD-DGF website now has an AI-powered assistant. 🎉
