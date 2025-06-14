// AWIP Mission Control - Test Suite
/**
 * @jest-environment jsdom
 */

describe('AWIP Mission Control Dashboard', () => {
  test('Dashboard configuration is valid', () => {
    expect(typeof window).toBe('object');
    expect(document).toBeDefined();
  });

  test('No hardcoded credentials in package.json', () => {
    const packageJson = require('../package.json');
    const packageString = JSON.stringify(packageJson);

    expect(packageString).not.toMatch(/ghp_/);
    expect(packageString).not.toMatch(/sk-/);
    expect(packageString).not.toMatch(/eyJ/);
    expect(packageString).not.toMatch(/password/i);
    expect(packageString).not.toMatch(/secret/i);
  });

  test('Required dependencies are present', () => {
    const packageJson = require('../package.json');
    expect(packageJson.dependencies).toHaveProperty('chart.js');
    expect(packageJson.dependencies).toHaveProperty('d3');
    expect(packageJson.dependencies).toHaveProperty('sortablejs');
  });

  test('Dashboard version validation', () => {
    const packageJson = require('../package.json');
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(packageJson.name).toBe('awip-mission-control');
  });
});
