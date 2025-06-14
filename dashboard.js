// AWIP Enhanced Dashboard - Advanced Vanilla JavaScript Implementation
// Includes: Self-evolving agents, D3.js visualization, state management, component system

class AWIPDashboard {
    constructor() {
        this.stateManager = new AWIPStateManager();
        this.agentSystem = new AWIPAgentSystem();
        this.componentEditor = new AWIPComponentEditor();
        this.workflowVisualizer = new AWIPWorkflowVisualizer();
        this.performanceMonitor = new AWIPPerformanceMonitor();

        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.initializeComponents();
        this.startRealTimeUpdates();
        console.log('AWIP Enhanced Dashboard initialized');
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMReady();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    onDOMReady() {
        this.agentSystem.initialize();
        this.componentEditor.initialize();
        this.workflowVisualizer.initialize();
        this.performanceMonitor.initialize();
    }

    handleResize() {
        this.workflowVisualizer.resize();
        this.componentEditor.adjustPosition();
    }

    initializeComponents() {
        // Initialize all dashboard components
        this.stateManager.setState('dashboard-status', 'initializing');
        this.stateManager.setState('agent-count', 19);
        this.stateManager.setState('system-health', 99.2);
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.updateMetrics();
            this.checkSystemHealth();
            this.updateAgentStatus();
        }, 5000);
    }

    updateMetrics() {
        const metrics = this.performanceMonitor.getLatestMetrics();
        this.stateManager.setState('performance-metrics', metrics);
    }

    checkSystemHealth() {
        const health = this.performanceMonitor.calculateSystemHealth();
        this.stateManager.setState('system-health', health);
    }

    updateAgentStatus() {
        const status = this.agentSystem.getAgentStatus();
        this.stateManager.setState('agent-status', status);
    }
}

// AWIP State Manager - Custom state management system
class AWIPStateManager {
    constructor() {
        this.states = new Map();
        this.listeners = new Map();
        this.history = [];
        this.maxHistorySize = 1000;
    }

    setState(key, value, options = {}) {
        const oldValue = this.states.get(key);
        this.states.set(key, value);

        // Store history
        this.history.push({
            key,
            oldValue,
            newValue: value,
            timestamp: Date.now(),
            metadata: options.metadata || {}
        });

        // Trim history if needed
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(-this.maxHistorySize);
        }

        // Notify listeners
        this.notifyListeners(key, value, oldValue);

