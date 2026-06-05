import { createTimerLogProxy } from '../proxies/ai-timer-proxy'; // 请替换为实际的路径

describe('createTimerLogProxy', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let performanceNowSpy: jest.SpyInstance;

  class MockService {
    public staticValue = 'Hello World';

    async successfulTask(input: string) {
      return `Result: ${input}`;
    }

    async failingTask() {
      throw new Error('Database connection failed');
    }
  }

  let proxyService: MockService;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    performanceNowSpy = jest.spyOn(performance, 'now');

    const service = new MockService();
    proxyService = createTimerLogProxy(service, 'TestLogger');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should log START and SUCCESS, calculate time, and return the correct result for successful executions', async () => {
    // Arrange: Simulate time passing (StartTime: 100.0ms, EndTime: 450.6ms)
    // Expected calculated duration: Math.round(450.6 - 100.0) = 351ms
    performanceNowSpy.mockReturnValueOnce(100.0).mockReturnValueOnce(450.6);

    // Act
    const result = await proxyService.successfulTask('Data');

    // Assert: Verify the original return value is preserved
    expect(result).toBe('Result: Data');

    // Assert: Verify logging behavior
    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      '[START] [TestLogger] successfulTask'
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      2,
      '[SUCCESS] [TestLogger] successfulTask - time: 351ms'
    );

    // Assert: Verify no error logs were triggered
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should log ERROR, calculate time, and re-throw the error for failed executions', async () => {
    // Arrange: Simulate time passing (StartTime: 200.0ms, EndTime: 245.2ms)
    // Expected calculated duration: Math.round(245.2 - 200.0) = 45ms
    performanceNowSpy.mockReturnValueOnce(200.0).mockReturnValueOnce(245.2);

    // Act & Assert: Verify the original error is successfully bubbled up
    await expect(proxyService.failingTask()).rejects.toThrow(
      'Database connection failed'
    );

    // Assert: Verify the START log was printed
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[START] [TestLogger] failingTask'
    );

    // Assert: Verify the ERROR log was properly caught and formatted
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[ERROR] [TestLogger] failingTask - time: 45ms'
    );
  });

  it('should bypass logging and return the value directly for non-function properties', () => {
    // Act: Access a string property
    const val = proxyService.staticValue;

    // Assert: Verify the value is retrieved correctly
    expect(val).toBe('Hello World');

    // Assert: Verify no AOP logging or time calculation was triggered
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(performanceNowSpy).not.toHaveBeenCalled();
  });
});
