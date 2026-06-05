export function createTimerLogProxy<T extends object>(
  targetInstance: T,
  loggerName: string
): T {
  return new Proxy(targetInstance, {
    get(target: T, prop: string | symbol, receiver: unknown) {
      // rebuild a class
      const originalMethod = Reflect.get(target, prop, receiver);

      // Avoid breaking `instance.constructor` and common symbol-based introspection.
      if (prop === 'constructor' || typeof prop === 'symbol') {
        return originalMethod;
      }

      // if it is not a function
      if (typeof originalMethod !== 'function') {
        return originalMethod;
      }

      return function (...args: unknown[]) {
        const startTime = performance.now();
        const methodName = String(prop);
        console.log(`[START] [${loggerName}] ${methodName}`);

        try {
          const result = originalMethod.apply(receiver as T, args) as unknown;

          // Preserve sync return values while still timing async work.
          if (result && typeof (result as Promise<unknown>).then === 'function') {
            return (result as Promise<unknown>)
              .then(value => {
                const duration = Math.round(performance.now() - startTime);
                console.log(
                  `[SUCCESS] [${loggerName}] ${methodName} - time: ${duration}ms`
                );
                return value;
              })
              .catch(error => {
                const duration = Math.round(performance.now() - startTime);
                console.error(
                  `[ERROR] [${loggerName}] ${methodName} - time: ${duration}ms`
                );
                throw error;
              });
          }

          const duration = Math.round(performance.now() - startTime);
          console.log(
            `[SUCCESS] [${loggerName}] ${methodName} - time: ${duration}ms`
          );
          return result;
        } catch (error) {
          const duration = Math.round(performance.now() - startTime);
          console.error(`[ERROR] [${loggerName}] ${methodName} - time: ${duration}ms`);
          throw error;
        }
      };
    }
  });
}
