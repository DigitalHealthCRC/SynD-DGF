# ChatKit Chatbot Quick Start

**Time to complete: ~60 minutes**

## Prerequisites Checklist

- [ ] OpenAI account with API access
- [ ] Cloudflare account (free tier OK)
- [ ] Node.js 18+ installed
- [ ] This repository cloned locally

## 5-Step Implementation

### Step 1: Create OpenAI Agent Workflow (15 min)

1. Visit [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
2. Click **"Create new workflow"**
3. Configure workflow:
   - Name: "SynD-DGF Assistant"
   - Description: "AI assistant for synthetic data governance framework"
4. Add training data:
   - **Option A**: Website URL: `https://digitalhealthcrc.github.io/SynD-DGF/`
   - **Option B**: Upload framework documentation files
5. Add system instructions (see [implementation guide](CHATBOT_IMPLEMENTATION_GUIDE.md#13-configure-agent-behaviour))
6. Test in the playground
7. Click **"Publish"** when satisfied
8. **Copy workflow ID** (format: `wf_xxxxxxxxxxxxx`)

### Step 2: Deploy Cloudflare Worker (15 min)

```bash
# Navigate to worker directory
cd cloudflare-worker

# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login

# Deploy the worker FIRST (before setting secrets)
npx wrangler deploy
# When prompted:
# - Register workers.dev subdomain: Yes
# - Choose subdomain name (e.g., synd-dgf)
# - Confirm subdomain creation: Yes

# THEN set secrets (after deployment succeeds)
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put CHATKIT_WORKFLOW_ID
```

**Copy your worker URL** from deployment output (format: `https://synd-dgf-chatkit-token.YOUR-SUBDOMAIN.workers.dev`).

### Step 3: Configure Chatbot (5 min)

1. Open `chatbot-assets/chatbot.js`
2. Update line 12 with your worker URL:
   ```javascript
   WORKER_URL: 'https://your-worker-url.workers.dev',
   ```

### Step 4: Add to Website (10 min)

Add to `web-pages/Home/Home.en-US.webpage.copy.html` before `</body>`:

```html
<!-- OpenAI ChatKit Chatbot -->
<link rel="stylesheet" href="../../chatbot-assets/chatbot.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@openai/chatkit-js@latest/dist/index.js"></script>
<script src="../../chatbot-assets/chatbot.js"></script>
```

### Step 5: Deploy (15 min)

```bash
# Test locally first
python -m http.server 8000
# Visit http://localhost:8000 and test chatbot

# Add domain to OpenAI allowlist
# Visit: https://platform.openai.com/settings/organization/security/domain-allowlist
# Add: https://digitalhealthcrc.github.io and http://localhost:8000

# Commit and deploy
git add chatbot-assets/ cloudflare-worker/
git add "web-pages/Home/Home.en-US.webpage.copy.html"
git commit -m "Add OpenAI ChatKit chatbot"
git push origin master
```

## Verification

Visit your site and check:
- [ ] Chat bubble appears bottom-right
- [ ] Click opens chat widget
- [ ] Can send messages and get responses
- [ ] Responses are relevant to SynD-DGF
- [ ] Works on mobile

## Troubleshooting

**Problem:** Worker returns "Internal server error"
- **Check logs**: `npx wrangler tail` and run curl test again
- **Verify secrets**: `npx wrangler secret list` shows both secrets
- **Common fix**: Redeploy worker: `npx wrangler deploy`

**Problem:** Widget shows "Connection error"
- Check worker URL in `chatbot.js` is correct
- Test worker endpoint:
  ```bash
  curl -X POST https://your-worker-url \
    -H "Content-Type: application/json" \
    -H "Origin: https://digitalhealthcrc.github.io"
  ```
- Expected response: `{"client_secret":"cs_xxxxx"}`

**Problem:** Widget is empty/blank
- Add domain to OpenAI allowlist: [Domain Settings](https://platform.openai.com/settings/organization/security/domain-allowlist)
- Add both: `https://digitalhealthcrc.github.io` and `http://localhost:8000`
- Wait 2-3 minutes after adding
- Hard refresh browser (Ctrl+Shift+R)

**Problem:** Not seeing chatbot at all
- Check browser console (F12) for errors
- Verify CSS/JS files are loading (Network tab)
- Ensure ChatKit CDN script is loading
- Clear browser cache

## Next Steps

- Read [full implementation guide](CHATBOT_IMPLEMENTATION_GUIDE.md) for details
- Customise widget styling in `chatbot-assets/chatbot.css`
- Add chatbot to more pages
- Monitor usage in Cloudflare and OpenAI dashboards

## Support

- Full docs: [CHATBOT_IMPLEMENTATION_GUIDE.md](CHATBOT_IMPLEMENTATION_GUIDE.md)
- Worker docs: [cloudflare-worker/README.md](cloudflare-worker/README.md)
- OpenAI docs: [platform.openai.com/docs/chatkit](https://platform.openai.com/docs/chatkit)

---

**Questions?** Check the [troubleshooting section](CHATBOT_IMPLEMENTATION_GUIDE.md#troubleshooting) in the full guide.
