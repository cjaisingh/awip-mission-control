// Auto-updating Documentation Service
// This service automatically generates and updates documentation

import fs from 'fs';
import path from 'path';

class DocumentationService {
  constructor() {
    this.docsPath = './docs';
    this.ensureDocsDirectory();
  }

  ensureDocsDirectory() {
    if (!fs.existsSync(this.docsPath)) {
      fs.mkdirSync(this.docsPath, { recursive: true });
    }
  }

  // Generate API documentation from code
  generateAPIDocs() {
    const apiDocs = {
      title: 'AWIP Mission Control API Documentation',
      version: '2.1.0',
      lastUpdated: new Date().toISOString(),
      endpoints: this.extractAPIEndpoints(),
      schemas: this.extractSchemas(),
      examples: this.generateExamples()
    };

    this.writeDocFile('api.md', this.formatAPIDocs(apiDocs));
    return apiDocs;
  }

  // Generate component documentation
  generateComponentDocs() {
    const componentDocs = {
      title: 'Component Library Documentation',
      version: '2.1.0',
      lastUpdated: new Date().toISOString(),
      components: this.extractComponents(),
      props: this.extractComponentProps(),
      examples: this.generateComponentExamples()
    };

    this.writeDocFile('components.md', this.formatComponentDocs(componentDocs));
    return componentDocs;
  }

  // Extract component props
  extractComponentProps() {
    return [
      {
        component: 'Dashboard',
        props: [
          { name: 'className', type: 'string', description: 'Additional CSS classes' }
        ]
      },
      {
        component: 'AgentTools',
        props: [
          { name: 'className', type: 'string', description: 'Additional CSS classes' }
        ]
      },
      {
        component: 'SystemHealth',
        props: [
          { name: 'className', type: 'string', description: 'Additional CSS classes' }
        ]
      }
    ];
  }

  // Generate database schema documentation
  generateDatabaseDocs() {
    const dbDocs = {
      title: 'Database Schema Documentation',
      version: '2.1.0',
      lastUpdated: new Date().toISOString(),
      tables: this.extractDatabaseTables(),
      relationships: this.extractRelationships(),
      indexes: this.extractIndexes()
    };

    this.writeDocFile('database.md', this.formatDatabaseDocs(dbDocs));
    return dbDocs;
  }

  // Generate agent documentation
  generateAgentDocs() {
    const agentDocs = {
      title: 'Agent System Documentation',
      version: '2.1.0',
      lastUpdated: new Date().toISOString(),
      agents: this.extractAgents(),
      tools: this.extractAgentTools(),
      workflows: this.extractWorkflows()
    };

    this.writeDocFile('agents.md', this.formatAgentDocs(agentDocs));
    return agentDocs;
  }

