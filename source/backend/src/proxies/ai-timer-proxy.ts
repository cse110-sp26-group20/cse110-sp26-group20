export function createTimerLogProxy<T extends object>(
  targetInstance: T,
  loggerName: string
): T {
  return new Proxy(targetInstance, {
    get(target: T, prop: string | symbol, receiver: unknown) {
      // rebuild a class
      const originalMethod = Reflect.get(target, prop, receiver);

      // if it is not a function
      if (typeof originalMethod !== 'function') {
        return originalMethod;
      }

      return async function (...args: unknown[]) {
        const startTime = performance.now();
        const methodName = String(prop);
        console.log(`[START] [${loggerName}] ${methodName}`);

        try {
          const result = await originalMethod.apply(target, args);
          const duration = Math.round(performance.now() - startTime);
          console.log(
            `[SUCCESS] [${loggerName}] ${methodName} - time: ${duration}ms`
          );
          return result;
        } catch (error) {
          const duration = Math.round(performance.now() - startTime);
          console.error(
            `[ERROR] [${loggerName}] ${methodName} - time: ${duration}ms`
          );
          throw error;
        }
      };
    }
  });
}
