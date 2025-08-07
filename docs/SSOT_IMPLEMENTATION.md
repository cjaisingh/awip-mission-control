# AWIP Mission Control - Single Source of Truth (SSOT) Implementation

## Overview

This document outlines the Single Source of Truth (SSOT) implementation for the AWIP Mission Control system. The SSOT principle ensures that all configuration data, constants, and system parameters are maintained in a single, authoritative location to prevent inconsistencies and reduce maintenance overhead.

## SSOT Architecture

### 1. Central Configuration (`src/config/ssot.ts`)

The primary SSOT configuration file contains all system constants and configurations:

```typescript
export const SSOT_CONFIG = {
  app: {
    name: 'AWIP Mission Control',
    version: SSOT_CONFIG.app.version,
    // ... other app metadata
  },
  agents: {
    total: 20,
    active: 20,
    // ... agent configurations
  },
  design: {
    colors: { /* color system */ },
    gradients: { /* gradient definitions */ },
    fonts: { /* typography */ }
  },
  api: {
    baseUrl: string,
    endpoints: { /* API endpoints */ },
    timeout: number,
    retryAttempts: number
  },
  // ... other configurations
}
```

### 2. CSS Variables (`src/styles/ssot-variables.css`)

Centralized CSS variables for design tokens:

```css
:root {
  --awip-version: SSOT_CONFIG.app.version;
  --awip-primary-500: var(--awip-primary-500);
  --cognitive-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --awip-agent-total: 20;
  /* ... other design tokens */
}
```

### 3. State Management (`src/store/ssotStore.js`)

Zustand-based state management that sources from SSOT:

```javascript
import { SSOT_CONFIG } from '../config/ssot';

export const useSSOTStore = create(
  subscribeWithSelector((set, get) => ({
    system: {
      version: SSOT_CONFIG.app.version,
      // ... other system state
    },
    agents: {
      totalCount: SSOT_CONFIG.agents.total,
      // ... other agent state
    }
  }))
);
```

### 4. API Service (`src/services/apiService.ts`)

Centralized API service using SSOT endpoints:

```typescript
import { SSOT_CONFIG } from '../config/ssot';

class ApiService {
  constructor() {
    this.baseUrl = SSOT_CONFIG.api.baseUrl;
    this.timeout = SSOT_CONFIG.api.timeout;
    this.retryAttempts = SSOT_CONFIG.api.retryAttempts;
  }
  
  async getAgents(): Promise<ApiResponse<any[]>> {
    return this.requestWithRetry(SSOT_CONFIG.api.endpoints.agents);
  }
  // ... other API methods
}
```

## SSOT Compliance Rules

### 1. Version Management
- **Single Source**: Version is defined only in `SSOT_CONFIG.app.version`
- **Usage**: All components must import from SSOT config
- **Forbidden**: Hardcoding version numbers in individual files

### 2. Agent Configuration
- **Single Source**: Agent count and configuration in `SSOT_CONFIG.agents`
- **Usage**: Import agent constants from SSOT
- **Forbidden**: Defining agent counts in multiple files

### 3. Design System
- **Single Source**: Colors and gradients in `SSOT_CONFIG.design`
- **CSS Variables**: Use centralized CSS variables for styling
- **Forbidden**: Duplicating color definitions across files

### 4. API Endpoints
- **Single Source**: Endpoints defined in `SSOT_CONFIG.api.endpoints`
- **Usage**: Use centralized API service
- **Forbidden**: Defining endpoints in multiple locations

### 5. System Constants
- **Single Source**: Intervals, thresholds, and limits in SSOT config
- **Usage**: Import constants from SSOT
- **Forbidden**: Scattered constant definitions

## Migration Guide

### Before (Non-SSOT Compliant)
```javascript
// Multiple files with duplicate configurations
const version = SSOT_CONFIG.app.version; // ✅ From SSOT
const agentCount = SSOT_CONFIG.agents.total; // ✅ From SSOT
const gradient = SSOT_CONFIG.design.colors.gradients.cognitive; // ✅ From SSOT
```

