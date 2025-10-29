import { chromium, webkit, firefox, Browser, Page } from '@playwright/test'
import { POManager } from '../../pages/POManager'
import dotnet from "dotenv"
dotnet.config()

export interface CustomWorld {
  browser: Browser
  page: Page
  poManager: POManager
  attach: Function
}

export async function setupWorld(this: CustomWorld) {
    const desiredBrowser = process.env.BROWSER || 'chromium';
    const desiredHeadlessMode = process.env.HEADLESS === 'true';
    switch (desiredBrowser) {
        case 'chromium':
        case 'chrom':
        case 'chrome':
          this.browser = await chromium.launch({ headless: desiredHeadlessMode })
          break;
        case 'firefox':
        case 'ff':
          this.browser = await firefox.launch({ headless: desiredHeadlessMode })
          break;
        case 'webkit':
        case 'safari':
          this.browser = await webkit.launch({ headless: desiredHeadlessMode })
          break;
        default:
          throw new Error(`Unsupported browser type: ${desiredBrowser}`);
    }
  this.page = await this.browser.newPage()
}

export async function teardownWorld(this: CustomWorld) {
  if (this.browser) {
    await this.browser.close()
  }
}
