# AWIP Mission Control API Documentation

**Version**: 2.1.0  
**Last Updated**: 2025-08-07T19:30:00.034Z

## Endpoints


### GET /api/system-status

Get current system status

**Parameters:**


**Response:**
```json
{
  "type": "object",
  "properties": {
    "database": {
      "type": "boolean"
    },
    "github": {
      "type": "boolean"
    },
    "agent20": {
      "type": "boolean"
    }
  }
}
```


### GET /api/agents

Get all agents status

**Parameters:**


**Response:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "number"
      },
      "name": {
        "type": "string"
      },
      "status": {
        "type": "string"
      },
      "performance_score": {
        "type": "number"
      }
    }
  }
}
```


### POST /api/chat

Send message to LangChain agent

**Parameters:**
- `message` (string) - Required: 

**Response:**
```json
{
  "type": "object",
  "properties": {
    "response": {
      "type": "string"
    },
    "timestamp": {
      "type": "string"
    }
  }
}
```


## Schemas


### SystemStatus

```json
{
  "type": "object",
  "properties": {
    "database": {
      "type": "boolean"
    },
    "github": {
      "type": "boolean"
    },
    "agent20": {
      "type": "boolean"
    }
  }
}
```


### Agent

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "domain": {
      "type": "string"
    },
    "status": {
      "type": "string"
    },
    "performance_score": {
      "type": "number"
    },
    "last_heartbeat": {
      "type": "string"
    },
    "capabilities": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```


### SystemMetrics

```json
{
  "type": "object",
  "properties": {
    "cpu": {
      "type": "number"
    },
    "memory": {
      "type": "number"
    },
    "network": {
      "type": "number"
    },
    "disk": {
      "type": "number"
    }
  }
}
```


## Examples


### Get System Status

```javascript
const response = await fetch('/api/system-status');
const data = await response.json();
console.log(data);
```


### Send Chat Message

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello Agent 20' })
});
const data = await response.json();
console.log(data.response);
```

