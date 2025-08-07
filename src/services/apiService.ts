import { SSOT_CONFIG } from '../config/ssot';

// Centralized API Service - SSOT Compliant
// This service uses the single source of truth for all API configurations

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  status: number;
  timestamp: string;
}

class ApiService {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;

  constructor() {
    this.baseUrl = SSOT_CONFIG.api.baseUrl;
    this.timeout = SSOT_CONFIG.api.timeout;
    this.retryAttempts = SSOT_CONFIG.api.retryAttempts;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    let lastError: Error;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        return await this.request<T>(endpoint, options);
      } catch (error) {
        lastError = error as Error;
        if (attempt === this.retryAttempts) {
          break;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw lastError!;
  }

  // Agent endpoints
  async getAgents(): Promise<ApiResponse<any[]>> {
    return this.requestWithRetry(SSOT_CONFIG.api.endpoints.agents);
  }

  async getAgentStatus(agentId?: string): Promise<ApiResponse<any>> {
    const endpoint = agentId 
      ? `${SSOT_CONFIG.api.endpoints.agents}/${agentId}/status`
      : `${SSOT_CONFIG.api.endpoints.agents}/status`;
    return this.requestWithRetry(endpoint);
  }

  async updateAgentStatus(agentId: string, status: any): Promise<ApiResponse<any>> {
    return this.requestWithRetry(`${SSOT_CONFIG.api.endpoints.agents}/${agentId}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
  }

  // Metrics endpoints
  async getMetrics(): Promise<ApiResponse<any>> {
    return this.requestWithRetry(SSOT_CONFIG.api.endpoints.metrics);
  }

  async getSystemMetrics(): Promise<ApiResponse<any>> {
    return this.requestWithRetry(`${SSOT_CONFIG.api.endpoints.metrics}/system`);
  }

  // Logs endpoints
  async getLogs(limit?: number): Promise<ApiResponse<any[]>> {
    const params = limit ? `?limit=${limit}` : '';
    return this.requestWithRetry(`${SSOT_CONFIG.api.endpoints.logs}${params}`);
  }

  async addLogEntry(entry: any): Promise<ApiResponse<any>> {
    return this.requestWithRetry(SSOT_CONFIG.api.endpoints.logs, {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  // System endpoints
  async getSystemStatus(): Promise<ApiResponse<any>> {
    return this.requestWithRetry(SSOT_CONFIG.api.endpoints.system);
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    return this.requestWithRetry(SSOT_CONFIG.api.endpoints.health);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.request(SSOT_CONFIG.api.endpoints.health);
      return true;
    } catch {
      return false;
    }
  }

  // Utility methods
  getBaseUrl(): string {
    return this.baseUrl;
  }

  getEndpoints(): Record<string, string> {
    return SSOT_CONFIG.api.endpoints;
  }

  getTimeout(): number {
    return this.timeout;
  }

  getRetryAttempts(): number {
    return this.retryAttempts;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export for backward compatibility
export default apiService;
