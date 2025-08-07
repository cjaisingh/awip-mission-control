# Database Schema Documentation

**Version**: 2.1.0  
**Last Updated**: 2025-08-07T19:30:00.036Z

## Tables


### agents

Agent information and status

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(200) | Agent name |
| domain | VARCHAR(100) | Agent domain |
| status | VARCHAR(50) | Current status |
| performance_score | DECIMAL(5,2) | Performance metric |


### system_health

System health metrics

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| overall | DECIMAL(5,2) | Overall health score |
| cpu | DECIMAL(5,2) | CPU usage |
| memory | DECIMAL(5,2) | Memory usage |
| timestamp | TIMESTAMP | Measurement time |

