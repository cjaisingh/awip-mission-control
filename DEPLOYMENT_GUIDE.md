# AWIP Mission Control - Deployment Guide

## Quick Deployment Checklist

### ✅ Prerequisites
- [ ] GitHub account with repository access
- [ ] Supabase account and project setup
- [ ] Basic understanding of HTML/JavaScript
- [ ] Modern web browser for testing

### ✅ Repository Setup
1. **Clone Repository**
   ```bash
   git clone https://github.com/cjaisingh/awip-mission-control.git
   cd awip-mission-control
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select "Deploy from branch: main"
   - Save and wait 1-3 minutes for deployment

### ✅ Database Configuration
1. **Supabase Setup**
   - Create new Supabase project
   - Run the provided SQL schema (`SUPABASE_SCHEMA.sql`)
   - Note your project URL and API keys

2. **Update Configuration**
   - Edit `config.js` with your Supabase details
   - Update API endpoints in dashboard files

### ✅ Dashboard Verification
Test each dashboard:
- [ ] Desktop: https://yourusername.github.io/awip-mission-control/
- [ ] Mobile Basic: https://yourusername.github.io/awip-mission-control/mobile.html
- [ ] Mobile Real-time: https://yourusername.github.io/awip-mission-control/realtime-mobile.html
- [ ] Mobile Fixed: https://yourusername.github.io/awip-mission-control/mobile-fixed.html

### ✅ Performance Testing
- [ ] Load time <2 seconds
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested
- [ ] API connections functional

## Troubleshooting

### Common Issues
1. **Dashboard shows "Error" messages**
   - Use the fixed mobile dashboard for production
   - Check API configuration and network connectivity
   - Verify Supabase permissions and CORS settings

2. **GitHub Pages not updating**
   - Check GitHub Actions for build errors
   - Ensure main branch contains latest changes
   - Clear browser cache and wait 5 minutes

3. **Database connection failed**
   - Verify Supabase URL and API keys
   - Check Row Level Security policies
   - Ensure CORS is configured for your domain

## Support
- GitHub Issues: Report bugs and request features
- Documentation: Check `/docs` folder for detailed guides
- Community: Join discussions for community support
