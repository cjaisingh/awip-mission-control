import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { allAgentTools } from './agentFunctions';

// Initialize LLM
const llm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.1,
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

// Initialize embeddings for memory
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

// Create vector store for memory
const vectorStore = new MemoryVectorStore(embeddings);

// Define base tools for Agent 20
const baseTools = [
  new DynamicStructuredTool({
    name: 'get_system_status',
    description: 'Get current system status and health metrics',
    schema: {
      type: 'object',
      properties: {
        component: {
          type: 'string',
          description: 'The system component to check'
        }
      },
      required: ['component']
    },
    func: async ({ component }) => {
      // Mock system status - in real implementation, this would call actual APIs
      const statuses = {
        database: { status: 'connected', health: 95 },
        github: { status: 'active', health: 88 },
        agent20: { status: 'operational', health: 92 },
        memory: { status: 'normal', usage: 60 },
        cpu: { status: 'normal', usage: 45 }
      };
      
      return JSON.stringify(statuses[component] || { status: 'unknown', health: 0 });
    }
  }),
  
  new DynamicStructuredTool({
    name: 'update_agent_status',
    description: 'Update the status of a specific agent',
    schema: {
      type: 'object',
      properties: {
        agentId: {
          type: 'string',
          description: 'The ID of the agent to update'
        },
        status: {
          type: 'string',
          description: 'The new status for the agent'
        },
        health: {
          type: 'number',
          description: 'The health score (0-100)'
        }
      },
      required: ['agentId', 'status']
    },
    func: async ({ agentId, status, health = 90 }) => {
      // Mock agent status update
      console.log(`Updating agent ${agentId} to status: ${status}, health: ${health}`);
      return JSON.stringify({ success: true, agentId, status, health });
    }
  }),
  
  new DynamicStructuredTool({
    name: 'generate_handoff_prompt',
    description: 'Generate a handoff prompt for conversation continuity',
    schema: {
      type: 'object',
      properties: {
        context: {
          type: 'string',
          description: 'The current conversation context'
        },
        nextAgent: {
          type: 'string',
          description: 'The agent to handoff to'
        }
      },
      required: ['context']
    },
    func: async ({ context, nextAgent = 'agent_20' }) => {
      const prompt = `Handoff to ${nextAgent}:\n\nContext: ${context}\n\nPlease continue the conversation with full context.`;
      return prompt;
    }
  }),
  
  new DynamicStructuredTool({
    name: 'analyze_system_health',
    description: 'Analyze overall system health and provide recommendations',
    schema: {
      type: 'object',
      properties: {
        metrics: {
          type: 'string',
          description: 'System metrics to analyze'
        }
      },
      required: ['metrics']
    },
    func: async ({ metrics }) => {
      const parsedMetrics = JSON.parse(metrics);
      const analysis = {
        overallHealth: 85,
        recommendations: [
          'Monitor CPU usage closely',
          'Consider scaling database connections',
          'Review agent performance metrics'
        ],
        alerts: []
      };
      
      if (parsedMetrics.cpu > 80) {
        analysis.alerts.push('High CPU usage detected');
      }
      
      return JSON.stringify(analysis);
    }
  }),

  // Agent delegation tools
  new DynamicStructuredTool({
    name: 'delegate_to_agent',
    description: 'Delegate task to specific agent',
    schema: {
      type: 'object',
      properties: {
        agentId: {
          type: 'string',
          description: 'The agent ID to delegate to (01-19)'
        },
        task: {
          type: 'string',
          description: 'The task to delegate'
        },
        parameters: {
          type: 'string',
          description: 'Task parameters in JSON format'
        }
      },
      required: ['agentId', 'task']
    },
    func: async ({ agentId, task, parameters = '{}' }) => {
      const agentKey = `agent_${agentId.padStart(2, '0')}`;
      const agentTools = allAgentTools[agentKey];
      
      if (!agentTools) {
        return JSON.stringify({ error: `Agent ${agentId} not found` });
      }

      // Find the appropriate tool for the task
      const tool = agentTools.find(t => t.name.includes(task.toLowerCase()));
      
      if (!tool) {
        return JSON.stringify({ error: `Task ${task} not available for agent ${agentId}` });
      }

      try {
        const parsedParams = JSON.parse(parameters);
        const result = await tool.func(parsedParams);
        return JSON.stringify({
          success: true,
          agent: agentId,
          task,
          result: JSON.parse(result)
        });
      } catch (error) {
        return JSON.stringify({ error: `Failed to execute task: ${error.message}` });
      }
    }
  }),

  new DynamicStructuredTool({
    name: 'get_agent_capabilities',
    description: 'Get capabilities of a specific agent',
    schema: {
      type: 'object',
      properties: {
        agentId: {
          type: 'string',
          description: 'The agent ID to check (01-19)'
        }
      },
      required: ['agentId']
    },
    func: async ({ agentId }) => {
      const agentKey = `agent_${agentId.padStart(2, '0')}`;
      const agentTools = allAgentTools[agentKey];
      
      if (!agentTools) {
        return JSON.stringify({ error: `Agent ${agentId} not found` });
      }

      const capabilities = agentTools.map(tool => ({
        name: tool.name,
        description: tool.description
      }));

      return JSON.stringify({
        agentId,
        capabilities,
        totalTools: capabilities.length
      });
    }
  })
];

