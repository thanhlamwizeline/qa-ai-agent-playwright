import { Locator, Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly inventoryList: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryList = page.locator('.inventory_list');
  }

  async verifyValidInventoryURL(): Promise<void> {
    const currentUrl = await this.getCurrentUrl();
    await expect(currentUrl).toContain('/inventory.html');
  }

  async verifyInventoryList(): Promise<void> {
    await expect(this.inventoryList).toBeVisible();
  }

  async verifyProductIsDisplayed(productName: string): Promise<void> {
    const productLocator = this.page.locator('.inventory_item_name').filter({ hasText: productName });
    await expect(productLocator).toBeVisible();
  }
}