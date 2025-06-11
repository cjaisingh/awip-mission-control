# AWIP Mission Control Dashboard

A professional, real-time monitoring system for the AWIP (Cognitive Intelligence Platform) project.

## 🚀 Quick Deployment to GitHub Pages

### Option 1: Direct Upload (Fastest)

1. **Create a new GitHub repository** named `awip-mission-control`
2. **Upload all files** from this package to the repository
3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
4. **Access your dashboard** at: `https://yourusername.github.io/awip-mission-control`

### Option 2: Command Line Deployment

```bash
# Clone your repository
git clone https://github.com/yourusername/awip-mission-control.git
cd awip-mission-control

# Copy all dashboard files to the repository
cp /path/to/dashboard/files/* .

# Commit and push
git add .
git commit -m "Deploy AWIP Mission Control Dashboard"
git push origin main

# Enable GitHub Pages in repository settings
```

## 📁 File Structure

```
awip-mission-control/
├── index.html          # Main dashboard HTML
├── styles.css          # AWIP design system styles
├── dashboard.js        # Real-time monitoring logic
├── config.js           # API configuration (contains credentials)
├── README.md          # This file
└── .gitignore         # Git ignore file (optional)
```

## 🔧 Configuration

### API Credentials
The dashboard is pre-configured with your AWIP credentials:
- **GitHub Token**: Active until 2025-07-11
- **Supabase URL**: https://nkjckkaqcdscrtzmmyyt.supabase.co
- **Supabase Key**: Service role key included

### Monitoring Settings
- **Refresh Interval**: 30 seconds (configurable)
- **Memory Alert Threshold**: 80% (configurable)
- **Email Alerts**: Enabled (configurable)
- **Dashboard Alerts**: Enabled (configurable)

## 📱 Features

### Real-time Monitoring
- ✅ **Database Status**: Supabase connection and health
- ✅ **GitHub Activity**: Repository commits and actions
- ✅ **Memory Usage**: Discussion token tracking with alerts
- ✅ **Agent Pipeline**: Live agent status and activity
- ✅ **System Metrics**: API response times and performance

### Professional Interface
- ✅ **Cognitive Intelligence Design**: AWIP branding and colors
- ✅ **Mobile Responsive**: Mac, iPad, iPhone optimized
- ✅ **Real-time Charts**: Activity visualization
- ✅ **Alert System**: Email and dashboard notifications
- ✅ **Activity Log**: Recent system events

### Agent Monitoring
- ✅ **DevOps Agent**: Infrastructure monitoring
- ✅ **Database Agent**: Query processing status
- ✅ **Strategic Agent**: Analysis and planning
- ✅ **AI Assistant Agent**: Conversation processing
- ✅ **Memory Manager Agent**: Session state management

## ⚙️ Customization

### Update Settings
Click the gear icon (⚙️) in the top navigation to access:
- Email alert preferences
- Refresh interval timing
- Memory alert thresholds
- Dashboard notification settings

### Modify Configuration
Edit `config.js` to update:
- API endpoints
- Monitoring intervals
- Agent configurations
- Alert thresholds

### UI/UX Updates
Edit `styles.css` to modify:
- Color schemes
- Layout adjustments
- Mobile responsiveness
- Animation preferences

## 🔔 Alert System

### Memory Alerts
- **Warning**: 80% memory usage (configurable)
- **Critical**: 90% memory usage
- **Action**: Automatic suggestion for new discussion

### System Alerts
- **Database**: Connection failures
- **GitHub**: API issues
- **Agents**: Status changes or errors

### Notification Methods
- **Dashboard**: Visual alerts with auto-hide
- **Email**: Webhook integration (configure in settings)
- **Browser**: Native notifications (when enabled)

## 📊 Monitoring Data

### Database Monitoring
- Connection status
- Table health checks
- Query performance
- Edge function status

### GitHub Monitoring  
- Recent commits
- Action runs
- Issue tracking
- Repository health

### Discussion Monitoring
- Token usage tracking
- Memory percentage
- Session identification
- Alert thresholds

### Agent Pipeline
- Individual agent status
- Activity descriptions
- Performance metrics
- Health indicators

## 🔒 Security

### Credential Protection
- API keys are client-side only
- No server-side data storage
- HTTPS enforced for all connections
- Token expiration monitoring

### Access Control
- GitHub Pages public access
- No authentication required for monitoring
- Sensitive data masked in logs
- Secure API communication

## 📱 Mobile Experience

### iPhone Display Priority
1. **Critical Status**: Database, GitHub, Memory, Agents
2. **Memory Monitor**: Discussion usage and alerts
3. **Quick Actions**: New discussion, health check
4. **Activity Log**: Recent events (collapsed)

### iPad Experience
- **Full dashboard**: All panels visible
- **Touch-optimized**: Larger buttons and controls
- **Chart interaction**: Gesture-based navigation
- **Settings**: Touch-friendly configuration

### Mac Experience
- **Complete interface**: All features available
- **Keyboard shortcuts**: Refresh (R), Settings (S)
- **Multi-monitor**: Dashboard and work side-by-side
- **Export functionality**: Data download capabilities

## 🛠️ Maintenance

### Regular Updates
1. **Credentials**: Monitor token expiration dates
2. **Dependencies**: CDN links for libraries
3. **Configuration**: Adjust thresholds as needed
4. **Content**: Update agent configurations

### Troubleshooting

#### Dashboard Not Loading
- Check GitHub Pages deployment status
- Verify all files are uploaded correctly
- Check browser console for errors

#### API Errors
- Verify credentials in `config.js`
- Check token expiration dates
- Test API endpoints manually

#### Real-time Data Issues
- Check internet connectivity
- Verify CORS settings
- Monitor browser network tab

## 📞 Support

### Quick Fixes
- **Refresh**: F5 or refresh button
- **Reset Settings**: Clear localStorage
- **Hard Reload**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### Configuration Help
- Edit `config.js` for API changes
- Modify `styles.css` for appearance
- Update `dashboard.js` for functionality

## 🚀 Next Steps

### Phase 1: Basic Monitoring (Complete)
- ✅ Real-time system status
- ✅ Memory usage tracking
- ✅ Agent pipeline visualization
- ✅ Mobile-responsive design

### Phase 2: Enhanced Features
- 🔄 Historical data charts
- 🔄 Advanced alerting rules
- 🔄 Performance analytics
- 🔄 Custom dashboards

### Phase 3: Integration
- 🔄 Email notification system
- 🔄 Slack/Teams integration
- 🔄 API webhook support
- 🔄 Advanced reporting

---

**AWIP Mission Control Dashboard v1.0.0**  
*Professional Real-time Intelligence Monitoring*

*Ready for immediate deployment to GitHub Pages*
