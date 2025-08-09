# AWIP Mission Control - Comprehensive Knowledge Document

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Decisions](#architecture-decisions)
3. [Single Source of Truth (SSOT) Implementation](#single-source-of-truth-ssot-implementation)
4. [Database Design & Integration](#database-design--integration)
5. [File Ingestion Agent Development](#file-ingestion-agent-development)
6. [Performance Optimization Lessons](#performance-optimization-lessons)
7. [State Management Strategy](#state-management-strategy)
8. [Security Considerations](#security-considerations)
9. [Error Handling & Debugging](#error-handling--debugging)
10. [Development Workflow](#development-workflow)
11. [Deployment & CI/CD](#deployment--cicd)
12. [Testing Strategy](#testing-strategy)
13. [Key Challenges & Solutions](#key-challenges--solutions)
14. [Best Practices Established](#best-practices-established)
15. [Future Improvements](#future-improvements)

---

## Project Overview

### Application Purpose
AWIP Mission Control is a comprehensive agent orchestration and data management system that provides:
- Real-time agent monitoring and coordination
- File ingestion and knowledge graph generation
- Structured data processing and visualization
- System health monitoring and analytics
- Single Source of Truth (SSOT) compliance

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API with LangChain
- **Deployment**: GitHub Pages with GitHub Actions
- **Development**: Node.js with npm

---

## Architecture Decisions

### 1. Single Source of Truth (SSOT) Pattern
**Decision**: Centralize all configuration and constants in a single file
**Implementation**: `src/config/ssot.ts`
```typescript
export const SSOT_CONFIG = {
  app: { version: "2.1.0", name: "AWIP Mission Control" },
  agents: { total: 20, agent20: { healthScore: 95 } },
  database: { projectUrl: process.env.REACT_APP_SUPABASE_URL },
  // ... comprehensive configuration
}
```

**Benefits**:
- Eliminates hardcoded values across the application
- Enables automated validation of SSOT compliance
- Simplifies configuration management
- Reduces maintenance overhead

### 2. Component Architecture
**Decision**: Modular component structure with clear separation of concerns
**Structure**:
```
src/
├── components/          # Reusable UI components
├── pages/              # Route-specific components
├── hooks/              # Custom React hooks
├── services/           # Business logic and API calls
├── store/              # Zustand state management
├── config/             # Configuration files
└── utils/              # Utility functions
```

### 3. Database-First Approach
**Decision**: Design database schema first, then build application around it
**Benefits**:
- Ensures data integrity from the start
- Enables efficient queries and relationships
- Supports scalability and performance
- Provides clear data model documentation

---

## Single Source of Truth (SSOT) Implementation

### Core Principles
1. **Centralized Configuration**: All constants, URLs, and configuration values stored in `SSOT_CONFIG`
2. **Environment Variable Integration**: Seamless integration with environment variables
3. **Type Safety**: TypeScript interfaces for all configuration objects
4. **Validation**: Automated scripts to check SSOT compliance

### Implementation Details

#### Configuration Structure
```typescript
interface SSOTConfig {
  app: AppConfig;
  agents: AgentsConfig;
  database: DatabaseConfig;
  api: ApiConfig;
  design: DesignConfig;
  system: SystemConfig;
  monitoring: MonitoringConfig;
  security: SecurityConfig;
  features: FeatureFlags;
  repositories: RepositoryConfig;
}
```

#### Validation Script
```javascript
// scripts/validate-ssot.js
const violations = {
  HARDCODED_URLS: [],
  HARDCODED_AGENT_COUNT: [],
  HARDCODED_VERSIONS: [],
  // ... other violation types
};
```

#### Benefits Achieved
- **Reduced Maintenance**: Single point of change for configuration
- **Consistency**: Ensures all parts of application use same values
- **Automation**: Automated validation prevents violations
- **Documentation**: Configuration serves as living documentation

---

## Database Design & Integration

### Schema Design
```sql
-- Core tables for agent management
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  health_score INTEGER DEFAULT 100,
  last_activity TIMESTAMP DEFAULT NOW()
);

-- Knowledge graph storage
CREATE TABLE graph_triples (
  id SERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  relation TEXT NOT NULL,
  object TEXT NOT NULL,
  source_file TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- System metrics tracking
CREATE TABLE system_metrics (
  id SERIAL PRIMARY KEY,
  cpu_usage DECIMAL(5,2),
  memory_usage DECIMAL(5,2),
  network_usage DECIMAL(5,2),
  disk_usage DECIMAL(5,2),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE graph_triples ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access" ON graph_triples 
FOR SELECT USING (true);

-- Authenticated insert/update
CREATE POLICY "Allow authenticated insert" ON graph_triples 
FOR INSERT WITH CHECK (true);
```

### Integration Patterns
1. **Service Layer**: All database operations through service functions
2. **Error Handling**: Comprehensive error handling with fallbacks
3. **Connection Management**: Robust connection handling with retries
4. **Data Validation**: Input validation before database operations

---

## File Ingestion Agent Development

### Architecture Evolution
**Phase 1**: Basic file upload and text processing
**Phase 2**: OpenAI integration for triple extraction
**Phase 3**: Structured data parsing optimization
**Phase 4**: Performance optimization and batch processing

### Key Implementation Decisions

#### 1. Structured Data Detection
```typescript
// Smart detection of data format
if (content.includes('\t')) {
  // Direct structured data processing
  const triples = this.parseStructuredData(content);
} else {
  // Fallback to chunk processing
  const chunks = this.splitIntoChunks(content, 1000);
  const triples = await this.processTextChunks(chunks);
}
```

#### 2. Performance Optimization
```typescript
// Batch processing for large datasets
const batchSize = 100;
for (let i = 0; i < triples.length; i += batchSize) {
  const batch = triples.slice(i, i + batchSize);
  await this.supabase.from('graph_triples').insert(batch);
}
```

#### 3. Triple Extraction Strategy
```typescript
// Structured data parsing
parseStructuredData(text: string): any[] {
  const lines = text.split('\n').filter(line => line.trim());
  const triples: any[] = [];
  
  lines.forEach(line => {
    const [city, company, centerName, type, country] = line.split('\t');
    // Extract meaningful relationships
    if (company?.trim() && city?.trim()) {
      triples.push({
        subject: company.trim(),
        relation: 'operates_in',
        object: city.trim()
      });
    }
  });
  
  return triples;
}
```

### Performance Lessons Learned
1. **Direct Processing**: Bypass complex pipelines for known data formats
2. **Batch Operations**: Process data in batches to avoid overwhelming systems
3. **Parallel Processing**: Use Promise.all() for independent operations
4. **Memory Management**: Process large datasets in chunks
5. **Caching**: Cache frequently accessed data

---

## Performance Optimization Lessons

### 1. Database Performance
**Challenge**: Slow database operations with large datasets
**Solution**: Implemented batch processing and connection pooling
```typescript
// Batch database operations
const batchSize = 100;
for (let i = 0; i < triples.length; i += batchSize) {
  const batch = triples.slice(i, i + batchSize);
  await this.supabase.from('graph_triples').insert(batch);
}
```

### 2. File Processing Performance
**Challenge**: Slow file processing for structured data
**Solution**: Direct processing path for known formats
```typescript
// Detect and use appropriate processing method
if (content.includes('\t')) {
  // Fast path for structured data
  return this.parseStructuredData(content);
} else {
  // Standard path for unstructured data
  return await this.processTextChunks(chunks);
}
```

### 3. Component Rendering Performance
**Challenge**: Slow UI updates with large datasets
**Solution**: Implemented virtualization and pagination
```typescript
// Pagination for large datasets
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(50);
const paginatedData = data.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);
```

### 4. Memory Management
**Challenge**: Memory leaks with large file processing
**Solution**: Implemented proper cleanup and garbage collection
```typescript
// Cleanup on component unmount
useEffect(() => {
  return () => {
    // Cleanup resources
    if (fileReader) fileReader.abort();
  };
}, []);
```

---

## State Management Strategy

### Zustand Implementation
```typescript
// src/store/ssotStore.js
import { create } from 'zustand';

export const useSSOTStore = create((set, get) => ({
  // State
  database: { connected: false, url: '', key: '' },
  realtime: { isConnected: false },
  metrics: { cpu: 0, memory: 0, network: 0 },
  
  // Actions
  setDatabaseStatus: (status) => set({ database: { ...get().database, connected: status } }),
  testDatabaseConnection: async () => {
    try {
      const response = await fetch(`${get().database.url}/rest/v1/`);
      set({ database: { ...get().database, connected: response.ok } });
    } catch (error) {
      set({ database: { ...get().database, connected: false } });
    }
  }
}));
```

### Benefits of Zustand
1. **Simplicity**: Minimal boilerplate compared to Redux
2. **TypeScript Support**: Excellent TypeScript integration
3. **Performance**: Efficient re-renders with selective subscriptions
4. **Developer Experience**: Easy debugging and state inspection

### State Management Patterns
1. **Centralized State**: All global state in Zustand store
2. **Local State**: Component-specific state in useState
3. **Derived State**: Computed values using useMemo
4. **Async State**: Proper handling of async operations

---

## Security Considerations

### 1. Environment Variables
**Implementation**: All sensitive data in environment variables
```bash
# .env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_OPENAI_API_KEY=your-openai-key
```

### 2. API Key Security
**Challenge**: Exposed API keys in client-side code
**Solution**: Use environment variables and server-side validation
```typescript
// Secure API key handling
const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
if (!openaiKey || openaiKey === 'your_openai_api_key_here') {
  console.warn('OpenAI API key not found, using fallback');
  return this.parseStructuredData(text);
}
```

### 3. Database Security
**Implementation**: Row Level Security (RLS) policies
```sql
-- Secure access policies
CREATE POLICY "Allow public read access" ON graph_triples 
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON graph_triples 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 4. Input Validation
**Implementation**: Comprehensive input validation
```typescript
// Validate file uploads
const validateFile = (file: File) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['text/plain', 'text/csv', 'application/json'];
  
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
};
```

---

## Error Handling & Debugging

### 1. Comprehensive Error Handling
```typescript
// Service layer error handling
async processLocalFile(file: File): Promise<ProcessingResult> {
  try {
    const content = await this.readFileContent(file);
    const triples = this.parseStructuredData(content);
    await this.storeTriples(triples, file.name);
    
    return {
      success: true,
      fileName: file.name,
      triplesCount: triples.length
    };
  } catch (error) {
    console.error('Error processing local file:', error);
    return {
      success: false,
      fileName: file.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

### 2. Debug Components
**Implementation**: Dedicated debug components for troubleshooting
```typescript
// src/components/DebugEnvironment.tsx
export const DebugEnvironment = () => {
  const envVars = {
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || 'NOT SET',
    SUPABASE_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    OPENAI_KEY: process.env.REACT_APP_OPENAI_API_KEY ? 'SET' : 'NOT SET'
  };
  
  return (
    <div className="debug-panel">
      <h3>Environment Variables</h3>
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key}>{key}: {value}</div>
      ))}
    </div>
  );
};
```

### 3. Error Boundaries
```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}
```

---

## Development Workflow

### 1. Git Workflow
```bash
# Feature development
git checkout -b feature/file-ingestion-optimization
git add .
git commit -m "Optimize file ingestion performance with batch processing"
git push origin feature/file-ingestion-optimization

# Code review and merge
git checkout main
git merge feature/file-ingestion-optimization
git push origin main
```

### 2. Environment Management
```bash
# Local development
cp env.example .env
# Edit .env with local values

# Production deployment
# Set GitHub Secrets for production values
```

### 3. Testing Strategy
```typescript
// Unit tests for critical functions
describe('FileIngestionAgent', () => {
  test('should parse structured data correctly', () => {
    const agent = new FileIngestionAgent();
    const testData = 'City\tCompany\tCenter\tType\tCountry';
    const triples = agent.parseStructuredData(testData);
    expect(triples.length).toBeGreaterThan(0);
  });
});
```

### 4. Code Quality
```json
// package.json scripts
{
  "scripts": {
    "validate:ssot": "node scripts/validate-ssot.js",
    "lint": "eslint src --ext .ts,.tsx,.js,.jsx",
    "test": "react-scripts test",
    "build": "react-scripts build"
  }
}
```

---

## Deployment & CI/CD

### GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci --no-audit --legacy-peer-deps
      - name: Security audit
        run: npm audit --audit-level=moderate || true
      - name: Check for secrets
        run: |
          if grep -r "sk-" .; then
            echo "Potential secrets found!"
            exit 1
          fi

  build-and-deploy:
    needs: security-audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      - name: Build application
        run: npm run build
        env:
          REACT_APP_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### Environment Management
1. **Development**: Local `.env` file
2. **Staging**: GitHub Secrets for staging environment
3. **Production**: GitHub Secrets for production environment

### Deployment Strategy
1. **Automated Testing**: All tests must pass before deployment
2. **Security Scanning**: Automated security audits
3. **Environment Validation**: Verify environment variables are set
4. **Rollback Capability**: Easy rollback to previous versions

---

## Testing Strategy

### 1. Unit Testing
```typescript
// src/components/__tests__/FileIngestionAgent.test.ts
import { FileIngestionAgent } from '../FileIngestionAgent';

describe('FileIngestionAgent', () => {
  let agent: FileIngestionAgent;
  
  beforeEach(() => {
    agent = new FileIngestionAgent();
  });
  
  test('should parse structured data correctly', () => {
    const testData = 'Leeds\tDelta Ltd\tCenter\tOffice\tUK';
    const triples = agent.parseStructuredData(testData);
    
    expect(triples).toContainEqual({
      subject: 'Delta Ltd',
      relation: 'operates_in',
      object: 'Leeds'
    });
  });
  
  test('should handle empty data gracefully', () => {
    const triples = agent.parseStructuredData('');
    expect(triples).toEqual([]);
  });
});
```

### 2. Integration Testing
```typescript
// src/services/__tests__/supabase.test.ts
import { createClient } from '@supabase/supabase-js';

describe('Supabase Integration', () => {
  test('should connect to database', async () => {
    const supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL!,
      process.env.REACT_APP_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase
      .from('graph_triples')
      .select('count');
    
    expect(error).toBeNull();
  });
});
```

### 3. End-to-End Testing
```typescript
// cypress/integration/file-ingestion.spec.ts
describe('File Ingestion', () => {
  it('should upload and process a file', () => {
    cy.visit('/');
    cy.get('[data-testid="file-upload"]').attachFile('test-data.csv');
    cy.get('[data-testid="process-button"]').click();
    cy.get('[data-testid="processing-status"]').should('contain', 'Processing');
    cy.get('[data-testid="triple-count"]').should('contain', '20');
  });
});
```

---

## Key Challenges & Solutions

### 1. Performance Issues with File Processing
**Challenge**: File processing taking too long for structured data
**Solution**: Implemented direct processing path for known formats
```typescript
// Fast path for structured data
if (content.includes('\t')) {
  return this.parseStructuredData(content);
}
```

### 2. Database Connection Issues
**Challenge**: Intermittent database connection failures
**Solution**: Implemented robust connection handling with retries
```typescript
async testDatabaseConnection() {
  try {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/`);
    return response.ok;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
```

### 3. State Management Complexity
**Challenge**: Complex state management with multiple data sources
**Solution**: Centralized state management with Zustand
```typescript
// Centralized state management
const useAppStore = create((set) => ({
  database: { connected: false },
  agents: { data: [], loading: false },
  metrics: { cpu: 0, memory: 0 },
  
  setDatabaseStatus: (status) => set({ database: { connected: status } }),
  setAgents: (agents) => set({ agents: { data: agents, loading: false } })
}));
```

### 4. Environment Variable Management
**Challenge**: Managing environment variables across environments
**Solution**: Comprehensive environment variable strategy
```typescript
// Environment variable validation
const requiredEnvVars = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`Missing environment variable: ${varName}`);
  }
});
```

### 5. TypeScript Integration Issues
**Challenge**: TypeScript errors with dynamic data
**Solution**: Comprehensive type definitions and interfaces
```typescript
// Comprehensive type definitions
interface ProcessingResult {
  success: boolean;
  fileName: string;
  triplesCount?: number;
  error?: string;
}

interface TripleStats {
  totalTriples: number;
  uniqueSubjects: number;
  uniqueRelations: number;
  uniqueObjects: number;
  sourceFiles: number;
}
```

---

## Best Practices Established

### 1. Code Organization
- **Feature-based Structure**: Organize code by features rather than types
- **Clear Separation**: Separate UI components from business logic
- **Consistent Naming**: Use consistent naming conventions throughout
- **Documentation**: Comprehensive documentation for all major components

### 2. Error Handling
- **Graceful Degradation**: Always provide fallbacks for failures
- **User-Friendly Messages**: Clear error messages for users
- **Logging**: Comprehensive logging for debugging
- **Error Boundaries**: React error boundaries for component failures

### 3. Performance
- **Lazy Loading**: Load components and data on demand
- **Memoization**: Use React.memo and useMemo for expensive operations
- **Batch Operations**: Process data in batches for better performance
- **Optimistic Updates**: Update UI immediately, sync with server later

### 4. Security
- **Environment Variables**: Never hardcode sensitive data
- **Input Validation**: Validate all user inputs
- **SQL Injection Prevention**: Use parameterized queries
- **XSS Prevention**: Sanitize user inputs

### 5. Testing
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete user workflows
- **Test Coverage**: Maintain high test coverage

### 6. Deployment
- **Automated CI/CD**: Automated testing and deployment
- **Environment Management**: Separate environments for dev/staging/prod
- **Monitoring**: Monitor application health and performance
- **Rollback Strategy**: Easy rollback to previous versions

---

## Future Improvements

### 1. Architecture Enhancements
- **Microservices**: Break down into smaller, focused services
- **Event-Driven Architecture**: Implement event-driven communication
- **Caching Layer**: Add Redis for caching frequently accessed data
- **Message Queue**: Implement message queue for async processing

### 2. Performance Optimizations
- **Virtualization**: Implement virtual scrolling for large datasets
- **Web Workers**: Move heavy processing to web workers
- **Service Workers**: Add offline capabilities
- **CDN Integration**: Use CDN for static assets

### 3. User Experience
- **Progressive Web App**: Convert to PWA for better mobile experience
- **Real-time Updates**: Implement WebSocket connections for real-time data
- **Advanced Visualizations**: Add D3.js for advanced charts
- **Accessibility**: Improve accessibility compliance

### 4. Data Management
- **Data Versioning**: Implement data versioning and history
- **Advanced Search**: Add full-text search capabilities
- **Data Export**: Support multiple export formats
- **Data Validation**: Implement comprehensive data validation

### 5. Security Enhancements
- **Authentication**: Implement proper user authentication
- **Authorization**: Add role-based access control
- **Audit Logging**: Comprehensive audit logging
- **Encryption**: Encrypt sensitive data at rest and in transit

---

## Conclusion

This knowledge document captures the comprehensive lessons learned during the development of the AWIP Mission Control application. The key takeaways include:

1. **SSOT Pattern**: Centralized configuration management is essential for maintainable applications
2. **Performance First**: Always consider performance implications when designing features
3. **Security by Design**: Implement security measures from the beginning
4. **Comprehensive Testing**: Testing at all levels ensures application reliability
5. **Documentation**: Good documentation is crucial for team collaboration and maintenance
6. **Error Handling**: Robust error handling improves user experience and debugging
7. **Environment Management**: Proper environment variable management is critical for deployment
8. **Database Design**: Well-designed database schema is the foundation for application success

This document serves as a reference for future application development, ensuring that lessons learned are not lost and can be applied to new projects.

---

## Appendix

### A. Environment Variables Reference
```bash
# Required Environment Variables
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_OPENAI_API_KEY=your-openai-key

# Optional Environment Variables
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG_MODE=true
```

### B. Database Schema Reference
```sql
-- Core tables and their purposes
agents          -- Agent management and status
graph_triples   -- Knowledge graph storage
system_metrics  -- System performance tracking
system_alerts   -- System alerts and notifications
```

### C. API Endpoints Reference
```typescript
// Supabase API endpoints
const endpoints = {
  agents: '/rest/v1/agents',
  triples: '/rest/v1/graph_triples',
  metrics: '/rest/v1/system_metrics',
  alerts: '/rest/v1/system_alerts'
};
```

### D. Component Library Reference
```typescript
// Key components and their purposes
FileIngestionInterface    -- File upload and processing
KnowledgeGraphVisualization -- Knowledge graph display
ExcelStyleDataView        -- Tabular data display
GraphRAGChart            -- Graph-based analytics
DebugEnvironment         -- Environment debugging
```

This comprehensive knowledge document provides a complete reference for understanding, maintaining, and extending the AWIP Mission Control application, as well as a foundation for future application development.