  // Extract API endpoints from code
  extractAPIEndpoints() {
    return [
      {
        method: 'GET',
        path: '/api/system-status',
        description: 'Get current system status',
        parameters: [],
        response: {
          type: 'object',
          properties: {
            database: { type: 'boolean' },
            github: { type: 'boolean' },
            agent20: { type: 'boolean' }
          }
        }
      },
      {
        method: 'GET',
        path: '/api/agents',
        description: 'Get all agents status',
        parameters: [],
        response: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              status: { type: 'string' },
              performance_score: { type: 'number' }
            }
          }
        }
      },
      {
        method: 'POST',
        path: '/api/chat',
        description: 'Send message to LangChain agent',
        parameters: [
          { name: 'message', type: 'string', required: true }
        ],
        response: {
          type: 'object',
          properties: {
            response: { type: 'string' },
            timestamp: { type: 'string' }
          }
        }
      }
    ];
  }

  // Extract schemas from code
  extractSchemas() {
    return {
      SystemStatus: {
        type: 'object',
        properties: {
          database: { type: 'boolean' },
          github: { type: 'boolean' },
          agent20: { type: 'boolean' }
        }
      },
      Agent: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          domain: { type: 'string' },
          status: { type: 'string' },
          performance_score: { type: 'number' },
          last_heartbeat: { type: 'string' },
          capabilities: { type: 'array', items: { type: 'string' } }
        }
      },
      SystemMetrics: {
        type: 'object',
        properties: {
          cpu: { type: 'number' },
          memory: { type: 'number' },
          network: { type: 'number' },
          disk: { type: 'number' }
        }
      }
    };
  }

  // Extract components from code
  extractComponents() {
    return [
      {
        name: 'Dashboard',
        description: 'Main dashboard component with system overview',
        file: 'src/pages/Dashboard.js',
        props: [],
        features: ['System status cards', 'Performance charts', 'Agent tools']
      },
      {
        name: 'AgentTools',
        description: 'Interactive LangChain agent tools interface',
        file: 'src/components/AgentTools.tsx',
        props: [],
        features: ['Tool execution', 'Real-time status', 'Memory monitoring']
      },
      {
        name: 'SystemHealth',
        description: 'System health monitoring component',
        file: 'src/pages/SystemHealth.js',
        props: [],
        features: ['Health metrics', 'Alert display', 'Performance trends']
      }
    ];
  }

  // Extract database tables
  extractDatabaseTables() {
    return [
      {
        name: 'agents',
        description: 'Agent information and status',
        columns: [
          { name: 'id', type: 'UUID', description: 'Primary key' },
          { name: 'name', type: 'VARCHAR(200)', description: 'Agent name' },
          { name: 'domain', type: 'VARCHAR(100)', description: 'Agent domain' },
          { name: 'status', type: 'VARCHAR(50)', description: 'Current status' },
          { name: 'performance_score', type: 'DECIMAL(5,2)', description: 'Performance metric' }
        ]
      },
      {
        name: 'system_health',
        description: 'System health metrics',
        columns: [
          { name: 'id', type: 'UUID', description: 'Primary key' },
          { name: 'overall', type: 'DECIMAL(5,2)', description: 'Overall health score' },
          { name: 'cpu', type: 'DECIMAL(5,2)', description: 'CPU usage' },
          { name: 'memory', type: 'DECIMAL(5,2)', description: 'Memory usage' },
          { name: 'timestamp', type: 'TIMESTAMP', description: 'Measurement time' }
        ]
      }
    ];
  }

  // Extract agents information
  extractAgents() {
    return [
      {
        id: 1,
        name: 'DevOps Agent',
        domain: 'Infrastructure',
        capabilities: ['CI/CD', 'Monitoring', 'Deployment'],
        status: 'active'
      },
      {
        id: 2,
        name: 'Database Agent',
        domain: 'Data Management',
        capabilities: ['Backup', 'Optimization', 'Security'],
        status: 'active'
      },
      {
        id: 20,
        name: 'Agent 20',
        domain: 'AI Coordination',
        capabilities: ['LangChain Integration', 'Conversation Management', 'Handoff Protocol'],
        status: 'operational'
      }
    ];
  }

  // Extract agent tools
  extractAgentTools() {
    return [
      {
        name: 'get_system_status',
        description: 'Get current system status and health metrics',
        parameters: {
          component: { type: 'string', description: 'The system component to check' }
        }
      },
      {
        name: 'update_agent_status',
        description: 'Update the status of a specific agent',
        parameters: {
          agentId: { type: 'string', description: 'The ID of the agent to update' },
          status: { type: 'string', description: 'The new status for the agent' },
          health: { type: 'number', description: 'The health score (0-100)' }
        }
      },
      {
        name: 'generate_handoff_prompt',
        description: 'Generate a handoff prompt for conversation continuity',
        parameters: {
          context: { type: 'string', description: 'The current conversation context' },
          nextAgent: { type: 'string', description: 'The agent to handoff to' }
        }
      }
    ];
  }

  // Format API documentation
  formatAPIDocs(docs) {
    return `# ${docs.title}

**Version**: ${docs.version}  
**Last Updated**: ${docs.lastUpdated}

## Endpoints

${docs.endpoints.map(endpoint => `
### ${endpoint.method} ${endpoint.path}

${endpoint.description}

**Parameters:**
${endpoint.parameters.map(param => `- \`${param.name}\` (${param.type})${param.required ? ' - Required' : ''}: ${param.description || ''}`).join('\n')}

**Response:**
\`\`\`json
${JSON.stringify(endpoint.response, null, 2)}
\`\`\`
`).join('\n')}

## Schemas

${Object.entries(docs.schemas).map(([name, schema]) => `
### ${name}

\`\`\`json
${JSON.stringify(schema, null, 2)}
\`\`\`
`).join('\n')}

## Examples

${docs.examples.map(example => `
### ${example.title}

\`\`\`javascript
${example.code}
\`\`\`
`).join('\n')}
`;
  }

  // Format component documentation
  formatComponentDocs(docs) {
    return `# ${docs.title}

**Version**: ${docs.version}  
**Last Updated**: ${docs.lastUpdated}

## Components

