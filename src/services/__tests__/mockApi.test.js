import { mockApi } from '../mockApi';

describe('mockApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getSystemStatus returns system status data', async () => {
    const result = await mockApi.getSystemStatus();
    
    expect(result).toEqual({
      database: true,
      github: true,
      agent20: true
    });
  });

  test('getAgentStatus returns agent status data', async () => {
    const result = await mockApi.getAgentStatus();
    
    expect(result).toEqual({
      healthScore: 9.9,
      status: 'operational'
    });
  });

  test('getSystemMetrics returns system metrics data', async () => {
    const result = await mockApi.getSystemMetrics();
    
    expect(result).toEqual({
      cpu: 45,
      memory: 60,
      network: 28,
      disk: 35
    });
  });

  test('getSystemHealth returns system health data', async () => {
    const result = await mockApi.getSystemHealth();
    
    expect(result).toHaveProperty('overall');
    expect(result).toHaveProperty('cpu');
    expect(result).toHaveProperty('memory');
    expect(result).toHaveProperty('network');
    expect(result).toHaveProperty('disk');
    expect(result).toHaveProperty('alerts');
    expect(Array.isArray(result.alerts)).toBe(true);
  });

  test('getAgents returns agents array', async () => {
    const result = await mockApi.getAgents();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('domain');
    expect(result[0]).toHaveProperty('status');
  });

  test('sendChatMessage returns response with timestamp', async () => {
    const message = 'Test message';
    const result = await mockApi.sendChatMessage(message);
    
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('timestamp');
    expect(result.response).toContain(message);
  });

  test('all methods have simulated delay', async () => {
    const startTime = Date.now();
    
    await mockApi.getSystemStatus();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should have at least 300ms delay (500ms for getSystemStatus)
    expect(duration).toBeGreaterThanOrEqual(300);
  });
});
