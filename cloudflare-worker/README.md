# Cloudflare Worker for ChatKit Session Token Generation

This Cloudflare Worker securely generates OpenAI ChatKit session tokens without exposing your API key to the client.

**API Used**: `openai.beta.chatkit.sessions.create()` (ChatKit Sessions API)
**Reference**: https://openai.github.io/chatkit-js/guides/authentication/

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **OpenAI Account**: Create an account at [platform.openai.com](https://platform.openai.com)
3. **Node.js**: Version 18+ installed locally
4. **Wrangler CLI**: Cloudflare's command-line tool

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd cloudflare-worker
npm install
```

### Step 2: Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window for authentication.

### Step 3: Set Up Your OpenAI Agent

1. Go to [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
2. Create a new workflow
3. Train it on your SynD-DGF website content:
   - Provide your website URL: `https://digitalhealthcrc.github.io/SynD-DGF/`
   - Or upload framework documentation
4. Note the workflow ID (format: `wf_xxxxxxxxxxxxx`)

### Step 4: Configure Secrets

**NEVER commit secrets to git!** Set them securely via CLI:

```bash
# Set your OpenAI API key
npx wrangler secret put OPENAI_API_KEY
# Paste your key when prompted

# Set your ChatKit workflow ID
npx wrangler secret put CHATKIT_WORKFLOW_ID
# Paste your workflow ID when prompted
```

### Step 5: Deploy the Worker

```bash
npm run deploy
```

Your worker will be deployed to: `https://synd-dgf-chatkit-token.YOUR-SUBDOMAIN.workers.dev`

## Testing

### Test Locally

```bash
# Start local development server
npm run dev
```

Then test with curl:

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:8000"
```

### Test Production

```bash
curl -X POST https://synd-dgf-chatkit-token.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://digitalhealthcrc.github.io"
```

Expected response:

```json
{
  "client_secret": "cs_xxxxxxxxxxxxx"
}
```

This `client_secret` is used by the ChatKit widget to authenticate with OpenAI.

## Security Features

### 1. CORS Protection
Only allows requests from:
- `https://digitalhealthcrc.github.io` (production)
- `http://localhost:8000` (local testing)
- `http://127.0.0.1:8000` (local testing)

### 2. Rate Limiting
- 100 requests per hour per IP address
- Configurable via `RATE_LIMIT_REQUESTS` and `RATE_LIMIT_WINDOW`
- Optional: Enable KV namespace for distributed rate limiting

### 3. Error Handling
- Graceful error responses
- No sensitive information leaked
- Proper HTTP status codes

### 4. Request Validation
- Only accepts POST requests
- Validates environment variables
- Handles OpenAI API errors

## Optional: Enable Advanced Rate Limiting

For production-grade rate limiting with KV storage:

### 1. Create KV Namespace

```bash
npx wrangler kv:namespace create "RATE_LIMIT_KV"
```

### 2. Update wrangler.toml

Uncomment and update the KV namespace section:

```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "YOUR_KV_NAMESPACE_ID"  # From step 1
```

### 3. Redeploy

```bash
npm run deploy
```

## Monitoring

### View Live Logs

```bash
npm run tail
```

### Check Deployment Status

```bash
npx wrangler deployments list
```

### View Analytics

Go to: [Cloudflare Dashboard](https://dash.cloudflare.com) > Workers & Pages > synd-dgf-chatkit-token

## Updating the Worker

```bash
# Make changes to worker.js
# Test locally
npm run dev

# Deploy when ready
npm run deploy
```

## Cost Estimation

Cloudflare Workers Free Tier:
- 100,000 requests per day
- 10ms CPU time per request
- First 10ms free

**Estimated costs for typical usage:**
- Small site (<1000 visitors/day): **FREE**
- Medium site (1000-10000 visitors/day): **$0-5/month**
- Large site (>10000 visitors/day): **$5-25/month**

## Troubleshooting

### Error: "Invalid API key configuration"
- Check that `OPENAI_API_KEY` is set correctly
- Verify key has ChatKit permissions
- Test key at [platform.openai.com](https://platform.openai.com)

### Error: "Workflow not found"
- Verify `CHATKIT_WORKFLOW_ID` is correct
- Check workflow exists in Agent Builder
- Ensure workflow is published

### Error: "CORS policy error"
- Check allowed origins in `worker.js`
- Verify your domain matches exactly
- Test with browser DevTools Network tab

### Error: "Rate limit exceeded"
- Wait 1 hour for rate limit to reset
- Or increase `RATE_LIMIT_REQUESTS`
- Or enable KV-based rate limiting

## Security Best Practices

1. **Never commit secrets** - Always use `wrangler secret put`
2. **Keep allowed origins restrictive** - Only add domains you control
3. **Enable rate limiting** - Prevents abuse and reduces costs
4. **Monitor usage** - Check Cloudflare analytics regularly
5. **Update dependencies** - Run `npm update` monthly

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [OpenAI ChatKit Docs](https://platform.openai.com/docs/chatkit)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
