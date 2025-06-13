class AWIPMissionControl {
    constructor() {
        this.isResizing = false;
        this.currentPanel = null;
        this.agents = [];
        this.initializeSystem();
    }

    initializeSystem() {
        this.setupPanels();
        this.setupTabs();
        this.setupAgents();
        this.setupEventListeners();
        this.startSystemUpdates();
        this.updateTime();
        console.log('AWIP Mission Control initialized');
    }

    setupPanels() {
        const leftPanel = document.getElementById('left-panel');
        const rightPanel = document.getElementById('right-panel');

        // Set initial panel widths
        if (leftPanel) leftPanel.style.width = '300px';
        if (rightPanel) rightPanel.style.width = '350px';

        // Setup resize handles
        this.setupResizeHandles();
    }

    setupResizeHandles() {
        const resizeHandles = document.querySelectorAll('.resize-handle');

        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                this.startResize(e, handle);
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isResizing) {
                this.doResize(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.stopResize();
        });
    }

    startResize(e, handle) {
        this.isResizing = true;
        this.currentPanel = handle.dataset.panel;
        this.startX = e.clientX;

        const panel = document.getElementById(this.currentPanel + '-panel');
        this.startWidth = parseInt(window.getComputedStyle(panel).width);

        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    }

    doResize(e) {
        if (!this.isResizing) return;

        const panel = document.getElementById(this.currentPanel + '-panel');
        const diff = e.clientX - this.startX;

        let newWidth;
        if (this.currentPanel === 'left') {
            newWidth = this.startWidth + diff;
        } else if (this.currentPanel === 'right') {
            newWidth = this.startWidth - diff;
        }

        // Apply constraints
        const minWidth = 200;
        const maxWidth = 600;
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

        panel.style.width = newWidth + 'px';
    }

    stopResize() {
        this.isResizing = false;
        this.currentPanel = null;
        document.body.style.cursor = 'default';
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Keyboard shortcuts for tabs
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case '1': this.switchTab('logs'); e.preventDefault(); break;
                    case '2': this.switchTab('config'); e.preventDefault(); break;
                    case '3': this.switchTab('deploy'); e.preventDefault(); break;
                    case '4': this.switchTab('monitor'); e.preventDefault(); break;
                }
            }
        });
    }

    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId + '-tab').classList.add('active');
    }

    setupAgents() {
        this.agents = [
            { id: 1, name: 'Memory Manager', status: 'active', retention: '97.2%', type: 'Core' },
            { id: 2, name: 'Personal Assistant', status: 'active', efficiency: '96.8%', type: 'Interface' },
            { id: 3, name: 'Data Processor', status: 'active', throughput: '94.1%', type: 'Processing' },
            { id: 4, name: 'Security Monitor', status: 'active', alerts: '0', type: 'Security' },
            { id: 5, name: 'API Gateway', status: 'active', requests: '1.2K/min', type: 'Network' },
            { id: 6, name: 'Cache Manager', status: 'active', hit_rate: '89.3%', type: 'Performance' },
            { id: 7, name: 'Load Balancer', status: 'active', distribution: '98.7%', type: 'Network' },
            { id: 8, name: 'Database Monitor', status: 'active', connections: '47/100', type: 'Database' },
            { id: 9, name: 'File Manager', status: 'active', operations: '234/min', type: 'Storage' },
            { id: 10, name: 'Task Scheduler', status: 'active', queue: '12 tasks', type: 'Processing' },
            { id: 11, name: 'Backup Agent', status: 'idle', last_backup: '2h ago', type: 'Storage' },
            { id: 12, name: 'Analytics Engine', status: 'active', insights: '87 new', type: 'Analytics' },
            { id: 13, name: 'Notification Hub', status: 'active', sent: '156 today', type: 'Communication' },
            { id: 14, name: 'Health Monitor', status: 'active', uptime: '99.97%', type: 'Monitoring' },
            { id: 15, name: 'Resource Manager', status: 'active', efficiency: '92.1%', type: 'Management' },
            { id: 16, name: 'Deployment Agent', status: 'active', version: 'v2.1.0', type: 'DevOps' },
            { id: 17, name: 'Error Handler', status: 'active', resolved: '23/24', type: 'Monitoring' },
            { id: 18, name: 'Config Manager', status: 'active', synced: '100%', type: 'Management' },
            { id: 19, name: 'Audit Logger', status: 'active', entries: '1.4K today', type: 'Security' },
            { id: 20, name: 'Discussion Agent', status: 'active', context: '98.5%', type: 'AI' }
        ];

        this.renderAgents();
    }

    renderAgents() {
        const agentsGrid = document.getElementById('agents-grid');
        if (!agentsGrid) return;

        agentsGrid.innerHTML = this.agents.map(agent => `
            <div class="agent-card" data-agent-id="${agent.id}">
                <div class="agent-header">
                    <span class="agent-name">Agent ${agent.id}</span>
                    <span class="agent-status status-${agent.status}">${agent.status.toUpperCase()}</span>
                </div>
                <div class="agent-info">
                    <strong>${agent.name}</strong><br>
                    <small>Type: ${agent.type}</small><br>
                    ${this.getAgentMetric(agent)}
                </div>
            </div>
        `).join('');

        // Add click handlers to agent cards
        document.querySelectorAll('.agent-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const agentId = e.currentTarget.dataset.agentId;
                this.showAgentDetails(agentId);
            });
        });
    }

    getAgentMetric(agent) {
        const metrics = ['retention', 'efficiency', 'throughput', 'alerts', 'requests', 'hit_rate', 
                        'distribution', 'connections', 'operations', 'queue', 'last_backup', 
                        'insights', 'sent', 'uptime', 'version', 'resolved', 'synced', 'entries', 'context'];

        for (let metric of metrics) {
            if (agent[metric]) {
                return `<small>${metric.replace('_', ' ')}: ${agent[metric]}</small>`;
            }
        }
        return '<small>Status: Operational</small>';
    }

    showAgentDetails(agentId) {
        const agent = this.agents.find(a => a.id == agentId);
        if (agent) {
            console.log(`Showing details for Agent ${agentId}: ${agent.name}`);
            // In a real implementation, this would open a modal or navigate to details
        }
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Handle panel content updates
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('metric-card')) {
                this.showMetricDetails(e.target);
            }
        });
    }

    handleWindowResize() {
        // Adjust panels for mobile
        if (window.innerWidth <= 768) {
            const leftPanel = document.getElementById('left-panel');
            const rightPanel = document.getElementById('right-panel');
            if (leftPanel) leftPanel.style.width = '100%';
            if (rightPanel) rightPanel.style.width = '100%';
        }
    }

    showMetricDetails(metricCard) {
        const value = metricCard.querySelector('.metric-value').textContent;
        const label = metricCard.querySelector('.metric-label').textContent;
        console.log(`Metric Details - ${label}: ${value}`);
    }

    startSystemUpdates() {
        // Update system stats every 30 seconds
        setInterval(() => {
            this.updateSystemStats();
        }, 30000);

        // Update agent statuses every 15 seconds
        setInterval(() => {
            this.updateAgentStatuses();
        }, 15000);

        // Add new log entries periodically
        setInterval(() => {
            this.addLogEntry();
        }, 45000);
    }

    updateSystemStats() {
        // Simulate minor fluctuations in system stats
        const healthElement = document.querySelector('.metric-card .metric-value');
        if (healthElement && healthElement.textContent.includes('%')) {
            const current = parseFloat(healthElement.textContent);
            const variation = (Math.random() - 0.5) * 0.2;
            const newValue = Math.max(95, Math.min(100, current + variation));
            healthElement.textContent = newValue.toFixed(1) + '%';
        }
    }

    updateAgentStatuses() {
        // Randomly update some agent metrics
        this.agents.forEach(agent => {
            if (Math.random() < 0.1) { // 10% chance to update each agent
                // Simulate small changes in metrics
                if (agent.retention) {
                    const current = parseFloat(agent.retention);
                    const variation = (Math.random() - 0.5) * 0.5;
                    agent.retention = Math.max(90, Math.min(100, current + variation)).toFixed(1) + '%';
                }
            }
        });

        // Re-render agents with updated data
        this.renderAgents();
    }

    addLogEntry() {
        const logContainer = document.querySelector('.log-container');
        if (!logContainer) return;

        const messages = [
            'Agent synchronization completed',
            'Memory optimization routine finished',
            'Database backup completed successfully',
            'System health check passed',
            'Cache refresh completed',
            'Security scan completed - no threats detected'
        ];

        const levels = ['info', 'success', 'info', 'success', 'info', 'success'];
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];

        const randomIndex = Math.floor(Math.random() * messages.length);
        const newEntry = document.createElement('div');
        newEntry.className = 'log-entry';
        newEntry.innerHTML = `
            <span class="log-time">${timeString}</span>
            <span class="log-level ${levels[randomIndex]}">${levels[randomIndex].toUpperCase()}</span>
            <span class="log-message">${messages[randomIndex]}</span>
        `;

        logContainer.insertBefore(newEntry, logContainer.firstChild);

        // Keep only last 20 entries
        const entries = logContainer.querySelectorAll('.log-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }

    updateTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const updateClock = () => {
                const now = new Date();
                timeElement.textContent = now.toTimeString().split(' ')[0];
            };
            updateClock();
            setInterval(updateClock, 1000);
        }
    }

    // Public API methods
    getSystemStatus() {
        return {
            totalAgents: this.agents.length,
            activeAgents: this.agents.filter(a => a.status === 'active').length,
            systemHealth: '98.5%',
            uptime: '99.97%'
        };
    }

    getAgentById(id) {
        return this.agents.find(a => a.id == id);
    }

    switchToTab(tabName) {
        this.switchTab(tabName);
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.awipControl = new AWIPMissionControl();
});

// Make it globally accessible
window.AWIPMissionControl = AWIPMissionControl;