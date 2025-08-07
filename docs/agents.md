# Agent System Documentation

**Version**: 2.1.0  
**Last Updated**: 2025-08-07T19:30:00.036Z

## Agents


### DevOps Agent

**Domain**: Infrastructure  
**Status**: active

**Capabilities:**
- CI/CD
- Monitoring
- Deployment


### Database Agent

**Domain**: Data Management  
**Status**: active

**Capabilities:**
- Backup
- Optimization
- Security


### Agent 20

**Domain**: AI Coordination  
**Status**: operational

**Capabilities:**
- LangChain Integration
- Conversation Management
- Handoff Protocol


## Tools


### get_system_status

Get current system status and health metrics

**Parameters:**
- `component` (string): The system component to check


### update_agent_status

Update the status of a specific agent

**Parameters:**
- `agentId` (string): The ID of the agent to update
- `status` (string): The new status for the agent
- `health` (number): The health score (0-100)


### generate_handoff_prompt

Generate a handoff prompt for conversation continuity

**Parameters:**
- `context` (string): The current conversation context
- `nextAgent` (string): The agent to handoff to

