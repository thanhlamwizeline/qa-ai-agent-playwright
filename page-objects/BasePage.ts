import { Page, test } from '@playwright/test';

/**
 * Base Page class that automatically wraps all methods in test.step()
 * This provides automatic step reporting without needing to manually call test.step
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    return this.createProxy();
  }

  /**
   * Creates a proxy that automatically wraps method calls in test.step
   * Step names will be in format: ClassName.methodName()
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createProxy(): any {
    return new Proxy(this, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get(target: any, prop: string | symbol) {
        const original = target[prop];

        // Skip wrapping for non-function properties, private methods, and constructor
        if (
          typeof original !== 'function' ||
          typeof prop === 'symbol' ||
          prop.startsWith('_') ||
          prop === 'constructor' ||
          prop === 'createProxy'
        ) {
          return original;
        }

        // Wrap the method in test.step
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return async function (this: any, ...args: any[]) {
          const className = target.constructor.name;

          // Format parameters for display in step name
          const formattedArgs = args.map(arg => {
            if (typeof arg === 'string') return `"${arg}"`;
            if (typeof arg === 'object') return JSON.stringify(arg);
            return String(arg);
          }).join(', ');

          const stepName = formattedArgs
            ? `Step: ${className}.${prop}(${formattedArgs})`
            : `Step: ${className}.${prop}()`;

          return await test.step(stepName, async () => {
            return await original.apply(this, args);
          });
        };
      }
    });
  }
}