### After (SSOT Compliant)
```javascript
import { SSOT_CONFIG, getVersion, getAgentCount, getCognitiveGradient } from '../config/ssot';

const version = getVersion(); // ✅ From SSOT
const agentCount = getAgentCount(); // ✅ From SSOT
const gradient = getCognitiveGradient(); // ✅ From SSOT
```

## Maintenance Guidelines

### 1. Adding New Configuration
1. Add to `src/config/ssot.ts`
2. Create utility functions if needed
3. Update TypeScript interfaces
4. Document in this file

### 2. Updating Existing Configuration
1. Change only in `src/config/ssot.ts`
2. Update all dependent files to use SSOT
3. Remove duplicate definitions
4. Test all affected components

### 3. Version Updates
1. Update `SSOT_CONFIG.app.version`
2. Update `package.json` version
3. Update CSS variable `--awip-version`
4. Update documentation files

### 4. Agent Configuration Changes
1. Update `SSOT_CONFIG.agents`
2. Update mock data in `mockApi.js`
3. Update agent HTML files if needed
4. Update documentation

## Validation Scripts

### SSOT Compliance Check
```bash
# Check for hardcoded versions
grep -r "2\.1\.0" src/ --exclude-dir=node_modules | grep -v "ssot"

# Check for hardcoded agent counts
grep -r "total.*20\|active.*20" src/ --exclude-dir=node_modules | grep -v "ssot"

# Check for duplicate gradients
grep -r "linear-gradient.*135deg" src/ --exclude-dir=node_modules | grep -v "ssot-variables"
```

### Automated Validation
```javascript
// Add to package.json scripts
"validate:ssot": "node scripts/validate-ssot.js"
```

## Benefits of SSOT Implementation

### 1. Consistency
- Single source for all configuration
- Eliminates duplicate definitions
- Ensures data consistency across components

### 2. Maintainability
- Changes made in one place
- Reduced risk of inconsistencies
- Easier to track and manage updates

### 3. Type Safety
- TypeScript interfaces for all configurations
- Compile-time validation
- Better IDE support

### 4. Performance
- Centralized caching
- Reduced bundle size
- Optimized imports

### 5. Developer Experience
- Clear documentation
- Easy to find configurations
- Consistent patterns

## Troubleshooting

### Common Issues

1. **Import Errors**
   ```bash
   # Ensure proper import path
   import { SSOT_CONFIG } from '../config/ssot';
   ```

2. **TypeScript Errors**
   ```bash
   # Check interface definitions
   import { SSOTConfig } from '../config/ssot';
   ```

3. **CSS Variable Issues**
   ```css
   /* Ensure CSS file is imported */
   @import './styles/ssot-variables.css';
   ```

### Debugging SSOT Issues

1. Check SSOT configuration:
   ```javascript
   console.log('SSOT Config:', SSOT_CONFIG);
   ```

2. Validate imports:
   ```javascript
   import { getVersion } from '../config/ssot';
   console.log('Version:', getVersion());
   ```

3. Check CSS variables:
   ```javascript
   console.log('CSS Variables:', getComputedStyle(document.documentElement));
   ```

## Future Enhancements

### 1. Environment-Specific Configurations
```typescript
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV;
  return SSOT_CONFIG.environments[env] || SSOT_CONFIG.environments.default;
};
```

### 2. Dynamic Configuration Loading
```typescript
export const loadSSOTConfig = async () => {
  const response = await fetch('/api/config');
  return response.json();
};
```

### 3. Configuration Validation
```typescript
export const validateSSOTConfig = (config: SSOTConfig): boolean => {
  // Add validation logic
  return true;
};
```

## Conclusion

The SSOT implementation provides a robust foundation for maintaining consistency across the AWIP Mission Control system. By following these guidelines and using the centralized configuration, developers can ensure that all system parameters are managed from a single source of truth, reducing maintenance overhead and improving system reliability.

For questions or issues with the SSOT implementation, refer to this documentation or contact the development team.
