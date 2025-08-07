import { renderHook, waitFor } from '@testing-library/react';
import { useSystemStatus } from '../useSystemStatus';
import { mockApi } from '../../services/mockApi';

// Mock the mockApi
jest.mock('../../services/mockApi');

describe('useSystemStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns initial state', () => {
    const { result } = renderHook(() => useSystemStatus());
    
    expect(result.current.systemStatus).toEqual({
      database: false,
      github: false,
      agent20: false,
    });
  });

  test('fetches system status on mount', async () => {
    const mockSystemStatus = {
      database: true,
      github: true,
      agent20: true,
    };

    mockApi.getSystemStatus.mockResolvedValue(mockSystemStatus);

    const { result } = renderHook(() => useSystemStatus());

    await waitFor(() => {
      expect(result.current.systemStatus).toEqual(mockSystemStatus);
    });

    expect(mockApi.getSystemStatus).toHaveBeenCalledTimes(1);
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockApi.getSystemStatus.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useSystemStatus());

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching system status:', expect.any(Error));
    });

    // Should keep initial state on error
    expect(result.current.systemStatus).toEqual({
      database: false,
      github: false,
      agent20: false,
    });

    consoleSpy.mockRestore();
  });
});