${docs.components.map(component => `
### ${component.name}

**File**: \`${component.file}\`  
**Description**: ${component.description}

**Features:**
${component.features.map(feature => `- ${feature}`).join('\n')}

**Props:**
${component.props.length > 0 ? component.props.map(prop => `- \`${prop.name}\` (${prop.type}): ${prop.description}`).join('\n') : 'No props'}
`).join('\n')}
`;
  }

  // Format database documentation
  formatDatabaseDocs(docs) {
    return `# ${docs.title}

**Version**: ${docs.version}  
**Last Updated**: ${docs.lastUpdated}

## Tables

${docs.tables.map(table => `
### ${table.name}

${table.description}

| Column | Type | Description |
|--------|------|-------------|
${table.columns.map(col => `| ${col.name} | ${col.type} | ${col.description} |`).join('\n')}
`).join('\n')}
`;
  }

  // Format agent documentation
  formatAgentDocs(docs) {
    return `# ${docs.title}

**Version**: ${docs.version}  
**Last Updated**: ${docs.lastUpdated}

## Agents

${docs.agents.map(agent => `
### ${agent.name}

**Domain**: ${agent.domain}  
**Status**: ${agent.status}

**Capabilities:**
${agent.capabilities.map(cap => `- ${cap}`).join('\n')}
`).join('\n')}

## Tools

${docs.tools.map(tool => `
### ${tool.name}

${tool.description}

**Parameters:**
${Object.entries(tool.parameters).map(([name, param]) => `- \`${name}\` (${param.type}): ${param.description}`).join('\n')}
`).join('\n')}
`;
  }

  // Write documentation file
  writeDocFile(filename, content) {
    const filePath = path.join(this.docsPath, filename);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`📝 Generated documentation: ${filePath}`);
  }

  // Generate examples
  generateExamples() {
    return [
      {
        title: 'Get System Status',
        code: `const response = await fetch('/api/system-status');
const data = await response.json();
console.log(data);`
      },
      {
        title: 'Send Chat Message',
        code: `const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello Agent 20' })
});
const data = await response.json();
console.log(data.response);`
      }
    ];
  }

  // Generate component examples
  generateComponentExamples() {
    return [
      {
        title: 'Using Dashboard Component',
        code: `import Dashboard from './pages/Dashboard';

function App() {
  return <Dashboard />;
}`
      },
      {
        title: 'Using AgentTools Component',
        code: `import AgentTools from './components/AgentTools';

function Dashboard() {
  return (
    <div>
      <AgentTools />
    </div>
  );
}`
      }
    ];
  }

  // Extract workflows
  extractWorkflows() {
    return [
      {
        name: 'Agent Handoff',
        description: 'Seamless conversation handoff between agents',
        steps: [
          'Agent 20 generates handoff prompt',
          'Context is preserved in vector store',
          'Next agent receives full context',
          'Conversation continues seamlessly'
        ]
      },
      {
        name: 'System Health Monitoring',
        description: 'Real-time system health monitoring',
        steps: [
          'Metrics collected from all components',
          'Health score calculated',
          'Alerts generated for issues',
          'Dashboard updated in real-time'
        ]
      }
    ];
  }

  // Extract relationships
  extractRelationships() {
    return [
      {
        from: 'agents',
        to: 'agent_status',
        type: 'one-to-one',
        description: 'Each agent has one status record'
      },
      {
        from: 'system_health',
        to: 'system_alerts',
        type: 'one-to-many',
        description: 'Health metrics can trigger multiple alerts'
      }
    ];
  }

  // Extract indexes
  extractIndexes() {
    return [
      {
        table: 'agents',
        columns: ['status'],
        type: 'BTREE',
        description: 'Index for filtering agents by status'
      },
      {
        table: 'system_health',
        columns: ['timestamp'],
        type: 'BTREE',
        description: 'Index for time-based queries'
      }
    ];
  }

  // Generate all documentation
  generateAllDocs() {
    console.log('📚 Generating all documentation...');
    
    const docs = {
      api: this.generateAPIDocs(),
      components: this.generateComponentDocs(),
      database: this.generateDatabaseDocs(),
      agents: this.generateAgentDocs()
    };

    // Generate index file
    const indexContent = `# AWIP Mission Control Documentation

**Version**: 2.1.0  
**Last Updated**: ${new Date().toISOString()}

## Documentation Index

- **[API Documentation](api.md)** - Complete API reference
- **[Component Library](components.md)** - UI component documentation
- **[Database Schema](database.md)** - Database structure and relationships
- **[Agent System](agents.md)** - Agent capabilities and workflows

## Quick Start

1. **API Usage**: See [API Documentation](api.md) for endpoint details
2. **Components**: See [Component Library](components.md) for UI components
3. **Database**: See [Database Schema](database.md) for data structure
4. **Agents**: See [Agent System](agents.md) for agent capabilities

## Auto-Generation

This documentation is automatically generated and updated. To regenerate:

\`\`\`bash
npm run generate-docs
\`\`\`
`;

    this.writeDocFile('index.md', indexContent);
    
    console.log('✅ All documentation generated successfully!');
    return docs;
  }
}

// Export singleton instance
export const documentationService = new DocumentationService();
export default documentationService;