// Combine all tools
const tools = [...baseTools];

// Create the agent prompt template
const prompt = PromptTemplate.fromTemplate(`
You are Agent 20, an AI assistant managing the AWIP Mission Control system.

Current conversation context: {context}

Available tools: {tools}

You can delegate tasks to other agents (01-19) using the delegate_to_agent tool.
Each agent has specific capabilities:
- Agent 01: DevOps (deployment, monitoring, scaling)
- Agent 02: Database (optimization, backup, analysis)
- Agent 03: Strategic (roadmaps, competitive analysis)
- Agent 04: Security (scanning, threat blocking, monitoring)
- Agent 05: Analytics (reports, predictions, performance analysis)
- Agent 06: Workflow (creation, execution)
- Agent 07: Communication (notifications, meetings)
- Agent 08: Quality (testing, code review)
- Agent 09: Performance (benchmarking, optimization)
- Agent 10: Finance (cost analysis, budget forecasting)
- Agent 11: Compliance (auditing, reporting)
- Agent 12: Integration (API connections, data sync)
- Agent 13: Backup (creation, restoration)
- Agent 14: Notification (alerts, scheduling)
- Agent 15: Reporting (generation, data export)
- Agent 16: UI/UX (usability analysis, interface optimization)
- Agent 17: Learning (model training, knowledge updates)
- Agent 18: Prediction (outcome prediction, trend forecasting)
- Agent 19: Coordination (agent coordination, workflow optimization)

Use the available tools to help manage the system. Always provide clear, actionable responses.

Question: {input}

{agent_scratchpad}

Response: `);

// Create the agent
const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt
});

// Create the agent executor
export const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true,
  maxIterations: 5
});

// Create a conversation chain for chat functionality
export const conversationChain = RunnableSequence.from([
  {
    context: async () => {
      // Get conversation history from memory
      const docs = await vectorStore.similaritySearch('conversation', 5);
      return docs.map(doc => doc.pageContent).join('\n');
    },
    input: (input) => input.input,
    tools: () => tools.map(tool => tool.name).join(', '),
    agent_scratchpad: () => ''
  },
  prompt,
  llm,
  new StringOutputParser()
]);

// Agent management functions
export const agentManager = {
  // Initialize agent with memory
  async initializeAgent(sessionId) {
    await vectorStore.addDocuments([{
      pageContent: `Session ${sessionId} started`,
      metadata: { sessionId, timestamp: new Date().toISOString() }
    }]);
    return { sessionId, status: 'initialized' };
  },
  
  // Add conversation to memory
  async addToMemory(sessionId, message, response) {
    await vectorStore.addDocuments([{
      pageContent: `User: ${message}\nAgent: ${response}`,
      metadata: { sessionId, timestamp: new Date().toISOString() }
    }]);
  },
  
  // Get conversation history
  async getConversationHistory(sessionId) {
    const docs = await vectorStore.similaritySearch(sessionId, 10);
    return docs.map(doc => doc.pageContent);
  },
  
  // Execute agent with context
  async executeAgent(input, sessionId) {
    try {
      const result = await agentExecutor.invoke({
        input,
        context: await this.getConversationHistory(sessionId).then(history => history.join('\n')),
        agent_scratchpad: ''
      });
      
      // Add to memory
      await this.addToMemory(sessionId, input, result.output);
      
      return result;
    } catch (error) {
      console.error('Agent execution error:', error);
      return { output: 'I encountered an error. Please try again.', error: error.message };
    }
  }
};

// Export for use in components
export { llm, tools, vectorStore, allAgentTools };
