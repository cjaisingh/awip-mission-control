#!/usr/bin/env node

/**
 * SSOT Validation Script
 * Checks for Single Source of Truth compliance across the codebase
 */

const fs = require('fs');
const path = require('path');

// SSOT Configuration constants
const SSOT_CONSTANTS = {
  VERSION: 'SSOT_CONFIG.app.version',
  AGENT_TOTAL: 'SSOT_CONFIG.agents.total',
  AGENT_ACTIVE: 'SSOT_CONFIG.agents.active',
  COGNITIVE_GRADIENT: 'var(--cognitive-gradient)',
  PRIMARY_COLOR: 'var(--awip-primary-500)'
};

// Files to exclude from validation
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'build',
  'dist',
  'coverage',
  'ssot.ts',
  'ssot-variables.css',
  'ssotStore.js',
  'apiService.ts',
  'package-lock.json'
];

// Violations found
const violations = [];

/**
 * Check if a file should be excluded from validation
 */
function shouldExcludeFile(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => filePath.includes(pattern));
}

/**
 * Check for hardcoded version numbers
 */
function checkVersionViolations(content, filePath) {
  const versionPattern = /['"]2\.1\.0['"]/g;
  const matches = content.match(versionPattern);
  
  if (matches) {
    violations.push({
      type: 'HARDCODED_VERSION',
      file: filePath,
      line: content.split('\n').findIndex(line => line.includes('2.1.0')) + 1,
      message: `Hardcoded version found. Use SSOT_CONFIG.app.version instead.`
    });
  }
}

/**
 * Check for hardcoded agent counts
 */
function checkAgentCountViolations(content, filePath) {
  const agentPatterns = [
    /total.*20[^0-9]/,
    /active.*20[^0-9]/,
    /agents.*20[^0-9]/,
    /count.*20[^0-9]/,
    /20.*agents/,
    /20.*total/,
    /20.*active/
  ];
  
  agentPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      violations.push({
        type: 'HARDCODED_AGENT_COUNT',
        file: filePath,
        line: content.split('\n').findIndex(line => pattern.test(line)) + 1,
        message: `Hardcoded agent count found. Use SSOT_CONFIG.agents.total instead.`
      });
    }
  });
}

/**
 * Check for duplicate gradient definitions
 */
function checkGradientViolations(content, filePath) {
  const gradientPattern = /linear-gradient\(135deg, #667eea 0%, #764ba2 100%\)/g;
  const matches = content.match(gradientPattern);
  
  if (matches) {
    violations.push({
      type: 'DUPLICATE_GRADIENT',
      file: filePath,
      line: content.split('\n').findIndex(line => gradientPattern.test(line)) + 1,
      message: `Duplicate gradient definition found. Use CSS variable --cognitive-gradient instead.`
    });
  }
}

/**
 * Check for hardcoded primary colors
 */
function checkColorViolations(content, filePath) {
  const colorPattern = /#0ea5e9/g;
  const matches = content.match(colorPattern);
  
  if (matches) {
    violations.push({
      type: 'HARDCODED_COLOR',
      file: filePath,
      line: content.split('\n').findIndex(line => colorPattern.test(line)) + 1,
      message: `Hardcoded primary color found. Use CSS variable --awip-primary-500 instead.`
    });
  }
}

/**
 * Check for hardcoded API endpoints
 */
function checkApiEndpointViolations(content, filePath) {
  const endpointPatterns = [
    /\/api\/agents/,
    /\/api\/metrics/,
    /\/api\/logs/,
    /\/api\/system/
  ];
  
  endpointPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      violations.push({
        type: 'HARDCODED_API_ENDPOINT',
        file: filePath,
        line: content.split('\n').findIndex(line => pattern.test(line)) + 1,
        message: `Hardcoded API endpoint found. Use SSOT_CONFIG.api.endpoints instead.`
      });
    }
  });
}

/**
 * Check for hardcoded intervals and timeouts
 */
function checkIntervalViolations(content, filePath) {
  const intervalPatterns = [
    /30000/, // refresh interval
    /15000/, // health check interval
    /10000/, // timeout
    /5000/   // metrics interval
  ];
  
  intervalPatterns.forEach(pattern => {
    const matches = content.match(new RegExp(`\\b${pattern}\\b`, 'g'));
    if (matches) {
      violations.push({
        type: 'HARDCODED_INTERVAL',
        file: filePath,
        line: content.split('\n').findIndex(line => new RegExp(`\\b${pattern}\\b`).test(line)) + 1,
        message: `Hardcoded interval found. Use SSOT_CONFIG.system or SSOT_CONFIG.monitoring instead.`
      });
    }
  });
}

/**
 * Validate a single file
 */
function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    checkVersionViolations(content, filePath);
    checkAgentCountViolations(content, filePath);
    checkGradientViolations(content, filePath);
    checkColorViolations(content, filePath);
    checkApiEndpointViolations(content, filePath);
    checkIntervalViolations(content, filePath);
    
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
  }
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!shouldExcludeFile(filePath)) {
        scanDirectory(filePath);
      }
    } else {
      if (!shouldExcludeFile(filePath)) {
        validateFile(filePath);
      }
    }
  });
}

/**
 * Generate validation report
 */
function generateReport() {
  console.log('\n🔍 SSOT Validation Report');
  console.log('========================\n');
  
  if (violations.length === 0) {
    console.log('✅ No SSOT violations found!');
    console.log('🎉 The codebase is fully compliant with Single Source of Truth principles.');
  } else {
    console.log(`❌ Found ${violations.length} SSOT violations:\n`);
    
    // Group violations by type
    const groupedViolations = violations.reduce((acc, violation) => {
      if (!acc[violation.type]) {
        acc[violation.type] = [];
      }
      acc[violation.type].push(violation);
      return acc;
    }, {});
    
    Object.entries(groupedViolations).forEach(([type, typeViolations]) => {
      console.log(`📋 ${type} (${typeViolations.length} violations):`);
      typeViolations.forEach(violation => {
        console.log(`   📄 ${violation.file}:${violation.line} - ${violation.message}`);
      });
      console.log('');
    });
    
    console.log('💡 Recommendations:');
    console.log('   • Use SSOT_CONFIG for all configuration values');
    console.log('   • Import from centralized configuration files');
    console.log('   • Use CSS variables for design tokens');
    console.log('   • Follow the SSOT implementation guide');
  }
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 Starting SSOT validation...');
  
  const rootDir = process.cwd();
  scanDirectory(rootDir);
  
  generateReport();
  
  // Exit with error code if violations found
  if (violations.length > 0) {
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  validateFile,
  scanDirectory,
  generateReport,
  violations
};
