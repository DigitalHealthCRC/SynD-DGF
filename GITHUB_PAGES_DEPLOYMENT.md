# GitHub Pages Deployment Guide

This guide explains how to deploy the SynD-DGF website to GitHub Pages.

## Overview

Your SynD-DGF website is now configured for automated deployment to GitHub Pages. The site will automatically deploy when you push changes to the `master` branch.

## Prerequisites

Before deploying, ensure you have:

1. A GitHub account
2. Git installed on your local machine
3. Your repository pushed to GitHub
4. GitHub Pages enabled in your repository settings

## Initial Setup

### Step 1: Push your code to GitHub

If you haven't already created a GitHub repository:

```bash
# If this is a new repository
git remote add origin https://github.com/YOUR-USERNAME/SynD-DGF.git

# If you need to verify your remote
git remote -v

# Push your code (the workflow is configured for master branch)
git push -u origin master
```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/YOUR-USERNAME/SynD-DGF`
2. Click on **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - Source: **GitHub Actions** (recommended)
5. Click **Save**

### Step 3: Configure repository permissions

1. Still in **Settings**, go to **Actions** > **General**
2. Scroll down to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

## Automated Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:

1. Trigger on every push to the `master` branch
2. Build and package your site
3. Deploy to GitHub Pages
4. Make your site available at: `https://YOUR-USERNAME.github.io/SynD-DGF/`

### Manual Deployment

You can also trigger deployment manually:

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select **Deploy to GitHub Pages** workflow
4. Click **Run workflow**
5. Select the `master` branch
6. Click **Run workflow**

## Accessing Your Site

After successful deployment:

- **Default URL**: `https://YOUR-USERNAME.github.io/SynD-DGF/`
- **Custom domain** (optional): Configure in Settings > Pages > Custom domain

The site entry point is [index.html](index.html), which redirects to the Home page at `web-pages/Home/Home.en-US.webpage.copy.html`.

## Project Structure for GitHub Pages

```
SynD-DGF/
├── index.html                          # Entry point (redirects to Home)
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions deployment workflow
├── web-pages/                          # All webpage content
│   ├── Home/
│   │   ├── Home.en-US.webpage.copy.html
│   │   └── Home.en-US.customjs.js
│   ├── framework-overview/
│   ├── assessment-tools/
│   ├── decision-support-overview/
│   └── ... (other pages)
├── content-snippets/                   # Reusable content components
├── web-templates/                      # Template files
├── web-files/                          # Static assets
└── assessment-tools/                   # Tool-specific resources
```

## Verifying Deployment

### Check deployment status

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. Wait for all steps to complete (green checkmarks)
4. Click on the **Deploy to GitHub Pages** job
5. Find the deployment URL in the logs

### Test your site

1. Visit `https://YOUR-USERNAME.github.io/SynD-DGF/`
2. Verify the home page loads correctly
3. Test navigation between pages
4. Check that CSS and JavaScript load properly
5. Verify interactive tools work as expected

## Troubleshooting

### Deployment fails

**Issue**: Workflow fails with permission errors

**Solution**:
- Check that workflow permissions are set to "Read and write permissions"
- Ensure Pages is configured to use "GitHub Actions" as source

**Issue**: Pages not found (404 error)

**Solution**:
- Verify the repository is public (or you have GitHub Pro for private repos)
- Check that GitHub Pages is enabled in Settings
- Wait a few minutes after first deployment

### Broken links or missing resources

**Issue**: CSS/JS files not loading

**Solution**:
- Check that paths in HTML are relative (not absolute)
- Verify `web-files/` directory is included in the repository
- Look for any references to external CDN resources

**Issue**: Internal navigation broken

**Solution**:
- All internal links should use relative paths
- Example: `../framework-overview/FrameworkOverview.en-US.webpage.copy.html`
- Avoid using absolute paths starting with `/`

### Custom domain configuration

If you want to use a custom domain (e.g., `synd-dgf.example.com`):

1. Add a `CNAME` file to the repository root with your domain
2. Configure DNS settings with your domain provider
3. In GitHub Settings > Pages, add your custom domain
4. Enable HTTPS (GitHub provides free SSL certificates)

## Making Updates

To update your live site:

```bash
# Make your changes to HTML, CSS, or JS files
git add .
git commit -m "Update site content"
git push origin master

# GitHub Actions will automatically deploy your changes
```

## Monitoring

- **Deployment history**: Actions tab shows all deployments
- **Traffic analytics**: Settings > Insights > Traffic (for public repos)
- **Error logs**: Actions tab > specific workflow run > logs

## Additional Notes

### Branch strategy

The workflow is configured for the `master` branch. If you're working on a different branch:

1. Complete your changes on a feature branch
2. Test locally if possible
3. Merge to `master` branch
4. Push to trigger deployment

### Development workflow

For local testing before deployment:

1. Make changes on a development branch
2. Test thoroughly using a local server
3. Create a pull request to `master`
4. Review changes
5. Merge to `master` to trigger deployment

### Excluded files

The following files/folders are excluded via `.gitignore`:

- `powerpage-output/`, `powerpage-test/` - Power Platform migration artifacts
- `test-upload.ps1`, `test-upload.sh` - Test scripts
- `.vscode/`, `.claude/settings.local.json` - Local development config
- Python cache files and temporary files

These files won't be included in your GitHub Pages deployment.

## Support Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Next Steps

1. ✅ Push your code to GitHub
2. ✅ Enable GitHub Pages with "GitHub Actions" source
3. ✅ Configure workflow permissions
4. ✅ Push to master branch to trigger first deployment
5. ✅ Verify your site is live
6. ✅ Share your site URL

Your site will be available at: `https://YOUR-USERNAME.github.io/SynD-DGF/`

Remember to replace `YOUR-USERNAME` with your actual GitHub username throughout this guide.
