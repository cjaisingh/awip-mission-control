// AWIP Mission Control Dashboard JavaScript
// Real-time monitoring and management functionality

class AWIPDashboard {
    constructor() {
        this.config = AWIP_CONFIG;
        this.refreshInterval = null;
        this.activityChart = null;
        this.lastUpdate = new Date();
        this.startTime = new Date();
        this.activityLog = [];
        this.alertCount = 0;

        // Initialize dashboard
        this.init();
    }

    async init() {
        console.log('Initializing AWIP Mission Control Dashboard...');

        // Initialize chart
        this.initChart();

        // Start monitoring
        this.startMonitoring();

        // Load initial data
        await this.refreshAllData();

        // Update timestamps
        this.updateTimestamps();

        console.log('Dashboard initialized successfully');
    }

    initChart() {
        const ctx = document.getElementById('activityChart').getContext('2d');
        this.activityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'API Responses',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'DB Writes',
                        data: [],
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Agent Operations',
                        data: [],
                        borderColor: '#7c3aed',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e5e7eb'
                        }
                    },
                    x: {
                        grid: {
                            color: '#e5e7eb'
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    startMonitoring() {
        // Set up refresh interval
        this.refreshInterval = setInterval(() => {
            this.refreshAllData();
        }, this.config.monitoring.refresh_interval);

        // Update timestamps every second
        setInterval(() => {
            this.updateTimestamps();
        }, 1000);
    }

    async refreshAllData() {
        try {
            document.getElementById('refreshIcon').classList.add('loading-spin');

            // Refresh all monitoring data
            await Promise.all([
                this.checkDatabaseStatus(),
                this.checkGitHubActivity(),
                this.checkMemoryUsage(),
                this.checkAgentStatus(),
                this.updateActivityChart()
            ]);

            this.lastUpdate = new Date();
            this.addActivityLog('System refresh completed', 'success');

        } catch (error) {
            console.error('Error refreshing data:', error);
            this.addActivityLog(`Refresh error: ${error.message}`, 'error');
        } finally {
            document.getElementById('refreshIcon').classList.remove('loading-spin');
        }
    }

    async checkDatabaseStatus() {
        try {
            // Check Supabase database health
            const response = await this.makeSupabaseRequest('/');

            if (response.ok) {
                this.updateDatabaseStatus('ONLINE', 'Database operational', 'success');
                document.getElementById('dbStatus').textContent = 'DB: OK';
                document.getElementById('dbStatus').className = 'text-xs font-medium text-green-600';
            } else {
                throw new Error('Database connection failed');
            }

        } catch (error) {
            console.error('Database check failed:', error);
            this.updateDatabaseStatus('OFFLINE', 'Connection failed', 'error');
            document.getElementById('dbStatus').textContent = 'DB: ERROR';
            document.getElementById('dbStatus').className = 'text-xs font-medium text-red-600';
            this.showAlert('Database connection failed', 'error');
        }
    }

    async checkGitHubActivity() {
        try {
            // Get recent commits
            const response = await this.makeGitHubRequest(`/repos/${this.config.github.owner}/${this.config.github.repo}/commits?per_page=5`);

            if (response.ok) {
                const commits = await response.json();
                const lastCommit = commits[0];
                const commitTime = new Date(lastCommit.commit.author.date);
                const timeDiff = this.getTimeDifference(commitTime);

                this.updateGitHubStatus('ACTIVE', `Last push: ${timeDiff}`, 'success');
                document.getElementById('githubStatus').textContent = 'GH: OK';
                document.getElementById('githubStatus').className = 'text-xs font-medium text-green-600';

                // Add recent activity
                this.addActivityLog(`GitHub: ${lastCommit.commit.message}`, 'success');

            } else {
                throw new Error('GitHub API request failed');
            }

        } catch (error) {
            console.error('GitHub check failed:', error);
            this.updateGitHubStatus('ERROR', 'API connection failed', 'error');
            document.getElementById('githubStatus').textContent = 'GH: ERROR';
            document.getElementById('githubStatus').className = 'text-xs font-medium text-red-600';
        }
    }

    checkMemoryUsage() {
        // Simulate memory usage monitoring
        // In a real implementation, this would connect to the actual discussion API
        const currentUsage = Math.floor(Math.random() * 40) + 60; // 60-100%
        const tokenCount = Math.floor((currentUsage / 100) * 1000);

        this.updateMemoryStatus(currentUsage, tokenCount);

        // Check for alerts
        if (currentUsage >= this.config.monitoring.memory_alert_threshold) {
            this.showMemoryAlert();
            if (currentUsage >= 90) {
                this.showAlert('Memory usage critical - consider new discussion', 'error');
            }
        } else {
            this.hideMemoryAlert();
        }
    }

    async checkAgentStatus() {
        // Update agent pipeline visualization
        const agents = [
            { id: 1, name: 'DevOps Agent', status: 'active', activity: 'Monitoring infrastructure', type: 'devops' },
            { id: 2, name: 'Database Agent', status: 'active', activity: 'Processing queries', type: 'database' },
            { id: 3, name: 'Strategic Agent', status: 'idle', activity: 'Awaiting analysis request', type: 'strategic' },
            { id: 15, name: 'AI Assistant Agent', status: 'learning', activity: 'Processing conversation', type: 'assistant' },
            { id: 16, name: 'Memory Manager Agent', status: 'active', activity: 'Managing session state', type: 'memory' }
        ];

        this.updateAgentPipeline(agents);

        // Update agent metrics
        const activeAgents = agents.filter(a => a.status === 'active').length;
        const learningAgents = agents.filter(a => a.status === 'learning').length;

        document.getElementById('agentsMetric').textContent = `${activeAgents + learningAgents}/${agents.length}`;
        document.getElementById('agentsDetails').textContent = `${learningAgents} learning`;
    }

    updateDatabaseStatus(status, details, type) {
        document.getElementById('dbMetric').textContent = status;
        document.getElementById('dbDetails').textContent = details;
        document.getElementById('dbMetric').className = `text-2xl font-bold text-${type === 'success' ? 'green' : 'red'}-600`;
    }

    updateGitHubStatus(status, details, type) {
        document.getElementById('githubMetric').textContent = status;
        document.getElementById('githubDetails').textContent = details;
        document.getElementById('githubMetric').className = `text-2xl font-bold text-${type === 'success' ? 'blue' : 'red'}-600`;
    }

    updateMemoryStatus(percentage, tokens) {
        const color = percentage >= 90 ? 'red' : percentage >= 80 ? 'yellow' : 'green';

        document.getElementById('memoryMetric').textContent = `${percentage}%`;
        document.getElementById('memoryDetails').textContent = `${tokens}/1000 tokens`;
        document.getElementById('memoryPercent').textContent = `${percentage}%`;
        document.getElementById('tokenCount').textContent = `${tokens} tokens`;

        // Update memory bar
        const memoryBar = document.getElementById('memoryBar');
        memoryBar.style.width = `${percentage}%`;
        memoryBar.className = `h-2 rounded-full transition-all duration-500 ${
            percentage >= 90 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
        }`;

        // Update status indicator
        document.getElementById('memoryStatus').textContent = `MEM: ${percentage}%`;
        document.getElementById('memoryStatus').className = `text-xs font-medium text-${color}-600`;
    }

    updateAgentPipeline(agents) {
        const pipeline = document.getElementById('agentPipeline');
        pipeline.innerHTML = '';

        agents.forEach(agent => {
            const agentCard = document.createElement('div');
            agentCard.className = `agent-card agent-${agent.type}`;

            const statusColor = {
                'active': 'bg-green-500 agent-status-active',
                'idle': 'bg-yellow-500 agent-status-idle',
                'error': 'bg-red-500 agent-status-error',
                'learning': 'agent-status-learning'
            }[agent.status];

            agentCard.innerHTML = `
                <div class="agent-status-indicator ${statusColor}"></div>
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: ${this.config.agents[agent.type]?.color}20;">
                        <i class="${this.config.agents[agent.type]?.icon} text-sm" style="color: ${this.config.agents[agent.type]?.color};"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-800">${agent.name}</h4>
                        <p class="text-sm text-gray-600">${agent.activity}</p>
                        <div class="flex items-center space-x-2 mt-1">
                            <span class="text-xs px-2 py-1 rounded-full ${
                                agent.status === 'active' ? 'bg-green-100 text-green-800' :
                                agent.status === 'learning' ? 'bg-purple-100 text-purple-800' :
                                agent.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }">${agent.status.toUpperCase()}</span>
                            <span class="text-xs text-gray-500">Agent #${agent.id}</span>
                        </div>
                    </div>
                </div>
            `;

            pipeline.appendChild(agentCard);
        });
    }

    updateActivityChart() {
        const now = new Date();
        const timeLabel = now.toLocaleTimeString();

        // Generate sample data (in real implementation, this would come from APIs)
        const apiResponses = Math.floor(Math.random() * 20) + 10;
        const dbWrites = Math.floor(Math.random() * 15) + 5;
        const agentOps = Math.floor(Math.random() * 10) + 3;

        // Update chart data
        if (this.activityChart.data.labels.length >= this.config.monitoring.chart_data_points) {
            this.activityChart.data.labels.shift();
            this.activityChart.data.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }

        this.activityChart.data.labels.push(timeLabel);
        this.activityChart.data.datasets[0].data.push(apiResponses);
        this.activityChart.data.datasets[1].data.push(dbWrites);
        this.activityChart.data.datasets[2].data.push(agentOps);

        this.activityChart.update('none');
    }

    addActivityLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logItem = {
            message,
            type,
            timestamp,
            id: Date.now()
        };

        this.activityLog.unshift(logItem);

        // Limit log size
        if (this.activityLog.length > this.config.monitoring.max_activity_log_items) {
            this.activityLog.pop();
        }

        this.updateActivityLogDisplay();
    }

    updateActivityLogDisplay() {
        const logContainer = document.getElementById('activityLog');
        logContainer.innerHTML = '';

        this.activityLog.slice(0, 10).forEach(item => {
            const logElement = document.createElement('div');
            logElement.className = `activity-item ${item.type}`;

            const icon = {
                'success': 'fas fa-check-circle text-green-500',
                'warning': 'fas fa-exclamation-triangle text-yellow-500',
                'error': 'fas fa-times-circle text-red-500',
                'info': 'fas fa-info-circle text-blue-500'
            }[item.type];

            logElement.innerHTML = `
                <div class="flex items-start space-x-3">
                    <i class="${icon} mt-1"></i>
                    <div class="flex-1">
                        <p class="text-sm text-gray-800">${item.message}</p>
                        <p class="text-xs text-gray-500">${item.timestamp}</p>
                    </div>
                </div>
            `;

            logContainer.appendChild(logElement);
        });
    }

    showAlert(message, type = 'warning') {
        const alertBar = document.getElementById('alertBar');
        const alertMessage = document.getElementById('alertMessage');

        alertMessage.textContent = message;
        alertBar.className = `px-6 py-2 text-sm font-medium flex items-center justify-between ${
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        alertBar.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideAlert();
        }, 5000);

        // Update alert count
        this.alertCount++;
        this.updateAlertCount();

        // Send email alert if enabled
        if (this.config.monitoring.email_alerts_enabled) {
            this.sendEmailAlert(message, type);
        }
    }

    hideAlert() {
        document.getElementById('alertBar').classList.add('hidden');
    }

    showMemoryAlert() {
        document.getElementById('memoryAlert').classList.remove('hidden');
    }

    hideMemoryAlert() {
        document.getElementById('memoryAlert').classList.add('hidden');
    }

    updateAlertCount() {
        const alertCountElement = document.getElementById('alertCount');
        if (this.alertCount > 0) {
            alertCountElement.textContent = this.alertCount;
            alertCountElement.classList.remove('hidden');
            alertCountElement.classList.add('flex');
        } else {
            alertCountElement.classList.add('hidden');
            alertCountElement.classList.remove('flex');
        }
    }

    updateTimestamps() {
        // Update last update time
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = `Last Update: ${this.lastUpdate.toLocaleTimeString()}`;
        }

        // Update system uptime
        const uptimeElement = document.getElementById('systemUptime');
        if (uptimeElement) {
            const uptime = this.getTimeDifference(this.startTime);
            uptimeElement.textContent = `Uptime: ${uptime}`;
        }
    }

    getTimeDifference(pastTime) {
        const now = new Date();
        const diff = now - pastTime;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        return `${minutes}m`;
    }

    async makeGitHubRequest(endpoint) {
        const url = `${this.config.github.api_base}${endpoint}`;
        return fetch(url, {
            headers: {
                'Authorization': `token ${this.config.github.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
    }

    async makeSupabaseRequest(endpoint) {
        const url = `${this.config.supabase.api_base}${endpoint}`;
        return fetch(url, {
            headers: {
                'apikey': this.config.supabase.key,
                'Authorization': `Bearer ${this.config.supabase.key}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async sendEmailAlert(message, type) {
        // Implement email alert functionality
        // This would integrate with your email service
        console.log(`Email Alert [${type.toUpperCase()}]: ${message}`);
    }
}

// Global functions for UI interactions
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function saveSettings() {
    // Save settings to localStorage
    const settings = {
        emailAlerts: document.getElementById('emailAlerts').checked,
        dashboardAlerts: document.getElementById('dashboardAlerts').checked,
        refreshInterval: parseInt(document.getElementById('refreshInterval').value),
        memoryThreshold: parseInt(document.getElementById('memoryThreshold').value)
    };

    localStorage.setItem('awip_settings', JSON.stringify(settings));

    // Update dashboard configuration
    dashboard.config.monitoring.email_alerts_enabled = settings.emailAlerts;
    dashboard.config.monitoring.dashboard_alerts_enabled = settings.dashboardAlerts;
    dashboard.config.monitoring.refresh_interval = settings.refreshInterval;
    dashboard.config.monitoring.memory_alert_threshold = settings.memoryThreshold;

    // Restart monitoring with new interval
    clearInterval(dashboard.refreshInterval);
    dashboard.startMonitoring();

    closeSettings();
    dashboard.addActivityLog('Settings updated successfully', 'success');
}

function toggleAlerts() {
    // Toggle alert notifications
    dashboard.alertCount = 0;
    dashboard.updateAlertCount();
}

function refreshDashboard() {
    dashboard.refreshAllData();
}

function hideAlert() {
    dashboard.hideAlert();
}

function newDiscussion() {
    // Open new discussion in new tab
    window.open('https://www.genspark.ai/agents', '_blank');
    dashboard.addActivityLog('New discussion initiated', 'info');
}

function exportData() {
    // Export dashboard data
    const data = {
        activityLog: dashboard.activityLog,
        lastUpdate: dashboard.lastUpdate,
        config: dashboard.config
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `awip-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    dashboard.addActivityLog('Data exported successfully', 'success');
}

function runHealthCheck() {
    dashboard.addActivityLog('Running comprehensive health check...', 'info');
    dashboard.refreshAllData();
}

// Initialize dashboard when page loads
let dashboard;

document.addEventListener('DOMContentLoaded', () => {
    // Load settings
    const savedSettings = localStorage.getItem('awip_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('emailAlerts').checked = settings.emailAlerts;
        document.getElementById('dashboardAlerts').checked = settings.dashboardAlerts;
        document.getElementById('refreshInterval').value = settings.refreshInterval;
        document.getElementById('memoryThreshold').value = settings.memoryThreshold;
    }

    // Initialize dashboard
    dashboard = new AWIPDashboard();
});

// Handle visibility change (pause monitoring when page hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (dashboard.refreshInterval) {
            clearInterval(dashboard.refreshInterval);
        }
    } else {
        dashboard.startMonitoring();
    }
});