        // Trigger persistence if requested
        if (options.persist) {
            this.persistState(key, value);
        }
    }

    getState(key, defaultValue = null) {
        return this.states.has(key) ? this.states.get(key) : defaultValue;
    }

    addListener(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);
    }

    removeListener(key, callback) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).delete(callback);
        }
    }

    notifyListeners(key, newValue, oldValue) {
        const callbacks = this.listeners.get(key);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(newValue, oldValue, key);
                } catch (error) {
                    console.error('Error in state listener:', error);
                }
            });
        }
    }

    getHistory(key = null, limit = 100) {
        let history = this.history;
        if (key) {
            history = history.filter(entry => entry.key === key);
        }
        return history.slice(-limit);
    }

    persistState(key, value) {
        try {
            localStorage.setItem(`awip_state_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn('Failed to persist state:', error);
        }
    }

    loadPersistedState(key) {
        try {
            const stored = localStorage.getItem(`awip_state_${key}`);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.warn('Failed to load persisted state:', error);
            return null;
        }
    }
}

// AWIP Agent System - Self-evolving agent management
class AWIPAgentSystem {
    constructor() {
        this.agents = new Map();
        this.evolutionEngine = new AWIPEvolutionEngine();
        this.performanceTracker = new Map();
    }

    initialize() {
        this.createAgents();
        this.startEvolutionCycle();
        console.log('AWIP Agent System initialized with', this.agents.size, 'agents');
    }

    createAgents() {
        const agentConfigs = [
            { id: 'agent-01', name: 'Discussion Continuity Agent', type: 'coordinator', capabilities: ['memory', 'context', 'continuity'] },
            { id: 'agent-02', name: 'Content Analysis Agent', type: 'analyzer', capabilities: ['nlp', 'sentiment', 'classification'] },
            { id: 'agent-03', name: 'Data Processing Agent', type: 'processor', capabilities: ['transform', 'aggregate', 'filter'] },
            { id: 'agent-04', name: 'Workflow Coordination Agent', type: 'coordinator', capabilities: ['orchestration', 'routing', 'scheduling'] },
            { id: 'agent-05', name: 'Quality Assurance Agent', type: 'validator', capabilities: ['testing', 'validation', 'verification'] },
            { id: 'agent-06', name: 'Performance Monitor Agent', type: 'monitor', capabilities: ['metrics', 'alerts', 'diagnostics'] },
            { id: 'agent-07', name: 'Security Agent', type: 'security', capabilities: ['authentication', 'authorization', 'audit'] },
            { id: 'agent-08', name: 'Integration Agent', type: 'connector', capabilities: ['api', 'webhook', 'sync'] },
            { id: 'agent-09', name: 'Learning Agent', type: 'ml', capabilities: ['training', 'inference', 'adaptation'] },
            { id: 'agent-10', name: 'Optimization Agent', type: 'optimizer', capabilities: ['performance', 'efficiency', 'tuning'] }
        ];

        agentConfigs.forEach(config => {
            const agent = new AWIPAgent(config);
            this.agents.set(config.id, agent);
            this.performanceTracker.set(config.id, {
                score: 85 + Math.random() * 15,
                evolution_count: 0,
                last_evolution: Date.now(),
                performance_history: []
            });
        });
    }

    startEvolutionCycle() {
        setInterval(() => {
            this.evolveAgents();
        }, 30000); // Evolve every 30 seconds
    }

    evolveAgents() {
        this.agents.forEach((agent, agentId) => {
            const performance = this.performanceTracker.get(agentId);

            if (this.shouldEvolve(performance)) {
                this.evolutionEngine.evolveAgent(agent, performance);
                performance.evolution_count++;
                performance.last_evolution = Date.now();

                console.log(`Agent ${agentId} evolved (${performance.evolution_count} times)`);
            }
        });
    }

    shouldEvolve(performance) {
        const timeSinceLastEvolution = Date.now() - performance.last_evolution;
        const performanceThreshold = 90;
        const timeThreshold = 60000; // 1 minute

        return performance.score < performanceThreshold && timeSinceLastEvolution > timeThreshold;
    }

    getAgentStatus() {
        const status = {
            total: this.agents.size,
            active: 0,
            evolving: 0,
            performance: 0
        };

        this.performanceTracker.forEach((performance, agentId) => {
            status.active++;
            if (performance.evolution_count > 0) {
                status.evolving++;
            }
            status.performance += performance.score;
        });

        status.performance = status.performance / status.total;
        return status;
    }
}

// Individual Agent Class
class AWIPAgent {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.type = config.type;
        this.capabilities = config.capabilities;
        this.state = 'active';
        this.memory = new Map();
        this.performance = {
            score: 85 + Math.random() * 15,
            tasks_completed: 0,
            errors: 0,
            response_time: Math.random() * 5 + 1
        };
    }

    execute(task) {
        this.performance.tasks_completed++;

        // Simulate task execution
        const success = Math.random() > 0.1; // 90% success rate

        if (!success) {
            this.performance.errors++;
        }

        this.updatePerformance();
        return success;
    }

    updatePerformance() {
        const errorRate = this.performance.errors / Math.max(this.performance.tasks_completed, 1);
        this.performance.score = Math.max(0, 100 - (errorRate * 50));
    }

    evolve() {
        // Simulate evolution by improving performance
        this.performance.score = Math.min(100, this.performance.score + Math.random() * 5);
        this.performance.response_time *= 0.95; // Improve response time
        console.log(`Agent ${this.id} evolved: new score ${this.performance.score.toFixed(2)}`);
    }
}

// Evolution Engine for self-improving agents
class AWIPEvolutionEngine {
    constructor() {
        this.algorithms = ['textgrad', 'aflow', 'mipro'];
        this.optimizationHistory = [];
    }

    evolveAgent(agent, performance) {
        const algorithm = this.selectOptimizationAlgorithm(performance);
        const improvement = this.applyOptimization(agent, algorithm);

        this.optimizationHistory.push({
            agentId: agent.id,
            algorithm,
            improvement,
            timestamp: Date.now()
        });

        return improvement;
    }

    selectOptimizationAlgorithm(performance) {
        // Select algorithm based on performance characteristics
        if (performance.score < 70) {
            return 'textgrad'; // For prompt optimization
        } else if (performance.evolution_count < 3) {
            return 'aflow'; // For workflow structure optimization
        } else {
            return 'mipro'; // For instruction optimization
        }
    }

    applyOptimization(agent, algorithm) {
        let improvement = 0;

        switch (algorithm) {
            case 'textgrad':
                improvement = this.applyTextGradOptimization(agent);
                break;
            case 'aflow':
                improvement = this.applyAFlowOptimization(agent);
                break;
            case 'mipro':
                improvement = this.applyMIPROOptimization(agent);
                break;
        }

        agent.evolve();
        return improvement;
    }

    applyTextGradOptimization(agent) {
        // Simulate TextGrad optimization
        const improvement = Math.random() * 10;
        agent.performance.score += improvement;
        return improvement;
    }

    applyAFlowOptimization(agent) {
        // Simulate AFlow optimization
        const improvement = Math.random() * 8;
        agent.performance.response_time *= 0.9;
        return improvement;
    }

    applyMIPROOptimization(agent) {
        // Simulate MIPRO optimization
        const improvement = Math.random() * 6;
        agent.capabilities.push('optimized');
        return improvement;
    }
}

// Component Editor with floating panels
class AWIPComponentEditor {
    constructor() {
        this.components = new Map();
        this.selectedComponent = null;
        this.propertyPanel = null;
        this.isDragging = false;
    }

    initialize() {
        this.createPropertyPanel();
        this.setupEventListeners();
        console.log('AWIP Component Editor initialized');
    }

    createPropertyPanel() {
        this.propertyPanel = document.getElementById('component-editor-panel');
        if (!this.propertyPanel) {
            console.warn('Component editor panel not found in DOM');
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('awip-component')) {
                this.selectComponent(e.target);
            }
        });
    }

    selectComponent(element) {
        this.selectedComponent = element;
        this.showPropertyPanel();
        this.highlightComponent(element);
    }

    showPropertyPanel() {
        if (this.propertyPanel) {
            this.propertyPanel.style.display = 'block';
            this.populateProperties();
        }
    }

    populateProperties() {
        // Populate property panel with component properties
        const content = document.getElementById('editor-content');
        if (content && this.selectedComponent) {
            // This would be populated with actual component properties
            console.log('Populating properties for', this.selectedComponent);
        }
    }

    highlightComponent(element) {
        // Remove existing highlights
        document.querySelectorAll('.awip-component-selected').forEach(el => {
            el.classList.remove('awip-component-selected');
        });

        // Add highlight to selected component
        element.classList.add('awip-component-selected');
    }

    adjustPosition() {
        // Adjust panel position on window resize
        if (this.propertyPanel && this.propertyPanel.style.display === 'block') {
            const rect = this.propertyPanel.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            if (rect.right > windowWidth) {
                this.propertyPanel.style.left = (windowWidth - rect.width - 20) + 'px';
            }
            if (rect.bottom > windowHeight) {
                this.propertyPanel.style.top = (windowHeight - rect.height - 20) + 'px';
            }
        }
    }
}

// Workflow Visualizer using D3.js
class AWIPWorkflowVisualizer {
    constructor() {
        this.svg = null;
        this.simulation = null;
        this.nodes = [];
        this.links = [];
    }

    initialize() {
        this.createVisualization();
        console.log('AWIP Workflow Visualizer initialized');
    }

    createVisualization() {
        const container = document.getElementById('workflow-canvas');
        if (!container) return;

        const width = container.clientWidth || 800;
        const height = 400;

        this.svg = d3.select('#workflow-canvas')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        this.setupForceSimulation(width, height);
        this.loadSampleData();
    }

    setupForceSimulation(width, height) {
        this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));
    }

    loadSampleData() {
        this.nodes = [
            { id: 'agent1', name: 'Discussion Agent', group: 1, x: 100, y: 100 },
            { id: 'agent2', name: 'Analysis Agent', group: 2, x: 200, y: 150 },
            { id: 'agent3', name: 'Processing Agent', group: 2, x: 300, y: 200 },
            { id: 'agent4', name: 'Coordination Agent', group: 3, x: 400, y: 150 },
            { id: 'agent5', name: 'QA Agent', group: 3, x: 500, y: 100 }
        ];

        this.links = [
            { source: 'agent1', target: 'agent2', strength: 1 },
            { source: 'agent2', target: 'agent3', strength: 1 },
            { source: 'agent3', target: 'agent4', strength: 1 },
            { source: 'agent4', target: 'agent5', strength: 1 },
            { source: 'agent1', target: 'agent4', strength: 0.5 }
        ];

        this.render();
    }

    render() {
        if (!this.svg) return;

        // Clear existing elements
        this.svg.selectAll('*').remove();

        // Create links
        const link = this.svg.append('g')
            .selectAll('line')
            .data(this.links)
            .enter().append('line')
            .attr('stroke', '#00d4ff')
            .attr('stroke-width', d => d.strength * 3)
            .attr('stroke-opacity', 0.6);

        // Create nodes
        const node = this.svg.append('g')
            .selectAll('g')
            .data(this.nodes)
            .enter().append('g')
            .call(d3.drag()
                .on('start', this.dragstarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragended.bind(this)));

        // Add circles for nodes
        node.append('circle')
            .attr('r', 25)
            .attr('fill', d => {
                const colors = ['#00d4ff', '#ff0080', '#10b981', '#f59e0b'];
                return colors[d.group - 1] || '#6b7280';
            })
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2);

        // Add labels
        node.append('text')
            .text(d => d.name.split(' ')[0])
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('font-size', '12px')
            .attr('fill', '#ffffff')
            .attr('font-weight', 'bold');

        // Start simulation
        this.simulation.nodes(this.nodes).on('tick', () => {
            link.attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        this.simulation.force('link').links(this.links);
    }

    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    resize() {
        if (!this.svg) return;

        const container = document.getElementById('workflow-canvas');
        if (container) {
            const width = container.clientWidth;
            const height = 400;

            this.svg.attr('width', width).attr('height', height);
            this.simulation.force('center', d3.forceCenter(width / 2, height / 2));
            this.simulation.alpha(1).restart();
        }
    }
}

// Performance Monitor
class AWIPPerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.chart = null;
    }

    initialize() {
        this.setupMetrics();
        this.initializeChart();
        console.log('AWIP Performance Monitor initialized');
    }

    setupMetrics() {
        this.metrics.set('cpu_usage', []);
        this.metrics.set('memory_usage', []);
        this.metrics.set('response_time', []);
        this.metrics.set('agent_performance', []);
        this.metrics.set('system_load', []);
    }

    initializeChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Agent Performance',
                    data: this.generateRandomData(),
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'System Load',
                    data: this.generateRandomData(),
                    borderColor: '#ff0080',
                    backgroundColor: 'rgba(255, 0, 128, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    generateTimeLabels() {
        const labels = [];
        for (let i = 0; i < 24; i += 4) {
            labels.push(i.toString().padStart(2, '0') + ':00');
        }
        return labels;
    }

    generateRandomData() {
        return Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 60);
    }

    getLatestMetrics() {
        return {
            timestamp: Date.now(),
            cpu_usage: Math.random() * 30 + 40,
            memory_usage: Math.random() * 20 + 60,
            response_time: Math.random() * 2 + 1,
            agent_performance: Math.random() * 10 + 90,
            system_load: Math.random() * 30 + 50
        };
    }

    calculateSystemHealth() {
        const metrics = this.getLatestMetrics();
        const health = (
            (100 - metrics.cpu_usage) * 0.3 +
            (100 - metrics.memory_usage) * 0.3 +
            (100 - Math.min(metrics.response_time * 10, 100)) * 0.2 +
            metrics.agent_performance * 0.2
        );
        return Math.max(0, Math.min(100, health));
    }

    updateChart() {
        if (!this.chart) return;

        const newData = this.generateRandomData();
        this.chart.data.datasets[0].data = newData;
        this.chart.data.datasets[1].data = this.generateRandomData();
        this.chart.update('none');
    }
}

// Web Components for reusable AWIP elements
class AWIPComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        // Override in subclasses
    }

    setupEventListeners() {
        // Override in subclasses
    }
}

// Status Indicator Web Component
class AWIPStatusIndicator extends AWIPComponent {
    render() {
        const status = this.getAttribute('status') || 'operational';
        const size = this.getAttribute('size') || '12px';

        this.shadowRoot.innerHTML = `
            <style>
                .indicator {
                    width: ${size};
                    height: ${size};
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 8px;
                }
                .operational { background: #10b981; }
                .warning { background: #f59e0b; }
                .error { background: #ef4444; }
                .info { background: #3b82f6; }
            </style>
            <span class="indicator ${status}"></span>
        `;
    }
}

// Initialize the dashboard when the script loads
document.addEventListener('DOMContentLoaded', () => {
    // Register custom web components
    customElements.define('awip-status-indicator', AWIPStatusIndicator);

    // Initialize the main dashboard
    window.awipDashboard = new AWIPDashboard();
});

// Export classes for external use
window.AWIPDashboard = AWIPDashboard;
window.AWIPStateManager = AWIPStateManager;
window.AWIPAgentSystem = AWIPAgentSystem;
window.AWIPComponentEditor = AWIPComponentEditor;
window.AWIPWorkflowVisualizer = AWIPWorkflowVisualizer;
window.AWIPPerformanceMonitor = AWIPPerformanceMonitor;

console.log('AWIP Enhanced Dashboard Script Loaded');
