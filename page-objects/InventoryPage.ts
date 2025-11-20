import { Locator, Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly page: Page;
  readonly inventoryList: Locator;
  readonly productLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.productLocator = page.locator('.inventory_item_name');
  }

  async verifyValidInventoryURL(): Promise<void> {
    const currentUrl = await this.getCurrentUrl();
    expect(currentUrl).toContain('/inventory.html');
  }

  async verifyInventoryList(): Promise<void> {
    await expect(this.inventoryList).toBeVisible();
  }

  async verifyProductIsDisplayed(productName: string): Promise<void> {
    const productLocator = this.productLocator.filter({ hasText: productName });
    await expect(productLocator).toBeVisible();
  }
}